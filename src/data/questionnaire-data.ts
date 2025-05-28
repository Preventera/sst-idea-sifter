
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
    id: "objectifs",
    title: "Objectifs IA-SST",
    description: "Définissez les objectifs principaux de votre projet IA en santé-sécurité au travail",
    questions: [
      {
        id: 1,
        question: "Quel est l'objectif principal de votre solution IA-SST ?",
        options: [
          { id: "reduction", text: "Réduction des incidents et accidents de travail" },
          { id: "conformite", text: "Amélioration de la conformité réglementaire" },
          { id: "predictif", text: "Analyse prédictive des risques" },
          { id: "formation", text: "Formation et sensibilisation du personnel" },
          { id: "monitoring", text: "Surveillance continue de l'environnement de travail" }
        ],
        allowCustom: true
      },
      {
        id: 2,
        question: "Quels processus souhaitez-vous automatiser en priorité ?",
        options: [
          { id: "veille", text: "Veille réglementaire et gestion documentaire" },
          { id: "evaluation", text: "Évaluation des risques" },
          { id: "reporting", text: "Génération de rapports de sécurité" },
          { id: "inspection", text: "Inspections et audits de sécurité" },
          { id: "incidents", text: "Gestion des incidents et enquêtes" }
        ],
        allowCustom: true
      }
    ]
  },
  {
    id: "donnees",
    title: "Données et Sources",
    description: "Identifiez les sources de données disponibles pour votre projet",
    questions: [
      {
        id: 3,
        question: "Quelles sont vos principales sources de données internes ?",
        options: [
          { id: "rapports", text: "Rapports d'incidents, données IoT, images/vidéos" },
          { id: "rh", text: "Données RH et formation du personnel" },
          { id: "maintenance", text: "Données de maintenance et équipements" },
          { id: "environnement", text: "Mesures environnementales (bruit, air, température)" },
          { id: "conformite", text: "Documents de conformité et procédures" }
        ],
        allowCustom: true
      },
      {
        id: 4,
        question: "Sous quelle forme souhaitez-vous la restitution des résultats ?",
        options: [
          { id: "alertes", text: "Alertes en temps réel" },
          { id: "dashboards", text: "Tableaux de bord interactifs" },
          { id: "rapports", text: "Rapports automatisés" },
          { id: "mobile", text: "Notifications mobiles" },
          { id: "integration", text: "Intégration dans systèmes existants" }
        ],
        allowCustom: true
      }
    ]
  },
  {
    id: "contexte",
    title: "Contexte d'Usage",
    description: "Précisez l'environnement et les utilisateurs cibles",
    questions: [
      {
        id: 5,
        question: "Dans quel type de milieu sera déployée la solution ?",
        options: [
          { id: "usine", text: "Environnement industriel/usine" },
          { id: "bureau", text: "Environnement de bureau" },
          { id: "chantier", text: "Chantiers de construction" },
          { id: "laboratoire", text: "Laboratoires" },
          { id: "transport", text: "Transport et logistique" }
        ],
        allowCustom: true
      },
      {
        id: 6,
        question: "Quelles catégories de risques sont prioritaires ?",
        options: [
          { id: "respiratoires", text: "Risques respiratoires et exposition chimique" },
          { id: "ergonomiques", text: "Troubles musculo-squelettiques" },
          { id: "machines", text: "Sécurité des machines et équipements" },
          { id: "incendie", text: "Risques d'incendie et explosion" },
          { id: "psychosociaux", text: "Risques psychosociaux" }
        ],
        allowCustom: true
      }
    ]
  },
  {
    id: "utilisateurs",
    title: "Utilisateurs et Interactions",
    description: "Définissez qui utilisera la solution et comment",
    questions: [
      {
        id: 7,
        question: "Qui sont les utilisateurs principaux ?",
        options: [
          { id: "operateurs", text: "Opérateurs et travailleurs de terrain" },
          { id: "superviseurs", text: "Superviseurs et chefs d'équipe" },
          { id: "hse", text: "Responsables HSE/sécurité" },
          { id: "direction", text: "Direction et management" },
          { id: "externes", text: "Intervenants externes (contractors)" }
        ],
        allowCustom: true
      },
      {
        id: 8,
        question: "Quel type d'interaction privilégiez-vous ?",
        options: [
          { id: "conversationnel", text: "Assistant conversationnel/chatbot" },
          { id: "tactile", text: "Interface tactile intuitive" },
          { id: "vocal", text: "Commandes vocales" },
          { id: "automatique", text: "Traitement automatique en arrière-plan" },
          { id: "mixte", text: "Approche mixte selon le contexte" }
        ],
        allowCustom: true
      }
    ]
  }
];
