import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// ===============================================
// 🔒 INTERFACES EXISTANTES (CONSERVÉES 100%)
// ===============================================
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

// ===============================================
// 🆕 NOUVELLES INTERFACES POUR MATURITÉ IA
// ===============================================
export interface MaturityLevel {
  level: 1 | 2 | 3 | 4 | 5;
  name: 'Exploration' | 'Expérimentation' | 'Pilotage' | 'Déploiement' | 'Transformation';
  description: string;
}

export interface ObstacleContext {
  obstacle: 'donnees' | 'culture' | 'gouvernance' | 'technologie' | 'competences' | 'ethique';
  severity: 'faible' | 'moyen' | 'eleve';
  sector: string;
  specificContext?: string;
}

export interface EnhancedAIOptions {
  type: 'maturity_assessment' | 'obstacle_analysis' | 'contextual_recommendations' | 'workflow_guidance';
  prompt: string;
  maturityLevel?: MaturityLevel;
  obstacles?: ObstacleContext[];
  sector?: string;
  context?: string;
}

export interface WorkflowStepOptions {
  step: 'diagnostic' | 'cas_usage' | 'priorisation' | 'prototypage' | 'validation';
  currentData: any;
  maturityLevel: MaturityLevel;
  targetOutcome: string;
}

// ===============================================
// 🔒 HOOK EXISTANT (CONSERVÉ 100%)
// ===============================================
export const useAIAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 🔒 FONCTION EXISTANTE - CONSERVÉE
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

  // 🔒 FONCTION EXISTANTE - CONSERVÉE
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

  // ===============================================
  // 🆕 NOUVELLES FONCTIONS ENRICHIES
  // ===============================================

  // 🧠 Génération contextuelle avec maturité IA
  const generateContextualContent = async (options: EnhancedAIOptions): Promise<string | null> => {
    setIsLoading(true);
    try {
      // Enrichissement du contexte selon la maturité
      const enrichedContext = enrichContextWithMaturity(options);
      
      const { data, error } = await supabase.functions.invoke('ignitia-contextual-ai', {
        body: enrichedContext
      });

      if (error) throw error;
      
      return data.result;
    } catch (error) {
      console.error('Contextual AI Generation Error:', error);
      toast({
        title: "Erreur IA Contextuelle",
        description: "Impossible de générer le contenu contextualisé. Veuillez réessayer.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // 🎯 Guidance workflow Sand Box Studio
  const generateWorkflowGuidance = async (options: WorkflowStepOptions): Promise<string | null> => {
    setIsLoading(true);
    try {
      const workflowContext = prepareWorkflowContext(options);
      
      const { data, error } = await supabase.functions.invoke('ignitia-workflow-guide', {
        body: workflowContext
      });

      if (error) throw error;
      
      return data.result;
    } catch (error) {
      console.error('Workflow Guidance Error:', error);
      toast({
        title: "Erreur Guide Workflow",
        description: "Impossible de générer la guidance workflow. Veuillez réessayer.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // 📊 Analyse d'obstacles avec prompts spécialisés
  const analyzeObstacles = async (obstacles: ObstacleContext[], sector: string): Promise<string | null> => {
    setIsLoading(true);
    try {
      const obstacleContext = {
        obstacles,
        sector,
        analysisType: 'obstacle_deep_analysis',
        includePrompts: true
      };
      
      const { data, error } = await supabase.functions.invoke('ignitia-obstacle-analyzer', {
        body: obstacleContext
      });

      if (error) throw error;
      
      return data.result;
    } catch (error) {
      console.error('Obstacle Analysis Error:', error);
      toast({
        title: "Erreur Analyse Obstacles",
        description: "Impossible d'analyser les obstacles. Veuillez réessayer.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ===============================================
  // 🔧 FONCTIONS UTILITAIRES PRIVÉES
  // ===============================================

  // Enrichissement du contexte avec données de maturité
  const enrichContextWithMaturity = (options: EnhancedAIOptions) => {
    const basePrompt = options.prompt;
    const maturityContext = options.maturityLevel ? 
      `Niveau de maturité IA: ${options.maturityLevel.name} (${options.maturityLevel.level}/5)` : '';
    
    const obstacleContext = options.obstacles ? 
      `Obstacles identifiés: ${options.obstacles.map(o => `${o.obstacle} (${o.severity})`).join(', ')}` : '';
    
    const sectorContext = options.sector ? `Secteur: ${options.sector}` : '';

    return {
      ...options,
      prompt: basePrompt,
      enrichedContext: {
        maturity: maturityContext,
        obstacles: obstacleContext,
        sector: sectorContext,
        originalContext: options.context || ''
      }
    };
  };

  // Préparation du contexte workflow
  const prepareWorkflowContext = (options: WorkflowStepOptions) => {
    return {
      step: options.step,
      currentData: options.currentData,
      maturityLevel: options.maturityLevel,
      targetOutcome: options.targetOutcome,
      workflowMetadata: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };
  };

  // ===============================================
  // 🎯 RETOUR DU HOOK - ÉTENDU
  // ===============================================
  return {
    // 🔒 Fonctions existantes (compatibilité 100%)
    generateContent,
    analyzeContent,
    isLoading,
    
    // 🆕 Nouvelles fonctions enrichies
    generateContextualContent,
    generateWorkflowGuidance,
    analyzeObstacles
  };
};