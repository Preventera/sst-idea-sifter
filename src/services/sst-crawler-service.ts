// src/services/sst-crawler-service.ts

// ✅ CORRECTION: Import path corrigé
import { sstCrawlerConnector } from './sst-crawler-connector';

/**
 * Service pour interagir avec SST Crawler
 */
export class SSTCrawlerService {
  /**
   * Récupère les dernières données d'une source
   * @param source Nom de la source (ex: "cnesst")
   * @returns Données collectées formatées
   */
  async getLatestData(source: string): Promise<any> {
    try {
      const rawData = await sstCrawlerConnector.getCollectedData(source);
      
      // Formatter les données pour l'affichage
      return {
        source,
        count: rawData.length,
        lastUpdated: new Date().toISOString(),
        items: rawData.slice(0, 10), // Limiter à 10 items pour l'affichage
        summary: this.summarizeData(rawData)
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération des données pour ${source}:`, error);
      throw new Error(`Impossible de récupérer les données pour ${source}`);
    }
  }
  
  /**
   * Lance une collecte manuelle pour une source
   * @param source Nom de la source
   * @param maxPages Nombre maximum de pages à collecter
   * @returns Résultat de l'opération
   */
  async triggerCrawling(source: string, maxPages: number = 10): Promise<{ success: boolean; message: string }> {
    try {
      // Vérifier si un crawling est déjà en cours
      const inProgress = await sstCrawlerConnector.isCrawlingInProgress();
      if (inProgress) {
        return {
          success: false,
          message: "Une collecte est déjà en cours. Veuillez réessayer plus tard."
        };
      }
      
      // Lancer le crawling
      await sstCrawlerConnector.crawlSource(source, { maxPages });
      
      return {
        success: true,
        message: `Collecte pour ${source} lancée avec succès (max ${maxPages} pages).`
      };
    } catch (error) {
      console.error(`Erreur lors du lancement de la collecte pour ${source}:`, error);
      return {
        success: false,
        message: `Erreur lors du lancement de la collecte: ${error.message}`
      };
    }
  }
  
  /**
   * Liste les sources disponibles avec leurs configurations
   */
  async getAvailableSourcesWithConfig(): Promise<any[]> {
    try {
      const sources = sstCrawlerConnector.getAvailableSources();
      const quebecSources = await sstCrawlerConnector.getQuebecSources();
      
      return sources.map(source => ({
        name: source,
        config: quebecSources[source] || {},
        available: true
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des sources:', error);
      return [];
    }
  }
  
  /**
   * Liste les sources disponibles (méthode simple)
   */
  getAvailableSources(): string[] {
    return sstCrawlerConnector.getAvailableSources();
  }
  
  /**
   * Effectue un diagnostic complet du système SST Crawler
   */
  async performSystemDiagnostic(): Promise<any> {
    try {
      const health = await sstCrawlerConnector.healthCheck();
      const sources = await this.getAvailableSourcesWithConfig();
      const crawlingStatus = await sstCrawlerConnector.isCrawlingInProgress();
      
      return {
        timestamp: new Date().toISOString(),
        systemHealth: health,
        sources: {
          count: sources.length,
          available: sources.filter(s => s.available).length,
          list: sources
        },
        crawling: {
          inProgress: crawlingStatus,
          status: crawlingStatus ? 'En cours' : 'Inactif'
        },
        recommendations: this.generateRecommendations(health, sources)
      };
    } catch (error) {
      console.error('Erreur lors du diagnostic système:', error);
      throw new Error('Impossible d\'effectuer le diagnostic système');
    }
  }
  
  /**
   * Récupère les statistiques d'utilisation
   */
  async getUsageStatistics(): Promise<any> {
    try {
      const sources = this.getAvailableSources();
      const stats = {
        totalSources: sources.length,
        dataCollected: 0,
        lastActivity: null,
        sourceDetails: []
      };
      
      for (const source of sources) {
        try {
          const data = await sstCrawlerConnector.getCollectedData(source);
          stats.dataCollected += data.length;
          stats.sourceDetails.push({
            source,
            itemCount: data.length,
            hasData: data.length > 0
          });
        } catch (error) {
          stats.sourceDetails.push({
            source,
            itemCount: 0,
            hasData: false,
            error: error.message
          });
        }
      }
      
      return stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw new Error('Impossible de récupérer les statistiques d\'utilisation');
    }
  }
  
  /**
   * Crée un résumé des données collectées
   * @param data Données brutes
   * @returns Résumé statistique
   */
  private summarizeData(data: any[]): any {
    if (!data || data.length === 0) {
      return {
        totalItems: 0,
        isEmpty: true
      };
    }
    
    // Exemple simple de résumé - à adapter selon la structure des données
    const typeCount = data.reduce((acc, item) => {
      const type = item.type || item.category || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    const urlCount = data.reduce((acc, item) => {
      if (item.url) {
        const domain = new URL(item.url).hostname;
        acc[domain] = (acc[domain] || 0) + 1;
      }
      return acc;
    }, {});
    
    return {
      totalItems: data.length,
      typeDistribution: typeCount,
      domainDistribution: urlCount,
      isEmpty: false,
      hasContent: data.some(item => item.content || item.text || item.title)
    };
  }
  
  /**
   * Génère des recommandations basées sur l'état du système
   */
  private generateRecommendations(health: any, sources: any[]): string[] {
    const recommendations = [];
    
    if (!health.details.basePathExists) {
      recommendations.push('❌ Le répertoire SST Crawler est introuvable. Vérifiez l\'installation du sous-module.');
    }
    
    if (!health.details.automationScriptExists) {
      recommendations.push('❌ Le script d\'automatisation est manquant. Réinstallez le sous-module SST Crawler.');
    }
    
    if (!health.details.outputDirExists) {
      recommendations.push('⚠️ Le répertoire de sortie n\'existe pas. Il sera créé automatiquement lors du premier crawling.');
    }
    
    if (sources.length === 0) {
      recommendations.push('⚠️ Aucune source configurée. Vérifiez le fichier sources_quebec.json.');
    }
    
    if (health.details.crawlingInProgress) {
      recommendations.push('ℹ️ Un crawling est en cours. Attendez la fin avant de lancer une nouvelle collecte.');
    } else {
      recommendations.push('✅ Système prêt pour le crawling. Vous pouvez lancer une collecte de données.');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('✅ Système en parfait état de fonctionnement.');
    }
    
    return recommendations;
  }
}

// Exporter une instance par défaut
export const sstCrawlerService = new SSTCrawlerService();