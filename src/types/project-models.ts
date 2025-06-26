// src/types/project-models.ts
// Interface TypeScript optimisée pour IGNITIA - Compatible avec votre structure existante

import { Project } from "../types/project";

export interface MarketstoreRef {
  url: string;
  marketstore_id: string;
  date_import: string;
  synchronisation: 'auto' | 'manual';
  statut: 'synced' | 'pending' | 'error';
}

export interface CasUsageSectoriel {
  titre: string;
  description: string;
  reference: string;
}

export interface Cybersecurite {
  donnees_sensibles: boolean;
  mesures: string[];
  conformite: string[];
}

export interface GouvernanceEthique {
  transparence: string;
  equite: string;
  responsabilite: string;
  protection_donnees: string;
  conformite: string[];
  audit: string;
  recours: string;
}

export interface Indicateurs {
  conformite_loi_25: boolean;
  audit_biais_valide: boolean;
  explicabilite_activee: boolean;
}

// Interface enrichie compatible avec votre Project existant
export interface IGNITIAProjectEnriched extends Omit<Project, 'id'> {
  project_id: string;
  marketstore_ref?: MarketstoreRef;
  mots_cles: string[];
  cas_usage_sectoriels: CasUsageSectoriel[];
  cybersecurite: Cybersecurite;
  gouvernance_ethique: GouvernanceEthique;
  indicateurs: Indicateurs;
}

// Interface légère pour les nouveaux modèles JSON
export interface IGNITIAModelJSON {
  project_id: string;
  marketstore_ref?: MarketstoreRef;
  nom: string;
  niveau: 'Débutant' | 'Intermédiaire' | 'Avancé';
  contexte: 'Opérations' | 'Équipement' | 'Lieux' | 'Nature humaine';
  priorite: 'Faible' | 'Moyenne' | 'Élevée';
  description: string;
  mots_cles: string[];
  secteur: string[];
  technologies: string[];
  implementation: {
    technologies: string[];
    prerequisites: string[];
    steps: string[];
  };
  metrics: {
    views: number;
    usage: number;
    rating: number;
  };
  cas_usage_sectoriels: CasUsageSectoriel[];
  cybersecurite: Cybersecurite;
  gouvernance_ethique: GouvernanceEthique;
  indicateurs: Indicateurs;
  created?: string;
  updated?: string;
}

// Type union pour compatibilité totale
export type IGNITIAProjectUnified = Project | IGNITIAModelJSON;