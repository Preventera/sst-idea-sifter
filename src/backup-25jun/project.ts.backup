
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
  scianSectorId?: string; // L'ID du secteur SCIAN (optionnel)
  priority?: {
    score: number;     // Score calculé selon les critères du secteur
    level: 'high' | 'medium' | 'low';  // Niveau de priorité
    details?: {
      conformiteLSST: number;
      mortalityImpact: number;
      sectorPrevalence: number;
      aiPreventivePotential: number;
      legislationCompliance: number;
      dataAvailability: number;
      implementationDelay: number;
    }; // Détails des scores par critère
  };
}
