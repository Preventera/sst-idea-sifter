
export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  question: string;
  options: QuestionOption[];
  allowCustom?: boolean;
}

export interface QuestionnaireSection {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export const questionnaireSections: QuestionnaireSection[] = [
  {
    id: "contexte",
    title: "Contexte organisationnel",
    description: "Comprenons d'abord votre environnement de travail et vos enjeux SST",
    questions: [
      {
        id: 1,
        question: "Quel est votre secteur d'activité principal ?",
        options: [
          { id: "construction", text: "Construction" },
          { id: "manufacture", text: "Fabrication/Manufacturing" },
          { id: "sante", text: "Santé et services sociaux" },
          { id: "transport", text: "Transport et entreposage" },
          { id: "services", text: "Services professionnels" },
          { id: "autre", text: "Autre secteur" }
        ],
        allowCustom: true
      },
      {
        id: 2,
        question: "Quelle est la taille de votre organisation ?",
        options: [
          { id: "petite", text: "Petite (moins de 50 employés)" },
          { id: "moyenne", text: "Moyenne (50-250 employés)" },
          { id: "grande", text: "Grande (plus de 250 employés)" }
        ]
      },
      {
        id: 3,
        question: "Quels sont vos principaux défis SST actuels ?",
        options: [
          { id: "accidents", text: "Réduction du nombre d'accidents" },
          { id: "conformite", text: "Amélioration de la conformité réglementaire" },
          { id: "culture", text: "Développement d'une culture de sécurité" },
          { id: "formation", text: "Formation et sensibilisation du personnel" },
          { id: "couts", text: "Maîtrise des coûts liés aux accidents" }
        ],
        allowCustom: true
      }
    ]
  },
  {
    id: "besoins",
    title: "Identification des besoins",
    description: "Identifions vos besoins spécifiques en matière d'intelligence artificielle",
    questions: [
      {
        id: 4,
        question: "Dans quels domaines souhaitez-vous intégrer l'IA ?",
        options: [
          { id: "prevention", text: "Prévention des accidents" },
          { id: "surveillance", text: "Surveillance des comportements à risque" },
          { id: "analyse", text: "Analyse prédictive des incidents" },
          { id: "formation", text: "Formation et simulation" },
          { id: "conformite", text: "Gestion de la conformité" }
        ],
        allowCustom: true
      },
      {
        id: 5,
        question: "Quel type de données SST collectez-vous actuellement ?",
        options: [
          { id: "incidents", text: "Rapports d'incidents et d'accidents" },
          { id: "inspections", text: "Résultats d'inspections" },
          { id: "formations", text: "Données de formation" },
          { id: "comportements", text: "Observations comportementales" },
          { id: "aucune", text: "Peu ou pas de données structurées" }
        ],
        allowCustom: true
      }
    ]
  },
  {
    id: "contraintes",
    title: "Contraintes et ressources",
    description: "Évaluons vos contraintes techniques et budgétaires",
    questions: [
      {
        id: 6,
        question: "Quel est votre budget approximatif pour un projet IA-SST ?",
        options: [
          { id: "petit", text: "Moins de 10 000 $" },
          { id: "moyen", text: "10 000 $ - 50 000 $" },
          { id: "grand", text: "50 000 $ - 200 000 $" },
          { id: "important", text: "Plus de 200 000 $" }
        ]
      },
      {
        id: 7,
        question: "Avez-vous des ressources techniques internes ?",
        options: [
          { id: "oui", text: "Oui, équipe IT expérimentée" },
          { id: "limite", text: "Ressources limitées" },
          { id: "non", text: "Aucune ressource technique" },
          { id: "externe", text: "Recours à des prestataires externes" }
        ]
      }
    ]
  }
];
