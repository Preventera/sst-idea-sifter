/**
 * Utilitaires de catégorisation pour les données CNESST
 * 
 * Ce module fournit des fonctions pour catégoriser les lésions,
 * regrouper les sièges de lésion et calculer les niveaux de risque.
 */

/**
 * Catégorise une lésion selon sa nature
 * @param {string} natureLesion - Nature de la lésion (NATURE_LESION)
 * @returns {string} - Catégorie de lésion
 */
export function categoriserLesion(natureLesion) {
  if (!natureLesion) return 'Non spécifié';
  
  const natureLower = String(natureLesion).toLowerCase();
  
  // Fractures
  if (natureLower.includes('fracture') || 
      natureLower.includes('cassure') || 
      natureLower.includes('bris osseux')) {
    return 'Fracture';
  }
  
  // Entorses et foulures
  if (natureLower.includes('entorse') || 
      natureLower.includes('foulure') || 
      natureLower.includes('élongation') ||
      natureLower.includes('élongation') ||
      natureLower.includes('tendinite')) {
    return 'Entorse/Foulure';
  }
  
  // Contusions
  if (natureLower.includes('contusion') || 
      natureLower.includes('ecchymose') || 
      natureLower.includes('bleu') ||
      natureLower.includes('hématome')) {
    return 'Contusion';
  }
  
  // Coupures et lacérations
  if (natureLower.includes('coupure') || 
      natureLower.includes('lacération') || 
      natureLower.includes('plaie') ||
      natureLower.includes('incision') ||
      natureLower.includes('égratignure')) {
    return 'Coupure';
  }
  
  // Brûlures
  if (natureLower.includes('brûlure') || 
      natureLower.includes('brulure') || 
      natureLower.includes('échaudure')) {
    return 'Brûlure';
  }
  
  // Lésions psychologiques
  if (natureLower.includes('psycho') || 
      natureLower.includes('stress') || 
      natureLower.includes('anxiété') ||
      natureLower.includes('dépression') ||
      natureLower.includes('épuisement')) {
    return 'Psychologique';
  }
  
  // Amputations
  if (natureLower.includes('amputation') || 
      natureLower.includes('sectionnement')) {
    return 'Amputation';
  }
  
  // Commotions
  if (natureLower.includes('commotion') || 
      natureLower.includes('traumatisme crânien')) {
    return 'Commotion';
  }
  
  // Troubles musculosquelettiques
  if (natureLower.includes('tms') || 
      natureLower.includes('musculosquelettique') ||
      natureLower.includes('arthrite') ||
      natureLower.includes('syndrome du canal carpien')) {
    return 'TMS';
  }
  
  // Intoxications
  if (natureLower.includes('intoxication') || 
      natureLower.includes('empoisonnement') ||
      natureLower.includes('exposition chimique')) {
    return 'Intoxication';
  }
  
  return 'Autre';
}

/**
 * Regroupe les sièges de lésion en catégories
 * @param {string} siegeLesion - Siège de la lésion (SIEGE_LESION)
 * @returns {string} - Groupe de siège de lésion
 */
export function grouperSiege(siegeLesion) {
  if (!siegeLesion) return 'Non spécifié';
  
  const siegeLower = String(siegeLesion).toLowerCase();
  
  // Tête et cou
  if (siegeLower.includes('tête') || 
      siegeLower.includes('tete') || 
      siegeLower.includes('crâne') ||
      siegeLower.includes('crane') ||
      siegeLower.includes('cou') ||
      siegeLower.includes('visage') ||
      siegeLower.includes('œil') ||
      siegeLower.includes('oeil') ||
      siegeLower.includes('yeux') ||
      siegeLower.includes('oreille') ||
      siegeLower.includes('bouche') ||
      siegeLower.includes('cervical')) {
    return 'Tête et cou';
  }
  
  // Dos
  if (siegeLower.includes('dos') || 
      siegeLower.includes('colonne') ||
      siegeLower.includes('vertèbre') ||
      siegeLower.includes('vertebre') ||
      siegeLower.includes('lombaire') ||
      siegeLower.includes('rachis')) {
    return 'Dos';
  }
  
  // Membres supérieurs
  if (siegeLower.includes('bras') || 
      siegeLower.includes('main') ||
      siegeLower.includes('doigt') ||
      siegeLower.includes('poignet') ||
      siegeLower.includes('coude') ||
      siegeLower.includes('épaule') ||
      siegeLower.includes('epaule') ||
      siegeLower.includes('avant-bras') ||
      siegeLower.includes('pouce')) {
    return 'Membres supérieurs';
  }
  
  // Membres inférieurs
  if (siegeLower.includes('jambe') || 
      siegeLower.includes('pied') ||
      siegeLower.includes('genou') ||
      siegeLower.includes('cheville') ||
      siegeLower.includes('cuisse') ||
      siegeLower.includes('orteil') ||
      siegeLower.includes('hanche')) {
    return 'Membres inférieurs';
  }
  
  // Tronc
  if (siegeLower.includes('tronc') || 
      siegeLower.includes('abdomen') ||
      siegeLower.includes('thorax') ||
      siegeLower.includes('poitrine') ||
      siegeLower.includes('côte') ||
      siegeLower.includes('cote') ||
      siegeLower.includes('bassin') ||
      siegeLower.includes('pelvien') ||
      siegeLower.includes('sternum')) {
    return 'Tronc';
  }
  
  // Systémiques et internes
  if (siegeLower.includes('système') || 
      siegeLower.includes('systeme') ||
      siegeLower.includes('organe') ||
      siegeLower.includes('interne') ||
      siegeLower.includes('poumon') ||
      siegeLower.includes('cœur') ||
      siegeLower.includes('coeur') ||
      siegeLower.includes('sang') ||
      siegeLower.includes('digestif')) {
    return 'Systémique/Interne';
  }
  
  // Psychologique
  if (siegeLower.includes('psycho') || 
      siegeLower.includes('mental') ||
      siegeLower.includes('stress') ||
      siegeLower.includes('cérébral')) {
    return 'Psychologique';
  }
  
  // Multiple
  if (siegeLower.includes('multiple') || 
      siegeLower.includes('plusieurs')) {
    return 'Multiples sites';
  }
  
  return 'Autre';
}

/**
 * Calcule un niveau de risque basé sur différents indicateurs
 * @param {Object} lesion - Objet représentant une lésion
 * @returns {number} - Niveau de risque (1-5)
 */
export function calculerNiveauRisque(lesion) {
  let score = 1; // Score de base
  
  // Augmenter le score en fonction des indicateurs
  if (lesion.IND_LESION_TMS === 'O') score += 1;
  if (lesion.IND_LESION_MACHINE === 'O') score += 1;
  if (lesion.IND_LESION_PSY === 'O') score += 1;
  if (lesion.IND_LESION_SURDITE === 'O') score += 1;
  
  // Logique additionnelle basée sur la nature de la lésion
  const natureLower = String(lesion.NATURE_LESION || '').toLowerCase();
  
  // Lésions graves
  if (natureLower.includes('fracture') || 
      natureLower.includes('amputation') ||
      natureLower.includes('commotion') ||
      natureLower.includes('traumatisme crânien')) {
    score += 1;
  }
  
  // Lésions mortelles ou avec séquelles permanentes
  if (natureLower.includes('décès') || 
      natureLower.includes('deces') ||
      natureLower.includes('fatal') ||
      natureLower.includes('mortel') ||
      natureLower.includes('permanent')) {
    score += 2;
  }
  
  // Limiter le score à 5
  return Math.min(score, 5);
}

/**
 * Détermine si une lésion est considérée comme grave
 * @param {Object} lesion - Objet représentant une lésion
 * @returns {boolean} - True si la lésion est grave
 */
export function estLesionGrave(lesion) {
  // Une lésion est considérée comme grave si son niveau de risque est de 4 ou 5
  return calculerNiveauRisque(lesion) >= 4;
}

/**
 * Identifie les opportunités d'intervention IA basées sur une collection de lésions
 * @param {Array} lesions - Collection de lésions
 * @returns {Array} - Opportunités d'intervention IA identifiées
 */
export function identifierOpportunitesIA(lesions) {
  // Structure pour compter les occurrences
  const comptage = {
    categoriesLesion: {},
    siegesLesion: {},
    agentsCausaux: {},
    secteurs: {}
  };
  
  // Compter les occurrences
  lesions.forEach(lesion => {
    const categorie = categoriserLesion(lesion.NATURE_LESION);
    const siege = grouperSiege(lesion.SIEGE_LESION);
    const agent = lesion.AGENT_CAUSAL_LESION || 'Non spécifié';
    const secteur = lesion.SECTEUR_SCIAN || 'Non spécifié';
    
    comptage.categoriesLesion[categorie] = (comptage.categoriesLesion[categorie] || 0) + 1;
    comptage.siegesLesion[siege] = (comptage.siegesLesion[siege] || 0) + 1;
    comptage.agentsCausaux[agent] = (comptage.agentsCausaux[agent] || 0) + 1;
    comptage.secteurs[secteur] = (comptage.secteurs[secteur] || 0) + 1;
  });
  
  // Trier pour obtenir les plus fréquents
  const categoriesFrequentes = Object.entries(comptage.categoriesLesion)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  const siegesFrequents = Object.entries(comptage.siegesLesion)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  const agentsCausauxFrequents = Object.entries(comptage.agentsCausaux)
    .filter(([agent]) => agent !== 'Non spécifié' && agent !== 'null')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  // Générer des opportunités d'intervention IA
  const opportunites = [];
  
  // Opportunité basée sur les catégories de lésion
  if (categoriesFrequentes.length > 0) {
    const [categorieTop] = categoriesFrequentes[0];
    
    if (categorieTop === 'TMS' || categorieTop === 'Entorse/Foulure') {
      opportunites.push("Système IA de détection de postures à risque pour prévenir les TMS");
    } else if (categorieTop === 'Fracture' || categorieTop === 'Contusion') {
      opportunites.push("IA de prévention des chutes et impacts par analyse vidéo des environnements de travail");
    } else if (categorieTop === 'Coupure') {
      opportunites.push("Système de détection des manipulations dangereuses d'outils tranchants");
    } else if (categorieTop === 'Psychologique') {
      opportunites.push("IA d'analyse des signaux de stress et fatigue pour prévention des risques psychosociaux");
    }
  }
  
  // Opportunité basée sur les agents causaux
  if (agentsCausauxFrequents.length > 0) {
    const [agentTop] = agentsCausauxFrequents[0];
    
    opportunites.push(`Détection IA des situations à risque impliquant ${agentTop}`);
  }
  
  // Opportunité générique basée sur les données démographiques
  const tauxTMS = lesions.filter(l => l.IND_LESION_TMS === 'O').length / lesions.length;
  if (tauxTMS > 0.2) {
    opportunites.push("Prédiction personnalisée des risques TMS par analyse des données biométriques");
  }
  
  return opportunites;
}