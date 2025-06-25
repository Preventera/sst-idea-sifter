// src/pages/ProjectFormPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ProjectForm } from '@/components/project-form/project-form';
import { supabaseClient } from '@/lib/supabaseClient';

const ProjectFormPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fonction de création de projet avec sauvegarde Supabase
  const handleAddProject = async (projectData: any) => {
    try {
      console.log('🔄 Sauvegarde projet...', projectData);
      
      // Conversion des données pour la structure Supabase
      const supabasePayload = {
        title: projectData.name,
        ideas: [projectData.description || ''],
        scores: {
          impact: projectData.criteria.riskReduction,
          excellence: projectData.criteria.businessValue,
          faisabilite: projectData.criteria.technicalFeasibility,
          gouvernance: projectData.criteria.regulatoryCompliance,
          securite: projectData.criteria.riskReduction,
          acceptabilite: projectData.criteria.stakeholderSupport,
          perennite: Math.round((projectData.criteria.timeToMarket + projectData.criteria.businessValue) / 2)
        },
        scianSectorId: projectData.sector,
        priority: calculatePriority(projectData.criteria),
        created_at: new Date().toISOString()
      };

      // Sauvegarde dans Supabase
      const { data, error } = await supabaseClient
        .from('projects')
        .insert(supabasePayload)
        .select();

      if (error) throw error;

      toast({
        title: "Projet sauvegardé !",
        description: `Le projet "${projectData.name}" a été ajouté avec succès.`,
        duration: 3000
      });

      // Redirection vers la liste principale
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);

    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder le projet. Veuillez réessayer.",
        variant: "destructive",
        duration: 5000
      });
    }
  };

  // Fonction pour calculer la priorité basée sur les scores
  const calculatePriority = (criteria: any) => {
    const averageScore = Object.values(criteria).reduce((sum: any, score: any) => sum + score, 0) / 
                        Object.values(criteria).length;
    
    if (averageScore >= 7) return 'high';
    if (averageScore >= 5) return 'medium';
    return 'low';
  };

  // Fonctions pour édition future
  const handleUpdateProject = async (project: any) => {
    // Logique similaire à handleAddProject mais avec update
    toast({
      title: "Fonctionnalité en développement",
      description: "La mise à jour des projets sera disponible prochainement."
    });
  };

  const handleCancelEdit = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ProjectForm
        onAddProject={handleAddProject}
        editingProject={null}
        onUpdateProject={handleUpdateProject}
        onCancelEdit={handleCancelEdit}
      />
    </div>
  );
};

export default ProjectFormPage;