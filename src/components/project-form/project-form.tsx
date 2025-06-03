import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Project } from "../../types/project";

import { ProjectFormProps, useProjectForm } from "./use-project-form";
import AIEnhancedNameInput from "./ai-enhanced-name-input";
import ScianSectorSelect from "./scian-sector-select";
import PriorityInfo from "./priority-info";
import StandardCriteria from "./standard-criteria";
import WeightedCriteria from "./weighted-criteria";

const ProjectForm = ({ onAddProject, editingProject, onUpdateProject, onCancelEdit }: ProjectFormProps) => {
  const { toast } = useToast();
  const {
    name,
    setName,
    criteria,
    scianSectorId,
    setScianSectorId,
    weights,
    useWeights,
    setUseWeights,
    criteriaModified,
    setCriteriaModified,
    updateCriteria,
    updateWeight,
    calculateScore,
    priority,
  } = useProjectForm({ onAddProject, editingProject, onUpdateProject, onCancelEdit });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Champ requis",
        description: "Veuillez saisir le nom du projet.",
        variant: "destructive"
      });
      return;
    }

    if (!criteriaModified) {
      toast({
        title: "Attention",
        description: "Vous n'avez pas modifié les critères d'évaluation. Les valeurs par défaut (5/10) seront utilisées.",
      });
    }

    const score = calculateScore();
    
    const project: Project = {
      id: editingProject?.id || Date.now().toString(),
      name,
      criteria,
      score,
      scianSectorId,
      priority
    };

    if (editingProject) {
      onUpdateProject(project);
      toast({
        title: "Projet mis à jour",
        description: `Le projet "${name}" a été modifié avec succès.`
      });
    } else {
      onAddProject(project);
      setName("");
      setCriteriaModified(false);
      toast({
        title: "Projet ajouté",
        description: `Le projet "${name}" a été ajouté avec succès.`
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingProject ? "Modifier le projet" : "Nouveau projet IA-SST"}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* TEST TEMPORAIRE - DIAGNOSTIC ASSISTANT IA */}
          <div className="border-2 border-red-500 bg-red-50 p-4 mb-4 rounded-lg">
            <h4 className="text-red-600 font-bold text-lg">🔧 DEBUG: Assistant IA</h4>
            <p className="text-red-700 mb-2">Si vous voyez cette section rouge, le problème vient du composant AIEnhancedNameInput</p>
            <div className="bg-white p-2 rounded border text-sm">
              <p><strong>Name:</strong> "{name}"</p>
              <p><strong>Criteria:</strong> {JSON.stringify(criteria, null, 2)}</p>
              <p><strong>ScianSectorId:</strong> {scianSectorId || "null"}</p>
              <p><strong>Composant AIEnhancedNameInput:</strong> Chargement en cours...</p>
            </div>
          </div>

          <AIEnhancedNameInput 
            name={name} 
            setName={setName}
            criteria={criteria}
            scianSectorId={scianSectorId}
          />
          
          <ScianSectorSelect 
            selectedSectorId={scianSectorId} 
            setSelectedSectorId={setScianSectorId} 
          />
          
          {scianSectorId && <PriorityInfo 
            scianSectorId={scianSectorId}
            priorityScore={priority?.score}
            priorityLevel={priority?.level}
          />}

          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Ajustez les valeurs ci-dessous pour évaluer votre projet. Par défaut, tous les critères sont à 5/10.
            </AlertDescription>
          </Alert>

          <div className="mb-6">
            <Tabs defaultValue="standard">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Critères d'évaluation</h3>
                <TabsList>
                  <TabsTrigger value="standard" onClick={() => setUseWeights(false)}>Standard</TabsTrigger>
                  <TabsTrigger value="pondere" onClick={() => setUseWeights(true)}>Pondéré</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="standard">
                <StandardCriteria 
                  criteria={criteria} 
                  updateCriteria={updateCriteria} 
                />
              </TabsContent>

              <TabsContent value="pondere">
                <WeightedCriteria 
                  criteria={criteria}
                  weights={weights}
                  updateCriteria={updateCriteria}
                  updateWeight={updateWeight}
                />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {editingProject && (
            <Button variant="outline" onClick={onCancelEdit}>
              Annuler
            </Button>
          )}
          <Button type="submit">
            {editingProject ? "Mettre à jour" : "Ajouter le projet"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ProjectForm;