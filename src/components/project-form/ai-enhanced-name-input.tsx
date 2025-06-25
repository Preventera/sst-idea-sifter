// src/components/project-form/ai-enhanced-name-input.tsx
// Version intégrée avec service d'intégration IA et données CNESST

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AITextEnhancer from '@/components/ai-assistant/ai-text-enhancer';
import LLMSelector, { LLMProvider } from '@/components/ai-assistant/llm-selector';
import { useAIAssistant } from '@/hooks/use-ai-assistant';
import { Criteria } from '@/types/project';
import { Loader2, Sparkles, Lightbulb, Database, TrendingUp, AlertTriangle } from 'lucide-react';
import { aiIntegrationService } from '@/services/ai/ai-integration-service';
import { cnesstAPIService } from '@/services/api/cnesst-api-service';

interface AIEnhancedNameInputProps {
  name: string;
  setName: (name: string) => void;
  criteria: Criteria;
  scianSectorId?: string;
}

interface SectorInsights {
  riskLevel: 'low' | 'medium' | 'high';
  topRisks: string[];
  totalCases: number;
  trendAnalysis: string;
}

const AIEnhancedNameInput = ({ name, setName, criteria, scianSectorId }: AIEnhancedNameInputProps) => {
  const [selectedLLM, setSelectedLLM] = useState<LLMProvider>('openai');
  const [sectorInsights, setSectorInsights] = useState<SectorInsights | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const { generateContent, analyzeContent, isLoading } = useAIAssistant();

  // Chargement des insights sectoriels CNESST
  useEffect(() => {
    if (scianSectorId) {
      loadSectorInsights();
    }
  }, [scianSectorId]);

  const loadSectorInsights = async () => {
    if (!scianSectorId) return;
    
    setLoadingInsights(true);
    try {
      // Récupération des statistiques sectorielles depuis l'API CNESST
      const stats = await cnesstAPIService.getSectorStatistics(scianSectorId);
      
      // Analyse des risques pour déterminer le niveau
      const totalCases = stats.totalCases || 0;
      const riskLevel = totalCases > 5000 ? 'high' : totalCases > 2000 ? 'medium' : 'low';
      
      setSectorInsights({
        riskLevel,
        topRisks: stats.topRisks?.slice(0, 3) || [],
        totalCases,
        trendAnalysis: stats.yearlyTrend || 'Données insuffisantes'
      });
    } catch (error) {
      console.error('Erreur lors du chargement des insights:', error);
      // Fallback avec données par défaut
      setSectorInsights({
        riskLevel: 'medium',
        topRisks: ['Risques génériques'],
        totalCases: 0,
        trendAnalysis: 'Analyse non disponible'
      });
    } finally {
      setLoadingInsights(false);
    }
  };

  const generateProjectIdeas = async () => {
    console.log('🚀 Génération d\'idées avec intégration CNESST démarrée');
    
    try {
      // Préparation du contexte enrichi
      const enrichedContext = await aiIntegrationService.buildEnrichedContext({
        sector: scianSectorId || '',
        criteria,
        projectName: name,
        organizationSize: 'medium', // À récupérer du ProfileScian
        methodology: ['ISO 45001'], // À récupérer du ProfileScian
        currentInput: name
      });

      // Génération des prompts enrichis
      const enhancedPrompts = await aiIntegrationService.generateEnhancedPrompts(
        enrichedContext,
        'project_ideation'
      );

      // Appel à l'IA avec le prompt enrichi
      const response = await generateContent(enhancedPrompts.mainPrompt, selectedLLM);
      
      console.log('✅ Réponse générée avec succès:', response);
      
      // Analyse de la qualité de la réponse
      const qualityMetrics = await aiIntegrationService.evaluatePromptQuality(
        enhancedPrompts.mainPrompt,
        response || ''
      );
      
      console.log('📊 Métriques de qualité:', qualityMetrics);
      
      return response;
      
    } catch (error) {
      console.error('❌ Erreur lors de la génération:', error);
      throw error;
    }
  };

  const getContextSummary = () => {
    const elements = [];
    
    if (scianSectorId) {
      elements.push(`Secteur SCIAN: ${scianSectorId}`);
    }
    
    if (sectorInsights) {
      elements.push(`${sectorInsights.totalCases} cas historiques`);
      elements.push(`Niveau de risque: ${sectorInsights.riskLevel}`);
    }
    
    const criteriaCount = Object.values(criteria).filter(v => v > 0).length;
    if (criteriaCount > 0) {
      elements.push(`${criteriaCount} critères définis`);
    }
    
    return elements.length > 0 ? elements.join(' • ') : 'Contexte de base uniquement';
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="h-3 w-3" />;
      case 'medium': return <TrendingUp className="h-3 w-3" />;
      case 'low': return <Sparkles className="h-3 w-3" />;
      default: return <Database className="h-3 w-3" />;
    }
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Input principal */}
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

      {/* Insights sectoriels CNESST */}
      {scianSectorId && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Database className="h-4 w-4 text-blue-600" />
              <h4 className="text-sm font-medium text-blue-900">
                Insights CNESST - Secteur {scianSectorId}
              </h4>
              {loadingInsights && <Loader2 className="h-3 w-3 animate-spin" />}
            </div>
            
            {sectorInsights && !loadingInsights && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getRiskLevelColor(sectorInsights.riskLevel)}`}
                  >
                    {getRiskIcon(sectorInsights.riskLevel)}
                    <span className="ml-1">
                      Risque {sectorInsights.riskLevel === 'high' ? 'élevé' : 
                              sectorInsights.riskLevel === 'medium' ? 'moyen' : 'faible'}
                    </span>
                  </Badge>
                  <span className="text-xs text-blue-700">
                    {sectorInsights.totalCases.toLocaleString()} cas analysés
                  </span>
                </div>
                
                {sectorInsights.topRisks.length > 0 && (
                  <div className="text-xs text-blue-800">
                    <span className="font-medium">Risques principaux:</span>{' '}
                    {sectorInsights.topRisks.join(', ')}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Assistant IA avec contexte enrichi */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          Assistant IA pour générer des idées
        </h4>
        
        {/* Affichage du contexte disponible */}
        <div className="text-xs text-gray-600 mb-3 p-3 bg-gray-50 rounded-md border">
          <div className="flex items-center gap-1 mb-1">
            <Sparkles className="h-3 w-3" />
            <span className="font-medium">Contexte enrichi:</span>
          </div>
          <div>{getContextSummary()}</div>
        </div>
        
        <LLMSelector
          selectedLLM={selectedLLM}
          onLLMChange={setSelectedLLM}
          onGenerate={generateProjectIdeas}
          isLoading={isLoading}
        />
      </div>

      {/* Amélioration de texte */}
      {name.trim() && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Améliorer le texte
          </h4>
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