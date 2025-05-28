import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from '@/hooks/use-local-storage';
import ProjectForm from '@/components/project-form/project-form';
import Questionnaire from '@/components/questionnaire';
import { Project } from '@/types/project';

const Index = () => {
  const [projects, setProjects] = useLocalStorage<Project[]>("projects", []);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [sortBy, setSortBy] = useState<"score" | "name">("score");
  const [filterSector, setFilterSector] = useState<string>("all");

  const handleAddProject = (project: Project) => {
    setProjects([...projects, project]);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(projects.map(project =>
      project.id === updatedProject.id ? updatedProject : project
    ));
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
  };

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortBy === "score") {
      return b.score - a.score;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  const filteredProjects = filterSector === "all"
    ? sortedProjects
    : sortedProjects.filter(project => project.scianSectorId === filterSector);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Projets IA-SST
        </h1>
        <Button onClick={() => setShowQuestionnaire(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau projet (Questionnaire)
        </Button>
      </div>

      {showQuestionnaire && (
        <div className="fixed inset-0 bg-white z-50 overflow-auto">
          <div className="container mx-auto py-6">
            <Questionnaire
              onClose={() => setShowQuestionnaire(false)}
              onCreateProject={handleAddProject}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale - Liste des projets */}
        <div className="lg:col-span-2">
          {/* Formulaire d'ajout de projet */}
          <ProjectForm
            onAddProject={handleAddProject}
            editingProject={editingProject}
            onUpdateProject={handleUpdateProject}
            onCancelEdit={handleCancelEdit}
          />

          {/* Filtres et tris */}
          <div className="flex items-center justify-between mb-4">
            <Select onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trier par..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Score</SelectItem>
                <SelectItem value="name">Nom</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setFilterSector}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par secteur..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les secteurs</SelectItem>
                <SelectItem value="21">Extraction minière, exploitation en carrière et extraction de pétrole et de gaz</SelectItem>
                <SelectItem value="22">Services publics</SelectItem>
                <SelectItem value="23">Construction</SelectItem>
                <SelectItem value="31-33">Fabrication</SelectItem>
                <SelectItem value="41">Commerce de gros</SelectItem>
                <SelectItem value="44-45">Commerce de détail</SelectItem>
                <SelectItem value="48-49">Transport et entreposage</SelectItem>
                <SelectItem value="51">Industrie de l'information et industrie culturelle</SelectItem>
                <SelectItem value="52">Finance et assurances</SelectItem>
                <SelectItem value="53">Services immobiliers et services de location et de location à bail</SelectItem>
                <SelectItem value="54">Services professionnels, scientifiques et techniques</SelectItem>
                <SelectItem value="56">Services administratifs, services de soutien, services de gestion des déchets et services d'assainissement</SelectItem>
                <SelectItem value="61">Services d'enseignement</SelectItem>
                <SelectItem value="62">Soins de santé et assistance sociale</SelectItem>
                <SelectItem value="71">Arts, spectacles et loisirs</SelectItem>
                <SelectItem value="72">Hébergement et services de restauration</SelectItem>
                <SelectItem value="81">Autres services (sauf les administrations publiques)</SelectItem>
                <SelectItem value="91">Administrations publiques</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Liste des projets */}
          <div className="space-y-4">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{project.name}</CardTitle>
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => setEditingProject(project)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      Score: {project.score}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center">
                  <AlertCircle className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                  Aucun projet trouvé.
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Colonne latérale - Instructions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-500">
                Bienvenue dans l'outil de gestion de projets IA-SST!
              </p>
              <ul className="list-disc pl-4 text-sm text-gray-500">
                <li>
                  Utilisez le bouton "Nouveau projet" pour ajouter un projet.
                </li>
                <li>
                  Remplissez le formulaire avec les informations du projet.
                </li>
                <li>
                  Ajustez les critères d'évaluation pour refléter les
                  priorités de votre organisation.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
