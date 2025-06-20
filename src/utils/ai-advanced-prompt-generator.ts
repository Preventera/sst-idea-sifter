// Fichier: src/utils/ai-advanced-prompt-generator.ts
// Générateur de prompts avancés avec algorithme ELON et scoring automatique

import { SCIAN_SECTORS } from '@/data/scian-sectors';

export interface ElonCategory {
  equipement: string[];
  lieux: string[];
  operations: string[];
  natureHumaine: string[];
}

export interface AdvancedPromptConfig {
  motCle?: string;
  secteurId: string;
  contexteOrganisationnel?: {
    taille?: string;
    methodologies?: string[];
    risquesSpecifiques?: string[];
  };
  focusElon?: keyof ElonCategory;
  typeIA?: 'detection' | 'prediction' | 'optimisation' | 'automatisation';
}

// Mapping des risques par catégorie ELON
export const ELON_RISK_MAPPING: ElonCategory = {
  equipement: [
    'Défaillance machine', 'Maintenance prédictive', 'Usure équipement', 
    'Calibrage automatique', 'Surveillance état', 'Détection panne',
    'Optimisation performance', 'Sécurité machine'
  ],
  lieux: [
    'Conditions environnementales', 'Qualité air', 'Température', 
    'Humidité', 'Espaces confinés', 'Zones dangereuses',
    'Accessibilité', 'Évacuation urgence'
  ],
  operations: [
    'Processus dangereux', 'Procédures sécurité', 'Flux travail',
    'Coordination équipes', 'Timing opérations', 'Contrôle qualité',
    'Gestion ressources', 'Planning maintenance'
  ],
  natureHumaine: [
    'Comportements risque', 'Fatigue', 'Stress', 'Formation',
    'Compétences', 'Communication', 'Décisions', 'Erreur humaine'
  ]
};

// Algorithmes IA spécialisés par type de problème
export const AI_ALGORITHMS_BY_TYPE = {
  detection: {
    visual: ['CNN (Convolutional Neural Networks)', 'YOLO', 'ResNet', 'MobileNet'],
    sensor: ['Random Forest', 'SVM', 'Isolation Forest', 'LSTM'],
    behavioral: ['RNN', 'Transformer', 'LSTM', 'Hidden Markov Models']
  },
  prediction: {
    timeSeries: ['LSTM', 'GRU', 'Prophet', 'ARIMA-ML'],
    risk: ['Random Forest', 'XGBoost', 'Neural Networks', 'Ensemble Methods'],
    maintenance: ['Survival Analysis', 'Deep Learning', 'Bayesian Networks']
  },
  optimisation: {
    scheduling: ['Genetic Algorithms', 'Reinforcement Learning', 'Simulated Annealing'],
    resource: ['Linear Programming + ML', 'Multi-objective Optimization', 'Swarm Intelligence'],
    process: ['Process Mining + AI', 'Reinforcement Learning', 'Dynamic Programming']
  },
  automatisation: {
    workflow: ['Rule-based AI', 'Process Automation', 'Decision Trees'],
    monitoring: ['Stream Processing + ML', 'Real-time Analytics', 'Edge Computing AI'],
    response: ['Expert Systems', 'Fuzzy Logic', 'Automated Decision Making']
  }
};

/**
 * Génère un prompt contextualisé avec l'algorithme ELON
 */
export function generateAdvancedPrompt(config: AdvancedPromptConfig): string {
  const { motCle, secteurId, contexteOrganisationnel, focusElon, typeIA } = config;
  
  // Récupérer les informations du secteur
  const secteur = SCIAN_SECTORS.find(s => s.id === secteurId);
  const secteurNom = secteur?.name || 'secteur non spécifié';
  const risquesSectoriels = secteur?.statistics?.accidentCauses || [];
  const zonesPreventionCles = secteur?.statistics?.keyPreventionAreas || [];

  // Déterminer la catégorie ELON prioritaire
  let categorieElonSuggere = 'Équipement';
  if (focusElon) {
    const categorieMap = {
      equipement: 'Équipement',
      lieux: 'Lieux', 
      operations: 'Opérations',
      natureHumaine: 'Nature Humaine'
    };
    categorieElonSuggere = categorieMap[focusElon];
  }

  // Sélectionner les algorithmes appropriés
  const algorithmesSuggeres = typeIA ? AI_ALGORITHMS_BY_TYPE[typeIA] : {};
  const premiersAlgorithmes = Object.values(algorithmesSuggeres).flat().slice(0, 3);

  // Construire le contexte enrichi
  let contexteDetaille = `SECTEUR: ${secteurNom} (Code SCIAN: ${secteurId})`;
  
  if (risquesSectoriels.length > 0) {
    contexteDetaille += `\nRISQUES SECTORIELS PRIORITAIRES: ${risquesSectoriels.join(', ')}`;
  }
  
  if (zonesPreventionCles.length > 0) {
    contexteDetaille += `\nZONES DE PRÉVENTION CLÉS: ${zonesPreventionCles.join(', ')}`;
  }

  if (contexteOrganisationnel) {
    if (contexteOrganisationnel.taille) {
      contexteDetaille += `\nTAILLE ORGANISATION: ${contexteOrganisationnel.taille}`;
    }
    if (contexteOrganisationnel.methodologies?.length) {
      contexteDetaille += `\nMÉTHODOLOGIES SST UTILISÉES: ${contexteOrganisationnel.methodologies.slice(0, 3).join(', ')}`;
    }
    if (contexteOrganisationnel.risquesSpecifiques?.length) {
      contexteDetaille += `\nRISQUES SPÉCIFIQUES IDENTIFIÉS: ${contexteOrganisationnel.risquesSpecifiques.slice(0, 3).join(', ')}`;
    }
  }

  // Générer le prompt principal
  const prompt = `Tu es un expert HSE spécialisé dans l'application de l'intelligence artificielle pour la prévention des accidents et l'amélioration de la performance sécurité.

${contexteDetaille}

${motCle ? `FOCUS SUR: ${motCle}` : 'GÉNÉRATION LIBRE'}

Génère une étude de cas d'usage d'IA innovante et réalisable, en suivant EXACTEMENT cette structure:

**Étape 1 : Identification du problème**
- Dans le secteur ${secteurNom}, le principal risque concerne : [description spécifique du problème${motCle ? ` lié à ${motCle}` : ''}].
- Ce problème entraîne [impact précis en termes de sécurité, coûts, opérations] avec des conséquences mesurables.

**Étape 2 : Applicabilité de l'IA**
- Explique comment des techniques IA comme ${premiersAlgorithmes.length > 0 ? `[${premiersAlgorithmes.join(', ')}]` : '[Machine Learning, Computer Vision, NLP]'} peuvent être utilisées pour résoudre ce problème spécifique.
- Met en évidence la valeur ajoutée de l'IA pour la prévention proactive dans ce contexte sectoriel.

**Étape 3 : Conception de la solution**
- Propose une architecture IA intégrant [type de modèle approprié] pour [objectif prédictif ou de détection spécifique].
- Détaille les modules clés : alertes en temps réel, tableaux de bord HSE, interfaces mobiles, intégrations systèmes.

**Étape 4 : Données nécessaires**
- Liste les sources de données spécifiques au secteur : historiques d'incidents, logs machines, vidéos surveillance, capteurs environnementaux, données RH.
- Décris le processus de nettoyage, structuration et labellisation des données pour ce cas d'usage.

**Étape 5 : Développement du modèle**
- Sélectionne l'algorithme optimal parmi ${premiersAlgorithmes.length > 0 ? `[${premiersAlgorithmes.join(', ')}]` : '[Random Forest, CNN, LSTM, XGBoost]'} en fonction du type de données et de l'objectif.
- Décris les métriques de performance spécifiques (précision, rappel, F1-score) et comment tester rigoureusement le modèle.

**Étape 6 : Intégration dans le système HSE**
- Comment intégrer ce système à l'environnement existant : ERP, plateforme sécurité, applications mobiles, systèmes de surveillance.
- Formation des utilisateurs adaptée : superviseurs, responsables sécurité, techniciens, opérateurs terrain.

**Étape 7 : Évaluation continue**
- Métriques de succès quantifiables : réduction % des incidents, taux d'alerte pertinente, diminution temps de réaction.
- Stratégie d'amélioration continue avec feedback utilisateurs, nouvelles données et adaptation sectorielle.

**Étape 8 : Catégorie ELON**
- Catégorie prioritaire : [${categorieElonSuggere}] - Justifie pourquoi cette catégorie est la plus appropriée pour ce projet dans le contexte du secteur ${secteurNom}.
- Explique l'impact spécifique sur cette dimension et les bénéfices attendus.

IMPORTANT: 
- Sois très spécifique au secteur ${secteurNom}
- Utilise les risques sectoriels mentionnés ci-dessus
- Propose une solution réellement innovante et applicable
- Assure-toi que chaque étape est cohérente avec les précédentes`;

  return prompt;
}

/**
 * Génère automatiquement des scores basés sur le prompt généré
 */
export function predictScoresFromPrompt(generatedContent: string, sectorId: string): {
  impact: number;
  excellence: number;
  faisabilite: number;
  gouvernance: number;
  securite: number;
  acceptabilite: number;
  perennite: number;
} {
  const text = generatedContent.toLowerCase();
  const scores = { impact: 5, excellence: 5, faisabilite: 5, gouvernance: 5, securite: 5, acceptabilite: 5, perennite: 5 };

  // Analyse d'impact basée sur les mots-clés de sécurité
  const impactKeywords = ['réduction accidents', 'prévention', 'sauver vies', 'éliminer risques', 'mortalité', 'incidents graves'];
  const impactScore = impactKeywords.filter(kw => text.includes(kw)).length;
  scores.impact = Math.min(10, 5 + impactScore * 1.5);

  // Excellence basée sur sophistication technique
  const excellenceKeywords = ['machine learning', 'deep learning', 'cnn', 'lstm', 'algorithmes avancés', 'innovation'];
  const excellenceScore = excellenceKeywords.filter(kw => text.includes(kw)).length;
  scores.excellence = Math.min(10, 4 + excellenceScore * 1.2);

  // Faisabilité basée sur complexité mentionnée
  const complexiteKeywords = ['complexe', 'difficile', 'avancé', 'sophistiqué'];
  const facilitéKeywords = ['simple', 'facile', 'existant', 'éprouvé'];
  const complexiteScore = complexiteKeywords.filter(kw => text.includes(kw)).length;
  const facilitéScore = facilitéKeywords.filter(kw => text.includes(kw)).length;
  scores.faisabilite = Math.max(1, Math.min(10, 6 + facilitéScore - complexiteScore));

  // Gouvernance basée sur conformité mentionnée
  const gouvernanceKeywords = ['conformité', 'réglementaire', 'audit', 'iso', 'cnesst', 'traçabilité'];
  const gouvernanceScore = gouvernanceKeywords.filter(kw => text.includes(kw)).length;
  scores.gouvernance = Math.min(10, 4 + gouvernanceScore * 1.5);

  // Sécurité basée sur protection des données
  const securiteKeywords = ['sécurité', 'protection', 'chiffrement', 'authentification', 'cybersécurité'];
  const securiteScore = securiteKeywords.filter(kw => text.includes(kw)).length;
  scores.securite = Math.min(10, 4 + securiteScore * 1.3);

  // Acceptabilité basée sur facilité d'adoption
  const acceptabiliteKeywords = ['interface intuitive', 'formation', 'adoption', 'utilisateur', 'ergonomique'];
  const acceptabiliteScore = acceptabiliteKeywords.filter(kw => text.includes(kw)).length;
  scores.acceptabilite = Math.min(10, 4 + acceptabiliteScore * 1.4);

  // Pérennité basée sur durabilité
  const perenniteKeywords = ['durable', 'évolutif', 'maintenable', 'long terme', 'évolutivité'];
  const perenniteScore = perenniteKeywords.filter(kw => text.includes(kw)).length;
  scores.perennite = Math.min(10, 4 + perenniteScore * 1.6);

  // Ajustements spécifiques par secteur
  if (sectorId === '23') { // Construction
    scores.impact += 1; // Impact généralement élevé en construction
    scores.faisabilite -= 1; // Plus de défis d'implémentation sur chantiers
  } else if (sectorId === '62') { // Soins de santé
    scores.gouvernance += 1; // Secteur très réglementé
    scores.securite += 1; // Protection données patients cruciale
  }

  // Normaliser tous les scores entre 1 et 10
  Object.keys(scores).forEach(key => {
    scores[key as keyof typeof scores] = Math.max(1, Math.min(10, Math.round(scores[key as keyof typeof scores])));
  });

  return scores;
}