
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
}
