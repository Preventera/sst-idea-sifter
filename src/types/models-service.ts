// src/services/models-service.ts
// Service optimisé pour gérer 1000+ modèles IA-SST avec performance

import { ModelTemplate, ModelsDatabase, SearchFilters, ModelSearchResult, PaginationConfig } from '@/types/models';

class ModelsService {
  private database: ModelsDatabase | null = null;
  private searchIndex: Map<string, Set<string>> = new Map();
  private cache: Map<string, ModelSearchResult> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly DEFAULT_PAGE_SIZE = 20;

  /**
   * Initialise le service avec la base de données des modèles
   */
  async initialize(modelsData: ModelTemplate[]) {
    console.log('🔄 Initialisation du service modèles...');
    
    this.database = this.buildDatabase(modelsData);
    this.buildSearchIndex();
    
    console.log(`✅ Service initialisé avec ${this.database.metadata.total} modèles`);
  }

  /**
   * Construit la base de données avec métadonnées et index
   */
  private buildDatabase(models: ModelTemplate[]): ModelsDatabase {
    const categories = [...new Set(models.map(m => m.category))];
    const sectors = [...new Set(models.flatMap(m => m.sector))];
    const tags = [...new Set(models.flatMap(m => m.tags))];
    const difficulties = [...new Set(models.map(m => m.difficulty))];
    const technologies = [...new Set(models.flatMap(m => m.implementation.technologies))];

    const index = {
      byCategory: this.buildIndex(models, m => [m.category]),
      byTag: this.buildIndex(models, m => m.tags),
      bySector: this.buildIndex(models, m => m.sector),
      byDifficulty: this.buildIndex(models, m => [m.difficulty]),
      byTechnology: this.buildIndex(models, m => m.implementation.technologies)
    };

    return {
      metadata: {
        total: models.length,
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        categories,
        sectors,
        tags,
        difficulties,
        technologies
      },
      models,
      index
    };
  }

  /**
   * Construit un index pour recherche rapide
   */
  private buildIndex(models: ModelTemplate[], keyExtractor: (model: ModelTemplate) => string[]): Record<string, string[]> {
    const index: Record<string, string[]> = {};
    
    models.forEach(model => {
      const keys = keyExtractor(model);
      keys.forEach(key => {
        if (!index[key]) index[key] = [];
        index[key].push(model.id);
      });
    });
    
    return index;
  }

  /**
   * Construit l'index de recherche textuelle
   */
  private buildSearchIndex() {
    if (!this.database) return;

    this.searchIndex.clear();
    
    this.database.models.forEach(model => {
      const searchableText = [
        model.title,
        model.description,
        model.subcategory,
        ...model.tags,
        ...model.sector,
        ...model.implementation.technologies
      ].join(' ').toLowerCase();

      const words = searchableText.split(/\s+/).filter(word => word.length > 2);
      
      words.forEach(word => {
        if (!this.searchIndex.has(word)) {
          this.searchIndex.set(word, new Set());
        }
        this.searchIndex.get(word)!.add(model.id);
      });
    });
  }

  /**
   * Recherche les modèles avec filtres et pagination
   */
  async searchModels(
    filters: Partial<SearchFilters> = {},
    page: number = 1,
    pageSize: number = this.DEFAULT_PAGE_SIZE
  ): Promise<ModelSearchResult> {
    if (!this.database) {
      throw new Error('Service non initialisé');
    }

    const cacheKey = this.getCacheKey(filters, page, pageSize);
    const cached = this.cache.get(cacheKey);
    
    if (cached && this.isCacheValid(cacheKey)) {
      return cached;
    }

    console.log('🔍 Recherche de modèles...', { filters, page, pageSize });

    // Étape 1: Recherche textuelle
    let candidateIds = new Set<string>();
    
    if (filters.searchTerm && filters.searchTerm.trim()) {
      candidateIds = this.performTextSearch(filters.searchTerm.toLowerCase());
    } else {
      candidateIds = new Set(this.database.models.map(m => m.id));
    }

    // Étape 2: Application des filtres
    const filteredIds = this.applyFilters(candidateIds, filters);

    // Étape 3: Tri par pertinence et métriques
    const sortedModels = this.sortModels(filteredIds, filters.searchTerm);

    // Étape 4: Pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedModels = sortedModels.slice(startIndex, endIndex);

    // Étape 5: Génération des facettes
    const facets = this.generateFacets(filteredIds);

    // Étape 6: Suggestions de recherche
    const suggestions = this.generateSuggestions(filters.searchTerm || '');

    const result: ModelSearchResult = {
      models: paginatedModels,
      pagination: {
        page,
        pageSize,
        total: sortedModels.length,
        totalPages: Math.ceil(sortedModels.length / pageSize)
      },
      filters: {
        searchTerm: filters.searchTerm || '',
        categories: filters.categories || [],
        sectors: filters.sectors || [],
        difficulties: filters.difficulties || [],
        tags: filters.tags || [],
        technologies: filters.technologies || [],
        roiLevel: filters.roiLevel || [],
        minRating: filters.minRating || 0
      },
      suggestions,
      facets
    };

    // Cache du résultat
    this.cache.set(cacheKey, result);
    
    return result;
  }

  /**
   * Recherche textuelle optimisée
   */
  private performTextSearch(searchTerm: string): Set<string> {
    const words = searchTerm.split(/\s+/).filter(word => word.length > 2);
    const results = new Set<string>();

    if (words.length === 0) return results;

    // Recherche exacte d'abord
    for (const [indexWord, modelIds] of this.searchIndex.entries()) {
      if (words.some(word => indexWord.includes(word) || word.includes(indexWord))) {
        modelIds.forEach(id => results.add(id));
      }
    }

    return results;
  }

  /**
   * Application des filtres sur les candidats
   */
  private applyFilters(candidateIds: Set<string>, filters: Partial<SearchFilters>): Set<string> {
    if (!this.database) return candidateIds;

    let filteredIds = new Set(candidateIds);

    // Filtre par catégorie
    if (filters.categories && filters.categories.length > 0) {
      const categoryIds = new Set<string>();
      filters.categories.forEach(category => {
        this.database!.index.byCategory[category]?.forEach(id => categoryIds.add(id));
      });
      filteredIds = new Set([...filteredIds].filter(id => categoryIds.has(id)));
    }

    // Filtre par secteur
    if (filters.sectors && filters.sectors.length > 0) {
      const sectorIds = new Set<string>();
      filters.sectors.forEach(sector => {
        this.database!.index.bySector[sector]?.forEach(id => sectorIds.add(id));
      });
      filteredIds = new Set([...filteredIds].filter(id => sectorIds.has(id)));
    }

    // Filtre par difficulté
    if (filters.difficulties && filters.difficulties.length > 0) {
      const difficultyIds = new Set<string>();
      filters.difficulties.forEach(difficulty => {
        this.database!.index.byDifficulty[difficulty]?.forEach(id => difficultyIds.add(id));
      });
      filteredIds = new Set([...filteredIds].filter(id => difficultyIds.has(id)));
    }

    // Filtre par tags
    if (filters.tags && filters.tags.length > 0) {
      filters.tags.forEach(tag => {
        const tagIds = new Set(this.database!.index.byTag[tag] || []);
        filteredIds = new Set([...filteredIds].filter(id => tagIds.has(id)));
      });
    }

    // Filtre par ROI
    if (filters.roiLevel && filters.roiLevel.length > 0) {
      filteredIds = new Set([...filteredIds].filter(id => {
        const model = this.getModelById(id);
        return model && filters.roiLevel!.includes(model.roi);
      }));
    }

    // Filtre par rating minimum
    if (filters.minRating && filters.minRating > 0) {
      filteredIds = new Set([...filteredIds].filter(id => {
        const model = this.getModelById(id);
        return model && model.metrics.rating >= filters.minRating!;
      }));
    }

    return filteredIds;
  }

  /**
   * Tri des modèles par pertinence
   */
  private sortModels(modelIds: Set<string>, searchTerm?: string): ModelTemplate[] {
    if (!this.database) return [];

    const models = [...modelIds]
      .map(id => this.getModelById(id))
      .filter(Boolean) as ModelTemplate[];

    return models.sort((a, b) => {
      // Tri par pertinence de recherche si terme présent
      if (searchTerm && searchTerm.trim()) {
        const scoreA = this.calculateRelevanceScore(a, searchTerm);
        const scoreB = this.calculateRelevanceScore(b, searchTerm);
        if (scoreA !== scoreB) return scoreB - scoreA;
      }

      // Tri secondaire par popularité (vues + usage)
      const popularityA = a.metrics.views + a.metrics.usage * 10;
      const popularityB = b.metrics.views + b.metrics.usage * 10;
      if (popularityA !== popularityB) return popularityB - popularityA;

      // Tri tertiaire par rating
      return b.metrics.rating - a.metrics.rating;
    });
  }

  /**
   * Calcule le score de pertinence pour un modèle
   */
  private calculateRelevanceScore(model: ModelTemplate, searchTerm: string): number {
    const term = searchTerm.toLowerCase();
    let score = 0;

    // Score élevé si le terme est dans le titre
    if (model.title.toLowerCase().includes(term)) score += 100;
    
    // Score moyen si dans la catégorie ou sous-catégorie
    if (model.category.toLowerCase().includes(term)) score += 50;
    if (model.subcategory.toLowerCase().includes(term)) score += 30;
    
    // Score faible si dans la description
    if (model.description.toLowerCase().includes(term)) score += 10;
    
    // Score pour les tags
    model.tags.forEach(tag => {
      if (tag.toLowerCase().includes(term)) score += 20;
    });

    return score;
  }

  /**
   * Génère les facettes pour l'interface de filtrage
   */
  private generateFacets(modelIds: Set<string>) {
    if (!this.database) return { categories: [], sectors: [], difficulties: [], tags: [] };

    const models = [...modelIds]
      .map(id => this.getModelById(id))
      .filter(Boolean) as ModelTemplate[];

    const categoryCounts = new Map<string, number>();
    const sectorCounts = new Map<string, number>();
    const difficultyCounts = new Map<string, number>();
    const tagCounts = new Map<string, number>();

    models.forEach(model => {
      // Compter les catégories
      categoryCounts.set(model.category, (categoryCounts.get(model.category) || 0) + 1);
      
      // Compter les difficultés
      difficultyCounts.set(model.difficulty, (difficultyCounts.get(model.difficulty) || 0) + 1);
      
      // Compter les secteurs
      model.sector.forEach(sector => {
        sectorCounts.set(sector, (sectorCounts.get(sector) || 0) + 1);
      });
      
      // Compter les tags (top 10)
      model.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return {
      categories: Array.from(categoryCounts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      sectors: Array.from(sectorCounts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      difficulties: Array.from(difficultyCounts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      tags: Array.from(tagCounts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10) // Top 10 tags seulement
    };
  }

  /**
   * Génère des suggestions de recherche
   */
  private generateSuggestions(searchTerm: string): string[] {
    if (!this.database || !searchTerm.trim()) return [];

    const suggestions = new Set<string>();
    const term = searchTerm.toLowerCase();

    // Suggestions basées sur les tags populaires
    this.database.metadata.tags
      .filter(tag => tag.toLowerCase().includes(term) && tag.toLowerCase() !== term)
      .slice(0, 5)
      .forEach(tag => suggestions.add(tag));

    // Suggestions basées sur les technologies
    this.database.metadata.technologies
      .filter(tech => tech.toLowerCase().includes(term) && tech.toLowerCase() !== term)
      .slice(0, 3)
      .forEach(tech => suggestions.add(tech));

    return Array.from(suggestions).slice(0, 8);
  }

  /**
   * Récupère un modèle par son ID
   */
  private getModelById(id: string): ModelTemplate | undefined {
    return this.database?.models.find(m => m.id === id);
  }

  /**
   * Génère une clé de cache
   */
  private getCacheKey(filters: Partial<SearchFilters>, page: number, pageSize: number): string {
    return JSON.stringify({ filters, page, pageSize });
  }

  /**
   * Vérifie si le cache est encore valide
   */
  private isCacheValid(cacheKey: string): boolean {
    // Implémentation simple - dans un vrai système, on stockerait le timestamp
    return this.cache.has(cacheKey);
  }

  /**
   * Vide le cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Obtient les métadonnées de la base
   */
  getMetadata() {
    return this.database?.metadata;
  }

  /**
   * Obtient un modèle spécifique
   */
  async getModel(id: string): Promise<ModelTemplate | null> {
    const model = this.getModelById(id);
    
    if (model) {
      // Incrémenter les vues (dans un vrai système, on ferait ça côté serveur)
      model.metrics.views++;
    }
    
    return model || null;
  }
}

// Instance singleton
export const modelsService = new ModelsService();
export default modelsService;