
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import CriteriaSlider from "./criteria-slider";
import { Project, Criteria } from "../types/project";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProjectFormProps {
  onAddProject: (project: Project) => void;
  editingProject: Project | null;
  onUpdateProject: (project: Project) => void;
  onCancelEdit: () => void;
}

const initialCriteria: Criteria = {
  impact: 5,
  confiance: 5,
  facilite: 5,
  acceptabilite: 5,
  valeurReglementaire: 5,
  alignementEthique: 5
};

const criteriaDescriptions = {
  impact: "Estime l'effet potentiel du projet sur la prévention des accidents et l'amélioration de la SST. Un projet avec un fort impact pourrait réduire significativement le nombre d'incidents en milieu de travail ou améliorer la santé des employés.",
  confiance: "Reflète le degré de certitude quant à la fiabilité technique de l'IA proposée et aux chances de succès du projet. Il s'agit d'évaluer dans quelle mesure l'initiative tiendra ses promesses et fonctionnera comme prévu en conditions réelles.",
  facilite: "Évalue à quel point il sera aisé de déployer et d'intégrer le projet IA dans le contexte réel de travail. Cela inclut la complexité technique du déploiement, le temps et les ressources nécessaires.",
  acceptabilite: "Mesure dans quelle mesure le projet sera adopté par les utilisateurs finaux et les parties prenantes sur le terrain (travailleurs, encadrement SST, représentants du personnel).",
  valeurReglementaire: "Reflète la contribution du projet à la conformité aux lois et normes en SST, ainsi que son utilité vis-à-vis des exigences réglementaires ou normatives.",
  alignementEthique: "Vérifie que le projet d'IA respecte les principes éthiques attendus comme la transparence, l'explicabilité, l'équité et le respect de la vie privée."
};

const ProjectForm = ({ onAddProject, editingProject, onUpdateProject, onCancelEdit }: ProjectFormProps) => {
  const { toast } = useToast();
  const [name, setName] = useState(editingProject?.name || "");
  const [criteria, setCriteria] = useState<Criteria>(editingProject?.criteria || initialCriteria);
  const [weights, setWeights] = useState({
    impact: 1,
    confiance: 1,
    facilite: 1,
    acceptabilite: 1,
    valeurReglementaire: 1,
    alignementEthique: 1
  });
  const [useWeights, setUseWeights] = useState(false);
  const [criteriaModified, setCriteriaModified] = useState(false);

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

    let score: number;
    
    if (useWeights) {
      const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
      score = Object.entries(criteria).reduce(
        (sum, [key, value]) => sum + value * weights[key as keyof typeof weights], 
        0
      ) / totalWeight;
    } else {
      score = Object.values(criteria).reduce((sum, value) => sum + value, 0) / 6;
    }
    
    score = Math.round(score * 10) / 10;
    
    const project: Project = {
      id: editingProject?.id || Date.now().toString(),
      name,
      criteria,
      score
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
      setCriteria(initialCriteria);
      setCriteriaModified(false);
      toast({
        title: "Projet ajouté",
        description: `Le projet "${name}" a été ajouté avec succès.`
      });
    }
  };

  const updateCriteria = (key: keyof Criteria, value: number) => {
    setCriteria(prev => ({ ...prev, [key]: value }));
    setCriteriaModified(true);
  };

  const updateWeight = (key: string, value: number) => {
    setWeights(prev => ({ ...prev, [key]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingProject ? "Modifier le projet" : "Nouveau projet IA-SST"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom / Description du projet
            </label>
            <Input
              id="project-name"
              placeholder="Ex: Caméra intelligente pour détecter le non-port des EPI"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>

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
                <div className="space-y-2">
                  <CriteriaSlider
                    label="Impact (prévention et réduction des risques)"
                    description={criteriaDescriptions.impact}
                    value={criteria.impact}
                    onChange={(value) => updateCriteria("impact", value)}
                    colorClass="bg-sst-blue"
                  />
                  <CriteriaSlider
                    label="Confiance (fiabilité technique)"
                    description={criteriaDescriptions.confiance}
                    value={criteria.confiance}
                    onChange={(value) => updateCriteria("confiance", value)}
                    colorClass="bg-sst-blue"
                  />
                  <CriteriaSlider
                    label="Facilité (mise en œuvre)"
                    description={criteriaDescriptions.facilite}
                    value={criteria.facilite}
                    onChange={(value) => updateCriteria("facilite", value)}
                    colorClass="bg-sst-blue"
                  />
                  <CriteriaSlider
                    label="Acceptabilité terrain (adoption)"
                    description={criteriaDescriptions.acceptabilite}
                    value={criteria.acceptabilite}
                    onChange={(value) => updateCriteria("acceptabilite", value)}
                    colorClass="bg-sst-dark-blue"
                  />
                  <CriteriaSlider
                    label="Valeur réglementaire (conformité)"
                    description={criteriaDescriptions.valeurReglementaire}
                    value={criteria.valeurReglementaire}
                    onChange={(value) => updateCriteria("valeurReglementaire", value)}
                    colorClass="bg-sst-dark-blue"
                  />
                  <CriteriaSlider
                    label="Alignement éthique (transparence, équité)"
                    description={criteriaDescriptions.alignementEthique}
                    value={criteria.alignementEthique}
                    onChange={(value) => updateCriteria("alignementEthique", value)}
                    colorClass="bg-sst-dark-blue"
                  />
                </div>
              </TabsContent>

              <TabsContent value="pondere">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(criteria).map(([key, value]) => {
                    const keyTyped = key as keyof Criteria;
                    const label = {
                      impact: "Impact",
                      confiance: "Confiance",
                      facilite: "Facilité",
                      acceptabilite: "Acceptabilité terrain",
                      valeurReglementaire: "Valeur réglementaire",
                      alignementEthique: "Alignement éthique"
                    }[keyTyped];
                    
                    return (
                      <div key={key} className="border rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{label}</span>
                          <span className="font-bold">{value}/10</span>
                        </div>
                        <Slider
                          value={[value]}
                          min={1}
                          max={10}
                          step={1}
                          className="mb-3"
                          onValueChange={(values) => updateCriteria(keyTyped, values[0])}
                        />
                        
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm text-gray-500">Pondération:</span>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3].map((w) => (
                              <button
                                key={w}
                                type="button"
                                className={`w-8 h-8 rounded-full text-sm ${
                                  weights[keyTyped] === w
                                    ? "bg-sst-blue text-white"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                                onClick={() => updateWeight(key, w)}
                              >
                                {w}x
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
