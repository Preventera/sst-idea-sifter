// src/pages/ProjectForm.tsx
// Solution complète avec synchronisation Supabase - VERSION CORRIGÉE

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { ProjectForm } from '@/components/project-form/project-form';  // ✅ CORRIGÉ
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { supabaseClient } from '../lib/supabaseClient';

// Interface harmonisée pour la synchronisation - CORRIGÉE
interface ProjectData {
  id: string;
  name: string;
  description: string;
  sector: string;
  scores: {  // ✅ CORRIGÉ: criteria → scores
    technicalFeasibility: number;
    businessValue: number;
    riskReduction: number;
    implementationCost: number;
    timeToMarket: number;
    stakeholderSupport: number;
    regulatoryCompliance: number;
  };
  score: number;
  priority: string;
}

const ProjectFormPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // 🔧 FONCTION DE SAUVEGARDE SUPABASE HARMONISÉE - CORRIGÉE
  const handleAddProject = async (projectData: ProjectData) => {
    try {
      console.log('🔄 Sauvegarde projet en cours...', projectData);

      // 📊 HARMONISATION DES DONNÉES vers format Supabase - CORRIGÉE
      const supabasePayload = {
        id: projectData.id,
        title: projectData.name,  // name → title
        ideas: [projectData.description], // description → ideas array
        scores: {
          // ✅ CORRIGÉ: scores → scores (plus de mapping criteria)
          impact: projectData.scores.riskReduction,
          excellence: projectData.scores.businessValue,
          faisabilite: projectData.scores.technicalFeasibility,
          gouvernance: projectData.scores.regulatoryCompliance,
          securite: projectData.scores.riskReduction,
          acceptabilite: projectData.scores.stakeholderSupport,
          perennite: Math.round((projectData.scores.timeToMarket + projectData.scores.businessValue) / 2)
        },
        scianSectorId: projectData.sector, // sector → scianSectorId
        priority: projectData.priority,
        created_at: new Date().toISOString()
      };

      console.log('📊 Payload Supabase:', supabasePayload);

      // 🔄 INSERTION DANS SUPABASE
      const { data, error } = await supabaseClient
        .from('projects')
        .insert([supabasePayload])
        .select();

      if (error) {
        console.error('❌ Erreur Supabase:', error);
        throw error;
      }

      console.log('✅ Projet sauvegardé avec succès:', data);

      // 🎉 NOTIFICATION SUCCÈS
      toast({
        title: "Projet créé avec succès !",
        description: `Le projet "${projectData.name}" a été ajouté à votre liste.`,
        duration: 3000
      });

      // 🔄 REDIRECTION VERS LA LISTE PRINCIPALE
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);

    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      
      toast({
        title: "Erreur de sauvegarde",
        description: `Impossible de sauvegarder le projet. Détails: ${error.message || 'Erreur inconnue'}`,
        variant: "destructive",
        duration: 5000
      });
    }
  };

  // 🔧 FONCTION DE MISE À JOUR (pour édition future) - CORRIGÉE
  const handleUpdateProject = async (projectData: ProjectData) => {
    try {
      console.log('🔄 Mise à jour projet...', projectData);

      const supabasePayload = {
        title: projectData.name,
        ideas: [projectData.description],
        scores: {
          // ✅ CORRIGÉ: scores → scores
          impact: projectData.scores.riskReduction,
          excellence: projectData.scores.businessValue,
          faisabilite: projectData.scores.technicalFeasibility,
          gouvernance: projectData.scores.regulatoryCompliance,
          securite: projectData.scores.riskReduction,
          acceptabilite: projectData.scores.stakeholderSupport,
          perennite: Math.round((projectData.scores.timeToMarket + projectData.scores.businessValue) / 2)
        },
        scianSectorId: projectData.sector,
        priority: projectData.priority,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabaseClient
        .from('projects')
        .update(supabasePayload)
        .eq('id', projectData.id);

      if (error) throw error;

      toast({
        title: "Projet mis à jour !",
        description: `Les modifications ont été sauvegardées.`
      });

      navigate('/', { replace: true });

    } catch (error) {
      console.error('❌ Erreur mise à jour:', error);
      
      toast({
        title: "Erreur de mise à jour",
        description: "Impossible de mettre à jour le projet.",
        variant: "destructive"
      });
    }
  };

  // 🔄 FONCTION D'ANNULATION
  const handleCancelEdit = () => {
    console.log('❌ Création/édition annulée');
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔝 HEADER AVEC NAVIGATION */}
      <header className="bg-white shadow-sm border-b">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la liste
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">I</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Nouveau projet IA-SST
                </h1>
                <p className="text-sm text-blue-600">
                  IGNITIA - Évaluation et priorisation
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 📝 FORMULAIRE PRINCIPAL */}
      <main className="container py-8">
        <ProjectForm
          onAddProject={handleAddProject}
          editingProject={null}
          onUpdateProject={handleUpdateProject}
          onCancelEdit={handleCancelEdit}
        />
      </main>

      {/* 🔻 FOOTER */}
      <footer className="bg-white border-t py-4 mt-8">
        <div className="container">
          <p className="text-center text-gray-500 text-sm">
            IGNITIA - GenAISafety © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProjectFormPage;