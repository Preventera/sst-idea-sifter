
export interface Criteria {
  impact: number;
  confiance: number;
  facilite: number;
  acceptabilite: number;
  valeurReglementaire: number;
  alignementEthique: number;
}

export interface Project {
  id: string;
  name: string;
  criteria: Criteria;
  score: number;
}
