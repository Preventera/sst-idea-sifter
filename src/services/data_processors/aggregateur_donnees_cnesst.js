/**
 * Service d'agrégation des données CNESST
 * 
 * Ce service fusionne, nettoie et agrège les données de lésions professionnelles
 * provenant des fichiers CSV de la CNESST (2018-2023) pour alimenter le contexte
 * sectoriel d'IGNITIA-XAI.
 */

import Papa from 'papaparse';
import { groupBy, mapValues, sortBy, countBy } from 'lodash';
import { categoriserLesion, grouperSiege, calculerNiveauRisque } from './utils/utils_categorisation';

/**
 * Fonction principale pour agréger les données CNESST
 * @param {Array} fichiers - Tableau d'objets contenant les fichiers CSV à traiter
 * @returns {Object} - Données agrégées et contexte sectoriel
 */
export async function aggregerDonneesCNESST(fichiers) {
  console.log("Début de l'agrégation des données CNESST...");
  
  // 1. Charger et fusionner les fichiers
  let toutesLesions = [];
  let statsAnnuelles = {};
  
  for (const fichier of fichiers) {
    const annee = extraireAnnee(fichier.nom);
    const donnees = await chargerFichierCSV(fichier.contenu);
    
    // Ajouter l'année comme attribut
    const donneesAvecAnnee = donnees.map(d => ({
      ...d,
      ANNEE: annee
    }));
    
    toutesLesions = [...toutesLesions, ...donneesAvecAnnee];
    statsAnnuelles[annee] = donnees.length;
  }
  
  console.log(`Total des lésions chargées: ${toutesLesions.length}`);
  console.log("Statistiques annuelles:", statsAnnuelles);
  
  // 2. Nettoyer et standardiser
  const donneesNettoyees = nettoyerDonnees(toutesLesions);
  
  // 3. Créer les variables dérivées
  const donneesEnrichies = enrichirDonnees(donneesNettoyees);
  
  // 4. Générer les agrégations
  const resultats = {
    global: aggregerGlobal(donneesEnrichies),
    parSecteur: aggregerParSecteur(donneesEnrichies),
    secteurConstruction: extractionSecteurConstruction(donneesEnrichies),
    tendancesAnnuelles: calculerTendances(donneesEnrichies),
    profilDemographique: analyserDemographie(donneesEnrichies)
  };
  
  // 5. Générer le contexte sectoriel pour IGNITIA-XAI
  const contexteSectoriel = genererContexteSectoriel(resultats.secteurConstruction);
  
  return {
    donneesCompletes: donneesEnrichies,
    resultatsAggregation: resultats,
    contexteSectoriel
  };
}

/**
 * Extrait l'année du nom de fichier
 * @param {string} nomFichier - Nom du fichier (ex: "lesions2023 3.csv")
 * @returns {number|null} - Année extraite ou null
 */
function extraireAnnee(nomFichier) {
  const match = nomFichier.match(/lesions(\d{4})/);
  return match ? parseInt(match[1]) : null;
}

/**
 * Charge un fichier CSV à l'aide de Papaparse
 * @param {string} contenu - Contenu du fichier CSV
 * @returns {Promise<Array>} - Données parsées
 */
async function chargerFichierCSV(contenu) {
  return new Promise((resolve) => {
    Papa.parse(contenu, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      delimitersToGuess: [',', '\t', '|', ';'],
      complete: (results) => {
        resolve(results.data);
      }
    });
  });
}

/**
 * Nettoie et standardise les données
 * @param {Array} donnees - Données brutes
 * @returns {Array} - Données nettoyées
 */
function nettoyerDonnees(donnees) {
  return donnees.map(lesion => {
    // Standardiser les champs textuels
    const standardized = {};
    
    for (const [key, value] of Object.entries(lesion)) {
      if (typeof value === 'string') {
        standardized[key] = value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      } else {
        standardized[key] = value;
      }
    }
    
    return standardized;
  }).filter(lesion => lesion.ID && lesion.SECTEUR_SCIAN); // Filtrer les entrées invalides
}

/**
 * Enrichit les données avec des variables dérivées
 * @param {Array} donnees - Données nettoyées
 * @returns {Array} - Données enrichies
 */
function enrichirDonnees(donnees) {
  return donnees.map(lesion => {
    // Créer des catégories simplifiées
    const categorieLesion = categoriserLesion(lesion.NATURE_LESION);
    const groupeSiege = grouperSiege(lesion.SIEGE_LESION);
    const niveauRisque = calculerNiveauRisque(lesion);
    
    return {
      ...lesion,
      CATEGORIE_LESION: categorieLesion,
      GROUPE_SIEGE: groupeSiege,
      NIVEAU_RISQUE: niveauRisque
    };
  });
}

/**
 * Agrège les données globales
 * @param {Array} donnees - Données enrichies
 * @returns {Object} - Statistiques globales
 */
function aggregerGlobal(donnees) {
  return {
    totalLesions: donnees.length,
    distributionAnnees: countBy(donnees, 'ANNEE'),
    distributionCategories: countBy(donnees, 'CATEGORIE_LESION'),
    distributionSieges: countBy(donnees, 'GROUPE_SIEGE'),
    tauxTMS: donnees.filter(l => l.IND_LESION_TMS === 'O').length / donnees.length,
    tauxPSY: donnees.filter(l => l.IND_LESION_PSY === 'O').length / donnees.length
  };
}

/**
 * Agrège les données par secteur SCIAN
 * @param {Array} donnees - Données enrichies
 * @returns {Object} - Agrégations par secteur
 */
function aggregerParSecteur(donnees) {
  const parSecteur = groupBy(donnees, 'SECTEUR_SCIAN');
  
  return mapValues(parSecteur, lesionsSecteur => ({
    total: lesionsSecteur.length,
    categoriesTop: calculerTop(lesionsSecteur, 'CATEGORIE_LESION', 5),
    siegesTop: calculerTop(lesionsSecteur, 'GROUPE_SIEGE', 3),
    tauxTMS: lesionsSecteur.filter(l => l.IND_LESION_TMS === 'O').length / lesionsSecteur.length,
    tauxPSY: lesionsSecteur.filter(l => l.IND_LESION_PSY === 'O').length / lesionsSecteur.length,
    niveauRisqueMoyen: lesionsSecteur.reduce((sum, l) => sum + l.NIVEAU_RISQUE, 0) / lesionsSecteur.length
  }));
}

/**
 * Extraction détaillée pour le secteur Construction (SCIAN 23)
 * @param {Array} donnees - Données enrichies
 * @returns {Object} - Données détaillées du secteur Construction
 */
function extractionSecteurConstruction(donnees) {
  const donneesConstruction = donnees.filter(l => l.SECTEUR_SCIAN === '23');
  
  return {
    total: donneesConstruction.length,
    distribution: {
      parAnnee: groupBy(donneesConstruction, 'ANNEE'),
      parCategorie: groupBy(donneesConstruction, 'CATEGORIE_LESION'),
      parSiege: groupBy(donneesConstruction, 'GROUPE_SIEGE'),
      parAgentCausal: groupBy(donneesConstruction, 'AGENT_CAUSAL_LESION'),
      parAge: groupBy(donneesConstruction, 'GROUPE_AGE'),
      parSexe: groupBy(donneesConstruction, 'SEXE_PERS_PHYS')
    },
    top5Categories: calculerTop(donneesConstruction, 'CATEGORIE_LESION', 5),
    top3Sieges: calculerTop(donneesConstruction, 'GROUPE_SIEGE', 3),
    top5AgentsCausaux: calculerTop(donneesConstruction, 'AGENT_CAUSAL_LESION', 5),
    indicateurs: {
      tauxTMS: donneesConstruction.filter(l => l.IND_LESION_TMS === 'O').length / donneesConstruction.length,
      tauxPSY: donneesConstruction.filter(l => l.IND_LESION_PSY === 'O').length / donneesConstruction.length,
      tauxMachine: donneesConstruction.filter(l => l.IND_LESION_MACHINE === 'O').length / donneesConstruction.length,
      tauxSurdite: donneesConstruction.filter(l => l.IND_LESION_SURDITE === 'O').length / donneesConstruction.length
    }
  };
}

/**
 * Calcule les éléments les plus fréquents pour un champ donné
 * @param {Array} donnees - Données à analyser
 * @param {string} champ - Champ à analyser
 * @param {number} nombre - Nombre d'éléments à retourner
 * @returns {Array} - Top N éléments
 */
function calculerTop(donnees, champ, nombre) {
  const groupes = groupBy(donnees, champ);
  
  return Object.entries(groupes)
    .map(([valeur, items]) => ({
      valeur,
      count: items.length,
      pourcentage: items.length / donnees.length * 100
    }))
    .filter(item => item.valeur && item.valeur !== 'null' && item.valeur !== 'Non specifie')
    .sort((a, b) => b.count - a.count)
    .slice(0, nombre);
}

/**
 * Calcule les tendances annuelles
 * @param {Array} donnees - Données enrichies
 * @returns {Array} - Tendances annuelles
 */
function calculerTendances(donnees) {
  const parAnnee = groupBy(donnees, 'ANNEE');
  const annees = Object.keys(parAnnee).sort();
  
  const tendances = [];
  
  for (let i = 1; i < annees.length; i++) {
    const anneeActuelle = annees[i];
    const anneePrecedente = annees[i-1];
    
    const donneesActuelles = parAnnee[anneeActuelle];
    const donneesPrecedentes = parAnnee[anneePrecedente];
    
    const variation = (donneesActuelles.length - donneesPrecedentes.length) / donneesPrecedentes.length * 100;
    
    tendances.push({
      annee: anneeActuelle,
      total: donneesActuelles.length,
      variationPourcentage: variation,
      indicateurs: {
        tauxTMS: {
          actuel: donneesActuelles.filter(l => l.IND_LESION_TMS === 'O').length / donneesActuelles.length,
          precedent: donneesPrecedentes.filter(l => l.IND_LESION_TMS === 'O').length / donneesPrecedentes.length
        },
        tauxPSY: {
          actuel: donneesActuelles.filter(l => l.IND_LESION_PSY === 'O').length / donneesActuelles.length,
          precedent: donneesPrecedentes.filter(l => l.IND_LESION_PSY === 'O').length / donneesPrecedentes.length
        }
      }
    });
  }
  
  return tendances;
}

/**
 * Analyse la distribution démographique
 * @param {Array} donnees - Données enrichies
 * @returns {Object} - Analyses démographiques
 */
function analyserDemographie(donnees) {
  return {
    parSexe: groupBy(donnees, 'SEXE_PERS_PHYS'),
    parAge: groupBy(donnees, 'GROUPE_AGE'),
    croisementSexeAge: mapValues(groupBy(donnees, 'SEXE_PERS_PHYS'), 
                              donneesSexe => groupBy(donneesSexe, 'GROUPE_AGE'))
  };
}

/**
 * Génère le contexte sectoriel pour l'interface IGNITIA-XAI
 * @param {Object} donneesConstruction - Données du secteur construction
 * @returns {Object} - Contexte sectoriel formaté
 */
function genererContexteSectoriel(donneesConstruction) {
  const risques = donneesConstruction.top5Categories.map(cat => ({
    type: cat.valeur,
    pourcentage: Math.round(cat.pourcentage)
  }));
  
  const agentsCausaux = donneesConstruction.top5AgentsCausaux
    .filter(agent => agent.valeur && agent.valeur !== 'null' && agent.valeur !== 'Non spécifié')
    .map(agent => ({
      type: agent.valeur,
      pourcentage: Math.round(agent.pourcentage)
    }));
  
  const populationARisque = [];
  
  // Identifier le groupe d'âge à risque
  const groupesAge = donneesConstruction.distribution.parAge;
  let groupeAgeMajoritaire = { groupe: 'Non spécifié', pourcentage: 0 };
  
  for (const [groupe, lesions] of Object.entries(groupesAge)) {
    if (groupe && groupe !== 'null') {
      const pourcentage = lesions.length / donneesConstruction.total * 100;
      if (pourcentage > groupeAgeMajoritaire.pourcentage) {
        groupeAgeMajoritaire = { groupe, pourcentage };
      }
    }
  }
  
  if (groupeAgeMajoritaire.groupe !== 'Non spécifié') {
    populationARisque.push({
      description: `Travailleurs ${groupeAgeMajoritaire.groupe}`,
      pourcentage: Math.round(groupeAgeMajoritaire.pourcentage)
    });
  }
  
  // Identifier la distribution par sexe
  const distributionSexe = donneesConstruction.distribution.parSexe;
  const totalHommes = (distributionSexe['M'] || []).length;
  const pourcentageHommes = totalHommes / donneesConstruction.total * 100;
  
  populationARisque.push({
    description: 'Personnel masculin',
    pourcentage: Math.round(pourcentageHommes)
  });
  
  // Déterminer tendance sur 5 ans si disponible
  let tendance = null;
  const annees = Object.keys(donneesConstruction.distribution.parAnnee).sort();
  if (annees.length >= 2) {
    const premiereAnnee = annees[0];
    const derniereAnnee = annees[annees.length - 1];
    const donneesPremiereAnnee = donneesConstruction.distribution.parAnnee[premiereAnnee];
    const donneesDerniereAnnee = donneesConstruction.distribution.parAnnee[derniereAnnee];
    
    if (donneesPremiereAnnee && donneesDerniereAnnee) {
      const variation = (donneesDerniereAnnee.length - donneesPremiereAnnee.length) / donneesPremiereAnnee.length * 100;
      
      tendance = {
        variationTotale: Math.round(variation),
        variationPsy: calculerVariationIndicateur(donneesPremiereAnnee, donneesDerniereAnnee, 'IND_LESION_PSY', 'O')
      };
    }
  }
  
  return {
    secteur: "SCIAN 23 - Construction",
    risquesPrincipaux: risques,
    agentsCausauxDominants: agentsCausaux,
    populationARisque: populationARisque,
    indicateurs: donneesConstruction.indicateurs,
    tendance,
    opportunitesIA: [
      "Systèmes de vision pour détection précoce de situations à risque de chute",
      "Détection de fatigue par analyse posturale",
      "Prédiction personnalisée des risques TMS"
    ]
  };
}

/**
 * Calcule la variation d'un indicateur entre deux périodes
 * @param {Array} donneesPrecedentes - Données de la période précédente
 * @param {Array} donneesActuelles - Données de la période actuelle
 * @param {string} indicateur - Nom de l'indicateur à calculer
 * @param {string} valeurPositive - Valeur considérée comme positive
 * @returns {number} - Variation en pourcentage
 */
function calculerVariationIndicateur(donneesPrecedentes, donneesActuelles, indicateur, valeurPositive) {
  const tauxPrecedent = donneesPrecedentes.filter(d => d[indicateur] === valeurPositive).length / donneesPrecedentes.length;
  const tauxActuel = donneesActuelles.filter(d => d[indicateur] === valeurPositive).length / donneesActuelles.length;
  
  return Math.round((tauxActuel - tauxPrecedent) / tauxPrecedent * 100);
}