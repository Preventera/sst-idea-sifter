
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
  excellence: 5,
  faisabilite: 5,
  gouvernance: 5,
  securite: 5,
  acceptabilite: 5,
  perennite: 5
};

const criteriaDescriptions = {
  impact: "Évalue l'adéquation du projet avec les enjeux prioritaires de SST et son potentiel d'impact mesurable sur la sécurité des travailleurs et la réduction des risques professionnels.",
  excellence: "Mesure la qualité scientifique et technique de la solution proposée, incluant le niveau d'innovation et sa capacité à dépasser les approches traditionnelles.",
  faisabilite: "Évalue le réalisme du calendrier, du budget, la disponibilité des données d'entraînement pertinentes et la capacité à intégrer la solution dans les environnements de travail existants.",
  gouvernance: "Vérifie le respect des principes éthiques (transparence, équité, absence de biais), l'alignement avec les cadres réglementaires et l'implication d'un comité interdisciplinaire.",
  securite: "Évalue la gestion des risques spécifiques liés à l'IA générative, la mise en place de mécanismes de contrôle et la capacité à garantir la fiabilité et la sécurité des utilisateurs.",
  acceptabilite: "Mesure l'acceptabilité sociale et organisationnelle des usages proposés et la clarté sur la valeur ajoutée pour toutes les parties prenantes.",
  perennite: "Évalue la stratégie d'exploitation des résultats, de diffusion et la pérennité de la solution (maintenance, évolutivité, adaptation aux évolutions)."
};

const ProjectForm = ({ onAddProject, editingProject, onUpdateProject, onCancelEdit }: ProjectFormProps) => {
  const { toast } = useToast();
  const [name, setName] = useState(editingProject?.name || "");
  const [criteria, setCriteria] = useState<Criteria>(editingProject?.criteria || initialCriteria);
  const [weights, setWeights] = useState({
    impact: 1,
    excellence: 1,
    faisabilite: 1,
    gouvernance: 1,
    securite: 1,
    acceptabilite: 1,
    perennite: 1
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
      score = Object.values(criteria).reduce((sum, value) => sum + value, 0) / Object.values(criteria).length;
    }
    
    score = Math.round(score * 100) / 100; // Arrondir à 2 décimales
    
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
                    label="Impact et pertinence en SST"
                    description={criteriaDescriptions.impact}
                    value={criteria.impact}
                    onChange={(value) => updateCriteria("impact", value)}
                    colorClass="bg-sst-blue"
                  />
                  <CriteriaSlider
                    label="Excellence scientifique et innovation"
                    description={criteriaDescriptions.excellence}
                    value={criteria.excellence}
                    onChange={(value) => updateCriteria("excellence", value)}
                    colorClass="bg-sst-blue"
                  />
                  <CriteriaSlider
                    label="Faisabilité et maturité du projet"
                    description={criteriaDescriptions.faisabilite}
                    value={criteria.faisabilite}
                    onChange={(value) => updateCriteria("faisabilite", value)}
                    colorClass="bg-sst-blue"
                  />
                  <CriteriaSlider
                    label="Gouvernance, éthique et conformité"
                    description={criteriaDescriptions.gouvernance}
                    value={criteria.gouvernance}
                    onChange={(value) => updateCriteria("gouvernance", value)}
                    colorClass="bg-sst-dark-blue"
                  />
                  <CriteriaSlider
                    label="Sécurité, robustesse et gestion des risques"
                    description={criteriaDescriptions.securite}
                    value={criteria.securite}
                    onChange={(value) => updateCriteria("securite", value)}
                    colorClass="bg-sst-dark-blue"
                  />
                  <CriteriaSlider
                    label="Acceptabilité et valeur pour les parties prenantes"
                    description={criteriaDescriptions.acceptabilite}
                    value={criteria.acceptabilite}
                    onChange={(value) => updateCriteria("acceptabilite", value)}
                    colorClass="bg-sst-dark-blue"
                  />
                  <CriteriaSlider
                    label="Exploitation, diffusion et pérennité"
                    description={criteriaDescriptions.perennite}
                    value={criteria.perennite}
                    onChange={(value) => updateCriteria("perennite", value)}
                    colorClass="bg-sst-dark-blue"
                  />
                </div>
              </TabsContent>

              <TabsContent value="pondere">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(criteria).map(([key, value]) => {
                    const keyTyped = key as keyof Criteria;
                    const label = {
                      impact: "Impact et pertinence",
                      excellence: "Excellence et innovation",
                      faisabilite: "Faisabilité et maturité",
                      gouvernance: "Gouvernance et éthique",
                      securite: "Sécurité et robustesse",
                      acceptabilite: "Acceptabilité terrain",
                      perennite: "Pérennité et diffusion"
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
