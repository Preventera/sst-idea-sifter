
import React, { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Project } from "@/types/project";
import ProjectForm from "@/components/project-form";
import ProjectList from "@/components/project-list";
import ExportButton from "@/components/export-button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const Index = () => {
  const [projects, setProjects] = useLocalStorage<Project[]>("ia-sst-projects", []);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleAddProject = (project: Project) => {
    setProjects([...projects, project]);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(
      projects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
    setEditingProject(null);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    // Faire défiler vers le haut pour voir le formulaire
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id));
  };

  const handleClearAllProjects = () => {
    setProjects([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Priorisation de Projets IA en SST
          </h1>
          <p className="mt-2 text-gray-600">
            Évaluez vos idées d'intelligence artificielle selon les critères de santé-sécurité au travail pour déterminer celles à prioriser.
          </p>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid gap-8">
          <div>
            <ProjectForm
              onAddProject={handleAddProject}
              editingProject={editingProject}
              onUpdateProject={handleUpdateProject}
              onCancelEdit={() => setEditingProject(null)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Projets évalués ({projects.length})
              </h2>
              <div className="flex gap-2">
                <ExportButton projects={projects} />
                
                {projects.length > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Tout effacer</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Effacer tous les projets</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer tous vos projets ? Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearAllProjects}>
                          Tout effacer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>

            <ProjectList
              projects={projects}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-6">
        <div className="container">
          <p className="text-center text-gray-500 text-sm">
            Générateur interactif de priorisation de projets IA en SST - © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
