// src/pages/ProjectFormXAI.tsx
// Page wrapper pour tester le ProjectForm avec XAI
// Route: /project/new-xai

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { ProjectFormXAIEnhanced } from '@/components/project-form/project-form-xai-enhanced';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sparkles } from 'lucide-react';

const ProjectFormXAIPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddProject = (project: any) => {
    console.log('✅ Nouveau projet XAI créé:', project);
    
    toast({
      title: "Projet XAI créé avec succès!",
      description: `Le projet "${project.name}" a été créé avec les explications XAI.`
    });

    // Optionnel : rediriger vers la liste après création
    // navigate('/');
  };

  const handleUpdateProject = (project: any) => {
    console.log('✅ Projet XAI mis à jour:', project);
    
    toast({
      title: "Projet XAI mis à jour",
      description: `Le projet "${project.name}" a été modifié.`
    });
  };

  const handleCancelEdit = () => {
    console.log('❌ Édition XAI annulée');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header avec retour et badge XAI */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la liste
            </Button>
            
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                <Sparkles className="h-3 w-3 mr-1" />
                Mode XAI Test
              </Badge>
              <span className="text-sm text-gray-600">
                Route: /project/new-xai
              </span>
            </div>
          </div>

          <div className="text-right">
            <h1 className="text-lg font-semibold text-gray-900">
              IGNITIA - Test XAI
            </h1>
            <p className="text-sm text-gray-600">
              Interface explicable d'évaluation IA-SST
            </p>
          </div>
        </div>
      </div>

      {/* Alerte informative */}
      <div className="container mx-auto px-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Mode Test XAI Activé</h3>
              <p className="text-sm text-blue-700 mt-1">
                Cette version inclut les explications contextuelles (XAI) pour chaque critère d'évaluation. 
                Cliquez sur "Pourquoi ce score ?" pour voir les justifications basées sur les données sectorielles.
              </p>
              <div className="mt-2 text-xs text-blue-600">
                <span className="font-medium">Fonctionnalités XAI :</span> Explications sectorielles • Justifications CNESST/ISO • Recommandations pratiques • Traçabilité complète
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire XAI */}
      <div className="container mx-auto px-4">
        <ProjectFormXAIEnhanced
          onAddProject={handleAddProject}
          editingProject={null}
          onUpdateProject={handleUpdateProject}
          onCancelEdit={handleCancelEdit}
        />
      </div>

      {/* Footer info */}
      <div className="container mx-auto px-4 mt-8">
        <div className="text-center text-sm text-gray-500">
          <p>
            Version test avec Intelligence Artificielle Explicable (XAI) • 
            <span className="mx-2">•</span>
            Basé sur référentiels CNESST, ISO 45001, et meilleures pratiques SST
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectFormXAIPage;