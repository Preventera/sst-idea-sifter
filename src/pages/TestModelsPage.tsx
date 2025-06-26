// src/pages/TestModelsPage.tsx
// Page de test pour valider les 10 modèles JSON enrichis

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Eye, 
  Users, 
  Star, 
  Shield, 
  CheckCircle,
  AlertTriangle,
  Activity,
  Database,
  Settings
} from 'lucide-react';

import { testModelsJSON, testModelsCount, testModelsByCategory } from '../data/test-models';
import { convertJSONToProject } from '../utils/json-converter';
import { IGNITIAModelJSON } from '../types/project-models';

const TestModelsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [selectedModel, setSelectedModel] = useState<IGNITIAModelJSON | null>(null);

  // Conversion des modèles JSON vers format Project pour comparaison
  const convertedProjects = useMemo(() => {
    return testModelsJSON.map(convertJSONToProject);
  }, []);

  // Filtrage des modèles
  const filteredModels = useMemo(() => {
    return testModelsJSON.filter(model => {
      const matchesSearch = model.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.mots_cles.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'Tous' || model.contexte === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Statistiques
  const stats = useMemo(() => {
    const totalViews = testModelsJSON.reduce((sum, model) => sum + model.metrics.views, 0);
    const totalUsage = testModelsJSON.reduce((sum, model) => sum + model.metrics.usage, 0);
    const avgRating = testModelsJSON.reduce((sum, model) => sum + model.metrics.rating, 0) / testModelsJSON.length;
    
    return { totalViews, totalUsage, avgRating: avgRating.toFixed(1) };
  }, []);

  const categories = ['Tous', ...Object.keys(testModelsByCategory)];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Test des Modèles JSON</h1>
          <p className="text-muted-foreground">
            Validation de {testModelsCount} modèles avec format JSON enrichi
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            <Database className="w-4 h-4 mr-1" />
            {testModelsCount} modèles
          </Badge>
          <Badge variant="outline">
            <CheckCircle className="w-4 h-4 mr-1" />
            Build réussi
          </Badge>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Vues totales</p>
                <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Usage total</p>
                <p className="text-2xl font-bold">{stats.totalUsage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Note moyenne</p>
                <p className="text-2xl font-bold">{stats.avgRating}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Conformité</p>
                <p className="text-2xl font-bold">100%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contrôles de filtrage */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans les modèles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex space-x-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category} {category !== 'Tous' && `(${testModelsByCategory[category]})`}
            </Button>
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">Vue Grille</TabsTrigger>
          <TabsTrigger value="list">Vue Liste</TabsTrigger>
          <TabsTrigger value="comparison">Comparaison</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((model) => (
              <Card key={model.project_id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">{model.nom}</CardTitle>
                    <Badge 
                      variant={
                        model.priorite === 'Élevée' ? 'destructive' :
                        model.priorite === 'Moyenne' ? 'default' : 'secondary'
                      }
                    >
                      {model.priorite}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline">{model.contexte}</Badge>
                    <Badge variant="outline">{model.niveau}</Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {model.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {model.mots_cles.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {model.mots_cles.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{model.mots_cles.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{model.metrics.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{model.metrics.usage}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{model.metrics.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {model.indicateurs.conformite_loi_25 && (
                        <CheckCircle className="w-4 h-4 text-green-500" title="Conforme Loi 25" />
                      )}
                      {model.indicateurs.audit_biais_valide && (
                        <Shield className="w-4 h-4 text-blue-500" title="Audit biais validé" />
                      )}
                      {model.indicateurs.explicabilite_activee && (
                        <Activity className="w-4 h-4 text-purple-500" title="Explicabilité activée" />
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setSelectedModel(model)}
                  >
                    Voir détails
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <div className="space-y-4">
            {filteredModels.map((model) => (
              <Card key={model.project_id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold">{model.nom}</h3>
                        <Badge variant="outline">{model.contexte}</Badge>
                        <Badge variant="outline">{model.niveau}</Badge>
                        <Badge 
                          variant={
                            model.priorite === 'Élevée' ? 'destructive' :
                            model.priorite === 'Moyenne' ? 'default' : 'secondary'
                          }
                        >
                          {model.priorite}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{model.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <span>👁️ {model.metrics.views} vues</span>
                        <span>👥 {model.metrics.usage} utilisations</span>
                        <span>⭐ {model.metrics.rating}/5</span>
                        <span>🔒 {model.cybersecurite.donnees_sensibles ? 'Données sensibles' : 'Données publiques'}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedModel(model)}
                    >
                      Détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Format JSON Enrichi (Nouveau)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-96">
                  {JSON.stringify(testModelsJSON[0], null, 2)}
                </pre>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Format Project IGNITIA (Converti)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-96">
                  {JSON.stringify(convertedProjects[0], null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de détails */}
      {selectedModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{selectedModel.nom}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedModel(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contenu détaillé du modèle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Informations générales</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>ID:</strong> {selectedModel.project_id}</p>
                    <p><strong>Contexte:</strong> {selectedModel.contexte}</p>
                    <p><strong>Niveau:</strong> {selectedModel.niveau}</p>
                    <p><strong>Priorité:</strong> {selectedModel.priorite}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Métriques</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Vues:</strong> {selectedModel.metrics.views}</p>
                    <p><strong>Usage:</strong> {selectedModel.metrics.usage}</p>
                    <p><strong>Note:</strong> {selectedModel.metrics.rating}/5</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedModel.description}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedModel.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">{tech}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Secteurs</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedModel.secteur.map((secteur) => (
                    <Badge key={secteur} variant="outline">{secteur}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Gouvernance & Cybersécurité</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Données sensibles:</strong> {selectedModel.cybersecurite.donnees_sensibles ? 'Oui' : 'Non'}</p>
                    <p><strong>Mesures:</strong> {selectedModel.cybersecurite.mesures.join(', ')}</p>
                  </div>
                  <div>
                    <p><strong>Conformité:</strong> {selectedModel.gouvernance_ethique.conformite.join(', ')}</p>
                    <p><strong>Audit:</strong> {selectedModel.gouvernance_ethique.audit}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TestModelsPage;