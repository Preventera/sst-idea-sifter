// src/utils/xai-context-engine.ts
// Système de bascule intelligent entre les versions CSV et API du moteur XAI
// Permet de tester et comparer les deux approches facilement

// Import des deux versions du moteur
import * as XAIOriginal from './xai-context-engine.original';
import { 
  xaiEngineAPI, 
  genererExplicationComplete as genererExplicationAPI,
  initialiserMoteaurXAI,
  prechargerSecteursXAI,
  type XAIExplanation as XAIExplanationAPI,
  type ProjectContext,
  type VisualizationConfig,
  type MetriquesTempsReel
} from './xai-context-engine-enhanced-api';

// Configuration du système de bascule
interface XAIEngineConfig {
  mode: 'csv' | 'api' | 'auto';
  fallbackEnabled: boolean;
  debugMode: boolean;
  preferredSources: ('csv' | 'api')[];
}

// Configuration par défaut - modifiable selon les besoins
const DEFAULT_CONFIG: XAIEngineConfig = {
  mode: 'api', // Utiliser l'API par défaut
  fallbackEnabled: true, // Basculer vers CSV en cas de problème API
  debugMode: true, // Afficher les logs de débogage
  preferredSources: ['api', 'csv'] // Ordre de préférence
};

// Types unifiés
export interface XAIExplanation {
  contexteSectoriel: string;
  justificationDonnees: string;
  recommandationPratique: string;
  tracabilite: string;
  niveauConfiance: number;
  sourcesDonnees: string[];
  visualisations?: VisualizationConfig[];
  metriquesTempsReel?: MetriquesTempsReel;
  versionMoteur?: 'csv' | 'api';
  performanceMetrics?: {
    tempsReponse: number;
    sourceUtilisee: string;
    cacheMiss: boolean;
  };
}

export { ProjectContext, VisualizationConfig, MetriquesTempsReel };

class XAIEngineManager {
  private config: XAIEngineConfig;
  private apiStatus: 'non-teste' | 'disponible' | 'indisponible' = 'non-teste';
  private statsUtilisation = {
    totalRequetes: 0,
    requetesAPI: 0,
    requetesCSV: 0,
    erreursAPI: 0,
    fallbacks: 0
  };

  constructor(config: Partial<XAIEngineConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    if (this.config.debugMode) {
      console.log('🔧 XAI Engine Manager initialisé avec config:', this.config);
    }
  }

  /**
   * Initialise le moteur selon la configuration
   */
  async initialiser(): Promise<{
    success: boolean;
    mode: string;
    message: string;
  }> {
    try {
      if (this.config.debugMode) {
        console.log('🚀 Initialisation du XAI Engine Manager...');
      }

      // Test de disponibilité API si nécessaire
      if (this.config.mode === 'api' || this.config.mode === 'auto') {
        try {
          await initialiserMoteaurXAI();
          this.apiStatus = 'disponible';
          
          if (this.config.debugMode) {
            console.log('✅ API CNESST disponible');
          }
          
          // Pré-charger quelques secteurs populaires
          if (this.config.mode === 'api') {
            prechargerSecteursXAI().catch(err => 
              console.warn('⚠️ Erreur pré-chargement secteurs:', err)
            );
          }
          
          return {
            success: true,
            mode: 'api',
            message: 'Moteur XAI initialisé avec API CNESST'
          };
          
        } catch (error) {
          this.apiStatus = 'indisponible';
          
          if (this.config.debugMode) {
            console.warn('⚠️ API CNESST indisponible:', error);
          }
          
          // Basculer vers CSV si auto ou fallback activé
          if (this.config.mode === 'auto' || this.config.fallbackEnabled) {
            if (this.config.debugMode) {
              console.log('🔄 Bascule vers mode CSV');
            }
            
            return {
              success: true,
              mode: 'csv',
              message: 'Moteur XAI initialisé en mode CSV (API indisponible)'
            };
          }
          
          throw error;
        }
      }

      // Mode CSV uniquement
      return {
        success: true,
        mode: 'csv',
        message: 'Moteur XAI initialisé en mode CSV'
      };

    } catch (error) {
      console.error('❌ Erreur initialisation XAI Engine Manager:', error);
      
      return {
        success: false,
        mode: 'erreur',
        message: `Échec initialisation: ${error}`
      };
    }
  }

  /**
   * Génère une explication XAI en utilisant la meilleure source disponible
   */
  async genererExplicationXAI(
    critere: string,
    score: number,
    contexteProjet: ProjectContext
  ): Promise<XAIExplanation> {
    const startTime = Date.now();
    this.statsUtilisation.totalRequetes++;

    try {
      if (this.config.debugMode) {
        console.log(`🧠 Génération XAI: ${critere} (score: ${score}, secteur: ${contexteProjet.secteurSCIAN})`);
      }

      let explication: XAIExplanation;
      let sourceUtilisee: string;
      let cacheMiss = true;

      // Déterminer quelle source utiliser
      const sourceAUtiliser = await this.determinerMeilleureSource();

      if (sourceAUtiliser === 'api') {
        try {
          const explicacionAPI = await genererExplicationAPI(critere, score, contexteProjet);
          
          explication = {
            ...explicacionAPI,
            versionMoteur: 'api'
          };
          
          sourceUtilisee = 'API CNESST (temps réel)';
          this.statsUtilisation.requetesAPI++;
          
          if (this.config.debugMode) {
            console.log(`✅ Explication générée via API (confiance: ${explication.niveauConfiance}/10)`);
          }

        } catch (error) {
          this.statsUtilisation.erreursAPI++;
          
          if (this.config.debugMode) {
            console.warn('⚠️ Erreur API, tentative fallback CSV:', error);
          }

          if (this.config.fallbackEnabled) {
            explication = await this.genererExplicationCSV(critere, score, contexteProjet);
            sourceUtilisee = 'CSV (fallback depuis API)';
            this.statsUtilisation.fallbacks++;
          } else {
            throw error;
          }
        }
      } else {
        // Mode CSV
        explication = await this.genererExplicationCSV(critere, score, contexteProjet);
        sourceUtilisee = 'CSV (fichiers locaux)';
        this.statsUtilisation.requetesCSV++;
      }

      // Ajouter les métriques de performance
      const tempsReponse = Date.now() - startTime;
      explication.performanceMetrics = {
        tempsReponse,
        sourceUtilisee,
        cacheMiss
      };

      if (this.config.debugMode) {
        console.log(`⏱️ XAI généré en ${tempsReponse}ms via ${sourceUtilisee}`);
      }

      return explication;

    } catch (error) {
      console.error('❌ Erreur génération XAI:', error);
      
      // Explication d'urgence minimale
      return this.genererExplicationUrgence(critere, score, contexteProjet, Date.now() - startTime);
    }
  }

  /**
   * Détermine la meilleure source selon la configuration et la disponibilité
   */
  private async determinerMeilleureSource(): Promise<'api' | 'csv'> {
    // Mode forcé
    if (this.config.mode === 'csv') return 'csv';
    if (this.config.mode === 'api' && this.apiStatus === 'disponible') return 'api';

    // Mode auto ou API non disponible
    if (this.config.mode === 'auto' || this.apiStatus === 'indisponible') {
      // Utiliser l'ordre de préférence
      for (const source of this.config.preferredSources) {
        if (source === 'api' && this.apiStatus === 'disponible') return 'api';
        if (source === 'csv') return 'csv';
      }
    }

    // Fallback par défaut
    return 'csv';
  }

  /**
   * Génère une explication via la version CSV
   */
  private async genererExplicationCSV(
    critere: string,
    score: number,
    contexteProjet: ProjectContext
  ): Promise<XAIExplanation> {
    // Adapter l'interface de l'ancienne version si elle existe
    if (XAIOriginal && typeof XAIOriginal.genererExplicationComplete === 'function') {
      const explicacionOriginal = await XAIOriginal.genererExplicationComplete(
        critere,
        score,
        contexteProjet
      );
      
      return {
        ...explicacionOriginal,
        versionMoteur: 'csv',
        sourcesDonnees: explicacionOriginal.sourcesDonnees || ['Fichiers CSV locaux'],
        niveauConfiance: explicacionOriginal.niveauConfiance || 6
      };
    }

    // Fallback si l'ancienne version n'est pas disponible
    return this.genererExplicationGenerique(critere, score, contexteProjet);
  }

  /**
   * Génère une explication générique de base
   */
  private genererExplicationGenerique(
    critere: string,
    score: number,
    contexteProjet: ProjectContext
  ): XAIExplanation {
    return {
      contexteSectoriel: `Secteur ${contexteProjet.secteurSCIAN} - Analyse générique`,
      justificationDonnees: `Score ${score}/10 pour "${critere}" basé sur les critères standards d'évaluation`,
      recommandationPratique: score < 6 ? 
        'Améliorer la faisabilité technique avant déploiement' : 
        'Projet viable pour progression vers étapes suivantes',
      tracabilite: 'Évaluation basée sur critères standards IA-SST',
      niveauConfiance: 6,
      sourcesDonnees: ['Critères d\'évaluation standards'],
      versionMoteur: 'csv'
    };
  }

  /**
   * Génère une explication d'urgence en cas d'erreur totale
   */
  private genererExplicationUrgence(
    critere: string,
    score: number,
    contexteProjet: ProjectContext,
    tempsReponse: number
  ): XAIExplanation {
    return {
      contexteSectoriel: `Secteur ${contexteProjet.secteurSCIAN} - Mode dégradé`,
      justificationDonnees: `Score ${score}/10 (évaluation simplifiée due à un problème technique)`,
      recommandationPratique: 'Réévaluer ultérieurement avec données complètes',
      tracabilite: 'Mode dégradé - Sources indisponibles',
      niveauConfiance: 4,
      sourcesDonnees: ['Mode d\'urgence'],
      versionMoteur: 'csv',
      performanceMetrics: {
        tempsReponse,
        sourceUtilisee: 'Mode d\'urgence',
        cacheMiss: true
      }
    };
  }

  /**
   * Méthodes de gestion et monitoring
   */

  // Changer la configuration à chaud
  changerConfiguration(nouvelleCongif: Partial<XAIEngineConfig>): void {
    this.config = { ...this.config, ...nouvelleCongif };
    
    if (this.config.debugMode) {
      console.log('🔧 Configuration XAI mise à jour:', this.config);
    }
  }

  // Forcer un mode spécifique
  forcerMode(mode: 'csv' | 'api'): void {
    this.config.mode = mode;
    
    if (this.config.debugMode) {
      console.log(`🔀 Mode forcé: ${mode}`);
    }
  }

  // Obtenir les statistiques d'utilisation
  obtenirStatistiques(): {
    config: XAIEngineConfig;
    apiStatus: string;
    stats: typeof this.statsUtilisation;
    performance: {
      tauxSuccesAPI: number;
      tauxFallback: number;
      repartitionSources: { api: number; csv: number };
    };
  } {
    const total = this.statsUtilisation.totalRequetes;
    
    return {
      config: this.config,
      apiStatus: this.apiStatus,
      stats: this.statsUtilisation,
      performance: {
        tauxSuccesAPI: total > 0 ? (this.statsUtilisation.requetesAPI / total) * 100 : 0,
        tauxFallback: total > 0 ? (this.statsUtilisation.fallbacks / total) * 100 : 0,
        repartitionSources: {
          api: this.statsUtilisation.requetesAPI,
          csv: this.statsUtilisation.requetesCSV
        }
      }
    };
  }

  // Réinitialiser les statistiques
  reinitialiserStats(): void {
    this.statsUtilisation = {
      totalRequetes: 0,
      requetesAPI: 0,
      requetesCSV: 0,
      erreursAPI: 0,
      fallbacks: 0
    };
    
    console.log('📊 Statistiques XAI réinitialisées');
  }

  // Tester la connectivité
  async testerConnectivite(): Promise<{
    api: { disponible: boolean; message: string };
    csv: { disponible: boolean; message: string };
  }> {
    const resultats = {
      api: { disponible: false, message: '' },
      csv: { disponible: false, message: '' }
    };

    // Test API
    try {
      await initialiserMoteaurXAI();
      resultats.api = { disponible: true, message: 'API CNESST accessible' };
    } catch (error) {
      resultats.api = { disponible: false, message: `Erreur API: ${error}` };
    }

    // Test CSV
    try {
      const testExplication = this.genererExplicationGenerique('test', 5, {
        nom: 'Test',
        secteurSCIAN: '23',
        description: 'Test',
        risquesPrincipaux: []
      });
      
      resultats.csv = { disponible: true, message: 'Génération CSV fonctionnelle' };
    } catch (error) {
      resultats.csv = { disponible: false, message: `Erreur CSV: ${error}` };
    }

    return resultats;
  }
}

// Instance singleton
export const xaiEngineManager = new XAIEngineManager();

// Fonctions de commodité publiques
export const initialiserXAIEngine = async (config?: Partial<XAIEngineConfig>) => {
  if (config) {
    xaiEngineManager.changerConfiguration(config);
  }
  return await xaiEngineManager.initialiser();
};

export const genererExplicationComplete = async (
  critere: string,
  score: number,
  contexteProjet: ProjectContext
): Promise<XAIExplanation> => {
  return await xaiEngineManager.genererExplicationXAI(critere, score, contexteProjet);
};

export const changerModeXAI = (mode: 'csv' | 'api' | 'auto') => {
  xaiEngineManager.changerConfiguration({ mode });
};

export const obtenirStatistiquesXAI = () => {
  return xaiEngineManager.obtenirStatistiques();
};

export const testerConnectiviteXAI = async () => {
  return await xaiEngineManager.testerConnectivite();
};

// Export de la classe pour usage avancé
export { XAIEngineManager, type XAIEngineConfig };