// src/utils/discover-cnesst-resources.ts
// Script pour découvrir automatiquement les vrais resource_id de l'API Données Québec

import axios from 'axios';

interface CNESSTDataset {
  id: string;
  name: string;
  title: string;
  resources: Array<{
    id: string;
    name: string;
    format: string;
    url: string;
    created: string;
    last_modified: string;
    size: number;
  }>;
  metadata_created: string;
  metadata_modified: string;
}

interface DiscoveredResource {
  year: number;
  resourceId: string;
  datasetId: string;
  name: string;
  lastModified: string;
  size: number;
  downloadUrl: string;
}

class CNESSTResourceDiscovery {
  private readonly baseURL = 'https://www.donneesquebec.ca/recherche/api/3/action';
  private readonly timeout = 15000; // 15 secondes

  /**
   * Découvre tous les datasets CNESST de lésions professionnelles
   */
  async discoverCNESSTDatasets(): Promise<CNESSTDataset[]> {
    try {
      console.log('🔍 Recherche des datasets CNESST...');
      
      const response = await axios.get(`${this.baseURL}/package_search`, {
        params: {
          q: 'organization:cnesst AND title:"Lésions professionnelles"',
          rows: 50, // Augmenter pour être sûr d'avoir tous les datasets
          sort: 'metadata_modified desc'
        },
        timeout: this.timeout
      });

      if (!response.data.success) {
        throw new Error('Réponse API non-réussie');
      }

      const datasets = response.data.result.results as CNESSTDataset[];
      
      console.log(`✅ ${datasets.length} datasets trouvés`);
      
      return datasets;

    } catch (error) {
      console.error('❌ Erreur lors de la découverte des datasets:', error);
      throw error;
    }
  }

  /**
   * Extrait les resources CSV des datasets par année
   */
  extractResourcesByYear(datasets: CNESSTDataset[]): DiscoveredResource[] {
    const resources: DiscoveredResource[] = [];

    for (const dataset of datasets) {
      // Extraire l'année du titre
      const yearMatch = dataset.title.match(/(\d{4})/);
      if (!yearMatch) continue;
      
      const year = parseInt(yearMatch[1]);
      
      // Ne garder que les années récentes (2018-2024)
      if (year < 2018 || year > 2024) continue;

      // Trouver la ressource CSV principale
      const csvResource = dataset.resources.find(resource => 
        resource.format === 'CSV' && 
        (resource.name.toLowerCase().includes('lésions') || 
         resource.name.toLowerCase().includes('lesions'))
      );

      if (csvResource) {
        resources.push({
          year,
          resourceId: csvResource.id,
          datasetId: dataset.id,
          name: dataset.title,
          lastModified: csvResource.last_modified || dataset.metadata_modified,
          size: csvResource.size || 0,
          downloadUrl: csvResource.url
        });
      }
    }

    // Trier par année décroissante
    return resources.sort((a, b) => b.year - a.year);
  }

  /**
   * Teste la connectivité avec une ressource
   */
  async testResource(resourceId: string): Promise<{
    accessible: boolean;
    recordCount: number;
    sampleData: any[];
    error?: string;
  }> {
    try {
      console.log(`🧪 Test de la ressource ${resourceId}...`);
      
      const response = await axios.get(`${this.baseURL}/datastore_search`, {
        params: {
          resource_id: resourceId,
          limit: 5 // Juste quelques enregistrements pour tester
        },
        timeout: this.timeout
      });

      if (!response.data.success) {
        return {
          accessible: false,
          recordCount: 0,
          sampleData: [],
          error: 'API non-réussie'
        };
      }

      const result = response.data.result;
      
      return {
        accessible: true,
        recordCount: result.total,
        sampleData: result.records.slice(0, 3),
        error: undefined
      };

    } catch (error) {
      return {
        accessible: false,
        recordCount: 0,
        sampleData: [],
        error: String(error)
      };
    }
  }

  /**
   * Découverte complète avec tests de connectivité
   */
  async discoverAndValidateResources(): Promise<{
    discoveredResources: DiscoveredResource[];
    validatedResources: Array<DiscoveredResource & {
      isAccessible: boolean;
      recordCount: number;
      hasExpectedFields: boolean;
      testError?: string;
    }>;
    summary: {
      totalFound: number;
      accessible: number;
      withData: number;
      recommended: DiscoveredResource[];
    };
  }> {
    console.log('🚀 Début de la découverte complète des ressources CNESST...');
    
    // 1. Découvrir les datasets
    const datasets = await this.discoverCNESSTDatasets();
    const discoveredResources = this.extractResourcesByYear(datasets);
    
    console.log(`📊 ${discoveredResources.length} ressources extraites par année`);
    
    // 2. Valider chaque ressource
    const validatedResources = [];
    
    for (const resource of discoveredResources) {
      console.log(`🔍 Validation de ${resource.year}...`);
      
      const testResult = await this.testResource(resource.resourceId);
      
      // Vérifier si la ressource a les champs attendus
      const hasExpectedFields = testResult.sampleData.length > 0 && 
        this.validateDataStructure(testResult.sampleData[0]);
      
      validatedResources.push({
        ...resource,
        isAccessible: testResult.accessible,
        recordCount: testResult.recordCount,
        hasExpectedFields,
        testError: testResult.error
      });

      // Pause pour éviter de surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 3. Générer le résumé
    const accessible = validatedResources.filter(r => r.isAccessible).length;
    const withData = validatedResources.filter(r => r.isAccessible && r.recordCount > 0).length;
    const recommended = validatedResources
      .filter(r => r.isAccessible && r.hasExpectedFields && r.recordCount > 10000)
      .slice(0, 6); // Top 6 des années les plus récentes avec beaucoup de données

    const summary = {
      totalFound: discoveredResources.length,
      accessible,
      withData,
      recommended
    };

    console.log('📋 Résumé de la découverte:');
    console.log(`- Total trouvé: ${summary.totalFound}`);
    console.log(`- Accessible: ${summary.accessible}`);
    console.log(`- Avec données: ${summary.withData}`);
    console.log(`- Recommandé: ${summary.recommended.length}`);

    return {
      discoveredResources,
      validatedResources,
      summary
    };
  }

  /**
   * Valide la structure des données CNESST
   */
  private validateDataStructure(sampleRecord: any): boolean {
    const expectedFields = [
      'SECTEUR_SCIAN',
      'NATURE_LESION',
      'SIEGE_LESION',
      'AGENT_CAUSAL_LESION'
    ];

    return expectedFields.every(field => 
      sampleRecord.hasOwnProperty(field)
    );
  }

  /**
   * Génère le code de configuration mis à jour
   */
  generateUpdatedConfig(recommendedResources: DiscoveredResource[]): string {
    const configLines = recommendedResources.map(resource => `  {
    year: ${resource.year},
    resourceId: '${resource.resourceId}',
    name: '${resource.name}',
    lastModified: '${resource.lastModified.split('T')[0]}'
  }`).join(',\n');

    return `// Configuration mise à jour automatiquement le ${new Date().toISOString().split('T')[0]}
const YEARLY_DATASETS: YearlyDataset[] = [
${configLines}
];`;
  }

  /**
   * Sauvegarde les résultats dans un fichier JSON
   */
  generateDiscoveryReport(results: any): string {
    const report = {
      discoveryDate: new Date().toISOString(),
      summary: results.summary,
      resources: results.validatedResources.map(r => ({
        year: r.year,
        resourceId: r.resourceId,
        name: r.name,
        isAccessible: r.isAccessible,
        recordCount: r.recordCount,
        hasExpectedFields: r.hasExpectedFields,
        lastModified: r.lastModified,
        testError: r.testError
      })),
      recommendedConfig: this.generateUpdatedConfig(results.summary.recommended)
    };

    return JSON.stringify(report, null, 2);
  }
}

// Export pour utilisation
export const cnesstDiscovery = new CNESSTResourceDiscovery();

// Fonction utilitaire pour exécuter la découverte
export const runCNESSTDiscovery = async () => {
  try {
    const results = await cnesstDiscovery.discoverAndValidateResources();
    
    console.log('\n📄 Rapport de découverte:');
    console.log(cnesstDiscovery.generateDiscoveryReport(results));
    
    console.log('\n🔧 Configuration recommandée:');
    console.log(cnesstDiscovery.generateUpdatedConfig(results.summary.recommended));
    
    return results;
    
  } catch (error) {
    console.error('❌ Erreur lors de la découverte:', error);
    throw error;
  }
};

// Export des types
export type { DiscoveredResource, CNESSTDataset };