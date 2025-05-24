import React, { useState, useMemo } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Project } from "@/types/project";
import ProjectForm from "@/components/project-form";
import ProjectList from "@/components/project-list";
import ExportButton from "@/components/export-button";
import EnhancedExportButton from "@/components/enhanced-export-button";
import ProjectTemplates, { ProjectTemplate } from "@/components/project-templates";
import ProjectFilters from "@/components/project-filters";
import Questionnaire from "@/components/questionnaire";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, TrendingUp, Users, BarChart3, FileQuestion } from "lucide-react";
import { calculateDetailedPriority, SCIAN_SECTORS } from "@/data/scian-sectors";

const Index = () => {
  const [projects, setProjects] = useLocalStorage<Project[]>("ia-sst-projects", []);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");

  // Si le questionnaire est ouvert, l'afficher en plein écran
  if (showQuestionnaire) {
    return <Questionnaire onClose={() => setShowQuestionnaire(false)} />;
  }

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

  const handleSelectTemplate = (template: ProjectTemplate) => {
    const project: Project = {
      id: Date.now().toString(),
      name: template.name,
      criteria: template.criteria,
      score: Object.values(template.criteria).reduce((sum, value) => sum + value, 0) / Object.values(template.criteria).length,
      scianSectorId: template.scianSectorId,
      priority: template.scianSectorId ? calculateDetailedPriority(SCIAN_SECTORS.find(s => s.id === template.scianSectorId)!) : undefined
    };
    
    setProjects([...projects, project]);
    setShowTemplates(false);
  };

  // Logique de filtrage
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Filtrage par terme de recherche
      if (searchTerm && !project.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filtrage par priorité
      if (priorityFilter !== "all") {
        if (priorityFilter === "undefined" && project.priority) return false;
        if (priorityFilter !== "undefined" && (!project.priority || project.priority.level !== priorityFilter)) return false;
      }

      // Filtrage par secteur
      if (sectorFilter !== "all") {
        if (sectorFilter === "undefined" && project.scianSectorId) return false;
        if (sectorFilter !== "undefined" && project.scianSectorId !== sectorFilter) return false;
      }

      // Filtrage par score
      if (scoreFilter !== "all") {
        switch (scoreFilter) {
          case "8+":
            return project.score >= 8;
          case "6+":
            return project.score >= 6;
          case "4+":
            return project.score >= 4;
          case "<4":
            return project.score < 4;
        }
      }

      return true;
    });
  }, [projects, searchTerm, priorityFilter, sectorFilter, scoreFilter]);

  // Fix here: Ensure hasActiveFilters is boolean by using Boolean() or !! conversion
  const hasActiveFilters = !!(searchTerm || priorityFilter !== "all" || sectorFilter !== "all" || scoreFilter !== "all");

  const clearFilters = () => {
    setSearchTerm("");
    setPriorityFilter("all");
    setSectorFilter("all");
    setScoreFilter("all");
  };

  // Statistiques pour le tableau de bord
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const projectsWithPriority = projects.filter(p => p.priority).length;
    const avgScore = totalProjects > 0 ? projects.reduce((sum, p) => sum + p.score, 0) / totalProjects : 0;
    
    return {
      total: totalProjects,
      withPriority: projectsWithPriority,
      avgScore: Math.round(avgScore * 10) / 10
    };
  }, [projects]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container py-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    GenAISafety
                  </h1>
                  <p className="text-sm text-blue-600 font-medium">
                    Priorisation de Projets IA en SST
                  </p>
                </div>
              </div>
              <p className="text-gray-600 max-w-2xl">
                Évaluez vos idées d'intelligence artificielle selon les critères de santé-sécurité au travail pour déterminer celles à prioriser.
              </p>
            </div>
            
            {projects.length > 0 && (
              <div className="hidden md:flex gap-4 text-center">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-xs font-medium">PROJETS</span>
                  </div>
                  <div className="text-xl font-bold text-blue-700">{stats.total}</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-green-600 mb-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs font-medium">AVEC PRIORITÉ</span>
                  </div>
                  <div className="text-xl font-bold text-green-700">{stats.withPriority}</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-600 mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-xs font-medium">SCORE MOYEN</span>
                  </div>
                  <div className="text-xl font-bold text-purple-700">{stats.avgScore}/10</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid gap-8">
          <div>
            {!showTemplates && (
              <div className="mb-4 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowQuestionnaire(true)}
                  className="mr-2"
                >
                  <FileQuestion className="h-4 w-4 mr-2" />
                  📋 Questionnaire de cadrage
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowTemplates(true)}
                  className="mr-2"
                >
                  🚀 Utiliser un modèle
                </Button>
                <Badge variant="outline" className="text-xs">
                  Nouveau ! Templates et questionnaire prêts à l'emploi
                </Badge>
              </div>
            )}

            {showTemplates && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Modèles de projets</h2>
                  <Button
                    variant="ghost"
                    onClick={() => setShowTemplates(false)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Fermer les modèles
                  </Button>
                </div>
                <ProjectTemplates onSelectTemplate={handleSelectTemplate} />
              </div>
            )}

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
                Projets évalués ({filteredProjects.length})
                {hasActiveFilters && (
                  <Badge variant="outline" className="ml-2">
                    Filtré sur {projects.length}
                  </Badge>
                )}
              </h2>
              <div className="flex gap-2">
                <ExportButton projects={filteredProjects} />
                <EnhancedExportButton projects={filteredProjects} />
                
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

            {projects.length > 0 && (
              <ProjectFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
                sectorFilter={sectorFilter}
                setSectorFilter={setSectorFilter}
                scoreFilter={scoreFilter}
                setScoreFilter={setScoreFilter}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            )}

            <ProjectList
              projects={filteredProjects}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <div>
                <p className="text-gray-700 font-medium text-sm">GenAISafety</p>
                <p className="text-gray-500 text-xs">Priorisation IA-SST</p>
              </div>
            </div>
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} GenAISafety - Générateur interactif de priorisation de projets IA en SST
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
