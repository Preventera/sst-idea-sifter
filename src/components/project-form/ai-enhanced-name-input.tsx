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
  const [selectedLLM, setSelectedLLM] = useState<LLMProvider>('claude');
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
          analysisType: 'project_ideas',
          text: `Tu es un expert HSE spécialisé dans l'application de l'intelligence artificielle pour la prévention des accidents et l'amélioration de la performance sécurité. Génère une étude de cas d'usage d'IA basée sur ces critères: ${criteriaText}.

Étape 1 : Identification du problème
- Dans le secteur ${context || "concerné"}, le principal risque lié à ces critères concerne: [description spécifique].
- Ce problème entraîne [impact en termes de sécurité, coûts, opérations].

Étape 2 : Applicabilité de l'IA
- Explique comment des techniques IA peuvent résoudre ce problème.
- Met en évidence la valeur ajoutée de l'IA pour la prévention proactive.

Étape 3 : Conception de la solution
- Propose une architecture IA adaptée aux critères fournis.
- Détaille les modules clés: alertes en temps réel, tableaux de bord HSE, etc.

Étape 4 : Données nécessaires
- Liste les sources de données pertinentes pour ce cas d'usage.
- Décris le processus de préparation des données.

Étape 5 : Développement du modèle
- Sélectionne un algorithme adapté à ce cas d'usage.
- Décris les métriques de performance et méthodes de test.

Étape 6 : Intégration dans le système HSE
- Explique comment intégrer cette solution à l'environnement existant.
- Décris la formation nécessaire pour les utilisateurs.

Étape 7 : Évaluation continue
- Définis des métriques de succès pertinentes pour ce projet.
- Propose une stratégie d'amélioration continue.

Étape 8 : Catégorie ELON
- Indique la catégorie prioritaire: [Équipement / Lieux / Opérations / Nature Humaine].
- Explique pourquoi cette catégorie est critique pour ce projet.`,
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

export { AIEnhancedNameInput };