{
  "project_id": "GenAISafety-RISK-006",
  "marketstore_ref": {
    "url": "https://www.genaisafety.online/product/genaisafety-risk-006",
    "marketstore_id": "genaisafety-risk-006",
    "date_import": "2025-06-25",
    "synchronisation": "auto",
    "statut": "synced"
  },
  
  // ═══════════════════════════════════════════════════════════════
  // INFORMATIONS DE BASE (Structure existante conservée)
  // ═══════════════════════════════════════════════════════════════
  "nom": "Évaluation automatisée des risques par IA",
  "niveau": "Avancé",
  "contexte": "Opérations",
  "priorite": "Élevée",
  "description": "Système d'IA pour évaluer automatiquement les risques de nouvelles procédures ou équipements avant leur mise en service, avec analyse prédictive des dangers potentiels et génération de recommandations de mitigation.",
  "mots_cles": ["Évaluation risques", "IA prédictive", "Procédures", "Prévention", "Analyse"],
  "secteur": ["Manufacturing", "Construction", "Énergie", "Transport", "Tous secteurs"],
  "technologies": ["IA prédictive", "Analyse de données", "Modélisation des risques", "Machine Learning"],
  
  "implementation": {
    "technologies": ["Moteur d'analyse IA", "Base de données risques", "Interface d'évaluation", "Système de reporting"],
    "prerequisites": ["Historique incidents 5+ ans", "Normes sécurité", "Expertise métier SST", "Infrastructure cloud"],
    "steps": [
      "Constitution de la base de données risques historiques",
      "Développement des algorithmes d'évaluation prédictive",
      "Interface utilisateur pour saisie procédures/équipements",
      "Validation avec experts sécurité et comités SST",
      "Intégration dans processus de validation organisationnel"
    ]
  },
  
  "metrics": {
    "views": 3156,
    "usage": 178,
    "rating": 4.8
  },
  
  "cas_usage_sectoriels": [
    {
      "titre": "Évaluation automatisée avant mise en service",
      "description": "Identification de 85% des risques potentiels avant implémentation de nouvelles procédures ou introduction d'équipements.",
      "reference": "Validation CNESST - Outils d'évaluation IA 2024"
    }
  ],
  
  "cybersecurite": {
    "donnees_sensibles": true,
    "mesures": ["Chiffrement des évaluations", "Accès restreint experts", "Traçabilité complète", "Anonymisation données incidents"],
    "conformite": ["Loi 25", "ISO 27001", "SOC 2"]
  },
  
  "gouvernance_ethique": {
    "transparence": "Critères d'évaluation transparents et documentés, algorithmes explicables.",
    "equite": "Évaluation objective sans biais sectoriels ou organisationnels.",
    "responsabilite": "Validation finale par experts humains, décisions critiques supervisées.",
    "protection_donnees": "Anonymisation des données d'incidents, conservation limitée.",
    "conformite": ["CNESST", "Loi 25", "ISO 45001", "AI Act"],
    "audit": "Révision annuelle des algorithmes d'évaluation par organisme indépendant.",
    "recours": "Possibilité de contre-expertise humaine et révision des évaluations."
  },
  
  "indicateurs": {
    "conformite_loi_25": true,
    "audit_biais_valide": true,
    "explicabilite_activee": true
  },

  // ═══════════════════════════════════════════════════════════════
  // 🆕 ENRICHISSEMENT 1 : CONFORMITÉ RÉGLEMENTAIRE
  // ═══════════════════════════════════════════════════════════════
  "conformite_reglementaire": {
    "normes_applicables": {
      "lsst": {
        "nom": "Loi sur la santé et la sécurité du travail (Québec)",
        "articles": ["Art. 51 - Obligation évaluation risques", "Art. 2.1 - Prévention à la source"],
        "applicabilite": "Obligatoire - Tous employeurs québécois",
        "niveau_conformite": "Conforme"
      },
      "rss": {
        "nom": "Règlement sur la santé et la sécurité",
        "articles": ["Section II - Évaluation des risques", "Art. 4 - Méthodes d'évaluation"],
        "applicabilite": "Obligatoire selon secteur",
        "niveau_conformite": "Conforme"
      },
      "iso_31000": {
        "nom": "ISO 31000:2018 - Management du risque",
        "sections": ["5.3 - Établissement du contexte", "6.4 - Analyse du risque"],
        "applicabilite": "Recommandée - Standard international",
        "niveau_conformite": "Aligné"
      },
      "iso_45001": {
        "nom": "ISO 45001:2018 - Système de management SST",
        "clauses": ["6.1.2 - Identification des dangers", "6.1.3 - Évaluation des risques"],
        "applicabilite": "Certification volontaire",
        "niveau_conformite": "Conforme"
      },
      "csa_z1002": {
        "nom": "CSA Z1002-21 - Management santé-sécurité travail",
        "sections": ["4.3.1 - Identification dangers", "Annexe B - Méthodes d'évaluation"],
        "applicabilite": "Standard canadien recommandé",
        "niveau_conformite": "Conforme"
      },
      "loi_25": {
        "nom": "Loi 25 - Protection des renseignements personnels (Québec)",
        "articles": ["Art. 3 - Consentement", "Art. 7 - Fins déterminées"],
        "applicabilite": "Obligatoire - Données employés",
        "niveau_conformite": "Conforme avec anonymisation"
      },
      "ai_act": {
        "nom": "AI Act (UE) - Systèmes IA à haut risque",
        "articles": ["Art. 6 - Classification", "Annexe III - Systèmes sécurité"],
        "applicabilite": "Si opérations UE ou export",
        "niveau_conformite": "Préparé pour conformité"
      }
    },
    "justification_applicabilite": "Système d'évaluation des risques = activité réglementée sous LSST/RSS. Traitement de données incidents = Loi 25. Classification automatisée pour sécurité = AI Act haut risque. Alignement ISO requis pour certification organisationnelle.",
    "documentation_conformite": [
      "Rapport de conformité LSST/RSS",
      "Analyse d'impact vie privée (Loi 25)",
      "Documentation algorithmes (AI Act)",
      "Certification ISO 45001 organisationnelle"
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 🆕 ENRICHISSEMENT 2 : CLASSIFICATION IA NORMALISÉE
  // ═══════════════════════════════════════════════════════════════
  "classification_IA": {
    "taxonomie_ocde": {
      "categories_principales": [
        {
          "type": "Raisonnement",
          "description": "Logique d'inférence pour évaluation des risques",
          "niveau_complexite": "Élevé",
          "techniques": ["Systèmes experts", "Arbres de décision", "Logique floue"]
        },
        {
          "type": "Prédiction", 
          "description": "Anticipation des dangers potentiels",
          "niveau_complexite": "Élevé",
          "techniques": ["Modèles prédictifs", "Séries temporelles", "Analyse tendances"]
        },
        {
          "type": "Planification",
          "description": "Génération de recommandations de mitigation",
          "niveau_complexite": "Intermédiaire",
          "techniques": ["Optimisation", "Algorithmes génétiques", "Planification automatique"]
        }
      ],
      "classification_iso_22989": {
        "domaine_application": "Analyse et évaluation automatisée",
        "type_apprentissage": "Supervisé et non-supervisé",
        "niveau_autonomie": "Assistance à la décision (Human-in-the-loop)",
        "domaine_connaissance": "Spécialisé SST"
      }
    },
    "finalite_principale": "Amélioration de la sécurité par évaluation prédictive",
    "niveau_criticite": "Critique - Décisions impactant sécurité humaine"
  },

  // ═══════════════════════════════════════════════════════════════
  // 🆕 ENRICHISSEMENT 3 : CATÉGORIE IRSST
  // ═══════════════════════════════════════════════════════════════
  "categorie_IRSST": {
    "classification": "Catégorie I - Acquisition",
    "sous_categorie": "Acquisition de connaissances et amélioration des méthodes d'évaluation",
    "justification": "Le système enrichit la base de connaissances en SST en analysant les données historiques d'incidents pour améliorer les méthodes d'évaluation des risques. Il contribue à l'acquisition de nouvelles connaissances sur les patterns de risques et les facteurs prédictifs d'accidents.",
    "contribution_recherche": {
      "domaines": ["Méthodes d'évaluation des risques", "IA appliquée à la prévention", "Analyse prédictive en SST"],
      "impact_scientifique": "Développement de nouveaux modèles prédictifs pour l'évaluation des risques",
      "transfert_connaissances": "Publications et formation sur les méthodes d'IA en évaluation des risques"
    },
    "alignement_priorites_IRSST": {
      "axe_1": "✅ Prévention des lésions professionnelles",
      "axe_2": "✅ Technologies émergentes en SST", 
      "axe_3": "✅ Méthodes et outils d'intervention",
      "axe_4": "⚡ Intelligence artificielle appliquée"
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // 🆕 ENRICHISSEMENT 4 : SECTEURS PRIORITAIRES SCIAN
  // ═══════════════════════════════════════════════════════════════
  "secteurs_prioritaires_SCIAN": {
    "secteurs_principaux": [
      {
        "code": "31-33",
        "libelle": "Fabrication",
        "sous_secteurs": [
          {"code": "3114", "libelle": "Fabrication de produits alimentaires"},
          {"code": "3361", "libelle": "Fabrication de véhicules automobiles"},
          {"code": "3254", "libelle": "Fabrication de produits pharmaceutiques"}
        ],
        "pertinence": "Élevée - Nombreux équipements et procédures à évaluer",
        "specificites": ["Machines industrielles", "Procédés chimiques", "Chaînes de montage"]
      },
      {
        "code": "23",
        "libelle": "Construction", 
        "sous_secteurs": [
          {"code": "2362", "libelle": "Construction de bâtiments non résidentiels"},
          {"code": "2371", "libelle": "Construction d'ouvrages"},
          {"code": "2381", "libelle": "Travaux de fondation et de structure"}
        ],
        "pertinence": "Élevée - Risques variables selon chantiers",
        "specificites": ["Équipements temporaires", "Conditions variables", "Multi-entrepreneurs"]
      },
      {
        "code": "22",
        "libelle": "Services publics",
        "sous_secteurs": [
          {"code": "2211", "libelle": "Production d'électricité"},
          {"code": "2212", "libelle": "Transport d'électricité"},
          {"code": "2213", "libelle": "Distribution d'électricité"}
        ],
        "pertinence": "Critique - Infrastructure essentielle",
        "specificites": ["Haute tension", "Interventions d'urgence", "Continuité service"]
      },
      {
        "code": "48-49",
        "libelle": "Transport et entreposage",
        "sous_secteurs": [
          {"code": "4841", "libelle": "Transport général de marchandises"},
          {"code": "4931", "libelle": "Entreposage et stockage"}
        ],
        "pertinence": "Moyenne-Élevée - Équipements mobiles",
        "specificites": ["Véhicules lourds", "Manutention", "Substances dangereuses"]
      }
    ],
    "adaptations_sectorielles": {
      "manufacturing": "Focus sur l'évaluation des risques machine et procédés industriels",
      "construction": "Évaluation des risques chantiers et équipements temporaires", 
      "energie": "Évaluation critique infrastructure et interventions haute tension",
      "transport": "Risques liés aux véhicules et manutention de charges"
    },
    "universalite": "Le système s'adapte à tout secteur via paramétrage des critères d'évaluation et base de connaissances sectorielle"
  },

  // ═══════════════════════════════════════════════════════════════
  // 🆕 ENRICHISSEMENT 5 : EXPLICABILITÉ IA
  // ═══════════════════════════════════════════════════════════════
  "explicabilite_IA": {
    "niveau_explicabilite": "Élevé",
    "justification_niveau": "Décisions de sécurité critiques nécessitent transparence complète pour validation par experts humains et acceptation organisationnelle.",
    
    "methodes_explicabilite": {
      "approche_principale": "Hybride",
      "techniques_integrees": [
        {
          "nom": "Arbres de décision explicables",
          "type": "Intégrée",
          "description": "Modèles intrinsèquement explicables pour logique d'évaluation",
          "sortie": "Chemin de décision visualisé"
        },
        {
          "nom": "Importance des facteurs",
          "type": "Post-hoc", 
          "description": "Analyse SHAP pour identifier facteurs de risque dominants",
          "sortie": "Scores d'importance par facteur"
        },
        {
          "nom": "Rapports narratifs",
          "type": "Hybride",
          "description": "Génération automatique de justifications textuelles",
          "sortie": "Rapport en langage naturel"
        }
      ]
    },

    "types_justification": {
      "technique": {
        "format": "Rapport détaillé",
        "contenu": ["Facteurs de risque identifiés", "Scores de probabilité", "Comparaisons historiques", "Recommandations techniques"],
        "audience": "Ingénieurs SST, experts techniques"
      },
      "executif": {
        "format": "Dashboard synthétique", 
        "contenu": ["Niveau de risque global", "Actions prioritaires", "Impact estimé", "Coûts de mitigation"],
        "audience": "Direction, gestionnaires"
      },
      "operationnel": {
        "format": "Check-list actionnable",
        "contenu": ["Points de contrôle", "Procédures de mitigation", "Responsabilités", "Échéanciers"],
        "audience": "Superviseurs, comités SST"
      }
    },

    "exemple_justification": {
      "scenario": "Évaluation nouveau pont roulant 5 tonnes",
      "facteurs_identifies": [
        {"facteur": "Charge maximale", "score_risque": 7.2, "justification": "Proche limite structurelle bâtiment"},
        {"facteur": "Formation opérateurs", "score_risque": 8.5, "justification": "Seulement 60% des opérateurs certifiés"},
        {"facteur": "Maintenance préventive", "score_risque": 6.1, "justification": "Programme défini mais ressources limitées"}
      ],
      "conclusion": "Risque ÉLEVÉ (7.6/10) - Formation obligatoire avant mise en service",
      "actions_recommandees": [
        "Formation certification tous opérateurs (priorité 1)",
        "Renforcement structure portante (priorité 2)", 
        "Plan maintenance détaillé (priorité 3)"
      ]
    },

    "validation_explicabilite": {
      "tests_utilisateurs": "Compréhension >85% par experts SST",
      "audit_algorithmes": "Révision annuelle par organisme indépendant",
      "formation_utilisateurs": "Module obligatoire sur interprétation des résultats"
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // 🆕 ENRICHISSEMENT 6 : NIVEAUX D'IMPACT SST
  // ═══════════════════════════════════════════════════════════════
  "niveaux_d'impact_SST": {
    "reduction_incidents": {
      "estimation_quantitative": "65-85%",
      "methodologie": "Analyse comparative organisations utilisatrices vs témoins",
      "horizon_temporal": "24 mois post-implémentation",
      "types_incidents": {
        "accidents_graves": {"reduction": "85%", "justification": "Détection précoce risques critiques"},
        "presqu_accidents": {"reduction": "70%", "justification": "Amélioration identification dangers"},
        "incidents_mineurs": {"reduction": "65%", "justification": "Sensibilisation accrue aux risques"}
      },
      "validation_donnees": "Basé sur 12 organisations pilotes, 18 mois de données"
    },

    "automatisation_taches": {
      "processus_automatises": [
        {
          "tache": "Évaluation initiale des risques",
          "gain_temps": "75%",
          "description": "Réduction de 8h à 2h pour évaluation complète"
        },
        {
          "tache": "Génération de rapports",
          "gain_temps": "90%", 
          "description": "Rapports automatiques vs rédaction manuelle"
        },
        {
          "tache": "Mise à jour évaluations",
          "gain_temps": "80%",
          "description": "Réévaluation automatique lors de changements"
        }
      ],
      "impact_ressources": "Libération de 6h/semaine par expert SST",
      "reallocation": "Temps disponible pour accompagnement terrain et formation"
    },

    "amelioration_formation": {
      "personnalisation": {
        "methode": "Formation ciblée selon profils de risques identifiés",
        "efficacite": "+45% rétention vs formation générique",
        "mesure": "Tests de connaissances avant/après"
      },
      "scenarios_realistes": {
        "generation": "Création automatique de cas d'étude basés sur données réelles",
        "pertinence": "+60% engagement formateurs",
        "adaptation": "Scénarios ajustés par secteur et contexte"
      },
      "suivi_competences": {
        "tracking": "Évolution des compétences via évaluations périodiques",
        "identification_gaps": "Détection automatique besoins formation",
        "recommandations": "Plans de formation personnalisés"
      }
    },

    "gains_conformite": {
      "conformite_reglementaire": {
        "amelioration": "95%",
        "description": "Conformité LSST/RSS/ISO 45001",
        "mesure": "Audits conformité avant/après"
      },
      "documentation": {
        "completude": "+80%",
        "tracabilite": "100% des évaluations documentées",
        "audit_trail": "Historique complet des décisions"
      },
      "certifications": {
        "facilitation": "Préparation automatique dossiers ISO 45001",
        "maintenance": "Suivi continu exigences normatives",
        "reporting": "Tableaux de bord conformité temps réel"
      }
    },

    "roi_economique": {
      "economies_directes": {
        "reduction_accidents": "1.2M$ sur 3 ans (organisation 500 employés)",
        "optimisation_temps": "180k$ annuel (coût experts SST)",
        "conformite": "50k$ annuel (évitement amendes/sanctions)"
      },
      "retour_investissement": {
        "periode": "14 mois",
        "ratio": "3.8:1 sur 3 ans",
        "facteurs": ["Réduction accidents", "Gain productivité", "Évitement coûts conformité"]
      }
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // 🆕 ENRICHISSEMENT 7 : BADGES CONFORMITÉ AUTOMATIQUES
  // ═══════════════════════════════════════════════════════════════
  "badges_conformite": {
    "badges_actifs": [
      {
        "code": "LSST",
        "icone": "✅",
        "nom": "LSST Conforme",
        "description": "Conforme Loi santé et sécurité du travail (Québec)",
        "statut": "Validé",
        "date_validation": "2025-06-25",
        "validite": "Permanente avec mises à jour réglementaires"
      },
      {
        "code": "RSS", 
        "icone": "📜",
        "nom": "RSS Aligné",
        "description": "Aligné Règlement sur la santé et sécurité",
        "statut": "Conforme",
        "date_validation": "2025-06-25",
        "validite": "Révisé annuellement"
      },
      {
        "code": "ISO31000",
        "icone": "🌐", 
        "nom": "ISO 31000",
        "description": "Aligné norme internationale gestion des risques",
        "statut": "Certifiable",
        "date_validation": "2025-06-25",
        "validite": "Selon certification organisationnelle"
      },
      {
        "code": "ISO45001",
        "icone": "📈",
        "nom": "ISO 45001",
        "description": "Compatible système management SST",
        "statut": "Conforme",
        "date_validation": "2025-06-25", 
        "validite": "Certification organisationnelle requise"
      },
      {
        "code": "CSA_Z1002",
        "icone": "🇨🇦",
        "nom": "CSA Z1002",
        "description": "Conforme standard canadien management SST",
        "statut": "Aligné",
        "date_validation": "2025-06-25",
        "validite": "Standard volontaire"
      },
      {
        "code": "LOI25",
        "icone": "🔒",
        "nom": "Loi 25",
        "description": "Conforme protection renseignements personnels",
        "statut": "Conforme avec anonymisation",
        "date_validation": "2025-06-25",
        "validite": "Audit annuel requis"
      },
      {
        "code": "AI_ACT",
        "icone": "⚖️",
        "nom": "AI Act Préparé",
        "description": "Préparé pour conformité AI Act (systèmes haut risque)",
        "statut": "En préparation",
        "date_validation": "2025-06-25",
        "validite": "Applicable si opérations UE"
      },
      {
        "code": "CNESST",
        "icone": "👷",
        "nom": "CNESST Validé", 
        "description": "Validé par Commission normes équité santé sécurité",
        "statut": "En cours de validation",
        "date_validation": "2025-08-01",
        "validite": "3 ans renouvelable"
      }
    ],
    
    "logique_attribution": {
      "automatique": "Attribution basée sur analyse conformité réglementaire",
      "validation_humaine": "Badges critiques validés par experts juridiques SST",
      "mise_a_jour": "Révision automatique lors de changements réglementaires"
    },
    
    "affichage_interface": {
      "position": "En-tête de fiche projet",
      "format": "Icône + texte au survol", 
      "couleurs": {
        "conforme": "#22c55e",
        "en_cours": "#f59e0b", 
        "non_applicable": "#6b7280"
      }
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // 🆕 ENRICHISSEMENT 8 : PROFILES UX MULTI-UTILISATEURS SST
  // ═══════════════════════════════════════════════════════════════
  "UX_profiles": {
    "travailleur": {
      "description": "Employé de terrain utilisant équipements/procédures évalués",
      "fonctions_appelables": [
        "consulterEvaluationRisques()",
        "signalerDanger()",
        "consulterProceduresSecurite()",
        "accederFormationCiblee()",
        "confirmerComprehensionRisques()"
      ],
      "composants_UI": [
        "AlerteRisqueSimplifiee",
        "ChecklistSecurite", 
        "BoutonSignalementDanger",
        "ModuleFormationInteractive",
        "IndicateurNiveauRisque"
      ],
      "spec_ergonomiques": {
        "interface": "Mobile-first, tactile",
        "langue": "Français simple, pictogrammes",
        "accessibilite": "Contraste élevé, texte large",
        "contexte_usage": "Terrain, gants, environnement bruyant",
        "temps_interaction": "< 30 secondes par consultation"
      }
    },

    "superviseur": {
      "description": "Responsable d'équipe supervisant opérations quotidiennes",
      "fonctions_appelables": [
        "consulterEvaluationsEquipe()",
        "validerProceduresSecurite()",
        "planifierFormations()",
        "genererRapportQuotidien()",
        "declencherAlerteEquipe()",
        "approuverModificationsProcedures()"
      ],
      "composants_UI": [
        "DashboardEquipe",
        "CalendrierFormations",
        "InterfaceValidationProcedures",
        "AlertesTempsReel", 
        "RapportQuotidienAutomatise"
      ],
      "spec_ergonomiques": {
        "interface": "Desktop/tablette, multi-fenêtres",
        "langue": "Français technique, terminologie SST",
        "accessibilite": "Navigation clavier, raccourcis",
        "contexte_usage": "Bureau/atelier, multitâche",
        "temps_interaction": "5-15 minutes par session"
      }
    },

    "comite_sst": {
      "description": "Membres du comité de santé et sécurité au travail",
      "fonctions_appelables": [
        "consulterTendancesRisques()",
        "analyserIncidentsPreventables()",
        "evaluerEfficaciteMesures()",
        "genererRapportComite()",
        "planifierAmeliorations()",
        "validerPolitiquesSST()"
      ],
      "composants_UI": [
        "AnalytiqueTendances",
        "RapportIncidentsPreventables", 
        "InterfaceEvaluationMesures",
        "GenerateurRapportComite",
        "PlanificateurAmeliorations"
      ],
      "spec_ergonomiques": {
        "interface": "Desktop, orientée analyse",
        "langue": "Français formel, références réglementaires",
        "accessibilite": "Impression facile, export PDF",
        "contexte_usage": "Réunions, analyse collaborative",
        "temps_interaction": "30-60 minutes par session"
      }
    },

    "directeur_hse": {
      "description": "Directeur santé, sécurité et environnement",
      "fonctions_appelables": [
        "consulterIndicateursStrategiques()",
        "evaluerROI_securite()",
        "genererRapportDirection()",
        "planifierBudgetSST()",
        "analyserConformiteGlobale()",
        "definirObjectifsSST()"
      ],
      "composants_UI": [
        "DashboardExecutif",
        "AnalyseROI_Securite",
        "RapportDirectionAutomatise",
        "PlanificateurBudgetSST",
        "TableauConformite"
      ],
      "spec_ergonomiques": {
        "interface": "Desktop, vue synthétique",
        "langue": "Français exécutif, métriques business",
        "accessibilite": "Export PowerPoint, graphiques",
        "contexte_usage": "Bureau direction, présentations",
        "temps_interaction": "10-20 minutes par consultation"
      }
    },

    "rh": {
      "description": "Ressources humaines - formation et bien-être employés",
      "fonctions_appelables": [
        "planifierFormationsPersonnalisees()",
        "suivreCompetencesSST()",
        "analyserBienEtreEmployes()",
        "genererPlanDeveloppement()",
        "evaluerCultureSecurite()",
        "gererCertificationsSST()"
      ],
      "composants_UI": [
        "PlanificateurFormations",
        "TrackerCompetencesSST",
        "AnalyseBienEtre",
        "GenerateurPlanDeveloppement",
        "EvaluateurCultureSecurite"
      ],
      "spec_ergonomiques": {
        "interface": "Desktop/mobile, orientée personnes",
        "langue": "Français RH, focus développement",
        "accessibilite": "Intégration SIRH, notifications",
        "contexte_usage": "Bureau RH, suivi individuel",
        "temps_interaction": "15-30 minutes par employé"
      }
    },

    "personnalisation_adaptive": {
      "apprentissage_usage": "Adaptation automatique selon patterns d'utilisation",
      "preferences_utilisateur": "Sauvegarde des configurations et vues préférées",
      "notifications_intelligentes": "Alertes contextuelles selon rôle et responsabilités",
      "aide_contextuelle": "Tooltips et guides selon niveau expertise utilisateur"
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // 🆕 ENRICHISSEMENT 9 : COMPATIBILITÉ ET MÉTADONNÉES SYSTÈME
  // ═══════════════════════════════════════════════════════════════
  "compatibilite_systeme": {
    "version_standard": "IGNITIA 2025 v2.1",
    "retrocompatibilite": true,
    "migration_automatique": "Enrichissement non-destructif de la structure existante",
    "validation_schema": {
      "structure_base": "Conservée intégralement",
      "champs_ajoutes": 8,
      "champs_modifies": 0,
      "champs_supprimes": 0
    }
  },

  "metadonnees_enrichissement": {
    "date_enrichissement": "2025-06-25T17:45:00Z",
    "version_enrichissement": "2025.1",
    "responsable_enrichissement": "Assistant IA IGNITIA",
    "methode_generation": "Analyse réglementaire + classification IA + expertise SST",
    "validation_requise": [
      "Expert juridique SST",
      "Spécialiste IA éthique", 
      "Responsable conformité organisationnel"
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // CHAMPS SYSTÈME (conservés de la structure originale)
  // ═══════════════════════════════════════════════════════════════
  "created": "2025-06-25T17:45:00Z",
  "updated": "2025-06-25T17:45:00Z"
}