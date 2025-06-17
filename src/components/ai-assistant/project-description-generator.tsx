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
  const [selectedLLM, setSelectedLLM] = useState<LLMProvider>('claude');
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
        // Modification du type d'analyse et du prompt
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
                  {/* Ajout de la classe whitespace-pre-wrap pour préserver la mise en forme */}
                  <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">{description}</p>
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