// src/types/project.ts

export interface Project {
  id: string;
  name: string;
  ideas: string[]; 
  scores: {
    impact: number;
    excellence: number;
    faisabilite: number;
    gouvernance: number;
    securite: number;
    acceptabilite: number;
    perennite: number;
  };
  score: number;              // score global calculé (ex. moyenne pondérée)
  scianSectorId: string | null;
  priority: {
    score: number;
    level: string;
  } | null;
  created_at?: string;
  updated_at?: string;
}
