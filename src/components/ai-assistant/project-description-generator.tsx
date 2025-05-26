
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Wand2, Check } from 'lucide-react';
import { useAIAssistant } from '@/hooks/use-ai-assistant';
import { Criteria } from '@/types/project';

interface ProjectDescriptionGeneratorProps {
  criteria: Criteria;
  scianSectorId?: string;
  onGenerate: (description: string) => void;
}

const ProjectDescriptionGenerator = ({ criteria, scianSectorId, onGenerate }: ProjectDescriptionGeneratorProps) => {
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatedDescriptions, setGeneratedDescriptions] = useState<string[]>([]);
  const { generateContent, isLoading } = useAIAssistant();

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
      const result = await generateContent({
        type: 'project_description',
        prompt,
        context
      });
      if (result) descriptions.push(result);
    }

    setGeneratedDescriptions(descriptions);
    setShowGenerator(true);
  };

  const handleSelectDescription = (description: string) => {
    onGenerate(description);
    setShowGenerator(false);
  };

  if (showGenerator) {
    return (
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-purple-600" />
            <CardTitle className="text-sm text-purple-800">Suggestions de projets IA</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {generatedDescriptions.map((description, index) => (
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
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGenerator(false)}
            >
              Fermer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <Button
        variant="outline"
        size="sm"
        onClick={generateDescriptions}
        disabled={isLoading}
        className="text-purple-600 border-purple-200 hover:bg-purple-50"
      >
        <Sparkles className="h-4 w-4 mr-1" />
        {isLoading ? 'Génération...' : '🪄 Générer des idées'}
      </Button>
      <Badge variant="outline" className="text-xs text-purple-600">
        IA Générative
      </Badge>
    </div>
  );
};

export default ProjectDescriptionGenerator;
