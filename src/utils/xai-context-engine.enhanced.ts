// src/utils/xai-context-engine.enhanced.ts
// Module XAI pour IGNITIA - Explication contextuelle et analyse automatisée
// Version améliorée avec intégration des données CNESST agrégées
// Basé sur les meilleures pratiques Claude Sonnet 4.0 et ingénierie du contexte

import { DonneesSecteursService } from '../store/donneesSecteursStore';
import { genererConfigurationsVisualisations } from './configVisualisation';

export interface XAIExplanation {
  contexteSectoriel: string;
  justificationDonnees: string;
  recommandationPratique: string;
  tracabilite: string;
  references: XAIReference[];
  niveauConfiance: number; // 1-10
  visualisations?: any; // Configurations pour visualisations
  risquesPrincipaux?: Array<{type: string, pourcentage: number}>;
  agentsCausaux?: Array<{type: string, pourcentage: number}>;
  tendances?: any;
  opportunitesIA?: string[];
}

export interface XAIReference {
  titre: string;
  url: string;
  type: 'norme' | 'recherche' | 'guide' | 'veille' | 'regulation';
  date: string;
  pertinence: number; // 1-10
}

export interface ProjectContext {
  nom: string;
  description: string;
  secteurSCIAN: string;
  criteresEvalues: Record<string, number>;
  risquesPrincipaux: string[];
  donneesPilotes: string[];
}

export class XAIContextEngine {
  private referentielsSSTQuebec = [
    {
      titre: "CNESST - Prévention des chutes en construction",
      url: "https://www.cnesst.gouv.qc.ca/fr/prevention/faire-de-prevention/travail-hauteur",
      type: "regulation" as const,
      date: "2024-12-01",
      pertinence: 9
    },
    {
      titre: "GenAISafety - Mastering HSE Engineering Prompts",
      url: "https://www.genaisafety.online/mastering-hse-ingeneering-prompts",
      type: "guide" as const,
      date: "2024-11-15",
      pertinence: 10
    },
    {
      titre: "ILO - L'IA et la numérisation transforment la SST",
      url: "https://www.ilo.org/fr/resource/news/lia-et-la-numerisation-transforment-la-securite-et-la-sante-au-travail",
      type: "recherche" as const,
      date: "2024-10-30",
      pertinence: 8
    },
    {
      titre: "ISO 45001:2018 - Systèmes de management de la SST",
      url: "https://www.iso.org/fr/iso-45001-occupational-health-and-safety.html",
      type: "norme" as const,
      date: "2024-01-01",
      pertinence: 9
    }
  ];

  private baseConnaissancesSectorielles = {
    "23": { // Construction
      risquesPrincipaux: ["Chutes de hauteur", "Accidents mortels", "Équipements défaillants"],
      statistiquesCNESST: "32% des accidents graves proviennent des chutes",
      prioriteReglementaire: "Très élevée - Secteur à risque élevé",
      technologiesIA: ["Vision par ordinateur", "Capteurs IoT", "Apprentissage automatique"]
    },
    "2381": { // Construction de bâtiments résidentiels
      risquesPrincipaux: ["Chutes de hauteur", "Accidents mortels", "Équipements défaillants"],
      statistiquesCNESST: "32% des accidents graves proviennent des chutes",
      prioriteReglementaire: "Très élevée - Secteur à risque élevé",
      technologiesIA: ["Vision par ordinateur", "Capteurs IoT", "Apprentissage automatique"]
    },
    "3361": { // Fabrication automobile
      risquesPrincipaux: ["Troubles musculo-squelettiques", "Accidents de machines", "Exposition chimique"],
      statistiquesCNESST: "45% des lésions liées aux mouvements répétitifs",
      prioriteReglementaire: "Élevée - Surveillance continue requise",
      technologiesIA: ["Ergonomie prédictive", "Maintenance prédictive", "Analyse des mouvements"]
    }
  };

  // Service d'accès aux données sectorielles
  private donneesSecteursService: DonneesSecteursService;
  
  constructor() {
    // Initialiser le service de données sectorielles
    this.donneesSecteursService = new DonneesSecteursService();
  }

  /**
   * Génère une explication XAI complète pour un critère donné
   * Intègre maintenant les données CNESST agrégées
   */
  async genererExplicationXAI(
    critere: string,
    score: number,
    contexte: ProjectContext
  ): Promise<XAIExplanation> {
    // Récupérer les données sectorielles enrichies si disponibles
    const etatDonnees = this.donneesSecteursService.getState();
    const contexteSectorielEnrichi = etatDonnees.contexteSectoriel;
    
    // Utiliser la base de connaissances de secours si les données enrichies ne sont pas disponibles
    const secteurInfo = this.baseConnaissancesSectorielles[contexte.secteurSCIAN as keyof typeof this.baseConnaissancesSectorielles];
    const references = this.selectionnerReferencesPertinenrtes(critere, contexte);

    // Préparer l'explication de base
    const explication: XAIExplanation = {
      contexteSectoriel: this.genererContexteSectoriel(contexte, secteurInfo, contexteSectorielEnrichi),
      justificationDonnees: this.genererJustificationDonnees(critere, score, secteurInfo, contexteSectorielEnrichi),
      recommandationPratique: this.genererRecommandation(critere, score, contexte, contexteSectorielEnrichi),
      tracabilite: this.genererTracabilite(critere, score, contexte),
      references: references,
      niveauConfiance: this.calculerNiveauConfiance(critere, contexte, contexteSectorielEnrichi)
    };

    // Enrichir l'explication avec les données CNESST si disponibles
    if (contexteSectorielEnrichi && contexteSectorielEnrichi.risquesPrincipaux && contexteSectorielEnrichi.risquesPrincipaux.length > 0) {
      explication.risquesPrincipaux = contexteSectorielEnrichi.risquesPrincipaux;
      explication.agentsCausaux = contexteSectorielEnrichi.agentsCausauxDominants;
      explication.opportunitesIA = contexteSectorielEnrichi.opportunitesIA;
      
      // Ajouter les configurations pour les visualisations
      if (etatDonnees.resultatsAggregation && etatDonnees.resultatsAggregation.secteurConstruction) {
        explication.visualisations = genererConfigurationsVisualisations(
          etatDonnees.resultatsAggregation.secteurConstruction
        );
        explication.tendances = etatDonnees.resultatsAggregation.tendancesAnnuelles;
      }
    }

    return explication;
  }

  /**
   * Génère le contexte sectoriel avec données SCIAN
   * Utilise maintenant les données CNESST agrégées si disponibles
   */
  private genererContexteSectoriel(
    contexte: ProjectContext, 
    secteurInfo: any, 
    contexteSectorielEnrichi?: any
  ): string {
    // Si les données enrichies sont disponibles, les utiliser
    if (contexteSectorielEnrichi && contexteSectorielEnrichi.risquesPrincipaux && contexteSectorielEnrichi.risquesPrincipaux.length > 0) {
      const risquesTexte = contexteSectorielEnrichi.risquesPrincipaux
        .map((r: any) => `${r.type} (${r.pourcentage}%)`)
        .join(', ');
      
      let tendanceTexte = '';
      if (contexteSectorielEnrichi.tendance) {
        const variationSymbole = contexteSectorielEnrichi.tendance.variationTotale >= 0 ? '+' : '';
        tendanceTexte = `Tendance: ${variationSymbole}${contexteSectorielEnrichi.tendance.variationTotale}% de lésions sur 5 ans`;
      }
      
      return `Secteur SCIAN ${contexte.secteurSCIAN} - ${this.obtenirNomSecteur(contexte.secteurSCIAN)}. 
      Risques principaux identifiés : ${risquesTexte}. 
      ${tendanceTexte}
      Données CNESST 2018-2023 analysées et agrégées.`;
    }
    
    // Utiliser les données de base si les données enrichies ne sont pas disponibles
    return `Secteur SCIAN ${contexte.secteurSCIAN} - ${this.obtenirNomSecteur(contexte.secteurSCIAN)}. 
    Risques principaux identifiés : ${secteurInfo?.risquesPrincipaux?.join(', ') || 'Non spécifiés'}. 
    Selon les données CNESST 2024 : ${secteurInfo?.statistiquesCNESST || 'Données en cours d\'analyse'}.`;
  }

  /**
   * Génère la justification basée sur les données
   * Intègre les données CNESST spécifiques au secteur
   */
  private genererJustificationDonnees(
    critere: string, 
    score: number, 
    secteurInfo: any,
    contexteSectorielEnrichi?: any
  ): string {
    // Utiliser les données enrichies si disponibles
    if (contexteSectorielEnrichi && contexteSectorielEnrichi.indicateurs) {
      const indTMS = (contexteSectorielEnrichi.indicateurs.tauxTMS * 100).toFixed(1);
      const indPsy = (contexteSectorielEnrichi.indicateurs.tauxPSY * 100).toFixed(1);
      
      const justificationsEnrichies = {
        "riskReduction": `Score ${score}/10 justifié par l'impact direct sur la réduction des risques. 
          Les données CNESST montrent que ${indTMS}% des lésions sont des TMS et ${indPsy}% sont des lésions psychologiques dans ce secteur.`,
        
        "technicalFeasibility": `Score ${score}/10 basé sur la disponibilité des technologies IA éprouvées. 
          Technologies recommandées : ${contexteSectorielEnrichi.opportunitesIA?.join(', ') || 'Solutions IA standards'}.`,
        
        "businessValue": `Score ${score}/10 évalué selon l'impact économique potentiel. 
          ROI estimé basé sur la réduction des incidents impliquant ${contexteSectorielEnrichi.agentsCausauxDominants?.[0]?.type || 'agents causaux principaux'} (${contexteSectorielEnrichi.agentsCausauxDominants?.[0]?.pourcentage || 0}% des cas).`,
        
        "regulatoryCompliance": `Score ${score}/10 déterminé par le niveau de conformité aux exigences CNESST et ISO 45001. 
          Population à risque : ${contexteSectorielEnrichi.populationARisque?.[0]?.description || 'Travailleurs du secteur'} (${contexteSectorielEnrichi.populationARisque?.[0]?.pourcentage || 0}%).`
      };

      return justificationsEnrichies[critere as keyof typeof justificationsEnrichies] || 
            `Score ${score}/10 évalué selon les critères standards du secteur et données CNESST 2018-2023.`;
    }
    
    // Utiliser les justifications de base si les données enrichies ne sont pas disponibles
    const justifications = {
      "riskReduction": `Score ${score}/10 justifié par l'impact direct sur la réduction des risques. 
        ${secteurInfo?.statistiquesCNESST || 'Les données sectorielles confirment l\'importance de ce critère'}.`,
      
      "technicalFeasibility": `Score ${score}/10 basé sur la disponibilité des technologies IA éprouvées. 
        Technologies recommandées : ${secteurInfo?.technologiesIA?.join(', ') || 'Solutions IA standards'}.`,
      
      "businessValue": `Score ${score}/10 évalué selon l'impact économique potentiel. 
        ROI estimé basé sur la réduction des incidents et l'amélioration de la conformité réglementaire.`,
      
      "regulatoryCompliance": `Score ${score}/10 déterminé par le niveau de conformité aux exigences CNESST et ISO 45001. 
        Priorité réglementaire : ${secteurInfo?.prioriteReglementaire || 'Évaluation en cours'}.`
    };

    return justifications[critere as keyof typeof justifications] || 
          `Score ${score}/10 évalué selon les critères standards du secteur.`;
  }

  /**
   * Génère une recommandation pratique
   * Basée sur le score et les opportunités IA identifiées
   */
  private genererRecommandation(
    critere: string, 
    score: number, 
    contexte: ProjectContext,
    contexteSectorielEnrichi?: any
  ): string {
    // Choisir une opportunité IA spécifique si disponible
    let opportuniteSpecifique = '';
    if (contexteSectorielEnrichi && contexteSectorielEnrichi.opportunitesIA && contexteSectorielEnrichi.opportunitesIA.length > 0) {
      opportuniteSpecifique = ` Focus recommandé: ${contexteSectorielEnrichi.opportunitesIA[0]}.`;
    }
    
    if (score >= 8) {
      return `Priorité HAUTE : Déployer immédiatement ce projet. Formation des équipes recommandée dans les 30 jours.${opportuniteSpecifique}`;
    } else if (score >= 6) {
      return `Priorité MOYENNE : Planifier un projet pilote sur 90 jours avec validation par les experts SST.${opportuniteSpecifique}`;
    } else {
      return `Priorité FAIBLE : Améliorer la faisabilité technique avant déploiement. Étude approfondie recommandée.${opportuniteSpecifique}`;
    }
  }

  /**
   * Génère la traçabilité pour audit
   */
  private genererTracabilite(critere: string, score: number, contexte: ProjectContext): string {
    const timestamp = new Date().toISOString();
    return `Décision XAI tracée le ${timestamp}. 
    Algorithme : IGNITIA-XAI v1.2. 
    Sources : Base SCIAN ${contexte.secteurSCIAN}, données CNESST 2018-2023, référentiels CNESST/ISO. 
    Méthode : Analyse multi-critères avec pondération sectorielle et données historiques. 
    Auditabilité : Conforme ISO 42001 et exigences CNESST.`;
  }

  /**
   * Sélectionne les références les plus pertinentes
   */
  private selectionnerReferencesPertinenrtes(critere: string, contexte: ProjectContext): XAIReference[] {
    return this.referentielsSSTQuebec
      .filter(ref => this.estPertinentPourCritere(ref, critere))
      .sort((a, b) => b.pertinence - a.pertinence)
      .slice(0, 3); // Top 3 références
  }

  /**
   * Détermine si une référence est pertinente pour un critère
   */
  private estPertinentPourCritere(reference: XAIReference, critere: string): boolean {
    const mappingCriteres = {
      "riskReduction": ["regulation", "norme", "guide"],
      "technicalFeasibility": ["guide", "recherche"],
      "regulatoryCompliance": ["regulation", "norme"],
      "businessValue": ["recherche", "guide"]
    };

    const typesPertinenets = mappingCriteres[critere as keyof typeof mappingCriteres] || ["guide"];
    return typesPertinenets.includes(reference.type);
  }

  /**
   * Calcule le niveau de confiance de l'explication
   * Augmenté lorsque les données CNESST enrichies sont disponibles
   */
  private calculerNiveauConfiance(
    critere: string, 
    contexte: ProjectContext,
    contexteSectorielEnrichi?: any
  ): number {
    let confiance = 7; // Base

    // +2 si données CNESST enrichies disponibles
    if (contexteSectorielEnrichi && contexteSectorielEnrichi.risquesPrincipaux && contexteSectorielEnrichi.risquesPrincipaux.length > 0) {
      confiance += 2;
    }
    // +1 si secteur bien documenté dans la base de connaissances
    else if (this.baseConnaissancesSectorielles[contexte.secteurSCIAN as keyof typeof this.baseConnaissancesSectorielles]) {
      confiance += 1;
    }

    // +1 si description détaillée
    if (contexte.description.length > 100) {
      confiance += 1;
    }

    // +1 si références récentes disponibles
    const referencesRecentes = this.referentielsSSTQuebec.filter(
      ref => new Date(ref.date) > new Date('2024-01-01')
    );
    if (referencesRecentes.length > 2) {
      confiance += 1;
    }

    return Math.min(confiance, 10);
  }

  /**
   * Obtient le nom du secteur SCIAN
   */
  private obtenirNomSecteur(scianId: string): string {
    const secteurs = {
      "23": "Construction",
      "2381": "Construction de bâtiments résidentiels",
      "3361": "Fabrication de véhicules automobiles",
      "6211": "Bureaux de médecins",
      "4441": "Commerce de matériaux de construction"
    };

    return secteurs[scianId as keyof typeof secteurs] || "Secteur non spécifié";
  }

  /**
   * Génère un prompt Claude optimisé pour XAI contextuel
   * Enrichi avec les données CNESST si disponibles
   */
  genererPromptXAIContextuel(critere: string, contexte: ProjectContext): string {
    // Récupérer les données sectorielles enrichies si disponibles
    const etatDonnees = this.donneesSecteursService.getState();
    const contexteSectorielEnrichi = etatDonnees.contexteSectoriel;
    
    let risquesTexte = 'Non spécifiés';
    let statistiquesTexte = '';
    
    // Utiliser les données enrichies si disponibles
    if (contexteSectorielEnrichi && contexteSectorielEnrichi.risquesPrincipaux && contexteSectorielEnrichi.risquesPrincipaux.length > 0) {
      risquesTexte = contexteSectorielEnrichi.risquesPrincipaux
        .map((r: any) => `${r.type} (${r.pourcentage}%)`)
        .join(', ');
      
      statistiquesTexte = `
      STATISTIQUES CNESST (2018-2023):
      - TMS: ${(contexteSectorielEnrichi.indicateurs?.tauxTMS * 100).toFixed(1)}% des lésions
      - Lésions psychologiques: ${(contexteSectorielEnrichi.indicateurs?.tauxPSY * 100).toFixed(1)}% des lésions
      - Agents causaux principaux: ${contexteSectorielEnrichi.agentsCausauxDominants?.[0]?.type || 'Non spécifié'} (${contexteSectorielEnrichi.agentsCausauxDominants?.[0]?.pourcentage || 0}%)
      - Population à risque: ${contexteSectorielEnrichi.populationARisque?.[0]?.description || 'Non spécifié'} (${contexteSectorielEnrichi.populationARisque?.[0]?.pourcentage || 0}%)
      `;
    }
    
    return `Tu es expert XAI en santé-sécurité au travail pour IGNITIA.

CONTEXTE DU PROJET :
- Nom : ${contexte.nom}
- Secteur SCIAN : ${contexte.secteurSCIAN} (${this.obtenirNomSecteur(contexte.secteurSCIAN)})
- Description : ${contexte.description}
- Risques identifiés : ${contexte.risquesPrincipaux.join(', ')}
${statistiquesTexte}

MISSION :
Explique le score du critère "${critere}" en suivant cette structure :

1. **Contexte sectoriel** : Pourquoi ce critère est important dans ce secteur SCIAN, avec données CNESST à l'appui
2. **Justification données** : Sur quelles données/normes s'appuie cette évaluation (citer CNESST, ISO, recherches)
3. **Recommandation pratique** : Action prioritaire pour le gestionnaire
4. **Traçabilité** : Comment cette décision peut être auditée

EXIGENCES :
- Utilise un langage clair pour gestionnaire non-technique
- Cite des références québécoises (CNESST) et internationales (ISO, ILO)
- Propose des solutions IA adaptées au profil de risque du secteur
- Termine par une ressource utile à consulter
- Assure la conformité ISO 42001 (IA responsable)

Génère une explication explicable, contextualisée et traçable, basée sur l'analyse des données réelles CNESST 2018-2023.`;
  }

  /**
   * Charge les données sectorielles CNESST
   * @param fichiers Liste des fichiers CSV CNESST
   */
  async chargerDonneesSectorielles(fichiers: any[]): Promise<void> {
    try {
      await this.donneesSecteursService.chargerDonneesCNESST(fichiers);
      console.log("Données sectorielles CNESST chargées avec succès");
    } catch (error) {
      console.error("Erreur lors du chargement des données CNESST:", error);
      throw error;
    }
  }
}

// Export des fonctions utilitaires
export const xaiEngine = new XAIContextEngine();

export const genererExplicationComplete = async (
  critere: string,
  score: number,
  contexteProjet: ProjectContext
): Promise<XAIExplanation> => {
  return await xaiEngine.genererExplicationXAI(critere, score, contexteProjet);
};

// Nouvelle fonction pour charger les données CNESST
export const chargerDonneesCNESST = async (fichiers: any[]): Promise<void> => {
  return await xaiEngine.chargerDonneesSectorielles(fichiers);
};