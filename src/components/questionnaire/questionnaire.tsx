
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, X, BarChart3, FileText, CheckCircle } from "lucide-react";
import { questionnaireSections } from "@/data/questionnaire-data";
import QuestionnaireProgress from "./questionnaire-progress";
import SectionValidation from "./section-validation";
import AIAnalysisPanel from "./ai-analysis-panel";
import ResponseAnalysis from "./response-analysis";
import RealTimeRecommendations from "./real-time-recommendations";
import { useToast } from "@/hooks/use-toast";
import { Project, Criteria } from "@/types/project";

interface QuestionnaireProps {
  onClose: () => void;
  onCreateProject?: (project: Project) => void;
}

const Questionnaire = ({ onClose, onCreateProject }: QuestionnaireProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<Record<number, { option: string; custom?: string }>>({});
  const [customInputs, setCustomInputs] = useState<Record<number, string>>({});
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const { toast } = useToast();

  const totalQuestions = questionnaireSections.reduce((sum, section) => sum + section.questions.length, 0);
  const answeredQuestions = Object.keys(responses).length;
  const progressPercentage = Math.round((answeredQuestions / totalQuestions) * 100);

  const currentSectionData = questionnaireSections[currentSection];
  const isLastSection = currentSection === questionnaireSections.length - 1;

  const handleOptionChange = (questionId: number, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: { option: value, custom: customInputs[questionId] }
    }));
  };

  const handleCustomInputChange = (questionId: number, value: string) => {
    setCustomInputs(prev => ({ ...prev, [questionId]: value }));
    
    if (responses[questionId]) {
      setResponses(prev => ({
        ...prev,
        [questionId]: { ...prev[questionId], custom: value }
      }));
    }
  };

  const nextSection = () => {
    if (!isLastSection) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const handleCreateProjectFromAnalysis = (description: string) => {
    if (onCreateProject) {
      // Créer des critères par défaut basés sur l'analyse
      const defaultCriteria: Criteria = {
        impact: 7,
        excellence: 6,
        faisabilite: 6,
        gouvernance: 5,
        securite: 7,
        acceptabilite: 6,
        perennite: 5
      };
      
      const score = Object.values(defaultCriteria).reduce((sum, value) => sum + value, 0) / Object.values(defaultCriteria).length;
      
      const project: Project = {
        id: Date.now().toString(),
        name: description,
        criteria: defaultCriteria,
        score: Math.round(score * 100) / 100
      };
      
      onCreateProject(project);
      onClose(); // Fermer le questionnaire après création du projet
    }
  };

  const completedSections = questionnaireSections.slice(0, currentSection).filter((_, index) => {
    const sectionQuestions = questionnaireSections[index].questions;
    return sectionQuestions.every(q => responses[q.id]);
  }).length;

  if (showSummary) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-auto">
        <div className="container mx-auto py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📋 Synthèse IGNITIA</h1>
              <p className="text-gray-600">Analyse complète de vos réponses</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Fermer
            </Button>
          </div>
          
          <div className="space-y-6">
            <ResponseAnalysis responses={responses} />
            
            <AIAnalysisPanel 
              responses={responses} 
              sections={questionnaireSections}
              onCreateProject={handleCreateProjectFromAnalysis}
            />
          </div>
        </div>
      </div>
    );
  }

  if (showAnalysis) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-auto">
        <div className="container mx-auto py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🤖 Analyse IA - IGNITIA</h1>
              <p className="text-gray-600">Insights intelligents de vos réponses</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAnalysis(false)}>
                Retour au questionnaire
              </Button>
              <Button variant="outline" onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                Fermer
              </Button>
            </div>
          </div>
          
          <AIAnalysisPanel 
            responses={responses} 
            sections={questionnaireSections}
            onCreateProject={handleCreateProjectFromAnalysis}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="container mx-auto py-6">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📋 Questionnaire IGNITIA</h1>
            <p className="text-gray-600">Cadrage intelligent pour projets IA-SST</p>
          </div>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Fermer
          </Button>
        </div>

        {/* Barre de progression */}
        <QuestionnaireProgress 
          currentSection={currentSection}
          totalSections={questionnaireSections.length}
          answeredQuestions={answeredQuestions}
          totalQuestions={totalQuestions}
          completedSections={completedSections}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale - Questions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {currentSectionData.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {currentSectionData.description}
                    </p>
                  </div>
                  <Badge variant="outline">
                    Section {currentSection + 1}/{questionnaireSections.length}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {currentSectionData.questions.map((question) => (
                  <div key={question.id} className="border-b pb-6 last:border-b-0">
                    <h3 className="font-medium mb-3">{question.question}</h3>
                    
                    <RadioGroup
                      value={responses[question.id]?.option || ""}
                      onValueChange={(value) => handleOptionChange(question.id, value)}
                    >
                      {question.options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={`${question.id}-${option.id}`} />
                          <Label htmlFor={`${question.id}-${option.id}`} className="text-sm leading-relaxed cursor-pointer flex-1">
                            {option.text}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    {question.allowCustom && (
                      <div className="mt-3">
                        <Label htmlFor={`custom-${question.id}`} className="text-sm text-gray-600">
                          Autre (précisez) :
                        </Label>
                        <Textarea
                          id={`custom-${question.id}`}
                          placeholder="Votre réponse personnalisée..."
                          value={customInputs[question.id] || ""}
                          onChange={(e) => handleCustomInputChange(question.id, e.target.value)}
                          className="mt-1"
                          rows={2}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={prevSection}
                disabled={currentSection === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Précédent
              </Button>

              <div className="flex gap-2">
                {answeredQuestions >= 5 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowAnalysis(true)}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-700"
                  >
                    🤖 Analyse IA
                  </Button>
                )}
                
                {answeredQuestions >= 10 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowSummary(true)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Synthèse complète
                  </Button>
                )}
              </div>

              <Button
                onClick={nextSection}
                disabled={isLastSection}
              >
                Suivant
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-4">
            <SectionValidation 
              currentSection={currentSection}
              sections={questionnaireSections}
              responses={responses}
            />
            
            {answeredQuestions >= 3 && (
              <RealTimeRecommendations responses={responses} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
