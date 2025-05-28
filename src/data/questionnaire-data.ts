
export const questionnaireSections = [
  {
    id: 1,
    title: "🎯 Objectifs et périmètre",
    description: "Définir les objectifs principaux de votre projet IA-SST",
    questions: [
      {
        id: 1,
        question: "Quel est l'objectif principal de votre projet IA en santé-sécurité au travail ?",
        options: [
          { id: "reduction", text: "🛡 Réduction des incidents et accidents" },
          { id: "detection", text: "🔍 Détection précoce des risques" },
          { id: "conformite", text: "📋 Amélioration de la conformité réglementaire" },
          { id: "formation", text: "🎓 Formation et sensibilisation du personnel" },
          { id: "surveillance", text: "📊 Surveillance continue des conditions de travail" }
        ],
        allowCustom: true
      },
      {
        id: 2,
        question: "Quels processus souhaitez-vous automatiser ou améliorer avec l'IA ?",
        options: [
          { id: "veille", text: "📑 Veille réglementaire et documentation" },
          { id: "evaluation", text: "⚖️ Évaluation des risques" },
          { id: "surveillance", text: "📹 Surveillance comportementale" },
          { id: "maintenance", text: "🔧 Maintenance prédictive" },
          { id: "formation", text: "🎯 Formation personnalisée" }
        ],
        allowCustom: true
      }
    ]
  },
  {
    id: 2,
    title: "📊 Données et sources",
    description: "Identifier les données disponibles pour alimenter votre IA",
    questions: [
      {
        id: 3,
        question: "Quelles données internes avez-vous à disposition ?",
        options: [
          { id: "rapports", text: "📂 Rapports d'incidents et d'accidents" },
          { id: "iot", text: "🌐 Données IoT et capteurs" },
          { id: "images", text: "📸 Images et vidéos de surveillance" },
          { id: "documents", text: "📄 Documents de conformité" },
          { id: "formations", text: "🎓 Historiques de formation" }
        ],
        allowCustom: true
      },
      {
        id: 4,
        question: "Sous quelle forme souhaitez-vous que l'IA restitue ses analyses ?",
        options: [
          { id: "alertes", text: "🔔 Alertes en temps réel" },
          { id: "tableaux", text: "📊 Tableaux de bord" },
          { id: "rapports", text: "📋 Rapports périodiques" },
          { id: "recommandations", text: "💡 Recommandations d'actions" },
          { id: "predictions", text: "🔮 Prédictions de risques" }
        ],
        allowCustom: true
      }
    ]
  },
  {
    id: 3,
    title: "🏭 Environnement de déploiement",
    description: "Caractériser le contexte d'utilisation",
    questions: [
      {
        id: 5,
        question: "Dans quel type d'environnement sera déployée la solution ?",
        options: [
          { id: "usine", text: "🏭 Site industriel / Usine" },
          { id: "chantier", text: "🚧 Chantier de construction" },
          { id: "bureau", text: "🏢 Environnement de bureau" },
          { id: "laboratoire", text: "🧪 Laboratoire" },
          { id: "entrepot", text: "📦 Entrepôt / Logistique" }
        ],
        allowCustom: true
      },
      {
        id: 6,
        question: "Quelles catégories de risques prioritaires voulez-vous adresser ?",
        options: [
          { id: "physiques", text: "💪 Risques physiques (TMS, chutes)" },
          { id: "chimiques", text: "🧪 Risques chimiques" },
          { id: "respiratoires", text: "🫁 Risques respiratoires" },
          { id: "psychosociaux", text: "🧠 Risques psychosociaux" },
          { id: "machines", text: "⚙️ Sécurité des machines" }
        ],
        allowCustom: true
      }
    ]
  },
  {
    id: 4,
    title: "👥 Utilisateurs et interactions",
    description: "Définir qui utilisera la solution et comment",
    questions: [
      {
        id: 7,
        question: "Qui seront les principaux utilisateurs de la solution IA ?",
        options: [
          { id: "operateurs", text: "🧑‍🏭 Opérateurs de terrain" },
          { id: "superviseurs", text: "👨‍💼 Superviseurs et managers" },
          { id: "hse", text: "🛡️ Responsables HSE" },
          { id: "maintenance", text: "🔧 Équipes de maintenance" },
          { id: "direction", text: "🏛️ Direction générale" }
        ],
        allowCustom: true
      },
      {
        id: 8,
        question: "Quel type d'interaction privilégiez-vous avec l'IA ?",
        options: [
          { id: "conversationnel", text: "💬 Assistant conversationnel" },
          { id: "dashboard", text: "📊 Tableaux de bord interactifs" },
          { id: "mobile", text: "📱 Application mobile" },
          { id: "automatique", text: "🤖 Fonctionnement automatique" },
          { id: "notifications", text: "🔔 Notifications push" }
        ],
        allowCustom: true
      }
    ]
  },
  {
    id: 5,
    title: "📋 Conformité et gouvernance",
    description: "Aspects réglementaires et de gouvernance",
    questions: [
      {
        id: 9,
        question: "Quelles fonctions de conformité l'IA doit-elle assurer ?",
        options: [
          { id: "echeances", text: "📅 Suivi des échéances réglementaires" },
          { id: "audits", text: "🔍 Préparation aux audits" },
          { id: "documentation", text: "📑 Génération de documentation" },
          { id: "traçabilité", text: "🗂️ Traçabilité des actions" },
          { id: "reporting", text: "📊 Reporting automatisé" }
        ],
        allowCustom: true
      },
      {
        id: 10,
        question: "Quels indicateurs souhaitez-vous suivre prioritairement ?",
        options: [
          { id: "accidents", text: "🩺 Taux d'accidents et incidents" },
          { id: "conformite", text: "✅ Niveau de conformité" },
          { id: "exposition", text: "⚠️ Niveaux d'exposition aux risques" },
          { id: "formation", text: "🎓 Taux de formation du personnel" },
          { id: "couts", text: "💰 Coûts liés à la sécurité" }
        ],
        allowCustom: true
      }
    ]
  }
];
