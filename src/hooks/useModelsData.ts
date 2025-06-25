// src/hooks/useModelsData.ts
// Hook React optimisé pour la gestion de 1000+ modèles IA-SST

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { modelsService, ModelTemplate, SearchFilters, PaginationConfig, ModelSearchResult } from '@/services/models-service';

export interface UseModelsDataConfig {
  initialPageSize?: number;
  initialFilters?: Partial<SearchFilters>;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface UseModelsDataReturn {
  // État des données
  models: ModelTemplate[];
  loading: boolean;
  error: string | null;
  pagination: PaginationConfig;
  facets: ModelSearchResult['facets'];
  
  // État des filtres
  filters: SearchFilters;
  
  // Actions
  search: (searchTerm: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  clearFilters: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
  refreshData: () => Promise<void>;
  
  // Import/Export
  importModels: (jsonData: ModelTemplate[]) => Promise<{ success: boolean; count: number; errors: string[] }>;
  exportModels: () => Promise<ModelTemplate[]>;
  
  // Utilitaires
  getModelById: (id: string) => Promise<ModelTemplate | null>;
  statistics: {
    total: number;
    byCategory: Record<string, number>;
    byDifficulty: Record<string, number>;
    avgRating: number;
    totalViews: number;
  } | null;
}

const defaultFilters: SearchFilters = {
  searchTerm: '',
  categories: [],
  sectors: [],
  difficulties: [],
  tags: [],
  technologies: [],
  roiLevel: [],
  minRating: 0
};

const defaultPagination: PaginationConfig = {
  page: 1,
  pageSize: 20,
  total: 0,
  totalPages: 0
};

export const useModelsData = (config: UseModelsDataConfig = {}): UseModelsDataReturn => {
  const {
    initialPageSize = 20,
    initialFilters = {},
    autoRefresh = false,
    refreshInterval = 5 * 60 * 1000 // 5 minutes
  } = config;

  const { toast } = useToast();

  // État principal
  const [models, setModels] = useState<ModelTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationConfig>({
    ...defaultPagination,
    pageSize: initialPageSize
  });
  const [facets, setFacets] = useState<ModelSearchResult['facets']>({
    categories: [],
    sectors: [],
    difficulties: [],
    tags: []
  });
  const [filters, setFiltersState] = useState<SearchFilters>({
    ...defaultFilters,
    ...initialFilters
  });
  const [statistics, setStatistics] = useState<UseModelsDataReturn['statistics']>(null);

  // 🔄 FONCTION DE RECHERCHE PRINCIPALE
  const performSearch = useCallback(async (
    searchFilters: Partial<SearchFilters> = {},
    paginationConfig: Partial<PaginationConfig> = {}
  ) => {
    setLoading(true);
    setError(null);

    try {
      const result = await modelsService.searchModels(
        { ...filters, ...searchFilters },
        { ...pagination, ...paginationConfig }
      );

      setModels(result.models);
      setPagination(result.pagination);
      setFacets(result.facets);
      
      // Mettre à jour les filtres si nécessaire
      if (Object.keys(searchFilters).length > 0) {
        setFiltersState(prev => ({ ...prev, ...searchFilters }));
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la recherche';
      setError(errorMessage);
      console.error('Erreur recherche modèles:', err);
      
      toast({
        title: "Erreur de recherche",
        description: errorMessage,
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  }, [filters, pagination, toast]);

  // 🔍 RECHERCHE TEXTUELLE
  const search = useCallback((searchTerm: string) => {
    performSearch({ searchTerm }, { page: 1 });
  }, [performSearch]);

  // 🎛️ GESTION DES FILTRES
  const setFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    performSearch(newFilters, { page: 1 });
  }, [performSearch]);

  const clearFilters = useCallback(() => {
    const clearedFilters = { ...defaultFilters };
    setFiltersState(clearedFilters);
    performSearch(clearedFilters, { page: 1 });
  }, [performSearch]);

  // 📄 GESTION DE LA PAGINATION
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      performSearch({}, { page });
    }
  }, [performSearch, pagination.totalPages]);

  const setPageSize = useCallback((pageSize: number) => {
    performSearch({}, { page: 1, pageSize });
  }, [performSearch]);

  // 🔄 ACTUALISATION DES DONNÉES
  const refreshData = useCallback(async () => {
    await performSearch({}, {});
    
    // Charger les statistiques
    try {
      const stats = await modelsService.getStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Erreur chargement statistiques:', err);
    }
  }, [performSearch]);

  // 📥 IMPORT DE MODÈLES
  const importModels = useCallback(async (jsonData: ModelTemplate[]) => {
    setLoading(true);
    try {
      const result = await modelsService.importModels(jsonData);
      
      if (result.success) {
        toast({
          title: "Import réussi !",
          description: `${result.count} modèles importés avec succès.`,
          duration: 5000
        });
        
        // Actualiser les données après import
        await refreshData();
      } else {
        toast({
          title: "Erreurs d'import",
          description: `${result.errors.length} erreurs détectées.`,
          variant: "destructive",
          duration: 5000
        });
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'import';
      toast({
        title: "Erreur d'import",
        description: errorMessage,
        variant: "destructive",
        duration: 5000
      });
      return { success: false, count: 0, errors: [errorMessage] };
    } finally {
      setLoading(false);
    }
  }, [toast, refreshData]);

  // 📤 EXPORT DE MODÈLES
  const exportModels = useCallback(async () => {
    try {
      return await modelsService.exportModels();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'export';
      toast({
        title: "Erreur d'export",
        description: errorMessage,
        variant: "destructive",
        duration: 5000
      });
      return [];
    }
  }, [toast]);

  // 🔍 RÉCUPÉRATION D'UN MODÈLE PAR ID
  const getModelById = useCallback(async (id: string) => {
    try {
      return await modelsService.getModelById(id);
    } catch (err) {
      console.error('Erreur récupération modèle:', err);
      return null;
    }
  }, []);

  // 🚀 CHARGEMENT INITIAL
  useEffect(() => {
    refreshData();
  }, []); // Exécuté une seule fois au montage

  // ⏰ AUTO-REFRESH OPTIONNEL
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshData]);

  // 📊 MÉMORISATION DES VALEURS CALCULÉES
  const memoizedReturn = useMemo((): UseModelsDataReturn => ({
    // État des données
    models,
    loading,
    error,
    pagination,
    facets,
    
    // État des filtres
    filters,
    
    // Actions
    search,
    setFilters,
    clearFilters,
    goToPage,
    setPageSize,
    refreshData,
    
    // Import/Export
    importModels,
    exportModels,
    
    // Utilitaires
    getModelById,
    statistics
  }), [
    models,
    loading,
    error,
    pagination,
    facets,
    filters,
    search,
    setFilters,
    clearFilters,
    goToPage,
    setPageSize,
    refreshData,
    importModels,
    exportModels,
    getModelById,
    statistics
  ]);

  return memoizedReturn;
};

// 🎯 HOOK SIMPLIFIÉ POUR USAGE BASIQUE
export const useModelsSearch = (searchTerm: string = '', pageSize: number = 20) => {
  return useModelsData({
    initialPageSize: pageSize,
    initialFilters: { searchTerm }
  });
};

// 📊 HOOK POUR STATISTIQUES UNIQUEMENT
export const useModelsStatistics = () => {
  const [statistics, setStatistics] = useState<UseModelsDataReturn['statistics']>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await modelsService.getStatistics();
        setStatistics(stats);
      } catch (err) {
        console.error('Erreur chargement statistiques:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return { statistics, loading };
};

export default useModelsData;