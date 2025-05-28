
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

  console.log('AIEnhancedNameInput rendered'); // Debug log

  const generateProjectIdeas = async () => {
    console.log('Génération d\'idées de projet démarrée'); // Debug log
    
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
    
    try {
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
        console.log('Résultat généré:', result); // Debug log
      }
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
    }
  };

  return (
    <div className="mb-6 space-y-4">
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

      {/* Sélecteur LLM toujours visible */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">🤖 Assistant IA pour générer des idées</h4>
        <LLMSelector
          selectedLLM={selectedLLM}
          onLLMChange={setSelectedLLM}
          onGenerate={generateProjectIdeas}
          isLoading={isLoading}
        />
      </div>
      
      {/* Afficher l'amélioration de texte seulement si il y a du texte */}
      {name.trim() && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">✨ Améliorer le texte</h4>
          <AITextEnhancer
            originalText={name}
            onApply={setName}
            context={`Secteur: ${scianSectorId || 'Non spécifié'}`}
            placeholder="Description du projet IA-SST"
          />
        </div>
      )}
    </div>
  );
};

export default AIEnhancedNameInput;
