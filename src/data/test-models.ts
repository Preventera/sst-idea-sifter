// src/data/test-models.ts
// 10 modèles de test optimisés pour IGNITIA - Format JSON enrichi

import { IGNITIAModelJSON } from '../types/project-models';

export const testModelsJSON: IGNITIAModelJSON[] = [
  {
    project_id: "GenAISafety-EPI-001",
    marketstore_ref: {
      url: "https://www.genaisafety.online/product/genaisafety-epi-001",
      marketstore_id: "genaisafety-epi-001",
      date_import: "2025-06-25",
      synchronisation: "auto",
      statut: "synced"
    },
    nom: "Détection automatique des EPI sur chantiers",
    niveau: "Débutant",
    contexte: "Opérations",
    priorite: "Moyenne",
    description: "Vision IA pour assurer le port conforme des équipements de protection individuelle (casques, harnais, gants) sur les sites de construction.",
    mots_cles: ["Sécurité", "Vision", "Conformité", "Construction"],
    secteur: ["Construction"],
    technologies: ["Vision par ordinateur", "Reconnaissance d'objets", "Apprentissage supervisé"],
    implementation: {
      technologies: ["Caméras intelligentes", "API de vision IA", "Serveur cloud sécurisé"],
      prerequisites: ["Flux vidéo sur site", "Catalogue EPI normé"],
      steps: [
        "Installation des capteurs caméra sur les zones critiques",
        "Formation du modèle IA sur les types d'EPI à reconnaître",
        "Configuration du tableau de bord de supervision"
      ]
    },
    metrics: {
      views: 1428,
      usage: 84,
      rating: 4.2
    },
    cas_usage_sectoriels: [
      {
        titre: "Détection automatisée des EPI sur site",
        description: "Analyse temps réel des flux vidéo pour repérer les non-conformités.",
        reference: "Étude CNESST 2024 sur IA et conformité EPI"
      }
    ],
    cybersecurite: {
      donnees_sensibles: true,
      mesures: ["Chiffrement AES-256", "Contrôle d'accès MFA", "Audit régulier des logs"],
      conformite: ["Loi 25", "ISO 27001"]
    },
    gouvernance_ethique: {
      transparence: "Code source du modèle IA disponible pour audit interne.",
      equite: "Aucune discrimination possible liée à l'apparence physique.",
      responsabilite: "Les alertes critiques sont validées par un humain.",
      protection_donnees: "Politique de conservation limitée à 6 mois.",
      conformite: ["CNESST", "Loi 25", "ISO 45001"],
      audit: "Contrôle annuel CNESST sur données et modèles IA.",
      recours: "Formulaire de signalement accessible depuis le tableau de bord."
    },
    indicateurs: {
      conformite_loi_25: true,
      audit_biais_valide: true,
      explicabilite_activee: true
    }
  },
  {
    project_id: "GenAISafety-MAINT-002",
    nom: "Maintenance prédictive des équipements industriels",
    niveau: "Intermédiaire",
    contexte: "Équipement",
    priorite: "Élevée",
    description: "IA pour prédire les pannes d'équipements critiques en analysant vibrations, température et historique de maintenance.",
    mots_cles: ["Maintenance", "Prédiction", "IoT", "Équipement"],
    secteur: ["Manufacturing", "Énergie"],
    technologies: ["Machine Learning", "Analyse de signaux", "IoT"],
    implementation: {
      technologies: ["Capteurs IoT", "Modèles de régression", "Dashboard temps réel"],
      prerequisites: ["Historique de pannes", "Capteurs installés", "Infrastructure cloud"],
      steps: [
        "Installation des capteurs IoT sur équipements critiques",
        "Collecte et préparation des données historiques",
        "Entraînement du modèle de prédiction"
      ]
    },
    metrics: {
      views: 2156,
      usage: 127,
      rating: 4.5
    },
    cas_usage_sectoriels: [
      {
        titre: "Prédiction de pannes sur lignes de production",
        description: "Réduction de 40% des arrêts non planifiés grâce à la maintenance prédictive IA.",
        reference: "Rapport industrie 4.0 - Maintenance prédictive 2024"
      }
    ],
    cybersecurite: {
      donnees_sensibles: true,
      mesures: ["Chiffrement bout en bout", "Réseau segmenté", "Authentification multi-facteurs"],
      conformite: ["Loi 25", "ISO 27001", "IEC 62443"]
    },
    gouvernance_ethique: {
      transparence: "Algorithmes de prédiction explicables et auditables.",
      equite: "Pas de biais dans l'analyse des données techniques.",
      responsabilite: "Décisions de maintenance validées par techniciens qualifiés.",
      protection_donnees: "Données anonymisées, conservation 2 ans maximum.",
      conformite: ["CNESST", "Loi 25", "ISO 45001"],
      audit: "Audit semestriel des algorithmes de prédiction.",
      recours: "Canal de révision des alertes de maintenance."
    },
    indicateurs: {
      conformite_loi_25: true,
      audit_biais_valide: true,
      explicabilite_activee: true
    }
  },
  {
    project_id: "GenAISafety-FATIGUE-003",
    nom: "Détection de fatigue des opérateurs",
    niveau: "Avancé",
    contexte: "Nature humaine",
    priorite: "Élevée",
    description: "Analyse comportementale IA pour détecter les signes de fatigue et alerter avant les incidents liés à la somnolence.",
    mots_cles: ["Fatigue", "Comportement", "Sécurité", "Analyse vidéo"],
    secteur: ["Transport", "Manufacturing", "Énergie"],
    technologies: ["Computer Vision", "Analyse comportementale", "Deep Learning"],
    implementation: {
      technologies: ["Caméras haute résolution", "Modèles CNN", "Système d'alertes"],
      prerequisites: ["Consentement opérateurs", "Protocoles éthiques", "Formation équipes"],
      steps: [
        "Définition du protocole éthique et consentement",
        "Installation discrète des systèmes de vision",
        "Entraînement des modèles de détection de fatigue"
      ]
    },
    metrics: {
      views: 3421,
      usage: 89,
      rating: 4.7
    },
    cas_usage_sectoriels: [
      {
        titre: "Prévention accidents liés à la fatigue",
        description: "Réduction de 60% des incidents causés par la somnolence en milieu industriel.",
        reference: "Étude longitudinale IRSST 2024 - Fatigue et sécurité"
      }
    ],
    cybersecurite: {
      donnees_sensibles: true,
      mesures: ["Chiffrement AES-256", "Accès restreint", "Logs d'audit complets"],
      conformite: ["Loi 25", "RGPD", "ISO 27001"]
    },
    gouvernance_ethique: {
      transparence: "Algorithmes transparents, consentement éclairé obligatoire.",
      equite: "Algorithmes testés contre tous biais discriminatoires.",
      responsabilite: "Supervision humaine obligatoire, pas de décision automatisée.",
      protection_donnees: "Données biométriques anonymisées, conservation 30 jours max.",
      conformite: ["CNESST", "Loi 25", "Charte des droits", "ISO 45001"],
      audit: "Audit trimestriel par comité éthique indépendant.",
      recours: "Droit d'opposition, révision immédiate des alertes."
    },
    indicateurs: {
      conformite_loi_25: true,
      audit_biais_valide: true,
      explicabilite_activee: true
    }
  },
  {
    project_id: "GenAISafety-ENV-004",
    nom: "Surveillance qualité de l'air par IoT",
    niveau: "Intermédiaire",
    contexte: "Lieux",
    priorite: "Moyenne",
    description: "Réseau de capteurs intelligents pour surveiller la qualité de l'air et alerter en cas de dépassement des seuils réglementaires.",
    mots_cles: ["Qualité air", "IoT", "Environnement", "Capteurs"],
    secteur: ["Manufacturing", "Construction", "Mines"],
    technologies: ["IoT", "Analyse de données", "Machine Learning"],
    implementation: {
      technologies: ["Capteurs multi-gaz", "Gateway IoT", "Plateforme cloud"],
      prerequisites: ["Cartographie des zones", "Seuils réglementaires", "Infrastructure réseau"],
      steps: [
        "Mapping des zones à surveiller",
        "Installation du réseau de capteurs IoT",
        "Configuration des seuils d'alerte"
      ]
    },
    metrics: {
      views: 1876,
      usage: 156,
      rating: 4.3
    },
    cas_usage_sectoriels: [
      {
        titre: "Surveillance continue des polluants",
        description: "Détection précoce des pics de concentration en particules fines et gaz toxiques.",
        reference: "Normes CNESST - Surveillance de l'exposition professionnelle"
      }
    ],
    cybersecurite: {
      donnees_sensibles: false,
      mesures: ["Chiffrement des communications", "Authentification des capteurs"],
      conformite: ["Loi 25", "ISO 27001"]
    },
    gouvernance_ethique: {
      transparence: "Données de qualité d'air accessibles en temps réel.",
      equite: "Surveillance équitable de tous les espaces de travail.",
      responsabilite: "Alertes automatiques avec protocoles d'intervention.",
      protection_donnees: "Données environnementales anonymes.",
      conformite: ["CNESST", "Environnement Canada"],
      audit: "Calibration annuelle des capteurs.",
      recours: "Vérification manuelle possible à tout moment."
    },
    indicateurs: {
      conformite_loi_25: true,
      audit_biais_valide: true,
      explicabilite_activee: true
    }
  },
  {
    project_id: "GenAISafety-FORM-005",
    nom: "Formation adaptative en sécurité IA",
    niveau: "Avancé",
    contexte: "Nature humaine",
    priorite: "Élevée",
    description: "Plateforme IA pour personnaliser les formations sécurité selon le profil, l'expérience et les risques spécifiques de chaque employé.",
    mots_cles: ["Formation", "Personnalisation", "IA adaptative", "Apprentissage"],
    secteur: ["Tous secteurs"],
    technologies: ["IA adaptative", "NLP", "Analyse comportementale"],
    implementation: {
      technologies: ["Plateforme e-learning", "Moteur de recommandation", "Analytics avancés"],
      prerequisites: ["Profils employés", "Contenus formation", "Historique incidents"],
      steps: [
        "Analyse des profils et besoins individuels",
        "Développement du moteur de personnalisation",
        "Création de contenus adaptatifs"
      ]
    },
    metrics: {
      views: 2891,
      usage: 203,
      rating: 4.6
    },
    cas_usage_sectoriels: [
      {
        titre: "Formation personnalisée par IA",
        description: "Amélioration de 45% de la rétention des connaissances sécurité grâce à l'adaptation IA.",
        reference: "Étude efficacité formation - IRSST 2024"
      }
    ],
    cybersecurite: {
      donnees_sensibles: true,
      mesures: ["Chiffrement des profils", "Accès contrôlé", "Audit des apprentissages"],
      conformite: ["Loi 25", "RGPD", "ISO 27001"]
    },
    gouvernance_ethique: {
      transparence: "Algorithmes de personnalisation explicables.",
      equite: "Égalité d'accès à la formation pour tous.",
      responsabilite: "Formateurs humains supervisent le processus.",
      protection_donnees: "Données d'apprentissage anonymisées.",
      conformite: ["CNESST", "Loi 25", "ISO 45001"],
      audit: "Évaluation annuelle de l'efficacité pédagogique.",
      recours: "Possibilité de formation traditionnelle en option."
    },
    indicateurs: {
      conformite_loi_25: true,
      audit_biais_valide: true,
      explicabilite_activee: true
    }
  },
  {
    project_id: "GenAISafety-RISK-006",
    nom: "Évaluation automatisée des risques par IA",
    niveau: "Avancé",
    contexte: "Opérations",
    priorite: "Élevée",
    description: "Système d'IA pour évaluer automatiquement les risques de nouvelles procédures ou équipements avant leur mise en service.",
    mots_cles: ["Évaluation risques", "IA", "Procédures", "Prévention"],
    secteur: ["Tous secteurs"],
    technologies: ["IA prédictive", "Analyse de données", "Modélisation"],
    implementation: {
      technologies: ["Moteur d'analyse IA", "Base de données risques", "Interface d'évaluation"],
      prerequisites: ["Historique incidents", "Normes sécurité", "Expertise métier"],
      steps: [
        "Constitution de la base de données risques",
        "Développement des algorithmes d'évaluation",
        "Interface utilisateur pour saisie procédures"
      ]
    },
    metrics: {
      views: 3156,
      usage: 178,
      rating: 4.8
    },
    cas_usage_sectoriels: [
      {
        titre: "Évaluation automatisée avant mise en service",
        description: "Identification de 85% des risques potentiels avant implémentation de nouvelles procédures.",
        reference: "Validation CNESST - Outils d'évaluation IA 2024"
      }
    ],
    cybersecurite: {
      donnees_sensibles: true,
      mesures: ["Chiffrement des évaluations", "Accès restreint experts", "Traçabilité complète"],
      conformite: ["Loi 25", "ISO 27001"]
    },
    gouvernance_ethique: {
      transparence: "Critères d'évaluation transparents et documentés.",
      equite: "Évaluation objective sans biais sectoriels.",
      responsabilite: "Validation finale par experts humains.",
      protection_donnees: "Anonymisation des données d'incidents.",
      conformite: ["CNESST", "Loi 25", "ISO 45001"],
      audit: "Révision annuelle des algorithmes d'évaluation.",
      recours: "Possibilité de contre-expertise humaine."
    },
    indicateurs: {
      conformite_loi_25: true,
      audit_biais_valide: true,
      explicabilite_activee: true
    }
  },
  {
    project_id: "GenAISafety-INCIDENT-007",
    nom: "Analyse prédictive des incidents",
    niveau: "Avancé",
    contexte: "Opérations",
    priorite: "Élevée",
    description: "IA pour analyser les patterns d'incidents passés et prédire les zones/moments à risque élevé.",
    mots_cles: ["Prédiction", "Incidents", "Analyse", "Prévention"],
    secteur: ["Construction", "Manufacturing", "Transport"],
    technologies: ["Machine Learning", "Analyse temporelle", "Big Data"],
    implementation: {
      technologies: ["Algorithmes ML", "Base données incidents", "Visualisation prédictive"],
      prerequisites: ["Historique incidents 5+ ans", "Données météo", "Planning opérationnel"],
      steps: [
        "Collecte et nettoyage données historiques",
        "Entraînement modèles prédictifs",
        "Interface de visualisation des risques"
      ]
    },
    metrics: {
      views: 2743,
      usage: 145,
      rating: 4.4
    },
    cas_usage_sectoriels: [
      {
        titre: "Prédiction des pics de risque",
        description: "Identification 72h à l'avance des créneaux à risque élevé d'incidents.",
        reference: "Étude prédictive IRSST 2024 - Patterns temporels des accidents"
      }
    ],
    cybersecurite: {
      donnees_sensibles: true,
      mesures: ["Chiffrement des données incidents", "Anonymisation obligatoire", "Accès limité"],
      conformite: ["Loi 25", "ISO 27001"]
    },
    gouvernance_ethique: {
      transparence: "Modèles prédictifs explicables et auditables.",
      equite: "Pas de discrimination par équipe ou individu.",
      responsabilite: "Prédictions validées par experts sécurité.",
      protection_donnees: "Anonymisation complète des données personnelles.",
      conformite: ["CNESST", "Loi 25", "ISO 45001"],
      audit: "Validation annuelle des modèles prédictifs.",
      recours: "Révision possible des alertes prédictives."
    },
    indicateurs: {
      conformite_loi_25: true,
      audit_biais_valide: true,
      explicabilite_activee: true
    }
  },
  {
    project_id: "GenAISafety-COMMUNICATION-008",
    nom: "Assistant IA pour communication sécurité",
    niveau: "Intermédiaire",
    contexte: "Nature humaine",
    priorite: "Moyenne",
    description: "Chatbot intelligent pour répondre aux questions sécurité des employés en temps réel et dans leur langue.",
    mots_cles: ["Chatbot", "Communication", "Support", "Multilingue"],
    secteur: ["Tous secteurs"],
    technologies: ["NLP", "IA conversationnelle", "Traduction automatique"],
    implementation: {
      technologies: ["Modèle de langue", "Base de connaissances SST", "Interface chat"],
      prerequisites: ["Documentation SST", "FAQ existantes", "Intégration système"],
      steps: [
        "Constitution de la base de connaissances",
        "Entraînement du modèle conversationnel",
        "Intégration dans les outils existants"
      ]
    },
    metrics: {
      views: 1923,
      usage: 267,
      rating: 4.1
    },
    cas_usage_sectoriels: [
      {
        titre: "Support 24/7 en sécurité",
        description: "Réponses immédiates aux questions sécurité avec 95% de précision.",
        reference: "Étude efficacité chatbots SST - CNESST 2024"
      }
    ],
    cybersecurite: {
      donnees_sensibles: false,
      mesures: ["Chiffrement des conversations", "Anonymisation des requêtes"],
      conformite: ["Loi 25", "ISO 27001"]
    },
    gouvernance_ethique: {
      transparence: "Sources des réponses toujours indiquées.",
      equite: "Accès égal à l'information pour tous les employés.",
      responsabilite: "Escalade vers humain pour questions complexes.",
      protection_donnees: "Pas de stockage des conversations personnelles.",
      conformite: ["CNESST", "Loi 25"],
      audit: "Révision mensuelle de la qualité des réponses.",
      recours: "Contact direct avec experts humains disponible."
    },
    indicateurs: {
      conformite_loi_25: true,
      audit_biais_valide: true,
      explicabilite_activee: true
    }
  },
  {
    project_id: "GenAISafety-ERGONOMIE-009",
    nom: "Analyse ergonomique par vision IA",
    niveau: "Avancé",
    contexte: "Nature humaine",
    priorite: "Moyenne",
    description: "Système de vision pour analyser les postures de travail et détecter les risques de troubles musculo-squelettiques.",
    mots_cles: ["Ergonomie", "Posture", "TMS", "Vision IA"],
    secteur: ["Manufacturing", "Bureaux", "Entrepôts"],
    technologies: ["Computer Vision", "Analyse posturale", "Biomécanique IA"],
    implementation: {
      technologies: ["Caméras 3D", "Modèles biomécanique", "Interface d'alerte"],
      prerequisites: ["Évaluation ergonomique initiale", "Consentement employés", "Normes ergonomiques"],
      steps: [
        "Installation des systèmes de vision 3D",
        "Calibration des modèles biomécaniques",
        "Interface de feedback en temps réel"
      ]
    },
    metrics: {
      views: 2134,
      usage: 98,
      rating: 4.3
    },
    cas_usage_sectoriels: [
      {
        titre: "Prévention des TMS par IA",
        description: "Réduction de 35% des TMS grâce à la correction posturale en temps réel.",
        reference: "Étude ergonomie prédictive - IRSST 2024"
      }
    ],
    cybersecurite: {
      donnees_sensibles: true,
      mesures: ["Chiffrement vidéo", "Anonymisation posturale", "Accès restreint"],
      conformite: ["Loi 25", "RGPD", "ISO 27001"]
    },
    gouvernance_ethique: {
      transparence: "Algorithmes d'analyse posturale explicables.",
      equite: "Analyse objective sans discrimination physique.",
      responsabilite: "Conseils validés par ergonomes professionnels.",
      protection_donnees: "Données posturales anonymisées, rétention minimale.",
      conformite: ["CNESST", "Loi 25", "ISO 45001"],
      audit: "Validation trimestrielle par ergonomes certifiés.",
      recours: "Droit de refus de monitoring, alternatives disponibles."
    },
    indicateurs: {
      conformite_loi_25: true,
      audit_biais_valide: true,
      explicabilite_activee: true
    }
  },
  {
    project_id: "GenAISafety-CHIMIQUE-010",
    nom: "Détection intelligente de substances chimiques",
    niveau: "Avancé",
    contexte: "Lieux",
    priorite: "Élevée",
    description: "Réseau de capteurs IA pour identifier et quantifier les substances chimiques dangereuses dans l'environnement de travail.",
    mots_cles: ["Chimique", "Détection", "Capteurs", "Toxicologie"],
    secteur: ["Laboratoires", "Manufacturing", "Pharmaceutique"],
    technologies: ["Spectroscopie IA", "Capteurs chimiques", "Machine Learning"],
    implementation: {
      technologies: ["Capteurs multi-spectres", "IA de classification", "Système d'alarme"],
      prerequisites: ["Cartographie chimique", "Seuils réglementaires", "Protocoles d'urgence"],
      steps: [
        "Installation du réseau de capteurs intelligents",
        "Entraînement IA sur signatures chimiques",
        "Intégration avec systèmes de ventilation"
      ]
    },
    metrics: {
      views: 3267,
      usage: 134,
      rating: 4.6
    },
    cas_usage_sectoriels: [
      {
        titre: "Détection précoce de fuites chimiques",
        description: "Identification de substances toxiques 10x plus rapide qu'inspection manuelle.",
        reference: "Validation laboratoire - Détection chimique IA 2024"
      }
    ],
    cybersecurite: {
      donnees_sensibles: true,
      mesures: ["Chiffrement des données chimiques", "Réseau sécurisé", "Logs d'audit"],
      conformite: ["Loi 25", "ISO 27001", "REACH"]
    },
    gouvernance_ethique: {
      transparence: "Méthodes de détection transparentes et validées.",
      equite: "Protection égale pour tous les espaces de travail.",
      responsabilite: "Alertes validées par experts en toxicologie.",
      protection_donnees: "Données chimiques anonymisées par zone.",
      conformite: ["CNESST", "Santé Canada", "Loi 25", "ISO 45001"],
      audit: "Calibration mensuelle des capteurs et algorithmes.",
      recours: "Vérification manuelle immédiate en cas d'alerte."
    },
    indicateurs: {
      conformite_loi_25: true,
      audit_biais_valide: true,
      explicabilite_activee: true
    }
  }
];

// Fonctions utilitaires pour les tests
export const testModelsCount = testModelsJSON.length;

export const testModelsByCategory = testModelsJSON.reduce((acc, model) => {
  acc[model.contexte] = (acc[model.contexte] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

export const testModelsByPriority = testModelsJSON.reduce((acc, model) => {
  acc[model.priorite] = (acc[model.priorite] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

export const testModelsBySector = testModelsJSON.reduce((acc, model) => {
  model.secteur.forEach(secteur => {
    acc[secteur] = (acc[secteur] || 0) + 1;
  });
  return acc;
}, {} as Record<string, number>);

// Export pour conversion vers format Project IGNITIA
export { testModelsJSON as default }