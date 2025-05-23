
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Criteria } from "@/types/project";
import { Camera, AlertTriangle, Brain, Shield, Eye } from "lucide-react";

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  criteria: Criteria;
  scianSectorId?: string;
  tags: string[];
}

interface ProjectTemplatesProps {
  onSelectTemplate: (template: ProjectTemplate) => void;
}

const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: "camera-epi",
    name: "Caméra intelligente détection EPI",
    description: "Système de vision par ordinateur pour détecter le port correct des équipements de protection individuelle",
    icon: <Camera className="h-5 w-5" />,
    criteria: {
      impact: 8,
      excellence: 7,
      faisabilite: 6,
      gouvernance: 7,
      securite: 8,
      acceptabilite: 6,
      perennite: 7
    },
    scianSectorId: "23",
    tags: ["Vision", "EPI", "Temps réel"]
  },
  {
    id: "fatigue-detection",
    name: "Détection de fatigue conducteur",
    description: "IA pour analyser les signes de fatigue des conducteurs d'équipements lourds",
    icon: <Eye className="h-5 w-5" />,
    criteria: {
      impact: 9,
      excellence: 8,
      faisabilite: 7,
      gouvernance: 6,
      securite: 9,
      acceptabilite: 7,
      perennite: 8
    },
    scianSectorId: "48-49",
    tags: ["Fatigue", "Transport", "Prédictif"]
  },
  {
    id: "risk-analysis",
    name: "Analyse prédictive des risques",
    description: "Modèle d'apprentissage automatique pour prédire les zones à risque d'accidents",
    icon: <AlertTriangle className="h-5 w-5" />,
    criteria: {
      impact: 8,
      excellence: 9,
      faisabilite: 5,
      gouvernance: 8,
      securite: 7,
      acceptabilite: 6,
      perennite: 8
    },
    scianSectorId: "31-33",
    tags: ["Prédictif", "Machine Learning", "Analyse"]
  },
  {
    id: "nlp-incident",
    name: "Analyse NLP des rapports d'incident",
    description: "Traitement du langage naturel pour extraire des patterns dans les rapports d'accidents",
    icon: <Brain className="h-5 w-5" />,
    criteria: {
      impact: 7,
      excellence: 8,
      faisabilite: 8,
      gouvernance: 9,
      securite: 6,
      acceptabilite: 8,
      perennite: 9
    },
    tags: ["NLP", "Rapports", "Patterns"]
  },
  {
    id: "safety-assistant",
    name: "Assistant IA pour formations SST",
    description: "Chatbot intelligent pour personnaliser les formations en santé-sécurité",
    icon: <Shield className="h-5 w-5" />,
    criteria: {
      impact: 6,
      excellence: 7,
      faisabilite: 9,
      gouvernance: 8,
      securite: 7,
      acceptabilite: 9,
      perennite: 8
    },
    scianSectorId: "62",
    tags: ["Formation", "Chatbot", "Personnalisation"]
  }
];

const ProjectTemplates = ({ onSelectTemplate }: ProjectTemplatesProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">🚀 Modèles de projets types</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROJECT_TEMPLATES.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  {template.icon}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium leading-tight">
                    {template.name}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onSelectTemplate(template)}
                className="w-full text-xs"
              >
                Utiliser ce modèle
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectTemplates;
export { PROJECT_TEMPLATES };
export type { ProjectTemplate };
