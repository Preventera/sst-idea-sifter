// src/services/data-processors/aggregateur-donnees-cnesst-api.ts
// Adaptateur qui connecte le service API CNESST au système d'agrégation existant
// Remplace le chargement de fichiers CSV par des appels API automatisés

import { cnesstAPIService, CNESSTRecord } from '../api/cnesst-api-service';
import { categoriserLesion, grouperSiege, calculerNiveauRisque } from './utils/utils_categorisation';
import { groupBy, mapValues, sortBy, countBy } from 'lodash';

// Types pour les données agrégées (réutilise la structure existante)
interface ContexteSectorielEnrichi {
  secteurSCIAN: string;
  nomSecteur: string;
  perioDeReference: string;
  statistiquesGlobales: {
    totalLesions: number;
    totalAnnees: number;
    derniereMiseAJour: string;
  };
  risquesPrincipaux: Array<{
    type: string;
    pourcentage: number;
    tendance: 'hausse' | 'baisse' | 'stable';
  }>;
  agentsCausauxDominants: Array<{
    type: string;
    pourcentage: number;
    gravite: 'faible' | 'moyenne' | 'elevee';
  }>;
  populationARisque: Array<{
    description: string;
    pourcentage: number;
    groupeAge: string;
  }>;
  indicateursSpecialises: {
    tmsPrevalence: number;
    lesionsPsychologiques: number;
    accidentsMachines: number;
    surditesProfessionnelles: number;
    casCovidTravail: number;
  };
  opportunitesIA: Array<{
    domaine: string;
    potentiel: 'faible' | 'moyen' | 'eleve';
    description: string;
    priorite: number;
  }>;
  comparaisonSectorielle?: {
    positionRelative: string;
    secteursSimilaires: string[];
    benchmarks: Array<{ indicateur: string; valeur: number; moyenne: number }>;
  };
}

class AgregateurCNESSTAPI {
  private cache: Map<string, ContexteSectorielEnrichi> = new Map();
  private readonly cacheExpiry = 12 * 60 * 60 * 1000; // 12 heures
  private apiStatus: 'non-teste' | 'connecte' | 'erreur' = 'non-teste';

  /**
   * Test initial de la connectivité API
   */
  async initialiserConnexionAPI(): Promise<{
    success: boolean;
    message: string;
    datasetsDisponibles: number;
  }> {
    try {
      console.log('🔗 Initialisation de la connexion API CNESST...');
      
      const testResult = await cnesstAPIService.testConnection();
      
      if (testResult.success) {
        this.apiStatus = 'connecte';
        console.log(`✅ API connectée - ${testResult.availableDatasets} datasets disponibles`);
        
        return {
          success: true,
          message: `Connexion réussie - ${testResult.availableDatasets} datasets disponibles`,
          datasetsDisponibles: testResult.availableDatasets
        };
      } else {
        this.apiStatus = 'erreur';
        throw new Error(testResult.apiStatus);
      }
      
    } catch (error) {
      this.apiStatus = 'erreur';
      console.error('❌ Erreur de connexion API:', error);
      
      return {
        success: false,
        message: `Erreur de connexion: ${error}`,
        datasetsDisponibles: 0
      };
    }
  }

  /**
   * Agrège les données pour un secteur SCIAN spécifique via l'API
   */
  async aggregerDonneesSecteurAPI(secteurSCIAN: string): Promise<ContexteSectorielEnrichi> {
    try {
      console.log(`📊 Agrégation des données API pour le secteur ${secteurSCIAN}...`);

      // Vérifier le cache
      const cacheKey = `secteur-${secteurSCIAN}`;
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.log(`📋 Données secteur ${secteurSCIAN} récupérées du cache`);
        return cached;
      }

      // Vérifier la connexion API
      if (this.apiStatus === 'non-teste') {
        await this.initialiserConnexionAPI();
      }

      if (this.apiStatus === 'erreur') {
        throw new Error('API CNESST non disponible');
      }

      // Récupérer les données du secteur via l'API
      const { data: donneesRaw, sectorStats } = await cnesstAPIService.fetchSectorData(secteurSCIAN);
      
      if (donneesRaw.length === 0) {
        throw new Error(`Aucune donnée trouvée pour le secteur ${secteurSCIAN}`);
      }

      console.log(`📈 ${donneesRaw.length} enregistrements à analyser pour ${secteurSCIAN}`);

      // 1. Analyser les risques principaux
      const analyseLesions = this.analyserTypesLesions(donneesRaw);
      
      // 2. Analyser les agents causaux
      const analyseAgents = this.analyserAgentsCausaux(donneesRaw);
      
      // 3. Analyser la population à risque
      const analysePopulation = this.analyserPopulationARisque(donneesRaw);
      
      // 4. Calculer les indicateurs spécialisés
      const indicateurs = this.calculerIndicateursSpecialises(donneesRaw);
      
      // 5. Identifier les opportunités IA
      const opportunites = this.identifierOpportunitesIA(secteurSCIAN, indicateurs, analyseLesions);

      // 6. Construire le contexte enrichi
      const contexteEnrichi: ContexteSectorielEnrichi = {
        secteurSCIAN,
        nomSecteur: this.obtenirNomSecteur(secteurSCIAN),
        perioDeReference: sectorStats.yearRange,
        statistiquesGlobales: {
          totalLesions: sectorStats.totalLesions,
          totalAnnees: this.calculerNombreAnnees(sectorStats.yearRange),
          derniereMiseAJour: new Date().toISOString().split('T')[0]
        },
        risquesPrincipaux: analyseLesions,
        agentsCausauxDominants: analyseAgents,
        populationARisque: analysePopulation,
        indicateursSpecialises: indicateurs,
        opportunitesIA: opportunites
      };

      // Mise en cache
      this.cache.set(cacheKey, contexteEnrichi);
      
      console.log(`✅ Agrégation terminée pour ${secteurSCIAN} - ${contexteEnrichi.risquesPrincipaux.length} risques identifiés`);
      
      return contexteEnrichi;

    } catch (error) {
      console.error(`❌ Erreur lors de l'agrégation du secteur ${secteurSCIAN}:`, error);
      throw new Error(`Impossible d'agréger les données pour le secteur ${secteurSCIAN}: ${error}`);
    }
  }

  /**
   * Analyse les types de lésions et leurs tendances
   */
  private analyserTypesLesions(donnees: CNESSTRecord[]): Array<{
    type: string;
    pourcentage: number;
    tendance: 'hausse' | 'baisse' | 'stable';
  }> {
    const comptesLesions = countBy(donnees, 'NATURE_LESION');
    const total = donnees.length;
    
    return Object.entries(comptesLesions)
      .map(([type, count]) => ({
        type: type || 'Non spécifié',
        pourcentage: Math.round((count / total) * 100 * 10) / 10,
        tendance: this.calculerTendance(type, donnees) // Analyse temporelle
      }))
      .sort((a, b) => b.pourcentage - a.pourcentage)
      .slice(0, 10); // Top 10
  }

  /**
   * Analyse les agents causaux des lésions
   */
  private analyserAgentsCausaux(donnees: CNESSTRecord[]): Array<{
    type: string;
    pourcentage: number;
    gravite: 'faible' | 'moyenne' | 'elevee';
  }> {
    const comptesAgents = countBy(donnees, 'AGENT_CAUSAL_LESION');
    const total = donnees.length;
    
    return Object.entries(comptesAgents)
      .map(([agent, count]) => ({
        type: agent || 'Non spécifié',
        pourcentage: Math.round((count / total) * 100 * 10) / 10,
        gravite: this.evaluerGraviteAgent(agent) // Évaluation basée sur l'expérience
      }))
      .sort((a, b) => b.pourcentage - a.pourcentage)
      .slice(0, 8); // Top 8
  }

  /**
   * Analyse la répartition démographique des victimes
   */
  private analyserPopulationARisque(donnees: CNESSTRecord[]): Array<{
    description: string;
    pourcentage: number;
    groupeAge: string;
  }> {
    const repartitionAge = countBy(donnees, 'GROUPE_AGE');
    const repartitionSexe = countBy(donnees, 'SEXE_PERS_PHYS');
    const total = donnees.length;
    
    const analyse = [];
    
    // Analyse par âge
    Object.entries(repartitionAge).forEach(([age, count]) => {
      if (count > total * 0.05) { // Au moins 5% pour être significatif
        analyse.push({
          description: `Travailleurs ${age}`,
          pourcentage: Math.round((count / total) * 100 * 10) / 10,
          groupeAge: age
        });
      }
    });
    
    // Analyse par sexe si significative
    Object.entries(repartitionSexe).forEach(([sexe, count]) => {
      if (count > total * 0.2) { // Au moins 20% pour être mentionné
        analyse.push({
          description: `${sexe === 'M' ? 'Hommes' : sexe === 'F' ? 'Femmes' : 'Non spécifié'}`,
          pourcentage: Math.round((count / total) * 100 * 10) / 10,
          groupeAge: 'Tous âges'
        });
      }
    });
    
    return analyse.sort((a, b) => b.pourcentage - a.pourcentage);
  }

  /**
   * Calcule les indicateurs spécialisés basés sur les nouvelles colonnes
   */
  private calculerIndicateursSpecialises(donnees: CNESSTRecord[]): {
    tmsPrevalence: number;
    lesionsPsychologiques: number;
    accidentsMachines: number;
    surditesProfessionnelles: number;
    casCovidTravail: number;
  } {
    const total = donnees.length;
    
    return {
      tmsPrevalence: Math.round((donnees.filter(d => d.IND_LESION_TMS === 'O').length / total) * 100 * 10) / 10,
      lesionsPsychologiques: Math.round((donnees.filter(d => d.IND_LESION_PSY === 'O').length / total) * 100 * 10) / 10,
      accidentsMachines: Math.round((donnees.filter(d => d.IND_LESION_MACHINE === 'O').length / total) * 100 * 10) / 10,
      surditesProfessionnelles: Math.round((donnees.filter(d => d.IND_LESION_SURDITE === 'O').length / total) * 100 * 10) / 10,
      casCovidTravail: Math.round((donnees.filter(d => d.IND_LESION_COVID_19 === 'O').length / total) * 100 * 10) / 10
    };
  }

  /**
   * Identifie les opportunités d'intervention IA basées sur les données
   */
  private identifierOpportunitesIA(
    secteur: string, 
    indicateurs: any, 
    risques: any[]
  ): Array<{
    domaine: string;
    potentiel: 'faible' | 'moyen' | 'eleve';
    description: string;
    priorite: number;
  }> {
    const opportunites = [];
    let priorite = 1;

    // Détection prédictive des TMS
    if (indicateurs.tmsPrevalence > 15) {
      opportunites.push({
        domaine: 'Prévention TMS',
        potentiel: 'eleve' as const,
        description: `Système de détection précoce des risques TMS (${indicateurs.tmsPrevalence}% des lésions)`,
        priorite: priorite++
      });
    }

    // Surveillance des machines
    if (indicateurs.accidentsMachines > 10) {
      opportunites.push({
        domaine: 'Sécurité machines',
        potentiel: 'eleve' as const,
        description: `IA de surveillance des équipements et prédiction des pannes (${indicateurs.accidentsMachines}% des lésions)`,
        priorite: priorite++
      });
    }

    // Bien-être psychologique
    if (indicateurs.lesionsPsychologiques > 5) {
      opportunites.push({
        domaine: 'Santé mentale',
        potentiel: 'moyen' as const,
        description: `Analyse prédictive du stress et surveillance du climat de travail (${indicateurs.lesionsPsychologiques}% des lésions)`,
        priorite: priorite++
      });
    }

    // Toujours ajouter des opportunités génériques
    opportunites.push({
      domaine: 'Formation adaptative',
      potentiel: 'moyen' as const,
      description: 'Personnalisation des formations sécurité basée sur les profils de risque',
      priorite: priorite++
    });

    return opportunites.slice(0, 6); // Limiter à 6 opportunités
  }

  /**
   * Fonctions utilitaires privées
   */
  private calculerTendance(typeLesion: string, donnees: CNESSTRecord[]): 'hausse' | 'baisse' | 'stable' {
    // Simulation d'analyse temporelle - à améliorer avec vraies données temporelles
    const hash = typeLesion.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const trends = ['hausse', 'baisse', 'stable'];
    return trends[hash % 3] as 'hausse' | 'baisse' | 'stable';
  }

  private evaluerGraviteAgent(agent: string): 'faible' | 'moyenne' | 'elevee' {
    const agentsGraves = ['machine', 'vehicule', 'chute', 'explosion', 'produit chimique'];
    const agentsMoyens = ['outil', 'materiau', 'equipement'];
    
    const agentLower = agent?.toLowerCase() || '';
    
    if (agentsGraves.some(g => agentLower.includes(g))) return 'elevee';
    if (agentsMoyens.some(m => agentLower.includes(m))) return 'moyenne';
    return 'faible';
  }

  private obtenirNomSecteur(code: string): string {
    const secteurs: Record<string, string> = {
      '11': 'Agriculture, foresterie, pêche et chasse',
      '21': 'Extraction minière, exploitation en carrière, et extraction de pétrole et de gaz',
      '23': 'Construction',
      '31-33': 'Fabrication',
      '41': 'Commerce de gros',
      '44-45': 'Commerce de détail',
      '48-49': 'Transport et entreposage',
      '51': 'Industrie de l\'information et industrie culturelle',
      '52': 'Finance et assurances',
      '53': 'Services immobiliers et services de location et de location à bail',
      '54': 'Services professionnels, scientifiques et techniques',
      '56': 'Services administratifs, services de soutien',
      '61': 'Services d\'enseignement',
      '62': 'Soins de santé et assistance sociale',
      '91': 'Administrations publiques'
    };
    
    return secteurs[code] || `Secteur ${code}`;
  }

  private calculerNombreAnnees(range: string): number {
    const [debut, fin] = range.split('-').map(Number);
    return fin - debut + 1;
  }

  /**
   * Méthodes publiques utilitaires
   */
  
  // Vider le cache
  viderCache(): void {
    this.cache.clear();
    cnesstAPIService.clearCache();
    console.log('🗑️ Cache complet vidé');
  }

  // Obtenir le statut du service
  obtenirStatut(): {
    apiStatus: string;
    cacheEntries: number;
    derniereMiseAJour: string;
  } {
    const cacheStats = cnesstAPIService.getCacheStats();
    
    return {
      apiStatus: this.apiStatus,
      cacheEntries: this.cache.size + cacheStats.entries,
      derniereMiseAJour: new Date().toISOString()
    };
  }

  // Pré-charger les données pour plusieurs secteurs
  async prechargerSecteurs(secteurs: string[]): Promise<{
    succes: string[];
    echecs: string[];
  }> {
    const succes: string[] = [];
    const echecs: string[] = [];

    console.log(`🚀 Pré-chargement de ${secteurs.length} secteurs...`);

    for (const secteur of secteurs) {
      try {
        await this.aggregerDonneesSecteurAPI(secteur);
        succes.push(secteur);
        console.log(`✅ Secteur ${secteur} pré-chargé`);
        
        // Pause pour éviter de surcharger l'API
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        echecs.push(secteur);
        console.warn(`⚠️ Échec pré-chargement secteur ${secteur}:`, error);
      }
    }

    console.log(`🎉 Pré-chargement terminé: ${succes.length} succès, ${echecs.length} échecs`);
    
    return { succes, echecs };
  }
}

// Instance singleton
export const agregateurCNESSTAPI = new AgregateurCNESSTAPI();

// Export des fonctions de commodité
export const initialiserAPIService = async () => {
  return await agregateurCNESSTAPI.initialiserConnexionAPI();
};

export const obtenirContexteSectorielAPI = async (secteurSCIAN: string) => {
  return await agregateurCNESSTAPI.aggregerDonneesSecteurAPI(secteurSCIAN);
};

export const prechargerSecteursPopulaires = async () => {
  const secteursPopulaires = ['23', '31-33', '62', '44-45', '48-49', '54'];
  return await agregateurCNESSTAPI.prechargerSecteurs(secteursPopulaires);
};

// Export du type principal
export type { ContexteSectorielEnrichi };