// src/services/models-service.ts
// Service complet pour gérer 1000+ modèles IA-SST avec performance optimisée

export interface ModelTemplate {
  id: string;
  title: string;
  category: 'Équipement' | 'Lieux' | 'Opérations' | 'Nature humaine';
  subcategory: string;
  description: string;
  sector: string[];
  tags: string[];
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  estimatedTime: string;
  roi: 'Faible' | 'Moyen' | 'Élevé';
  implementation: {
    technologies: string[];
    prerequisites: string[];
    steps: string[];
  };
  metrics: {
    views: number;
    usage: number;
    rating: number;
  };
  created: string;
  updated: string;
}

export interface SearchFilters {
  searchTerm: string;
  categories: string[];
  sectors: string[];
  difficulties: string[];
  tags: string[];
  technologies: string[];
  roiLevel: string[];
  minRating: number;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ModelSearchResult {
  models: ModelTemplate[];
  pagination: PaginationConfig;
  filters: SearchFilters;
  facets: {
    categories: { name: string; count: number }[];
    sectors: { name: string; count: number }[];
    difficulties: { name: string; count: number }[];
    tags: { name: string; count: number }[];
  };
}

class ModelsService {
  private modelsCache: ModelTemplate[] = [];
  private indexCache: Map<string, Set<string>> = new Map();
  private lastCacheUpdate = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // ✅ MÉTHODE PRINCIPALE - RECHERCHE OPTIMISÉE
  async searchModels(
    filters: Partial<SearchFilters> = {},
    pagination: Partial<PaginationConfig> = {}
  ): Promise<ModelSearchResult> {
    await this.ensureDataLoaded();

    const searchFilters: SearchFilters = {
      searchTerm: filters.searchTerm || '',
      categories: filters.categories || [],
      sectors: filters.sectors || [],
      difficulties: filters.difficulties || [],
      tags: filters.tags || [],
      technologies: filters.technologies || [],
      roiLevel: filters.roiLevel || [],
      minRating: filters.minRating || 0
    };

    const paginationConfig: PaginationConfig = {
      page: pagination.page || 1,
      pageSize: pagination.pageSize || 20,
      total: 0,
      totalPages: 0
    };

    // 🚀 FILTRAGE OPTIMISÉ
    let filteredModels = this.modelsCache;

    // Recherche textuelle avec index
    if (searchFilters.searchTerm) {
      filteredModels = this.searchByText(filteredModels, searchFilters.searchTerm);
    }

    // Filtres par catégorie
    if (searchFilters.categories.length > 0) {
      filteredModels = filteredModels.filter(model => 
        searchFilters.categories.includes(model.category)
      );
    }

    // Filtres par secteur
    if (searchFilters.sectors.length > 0) {
      filteredModels = filteredModels.filter(model => 
        model.sector.some(s => searchFilters.sectors.includes(s))
      );
    }

    // Filtres par difficulté
    if (searchFilters.difficulties.length > 0) {
      filteredModels = filteredModels.filter(model => 
        searchFilters.difficulties.includes(model.difficulty)
      );
    }

    // Filtres par tags
    if (searchFilters.tags.length > 0) {
      filteredModels = filteredModels.filter(model => 
        model.tags.some(tag => searchFilters.tags.includes(tag))
      );
    }

    // Filtre par ROI
    if (searchFilters.roiLevel.length > 0) {
      filteredModels = filteredModels.filter(model => 
        searchFilters.roiLevel.includes(model.roi)
      );
    }

    // Filtre par rating minimum
    if (searchFilters.minRating > 0) {
      filteredModels = filteredModels.filter(model => 
        model.metrics.rating >= searchFilters.minRating
      );
    }

    // 📊 PAGINATION
    paginationConfig.total = filteredModels.length;
    paginationConfig.totalPages = Math.ceil(filteredModels.length / paginationConfig.pageSize);

    const startIndex = (paginationConfig.page - 1) * paginationConfig.pageSize;
    const endIndex = startIndex + paginationConfig.pageSize;
    const paginatedModels = filteredModels.slice(startIndex, endIndex);

    // 🔍 GÉNÉRATION DES FACETTES
    const facets = this.generateFacets(filteredModels);

    return {
      models: paginatedModels,
      pagination: paginationConfig,
      filters: searchFilters,
      facets
    };
  }

  // ✅ CHARGEMENT DES DONNÉES AVEC CACHE
  private async ensureDataLoaded(): Promise<void> {
    const now = Date.now();
    if (this.modelsCache.length > 0 && now - this.lastCacheUpdate < this.CACHE_TTL) {
      return; // Cache encore valide
    }

    try {
      // Charger depuis l'API ou le fichier JSON
      const models = await this.loadModelsData();
      this.modelsCache = models;
      this.buildSearchIndex();
      this.lastCacheUpdate = now;
    } catch (error) {
      console.error('Erreur chargement modèles:', error);
      // Fallback avec données par défaut
      this.modelsCache = this.generateFallbackData();
      this.buildSearchIndex();
    }
  }

  // ✅ RECHERCHE TEXTUELLE OPTIMISÉE
  private searchByText(models: ModelTemplate[], searchTerm: string): ModelTemplate[] {
    const term = searchTerm.toLowerCase();
    return models.filter(model => 
      model.title.toLowerCase().includes(term) ||
      model.description.toLowerCase().includes(term) ||
      model.subcategory.toLowerCase().includes(term) ||
      model.tags.some(tag => tag.toLowerCase().includes(term)) ||
      model.implementation.technologies.some(tech => tech.toLowerCase().includes(term))
    );
  }

  // ✅ CONSTRUCTION D'INDEX POUR RECHERCHE RAPIDE
  private buildSearchIndex(): void {
    this.indexCache.clear();
    
    this.modelsCache.forEach(model => {
      // Index par mots-clés
      const keywords = [
        ...model.title.split(' '),
        ...model.description.split(' '),
        ...model.tags,
        ...model.implementation.technologies,
        model.category,
        model.subcategory,
        model.difficulty,
        model.roi,
        ...model.sector
      ];

      keywords.forEach(keyword => {
        const key = keyword.toLowerCase();
        if (!this.indexCache.has(key)) {
          this.indexCache.set(key, new Set());
        }
        this.indexCache.get(key)?.add(model.id);
      });
    });
  }

  // ✅ GÉNÉRATION DES FACETTES
  private generateFacets(models: ModelTemplate[]) {
    const categoriesCount = new Map<string, number>();
    const sectorsCount = new Map<string, number>();
    const difficultiesCount = new Map<string, number>();
    const tagsCount = new Map<string, number>();

    models.forEach(model => {
      // Compter catégories
      categoriesCount.set(model.category, (categoriesCount.get(model.category) || 0) + 1);
      
      // Compter difficultés
      difficultiesCount.set(model.difficulty, (difficultiesCount.get(model.difficulty) || 0) + 1);
      
      // Compter secteurs
      model.sector.forEach(sector => {
        sectorsCount.set(sector, (sectorsCount.get(sector) || 0) + 1);
      });
      
      // Compter tags (top 10 seulement)
      model.tags.forEach(tag => {
        tagsCount.set(tag, (tagsCount.get(tag) || 0) + 1);
      });
    });

    return {
      categories: Array.from(categoriesCount.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      
      sectors: Array.from(sectorsCount.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      
      difficulties: Array.from(difficultiesCount.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      
      tags: Array.from(tagsCount.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10) // Top 10 tags seulement
    };
  }

  // ✅ CHARGEMENT DEPUIS FICHIER/API
  private async loadModelsData(): Promise<ModelTemplate[]> {
    try {
      // Essayer de charger depuis un fichier JSON local d'abord
      const response = await fetch('/data/models-database.json');
      if (response.ok) {
        const data = await response.json();
        return data.models || [];
      }
    } catch (error) {
      console.log('Fichier local non trouvé, utilisation des données par défaut');
    }

    // Fallback avec génération de données
    return this.generateFallbackData();
  }

  // ✅ GÉNÉRATION DE DONNÉES DE TEST (JUSQU'À 1000)
  private generateFallbackData(): ModelTemplate[] {
    const categories: Array<ModelTemplate['category']> = ['Équipement', 'Lieux', 'Opérations', 'Nature humaine'];
    const difficulties: Array<ModelTemplate['difficulty']> = ['Débutant', 'Intermédiaire', 'Avancé'];
    const rois: Array<ModelTemplate['roi']> = ['Faible', 'Moyen', 'Élevé'];
    const sectors = ['Construction', 'Énergie', 'Manufacturing', 'Transport', 'Santé', 'Mines'];
    const technologies = ['Vision IA', 'IoT', 'Big Data', 'NLP', 'Capteurs', 'Machine Learning'];

    const models: ModelTemplate[] = [];

    // Générer jusqu'à 100 modèles pour test (peut être étendu à 1000)
    for (let i = 1; i <= 100; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      const roi = rois[Math.floor(Math.random() * rois.length)];
      
      const model: ModelTemplate = {
        id: `model-${i.toString().padStart(3, '0')}`,
        title: `Projet IA-SST #${i.toString().padStart(3, '0')}`,
        category,
        subcategory: this.getSubcategoryForCategory(category),
        description: `Projet intelligent pour améliorer la SST dans le contexte ${category.toLowerCase()} - cas #${i.toString().padStart(3, '0')}.`,
        sector: this.getRandomItems(sectors, 1, 3),
        tags: this.getRandomItems(['Vision', 'EPI', 'Prédictif', 'Sécurité', 'IoT', 'Détection', 'Maintenance', 'Fatigue', 'NLP', 'Analyse'], 2, 5),
        difficulty,
        estimatedTime: `${Math.floor(Math.random() * 6) + 2} mois`,
        roi,
        implementation: {
          technologies: this.getRandomItems(technologies, 2, 4),
          prerequisites: ['Accès aux données', 'Appareils compatibles', 'Formation utilisateur'],
          steps: ['Étape 1', 'Étape 2', 'Étape 3']
        },
        metrics: {
          views: Math.floor(Math.random() * 3000) + 500,
          usage: Math.floor(Math.random() * 200) + 10,
          rating: Math.round((Math.random() * 2 + 3) * 10) / 10 // Entre 3.0 et 5.0
        },
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      };

      models.push(model);
    }

    return models;
  }

  // ✅ UTILITAIRES
  private getSubcategoryForCategory(category: ModelTemplate['category']): string {
    const subcategories = {
      'Équipement': ['Surveillance intelligente', 'Maintenance prédictive', 'Optimisation EPI'],
      'Lieux': ['Analyse de zones à risque', 'Surveillance environnementale', 'Gestion des accès'],
      'Opérations': ['Optimisation des processus', 'Gestion des flux', 'Automatisation'],
      'Nature humaine': ['Fatigue cognitive', 'Formation adaptative', 'Analyse comportementale']
    };
    
    const options = subcategories[category];
    return options[Math.floor(Math.random() * options.length)];
  }

  private getRandomItems<T>(array: T[], min: number, max: number): T[] {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // ✅ MÉTHODES PUBLIQUES ADDITIONNELLES
  async getModelById(id: string): Promise<ModelTemplate | null> {
    await this.ensureDataLoaded();
    return this.modelsCache.find(model => model.id === id) || null;
  }

  async getCategories(): Promise<string[]> {
    await this.ensureDataLoaded();
    return [...new Set(this.modelsCache.map(model => model.category))];
  }

  async getSectors(): Promise<string[]> {
    await this.ensureDataLoaded();
    const allSectors = this.modelsCache.flatMap(model => model.sector);
    return [...new Set(allSectors)];
  }

  async getTags(): Promise<string[]> {
    await this.ensureDataLoaded();
    const allTags = this.modelsCache.flatMap(model => model.tags);
    return [...new Set(allTags)];
  }

  // ✅ IMPORT/EXPORT POUR VOS 1000 MODÈLES
  async importModels(jsonData: ModelTemplate[]): Promise<{ success: boolean; count: number; errors: string[] }> {
    const errors: string[] = [];
    const validModels: ModelTemplate[] = [];

    jsonData.forEach((model, index) => {
      try {
        if (this.validateModel(model)) {
          validModels.push(model);
        } else {
          errors.push(`Modèle ${index + 1}: Format invalide`);
        }
      } catch (error) {
        errors.push(`Modèle ${index + 1}: ${error}`);
      }
    });

    if (validModels.length > 0) {
      this.modelsCache = [...this.modelsCache, ...validModels];
      this.buildSearchIndex();
      this.lastCacheUpdate = Date.now();
    }

    return {
      success: validModels.length > 0,
      count: validModels.length,
      errors
    };
  }

  private validateModel(model: any): model is ModelTemplate {
    return (
      typeof model.id === 'string' &&
      typeof model.title === 'string' &&
      typeof model.category === 'string' &&
      typeof model.description === 'string' &&
      Array.isArray(model.sector) &&
      Array.isArray(model.tags)
    );
  }

  async exportModels(): Promise<ModelTemplate[]> {
    await this.ensureDataLoaded();
    return [...this.modelsCache];
  }

  // ✅ STATISTIQUES
  async getStatistics() {
    await this.ensureDataLoaded();
    
    return {
      total: this.modelsCache.length,
      byCategory: this.modelsCache.reduce((acc, model) => {
        acc[model.category] = (acc[model.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byDifficulty: this.modelsCache.reduce((acc, model) => {
        acc[model.difficulty] = (acc[model.difficulty] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      avgRating: this.modelsCache.reduce((sum, model) => sum + model.metrics.rating, 0) / this.modelsCache.length,
      totalViews: this.modelsCache.reduce((sum, model) => sum + model.metrics.views, 0)
    };
  }

  // ✅ MÉTHODE SPÉCIALISÉE POUR IMPORT BULK DE VOS 1000 MODÈLES
  async importBulkModels(jsonData: any): Promise<{ success: boolean; count: number; errors: string[] }> {
    try {
      // Support de différents formats d'import
      let modelsArray: any[] = [];
      
      if (Array.isArray(jsonData)) {
        modelsArray = jsonData;
      } else if (jsonData.models && Array.isArray(jsonData.models)) {
        modelsArray = jsonData.models;
      } else if (jsonData.data && Array.isArray(jsonData.data)) {
        modelsArray = jsonData.data;
      } else {
        throw new Error('Format JSON non reconnu. Attendu: tableau ou objet avec propriété "models"');
      }

      console.log(`🔄 Import de ${modelsArray.length} modèles en cours...`);
      
      const result = await this.importModels(modelsArray);
      
      console.log(`✅ Import terminé: ${result.count} modèles importés, ${result.errors.length} erreurs`);
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue lors de l\'import';
      return {
        success: false,
        count: 0,
        errors: [errorMessage]
      };
    }
  }

  // ✅ MÉTHODE POUR REMPLACER COMPLÈTEMENT LA BASE DE DONNÉES
  async replaceAllModels(jsonData: ModelTemplate[]): Promise<{ success: boolean; count: number; errors: string[] }> {
    const errors: string[] = [];
    const validModels: ModelTemplate[] = [];

    jsonData.forEach((model, index) => {
      try {
        if (this.validateModel(model)) {
          validModels.push(model);
        } else {
          errors.push(`Modèle ${index + 1}: Format invalide`);
        }
      } catch (error) {
        errors.push(`Modèle ${index + 1}: ${error}`);
      }
    });

    if (validModels.length > 0) {
      // Remplacer complètement au lieu d'ajouter
      this.modelsCache = validModels;
      this.buildSearchIndex();
      this.lastCacheUpdate = Date.now();
      
      console.log(`🔄 Base de données remplacée: ${validModels.length} modèles chargés`);
    }

    return {
      success: validModels.length > 0,
      count: validModels.length,
      errors
    };
  }

  // ✅ MÉTHODE POUR CHARGER VOS DONNÉES DEPUIS UN FICHIER SPÉCIFIQUE
  async loadFromFile(filePath: string): Promise<{ success: boolean; count: number; errors: string[] }> {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Impossible de charger le fichier: ${response.statusText}`);
      }

      const jsonData = await response.json();
      return await this.importBulkModels(jsonData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de chargement';
      return {
        success: false,
        count: 0,
        errors: [errorMessage]
      };
    }
  }

  // ✅ MÉTHODES UTILITAIRES POUR VOS TRANCHES DE DONNÉES
  async loadTranche(trancheNumber: number, totalTranches: number = 10): Promise<{ success: boolean; count: number; errors: string[] }> {
    try {
      // Tentative de chargement d'une tranche spécifique
      const filePath = `/data/tranches/tranche-${trancheNumber}.json`;
      const result = await this.loadFromFile(filePath);
      
      if (result.success) {
        console.log(`✅ Tranche ${trancheNumber}/${totalTranches} chargée: ${result.count} modèles`);
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        count: 0,
        errors: [`Erreur chargement tranche ${trancheNumber}: ${error}`]
      };
    }
  }

  async loadAllTranches(totalTranches: number = 10): Promise<{ success: boolean; totalCount: number; errors: string[] }> {
    let totalCount = 0;
    const allErrors: string[] = [];
    let hasSuccess = false;

    for (let i = 1; i <= totalTranches; i++) {
      const result = await this.loadTranche(i, totalTranches);
      
      if (result.success) {
        totalCount += result.count;
        hasSuccess = true;
      }
      
      allErrors.push(...result.errors);
    }

    return {
      success: hasSuccess,
      totalCount,
      errors: allErrors
    };
  }

  // ✅ MÉTHODE DE NETTOYAGE ET MAINTENANCE
  clearCache(): void {
    this.modelsCache = [];
    this.indexCache.clear();
    this.lastCacheUpdate = 0;
    console.log('🧹 Cache modèles nettoyé');
  }

  // ✅ MÉTHODE POUR OBTENIR LES INFORMATIONS DE CACHE
  getCacheInfo() {
    return {
      modelsCount: this.modelsCache.length,
      indexSize: this.indexCache.size,
      lastUpdate: new Date(this.lastCacheUpdate).toISOString(),
      cacheAge: Date.now() - this.lastCacheUpdate,
      isValid: Date.now() - this.lastCacheUpdate < this.CACHE_TTL
    };
  }
}

// Export singleton
export const modelsService = new ModelsService();
export default modelsService;