// src/components/models/ModelsBrowser.tsx
// Version simplifiée et fonctionnelle pour éviter les erreurs JSX

import React, { useState, useCallback, useRef } from 'react';
import { useModelsData } from '@/hooks/useModelsData';
import { ModelTemplate } from '@/services/models-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Download,
  Upload,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Star,
  Eye,
  Users,
  Clock,
  TrendingUp
} from 'lucide-react';

interface ModelsBrowserProps {
  config?: any;
  onModelSelect?: (model: ModelTemplate) => void;
  showImportExport?: boolean;
  showStatistics?: boolean;
  compact?: boolean;
}

export const ModelsBrowser: React.FC<ModelsBrowserProps> = ({
  config = {},
  onModelSelect,
  showImportExport = true,
  showStatistics = true,
  compact = false
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // État local
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);

  // Hook principal pour les données
  const {
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
    statistics
  } = useModelsData(config);

  // 🔍 GESTION DE LA RECHERCHE
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    search(searchTerm);
  }, [search]);

  // 📥 GESTION DE L'IMPORT
  const handleFileImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      
      if (!Array.isArray(jsonData)) {
        throw new Error('Le fichier doit contenir un tableau de modèles');
      }

      await importModels(jsonData);
    } catch (err) {
      toast({
        title: "Erreur d'import",
        description: err instanceof Error ? err.message : "Format de fichier invalide",
        variant: "destructive",
        duration: 5000
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [importModels, toast]);

  // 📤 GESTION DE L'EXPORT
  const handleExport = useCallback(async () => {
    try {
      const data = await exportModels();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `models-database-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export réussi !",
        description: `${data.length} modèles exportés.`,
        duration: 3000
      });
    } catch (err) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les données",
        variant: "destructive",
        duration: 5000
      });
    }
  }, [exportModels, toast]);

  // 🎨 RENDU DES CARTES DE MODÈLES
  const renderModelCard = useCallback((model: ModelTemplate) => {
    return (
      <Card 
        key={model.id} 
        className="cursor-pointer transition-all hover:shadow-lg"
        onClick={() => {
          onModelSelect?.(model);
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-2">
              {model.title}
            </CardTitle>
            <Badge variant={
              model.difficulty === 'Avancé' ? 'default' :
              model.difficulty === 'Intermédiaire' ? 'secondary' : 'outline'
            }>
              {model.difficulty}
            </Badge>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {model.category}
            </Badge>
            <Badge variant={
              model.roi === 'Élevé' ? 'default' :
              model.roi === 'Moyen' ? 'secondary' : 'outline'
            } className="text-xs">
              {model.roi}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {model.description}
          </p>

          <div className="flex flex-wrap gap-1 mb-3">
            {model.tags.slice(0, 4).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {model.tags.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{model.tags.length - 4}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {model.metrics.views}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {model.metrics.usage}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {model.metrics.rating}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {model.estimatedTime}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }, [onModelSelect]);

  // 🔄 GESTION DU LOADING
  if (loading && models.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Chargement des modèles...</span>
      </div>
    );
  }

  // ❌ GESTION DES ERREURS
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Erreur: {error}</div>
        <Button onClick={refreshData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec recherche et actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher dans les modèles IA-SST..."
              onChange={handleSearchChange}
              className="pl-10"
              value={filters.searchTerm}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sélecteur de vue */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Actions Import/Export */}
          {showImportExport && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Import
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </>
          )}

          {/* Bouton actualiser */}
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      {showStatistics && statistics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{statistics.total}</div>
                <div className="text-sm text-gray-500">Total modèles</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">{statistics.avgRating.toFixed(1)}</div>
                <div className="text-sm text-gray-500">Note moyenne</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{Math.round(statistics.totalViews / 1000)}k</div>
                <div className="text-sm text-gray-500">Vues totales</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{Object.keys(statistics.byCategory).length}</div>
                <div className="text-sm text-gray-500">Catégories</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Résultats et modèles */}
      <div className="space-y-4">
        {/* Indicateur de résultats */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {pagination.total > 0 ? (
              <>
                Affichage de {(pagination.page - 1) * pagination.pageSize + 1}-
                {Math.min(pagination.page * pagination.pageSize, pagination.total)} sur {pagination.total} modèles
                {filters.searchTerm && ` pour "${filters.searchTerm}"`}
              </>
            ) : (
              'Aucun modèle trouvé'
            )}
          </div>
          
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Chargement...
            </div>
          )}
        </div>

        {/* Grille des modèles */}
        {models.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-4'
          }>
            {models.map(renderModelCard)}
          </div>
        ) : !loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {filters.searchTerm 
                ? 'Aucun modèle ne correspond à vos critères' 
                : 'Aucun modèle disponible'}
            </div>
            {filters.searchTerm && (
              <Button variant="outline" onClick={clearFilters}>
                Effacer les filtres
              </Button>
            )}
          </div>
        ) : null}

        {/* Pagination simple */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Page {pagination.page} sur {pagination.totalPages}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelsBrowser;