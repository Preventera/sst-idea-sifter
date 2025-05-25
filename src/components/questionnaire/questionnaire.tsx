
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, FileText, Brain, Database, Settings, Shield, Users, Zap, TrendingUp, Telescope, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import ResponseAnalysis from "./response-analysis";
import QuestionnaireProgress from "./questionnaire-progress";
import RealtimeRecommendations from "./real-time-recommendations";
import SectionValidation from "./section-validation";

interface QuestionOption {
  id: string;
  emoji: string;
  text: string;
}

interface Question {
  id: number;
  text: string;
  options: QuestionOption[];
  selectedOption?: string;
  customResponse?: string;
}

interface QuestionnaireSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  questions: Question[];
}

interface QuestionnaireProps {
  onClose: () => void;
  onGenerateProject?: (responses: Record<number, { option: string; custom?: string }>) => void;
}

const QUESTIONNAIRE_SECTIONS: QuestionnaireSection[] = [
  {
    id: "objectifs",
    title: "Objectifs et Enjeux du Projet",
    icon: <FileText className="h-5 w-5" />,
    description: "Définissez les problèmes à résoudre et les résultats attendus",
    questions: [
      {
        id: 1,
        text: "Quels objectifs prioritaires souhaitez-vous atteindre avec une solution IA en SST ?",
        options: [
          { id: "reduction", emoji: "🛡", text: "Réduction des incidents et accidents" },
          { id: "maladies", emoji: "📉", text: "Diminution des maladies professionnelles" },
          { id: "visibilite", emoji: "🔎", text: "Meilleure visibilité sur les risques émergents" },
          { id: "conformite", emoji: "📈", text: "Amélioration de la conformité réglementaire" },
          { id: "individualisation", emoji: "👥", text: "Individualisation de la prévention selon les postes" }
        ]
      },
      {
        id: 2,
        text: "Quels processus SST souhaitez-vous automatiser ou renforcer avec des agents ?",
        options: [
          { id: "veille", emoji: "📑", text: "Veille réglementaire et gestion documentaire" },
          { id: "detection", emoji: "🔔", text: "Détection de comportements à risque en temps réel" },
          { id: "formation", emoji: "🎓", text: "Formation personnalisée et adaptative" },
          { id: "analyse", emoji: "📊", text: "Analyse prédictive basée sur les incidents passés" },
          { id: "automatisation", emoji: "⚙", text: "Automatisation de la planification d'audits et contrôles" }
        ]
      },
      {
        id: 3,
        text: "Quelles sources de données IA sont disponibles dans votre organisation ?",
        options: [
          { id: "rapports", emoji: "📂", text: "Rapports d'incidents, audits, registres SST" },
          { id: "video", emoji: "📸", text: "Vidéosurveillance et images de zones à risque" },
          { id: "capteurs", emoji: "🧍", text: "Capteurs portés (EPI, wearables, fatigue)" },
          { id: "iot", emoji: "🌐", text: "Données IoT (température, bruit, gaz, vibrations)" },
          { id: "procedures", emoji: "📑", text: "Fiches de poste, fiches de sécurité, procédures" }
        ]
      }
    ]
  },
  {
    id: "retours",
    title: "Types de Retours Attendus",
    icon: <Brain className="h-5 w-5" />,
    description: "Définissez les interactions souhaitées avec les agents",
    questions: [
      {
        id: 4,
        text: "Quels types de retours attendez-vous des agents intelligents ?",
        options: [
          { id: "alertes", emoji: "🔔", text: "Alertes en temps réel sur risques détectés" },
          { id: "rapports", emoji: "📋", text: "Rapports périodiques ou automatisés" },
          { id: "recommandations", emoji: "✅", text: "Recommandations correctives concrètes" },
          { id: "formations", emoji: "🎯", text: "Ciblage de formations ou rappels" },
          { id: "dialogue", emoji: "💬", text: "Dialogue personnalisé (type assistant SST)" }
        ]
      },
      {
        id: 5,
        text: "Quels sont les contextes de déploiement envisagés ?",
        options: [
          { id: "usine", emoji: "🏭", text: "Usine ou site de production industrielle" },
          { id: "chantier", emoji: "🏗", text: "Chantier de construction ou BTP" },
          { id: "itinerant", emoji: "🚚", text: "Travailleur isolé ou itinérant" },
          { id: "bureaux", emoji: "🏢", text: "Bureaux ou environnement tertiaire" },
          { id: "extreme", emoji: "🌍", text: "Milieu confiné, marin, souterrain, ou extrême" }
        ]
      }
    ]
  },
  {
    id: "risques",
    title: "Catégories de Risques",
    icon: <Shield className="h-5 w-5" />,
    description: "Priorisez les types de risques à analyser",
    questions: [
      {
        id: 6,
        text: "Quelles catégories de risques souhaitez-vous prioriser dans l'analyse IA ?",
        options: [
          { id: "respiratoires", emoji: "🫁", text: "Risques respiratoires (asthme, poussières, vapeurs)" },
          { id: "psychosociaux", emoji: "🧠", text: "Risques psychosociaux (stress, isolement, fatigue mentale)" },
          { id: "physiques", emoji: "💪", text: "Risques physiques (TMS, port de charges)" },
          { id: "electriques", emoji: "⚡", text: "Risques électriques ou thermiques" },
          { id: "environnementaux", emoji: "🔥", text: "Risques environnementaux (chaleur, froid, bruit, substances)" }
        ]
      },
      {
        id: 7,
        text: "Qui seront les utilisateurs principaux des agents intelligents ?",
        options: [
          { id: "operateurs", emoji: "🧑‍🏭", text: "Opérateurs de terrain" },
          { id: "responsables", emoji: "🧑‍💼", text: "Responsables SST / QHSE" },
          { id: "maintenance", emoji: "🧑‍🔧", text: "Équipes de maintenance ou logistique" },
          { id: "rh", emoji: "📊", text: "Gestionnaires RH ou formation" },
          { id: "auditeurs", emoji: "🔍", text: "Auditeurs internes ou externes" }
        ]
      }
    ]
  },
  {
    id: "interaction",
    title: "Types d'Interaction",
    icon: <Users className="h-5 w-5" />,
    description: "Définissez l'expérience utilisateur souhaitée",
    questions: [
      {
        id: 8,
        text: "Quel type d'interaction attendez-vous avec les agents IA ?",
        options: [
          { id: "conversationnel", emoji: "💬", text: "Assistant conversationnel (chat, voix)" },
          { id: "dashboard", emoji: "📈", text: "Interface de supervision / tableau de bord" },
          { id: "email", emoji: "📧", text: "Rapports automatisés ou email d'alerte" },
          { id: "mobile", emoji: "📲", text: "Application mobile pour les opérateurs" },
          { id: "apprentissage", emoji: "🔁", text: "Système d'apprentissage basé sur les retours utilisateur" }
        ]
      },
      {
        id: 9,
        text: "Quelles fonctions de conformité doivent être renforcées ?",
        options: [
          { id: "echeances", emoji: "📅", text: "Suivi des échéances réglementaires (audits, formations)" },
          { id: "documents", emoji: "📄", text: "Contrôle de validité documentaire (fiches de sécurité, plans)" },
          { id: "tracabilite", emoji: "📦", text: "Traçabilité des équipements et EPI utilisés" },
          { id: "verification", emoji: "✅", text: "Vérification automatique des exigences INRS / ISO 45001" },
          { id: "reporting", emoji: "📊", text: "Génération de rapports de conformité" }
        ]
      }
    ]
  },
  {
    id: "indicateurs",
    title: "Indicateurs et Mesures",
    icon: <TrendingUp className="h-5 w-5" />,
    description: "Définissez les métriques de suivi",
    questions: [
      {
        id: 10,
        text: "Quels indicateurs souhaitez-vous suivre via les agents ?",
        options: [
          { id: "accidents", emoji: "🩺", text: "Taux d'accidents ou incidents" },
          { id: "risques", emoji: "🧭", text: "Indicateurs de risques détectés (anomalies, expositions)" },
          { id: "bienetre", emoji: "🧘‍♂️", text: "Indicateurs de bien-être ou stress au travail" },
          { id: "formation", emoji: "📚", text: "Taux de complétion des formations obligatoires" },
          { id: "actions", emoji: "🏁", text: "Suivi des actions correctives mises en œuvre" }
        ]
      },
      {
        id: 11,
        text: "Quels types d'alertes préférez-vous recevoir ?",
        options: [
          { id: "critique", emoji: "🚨", text: "Alerte immédiate sur événement critique (chute, incendie)" },
          { id: "mobile", emoji: "📱", text: "Notification mobile pour les anomalies non urgentes" },
          { id: "rapport", emoji: "🕒", text: "Rapport journalier ou hebdomadaire automatisé" },
          { id: "email", emoji: "📩", text: "Email avec recommandations SST contextuelles" },
          { id: "embarquees", emoji: "📼", text: "Alertes visuelles/sonores via dispositifs embarqués" }
        ]
      }
    ]
  },
  {
    id: "deploiement",
    title: "Déploiement et Autonomie",
    icon: <Zap className="h-5 w-5" />,
    description: "Planifiez l'infrastructure et l'autonomie des agents",
    questions: [
      {
        id: 12,
        text: "Quel degré d'autonomie souhaitez-vous pour les agents ?",
        options: [
          { id: "assistance", emoji: "🧑‍💻", text: "Assistance à la décision uniquement" },
          { id: "recommandations", emoji: "🧠", text: "Recommandations automatiques validables" },
          { id: "supervision", emoji: "🔁", text: "Exécution automatisée avec supervision humaine" },
          { id: "autonome", emoji: "🤖", text: "Actions autonomes sur incidents définis" },
          { id: "validation", emoji: "🛑", text: "Aucune action sans validation manuelle" }
        ]
      },
      {
        id: 13,
        text: "À quelle fréquence les agents doivent-ils analyser les données ?",
        options: [
          { id: "temps_reel", emoji: "⏱", text: "En continu (temps réel)" },
          { id: "horaire", emoji: "⏳", text: "Toutes les heures" },
          { id: "quotidien", emoji: "🕒", text: "Une fois par jour (batch)" },
          { id: "hebdomadaire", emoji: "📆", text: "Hebdomadaire ou périodique" },
          { id: "manuel", emoji: "🔀", text: "Sur déclenchement manuel (on-demand)" }
        ]
      }
    ]
  },
  {
    id: "technologies",
    title: "Technologies et Dispositifs",
    icon: <Settings className="h-5 w-5" />,
    description: "Identifiez les technologies à intégrer",
    questions: [
      {
        id: 14,
        text: "Quels dispositifs portés ou embarqués utilisez-vous ?",
        options: [
          { id: "epi", emoji: "🦺", text: "EPI connectés (casques, harnais, capteurs de gaz)" },
          { id: "montres", emoji: "📱", text: "Montres ou bracelets intelligents (vitalité, fatigue)" },
          { id: "lunettes", emoji: "👁", text: "Lunettes intelligentes (vision, UV, reconnaissance)" },
          { id: "chaussures", emoji: "👟", text: "Chaussures connectées (détection chute, pression)" },
          { id: "casques", emoji: "🎧", text: "Casques audio intelligents (bruit, communication)" }
        ]
      },
      {
        id: 15,
        text: "Quelles technologies complémentaires aimeriez-vous intégrer ?",
        options: [
          { id: "vision", emoji: "🔍", text: "Vision par ordinateur" },
          { id: "predictive", emoji: "🧠", text: "IA prédictive / machine learning" },
          { id: "geolocalisation", emoji: "🛰", text: "Géolocalisation (indoor/outdoor)" },
          { id: "maintenance", emoji: "🛠", text: "Maintenance prédictive des équipements" },
          { id: "vr", emoji: "🧑‍🏫", text: "Réalité virtuelle / augmentée pour formation" }
        ]
      }
    ]
  },
  {
    id: "contraintes",
    title: "Contraintes et Réglementations",
    icon: <Shield className="h-5 w-5" />,
    description: "Définissez le cadre réglementaire et les contraintes",
    questions: [
      {
        id: 16,
        text: "Quelles contraintes réglementaires doivent être impérativement respectées ?",
        options: [
          { id: "code_travail", emoji: "📕", text: "Code du Travail (France ou pays concerné)" },
          { id: "iso", emoji: "📘", text: "Norme ISO 45001 ou OHSAS 18001" },
          { id: "fds", emoji: "🧾", text: "Fiches de données de sécurité (FDS)" },
          { id: "rgpd", emoji: "🛡", text: "RGPD / protection des données personnelles" },
          { id: "confidentialite", emoji: "🔒", text: "Confidentialité & traçabilité des incidents" }
        ]
      }
    ]
  },
  {
    id: "perspectives",
    title: "Perspectives d'Évolution",
    icon: <Telescope className="h-5 w-5" />,
    description: "Anticipez les évolutions futures du système",
    questions: [
      {
        id: 17,
        text: "Comment souhaitez-vous mesurer le ROI global de l'intelligence agentique en SST ?",
        options: [
          { id: "economie", emoji: "💶", text: "Économie réalisée sur les coûts d'accidents/incidents" },
          { id: "temps", emoji: "🕒", text: "Gain de temps sur la gestion documentaire/audits" },
          { id: "conformite", emoji: "🎯", text: "Amélioration du score de conformité réglementaire" },
          { id: "engagement", emoji: "👥", text: "Implication accrue des équipes dans les processus SST" },
          { id: "performance", emoji: "📈", text: "Indicateurs croisés SST + performance opérationnelle" }
        ]
      }
    ]
  }
];

const Questionnaire = ({ onClose, onGenerateProject }: QuestionnaireProps) => {
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<Record<number, { option: string; custom?: string }>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  // Sauvegarde automatique
  useEffect(() => {
    const saved = localStorage.getItem('ignitia-questionnaire-responses');
    if (saved) {
      try {
        setResponses(JSON.parse(saved));
        toast({
          title: "Données restaurées",
          description: "Vos réponses précédentes ont été restaurées.",
        });
      } catch (error) {
        console.error('Erreur lors de la restauration:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ignitia-questionnaire-responses', JSON.stringify(responses));
  }, [responses]);

  const updateResponse = (questionId: number, option: string, custom?: string) => {
    setResponses(prev => ({ 
      ...prev, 
      [questionId]: { option, custom } 
    }));
  };

  const getCurrentSectionProgress = () => {
    const currentQuestions = QUESTIONNAIRE_SECTIONS[currentSection].questions;
    const answeredQuestions = currentQuestions.filter(q => responses[q.id]?.option).length;
    return (answeredQuestions / currentQuestions.length) * 100;
  };

  const getOverallProgress = () => {
    const totalQuestions = QUESTIONNAIRE_SECTIONS.reduce((sum, section) => sum + section.questions.length, 0);
    const answeredQuestions = Object.values(responses).filter(r => r.option).length;
    return (answeredQuestions / totalQuestions) * 100;
  };

  const nextSection = () => {
    if (currentSection < QUESTIONNAIRE_SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      setIsCompleted(true);
      localStorage.removeItem('ignitia-questionnaire-responses');
      toast({
        title: "Questionnaire terminé !",
        description: "Vos réponses ont été analysées et les recommandations sont prêtes.",
      });
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const saveProgress = () => {
    const answeredCount = Object.values(responses).filter(r => r.option).length;
    toast({
      title: "Progression sauvegardée",
      description: `${answeredCount} réponses sauvegardées localement.`,
    });
  };

  const exportResults = () => {
    const results = QUESTIONNAIRE_SECTIONS.map(section => ({
      section: section.title,
      questions: section.questions.map(q => ({
        question: q.text,
        response: responses[q.id] ? {
          selectedOption: responses[q.id].option,
          customResponse: responses[q.id].custom || "Non spécifié"
        } : "Non renseigné"
      }))
    }));

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questionnaire-ignitia-sst.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-green-700">Questionnaire IGNITIA Complété !</CardTitle>
              <p className="text-gray-600">
                Vous avez répondu à {Object.values(responses).filter(r => r.option).length} questions sur {QUESTIONNAIRE_SECTIONS.reduce((sum, section) => sum + section.questions.length, 0)}.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Vos réponses vous aideront à structurer votre projet IA-SST IGNITIA. Ces informations sont maintenant prêtes 
                  pour être utilisées dans votre processus de priorisation et de cadrage.
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={exportResults}>
                  <FileText className="h-4 w-4 mr-2" />
                  Exporter les réponses
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Retour à IGNITIA
                </Button>
              </div>

              <ResponseAnalysis responses={responses} />
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
        {/* En-tête amélioré */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🚀 Questionnaire structuré IGNITIA
              </h1>
              <p className="text-gray-600">
                Outil de cadrage complet pour projets agentiques en Santé-Sécurité au Travail
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={saveProgress}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
              <Button variant="outline" onClick={onClose}>
                Fermer
              </Button>
            </div>
          </div>

          {/* Progression améliorée */}
          <QuestionnaireProgress 
            sections={QUESTIONNAIRE_SECTIONS}
            currentSection={currentSection}
            responses={responses}
            onSectionClick={setCurrentSection}
          />

          {/* Recommandations temps réel */}
          <RealtimeRecommendations responses={responses} />
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
            
            {/* Validation de section */}
            <SectionValidation section={section} responses={responses} />
          </CardHeader>

          <CardContent>
            <div className="space-y-8">
              {section.questions.map((question) => (
                <div key={question.id} className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {question.id}. {question.text}
                  </h3>
                  
                  <RadioGroup
                    value={responses[question.id]?.option || ""}
                    onValueChange={(value) => updateResponse(question.id, value, responses[question.id]?.custom)}
                    className="space-y-3"
                  >
                    {question.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value={option.id} id={`${question.id}-${option.id}`} />
                        <Label htmlFor={`${question.id}-${option.id}`} className="flex items-center gap-2 cursor-pointer">
                          <span className="text-lg">{option.emoji}</span>
                          <span>{option.text}</span>
                        </Label>
                      </div>
                    ))}
                    
                    {/* Option "Autre" améliorée */}
                    <div className="flex items-start space-x-3 p-3 rounded-lg border-2 border-dashed border-gray-200">
                      <RadioGroupItem value="autre" id={`${question.id}-autre`} />
                      <div className="flex-1">
                        <Label htmlFor={`${question.id}-autre`} className="flex items-center gap-2 cursor-pointer mb-2">
                          <span className="text-lg">✏</span>
                          <span className="font-medium">Autre (précisez) :</span>
                        </Label>
                        <Input
                          placeholder="Décrivez votre besoin spécifique..."
                          value={responses[question.id]?.custom || ""}
                          onChange={(e) => updateResponse(question.id, responses[question.id]?.option || "autre", e.target.value)}
                          onClick={() => updateResponse(question.id, "autre", responses[question.id]?.custom || "")}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>

            {/* Navigation améliorée */}
            <div className="flex justify-between items-center mt-8">
              <Button
                variant="outline"
                onClick={prevSection}
                disabled={currentSection === 0}
              >
                ← Section précédente
              </Button>
              
              <Badge variant="outline" className="text-sm">
                Section {currentSection + 1} sur {QUESTIONNAIRE_SECTIONS.length}
              </Badge>
              
              <Button onClick={nextSection}>
                {currentSection === QUESTIONNAIRE_SECTIONS.length - 1 ? "🎯 Terminer & Analyser" : "Section suivante →"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Questionnaire;
