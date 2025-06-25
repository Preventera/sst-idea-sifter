// src/utils/xai-context-engine-enhanced-api.ts
// Version améliorée du moteur XAI utilisant l'API CNESST Données Québec
// Remplace le chargement de fichiers CSV par des données temps réel

// NOUVEAU
import { 
  agregateurCNESSTAPI, 
  obtenirContexteSectorielAPI, 
  initialiserAPIService,
  type ContexteSectorielEnrichi 
} from '../services/data_processors/aggregateur-donnees-cnesst-api';

// Types XAI enrichis
interface XAIExplanation {
  contexteSectoriel: string;
  justificationDonnees: string;
  recommandationPratique: string;
  tracabilite: string;
  niveauConfiance: number;
  sourcesDonnees: string[];
  visualisations?: VisualizationConfig[];
  metriquesTempsReel?: MetriquesTempsReel;
}

interface ProjectContext {
  nom: string;
  secteurSCIAN: string;
  description: string;
  risquesPrincipaux: string[];
  objectifs?: string[];
}

interface VisualizationConfig {
  type: 'bar' | 'pie' | 'line' | 'heatmap';
  titre: string;
  donnees: any[];
  config: any;
}

interface MetriquesTempsReel {
  derniereMiseAJour: string;
  couvertureDonnees: string;
  totalEnregistrements: number;
  fiabiliteScore: number;
}

class XAIContextEngineAPI {
  private contexteCache: Map<string, ContexteSectorielEnrichi> = new Map();
  private apiInitialisee: boolean = false;
  private statusConnexion: 'connectee' | 'erreur' | 'non-initialisee' = 'non-initialisee';

  /**
   * Initialise la connexion API au démarrage
   */
  async initialiser(): Promise<void> {
    try {
      console.log('🚀 Initialisation du moteur XAI avec API CNESST...');
      
      const resultat = await initialiserAPIService();
      
      if (resultat.success) {
        this.apiInitialisee = true;
        this.statusConnexion = 'connectee';
        console.log(`✅ Moteur XAI initialisé - ${resultat.datasetsDisponibles} datasets disponibles`);
      } else {
        throw new Error(resultat.message);
      }
      
    } catch (error) {
      this.statusConnexion = 'erreur';
      console.error('❌ Erreur d\'initialisation du moteur XAI:', error);
      throw error;
    }
  }

  /**
   * Génère une explication XAI enrichie avec données temps réel
   */
  async genererExplicationXAI(
    critere: string,
    score: number,
    contexteProjet: ProjectContext
  ): Promise<XAIExplanation> {
    try {
      console.log(`🧠 Génération XAI pour critère "${critere}" (secteur ${contexteProjet.secteurSCIAN})`);

      // S'assurer que l'API est initialisée
      if (!this.apiInitialisee) {
        await this.initialiser();
      }

      // Récupérer le contexte sectoriel enrichi depuis l'API
      const contexteSectoriel = await this.obtenirContexteSectorielEnrichi(contexteProjet.secteurSCIAN);
      
      // Générer l'explication contextuelle
      const explication = await this.construireExplicationContextuelle(
        critere,
        score,
        contexteProjet,
        contexteSectoriel
      );

      // Ajouter les visualisations
      explication.visualisations = this.genererVisualisations(contexteSectoriel);
      
      // Ajouter les métriques temps réel
      explication.metriquesTempsReel = this.construireMetriquesTempsReel(contexteSectoriel);

      console.log(`✅ Explication XAI générée avec niveau de confiance ${explication.niveauConfiance}/10`);
      
      return explication;

    } catch (error) {
      console.error('❌ Erreur lors de la génération XAI:', error);
      
      // Fallback vers explication générique en cas d'erreur API
      return this.genererExplicationFallback(critere, score, contexteProjet);
    }
  }

  /**
   * Récupère le contexte sectoriel enrichi avec cache intelligent
   */
  private async obtenirContexteSectorielEnrichi(secteurSCIAN: string): Promise<ContexteSectorielEnrichi> {
    try {
      // Vérifier le cache local
      const cached = this.contexteCache.get(secteurSCIAN);
      if (cached) {
        console.log(`📋 Contexte secteur ${secteurSCIAN} récupéré du cache`);
        return cached;
      }

      // Récupérer depuis l'API
      console.log(`🌐 Récupération contexte secteur ${secteurSCIAN} depuis l'API...`);
      const contexte = await obtenirContexteSectorielAPI(secteurSCIAN);
      
      // Mise en cache
      this.contexteCache.set(secteurSCIAN, contexte);
      
      return contexte;
      
    } catch (error) {
      console.error(`❌ Erreur récupération contexte secteur ${secteurSCIAN}:`, error);
      throw error;
    }
  }

  /**
   * Construit l'explication contextuelle enrichie
   */
  private async construireExplicationContextuelle(
    critere: string,
    score: number,
    contexteProjet: ProjectContext,
    contexteSectoriel: ContexteSectorielEnrichi
  ): Promise<XAIExplanation> {
    
    // 1. Contexte sectoriel enrichi
    const contexteSectorielTexte = this.construireContexteSectoriel(contexteSectoriel);
    
    // 2. Justification basée sur données réelles
    const justificationDonnees = this.construireJustificationDonnees(
      critere,
      score,
      contexteSectoriel
    );
    
    // 3. Recommandation pratique adaptée
    const recommandationPratique = this.construireRecommandationPratique(
      critere,
      score,
      contexteSectoriel,
      contexteProjet
    );
    
    // 4. Traçabilité des sources
    const tracabilite = this.construireTracabilite(contexteSectoriel);
    
    // 5. Niveau de confiance calculé
    const niveauConfiance = this.calculerNiveauConfiance(contexteSectoriel);
    
    // 6. Sources de données
    const sourcesDonnees = this.construireSourcesDonnees(contexteSectoriel);

    return {
      contexteSectoriel: contexteSectorielTexte,
      justificationDonnees,
      recommandationPratique,
      tracabilite,
      niveauConfiance,
      sourcesDonnees
    };
  }

  /**
   * Construit le texte de contexte sectoriel
   */
  private construireContexteSectoriel(contexte: ContexteSectorielEnrichi): string {
    const risquesPrincipauxTexte = contexte.risquesPrincipaux
      .slice(0, 3)
      .map(r => `${r.type} (${r.pourcentage}%)`)
      .join(', ');

    const indicateursSpeciaux = [];
    if (contexte.indicateursSpecialises.tmsPrevalence > 10) {
      indicateursSpeciaux.push(`TMS: ${contexte.indicateursSpecialises.tmsPrevalence}%`);
    }
    if (contexte.indicateursSpecialises.lesionsPsychologiques > 5) {
      indicateursSpeciaux.push(`Lésions psychologiques: ${contexte.indicateursSpecialises.lesionsPsychologiques}%`);
    }
    if (contexte.indicateursSpecialises.accidentsMachines > 10) {
      indicateursSpeciaux.push(`Accidents machines: ${contexte.indicateursSpecialises.accidentsMachines}%`);
    }

    return `Secteur ${contexte.nomSecteur} (SCIAN ${contexte.secteurSCIAN}) - Analyse basée sur ${contexte.statistiquesGlobales.totalLesions.toLocaleString()} lésions professionnelles (${contexte.perioDeReference}). 

Risques dominants: ${risquesPrincipauxTexte}. 
${indicateursSpeciaux.length > 0 ? `Indicateurs spécialisés: ${indicateursSpeciaux.join(', ')}.` : ''}

Agents causaux principaux: ${contexte.agentsCausauxDominants.slice(0, 3).map(a => a.type).join(', ')}.`;
  }

  /**
   * Construit la justification basée sur les données
   */
  private construireJustificationDonnees(
    critere: string,
    score: number,
    contexte: ContexteSectorielEnrichi
  ): string {
    const baseJustification = `Score ${score}/10 pour le critère "${critere}" basé sur l'analyse de ${contexte.statistiquesGlobales.totalLesions.toLocaleString()} dossiers CNESST (${contexte.perioDeReference}).`;
    
    // Justifications spécifiques par critère
    const justifications: Record<string, string> = {
      'Faisabilité technique': `Les technologies IA dans ce secteur montrent un potentiel ${this.evaluerPotentielIA(contexte)} pour traiter les ${contexte.risquesPrincipaux[0]?.type.toLowerCase() || 'risques principaux'}.`,
      'Valeur d\'affaires': `ROI estimé élevé compte tenu de la prévalence des ${contexte.risquesPrincipaux[0]?.type.toLowerCase() || 'incidents'} (${contexte.risquesPrincipaux[0]?.pourcentage || 0}% des lésions).`,
      'Conformité réglementaire': `Alignement avec les exigences CNESST pour la prévention des ${contexte.risquesPrincipaux.slice(0, 2).map(r => r.type.toLowerCase()).join(' et ')}.`,
      'Temps de mise en marché': `Déploiement facilité par l'existence de ${contexte.opportunitesIA.length} opportunités IA identifiées dans ce secteur.`,
      'Coût d\'implémentation': `Coûts justifiés par la réduction potentielle des ${contexte.statistiquesGlobales.totalLesions} lésions annuelles dans ce secteur.`
    };

    const justificationSpecifique = justifications[critere] || 'Évaluation basée sur les données sectorielles disponibles.';
    
    return `${baseJustification} ${justificationSpecifique}`;
  }

  /**
   * Construit la recommandation pratique
   */
  private construireRecommandationPratique(
    critere: string,
    score: number,
    contexte: ContexteSectorielEnrichi,
    projet: ProjectContext
  ): string {
    // Recommandations basées sur les opportunités IA identifiées
    const opportunitePrioritaire = contexte.opportunitesIA[0];
    
    if (score < 6) {
      return `**Action prioritaire**: ${opportunitePrioritaire?.description || 'Améliorer la faisabilité technique'}. 
      
Étapes recommandées:
1. Analyser spécifiquement les ${contexte.risquesPrincipaux[0]?.type.toLowerCase() || 'risques principaux'} de votre organisation
2. Déployer une solution pilote ciblant ${contexte.agentsCausauxDominants[0]?.type.toLowerCase() || 'les agents causaux principaux'}
3. Mesurer l'impact sur la réduction des incidents

Ressources: Consultez les guides CNESST pour le secteur ${contexte.nomSecteur}.`;
    } else if (score < 8) {
      return `**Optimisation suggérée**: ${opportunitePrioritaire?.description || 'Renforcer les capacités existantes'}.
      
Le projet montre un bon potentiel. Concentrez-vous sur l'intégration avec les systèmes existants et la formation des équipes.`;
    } else {
      return `**Excellence**: Projet bien positionné pour le déploiement. 
      
Considérez l'extension vers d'autres ${contexte.opportunitesIA.slice(1, 3).map(o => o.domaine.toLowerCase()).join(' et ')} pour maximiser l'impact.`;
    }
  }

  /**
   * Construit la traçabilité
   */
  private construireTracabilite(contexte: ContexteSectorielEnrichi): string {
    return `Données source: API Données Québec - CNESST (${contexte.perioDeReference})
Dernière mise à jour: ${contexte.statistiquesGlobales.derniereMiseAJour}
Méthodologie: Agrégation de ${contexte.statistiquesGlobales.totalLesions.toLocaleString()} dossiers sur ${contexte.statistiquesGlobales.totalAnnees} années
Conformité: ISO 42001 (IA responsable), RGPD
Révision: Données actualisées automatiquement via API gouvernementale`;
  }

  /**
   * Calcule le niveau de confiance
   */
  private calculerNiveauConfiance(contexte: ContexteSectorielEnrichi): number {
    let confiance = 7; // Base

    // Augmenter selon la richesse des données
    if (contexte.statistiquesGlobales.totalLesions > 10000) confiance += 1;
    if (contexte.statistiquesGlobales.totalAnnees >= 5) confiance += 1;
    if (contexte.risquesPrincipaux.length >= 5) confiance += 0.5;
    if (contexte.opportunitesIA.length >= 4) confiance += 0.5;

    return Math.min(10, Math.round(confiance * 10) / 10);
  }

  /**
   * Construit la liste des sources
   */
  private construireSourcesDonnees(contexte: ContexteSectorielEnrichi): string[] {
    return [
      `CNESST - Lésions professionnelles ${contexte.perioDeReference}`,
      'API Données Québec (données gouvernementales officielles)',
      'Classification SCIAN - Statistique Canada',
      'GenAISafety - Analyse IA-SST contextuelle',
      'ISO 45001:2018 - Systèmes de management SST'
    ];
  }

  /**
   * Génère les configurations de visualisation
   */
  private genererVisualisations(contexte: ContexteSectorielEnrichi): VisualizationConfig[] {
    return [
      {
        type: 'bar',
        titre: 'Risques principaux par fréquence',
        donnees: contexte.risquesPrincipaux.slice(0, 5).map(r => ({
          nom: r.type,
          valeur: r.pourcentage,
          tendance: r.tendance
        })),
        config: {
          colorScheme: 'category10',
          showValues: true
        }
      },
      {
        type: 'pie',
        titre: 'Répartition des agents causaux',
        donnees: contexte.agentsCausauxDominants.slice(0, 6).map(a => ({
          nom: a.type,
          valeur: a.pourcentage,
          gravite: a.gravite
        })),
        config: {
          showLegend: true,
          colorMap: {
            'elevee': '#ff4444',
            'moyenne': '#ffaa44',
            'faible': '#44ff44'
          }
        }
      }
    ];
  }

  /**
   * Construit les métriques temps réel
   */
  private construireMetriquesTempsReel(contexte: ContexteSectorielEnrichi): MetriquesTempsReel {
    return {
      derniereMiseAJour: contexte.statistiquesGlobales.derniereMiseAJour,
      couvertureDonnees: contexte.perioDeReference,
      totalEnregistrements: contexte.statistiquesGlobales.totalLesions,
      fiabiliteScore: this.calculerNiveauConfiance(contexte)
    };
  }

  /**
   * Génère une explication de fallback en cas d'erreur API
   */
  private genererExplicationFallback(
    critere: string,
    score: number,
    contexteProjet: ProjectContext
  ): XAIExplanation {
    console.warn('⚠️ Utilisation du mode fallback pour l\'explication XAI');
    
    return {
      contexteSectoriel: `Secteur ${contexteProjet.secteurSCIAN} - Analyse en mode dégradé (API non disponible)`,
      justificationDonnees: `Score ${score}/10 basé sur les critères standards d'évaluation IA-SST`,
      recommandationPratique: 'Recommandation générique - Améliorer la faisabilité technique avant déploiement',
      tracabilite: 'Mode dégradé - Données locales uniquement',
      niveauConfiance: 5,
      sourcesDonnees: ['Critères d\'évaluation standards'],
      metriquesTempsReel: {
        derniereMiseAJour: new Date().toISOString().split('T')[0],
        couvertureDonnees: 'Limitée',
        totalEnregistrements: 0,
        fiabiliteScore: 5
      }
    };
  }

  /**
   * Fonctions utilitaires
   */
  private evaluerPotentielIA(contexte: ContexteSectorielEnrichi): string {
    const opportunitesElevees = contexte.opportunitesIA.filter(o => o.potentiel === 'eleve').length;
    if (opportunitesElevees >= 2) return 'élevé';
    if (opportunitesElevees >= 1) return 'moyen';
    return 'modéré';
  }

  /**
   * Méthodes publiques utilitaires
   */
  
  // Obtenir le statut du moteur
  obtenirStatut(): {
    statusConnexion: string;
    apiInitialisee: boolean;
    secteursMisEnCache: number;
  } {
    return {
      statusConnexion: this.statusConnexion,
      apiInitialisee: this.apiInitialisee,
      secteursMisEnCache: this.contexteCache.size
    };
  }

  // Vider le cache
  viderCache(): void {
    this.contexteCache.clear();
    agregateurCNESSTAPI.viderCache();
    console.log('🗑️ Cache moteur XAI vidé');
  }

  // Pré-charger des secteurs populaires
  async prechargerSecteurs(): Promise<void> {
    if (!this.apiInitialisee) {
      await this.initialiser();
    }

    const secteursPopulaires = ['23', '31-33', '62', '44-45', '48-49'];
    console.log('🚀 Pré-chargement des secteurs populaires...');

    for (const secteur of secteursPopulaires) {
      try {
        await this.obtenirContexteSectorielEnrichi(secteur);
        console.log(`✅ Secteur ${secteur} pré-chargé dans le moteur XAI`);
      } catch (error) {
        console.warn(`⚠️ Échec pré-chargement secteur ${secteur}:`, error);
      }
    }
  }
}

// Instance singleton
export const xaiEngineAPI = new XAIContextEngineAPI();

// Export des fonctions de commodité
export const initialiserMoteaurXAI = async () => {
  return await xaiEngineAPI.initialiser();
};

export const genererExplicationComplete = async (
  critere: string,
  score: number,
  contexteProjet: ProjectContext
): Promise<XAIExplanation> => {
  return await xaiEngineAPI.genererExplicationXAI(critere, score, contexteProjet);
};

export const prechargerSecteursXAI = async () => {
  return await xaiEngineAPI.prechargerSecteurs();
};

// Export des types
export type { XAIExplanation, ProjectContext, VisualizationConfig, MetriquesTempsReel };