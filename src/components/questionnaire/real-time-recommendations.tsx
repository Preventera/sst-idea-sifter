
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lightbulb, Target, Zap, Shield } from "lucide-react";

interface RealtimeRecommendationsProps {
  responses: Record<number, { option: string; custom?: string }>;
}

const RealtimeRecommendations = ({ responses }: RealtimeRecommendationsProps) => {
  const getRecommendations = () => {
    const recommendations = [];
    
    // Analyse des objectifs prioritaires
    if (responses[1]?.option === "reduction") {
      recommendations.push({
        type: "agent",
        priority: "high",
        title: "Agent de détection proactive",
        description: "Recommandé : Déployer des agents de vision IA pour la détection en temps réel des comportements à risque",
        icon: <Shield className="h-4 w-4" />
      });
    }

    // Analyse des sources de données
    if (responses[3]?.option === "video") {
      recommendations.push({
        type: "tech",
        priority: "medium",
        title: "Infrastructure vidéo",
        description: "Optimiser : Mettre en place un pipeline de traitement vidéo avec edge computing",
        icon: <Zap className="h-4 w-4" />
      });
    }

    // Analyse du contexte de déploiement
    if (responses[5]?.option === "usine") {
      recommendations.push({
        type: "strategy",
        priority: "high",
        title: "Stratégie industrielle",
        description: "Prioriser : Agents spécialisés par zone de production avec capteurs IoT intégrés",
        icon: <Target className="h-4 w-4" />
      });
    }

    // Analyse du type d'interaction
    if (responses[8]?.option === "conversationnel") {
      recommendations.push({
        type: "ux",
        priority: "medium",
        title: "Interface conversationnelle",
        description: "Développer : Assistant vocal SST avec NLP spécialisé en terminologie sécurité",
        icon: <Lightbulb className="h-4 w-4" />
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  if (recommendations.length === 0) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Recommandations en temps réel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            Basé sur vos réponses actuelles, voici les recommandations personnalisées pour votre projet IA-SST.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-white rounded-lg">
                {rec.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{rec.title}</span>
                  <Badge className={getPriorityColor(rec.priority)}>
                    {rec.priority === "high" ? "Haute" : rec.priority === "medium" ? "Moyenne" : "Faible"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealtimeRecommendations;
