// src/types/project.ts
// Interface harmonisée pour tout le projet IGNITIA

export interface Project {
  id: string;
  name: string;
  ideas: string[];
  scores: {
    // ✅ NOMS HARMONISÉS avec le reste du projet
    technicalFeasibility: number;    // au lieu de faisabilite
    businessValue: number;           // au lieu de excellence  
    riskReduction: number;           // au lieu de impact
    implementationCost: number;      // nouveau
    timeToMarket: number;            // nouveau
    stakeholderSupport: number;      // au lieu de acceptabilite
    regulatoryCompliance: number;    // au lieu de gouvernance
  };
  score: number;                     // score global calculé
  scianSectorId: string | null;
  priority: {
    score: number;
    level: string;
  } | null;
  created_at?: string;
  updated_at?: string;
}

// ✅ ALIAS pour compatibilité avec les anciens fichiers
export interface Criteria {
  technicalFeasibility: number;
  businessValue: number;
  riskReduction: number;
  implementationCost: number;
  timeToMarket: number;
  stakeholderSupport: number;
  regulatoryCompliance: number;
}

// ✅ INTERFACE pour les anciens formats (templates, etc.)
export interface ProjectCriteria {
  impact: number;
  excellence: number;
  faisabilite: number;
  gouvernance: number;
  securite: number;
  acceptabilite: number;
  perennite: number;
}

// ✅ INTERFACE pour ProjectFormPage (ce que Supabase attend)
export interface ProjectData {
  id: string;
  name: string;
  description: string;
  sector: string;
  scores: {
    technicalFeasibility: number;
    businessValue: number;
    riskReduction: number;
    implementationCost: number;
    timeToMarket: number;
    stakeholderSupport: number;
    regulatoryCompliance: number;
  };
  score: number;
  priority: string;
}

// ✅ FONCTION DE MAPPING pour conversion entre formats
export const mapCriteriaToScores = (criteria: ProjectCriteria): Criteria => {
  return {
    technicalFeasibility: criteria.faisabilite,
    businessValue: criteria.excellence,
    riskReduction: criteria.impact,
    implementationCost: 11 - criteria.faisabilite, // Inversé
    timeToMarket: criteria.faisabilite,
    stakeholderSupport: criteria.acceptabilite,
    regulatoryCompliance: criteria.gouvernance
  };
};

// ✅ FONCTION DE MAPPING pour Supabase
export const mapProjectDataToSupabase = (projectData: ProjectData) => {
  return {
    id: projectData.id,
    title: projectData.name,
    ideas: [projectData.description],
    scores: {
      impact: projectData.scores.riskReduction,
      excellence: projectData.scores.businessValue,
      faisabilite: projectData.scores.technicalFeasibility,
      gouvernance: projectData.scores.regulatoryCompliance,
      securite: projectData.scores.riskReduction,
      acceptabilite: projectData.scores.stakeholderSupport,
      perennite: Math.round((projectData.scores.timeToMarket + projectData.scores.businessValue) / 2)
    },
    scianSectorId: projectData.sector,
    priority: projectData.priority,
    created_at: new Date().toISOString()
  };
};

export default Project;