
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Wand2, Check, RefreshCw } from 'lucide-react';
import { useAIAssistant } from '@/hooks/use-ai-assistant';
import { Criteria } from '@/types/project';
import LLMSelector, { LLMProvider } from './llm-selector';

interface ProjectDescriptionGeneratorProps {
  criteria: Criteria;
  scianSectorId?: string;
  onGenerate: (description: string) => void;
}

const ProjectDescriptionGenerator = ({ criteria, scianSectorId, onGenerate }: ProjectDescriptionGeneratorProps) => {
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatedDescriptions, setGeneratedDescriptions] = useState<string[]>([]);
  const [selectedLLM, setSelectedLLM] = useState<LLMProvider>('openai');
  const { generateContent, analyzeContent, isLoading } = useAIAssistant();

  const generateDescriptions = async () => {
    const criteriaText = Object.entries(criteria)
      .map(([key, value]) => `${key}: ${value}/10`)
      .join(', ');

    const context = scianSectorId ? `Secteur SCIAN: ${scianSectorId}` : '';

    const prompts = [
      `Génère une description de projet IA-SST innovant basée sur ces critères: ${criteriaText}`,
      `Propose un projet IA-SST axé sur la prévention avec ces scores: ${criteriaText}`,
      `Suggère un projet IA-SST pour améliorer la sécurité au travail: ${criteriaText}`
    ];

    const descriptions = [];
    
    for (const prompt of prompts) {
      let result = null;
      
      if (selectedLLM === 'openai') {
        result = await generateContent({
          type: 'project_description',
          prompt,
          context
        });
      } else {
        result = await analyzeContent({
          analysisType: 'questionnaire_analysis',
          text: `Génère une description de projet basée sur: ${prompt}`,
          context
        });
      }
      
      if (result) descriptions.push(result);
    }

    setGeneratedDescriptions(descriptions);
    setShowGenerator(true);
  };

  const handleSelectDescription = (description: string) => {
    onGenerate(description);
    setShowGenerator(false);
    setGeneratedDescriptions([]);
  };

  const handleNewGeneration = () => {
    setGeneratedDescriptions([]);
    generateDescriptions();
  };

  if (showGenerator) {
    return (
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-purple-600" />
              <CardTitle className="text-sm text-purple-800">
                Suggestions générées par {selectedLLM === 'openai' ? 'OpenAI' : 'Claude'}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewGeneration}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Régénérer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {generatedDescriptions.length > 0 ? (
              generatedDescriptions.map((description, index) => (
                <div key={index} className="border rounded-lg p-3 bg-white">
                  <p className="text-sm text-gray-700 mb-3">{description}</p>
                  <Button
                    size="sm"
                    onClick={() => handleSelectDescription(description)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Utiliser cette description
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Génération en cours...</p>
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowGenerator(false);
                setGeneratedDescriptions([]);
              }}
            >
              Fermer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <LLMSelector
        selectedLLM={selectedLLM}
        onLLMChange={setSelectedLLM}
        onGenerate={generateDescriptions}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProjectDescriptionGenerator;
