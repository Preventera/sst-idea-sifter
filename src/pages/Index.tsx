// src/pages/Index.tsx

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Project } from "@/types/project";
import { ProjectForm } from "@/components/project-form";
import ProjectList from "@/components/project-list";
import ExportButton from "@/components/export-button";
import EnhancedExportButton from "@/components/enhanced-export-button";
import ProjectTemplates, { ProjectTemplate } from "@/components/project-templates";
import ProjectFilters from "@/components/project-filters";
import Questionnaire from "@/components/questionnaire";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, TrendingUp, Users, BarChart3, FileQuestion } from "lucide-react";
import { calculateDetailedPriority, SCIAN_SECTORS } from "@/data/scian-sectors";
import { supabaseClient } from "../lib/supabaseClient";

const Index: React.FC = () => {
  // ─── RÉCUPÉRATION ET STOCKAGE LOCAL ────────────────────────────────────────────
  const [projects, setProjects] = useLocalStorage<Project[]>("ia-sst-projects", []);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [scoreFilter, setScoreFilter] = useState<string>("all");

  const navigate = useNavigate();
  const { toast } = useToast();

  //
  // ─── FONCTION DE RÉCUPÉRATION DES PROJETS DEPUIS SUPABASE ───────────────────────
  //
  const fetchProjectsFromSupabase = async () => {
    const { data, error } = await supabaseClient
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur de récupération des projets Supabase :", error);
      return;
    }
    if (!data) return;

    const projectsFromDB: Project[] = data.map((row: any) => {
      // ✅ CORRECTION: Gérer le cas où row.scores est null
      const safeScores = row.scores ?? {
        impact: 5,
        excellence: 5,
        faisabilite: 5,
        gouvernance: 5,
        securite: 5,
        acceptabilite: 5,
        perennite: 5,
      };

      const crit = safeScores as {
        impact: number;
        excellence: number;
        faisabilite: number;
        gouvernance: number;
        securite: number;
        acceptabilite: number;
        perennite: number;
      };

      const sommeCritères =
        crit.impact +
        crit.excellence +
        crit.faisabilite +
        crit.gouvernance +
        crit.securite +
        crit.acceptabilite +
        crit.perennite;
      const computedScore = Math.round((sommeCritères / 7) * 100) / 100;

      return {
        id: row.id,
        name: row.title,
        ideas: row.ideas ?? [],
        scores: crit,
        score: computedScore,
        scianSectorId: row.scianSectorId ?? null,
        priority: row.priority ?? null,
        created_at: row.created_at ?? undefined,
        updated_at: row.updated_at ?? undefined,
      };
    });

    setProjects(projectsFromDB);
  };

  //
  // ─── ON CHARGE LES PROJETS AU MONTAGE ──────────────────────────────────────────
  //
  useEffect(() => {
    fetchProjectsFromSupabase();
  }, []); // [] = exécute une seule fois au montage

  //
  // ─── FONCTION D'INSERTION DANS SUPABASE ──────────────────────────────────────────
  //
  const insertProjectInSupabase = async (project: Project) => {
    const insertPayload = {
      title: project.name,
      ideas: project.ideas,
      scores: project.scores,
      scianSectorId: project.scianSectorId,
      priority: project.priority,
    };

    const { data, error } = await supabaseClient
      .from("projects")
      .insert(insertPayload);

    if (error) {
      console.error("Erreur d'insertion dans Supabase : ", error);
      toast({
        title: "Erreur lors de l'enregistrement",
        description: "Impossible de sauvegarder le projet sur la base de données !",
        variant: "destructive",
      });
      return null;
    }

    return data; // Tableau des enregistrements insérés
  };

  //
  // ─── GESTION LOCALE (affichage immédiat) ───────────────────────────────────────
  //
  const handleAddProject = async (project: Project) => {
    // 1) Insertion en base Supabase
    const inserted = await insertProjectInSupabase(project);
    if (!inserted) {
      // Si insertion échoue, on ne met rien en local
      return;
    }

    // 2) Mise à jour du state local (pour affichage instantané)
    setProjects((prev) => [...prev, project]);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    setEditingProject(null);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearAllProjects = () => {
    setProjects([]);
  };

  //
  // ─── FILTRAGE DES PROJETS ────────────────────────────────────────────────────────
  //
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Filtrer par terme de recherche (sur le nom)
      if (
        searchTerm &&
        !project.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Filtrer par priorité
      if (priorityFilter !== "all") {
        if (priorityFilter === "undefined" && project.priority) return false;
        if (
          priorityFilter !== "undefined" &&
          (!project.priority || project.priority.level !== priorityFilter)
        )
          return false;
      }

      // Filtrer par secteur
      if (sectorFilter !== "all") {
        if (sectorFilter === "undefined" && project.scianSectorId) return false;
        if (
          sectorFilter !== "undefined" &&
          project.scianSectorId !== sectorFilter
        )
          return false;
      }

      // Filtrer par score global si besoin (ex. ≥ 8, ≥ 6, etc.)
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
          default:
            return true;
        }
      }

      return true;
    });
  }, [projects, searchTerm, priorityFilter, sectorFilter, scoreFilter]);

  const hasActiveFilters = Boolean(
    searchTerm || priorityFilter !== "all" || sectorFilter !== "all" || scoreFilter !== "all"
  );

  //
  // ─── STATISTIQUES POUR LE DASHBOARD ──────────────────────────────────────────────
  //
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const projectsWithPriority = projects.filter((p) => p.priority).length;
    const avgScore =
      totalProjects > 0
        ? Math.round(
            (projects.reduce((sum, p) => sum + p.score, 0) / totalProjects) * 100
          ) / 100
        : 0;
    return {
      total: totalProjects,
      withPriority: projectsWithPriority,
      avgScore,
    };
  }, [projects]);

  //
  // ─── AFFICHAGE DU QUESTIONNAIRE EN PLEIN ÉCRAN ──────────────────────────────────
  //
  if (showQuestionnaire) {
    return (
      <Questionnaire
        onClose={() => setShowQuestionnaire(false)}
        onCreateProject={handleAddProject}
      />
    );
  }

  //
  // ─── RENDER PRINCIPAL ───────────────────────────────────────────────────────────
  //
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b">
        <div className="container py-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">I</span>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    IGNITIA
                  </h1>
                  <p className="text-sm text-blue-600 font-medium">
                    GenAISafety – Priorisation de Projets IA en SST
                  </p>
                </div>
              </div>
              <p className="text-gray-600 max-w-2xl">
                Évaluez vos idées d'intelligence artificielle selon les critères de
                santé-sécurité au travail pour déterminer celles à prioriser.
              </p>
            </div>

            {projects.length > 0 && (
              <div className="hidden md:flex gap-4 text-center">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-xs font-medium">PROJETS</span>
                  </div>
                  <div className="text-xl font-bold text-blue-700">
                    {stats.total}
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-green-600 mb-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs font-medium">AVEC PRIORITÉ</span>
                  </div>
                  <div className="text-xl font-bold text-green-700">
                    {stats.withPriority}
                  </div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-600 mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-xs font-medium">SCORE MOYEN</span>
                  </div>
                  <div className="text-xl font-bold text-purple-700">
                    {stats.avgScore}/10
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CORPS DE PAGE PRINCIPAL */}
      <main className="container py-8">
        <div className="grid gap-8">
          {/* SECTION FORMULAIRE & TEMPLATES */}
          <div>
            {!showTemplates && (
              <div className="mb-4 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowQuestionnaire(true)}
                  className="mr-2"
                >
                  <FileQuestion className="h-4 w-4 mr-2" />
                  📋 Questionnaire de cadrage IGNITIA
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowTemplates(true)}
                  className="mr-2"
                >
                  🚀 Utiliser un modèle
                </Button>
                <Badge variant="outline" className="text-xs">
                  Nouveau ! Templates et questionnaire structuré IGNITIA
                </Badge>
              </div>
            )}

            {showTemplates && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Modèles de projets</h2>
                  <Button variant="ghost" onClick={() => setShowTemplates(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Fermer les modèles
                  </Button>
                </div>
                <ProjectTemplates
                  onSelectTemplate={(template: ProjectTemplate) => {
                    // Générer le projet depuis le template sélectionné
                    const criteriaScore =
                      Object.values(template.criteria).reduce((sum, v) => sum + v, 0) /
                      Object.values(template.criteria).length;
                    const newProject: Project = {
                      id: Date.now().toString(),
                      name: template.name,
                      ideas: [], // si vous gérez des idées, adaptez selon template
                      scores: template.criteria,
                      score: Math.round(criteriaScore * 100) / 100,
                      scianSectorId: template.scianSectorId,
                      priority: template.scianSectorId
                        ? calculateDetailedPriority(
                            SCIAN_SECTORS.find((s) => s.id === template.scianSectorId)!
                          )
                        : null,
                    };
                    handleAddProject(newProject);
                    setShowTemplates(false);
                  }}
                />
              </div>
            )}

            {/* Formulaire d'ajout / édition de projet */}
            <ProjectForm
              onAddProject={handleAddProject}
              editingProject={editingProject}
              onUpdateProject={handleUpdateProject}
              onCancelEdit={() => setEditingProject(null)}
            />
          </div>

          {/* SECTION LISTE ET FILTRES */}
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
                          Êtes-vous sûr de vouloir supprimer tous vos projets ? Cette
                          action est irréversible.
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
                onClearFilters={() => {
                  setSearchTerm("");
                  setPriorityFilter("all");
                  setSectorFilter("all");
                  setScoreFilter("all");
                }}
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

      {/* FOOTER */}
      <footer className="bg-white border-t py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">I</span>
              </div>
              <div>
                <p className="text-gray-700 font-medium text-sm">IGNITIA</p>
                <p className="text-gray-500 text-xs">
                  GenAISafety – Priorisation IA-SST
                </p>
              </div>
            </div>
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} IGNITIA de GenAISafety – Générateur
              interactif de priorisation de projets IA en SST
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;