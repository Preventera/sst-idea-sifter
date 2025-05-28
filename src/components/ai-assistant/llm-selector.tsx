
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Brain, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export type LLMProvider = 'openai' | 'claude';

interface LLMSelectorProps {
  selectedLLM: LLMProvider;
  onLLMChange: (llm: LLMProvider) => void;
  onGenerate: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

interface LLMStatus {
  openai: boolean;
  claude: boolean;
}

const LLMSelector = ({ selectedLLM, onLLMChange, onGenerate, isLoading, disabled }: LLMSelectorProps) => {
  const [llmStatus, setLlmStatus] = useState<LLMStatus>({ openai: false, claude: false });
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkLLMAvailability();
  }, []);

  const checkLLMAvailability = async () => {
    setIsChecking(true);
    
    try {
      // Test OpenAI
      const { error: openaiError } = await supabase.functions.invoke('openai-assistant', {
        body: { 
          type: 'project_description', 
          prompt: 'test', 
          context: 'test'
        }
      });
      
      // Test Claude
      const { error: claudeError } = await supabase.functions.invoke('claude-analyzer', {
        body: { 
          analysisType: 'questionnaire_analysis', 
          text: 'test', 
          context: 'test'
        }
      });

      setLlmStatus({
        openai: !openaiError || !openaiError.message?.includes('API key'),
        claude: !claudeError || !claudeError.message?.includes('API key')
      });
    } catch (error) {
      console.log('Erreur lors de la vérification des LLM:', error);
      setLlmStatus({ openai: false, claude: false });
    } finally {
      setIsChecking(false);
    }
  };

  const llmOptions = [
    {
      id: 'openai' as LLMProvider,
      name: 'OpenAI GPT-4',
      description: 'Rapide et créatif pour les descriptions',
      icon: <Zap className="h-4 w-4" />,
      available: llmStatus.openai,
      color: 'green'
    },
    {
      id: 'claude' as LLMProvider,
      name: 'Anthropic Claude',
      description: 'Excellent pour l\'analyse détaillée',
      icon: <Brain className="h-4 w-4" />,
      available: llmStatus.claude,
      color: 'blue'
    }
  ];

  const hasAvailableLLM = llmStatus.openai || llmStatus.claude;

  if (isChecking) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-4 text-center">
          <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Vérification des LLM disponibles...</p>
        </CardContent>
      </Card>
    );
  }

  if (!hasAvailableLLM) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <CardTitle className="text-sm text-orange-800">Configuration requise</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-orange-700 mb-3">
            Aucune clé API configurée. Ajoutez au moins une clé dans les secrets Supabase :
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>OPENAI_API_KEY (pour GPT-4)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>ANTHROPIC_API_KEY (pour Claude)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-purple-600" />
          <CardTitle className="text-sm text-purple-800">Générateur IA</CardTitle>
          <Badge variant="outline" className="text-xs">
            {hasAvailableLLM ? 'Prêt' : 'Configuration requise'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Choisir le modèle IA :
            </Label>
            <RadioGroup 
              value={selectedLLM} 
              onValueChange={(value: LLMProvider) => onLLMChange(value)}
              className="space-y-2"
            >
              {llmOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option.id} 
                    id={option.id}
                    disabled={!option.available || disabled}
                  />
                  <Label 
                    htmlFor={option.id} 
                    className={`flex items-center gap-2 cursor-pointer flex-1 p-2 rounded-lg border ${
                      option.available 
                        ? 'border-gray-200 hover:bg-gray-50' 
                        : 'border-gray-100 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className={`text-${option.color}-600`}>
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{option.name}</span>
                        {option.available ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-red-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{option.description}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Button
            onClick={onGenerate}
            disabled={disabled || isLoading || !hasAvailableLLM}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Génération en cours...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                🪄 Générer des idées de projets
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LLMSelector;
