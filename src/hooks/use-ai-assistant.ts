
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface AIAssistantOptions {
  type: 'project_description' | 'project_improvement' | 'questionnaire_synthesis' | 'project_suggestions';
  prompt: string;
  context?: string;
}

export interface AIAnalysisOptions {
  analysisType: 'questionnaire_analysis' | 'response_patterns' | 'risk_assessment' | 'compliance_check';
  text: string;
  context?: string;
}

export const useAIAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateContent = async (options: AIAssistantOptions): Promise<string | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('openai-assistant', {
        body: options
      });

      if (error) throw error;
      
      return data.result;
    } catch (error) {
      console.error('AI Generation Error:', error);
      toast({
        title: "Erreur IA",
        description: "Impossible de générer le contenu. Veuillez réessayer.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeContent = async (options: AIAnalysisOptions): Promise<string | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('claude-analyzer', {
        body: options
      });

      if (error) throw error;
      
      return data.result;
    } catch (error) {
      console.error('AI Analysis Error:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser le contenu. Veuillez réessayer.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateContent,
    analyzeContent,
    isLoading
  };
};
