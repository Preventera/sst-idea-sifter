// src/types/models.ts
// Types pour le système de modèles IA-SST optimisé pour 1000+ éléments

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

export interface ModelsDatabase {
  metadata: {
    total: number;
    version: string;
    lastUpdated: string;
    categories: string[];
    sectors: string[];
    tags: string[];
    difficulties: string[];
    technologies: string[];
  };
  models: ModelTemplate[];
  index: {
    byCategory: Record<string, string[]>;
    byTag: Record<string, string[]>;
    bySector: Record<string, string[]>;
    byDifficulty: Record<string, string[]>;
    byTechnology: Record<string, string[]>;
  };
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
  suggestions: string[];
  facets: {
    categories: { name: string; count: number }[];
    sectors: { name: string; count: number }[];
    difficulties: { name: string; count: number }[];
    tags: { name: string; count: number }[];
  };
}