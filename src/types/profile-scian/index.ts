// Types pour les données de l'entreprise
export interface CompanyData {
  name: string;
  scianCode: string;
  sector: string;
  size: string;
  address: string;
  phone: string;
  email: string;
}

// Type pour un acteur (personne)
export interface Actor {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
  certifications?: string[];
}

// Types pour les politiques HSE
export interface HSEPolicies {
  hasWrittenPolicy: boolean;
  lastReview: string;
  complianceFramework: string[];
}

// Types pour le système de gestion SST
export interface SSTManagementSystem {
  hasImplementedSystem: boolean;
  systemType: string;
  certifications: string[];
  lastAudit: string;
  systemComponents: string[];
}

// Types pour le contexte organisationnel
export interface OrganizationalContext {
  workOrganization: string;
  shiftPatterns: string[];
  subcontractingLevel: string;
  workforceStability: string;
  safetyClimate: string;
  communicationMethods: string[];
  decisionMakingProcess: string;
  changeManagement: string;
}

// Types pour le profil de risque
export interface RiskProfile {
  primaryRisks: string[];
  riskLevel: string;
  previousIncidents: boolean;
  organizationalContext: OrganizationalContext;
  specificSectorRisks: string[];
}

// Type pour l'ensemble du profil SCIAN
export interface ProfileScianData {
  company: CompanyData;
  actors: Actor[];
  sstCommittee: Actor[];
  cossMembers: Actor[];
  cstcMembers: Actor[];
  management: Actor[];
  hsePolicies: HSEPolicies;
  sstManagementSystem: SSTManagementSystem;
  riskProfile: RiskProfile;
}