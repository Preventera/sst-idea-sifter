// src/pages/ModelsPage.tsx
// Page modèles intégrée - Remplace l'ancienne pour supporter 1000+ modèles

import React, { useState } from 'react';
import { ModelsBrowser } from '@/components/models/ModelsBrowser';
import { ModelTemplate } from '@/services/models-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Star,
  Clock,
  TrendingUp,
  Users,
  Eye,
  Tag,
  Building,
  Lightbulb,
  Settings,
  Download,
  BookOpen
} from 'lucide-react';

const ModelsPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState<ModelTemplate | null>(null);
  const [showModelDetail, setShowModelDetail] = useState(false);

  // 🔍 GESTION DE LA SÉLECTION DE MODÈLE
  const handleModelSelect = (model: ModelTemplate) => {
    setSelectedModel(model);
    setShowModelDetail(true);
  };

  // 🚀 CRÉATION D'UN PROJET BASÉ SUR LE MODÈLE
  const handleCreateProject = (model: ModelTemplate) => {
    // Naviguer vers la page de création avec les données pré-remplies
    navigate('/project/new', {
      state: {
        templateModel: model,
        prefillData: {
          name: model.title,
          description: model.description,
          sector: model.sector[0] || '',
          // Pré-remplir quelques scores basés sur le modèle
          scores: {
            technicalFeasibility: model.difficulty === 'Débutant' ? 8 : model.difficulty === 'Intermédiaire' ? 6 : 4,
            businessValue: model.roi === 'Élevé' ? 8 : model.roi === 'Moyen' ? 6 : 4,
            riskReduction: 7,
            implementationCost: model.difficulty === 'Débutant' ? 7 : model.difficulty === 'Intermédiaire' ? 5 : 3,
            timeToMarket: 6,
            stakeholderSupport: 6,
            regulatoryCompliance: 7
          }
        }
      }
    });

    toast({
      title: "Modèle appliqué !",
      description: `Le projet "${model.title}" a été pré-configuré.`,
      duration: 3000
    });
  };

  // 🎨 RENDU DU DÉTAIL DU MODÈLE
  const renderModelDetail = () => {
    if (!selectedModel) return null;

    return (
      <Dialog open={showModelDetail} onOpenChange={setShowModelDetail}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Lightbulb className="h-6 w-6 text-blue-600" />
              {selectedModel.title}
            </DialogTitle>
          </DialogHeader>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Colonne principale */}
            <div className="md:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">{selectedModel.description}</p>
              </div>

              {/* Technologies */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Technologies requises
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedModel.implementation.technologies.map(tech => (
                    <Badge key={tech} variant="outline">{tech}</Badge>
                  ))}
                </div>
              </div>

              {/* Prérequis */}
              <div>
                <h3 className="font-semibold mb-2">Prérequis</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {selectedModel.implementation.prerequisites.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              {/* Étapes d'implémentation */}
              <div>
                <h3 className="font-semibold mb-2">Étapes d'implémentation</h3>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  {selectedModel.implementation.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Sidebar avec métadonnées */}
            <div className="space-y-4">
              {/* Badges principaux */}
              <div className="space-y-2">
                <Badge variant={
                  selectedModel.category === 'Équipement' ? 'default' :
                  selectedModel.category === 'Lieux' ? 'secondary' :
                  selectedModel.category === 'Opérations' ? 'destructive' : 'outline'
                } className="w-full justify-center">
                  {selectedModel.category}
                </Badge>
                
                <Badge variant={
                  selectedModel.difficulty === 'Avancé' ? 'destructive' :
                  selectedModel.difficulty === 'Intermédiaire' ? 'default' : 'secondary'
                } className="w-full justify-center">
                  {selectedModel.difficulty}
                </Badge>
                
                <Badge variant={
                  selectedModel.roi === 'Élevé' ? 'default' :
                  selectedModel.roi === 'Moyen' ? 'secondary' : 'outline'
                } className="w-full justify-center">
                  ROI {selectedModel.roi}
                </Badge>
              </div>

              <Separator />

              {/* Métriques */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Vues</span>
                  </div>
                  <span className="font-medium">{selectedModel.metrics.views.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Utilisations</span>
                  </div>
                  <span className="font-medium">{selectedModel.metrics.usage}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Note</span>
                  </div>
                  <span className="font-medium">{selectedModel.metrics.rating}/5</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Durée estimée</span>
                  </div>
                  <span className="font-medium">{selectedModel.estimatedTime}</span>
                </div>
              </div>

              <Separator />

              {/* Secteurs */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Secteurs
                </h4>
                <div className="space-y-1">
                  {selectedModel.sector.map(sector => (
                    <Badge key={sector} variant="outline" className="w-full justify-center text-xs">
                      {sector}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Tags */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-1">
                  {selectedModel.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="space-y-2">
                <Button 
                  onClick={() => handleCreateProject(selectedModel)} 
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Créer un projet
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // Copier les détails du modèle dans le presse-papier
                    const details = `${selectedModel.title}\n\n${selectedModel.description}\n\nTechnologies: ${selectedModel.implementation.technologies.join(', ')}`;
                    navigator.clipboard.writeText(details);
                    toast({
                      title: "Copié !",
                      description: "Les détails du modèle ont été copiés.",
                      duration: 2000
                    });
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Copier les détails
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête de la page */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Modèles de projets IA-SST
                </h1>
                <p className="text-gray-600 mt-1">
                  Découvrez et utilisez des modèles éprouvés pour vos projets d'intelligence artificielle en santé et sécurité au travail
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => navigate('/project/new')}
                className="flex items-center gap-2"
              >
                <Lightbulb className="h-4 w-4" />
                Nouveau projet
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Composant de navigation optimisé */}
        <ModelsBrowser
          config={{
            initialPageSize: 20,
            autoRefresh: false
          }}
          onModelSelect={handleModelSelect}
          showImportExport={true}
          showStatistics={true}
          compact={false}
        />
      </div>

      {/* Modal de détail du modèle */}
      {renderModelDetail()}
    </div>
  );
};

export default ModelsPage;