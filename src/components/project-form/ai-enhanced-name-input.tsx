
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import AITextEnhancer from '@/components/ai-assistant/ai-text-enhancer';
import LLMSelector, { LLMProvider } from '@/components/ai-assistant/llm-selector';
import { useAIAssistant } from '@/hooks/use-ai-assistant';
import { Criteria } from '@/types/project';

interface AIEnhancedNameInputProps {
  name: string;
  setName: (name: string) => void;
  criteria: Criteria;
  scianSectorId?: string;
}

const AIEnhancedNameInput = ({ name, setName, criteria, scianSectorId }: AIEnhancedNameInputProps) => {
  const [selectedLLM, setSelectedLLM] = useState<LLMProvider>('openai');
  const { generateContent, analyzeContent, isLoading } = useAIAssistant();

  const generateProjectIdeas = async () => {
    const criteriaText = Object.entries(criteria)
      .map(([key, value]) => `${key}: ${value}/10`)
      .join(', ');

    const context = scianSectorId ? `Secteur SCIAN: ${scianSectorId}` : '';

    const prompts = [
      `Génère une description de projet IA-SST innovant basée sur ces critères: ${criteriaText}`,
      `Propose un projet IA-SST axé sur la prévention avec ces scores: ${criteriaText}`,
      `Suggère un projet IA-SST pour améliorer la sécurité au travail: ${criteriaText}`
    ];

    // Prendre le premier prompt pour une génération simple
    const prompt = prompts[0];
    
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
    
    if (result) {
      setName(result);
    }
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Sélecteur LLM visible en haut */}
      <LLMSelector
        selectedLLM={selectedLLM}
        onLLMChange={setSelectedLLM}
        onGenerate={generateProjectIdeas}
        isLoading={isLoading}
      />

      <div>
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
      
      {/* Afficher l'amélioration de texte seulement si il y a du texte */}
      {name.trim() && (
        <AITextEnhancer
          originalText={name}
          onApply={setName}
          context={`Secteur: ${scianSectorId || 'Non spécifié'}`}
          placeholder="Description du projet IA-SST"
        />
      )}
    </div>
  );
};

export default AIEnhancedNameInput;
