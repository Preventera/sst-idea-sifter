
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle, FileText, Brain, Database, Settings, Shield, Users, Zap, TrendingUp, Telescope } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface QuestionnaireSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  questions: Question[];
}

interface Question {
  id: number;
  text: string;
  response: string;
}

interface QuestionnaireProps {
  onClose: () => void;
  onGenerateProject?: (responses: Record<number, string>) => void;
}

const QUESTIONNAIRE_SECTIONS: QuestionnaireSection[] = [
  {
    id: "objectifs",
    title: "Objectifs et Enjeux du Projet",
    icon: <FileText className="h-5 w-5" />,
    description: "Définissez les problèmes à résoudre et les résultats attendus",
    questions: [
      { id: 1, text: "Quel problème souhaitez-vous résoudre avec une solution agentique ?", response: "" },
      { id: 2, text: "Quels résultats mesurables attendez-vous de l'intégration d'IA ?", response: "" },
      { id: 3, text: "Avez-vous identifié les processus critiques pouvant être augmentés par des agents ?", response: "" },
      { id: 4, text: "Quel est le degré d'autonomie souhaité pour chaque agent ?", response: "" },
      { id: 5, text: "Quelle est la tolérance au risque opérationnel de votre organisation ?", response: "" },
      { id: 6, text: "Quels sont les cas d'usage prioritaires à couvrir dans les 6 prochains mois ?", response: "" },
      { id: 7, text: "Souhaitez-vous que les agents prennent des décisions ou formulent uniquement des recommandations ?", response: "" },
      { id: 8, text: "Quelles règles métiers doivent toujours être respectées par les agents ?", response: "" },
      { id: 9, text: "Y a-t-il des contraintes éthiques ou réglementaires propres à votre secteur ?", response: "" },
      { id: 10, text: "Avez-vous besoin de traçabilité des décisions prises par les agents ?", response: "" }
    ]
  },
  {
    id: "structure",
    title: "Structure du Système Multi-Agent",
    icon: <Brain className="h-5 w-5" />,
    description: "Organisez l'architecture de vos agents et leurs interactions",
    questions: [
      { id: 11, text: "Quelles fonctions voulez-vous répartir entre plusieurs agents ?", response: "" },
      { id: 12, text: "Avez-vous besoin d'un agent coordinateur (orchestrateur) ?", response: "" },
      { id: 13, text: "Chaque agent doit-il pouvoir s'adresser aux autres ?", response: "" },
      { id: 14, text: "Souhaitez-vous que les agents partagent une mémoire centrale ?", response: "" },
      { id: 15, text: "Quels seront les rôles principaux (conformité, formation, détection, etc.) ?", response: "" },
      { id: 16, text: "Quels types de messages les agents doivent-ils échanger ?", response: "" },
      { id: 17, text: "L'architecture agentique doit-elle être scalable horizontalement ?", response: "" },
      { id: 18, text: "Souhaitez-vous intégrer une gestion des rôles et permissions entre agents ?", response: "" },
      { id: 19, text: "Faut-il prévoir des agents hybrides humains+IA ?", response: "" },
      { id: 20, text: "Un agent peut-il évoluer ou apprendre seul dans le temps ?", response: "" }
    ]
  },
  {
    id: "donnees",
    title: "Sources de Données et Connaissances",
    icon: <Database className="h-5 w-5" />,
    description: "Identifiez les données disponibles et leur format",
    questions: [
      { id: 21, text: "Quelles sont les sources internes à exploiter (PDF, vidéos, rapports, IoT, etc.) ?", response: "" },
      { id: 22, text: "Les données sont-elles en temps réel, en batch ou mixtes ?", response: "" },
      { id: 23, text: "Existe-t-il des ontologies métier ou des taxonomies internes ?", response: "" },
      { id: 24, text: "Faut-il extraire de l'information depuis des documents non structurés ?", response: "" },
      { id: 25, text: "Avez-vous des historiques d'incidents/accidents ?", response: "" },
      { id: 26, text: "Quels capteurs IoT ou données contextuelles souhaitez-vous intégrer ?", response: "" },
      { id: 27, text: "Faut-il intégrer des bases de connaissances réglementaires ?", response: "" },
      { id: 28, text: "Quels sont les formats principaux à prévoir pour l'ingestion (PDF, DOCX, CSV, images, etc.) ?", response: "" },
      { id: 29, text: "Des données sensibles doivent-elles être anonymisées avant traitement ?", response: "" },
      { id: 30, text: "Souhaitez-vous enrichir automatiquement vos documents (métadonnées, catégories, tags) ?", response: "" }
    ]
  },
  {
    id: "fonctionnalites",
    title: "Fonctionnalités Spécifiques des Agents",
    icon: <Settings className="h-5 w-5" />,
    description: "Définissez les capacités spécialisées de chaque agent",
    questions: [
      { id: 31, text: "Souhaitez-vous qu'un agent détecte automatiquement les écarts de conformité ?", response: "" },
      { id: 32, text: "Quels règlements devez-vous surveiller (ex : INRS, Code du Travail, ISO 45001) ?", response: "" },
      { id: 33, text: "L'agent doit-il émettre des rapports automatisés ?", response: "" },
      { id: 34, text: "Doit-il effectuer une veille réglementaire continue ?", response: "" },
      { id: 35, text: "Peut-il proposer des actions correctives ?", response: "" },
      { id: 36, text: "Voulez-vous un agent qui analyse les incidents et en déduit des tendances ?", response: "" },
      { id: 37, text: "Souhaitez-vous des alertes de risque émergent ?", response: "" },
      { id: 38, text: "Quel type de modèle prédictif souhaitez-vous intégrer ?", response: "" },
      { id: 39, text: "Souhaitez-vous des recommandations personnalisées par poste ?", response: "" },
      { id: 40, text: "L'agent doit-il faire du scoring de dangerosité par tâche ?", response: "" },
      { id: 41, text: "Avez-vous des caméras installées dans les zones à risque ?", response: "" },
      { id: 42, text: "Souhaitez-vous détecter le non-port d'EPI ?", response: "" },
      { id: 43, text: "L'agent doit-il différencier les types de comportements dangereux ?", response: "" },
      { id: 44, text: "Faut-il analyser les flux en direct ou en différé ?", response: "" },
      { id: 45, text: "Quel niveau de précision est exigé (en % ou en type d'erreur) ?", response: "" },
      { id: 46, text: "Souhaitez-vous un agent qui propose des modules en fonction du profil et du poste ?", response: "" },
      { id: 47, text: "Intégrez-vous déjà une plateforme LMS ?", response: "" },
      { id: 48, text: "L'agent doit-il suivre l'assiduité et les performances ?", response: "" },
      { id: 49, text: "Souhaitez-vous des simulations VR ou AR pour la formation aux situations d'urgence ?", response: "" },
      { id: 50, text: "Doit-il recommander des rappels ou des modules à la suite d'un incident ?", response: "" }
    ]
  },
  {
    id: "securite",
    title: "Sécurité, Éthique et Gouvernance",
    icon: <Shield className="h-5 w-5" />,
    description: "Établissez les règles de gouvernance et de sécurité",
    questions: [
      { id: 51, text: "Qui peut superviser ou corriger un agent ?", response: "" },
      { id: 52, text: "Quelles sont les règles de sécurité des données à respecter ?", response: "" },
      { id: 53, text: "Souhaitez-vous une journalisation complète des actions des agents ?", response: "" },
      { id: 54, text: "Avez-vous besoin de définir une gouvernance pour l'usage des IA ?", response: "" },
      { id: 55, text: "Les agents doivent-ils pouvoir expliquer leurs décisions aux utilisateurs humains ?", response: "" },
      { id: 56, text: "Des audits IA doivent-ils être réalisés régulièrement ?", response: "" },
      { id: 57, text: "Y a-t-il des risques d'usage abusif des fonctions proposées ?", response: "" },
      { id: 58, text: "Les utilisateurs finaux sont-ils informés de l'usage d'agents ?", response: "" },
      { id: 59, text: "Des mécanismes de blocage manuel sont-ils nécessaires ?", response: "" },
      { id: 60, text: "Souhaitez-vous interdire certains types de requêtes ou de suggestions ?", response: "" }
    ]
  },
  {
    id: "interaction",
    title: "Interaction Homme-Agent",
    icon: <Users className="h-5 w-5" />,
    description: "Concevez l'expérience utilisateur avec les agents",
    questions: [
      { id: 61, text: "Quelle interface souhaitez-vous : chatbot, dashboard, assistant vocal ?", response: "" },
      { id: 62, text: "Les agents doivent-ils initier des interactions ou attendre des requêtes ?", response: "" },
      { id: 63, text: "Quel ton doit adopter l'agent (formel, empathique, neutre) ?", response: "" },
      { id: 64, text: "Doit-il adapter son vocabulaire au profil utilisateur ?", response: "" },
      { id: 65, text: "Faut-il que l'agent pose des questions de clarification ?", response: "" },
      { id: 66, text: "L'utilisateur peut-il valider ou rejeter les recommandations de l'agent ?", response: "" },
      { id: 67, text: "Souhaitez-vous une mémoire courte (session) ou longue (historique) ?", response: "" },
      { id: 68, text: "Les agents doivent-ils pouvoir reformuler ou résumer l'information ?", response: "" },
      { id: 69, text: "Faut-il un mode « supervision humaine » ?", response: "" },
      { id: 70, text: "Les agents peuvent-ils recevoir des feedbacks pour ajuster leur comportement ?", response: "" }
    ]
  },
  {
    id: "deploiement",
    title: "Déploiement Technique",
    icon: <Zap className="h-5 w-5" />,
    description: "Planifiez l'infrastructure et l'intégration technique",
    questions: [
      { id: 71, text: "L'agent sera-t-il déployé sur le cloud, en local ou en edge ?", response: "" },
      { id: 72, text: "Quel est le niveau de tolérance à la latence ?", response: "" },
      { id: 73, text: "Quelle interopérabilité attendez-vous avec vos systèmes existants (ERP, GMAO, GED) ?", response: "" },
      { id: 74, text: "Utilisez-vous déjà des API internes ou ouvertes ?", response: "" },
      { id: 75, text: "Avez-vous une politique de versionning pour les modèles ou règles métier ?", response: "" },
      { id: 76, text: "Faut-il prévoir un environnement de test séparé du système de production ?", response: "" },
      { id: 77, text: "Souhaitez-vous utiliser des outils open-source (spaCy, Haystack, YOLOv5) ?", response: "" },
      { id: 78, text: "Le système doit-il être capable d'auto-déploiement ou CI/CD ?", response: "" },
      { id: 79, text: "Préférez-vous un modèle en batch (tâches différées) ou temps réel ?", response: "" },
      { id: 80, text: "Quels sont vos besoins en monitoring (logs, dashboards, alertes) ?", response: "" }
    ]
  },
  {
    id: "mesure",
    title: "Mesure d'Impact et KPI",
    icon: <TrendingUp className="h-5 w-5" />,
    description: "Définissez les métriques de succès et de performance",
    questions: [
      { id: 81, text: "Quels sont les KPI à suivre pour mesurer le succès du projet ?", response: "" },
      { id: 82, text: "Quel est le ROI attendu de l'automatisation ?", response: "" },
      { id: 83, text: "Souhaitez-vous mesurer la réduction des incidents ?", response: "" },
      { id: 84, text: "Faut-il mesurer le taux d'adoption des outils IA par les utilisateurs ?", response: "" },
      { id: 85, text: "Avez-vous besoin d'un module de reporting automatique ?", response: "" },
      { id: 86, text: "Voulez-vous suivre l'évolution des niveaux de conformité ?", response: "" },
      { id: 87, text: "Souhaitez-vous croiser les KPI IA avec les indicateurs RH, QHSE ou financiers ?", response: "" },
      { id: 88, text: "Faut-il prévoir une notation par les utilisateurs ?", response: "" },
      { id: 89, text: "Les recommandations doivent-elles être classées selon leur impact ?", response: "" },
      { id: 90, text: "Le système doit-il apprendre des résultats obtenus ?", response: "" }
    ]
  },
  {
    id: "evolution",
    title: "Perspectives d'Évolution",
    icon: <Telescope className="h-5 w-5" />,
    description: "Anticipez les évolutions futures du système",
    questions: [
      { id: 91, text: "Souhaitez-vous que les agents apprennent en continu ?", response: "" },
      { id: 92, text: "L'architecture doit-elle être modulaire et extensible ?", response: "" },
      { id: 93, text: "Faut-il anticiper l'ajout de nouveaux domaines (environnement, qualité, RH…) ?", response: "" },
      { id: 94, text: "Quels scénarios futuristes imaginez-vous pour votre système agentique ?", response: "" },
      { id: 95, text: "Les agents doivent-ils être multilingues ?", response: "" },
      { id: 96, text: "Souhaitez-vous intégrer la réalité augmentée, le métavers ou des jumeaux numériques ?", response: "" },
      { id: 97, text: "Faut-il préparer des modèles de simulation d'incidents ?", response: "" },
      { id: 98, text: "Le système doit-il être compatible avec les normes de l'industrie 5.0 ?", response: "" },
      { id: 99, text: "Avez-vous des projets d'open innovation ou de co-développement ?", response: "" },
      { id: 100, text: "Les agents doivent-ils être certifiables ou validés par des tiers ?", response: "" }
    ]
  }
];

const Questionnaire = ({ onClose, onGenerateProject }: QuestionnaireProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const updateResponse = (questionId: number, response: string) => {
    setResponses(prev => ({ ...prev, [questionId]: response }));
  };

  const getCurrentSectionProgress = () => {
    const currentQuestions = QUESTIONNAIRE_SECTIONS[currentSection].questions;
    const answeredQuestions = currentQuestions.filter(q => responses[q.id]?.trim()).length;
    return (answeredQuestions / currentQuestions.length) * 100;
  };

  const getOverallProgress = () => {
    const totalQuestions = QUESTIONNAIRE_SECTIONS.reduce((sum, section) => sum + section.questions.length, 0);
    const answeredQuestions = Object.values(responses).filter(r => r.trim()).length;
    return (answeredQuestions / totalQuestions) * 100;
  };

  const nextSection = () => {
    if (currentSection < QUESTIONNAIRE_SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const exportResults = () => {
    const results = QUESTIONNAIRE_SECTIONS.map(section => ({
      section: section.title,
      questions: section.questions.map(q => ({
        question: q.text,
        response: responses[q.id] || "Non renseigné"
      }))
    }));

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questionnaire-ia-sst.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-green-700">Questionnaire Complété !</CardTitle>
              <p className="text-gray-600">
                Vous avez répondu à {Object.values(responses).filter(r => r.trim()).length} questions sur 100.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Vos réponses vous aideront à structurer votre projet IA-SST. Vous pouvez maintenant utiliser ces informations 
                  pour créer un projet personnalisé dans l'outil de priorisation.
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={exportResults}>
                  <FileText className="h-4 w-4 mr-2" />
                  Exporter les réponses
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Retour à l'outil
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const section = QUESTIONNAIRE_SECTIONS[currentSection];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                📋 Questionnaire d'Identification des Besoins IA
              </h1>
              <p className="text-gray-600">
                Projet agentique en Santé-Sécurité au Travail
              </p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>

          {/* Progrès global */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progrès global</span>
              <span className="text-sm text-gray-500">
                {Object.values(responses).filter(r => r.trim()).length} / 100
              </span>
            </div>
            <Progress value={getOverallProgress()} className="h-2" />
          </div>

          {/* Navigation des sections */}
          <div className="flex flex-wrap gap-2">
            {QUESTIONNAIRE_SECTIONS.map((sect, index) => (
              <Button
                key={sect.id}
                variant={index === currentSection ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentSection(index)}
                className="text-xs"
              >
                {sect.icon}
                <span className="ml-1 hidden sm:inline">{sect.title}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Section courante */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                {section.icon}
              </div>
              <div>
                <CardTitle className="text-xl">
                  {currentSection + 1}. {section.title}
                </CardTitle>
                <p className="text-gray-600 text-sm">{section.description}</p>
              </div>
            </div>
            
            {/* Progrès de la section */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progrès de cette section</span>
                <Badge variant="outline">
                  {section.questions.filter(q => responses[q.id]?.trim()).length} / {section.questions.length}
                </Badge>
              </div>
              <Progress value={getCurrentSectionProgress()} className="h-2" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              {section.questions.map((question) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {question.id}. {question.text}
                  </label>
                  <Textarea
                    value={responses[question.id] || ""}
                    onChange={(e) => updateResponse(question.id, e.target.value)}
                    placeholder="Votre réponse..."
                    className="min-h-[80px]"
                  />
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevSection}
                disabled={currentSection === 0}
              >
                Section précédente
              </Button>
              <Button onClick={nextSection}>
                {currentSection === QUESTIONNAIRE_SECTIONS.length - 1 ? "Terminer" : "Section suivante"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Questionnaire;
