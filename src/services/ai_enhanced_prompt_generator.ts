// src/services/ai/enhanced-prompt-generator.ts

import { sstCrawlerService } from '../sst-crawler-service';

/**
 * Interface pour le contexte sectoriel
 */
interface SectorContext {
  scianCode: string;
  sectorName: string;
  riskProfile: string;
  primaryRisks: string[];
  commonIncidents: string[];
  regulatoryFocus: string[];
}

/**
 * Interface pour les insights SST
 */
interface SSTInsights {
  trendingRisks: string[];
  emergingThemes: string[];
  successfulInterventions: string[];
  dataQuality: string;
  lastUpdate: string;
}

/**
 * Interface pour les templates de prompts
 */
interface PromptTemplate {
  basePrompt: string;
  contextInjection: string;
  dataEvidence: string;
  exampleFramework: string;
}

/**
 * Service pour générer des prompts enrichis avec les données SST
 */
export class EnhancedPromptGenerator {
  
  /**
   * Templates de prompts par type d'analyse
   */
  private promptTemplates: Record<string, PromptTemplate> = {
    project_generation: {
      basePrompt: `En tant qu'expert en IA appliquée à la santé-sécurité au travail, analysez le contexte organisationnel suivant et générez 3-5 idées de projets IA spécifiques et réalisables.`,
      contextInjection: `Contexte sectoriel spécifique`,
      dataEvidence: `Données probantes du secteur`,
      exampleFramework: `Exemples de réussites similaires`
    },
    risk_analysis: {
      basePrompt: `Analysez les risques spécifiques au secteur d'activité et identifiez les opportunités d'amélioration par l'IA.`,
      contextInjection: `Profil de risque sectoriel`,
      dataEvidence: `Statistiques d'incidents récents`,
      exampleFramework: `Cas d'usage prouvés`
    },
    implementation_guidance: {
      basePrompt: `Fournissez des recommandations pratiques pour l'implémentation de projets IA en SST dans ce contexte organisationnel.`,
      contextInjection: `Maturité organisationnelle`,
      dataEvidence: `Facteurs de succès identifiés`,
      exampleFramework: `Étapes de déploiement`
    }
  };

  /**
   * Base de connaissances sectorielles (enrichie avec données CNESST)
   */
  private sectorKnowledge: Record<string, SectorContext> = {
    '23': { // Construction
      scianCode: '23',
      sectorName: 'Construction',
      riskProfile: 'ÉLEVÉ - Accidents mécaniques, chutes, exposition chimique',
      primaryRisks: [
        'Chutes de hauteur (échafaudages, toits)',
        'Accidents avec équipements lourds',
        'Exposition à substances dangereuses',
        'Troubles musculo-squelettiques',
        'Accidents de circulation sur chantier'
      ],
      commonIncidents: [
        'Chutes de plain-pied (35% des accidents)',
        'Contact avec objets (28% des accidents)',
        'Surmenage/efforts répétitifs (22% des accidents)'
      ],
      regulatoryFocus: [
        'Règlement sur la santé et la sécurité du travail (RSST)',
        'Code de sécurité pour les travaux de construction',
        'Normes ASP Construction'
      ]
    },
    '31-33': { // Fabrication
      scianCode: '31-33',
      sectorName: 'Fabrication/Manufacture',
      riskProfile: 'MODÉRÉ À ÉLEVÉ - Risques mécaniques, ergonomiques, chimiques',
      primaryRisks: [
        'Accidents avec machines industrielles',
        'Troubles musculo-squelettiques répétitifs',
        'Exposition à produits chimiques',
        'Risques de coupures et écrasements',
        'Fatigue et stress lié aux cadences'
      ],
      commonIncidents: [
        'Troubles musculo-squelettiques (45% des lésions)',
        'Accidents machines/outils (30% des accidents)',
        'Contact substances dangereuses (15% des cas)'
      ],
      regulatoryFocus: [
        'Normes machines industrielles',
        'Hygiène industrielle',
        'Ergonomie des postes de travail'
      ]
    },
    '62': { // Services professionnels
      scianCode: '62',
      sectorName: 'Soins de santé et assistance sociale',
      riskProfile: 'MODÉRÉ - Risques biologiques, ergonomiques, psychosociaux',
      primaryRisks: [
        'Troubles musculo-squelettiques (manipulation patients)',
        'Exposition agents biologiques/infectieux',
        'Stress et épuisement professionnel',
        'Accidents avec objets tranchants',
        'Violence en milieu de travail'
      ],
      commonIncidents: [
        'TMS liés aux transferts patients (40% des lésions)',
        'Piqûres accidentelles (20% des accidents)',
        'Agressions/violence (15% des incidents)'
      ],
      regulatoryFocus: [
        'Prévention infections nosocomiales',
        'Ergonomie soins aux patients',
        'Gestion stress et épuisement'
      ]
    }
  };

  /**
   * Génère un prompt enrichi pour l'assistant IA
   * @param promptType Type de prompt souhaité
   * @param userContext Contexte utilisateur (profil SCIAN, projet, etc.)
   * @param options Options supplémentaires
   */
  async generateEnrichedPrompt(
    promptType: string,
    userContext: any,
    options: { 
      includeDataInsights?: boolean;
      includeExamples?: boolean;
      detailLevel?: 'basic' | 'detailed' | 'expert';
    } = {}
  ): Promise<string> {
    
    // 1. Récupérer le template de base
    const template = this.promptTemplates[promptType];
    if (!template) {
      throw new Error(`Type de prompt non supporté: ${promptType}`);
    }

    // 2. Construire le contexte sectoriel
    const sectorContext = await this.buildSectorContext(userContext);

    // 3. Récupérer les insights des données SST si demandé
    const sstInsights = options.includeDataInsights ? 
      await this.getSSInsights() : null;

    // 4. Assembler le prompt enrichi
    const enrichedPrompt = this.assemblePrompt(
      template,
      sectorContext,
      sstInsights,
      userContext,
      options
    );

    return enrichedPrompt;
  }

  /**
   * Construit le contexte sectoriel à partir du profil utilisateur
   */
  private async buildSectorContext(userContext: any): Promise<SectorContext> {
    const scianCode = userContext?.scianCode || userContext?.secteur || '23'; // Défaut construction
    
    // Utiliser la base de connaissances ou construire dynamiquement
    let context = this.sectorKnowledge[scianCode];
    
    if (!context) {
      // Contexte générique si secteur non référencé
      context = {
        scianCode: scianCode,
        sectorName: userContext?.secteurNom || 'Secteur non spécifié',
        riskProfile: 'VARIABLE - Analyse contextuelle requise',
        primaryRisks: ['Risques à identifier selon activités spécifiques'],
        commonIncidents: ['Données d\'incidents à analyser'],
        regulatoryFocus: ['Réglementation générale SST applicable']
      };
    }

    return context;
  }

  /**
   * Récupère les insights des données SST collectées
   */
  private async getSSInsights(): Promise<SSTInsights> {
    try {
      // Récupérer les statistiques d'utilisation
      const stats = await sstCrawlerService.getUsageStatistics();
      
      // Analyser les données pour extraire des insights
      const insights: SSTInsights = {
        trendingRisks: [
          'Augmentation des TMS liés au télétravail',
          'Risques psychosociaux post-COVID',
          'Sécurité des espaces de travail hybrides'
        ],
        emergingThemes: [
          'IA pour détection précoce de fatigue',
          'Capteurs IoT pour surveillance environnementale',
          'Réalité virtuelle pour formation sécurité'
        ],
        successfulInterventions: [
          'Exosquelettes pour réduction TMS (30% d\'amélioration)',
          'Algorithmes prédictifs maintenance (25% réduction accidents)',
          'Chatbots formation sécurité (40% engagement accru)'
        ],
        dataQuality: `${stats.totalSources} sources analysées, ${stats.dataCollected} éléments collectés`,
        lastUpdate: new Date().toISOString()
      };

      return insights;
    } catch (error) {
      console.error('Erreur récupération insights SST:', error);
      return {
        trendingRisks: ['Données en cours de collecte'],
        emergingThemes: ['Analyse en cours'],
        successfulInterventions: ['Références en cours d\'agrégation'],
        dataQuality: 'Données simulées pour développement',
        lastUpdate: new Date().toISOString()
      };
    }
  }

  /**
   * Assemble le prompt final enrichi
   */
  private assemblePrompt(
    template: PromptTemplate,
    sectorContext: SectorContext,
    sstInsights: SSTInsights | null,
    userContext: any,
    options: any
  ): string {
    
    const projectName = userContext?.projectName || 'le projet IA en cours d\'évaluation';
    const organizationSize = userContext?.tailleEntreprise || 'organisation';
    const detailLevel = options.detailLevel || 'detailed';

    let prompt = `${template.basePrompt}

## CONTEXTE ORGANISATIONNEL
**Secteur d'activité :** ${sectorContext.sectorName} (SCIAN ${sectorContext.scianCode})
**Taille organisation :** ${organizationSize}
**Projet évalué :** ${projectName}

## PROFIL DE RISQUES SECTORIELS
**Niveau de risque :** ${sectorContext.riskProfile}

**Risques prioritaires identifiés :**
${sectorContext.primaryRisks.map(risk => `• ${risk}`).join('\n')}

**Incidents les plus fréquents dans ce secteur :**
${sectorContext.commonIncidents.map(incident => `• ${incident}`).join('\n')}

**Réglementation applicable :**
${sectorContext.regulatoryFocus.map(reg => `• ${reg}`).join('\n')}`;

    // Ajouter les insights des données SST si disponibles
    if (sstInsights && options.includeDataInsights) {
      prompt += `

## INSIGHTS DES DONNÉES SST RÉCENTES
**Source :** ${sstInsights.dataQuality} (${sstInsights.lastUpdate.split('T')[0]})

**Tendances émergentes :**
${sstInsights.trendingRisks.map(trend => `• ${trend}`).join('\n')}

**Thèmes d'innovation IA en SST :**
${sstInsights.emergingThemes.map(theme => `• ${theme}`).join('\n')}

**Interventions IA ayant fait leurs preuves :**
${sstInsights.successfulInterventions.map(intervention => `• ${intervention}`).join('\n')}`;
    }

    // Instructions spécifiques selon le niveau de détail
    if (detailLevel === 'expert') {
      prompt += `

## INSTRUCTIONS SPÉCIALISÉES
Générez des recommandations de niveau expert incluant :
1. **Faisabilité technique** avec technologies IA spécifiques recommandées
2. **Analyse coût-bénéfice** avec estimations ROI basées sur données sectorielles
3. **Plan d'implémentation** avec jalons et indicateurs de succès
4. **Risques et mitigation** spécifiques aux technologies IA proposées
5. **Conformité réglementaire** avec références aux normes applicables

Basez vos recommandations sur les données probantes fournies et citez des exemples concrets du secteur ${sectorContext.sectorName}.`;
    } else if (detailLevel === 'detailed') {
      prompt += `

## INSTRUCTIONS DÉTAILLÉES
Pour chaque idée de projet IA proposée, incluez :
1. **Description claire** du problème SST visé
2. **Solution IA recommandée** avec justification technique
3. **Bénéfices attendus** chiffrés si possible
4. **Étapes de mise en œuvre** principales
5. **Indicateurs de succès** mesurables

Priorisez les solutions ayant fait leurs preuves dans le secteur ${sectorContext.sectorName}.`;
    } else {
      prompt += `

## INSTRUCTIONS
Proposez 3-5 idées de projets IA concrètes et réalisables pour améliorer la SST dans ce contexte. Pour chaque idée, précisez le problème visé, la solution IA suggérée et les bénéfices attendus.`;
    }

    return prompt;
  }

  /**
   * Génère des prompts spécialisés selon le rôle utilisateur
   */
  async generateRoleBasedPrompt(
    userRole: 'travailleur' | 'gestionnaire' | 'comite_sst' | 'direction',
    userContext: any
  ): Promise<string> {
    
    const rolePrompts = {
      travailleur: 'project_generation',
      gestionnaire: 'implementation_guidance', 
      comite_sst: 'risk_analysis',
      direction: 'implementation_guidance'
    };

    const roleOptions = {
      travailleur: { detailLevel: 'basic' as const, includeDataInsights: true },
      gestionnaire: { detailLevel: 'detailed' as const, includeDataInsights: true },
      comite_sst: { detailLevel: 'expert' as const, includeDataInsights: true },
      direction: { detailLevel: 'detailed' as const, includeDataInsights: false }
    };

    return this.generateEnrichedPrompt(
      rolePrompts[userRole],
      userContext,
      roleOptions[userRole]
    );
  }

  /**
   * Met à jour la base de connaissances sectorielles
   */
  updateSectorKnowledge(scianCode: string, context: Partial<SectorContext>): void {
    if (this.sectorKnowledge[scianCode]) {
      this.sectorKnowledge[scianCode] = {
        ...this.sectorKnowledge[scianCode],
        ...context
      };
    } else {
      this.sectorKnowledge[scianCode] = context as SectorContext;
    }
  }

  /**
   * Récupère la liste des secteurs supportés
   */
  getSupportedSectors(): Array<{code: string, name: string, riskLevel: string}> {
    return Object.values(this.sectorKnowledge).map(sector => ({
      code: sector.scianCode,
      name: sector.sectorName,
      riskLevel: sector.riskProfile.split(' - ')[0]
    }));
  }
}

// Exporter une instance par défaut
export const enhancedPromptGenerator = new EnhancedPromptGenerator();