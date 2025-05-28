
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
  const [selectedLLM, setSelectedLLM] = useState<LLMProvider>('claude'); // Changer le défaut à Claude
  const { generateContent, analyzeContent, isLoading } = useAIAssistant();

  console.log('AIEnhancedNameInput rendered');

  const generateProjectIdeas = async () => {
    console.log('Génération d\'idées de projet démarrée');
    
    const criteriaText = Object.entries(criteria)
      .map(([key, value]) => `${key}: ${value}/10`)
      .join(', ');

    const context = scianSectorId ? `Secteur SCIAN: ${scianSectorId}` : '';
    const prompt = `Génère une description courte et précise d'un projet IA-SST innovant basé sur ces critères: ${criteriaText}. La description doit être concrète, réalisable et spécifique au domaine SST. Maximum 100 mots.`;
    
    let result = null;
    
    try {
      if (selectedLLM === 'openai') {
        console.log('Tentative avec OpenAI...');
        result = await generateContent({
          type: 'project_description',
          prompt,
          context
        });
        
        // Si OpenAI échoue, essayer Claude automatiquement
        if (!result) {
          console.log('OpenAI a échoué, basculement vers Claude...');
          result = await analyzeContent({
            analysisType: 'questionnaire_analysis',
            text: `Génère une description de projet IA-SST basée sur: ${prompt}`,
            context
          });
        }
      } else {
        console.log('Tentative avec Claude...');
        result = await analyzeContent({
          analysisType: 'questionnaire_analysis',
          text: `Génère une description de projet IA-SST basée sur: ${prompt}`,
          context
        });
      }
      
      if (result) {
        // Nettoyer le résultat pour enlever les préfixes inutiles
        const cleanResult = result
          .replace(/^(Voici une description|Description du projet|Projet IA-SST|Génération d'un projet)[\s:]*[:\-]*/i, '')
          .replace(/^["']|["']$/g, '')
          .trim();
        
        setName(cleanResult);
        console.log('Résultat généré:', cleanResult);
      } else {
        console.error('Aucun résultat généré par les deux LLM');
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
