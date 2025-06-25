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
      // Test OpenAI - DÉSACTIVÉ TEMPORAIREMENT
      // Pas de test OpenAI pour éviter l'erreur 500
      
      // Test Claude
      const { error: claudeError } = await supabase.functions.invoke('claude-analyzer', {
        body: { 
          analysisType: 'questionnaire_analysis', 
          text: 'test', 
          context: 'test'
        }
      });

      setLlmStatus({
        openai: false, // FORCÉ À FALSE - quota épuisé
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
      description: 'Temporairement indisponible (quota épuisé)',
      icon: <Zap className="h-4 w-4" />,
      available: false, // FORCÉ À FALSE
      color: 'red'
    },
    {
      id: 'claude' as LLMProvider,
      name: 'Anthropic Claude',
      description: 'Recommandé - Excellent pour l\'analyse SST détaillée',
      icon: <Brain className="h-4 w-4" />,
      available: llmStatus.claude,
      color: 'blue'
    }
  ];

  // Forcer Claude si OpenAI est sélectionné mais indisponible
  useEffect(() => {
    if (selectedLLM === 'openai' && llmStatus.claude && !llmStatus.openai) {
      onLLMChange('claude');
    }
  }, [llmStatus, selectedLLM, onLLMChange]);

  const hasAvailableLLM = llmStatus.claude; // Seulement Claude maintenant

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
            Clé Claude API requise. Ajoutez la clé dans les secrets Supabase :
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>OPENAI_API_KEY (quota épuisé temporairement)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>ANTHROPIC_API_KEY (pour Claude)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-blue-600" />
          <CardTitle className="text-sm text-blue-800">Générateur IA - Claude</CardTitle>
          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
            Prêt
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Modèle IA sélectionné :
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
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Génération en cours...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                🪄 Générer des idées avec Claude
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LLMSelector;