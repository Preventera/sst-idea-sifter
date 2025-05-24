
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Filter, TrendingUp } from "lucide-react";

interface ResponseAnalysisProps {
  responses: Record<number, { option: string; custom?: string }>;
}

interface AnalysisRow {
  questionId: number;
  thematic: string;
  questionSummary: string;
  selectedResponse: string;
  analysis: string;
  recommendedActions: string;
  priority: 'high' | 'medium' | 'low';
}

const THEMATIC_MAPPING: Record<number, string> = {
  1: "Objectifs IA-SST",
  2: "Processus cibles", 
  3: "Données disponibles",
  4: "Résultats attendus",
  5: "Contexte d'usage",
  6: "Catégories de risques",
  7: "Utilisateurs principaux",
  8: "Types d'interaction",
  9: "Fonctions de conformité",
  10: "Indicateurs de suivi",
  11: "Types d'alertes",
  12: "Formats de livrables",
  13: "Degré d'autonomie",
  14: "Fréquence d'analyse",
  15: "Dispositifs portés",
  16: "Types de risques prioritaires",
  17: "Environnements contraints",
  18: "Niveau de personnalisation",
  19: "Technologies complémentaires",
  20: "Contraintes réglementaires"
};

const RESPONSE_ANALYSIS_MAP: Record<string, { analysis: string; actions: string; priority: 'high' | 'medium' | 'low' }> = {
  "reduction": { 
    analysis: "Culture sécurité dominante", 
    actions: "Prioriser détection proactive & agents terrain",
    priority: "high"
  },
  "veille": { 
    analysis: "Attente de gains d'efficience", 
    actions: "Déployer agent conformité + OCR",
    priority: "medium"
  },
  "rapports": { 
    analysis: "Données variées mais à structurer", 
    actions: "Mettre en place un pipeline d'ingestion",
    priority: "high"
  },
  "alertes": { 
    analysis: "Besoin de traçabilité et auditabilité", 
    actions: "Générer des alertes temps réel sécurisées",
    priority: "high"
  },
  "usine": { 
    analysis: "Risques industriels concentrés", 
    actions: "Agents spécialisés par zone industrielle",
    priority: "high"
  },
  "respiratoires": { 
    analysis: "Risques de santé prioritaires", 
    actions: "Capteurs environnementaux + IA prédictive",
    priority: "high"
  },
  "operateurs": { 
    analysis: "Besoin d'assistance terrain directe", 
    actions: "Interface mobile intuitive + alertes contextuelles",
    priority: "high"
  },
  "conversationnel": { 
    analysis: "Interaction naturelle souhaitée", 
    actions: "Développer assistant conversationnel SST",
    priority: "medium"
  },
  "echeances": { 
    analysis: "Conformité réglementaire critique", 
    actions: "Automatiser le suivi des échéances",
    priority: "high"
  },
  "accidents": { 
    analysis: "Focus sur la mesure d'impact", 
    actions: "Dashboard temps réel + rapports périodiques",
    priority: "high"
  }
};

const getQuestionSummary = (questionId: number): string => {
  const summaries: Record<number, string> = {
    1: "Objectif principal IA",
    2: "Processus à automatiser", 
    3: "Sources de données internes",
    4: "Forme de restitution souhaitée",
    5: "Milieu de déploiement",
    6: "Catégories de risques prioritaires",
    7: "Utilisateurs cibles",
    8: "Type d'interaction",
    9: "Fonctions de conformité",
    10: "Indicateurs à suivre",
    11: "Types d'alertes",
    12: "Formats de livrables",
    13: "Degré d'autonomie",
    14: "Fréquence d'analyse",
    15: "Dispositifs embarqués",
    16: "Risques prioritaires",
    17: "Environnements contraints",
    18: "Niveau de personnalisation",
    19: "Technologies complémentaires",
    20: "Contraintes réglementaires"
  };
  return summaries[questionId] || `Question ${questionId}`;
};

const getResponseLabel = (optionId: string): string => {
  const labels: Record<string, string> = {
    "reduction": "🛡 Réduction des incidents",
    "veille": "📑 Gestion documentaire",
    "rapports": "📂 Incidents, IoT, images",
    "alertes": "🔔 Alertes temps réel",
    "usine": "🏭 Industrie",
    "respiratoires": "🫁 Risques respiratoires",
    "operateurs": "🧑‍🏭 Opérateurs terrain",
    "conversationnel": "💬 Assistant conversationnel",
    "echeances": "📅 Suivi échéances",
    "accidents": "🩺 Taux d'accidents"
  };
  return labels[optionId] || optionId;
};

const getPriorityColor = (priority: 'high' | 'medium' | 'low'): string => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
  }
};

const ResponseAnalysis = ({ responses }: ResponseAnalysisProps) => {
  const analysisData: AnalysisRow[] = Object.entries(responses)
    .filter(([_, response]) => response.option)
    .slice(0, 20) // Limiter aux 20 premières questions pour l'exemple
    .map(([questionId, response]) => {
      const qId = parseInt(questionId);
      const optionId = response.option;
      const analysisInfo = RESPONSE_ANALYSIS_MAP[optionId] || {
        analysis: "Analyse à approfondir",
        actions: "Actions à définir selon contexte",
        priority: "medium" as const
      };

      return {
        questionId: qId,
        thematic: THEMATIC_MAPPING[qId] || "Autre",
        questionSummary: getQuestionSummary(qId),
        selectedResponse: response.custom || getResponseLabel(optionId),
        analysis: analysisInfo.analysis,
        recommendedActions: analysisInfo.actions,
        priority: analysisInfo.priority
      };
    });

  const exportAnalysis = () => {
    const csvContent = [
      ['N°', 'Thématique', 'Question résumée', 'Réponse choisie', 'Analyse/Enjeu', 'Actions recommandées', 'Priorité'],
      ...analysisData.map(row => [
        row.questionId.toString(),
        row.thematic,
        row.questionSummary,
        row.selectedResponse,
        row.analysis,
        row.recommendedActions,
        row.priority
      ])
    ].map(row => row.join(';')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grille-analyse-ignitia-sst.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Grille d'analyse - Traitement des réponses
            </CardTitle>
            <p className="text-gray-600 text-sm mt-1">
              Analyse structurée des priorités et recommandations d'actions IA-SST
            </p>
          </div>
          <Button onClick={exportAnalysis} variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Exporter CSV
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">Résumé des priorités</span>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-200 rounded-full"></div>
              Haute: {analysisData.filter(r => r.priority === 'high').length}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-200 rounded-full"></div>
              Moyenne: {analysisData.filter(r => r.priority === 'medium').length}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-200 rounded-full"></div>
              Faible: {analysisData.filter(r => r.priority === 'low').length}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">N°</TableHead>
                <TableHead className="w-32">Thématique</TableHead>
                <TableHead className="w-40">Question résumée</TableHead>
                <TableHead className="w-48">Réponse choisie</TableHead>
                <TableHead className="w-48">Analyse / Enjeu identifié</TableHead>
                <TableHead className="w-48">Actions recommandées</TableHead>
                <TableHead className="w-20">Priorité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysisData.map((row) => (
                <TableRow key={row.questionId}>
                  <TableCell className="font-medium">{row.questionId}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {row.thematic}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{row.questionSummary}</TableCell>
                  <TableCell className="text-sm">{row.selectedResponse}</TableCell>
                  <TableCell className="text-sm text-gray-700">{row.analysis}</TableCell>
                  <TableCell className="text-sm text-blue-700">{row.recommendedActions}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(row.priority)}>
                      {row.priority === 'high' ? 'Haute' : row.priority === 'medium' ? 'Moyenne' : 'Faible'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">🧮 Génération de dashboard dynamique</h4>
          <p className="text-sm text-gray-600 mb-3">
            Cette grille d'analyse est conçue pour être transformée en dashboard interactif avec :
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>🧩 Filtrage dynamique par thématique et criticité</li>
            <li>📊 Vue synthétique des priorités stratégiques par thème</li>
            <li>🗺 Cartographie des besoins couplés à des personas agentiques</li>
            <li>📈 Évolution dans le temps si plusieurs vagues de réponses</li>
            <li>🚀 Génération automatique de feuilles de route IA-SST personnalisées</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponseAnalysis;
