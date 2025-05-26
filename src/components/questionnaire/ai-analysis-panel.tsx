
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAIAssistant } from '@/hooks/use-ai-assistant';

interface AIAnalysisPanelProps {
  responses: Record<number, { option: string; custom?: string }>;
  sections: any[];
}

const AIAnalysisPanel = ({ responses, sections }: AIAnalysisPanelProps) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<'synthesis' | 'patterns' | 'risks' | null>(null);
  const { analyzeContent, isLoading } = useAIAssistant();

  const generateAnalysis = async (type: 'questionnaire_analysis' | 'response_patterns' | 'risk_assessment') => {
    const responseText = Object.entries(responses)
      .map(([questionId, response]) => {
        const question = sections
          .flatMap(s => s.questions)
          .find(q => q.id === parseInt(questionId));
        return `Q: ${question?.question || 'Question inconnue'}\nR: ${response.option}${response.custom ? ` (${response.custom})` : ''}`;
      })
      .join('\n\n');

    const context = `Questionnaire IGNITIA - ${sections.length} sections, ${Object.keys(responses).length} réponses`;

    const result = await analyzeContent({
      analysisType: type,
      text: responseText,
      context
    });

    if (result) {
      setAnalysis(result);
      setAnalysisType(type === 'questionnaire_analysis' ? 'synthesis' : 
                     type === 'response_patterns' ? 'patterns' : 'risks');
    }
  };

  const analysisOptions = [
    {
      type: 'questionnaire_analysis' as const,
      label: 'Synthèse intelligente',
      icon: <FileText className="h-4 w-4" />,
      description: 'Analyse complète avec recommandations',
      color: 'blue'
    },
    {
      type: 'response_patterns' as const,
      label: 'Détection de patterns',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Identification des tendances',
      color: 'green'
    },
    {
      type: 'risk_assessment' as const,
      label: 'Évaluation des risques',
      icon: <AlertTriangle className="h-4 w-4" />,
      description: 'Analyse des risques prioritaires',
      color: 'orange'
    }
  ];

  const responseCount = Object.keys(responses).length;
  const canAnalyze = responseCount >= 5; // Minimum 5 réponses pour une analyse pertinente

  if (!canAnalyze) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-4 text-center text-gray-500">
          <Brain className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">
            Répondez à au moins 5 questions pour activer l'analyse IA
          </p>
          <Badge variant="outline" className="mt-2">
            {responseCount}/5 réponses
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg text-blue-800">Analyse IA Avancée</CardTitle>
          <Badge className="bg-blue-600">
            {responseCount} réponses
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {!analysis ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {analysisOptions.map((option) => (
              <Button
                key={option.type}
                variant="outline"
                onClick={() => generateAnalysis(option.type)}
                disabled={isLoading}
                className={`h-auto p-4 flex flex-col items-start text-left border-${option.color}-200 hover:bg-${option.color}-50`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {option.icon}
                  <span className="font-medium text-sm">{option.label}</span>
                </div>
                <p className="text-xs text-gray-600">{option.description}</p>
              </Button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-blue-600">
                {analysisType === 'synthesis' ? 'Synthèse' : 
                 analysisType === 'patterns' ? 'Patterns' : 'Risques'}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAnalysis(null)}
              >
                Nouvelle analyse
              </Button>
            </div>
            
            <div className="bg-white rounded-lg p-4 border">
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-700">
                  {analysis}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAnalysisPanel;
