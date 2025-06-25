// src/services/ai/ai-integration-service.ts
// Service d'intégration IA corrigé pour IGNITIA

import { cnesstAPIService } from '../api/cnesst-api-service';
import { Criteria } from '@/types/project';

/**
 * Interface pour le contexte de projet enrichi
 */
interface ProjectContext {
  sector: string;
  criteria: Criteria;
  projectName: string;
  organizationSize: 'small' | 'medium' | 'large';
  methodology: string[];
  currentInput: string;
}

/**
 * Interface pour les prompts enrichis
 */
interface EnhancedPrompts {
  mainPrompt: string;
  fallbackPrompt: string;
  contextData: any;
  metadata: {
    sector: string;
    riskLevel: string;
    dataSource: string;
    timestamp: string;
  };
}

/**
 * Interface pour les métriques de qualité
 */
interface QualityMetrics {
  relevanceScore: number;
  contextIntegration: number;
  structureScore: number;
  suggestions: string[];
}

/**
 * Service d'intégration IA pour IGNITIA
 * Connecte l'assistant IA existant au système enrichi avec données CNESST
 */
class AIIntegrationService {
  private cache = new Map<string, any>();
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutes

  /**
   * Construit un contexte enrichi à partir des données disponibles
   */
  async buildEnrichedContext(projectContext: ProjectContext): Promise<any> {
    const cacheKey = `context_${projectContext.sector}_${Date.now()}`;
    
    try {
      // Récupération des données sectorielles CNESST
      let sectorData = null;
      if (projectContext.sector) {
        try {
          sectorData = await cnesstAPIService.getSectorStatistics(projectContext.sector);
        } catch (error) {
          console.warn('Données CNESST non disponibles, utilisation du fallback:', error);
          sectorData = this.getFallbackSectorData(projectContext.sector);
        }
      }

      // Analyse des critères du projet
      const criteriaAnalysis = this.analyzeCriteria(projectContext.criteria);

      // Construction du contexte enrichi
      const enrichedContext = {
        project: {
          name: projectContext.projectName,
          input: projectContext.currentInput,
          criteria: criteriaAnalysis
        },
        organization: {
          size: projectContext.organizationSize,
          methodology: projectContext.methodology,
          sector: projectContext.sector
        },
        sectorInsights: sectorData ? {
          totalCases: sectorData.totalCases || 0,
          riskLevel: this.calculateRiskLevel(sectorData.totalCases || 0),
          topRisks: sectorData.topRisks || [],
          trends: sectorData.yearlyTrend || 'Données insuffisantes',
          recommendations: this.generateSectorRecommendations(sectorData)
        } : null,
        metadata: {
          timestamp: new Date().toISOString(),
          dataSource: sectorData ? 'CNESST_API' : 'FALLBACK',
          version: '1.0'
        }
      };

      // Mise en cache
      this.cache.set(cacheKey, {
        data: enrichedContext,
        timestamp: Date.now()
      });

      return enrichedContext;

    } catch (error) {
      console.error('Erreur lors de la construction du contexte enrichi:', error);
      return this.getFallbackContext(projectContext);
    }
  }

  /**
   * Génère des prompts enrichis basés sur le contexte
   */
  async generateEnhancedPrompts(
    enrichedContext: any, 
    promptType: 'project_ideation' | 'criteria_evaluation' | 'text_enhancement'
  ): Promise<EnhancedPrompts> {
    
    const basePrompts = this.getBasePrompts(promptType);
    
    // Construction du prompt principal enrichi
    const contextualElements = this.buildContextualElements(enrichedContext);
    
    const mainPrompt = `${basePrompts.introduction}

${contextualElements.sectorContext}

${contextualElements.organizationContext}

${contextualElements.criteriaContext}

${contextualElements.risksContext}

${basePrompts.instructions}

${contextualElements.expectedOutput}`;

    // Prompt de fallback simplifié
    const fallbackPrompt = `${basePrompts.introduction}

Contexte: ${enrichedContext.project?.name || 'Projet IA-SST'}
Secteur: ${enrichedContext.organization?.sector || 'Non spécifié'}

${basePrompts.instructions}`;

    return {
      mainPrompt,
      fallbackPrompt,
      contextData: enrichedContext,
      metadata: {
        sector: enrichedContext.organization?.sector || '',
        riskLevel: enrichedContext.sectorInsights?.riskLevel || 'unknown',
        dataSource: enrichedContext.metadata?.dataSource || 'FALLBACK',
        timestamp: enrichedContext.metadata?.timestamp || new Date().toISOString()
      }
    };
  }

  /**
   * Évalue la qualité d'un prompt et de sa réponse
   */
  async evaluatePromptQuality(prompt: string, response: string): Promise<QualityMetrics> {
    const metrics = {
      relevanceScore: this.calculateRelevanceScore(prompt, response),
      contextIntegration: this.evaluateContextIntegration(prompt, response),
      structureScore: this.evaluateStructure(response),
      suggestions: this.generateImprovementSuggestions(prompt, response)
    };

    return metrics;
  }

  /**
   * Méthodes privées utilitaires
   */
  private analyzeCriteria(criteria: Criteria): any {
    const scores = Object.values(criteria);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    return {
      average: Math.round(average * 10) / 10,
      highest: Math.max(...scores),
      lowest: Math.min(...scores),
      distribution: criteria,
      focus: this.identifyFocusAreas(criteria)
    };
  }

  private calculateRiskLevel(totalCases: number): string {
    if (totalCases > 5000) return 'high';
    if (totalCases > 2000) return 'medium';
    return 'low';
  }

  private generateSectorRecommendations(sectorData: any): string[] {
    const recommendations = [];
    
    if (sectorData.topRisks && sectorData.topRisks.length > 0) {
      recommendations.push(`Prioriser la prévention: ${sectorData.topRisks[0]}`);
    }
    
    if (sectorData.totalCases > 3000) {
      recommendations.push('Secteur à haut risque - Solutions IA prioritaires');
    }
    
    recommendations.push('Intégrer les normes ISO 45001 dans la solution');
    
    return recommendations;
  }

  private getFallbackSectorData(sector: string): any {
    return {
      totalCases: 1000,
      topRisks: ['Risques mécaniques', 'Chutes et glissades', 'Stress ergonomique'],
      yearlyTrend: 'Stable',
      riskLevel: 'medium'
    };
  }

  private getFallbackContext(projectContext: ProjectContext): any {
    return {
      project: {
        name: projectContext.projectName,
        input: projectContext.currentInput,
        criteria: this.analyzeCriteria(projectContext.criteria)
      },
      organization: {
        size: projectContext.organizationSize,
        methodology: projectContext.methodology,
        sector: projectContext.sector
      },
      sectorInsights: null,
      metadata: {
        timestamp: new Date().toISOString(),
        dataSource: 'FALLBACK',
        version: '1.0'
      }
    };
  }

  private getBasePrompts(type: string): any {
    const prompts = {
      project_ideation: {
        introduction: "En tant qu'expert en IA et SST, générez des idées de projets innovants.",
        instructions: "Proposez 5 idées concrètes avec justifications techniques et impact SST.",
      },
      criteria_evaluation: {
        introduction: "Évaluez ce projet selon les critères SST et IA.",
        instructions: "Fournissez des scores justifiés pour chaque critère.",
      },
      text_enhancement: {
        introduction: "Améliorez cette description de projet IA-SST.",
        instructions: "Rendez le texte plus précis et professionnel.",
      }
    };

    return prompts[type] || prompts.project_ideation;
  }

  private buildContextualElements(context: any): any {
    return {
      sectorContext: context.sectorInsights ? 
        `CONTEXTE SECTORIEL (${context.organization.sector}):
- ${context.sectorInsights.totalCases} cas analysés
- Niveau de risque: ${context.sectorInsights.riskLevel}
- Risques principaux: ${context.sectorInsights.topRisks.join(', ')}` 
        : `SECTEUR: ${context.organization?.sector || 'Non spécifié'}`,

      organizationContext: `ORGANISATION:
- Taille: ${context.organization?.size || 'Non spécifiée'}
- Méthodologies: ${context.organization?.methodology?.join(', ') || 'Aucune'}`,

      criteriaContext: context.project?.criteria ? 
        `CRITÈRES PROJET (moyenne: ${context.project.criteria.average}/10):
- Focus principal: ${context.project.criteria.focus.join(', ')}` 
        : '',

      risksContext: context.sectorInsights?.recommendations ? 
        `RECOMMANDATIONS:
${context.sectorInsights.recommendations.map((r: string) => `- ${r}`).join('\n')}` 
        : '',

      expectedOutput: `FORMAT ATTENDU:
1. Titre du projet
2. Description technique
3. Impact SST attendu
4. Technologies recommandées
5. Critères de succès`
    };
  }

  private identifyFocusAreas(criteria: Criteria): string[] {
    const areas = [];
    const threshold = 7;

    Object.entries(criteria).forEach(([key, value]) => {
      if (value >= threshold) {
        areas.push(key);
      }
    });

    return areas.length > 0 ? areas : ['balanced_approach'];
  }

  private calculateRelevanceScore(prompt: string, response: string): number {
    // Calcul simplifié de pertinence
    const keywords = ['IA', 'SST', 'sécurité', 'prévention', 'risque'];
    let score = 0;
    
    keywords.forEach(keyword => {
      if (response.toLowerCase().includes(keyword.toLowerCase())) {
        score += 20;
      }
    });

    return Math.min(score, 100);
  }

  private evaluateContextIntegration(prompt: string, response: string): number {
    // Évaluation de l'intégration du contexte
    return Math.floor(Math.random() * 40) + 60; // Simulation pour le moment
  }

  private evaluateStructure(response: string): number {
    // Évaluation de la structure de la réponse
    const hasNumberedList = /\d+\./.test(response);
    const hasSubsections = response.split('\n').length > 5;
    
    let score = 50;
    if (hasNumberedList) score += 25;
    if (hasSubsections) score += 25;
    
    return score;
  }

  private generateImprovementSuggestions(prompt: string, response: string): string[] {
    const suggestions = [];
    
    if (response.length < 200) {
      suggestions.push('Réponse trop courte - ajouter plus de détails');
    }
    
    if (!response.includes('IA')) {
      suggestions.push('Intégrer davantage d\'aspects IA');
    }
    
    if (!response.includes('SST')) {
      suggestions.push('Renforcer les aspects SST');
    }
    
    return suggestions;
  }
}

// Export du service comme instance singleton
export const aiIntegrationService = new AIIntegrationService();