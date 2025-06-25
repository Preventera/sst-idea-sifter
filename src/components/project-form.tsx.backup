// src/components/project-form.tsx
// Version hybride finale avec Auto-scoring + Algorithme ELON

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Lightbulb, Save, X, Wand2, Bot, Target, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAIAssistant } from '@/hooks/use-ai-assistant';
import { 
  generateAdvancedPrompt, 
  predictScoresFromPrompt, 
  ELON_RISK_MAPPING, 
  AdvancedPromptConfig,
  ElonCategory 
} from '@/utils/ai-advanced-prompt-generator';

interface Criteria {
  technicalFeasibility: number;
  businessValue: number;
  riskReduction: number;
  implementationCost: number;
  timeToMarket: number;
  stakeholderSupport: number;
  regulatoryCompliance: number;
}

interface Project {
  id?: string;
  name: string;
  description: string;
  sector: string;
  criteria: Criteria;
  score: number;
  priority: 'Haute' | 'Moyenne' | 'Faible';
  createdAt?: string;
}

interface ProjectFormProps {
  onAddProject: (project: Project) => void;
  editingProject: Project | null;
  onUpdateProject: (project: Project) => void;
  onCancelEdit: () => void;
}

const criteriaLabels = {
  technicalFeasibility: 'Faisabilité technique',
  businessValue: 'Valeur d\'affaires',
  riskReduction: 'Réduction des risques',
  implementationCost: 'Coût d\'implémentation',
  timeToMarket: 'Temps de mise en marché',
  stakeholderSupport: 'Support des parties prenantes',
  regulatoryCompliance: 'Conformité réglementaire'
};

const sectors = [
  'Agriculture, foresterie, pêche et chasse',
  'Extraction minière, exploitation en carrière, et extraction de pétrole et de gaz',
  'Services publics',
  'Construction',
  'Fabrication',
  'Commerce de gros',
  'Commerce de détail',
  'Transport et entreposage',
  'Industrie de l\'information et industrie culturelle',
  'Finance et assurances',
  'Services immobiliers et services de location et de location à bail',
  'Services professionnels, scientifiques et techniques',
  'Gestion de sociétés et d\'entreprises',
  'Services administratifs, services de soutien, services de gestion des déchets et services d\'assainissement',
  'Services d\'enseignement',
  'Soins de santé et assistance sociale',
  'Arts, spectacles et loisirs',
  'Services d\'hébergement et de restauration',
  'Autres services (sauf les administrations publiques)',
  'Administrations publiques'
];

export const ProjectForm: React.FC<ProjectFormProps> = ({
  onAddProject,
  editingProject,
  onUpdateProject,
  onCancelEdit,
}) => {
  const { toast } = useToast();
  const { analyzeContent } = useAIAssistant();
  
  const [formData, setFormData] = useState<Project>({
    name: '',
    description: '',
    sector: '',
    criteria: {
      technicalFeasibility: 5,
      businessValue: 5,
      riskReduction: 5,
      implementationCost: 5,
      timeToMarket: 5,
      stakeholderSupport: 5,
      regulatoryCompliance: 5
    },
    score: 0,
    priority: 'Moyenne'
  });

  const [generatedDescriptions, setGeneratedDescriptions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // 🆕 États pour l'auto-scoring
  const [autoScoringEnabled, setAutoScoringEnabled] = useState(false);
  const [suggestedScores, setSuggestedScores] = useState<Criteria | null>(null);
  const [isAutoScoring, setIsAutoScoring] = useState(false);
  const [scoringConfidence, setScoringConfidence] = useState(0);

  // 🆕 États pour l'algorithme ELON avancé
  const [motCle, setMotCle] = useState('');
  const [focusElon, setFocusElon] = useState<keyof ElonCategory | ''>('');
  const [typeIA, setTypeIA] = useState<'detection' | 'prediction' | 'optimisation' | 'automatisation' | ''>('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  useEffect(() => {
    if (editingProject) {
      setFormData(editingProject);
    }
  }, [editingProject]);

  useEffect(() => {
    const score = calculateScore(formData.criteria);
    const priority = calculatePriority(score);
    setFormData(prev => ({ ...prev, score, priority }));
  }, [formData.criteria]);

  const calculateScore = (criteria: Criteria): number => {
    const weights = {
      technicalFeasibility: 0.2,
      businessValue: 0.25,
      riskReduction: 0.2,
      implementationCost: 0.1,
      timeToMarket: 0.1,
      stakeholderSupport: 0.1,
      regulatoryCompliance: 0.05
    };

    let totalScore = 0;
    Object.entries(criteria).forEach(([key, value]) => {
      const weight = weights[key as keyof typeof weights];
      const adjustedValue = key === 'implementationCost' ? 11 - value : value;
      totalScore += adjustedValue * weight;
    });

    return Math.round(totalScore * 10) / 10;
  };

  const calculatePriority = (score: number): 'Haute' | 'Moyenne' | 'Faible' => {
    if (score >= 8) return 'Haute';
    if (score >= 6) return 'Moyenne';
    return 'Faible';
  };

  const handleCriteriaChange = (key: keyof Criteria, value: number[]) => {
    setFormData(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [key]: value[0]
      }
    }));
  };

  // 🆕 Fonction d'auto-évaluation CORRIGÉE (VERSION COMPATIBLE)
const handleAutoScoring = async () => {
  if (!formData.name.trim() && !formData.description.trim()) {
    toast({
      title: "Contenu requis",
      description: "Veuillez d'abord saisir le nom ou la description du projet",
      variant: "destructive"
    });
    return;
  }

  setIsAutoScoring(true);
  try {
    console.log('🔍 Début auto-évaluation:', { name: formData.name, description: formData.description });
    
    // Utiliser l'analyse par mots-clés du fichier ai-auto-scoring.ts
    const result = await performAutoScoring(
      formData.name,
      formData.description,
      formData.sector,
      false // Utiliser l'analyse par mots-clés uniquement
    );
    
    console.log('✅ Résultat auto-évaluation:', result);
    
    // MAPPING CORRECT: ProjectCriteria → Criteria
    const mappedResult: AutoScoringResult = {
      ...result,
      criteria: {
        technicalFeasibility: result.criteria.faisabilite,
        businessValue: Math.round((result.criteria.impact + result.criteria.excellence) / 2),
        riskReduction: result.criteria.impact,
        implementationCost: 11 - result.criteria.faisabilite, // Inversé (coût vs facilité)
        timeToMarket: result.criteria.faisabilite,
        stakeholderSupport: result.criteria.acceptabilite,
        regulatoryCompliance: result.criteria.gouvernance
      } as any
    };
    
    setAutoScoringResult(mappedResult);
    console.log('🎯 Scores mappés:', mappedResult.criteria);
    
    toast({
      title: "Auto-évaluation terminée",
      description: `Analyse terminée avec succès. Confiance: ${result.confidence}/10`
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'auto-évaluation:', error);
    toast({
      title: "Erreur d'auto-évaluation", 
      description: `Erreur: ${error.message || 'Impossible d\'analyser le projet'}`,
      variant: "destructive"
    });
  } finally {
    setIsAutoScoring(false);
  }
};// Appliquer les scores suggérés
  const applySuggestedScores = () => {
    if (!autoScoringResult) return;
    
    setFormData(prev => ({
      ...prev,
      criteria: autoScoringResult.criteria as Criteria
    }));
    
    toast({
      title: "Scores appliqués",
      description: "Les scores suggérés par l'IA ont été appliqués."
    });
    setAutoScoringResult(null);
  };

  // Ignorer les suggestions
  const ignoreAutoScoring = () => {
    setAutoScoringResult(null);
    toast({
      title: "Suggestions ignorées",
      description: "Les suggestions ont été ignorées."
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1>IGNITIA - Auto-évaluation fonctionnelle</h1>
    </div>
  );
};