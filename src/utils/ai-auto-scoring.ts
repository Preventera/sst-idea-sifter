// Fichier: src/utils/ai-auto-scoring.ts
// Système d'auto-évaluation des critères par IA

export interface ProjectCriteria {
  impact: number;           // 1-10: Réduction des risques accidents/maladies
  excellence: number;       // 1-10: Qualité technique/innovation
  faisabilite: number;      // 1-10: Facilité d'implémentation
  gouvernance: number;      // 1-10: Conformité réglementaire
  securite: number;         // 1-10: Protection données/cybersécurité
  acceptabilite: number;    // 1-10: Adoption utilisateurs
  perennite: number;        // 1-10: Durabilité long terme
}

export interface AutoScoringResult {
  criteria: ProjectCriteria;
  justifications: {
    [key: string]: string;
  };
  confidence: number; // 1-10
  method: 'keyword' | 'ai';
}

// Mots-clés pour l'analyse rapide par critère
const CRITERIA_KEYWORDS = {
  impact: [
    'accident', 'blessure', 'décès', 'mortalité', 'morbidité', 'risque',
    'sécurité', 'prévention', 'protection', 'chute', 'collision', 'exposition',
    'ergonomie', 'troubles musculosquelettiques', 'stress', 'fatigue'
  ],
  excellence: [
    'intelligence artificielle', 'ia', 'machine learning', 'deep learning',
    'algorithme', 'capteur', 'iot', 'innovation', 'technologie', 'recherche',
    'développement', 'prototype', 'brevets', 'publications', 'validation'
  ],
  faisabilite: [
    'simple', 'facile', 'rapide', 'économique', 'accessible', 'modulaire',
    'scalable', 'compatible', 'intégration', 'formation', 'adoption',
    'coût', 'budget', 'délai', 'ressources', 'expertise'
  ],
  gouvernance: [
    'réglementation', 'norme', 'iso', 'ohsas', 'cnesst', 'inspection',
    'conformité', 'audit', 'certification', 'documentation', 'procédure',
    'politique', 'directive', 'loi', 'obligation', 'responsabilité'
  ],
  securite: [
    'cybersécurité', 'protection', 'données', 'confidentialité', 'chiffrement',
    'authentification', 'autorisation', 'accès', 'sauvegarde', 'backup',
    'RGPD', 'privacy', 'sécurisation', 'vulnérabilité', 'intrusion'
  ],
  acceptabilite: [
    'utilisateur', 'adoption', 'formation', 'interface', 'ergonomie',
    'intuitive', 'simple', 'acceptation', 'résistance', 'changement',
    'communication', 'accompagnement', 'sensibilisation', 'motivation'
  ],
  perennite: [
    'durable', 'pérenne', 'long terme', 'maintenance', 'évolution',
    'mise à jour', 'support', 'documentation', 'transfert', 'autonomie',
    'viabilité', 'roi', 'retour investissement', 'bénéfice', 'économie'
  ]
};

// Analyse rapide par mots-clés
export const analyzeByKeywords = (projectName: string, projectDescription: string): AutoScoringResult => {
  const fullText = `${projectName} ${projectDescription}`.toLowerCase();
  const criteria: ProjectCriteria = {
    impact: 5,
    excellence: 5,
    faisabilite: 5,
    gouvernance: 5,
    securite: 5,
    acceptabilite: 5,
    perennite: 5
  };

  const justifications: { [key: string]: string } = {};

  // Analyser chaque critère
  Object.entries(CRITERIA_KEYWORDS).forEach(([criterion, keywords]) => {
    let matchCount = 0;
    const foundKeywords: string[] = [];

    keywords.forEach(keyword => {
      if (fullText.includes(keyword)) {
        matchCount++;
        foundKeywords.push(keyword);
      }
    });

    // Calculer le score basé sur le nombre de correspondances
    const baseScore = 5; // Score de base
    const bonus = Math.min(matchCount * 0.8, 4); // Max +4 points
    const finalScore = Math.min(Math.round(baseScore + bonus), 10);

    criteria[criterion as keyof ProjectCriteria] = finalScore;

    // Générer justification
    if (foundKeywords.length > 0) {
      justifications[criterion] = `Score ${finalScore}/10 - Mots-clés détectés: ${foundKeywords.slice(0, 3).join(', ')}${foundKeywords.length > 3 ? '...' : ''}`;
    } else {
      justifications[criterion] = `Score ${finalScore}/10 - Aucun mot-clé spécifique détecté pour ce critère`;
    }
  });

  // Calculer la confiance basée sur le nombre total de mots-clés trouvés
  const totalKeywords = Object.values(justifications).join(' ').split('détectés:').length - 1;
  const confidence = Math.min(5 + totalKeywords, 9); // Entre 5 et 9

  return {
    criteria,
    justifications,
    confidence,
    method: 'keyword'
  };
};

// Analyse IA avancée (simulation - à remplacer par un vrai appel IA)
export const analyzeByAI = async (
  projectName: string, 
  projectDescription: string,
  scianSector?: string
): Promise<AutoScoringResult> => {
  // Simulation d'un délai d'API
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Analyse contextuelle basée sur le secteur SCIAN
  const sectorContext = scianSector || 'générique';
  
  // Logique d'analyse intelligente (simulation)
  const criteria: ProjectCriteria = {
    impact: assessImpact(projectName, projectDescription, sectorContext),
    excellence: assessExcellence(projectName, projectDescription),
    faisabilite: assessFeasibility(projectName, projectDescription),
    gouvernance: assessGovernance(projectName, projectDescription, sectorContext),
    securite: assessSecurity(projectName, projectDescription),
    acceptabilite: assessAcceptability(projectName, projectDescription),
    perennite: assessSustainability(projectName, projectDescription)
  };

  const justifications = generateAIJustifications(criteria, projectName, sectorContext);

  return {
    criteria,
    justifications,
    confidence: 8, // Confiance élevée pour l'IA
    method: 'ai'
  };
};

// Fonctions d'évaluation spécialisées
const assessImpact = (name: string, description: string, sector: string): number => {
  const text = `${name} ${description}`.toLowerCase();
  let score = 5;

  // Impact élevé pour la sécurité
  if (text.includes('sécurité') || text.includes('prévention') || text.includes('accident')) score += 2;
  if (text.includes('ia') || text.includes('intelligence artificielle')) score += 1;
  if (text.includes('temps réel') || text.includes('detection')) score += 1;
  
  // Bonus selon le secteur
  if (sector.includes('Construction') && text.includes('chute')) score += 1;
  if (sector.includes('Manufacturier') && text.includes('machine')) score += 1;

  return Math.min(score, 10);
};

const assessExcellence = (name: string, description: string): number => {
  const text = `${name} ${description}`.toLowerCase();
  let score = 5;

  if (text.includes('ia') || text.includes('intelligence artificielle')) score += 2;
  if (text.includes('machine learning') || text.includes('deep learning')) score += 2;
  if (text.includes('algorithme') || text.includes('capteur')) score += 1;
  if (text.includes('innovation') || text.includes('avancé')) score += 1;

  return Math.min(score, 10);
};

const assessFeasibility = (name: string, description: string): number => {
  const text = `${name} ${description}`.toLowerCase();
  let score = 6; // Légèrement optimiste par défaut

  if (text.includes('simple') || text.includes('facile')) score += 1;
  if (text.includes('existant') || text.includes('disponible')) score += 1;
  if (text.includes('complexe') || text.includes('difficile')) score -= 2;
  if (text.includes('recherche') || text.includes('développement')) score -= 1;

  return Math.max(Math.min(score, 10), 1);
};

const assessGovernance = (name: string, description: string, sector: string): number => {
  const text = `${name} ${description}`.toLowerCase();
  let score = 5;

  if (text.includes('norme') || text.includes('réglementation')) score += 2;
  if (text.includes('conformité') || text.includes('audit')) score += 1;
  if (text.includes('iso') || text.includes('cnesst')) score += 1;
  
  // Secteurs plus réglementés
  if (sector.includes('Construction') || sector.includes('Manufacturier')) score += 1;

  return Math.min(score, 10);
};

const assessSecurity = (name: string, description: string): number => {
  const text = `${name} ${description}`.toLowerCase();
  let score = 5;

  if (text.includes('sécurité') || text.includes('protection')) score += 1;
  if (text.includes('données') || text.includes('confidentialité')) score += 1;
  if (text.includes('chiffrement') || text.includes('authentification')) score += 2;
  if (text.includes('cloud') || text.includes('internet')) score -= 1; // Risque accru

  return Math.max(Math.min(score, 10), 1);
};

const assessAcceptability = (name: string, description: string): number => {
  const text = `${name} ${description}`.toLowerCase();
  let score = 6; // Légèrement optimiste

  if (text.includes('simple') || text.includes('intuitive')) score += 2;
  if (text.includes('formation') || text.includes('accompagnement')) score += 1;
  if (text.includes('automatique') || text.includes('transparent')) score += 1;
  if (text.includes('changement') || text.includes('nouvelle')) score -= 1;

  return Math.max(Math.min(score, 10), 1);
};

const assessSustainability = (name: string, description: string): number => {
  const text = `${name} ${description}`.toLowerCase();
  let score = 6;

  if (text.includes('durable') || text.includes('pérenne')) score += 2;
  if (text.includes('maintenance') || text.includes('évolution')) score += 1;
  if (text.includes('roi') || text.includes('économie')) score += 1;
  if (text.includes('prototype') || text.includes('test')) score -= 1;

  return Math.max(Math.min(score, 10), 1);
};

const generateAIJustifications = (criteria: ProjectCriteria, projectName: string, sector: string) => {
  return {
    impact: `Score ${criteria.impact}/10 - Analyse IA: Potentiel d'impact significatif sur la sécurité dans le secteur ${sector}`,
    excellence: `Score ${criteria.excellence}/10 - Analyse IA: Niveau d'innovation technologique évalué selon les standards actuels`,
    faisabilite: `Score ${criteria.faisabilite}/10 - Analyse IA: Faisabilité technique et organisationnelle du projet "${projectName}"`,
    gouvernance: `Score ${criteria.gouvernance}/10 - Analyse IA: Conformité réglementaire prévisible pour le secteur ${sector}`,
    securite: `Score ${criteria.securite}/10 - Analyse IA: Niveau de sécurité des données et cybersécurité`,
    acceptabilite: `Score ${criteria.acceptabilite}/10 - Analyse IA: Probabilité d'adoption par les utilisateurs finaux`,
    perennite: `Score ${criteria.perennite}/10 - Analyse IA: Durabilité et viabilité économique long terme`
  };
};

// Fonction principale d'auto-scoring
export const performAutoScoring = async (
  projectName: string,
  projectDescription: string,
  scianSector?: string,
  useAI: boolean = true
): Promise<AutoScoringResult> => {
  if (!projectName.trim() && !projectDescription.trim()) {
    throw new Error('Le nom du projet ou la description doivent être renseignés pour l\'auto-évaluation');
  }

  if (useAI) {
    return await analyzeByAI(projectName, projectDescription, scianSector);
  } else {
    return analyzeByKeywords(projectName, projectDescription);
  }
};