// src/types/project.ts
// EXTENSION COMPLÈTE AVEC ENRICHISSEMENT - IGNITIA 2025
// Conservation de toutes les interfaces existantes + ajout enrichissement

// ═══════════════════════════════════════════════════════════════
// INTERFACES EXISTANTES (CONSERVÉES INTÉGRALEMENT)
// ═══════════════════════════════════════════════════════════════

export interface Criteria {
  impact: number;
  excellence: number;
  faisabilite: number;
  gouvernance: number;
  securite: number;
  acceptabilite: number;
  perennite: number;
}

export interface Project {
  id: string;
  name: string;
  criteria: Criteria;
  score: number;
  scianSectorId?: string;
  priority?: {
    score: number;
    level: 'high' | 'medium' | 'low';
    details?: {
      conformiteLSST: number;
      mortalityImpact: number;
      sectorPrevalence: number;
      aiPreventivePotential: number;
      legislationCompliance: number;
      dataAvailability: number;
      implementationDelay: number;
    };
  };
}

// ═══════════════════════════════════════════════════════════════
// 🆕 NOUVELLES INTERFACES ENRICHISSEMENT (8 AXES)
// ═══════════════════════════════════════════════════════════════

/**
 * Interface pour la conformité réglementaire exhaustive
 */
export interface ConformiteReglementaire {
  normes_applicables: {
    [key: string]: {
      nom: string;
      articles: string[];
      applicabilite: string;
      niveau_conformite: 'Conforme' | 'En cours' | 'Non applicable' | 'À vérifier';
    };
  };
  justification_applicabilite: string;
  documentation_conformite: string[];
}

/**
 * Classification IA selon standards OCDE/ISO 22989
 */
export interface ClassificationIA {
  taxonomie_ocde: {
    categories_principales: Array<{
      type: 'Perception' | 'Prédiction' | 'Raisonnement' | 'Action' | 'Interaction' | 'Planification';
      description: string;
      niveau_complexite: 'Faible' | 'Intermédiaire' | 'Élevé';
      techniques: string[];
    }>;
    classification_iso_22989: {
      domaine_application: string;
      type_apprentissage: string;
      niveau_autonomie: string;
      domaine_connaissance: string;
    };
  };
  finalite_principale: string;
  niveau_criticite: 'Faible' | 'Modéré' | 'Critique';
}

/**
 * Catégorisation selon méthodes IRSST
 */
export interface CategorieIRSST {
  classification: 'Catégorie I - Acquisition' | 'Catégorie II - Optimisation' | 'Catégorie III - Acceptabilité';
  sous_categorie: string;
  justification: string;
  contribution_recherche: {
    domaines: string[];
    impact_scientifique: string;
    transfert_connaissances: string;
  };
  alignement_priorites_IRSST: {
    axe_1: string;
    axe_2: string;
    axe_3: string;
    axe_4: string;
  };
}

/**
 * Secteurs prioritaires avec codes SCIAN structurés
 */
export interface SecteursScian {
  secteurs_principaux: Array<{
    code: string;
    libelle: string;
    sous_secteurs: Array<{
      code: string;
      libelle: string;
    }>;
    pertinence: 'Faible' | 'Moyenne' | 'Élevée' | 'Critique';
    specificites: string[];
  }>;
  adaptations_sectorielles: {
    [secteur: string]: string;
  };
  universalite: string;
}

/**
 * Explicabilité de l'IA avec méthodes XAI
 */
export interface ExplicabiliteIA {
  niveau_explicabilite: 'Élémentaire' | 'Intermédiaire' | 'Élevé';
  justification_niveau: string;
  methodes_explicabilite: {
    approche_principale: 'Intégrée' | 'Post-hoc' | 'Hybride';
    techniques_integrees: Array<{
      nom: string;
      type: 'Intégrée' | 'Post-hoc' | 'Hybride';
      description: string;
      sortie: string;
    }>;
  };
  types_justification: {
    technique: {
      format: string;
      contenu: string[];
      audience: string;
    };
    executif: {
      format: string;
      contenu: string[];
      audience: string;
    };
    operationnel: {
      format: string;
      contenu: string[];
      audience: string;
    };
  };
  exemple_justification: {
    scenario: string;
    facteurs_identifies: Array<{
      facteur: string;
      score_risque: number;
      justification: string;
    }>;
    conclusion: string;
    actions_recommandees: string[];
  };
  validation_explicabilite: {
    tests_utilisateurs: string;
    audit_algorithmes: string;
    formation_utilisateurs: string;
  };
}

/**
 * Niveaux d'impact quantifiés en SST
 */
export interface NiveauxImpactSST {
  reduction_incidents: {
    estimation_quantitative: string;
    methodologie: string;
    horizon_temporal: string;
    types_incidents: {
      [type: string]: {
        reduction: string;
        justification: string;
      };
    };
    validation_donnees: string;
  };
  automatisation_taches: {
    processus_automatises: Array<{
      tache: string;
      gain_temps: string;
      description: string;
    }>;
    impact_ressources: string;
    reallocation: string;
  };
  amelioration_formation: {
    personnalisation: {
      methode: string;
      efficacite: string;
      mesure: string;
    };
    scenarios_realistes: {
      generation: string;
      pertinence: string;
      adaptation: string;
    };
    suivi_competences: {
      tracking: string;
      identification_gaps: string;
      recommandations: string;
    };
  };
  gains_conformite: {
    conformite_reglementaire: {
      amelioration: string;
      description: string;
      mesure: string;
    };
    documentation: {
      completude: string;
      tracabilite: string;
      audit_trail: string;
    };
    certifications: {
      facilitation: string;
      maintenance: string;
      reporting: string;
    };
  };
  roi_economique: {
    economies_directes: {
      reduction_accidents: string;
      optimisation_temps: string;
      conformite: string;
    };
    retour_investissement: {
      periode: string;
      ratio: string;
      facteurs: string[];
    };
  };
}

/**
 * Badges de conformité avec icônes automatiques
 */
export interface BadgesConformite {
  badges_actifs: Array<{
    code: string;
    icone: string;
    nom: string;
    description: string;
    statut: 'Validé' | 'En cours' | 'Non applicable' | 'À vérifier';
    date_validation: string;
    validite: string;
  }>;
  logique_attribution: {
    automatique: string;
    validation_humaine: string;
    mise_a_jour: string;
  };
  affichage_interface: {
    position: string;
    format: string;
    couleurs: {
      conforme: string;
      en_cours: string;
      non_applicable: string;
    };
  };
}

/**
 * Profils UX multi-utilisateurs SST
 */
export interface UXProfiles {
  [profileName: string]: {
    description: string;
    fonctions_appelables: string[];
    composants_UI: string[];
    spec_ergonomiques: {
      interface: string;
      langue: string;
      accessibilite: string;
      contexte_usage: string;
      temps_interaction: string;
    };
  };
  personnalisation_adaptive: {
    apprentissage_usage: string;
    preferences_utilisateur: string;
    notifications_intelligentes: string;
    aide_contextuelle: string;
  };
}

// ═══════════════════════════════════════════════════════════════
// 🆕 INTERFACES PRINCIPALES ENRICHIES
// ═══════════════════════════════════════════════════════════════

/**
 * Interface pour référence marketplace GenAISafety
 */
export interface MarketstoreRef {
  url: string;
  marketstore_id: string;
  date_import: string;
  synchronisation: 'auto' | 'manual';
  statut: 'synced' | 'pending' | 'error';
}

/**
 * Interface pour cas d'usage sectoriels
 */
export interface CasUsageSectoriel {
  titre: string;
  description: string;
  reference: string;
}

/**
 * Interface pour cybersécurité
 */
export interface Cybersecurite {
  donnees_sensibles: boolean;
  mesures: string[];
  conformite: string[];
}

/**
 * Interface pour gouvernance éthique
 */
export interface GouvernanceEthique {
  transparence: string;
  equite: string;
  responsabilite: string;
  protection_donnees: string;
  conformite: string[];
  audit: string;
  recours: string;
}

/**
 * Interface pour indicateurs visuels
 */
export interface Indicateurs {
  conformite_loi_25: boolean;
  audit_biais_valide: boolean;
  explicabilite_activee: boolean;
}

/**
 * Interface pour implémentation
 */
export interface Implementation {
  technologies: string[];
  prerequisites: string[];
  steps: string[];
}

/**
 * Interface pour métriques
 */
export interface Metrics {
  views: number;
  usage: number;
  rating: number;
}

/**
 * Interface pour compatibilité système
 */
export interface CompatibiliteSysteme {
  version_standard: string;
  retrocompatibilite: boolean;
  migration_automatique: string;
  validation_schema: {
    structure_base: string;
    champs_ajoutes: number;
    champs_modifies: number;
    champs_supprimes: number;
  };
}

/**
 * Interface pour métadonnées d'enrichissement
 */
export interface MetadonneesEnrichissement {
  date_enrichissement: string;
  version_enrichissement: string;
  responsable_enrichissement: string;
  methode_generation: string;
  validation_requise: string[];
}

// ═══════════════════════════════════════════════════════════════
// 🆕 INTERFACE PRINCIPALE ENRICHIE
// ═══════════════════════════════════════════════════════════════

/**
 * Interface principale pour projet IA-SST enrichi selon standard IGNITIA 2025
 * Compatible avec structure existante + enrichissement complet
 */
export interface IGNITIAProjectEnriched {
  // Champs de base obligatoires
  project_id: string;
  nom: string;
  niveau: 'Débutant' | 'Intermédiaire' | 'Avancé';
  contexte: 'Opérations' | 'Équipement' | 'Lieux' | 'Nature humaine';
  priorite: 'Faible' | 'Moyenne' | 'Élevée';
  description: string;
  mots_cles: string[];
  secteur: string[];
  technologies: string[];
  implementation: Implementation;
  metrics: Metrics;

  // Champs existants conservés (optionnels pour rétrocompatibilité)
  criteria?: Criteria;
  score?: number;
  scianSectorId?: string;
  priority?: Project['priority'];

  // Référence marketplace (optionnel)
  marketstore_ref?: MarketstoreRef;

  // Cas d'usage et gouvernance (obligatoires)
  cas_usage_sectoriels: CasUsageSectoriel[];
  cybersecurite: Cybersecurite;
  gouvernance_ethique: GouvernanceEthique;
  indicateurs: Indicateurs;

  // 🆕 ENRICHISSEMENT COMPLET (optionnels pour migration progressive)
  conformite_reglementaire?: ConformiteReglementaire;
  classification_IA?: ClassificationIA;
  categorie_IRSST?: CategorieIRSST;
  secteurs_prioritaires_SCIAN?: SecteursScian;
  explicabilite_IA?: ExplicabiliteIA;
  niveaux_d_impact_SST?: NiveauxImpactSST;
  badges_conformite?: BadgesConformite;
  UX_profiles?: UXProfiles;

  // Métadonnées système
  compatibilite_systeme?: CompatibiliteSysteme;
  metadonnees_enrichissement?: MetadonneesEnrichissement;

  // Horodatage
  created?: string;
  updated?: string;
}

// ═══════════════════════════════════════════════════════════════
// TYPES UNION POUR COMPATIBILITÉ
// ═══════════════════════════════════════════════════════════════

/**
 * Type union pour compatibilité totale entre ancien et nouveau format
 */
export type IGNITIAProjectUnified = Project | IGNITIAProjectEnriched;

/**
 * Type pour validation du niveau d'enrichissement
 */
export type NiveauEnrichissement = 'Base' | 'Partiel' | 'Complet';

/**
 * Interface pour statistiques d'enrichissement
 */
export interface StatistiquesEnrichissement {
  total_projets: number;
  niveau_base: number;
  niveau_partiel: number;
  niveau_complet: number;
  pourcentage_enrichissement: number;
}

// ═══════════════════════════════════════════════════════════════
// EXPORT PAR DÉFAUT POUR RÉTROCOMPATIBILITÉ
// ═══════════════════════════════════════════════════════════════

export default IGNITIAProjectEnriched;