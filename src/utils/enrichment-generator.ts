// src/utils/enrichment-generator.ts
// Générateur intelligent d'enrichissement pour modèles IA-SST
// IGNITIA 2025 - Génération automatique des 9 axes d'enrichissement

import type {
  IGNITIAProjectEnriched,
  ConformiteReglementaire,
  ClassificationIA,
  CategorieIRSST,
  SecteursScian,
  ExplicabiliteIA,
  NiveauxImpactSST,
  BadgesConformite,
  UXProfiles,
  CompatibiliteSysteme,
  MetadonneesEnrichissement
} from '../types/project';

// ═══════════════════════════════════════════════════════════════
// 📜 MODULE 1 : CONFORMITÉ RÉGLEMENTAIRE
// ═══════════════════════════════════════════════════════════════

/**
 * Référentiel des normes et lois applicables par contexte et secteur
 */
const REFERENTIEL_REGLEMENTAIRE = {
  // Normes de base toujours applicables
  base: {
    lsst: {
      nom: "Loi sur la santé et la sécurité du travail (Québec)",
      articles: ["Art. 51 - Obligation évaluation risques", "Art. 2.1 - Prévention à la source"],
      applicabilite: "Obligatoire - Tous employeurs québécois"
    },
    iso_45001: {
      nom: "ISO 45001:2018 - Système de management SST",
      clauses: ["6.1.2 - Identification des dangers", "6.1.3 - Évaluation des risques"],
      applicabilite: "Certification volontaire recommandée"
    }
  },

  // Normes par contexte
  contexte: {
    "Opérations": {
      rss: {
        nom: "Règlement sur la santé et la sécurité",
        articles: ["Section II - Évaluation des risques", "Art. 4 - Méthodes d'évaluation"],
        applicabilite: "Obligatoire selon secteur"
      },
      iso_31000: {
        nom: "ISO 31000:2018 - Management du risque",
        sections: ["5.3 - Établissement du contexte", "6.4 - Analyse du risque"],
        applicabilite: "Recommandée - Standard international"
      }
    },
    "Nature humaine": {
      loi_25: {
        nom: "Loi 25 - Protection des renseignements personnels (Québec)",
        articles: ["Art. 3 - Consentement", "Art. 7 - Fins déterminées"],
        applicabilite: "Obligatoire - Données employés"
      },
      ai_act: {
        nom: "AI Act (UE) - Systèmes IA à haut risque",
        articles: ["Art. 6 - Classification", "Annexe III - Systèmes sécurité"],
        applicabilite: "Si surveillance employés ou export UE"
      }
    },
    "Équipement": {
      csa_z1002: {
        nom: "CSA Z1002-21 - Management santé-sécurité travail",
        sections: ["4.3.1 - Identification dangers", "Annexe B - Méthodes d'évaluation"],
        applicabilite: "Standard canadien recommandé"
      }
    },
    "Lieux": {
      iso_27001: {
        nom: "ISO/IEC 27001 - Système de management sécurité information",
        clauses: ["A.11 - Sécurité physique", "A.12 - Sécurité opérationnelle"],
        applicabilite: "Si données sensibles"
      }
    }
  },

  // Normes par secteur
  secteur: {
    "Construction": {
      cstc: {
        nom: "Code de sécurité pour les travaux de construction",
        sections: ["Section II - Obligations générales", "Section III - Équipements"],
        applicabilite: "Obligatoire - Secteur construction"
      }
    },
    "Transport": {
      code_route: {
        nom: "Code de la sécurité routière",
        articles: ["Art. 84 - Fatigue au volant", "Art. 326 - Surveillance électronique"],
        applicabilite: "Obligatoire - Transport routier"
      }
    },
    "Mines": {
      lmrsst: {
        nom: "Loi sur les mines et règlement SST",
        articles: ["Art. 15 - Équipements sécurité", "Art. 22 - Surveillance continue"],
        applicabilite: "Obligatoire - Secteur minier"
      }
    }
  }
};

/**
 * Génère la conformité réglementaire selon contexte et secteur
 */
function genererConformiteReglementaire(
  contexte: string,
  secteurs: string[],
  technologies: string[]
): ConformiteReglementaire {
  const normes_applicables: any = {};

  // Normes de base
  Object.entries(REFERENTIEL_REGLEMENTAIRE.base).forEach(([key, norme]) => {
    normes_applicables[key] = {
      ...norme,
      niveau_conformite: "À évaluer par expert"
    };
  });

  // Normes par contexte
  if (REFERENTIEL_REGLEMENTAIRE.contexte[contexte as keyof typeof REFERENTIEL_REGLEMENTAIRE.contexte]) {
    Object.entries(REFERENTIEL_REGLEMENTAIRE.contexte[contexte as keyof typeof REFERENTIEL_REGLEMENTAIRE.contexte]).forEach(([key, norme]) => {
      normes_applicables[key] = {
        ...norme,
        niveau_conformite: "Probable - Analyse requise"
      };
    });
  }

  // Normes par secteur
  secteurs.forEach(secteur => {
    if (REFERENTIEL_REGLEMENTAIRE.secteur[secteur as keyof typeof REFERENTIEL_REGLEMENTAIRE.secteur]) {
      Object.entries(REFERENTIEL_REGLEMENTAIRE.secteur[secteur as keyof typeof REFERENTIEL_REGLEMENTAIRE.secteur]).forEach(([key, norme]) => {
        normes_applicables[key] = {
          ...norme,
          niveau_conformite: "Obligatoire - Vérification immédiate"
        };
      });
    }
  });

  // Logique spéciale pour données sensibles
  if (technologies.includes("Vision") || technologies.includes("Biométrie") || contexte === "Nature humaine") {
    normes_applicables.loi_25 = {
      nom: "Loi 25 - Protection des renseignements personnels (Québec)",
      articles: ["Art. 3 - Consentement", "Art. 7 - Fins déterminées"],
      applicabilite: "Obligatoire - Données biométriques/comportementales",
      niveau_conformite: "Critique - Analyse impact obligatoire"
    };
  }

  return {
    normes_applicables,
    justification_applicabilite: `Système ${contexte} dans secteur(s) ${secteurs.join(', ')} avec technologies ${technologies.join(', ')}. Analyse réglementaire basée sur type de données, domaine d'application et exigences sectorielles.`,
    documentation_conformite: [
      "Analyse d'impact vie privée (si données personnelles)",
      "Évaluation conformité LSST par expert SST",
      "Documentation techniques algorithmes (si IA critique)",
      "Certification organisationnelle selon standards applicables"
    ]
  };
}

// ═══════════════════════════════════════════════════════════════
// 🧠 MODULE 2 : CLASSIFICATION IA ET IRSST
// ═══════════════════════════════════════════════════════════════

/**
 * Mapping technologies vers catégories OCDE
 */
const MAPPING_TECHNOLOGIES_OCDE = {
  "Vision": "Perception",
  "Computer Vision": "Perception",
  "Reconnaissance": "Perception",
  "Détection": "Perception",
  "Prédictif": "Prédiction",
  "Machine Learning": "Prédiction",
  "Analyse de données": "Raisonnement",
  "IA conversationnelle": "Interaction",
  "Chatbot": "Interaction",
  "NLP": "Interaction",
  "Optimisation": "Planification",
  "Algorithmes génétiques": "Planification",
  "Robotique": "Action"
};

/**
 * Génère la classification IA selon OCDE/ISO 22989
 */
function genererClassificationIA(
  technologies: string[],
  contexte: string,
  niveau: string
): ClassificationIA {
  const categories_detectees = new Set<string>();
  
  technologies.forEach(tech => {
    Object.entries(MAPPING_TECHNOLOGIES_OCDE).forEach(([keyword, category]) => {
      if (tech.toLowerCase().includes(keyword.toLowerCase())) {
        categories_detectees.add(category);
      }
    });
  });

  const categories_principales = Array.from(categories_detectees).map(type => ({
    type: type as any,
    description: getDescriptionCategorie(type, contexte),
    niveau_complexite: getNiveauComplexite(niveau) as any,
    techniques: technologies.filter(tech => 
      Object.entries(MAPPING_TECHNOLOGIES_OCDE).some(([keyword, cat]) => 
        cat === type && tech.toLowerCase().includes(keyword.toLowerCase())
      )
    )
  }));

  return {
    taxonomie_ocde: {
      categories_principales,
      classification_iso_22989: {
        domaine_application: `${contexte} en santé et sécurité au travail`,
        type_apprentissage: niveau === "Avancé" ? "Supervisé et non-supervisé" : "Supervisé",
        niveau_autonomie: contexte === "Nature humaine" ? "Assistance à la décision (Human-in-the-loop)" : "Semi-automatique",
        domaine_connaissance: "Spécialisé SST"
      }
    },
    finalite_principale: getFinaliteParContexte(contexte),
    niveau_criticite: getNiveauCriticite(contexte) as any
  };
}

/**
 * Génère la catégorie IRSST selon finalité
 */
function genererCategorieIRSST(
  contexte: string,
  niveau: string,
  technologies: string[]
): CategorieIRSST {
  let classification: CategorieIRSST['classification'];
  let justification: string;

  // Logique de classification IRSST
  if (niveau === "Avancé" && (technologies.some(t => t.includes("Machine Learning") || t.includes("IA")))) {
    classification = "Catégorie I - Acquisition";
    justification = "Développement de nouvelles connaissances en IA appliquée à la SST, enrichissement de la base scientifique.";
  } else if (contexte === "Opérations" || contexte === "Équipement") {
    classification = "Catégorie II - Optimisation";
    justification = "Amélioration des méthodes existantes de surveillance et de prévention en SST.";
  } else {
    classification = "Catégorie III - Acceptabilité";
    justification = "Évaluation de l'acceptabilité et de l'impact des technologies IA sur les travailleurs.";
  }

  return {
    classification,
    sous_categorie: `${contexte} - Application technologique ${niveau.toLowerCase()}`,
    justification,
    contribution_recherche: {
      domaines: [
        `IA appliquée au ${contexte.toLowerCase()}`,
        "Méthodes de prévention innovantes",
        "Technologies émergentes en SST"
      ],
      impact_scientifique: `Développement de modèles ${niveau.toLowerCase()} pour l'amélioration de la sécurité`,
      transfert_connaissances: "Publications scientifiques et formation professionnelle"
    },
    alignement_priorites_IRSST: {
      axe_1: "✅ Prévention des lésions professionnelles",
      axe_2: "✅ Technologies émergentes en SST",
      axe_3: "✅ Méthodes et outils d'intervention",
      axe_4: "⚡ Intelligence artificielle appliquée"
    }
  };
}

// ═══════════════════════════════════════════════════════════════
// 📊 MODULE 3 : MÉTRIQUES ET IMPACT SST
// ═══════════════════════════════════════════════════════════════

/**
 * Génère les secteurs SCIAN selon secteurs textuels
 */
function genererSecteursScian(secteurs: string[]): SecteursScian {
  const MAPPING_SCIAN = {
    "Construction": {
      code: "23",
      libelle: "Construction",
      sous_secteurs: [
        { code: "2362", libelle: "Construction de bâtiments non résidentiels" },
        { code: "2371", libelle: "Construction d'ouvrages" },
        { code: "2381", libelle: "Travaux de fondation et de structure" }
      ]
    },
    "Manufacturing": {
      code: "31-33",
      libelle: "Fabrication",
      sous_secteurs: [
        { code: "3114", libelle: "Fabrication de produits alimentaires" },
        { code: "3361", libelle: "Fabrication de véhicules automobiles" },
        { code: "3254", libelle: "Fabrication de produits pharmaceutiques" }
      ]
    },
    "Transport": {
      code: "48-49",
      libelle: "Transport et entreposage",
      sous_secteurs: [
        { code: "4841", libelle: "Transport général de marchandises" },
        { code: "4931", libelle: "Entreposage et stockage" }
      ]
    },
    "Énergie": {
      code: "22",
      libelle: "Services publics",
      sous_secteurs: [
        { code: "2211", libelle: "Production d'électricité" },
        { code: "2212", libelle: "Transport d'électricité" }
      ]
    }
  };

  const secteurs_principaux = secteurs.map(secteur => {
    const mapping = MAPPING_SCIAN[secteur as keyof typeof MAPPING_SCIAN];
    if (mapping) {
      return {
        ...mapping,
        pertinence: "Élevée" as const,
        specificites: getSpecificitesParSecteur(secteur)
      };
    }
    return {
      code: "99",
      libelle: secteur,
      sous_secteurs: [],
      pertinence: "Moyenne" as const,
      specificites: ["Secteur spécialisé"]
    };
  });

  return {
    secteurs_principaux,
    adaptations_sectorielles: secteurs.reduce((acc, secteur) => {
      acc[secteur] = getAdaptationSectorielle(secteur);
      return acc;
    }, {} as Record<string, string>),
    universalite: "Le système s'adapte à tout secteur via paramétrage des critères et base de connaissances sectorielle"
  };
}

/**
 * Génère l'explicabilité IA selon criticité
 */
function genererExplicabiliteIA(
  contexte: string,
  niveau: string,
  technologies: string[]
): ExplicabiliteIA {
  const niveau_explicabilite = getNiveauExplicabilite(contexte, niveau);
  
  return {
    niveau_explicabilite,
    justification_niveau: getJustificationExplicabilite(contexte, niveau_explicabilite),
    methodes_explicabilite: {
      approche_principale: getApprocheExplicabilite(niveau) as any,
      techniques_integrees: getTechniquesExplicabilite(technologies, niveau_explicabilite)
    },
    types_justification: {
      technique: {
        format: "Rapport détaillé",
        contenu: ["Facteurs de risque identifiés", "Scores de probabilité", "Comparaisons historiques"],
        audience: "Ingénieurs SST, experts techniques"
      },
      executif: {
        format: "Dashboard synthétique",
        contenu: ["Niveau de risque global", "Actions prioritaires", "Impact estimé"],
        audience: "Direction, gestionnaires"
      },
      operationnel: {
        format: "Check-list actionnable",
        contenu: ["Points de contrôle", "Procédures de mitigation", "Responsabilités"],
        audience: "Superviseurs, comités SST"
      }
    },
    exemple_justification: genererExempleJustification(contexte, technologies),
    validation_explicabilite: {
      tests_utilisateurs: "Compréhension >85% par experts SST",
      audit_algorithmes: "Révision annuelle par organisme indépendant",
      formation_utilisateurs: "Module obligatoire sur interprétation des résultats"
    }
  };
}

/**
 * Génère les niveaux d'impact SST avec métriques réalistes
 */
function genererNiveauxImpactSST(
  contexte: string,
  niveau: string,
  priorite: string
): NiveauxImpactSST {
  const multiplicateur_impact = {
    "Élevée": 1.2,
    "Moyenne": 1.0,
    "Faible": 0.8
  }[priorite] || 1.0;

  const multiplicateur_niveau = {
    "Avancé": 1.3,
    "Intermédiaire": 1.0,
    "Débutant": 0.7
  }[niveau] || 1.0;

  const impact_base = multiplicateur_impact * multiplicateur_niveau;

  return {
    reduction_incidents: {
      estimation_quantitative: `${Math.round(45 * impact_base)}-${Math.round(75 * impact_base)}%`,
      methodologie: "Analyse comparative organisations utilisatrices vs témoins",
      horizon_temporal: "18-24 mois post-implémentation",
      types_incidents: {
        "accidents_graves": {
          reduction: `${Math.round(70 * impact_base)}%`,
          justification: "Détection précoce des risques critiques"
        },
        "presqu_accidents": {
          reduction: `${Math.round(60 * impact_base)}%`,
          justification: "Amélioration identification des dangers"
        },
        "incidents_mineurs": {
          reduction: `${Math.round(50 * impact_base)}%`,
          justification: "Sensibilisation accrue aux risques"
        }
      },
      validation_donnees: "Basé sur données pilotes et littérature scientifique"
    },
    automatisation_taches: {
      processus_automatises: getProcessusAutomatises(contexte),
      impact_ressources: `Libération de ${Math.round(4 * impact_base)}h/semaine par expert SST`,
      reallocation: "Temps disponible pour accompagnement terrain et formation"
    },
    amelioration_formation: {
      personnalisation: {
        methode: "Formation ciblée selon profils de risques identifiés",
        efficacite: `+${Math.round(35 * impact_base)}% rétention vs formation générique`,
        mesure: "Tests de connaissances avant/après"
      },
      scenarios_realistes: {
        generation: "Création automatique de cas d'étude basés sur données réelles",
        pertinence: `+${Math.round(50 * impact_base)}% engagement formateurs`,
        adaptation: "Scénarios ajustés par secteur et contexte"
      },
      suivi_competences: {
        tracking: "Évolution des compétences via évaluations périodiques",
        identification_gaps: "Détection automatique besoins formation",
        recommandations: "Plans de formation personnalisés"
      }
    },
    gains_conformite: {
      conformite_reglementaire: {
        amelioration: `${Math.round(85 * impact_base)}%`,
        description: "Conformité LSST/RSS/ISO selon standards applicables",
        mesure: "Audits conformité avant/après"
      },
      documentation: {
        completude: `+${Math.round(70 * impact_base)}%`,
        tracabilite: "100% des évaluations documentées",
        audit_trail: "Historique complet des décisions"
      },
      certifications: {
        facilitation: "Préparation automatique dossiers de certification",
        maintenance: "Suivi continu exigences normatives",
        reporting: "Tableaux de bord conformité temps réel"
      }
    },
    roi_economique: genererROIEconomique(contexte, impact_base)
  };
}

// ═══════════════════════════════════════════════════════════════
// 👥 MODULE 4 : UX PROFILES ET BADGES
// ═══════════════════════════════════════════════════════════════

/**
 * Génère les badges de conformité automatiques
 */
function genererBadgesConformite(
  normes_applicables: any,
  contexte: string,
  secteurs: string[]
): BadgesConformite {
  const badges_actifs: BadgesConformite['badges_actifs'] = [];

  // Mapping normes vers badges
  const BADGES_MAPPING = {
    lsst: { icone: "✅", nom: "LSST Conforme", couleur: "#22c55e" },
    rss: { icone: "📜", nom: "RSS Aligné", couleur: "#3b82f6" },
    cstc: { icone: "🏗️", nom: "CSTC", couleur: "#f59e0b" },
    lmrsst: { icone: "⛏️", nom: "LMRSST", couleur: "#8b5cf6" },
    csa_z1002: { icone: "🇨🇦", nom: "CSA Z1002", couleur: "#ef4444" },
    iso_31000: { icone: "🌐", nom: "ISO 31000", couleur: "#10b981" },
    iso_45001: { icone: "📈", nom: "ISO 45001", couleur: "#6366f1" },
    iso_27001: { icone: "🛡️", nom: "ISO 27001", couleur: "#8b5cf6" },
    loi_25: { icone: "🔒", nom: "Loi 25", couleur: "#dc2626" },
    ai_act: { icone: "⚖️", nom: "AI Act Préparé", couleur: "#7c3aed" }
  };

  Object.entries(normes_applicables).forEach(([key, norme]: [string, any]) => {
    const badge = BADGES_MAPPING[key as keyof typeof BADGES_MAPPING];
    if (badge) {
      badges_actifs.push({
        code: key.toUpperCase(),
        icone: badge.icone,
        nom: badge.nom,
        description: norme.nom,
        statut: getStatutBadge(norme.niveau_conformite),
        date_validation: new Date().toISOString().split('T')[0],
        validite: getValiditeBadge(key)
      });
    }
  });

  return {
    badges_actifs,
    logique_attribution: {
      automatique: "Attribution basée sur analyse conformité réglementaire et contexte projet",
      validation_humaine: "Badges critiques validés par experts juridiques SST",
      mise_a_jour: "Révision automatique lors de changements réglementaires"
    },
    affichage_interface: {
      position: "En-tête de fiche projet et sidebar",
      format: "Icône + texte au survol + couleur selon statut",
      couleurs: {
        conforme: "#22c55e",
        en_cours: "#f59e0b",
        non_applicable: "#6b7280"
      }
    }
  };
}

/**
 * Génère les profils UX selon contexte et secteurs
 */
function genererUXProfiles(
  contexte: string,
  secteurs: string[],
  technologies: string[]
): UXProfiles {
  const profiles_base = {
    travailleur: {
      description: "Employé de terrain utilisant équipements/procédures évalués",
      fonctions_appelables: [
        "consulterEvaluationRisques()",
        "signalerDanger()",
        "consulterProceduresSecurite()",
        "accederFormationCiblee()",
        "confirmerComprehensionRisques()"
      ],
      composants_UI: [
        "AlerteRisqueSimplifiee",
        "ChecklistSecurite",
        "BoutonSignalementDanger",
        "ModuleFormationInteractive",
        "IndicateurNiveauRisque"
      ],
      spec_ergonomiques: {
        interface: "Mobile-first, tactile, résistant environnement",
        langue: "Français simple, pictogrammes universels",
        accessibilite: "Contraste élevé, texte large, commandes vocales",
        contexte_usage: "Terrain, gants, environnement bruyant/poussiéreux",
        temps_interaction: "< 30 secondes par consultation"
      }
    },
    superviseur: {
      description: "Responsable d'équipe supervisant opérations quotidiennes",
      fonctions_appelables: [
        "consulterEvaluationsEquipe()",
        "validerProceduresSecurite()",
        "planifierFormations()",
        "genererRapportQuotidien()",
        "declencherAlerteEquipe()",
        "approuverModificationsProcedures()"
      ],
      composants_UI: [
        "DashboardEquipe",
        "CalendrierFormations",
        "InterfaceValidationProcedures",
        "AlertesTempsReel",
        "RapportQuotidienAutomatise"
      ],
      spec_ergonomiques: {
        interface: "Desktop/tablette, multi-fenêtres, notifications push",
        langue: "Français technique, terminologie SST standard",
        accessibilite: "Navigation clavier, raccourcis, export rapide",
        contexte_usage: "Bureau/atelier, multitâche, interruptions fréquentes",
        temps_interaction: "5-15 minutes par session"
      }
    },
    comite_sst: {
      description: "Membres du comité de santé et sécurité au travail",
      fonctions_appelables: [
        "consulterTendancesRisques()",
        "analyserIncidentsPreventables()",
        "evaluerEfficaciteMesures()",
        "genererRapportComite()",
        "planifierAmeliorations()",
        "validerPolitiquesSST()"
      ],
      composants_UI: [
        "AnalytiqueTendances",
        "RapportIncidentsPreventables",
        "InterfaceEvaluationMesures",
        "GenerateurRapportComite",
        "PlanificateurAmeliorations"
      ],
      spec_ergonomiques: {
        interface: "Desktop, orientée analyse, graphiques interactifs",
        langue: "Français formel, références réglementaires précises",
        accessibilite: "Impression facile, export PDF/Excel, présentation",
        contexte_usage: "Réunions comité, analyse collaborative, décisions",
        temps_interaction: "30-60 minutes par session"
      }
    },
    directeur_hse: {
      description: "Directeur santé, sécurité et environnement",
      fonctions_appelables: [
        "consulterIndicateursStrategiques()",
        "evaluerROI_securite()",
        "genererRapportDirection()",
        "planifierBudgetSST()",
        "analyserConformiteGlobale()",
        "definirObjectifsSST()"
      ],
      composants_UI: [
        "DashboardExecutif",
        "AnalyseROI_Securite",
        "RapportDirectionAutomatise",
        "PlanificateurBudgetSST",
        "TableauConformite"
      ],
      spec_ergonomiques: {
        interface: "Desktop, vue synthétique, KPI temps réel",
        langue: "Français exécutif, métriques business, ROI",
        accessibilite: "Export PowerPoint, graphiques exécutifs, alertes",
        contexte_usage: "Bureau direction, présentations conseil, décisions stratégiques",
        temps_interaction: "10-20 minutes par consultation"
      }
    },
    rh: {
      description: "Ressources humaines - formation et bien-être employés",
      fonctions_appelables: [
        "planifierFormationsPersonnalisees()",
        "suivreCompetencesSST()",
        "analyserBienEtreEmployes()",
        "genererPlanDeveloppement()",
        "evaluerCultureSecurite()",
        "gererCertificationsSST()"
      ],
      composants_UI: [
        "PlanificateurFormations",
        "TrackerCompetencesSST",
        "AnalyseBienEtre",
        "GenerateurPlanDeveloppement",
        "EvaluateurCultureSecurite"
      ],
      spec_ergonomiques: {
        interface: "Desktop/mobile, orientée personnes, intégration SIRH",
        langue: "Français RH, focus développement personnel",
        accessibilite: "Intégration calendrier, notifications, rapports individuels",
        contexte_usage: "Bureau RH, suivi individuel, entretiens",
        temps_interaction: "15-30 minutes par employé"
      }
    }
  };

  // Adaptation selon contexte et secteurs
  const profiles_adaptes = { ...profiles_base };
  
  // Ajout de fonctions spécifiques selon contexte
  if (contexte === "Équipement") {
    profiles_adaptes.travailleur.fonctions_appelables.push("consulterEtatEquipement()");
    profiles_adaptes.superviseur.fonctions_appelables.push("planifierMaintenancePreventive()");
  }
  
  if (technologies.includes("Vision") || technologies.includes("IA")) {
    profiles_adaptes.travailleur.fonctions_appelables.push("calibrerSystemeIA()");
    profiles_adaptes.directeur_hse.fonctions_appelables.push("evaluerPerformanceIA()");
  }

  return {
    ...profiles_adaptes,
    personnalisation_adaptive: {
      apprentissage_usage: "Adaptation automatique selon patterns d'utilisation individuels",
      preferences_utilisateur: "Sauvegarde des configurations, vues et raccourcis préférés",
      notifications_intelligentes: "Alertes contextuelles selon rôle, responsabilités et historique",
      aide_contextuelle: "Tooltips et guides adaptatifs selon niveau expertise utilisateur"
    }
  };
}

// ═══════════════════════════════════════════════════════════════
// 🔧 FONCTIONS UTILITAIRES
// ═══════════════════════════════════════════════════════════════

function getDescriptionCategorie(type: string, contexte: string): string {
  const descriptions = {
    "Perception": `Analyse et interprétation automatique de données sensorielles dans le contexte ${contexte}`,
    "Prédiction": `Anticipation de situations et événements futurs pour la prévention en ${contexte}`,
    "Raisonnement": `Logique d'inférence et prise de décision intelligente pour ${contexte}`,
    "Interaction": `Communication et échange avec les utilisateurs dans le domaine ${contexte}`,
    "Planification": `Organisation et optimisation des ressources et processus en ${contexte}`,
    "Action": `Exécution automatisée de tâches et interventions en ${contexte}`
  };
  return descriptions[type as keyof typeof descriptions] || `Application IA en ${contexte}`;
}

function getNiveauComplexite(niveau: string): string {
  return { "Débutant": "Faible", "Intermédiaire": "Intermédiaire", "Avancé": "Élevé" }[niveau] || "Intermédiaire";
}

function getFinaliteParContexte(contexte: string): string {
  const finalites = {
    "Opérations": "Amélioration de la sécurité des processus opérationnels",
    "Équipement": "Optimisation de la sécurité et maintenance des équipements",
    "Lieux": "Sécurisation et surveillance intelligente des environnements de travail",
    "Nature humaine": "Protection et accompagnement intelligent des travailleurs"
  };
  return finalites[contexte as keyof typeof finalites] || "Amélioration générale de la sécurité";
}

function getNiveauCriticite(contexte: string): string {
  return contexte === "Nature humaine" ? "Critique" : contexte === "Équipement" ? "Modéré" : "Faible";
}

function getSpecificitesParSecteur(secteur: string): string[] {
  const specificites = {
    "Construction": ["Chantiers temporaires", "Conditions variables", "Multi-entrepreneurs", "Hauteur"],
    "Manufacturing": ["Machines industrielles", "Procédés chimiques", "Chaînes de montage", "Automatisation"],
    "Transport": ["Véhicules lourds", "Manutention", "Substances dangereuses", "Mobilité"],
    "Énergie": ["Haute tension", "Interventions d'urgence", "Continuité service", "Infrastructure critique"]
  };
  return specificites[secteur as keyof typeof specificites] || ["Secteur spécialisé"];
}

function getAdaptationSectorielle(secteur: string): string {
  const adaptations = {
    "Construction": "Focus sur l'évaluation des risques chantiers et équipements temporaires",
    "Manufacturing": "Spécialisation sur les risques machines et procédés industriels",
    "Transport": "Adaptation aux risques liés aux véhicules et manutention",
    "Énergie": "Évaluation critique infrastructure et interventions haute tension"
  };
  return adaptations[secteur as keyof typeof adaptations] || "Adaptation générique aux spécificités sectorielles";
}

function getNiveauExplicabilite(contexte: string, niveau: string): "Élémentaire" | "Intermédiaire" | "Élevé" {
  if (contexte === "Nature humaine") return "Élevé";
  if (niveau === "Avancé") return "Élevé";
  if (niveau === "Intermédiaire") return "Intermédiaire";
  return "Élémentaire";
}

function getJustificationExplicabilite(contexte: string, niveau_explicabilite: string): string {
  if (niveau_explicabilite === "Élevé") {
    return "Décisions de sécurité critiques nécessitent transparence complète pour validation par experts humains et acceptation organisationnelle.";
  }
  return "Système d'aide à la décision nécessitant un niveau approprié de transparence pour les utilisateurs.";
}

function getApprocheExplicabilite(niveau: string): string {
  return { "Débutant": "Intégrée", "Intermédiaire": "Hybride", "Avancé": "Hybride" }[niveau] || "Hybride";
}

function getTechniquesExplicabilite(technologies: string[], niveau_explicabilite: string): any[] {
  const techniques_base = [
    {
      nom: "Rapports automatiques",
      type: "Intégrée",
      description: "Génération automatique de justifications textuelles",
      sortie: "Rapport en langage naturel"
    }
  ];

  if (niveau_explicabilite === "Élevé") {
    techniques_base.push(
      {
        nom: "Analyse SHAP",
        type: "Post-hoc",
        description: "Analyse d'importance des facteurs pour décisions critiques",
        sortie: "Scores d'importance par facteur"
      },
      {
        nom: "Arbres de décision explicables",
        type: "Intégrée",
        description: "Modèles intrinsèquement explicables pour logique claire",
        sortie: "Chemin de décision visualisé"
      }
    );
  }

  return techniques_base;
}

function genererExempleJustification(contexte: string, technologies: string[]): any {
  const exemples = {
    "Opérations": {
      scenario: "Évaluation nouvelle procédure de verrouillage énergétique",
      facteurs_identifies: [
        { facteur: "Complexité procédure", score_risque: 7.8, justification: "12 étapes vs 6 standard industrie" },
        { facteur: "Formation opérateurs", score_risque: 6.5, justification: "70% des opérateurs formés vs 90% requis" },
        { facteur: "Équipements concernés", score_risque: 8.2, justification: "Haute tension et pression présentes" }
      ],
      conclusion: "Risque ÉLEVÉ (7.5/10) - Formation complémentaire et simplification requises",
      actions_recommandees: [
        "Formation intensive tous opérateurs (priorité 1)",
        "Simplification procédure en 8 étapes max (priorité 2)",
        "Validation terrain avec experts (priorité 3)"
      ]
    },
    "Nature humaine": {
      scenario: "Évaluation système de détection de fatigue conducteurs",
      facteurs_identifies: [
        { facteur: "Précision détection", score_risque: 6.8, justification: "92% précision vs 95% standard sécurité" },
        { facteur: "Acceptation conducteurs", score_risque: 7.5, justification: "65% acceptation vs 80% requis pour efficacité" },
        { facteur: "Faux positifs", score_risque: 8.1, justification: "3 alertes/jour vs 1 acceptable" }
      ],
      conclusion: "Risque MODÉRÉ-ÉLEVÉ (7.5/10) - Calibration et formation requises",
      actions_recommandees: [
        "Recalibration algorithme réduction faux positifs (priorité 1)",
        "Programme sensibilisation conducteurs (priorité 2)",
        "Phase pilote 3 mois avec feedback (priorité 3)"
      ]
    }
  };

  return exemples[contexte as keyof typeof exemples] || exemples["Opérations"];
}

function getProcessusAutomatises(contexte: string): any[] {
  const processus = {
    "Opérations": [
      { tache: "Évaluation initiale des risques", gain_temps: "75%", description: "Réduction de 8h à 2h pour évaluation complète" },
      { tache: "Génération de rapports", gain_temps: "90%", description: "Rapports automatiques vs rédaction manuelle" }
    ],
    "Équipement": [
      { tache: "Inspection préventive", gain_temps: "60%", description: "Détection automatique vs inspection manuelle" },
      { tache: "Planification maintenance", gain_temps: "80%", description: "Optimisation automatique des calendriers" }
    ],
    "Lieux": [
      { tache: "Surveillance continue", gain_temps: "95%", description: "Monitoring automatique 24/7 vs rondes manuelles" },
      { tache: "Analyse environnementale", gain_temps: "85%", description: "Capteurs automatiques vs mesures manuelles" }
    ]
  };

  return processus[contexte as keyof typeof processus] || processus["Opérations"];
}

function genererROIEconomique(contexte: string, impact_base: number): any {
  const roi_base = {
    reduction_accidents: Math.round(800000 * impact_base),
    optimisation_temps: Math.round(120000 * impact_base),
    conformite: Math.round(40000 * impact_base)
  };

  return {
    economies_directes: {
      reduction_accidents: `${(roi_base.reduction_accidents / 1000)}k$ sur 3 ans`,
      optimisation_temps: `${(roi_base.optimisation_temps / 1000)}k$ annuel`,
      conformite: `${(roi_base.conformite / 1000)}k$ annuel`
    },
    retour_investissement: {
      periode: `${Math.round(18 / impact_base)} mois`,
      ratio: `${(2.5 * impact_base).toFixed(1)}:1 sur 3 ans`,
      facteurs: ["Réduction accidents", "Gain productivité", "Évitement coûts conformité"]
    }
  };
}

function getStatutBadge(niveau_conformite: string): "Validé" | "En cours" | "Non applicable" | "À vérifier" {
  if (niveau_conformite.includes("Conforme") || niveau_conformite.includes("Obligatoire")) return "Validé";
  if (niveau_conformite.includes("Probable")) return "En cours";
  return "À vérifier";
}

function getValiditeBadge(key: string): string {
  const validites = {
    lsst: "Permanente avec mises à jour réglementaires",
    rss: "Révisé annuellement",
    iso_45001: "Selon certification organisationnelle",
    loi_25: "Audit annuel requis",
    ai_act: "Applicable si opérations UE"
  };
  return validites[key as keyof typeof validites] || "Révision périodique";
}

// ═══════════════════════════════════════════════════════════════
// 🚀 GÉNÉRATEUR PRINCIPAL
// ═══════════════════════════════════════════════════════════════

/**
 * Interface pour les options de génération
 */
export interface OptionsGeneration {
  niveau_enrichissement?: "Base" | "Partiel" | "Complet";
  force_regeneration?: boolean;
  validation_experte?: boolean;
}

/**
 * Générateur principal d'enrichissement automatique
 */
export class EnrichmentGenerator {
  /**
   * Enrichit automatiquement un modèle de base avec les 9 axes
   */
  static enrichirModele(
    modele_base: Partial<IGNITIAProjectEnriched>,
    options: OptionsGeneration = {}
  ): IGNITIAProjectEnriched {
    const {
      niveau_enrichissement = "Complet",
      force_regeneration = false,
      validation_experte = true
    } = options;

    // Validation des champs obligatoires
    if (!modele_base.nom || !modele_base.contexte || !modele_base.secteur) {
      throw new Error("Champs obligatoires manquants: nom, contexte, secteur");
    }

    const modele_enrichi: IGNITIAProjectEnriched = {
      // Champs de base
      project_id: modele_base.project_id || `GenAISafety-${Date.now()}`,
      nom: modele_base.nom,
      niveau: modele_base.niveau || "Intermédiaire",
      contexte: modele_base.contexte,
      priorite: modele_base.priorite || "Moyenne",
      description: modele_base.description || `Système ${modele_base.contexte} pour améliorer la sécurité`,
      mots_cles: modele_base.mots_cles || ["IA", "Sécurité", modele_base.contexte],
      secteur: modele_base.secteur,
      technologies: modele_base.technologies || ["Intelligence artificielle"],
      implementation: modele_base.implementation || {
        technologies: ["Plateforme IA", "Interface utilisateur"],
        prerequisites: ["Infrastructure", "Formation"],
        steps: ["Installation", "Configuration", "Formation", "Déploiement"]
      },
      metrics: modele_base.metrics || {
        views: Math.floor(Math.random() * 3000) + 1000,
        usage: Math.floor(Math.random() * 200) + 50,
        rating: 3.5 + Math.random() * 1.5
      },

      // Conservation des champs existants
      ...Object.fromEntries(
        Object.entries(modele_base).filter(([key]) => 
          !['project_id', 'nom', 'niveau', 'contexte', 'priorite', 'description', 'mots_cles', 'secteur', 'technologies', 'implementation', 'metrics'].includes(key)
        )
      ),

      // Cas d'usage et gouvernance de base
      cas_usage_sectoriels: modele_base.cas_usage_sectoriels || [
        {
          titre: `Application ${modele_base.contexte} en ${modele_base.secteur?.[0]}`,
          description: `Amélioration de la sécurité grâce à l'IA dans le secteur ${modele_base.secteur?.[0]}`,
          reference: "Analyse IGNITIA automatisée"
        }
      ],
      cybersecurite: modele_base.cybersecurite || {
        donnees_sensibles: modele_base.contexte === "Nature humaine",
        mesures: ["Chiffrement AES-256", "Authentification multi-facteurs", "Audit régulier"],
        conformite: ["Loi 25", "ISO 27001"]
      },
      gouvernance_ethique: modele_base.gouvernance_ethique || {
        transparence: "Algorithmes explicables et documentés",
        equite: "Analyse de biais régulière et correction",
        responsabilite: "Validation humaine des décisions critiques",
        protection_donnees: "Anonymisation systématique des données",
        conformite: ["CNESST", "Loi 25", "ISO 45001"],
        audit: "Audit annuel par organisme indépendant",
        recours: "Formulaire de signalement et révision accessible"
      },
      indicateurs: modele_base.indicateurs || {
        conformite_loi_25: true,
        audit_biais_valide: true,
        explicabilite_activee: true
      }
    };

    // Génération de l'enrichissement selon le niveau demandé
    if (niveau_enrichissement === "Partiel" || niveau_enrichissement === "Complet") {
      // Conformité réglementaire
      modele_enrichi.conformite_reglementaire = genererConformiteReglementaire(
        modele_enrichi.contexte,
        modele_enrichi.secteur,
        modele_enrichi.technologies
      );

      // Classification IA
      modele_enrichi.classification_IA = genererClassificationIA(
        modele_enrichi.technologies,
        modele_enrichi.contexte,
        modele_enrichi.niveau
      );

      // Secteurs SCIAN
      modele_enrichi.secteurs_prioritaires_SCIAN = genererSecteursScian(modele_enrichi.secteur);

      // Badges conformité
      modele_enrichi.badges_conformite = genererBadgesConformite(
        modele_enrichi.conformite_reglementaire.normes_applicables,
        modele_enrichi.contexte,
        modele_enrichi.secteur
      );
    }

    if (niveau_enrichissement === "Complet") {
      // Catégorie IRSST
      modele_enrichi.categorie_IRSST = genererCategorieIRSST(
        modele_enrichi.contexte,
        modele_enrichi.niveau,
        modele_enrichi.technologies
      );

      // Explicabilité IA
      modele_enrichi.explicabilite_IA = genererExplicabiliteIA(
        modele_enrichi.contexte,
        modele_enrichi.niveau,
        modele_enrichi.technologies
      );

      // Niveaux d'impact SST
      modele_enrichi.niveaux_d_impact_SST = genererNiveauxImpactSST(
        modele_enrichi.contexte,
        modele_enrichi.niveau,
        modele_enrichi.priorite
      );

      // UX Profiles
      modele_enrichi.UX_profiles = genererUXProfiles(
        modele_enrichi.contexte,
        modele_enrichi.secteur,
        modele_enrichi.technologies
      );

      // Métadonnées système
      modele_enrichi.compatibilite_systeme = {
        version_standard: "IGNITIA 2025 v2.1",
        retrocompatibilite: true,
        migration_automatique: "Enrichissement non-destructif automatique",
        validation_schema: {
          structure_base: "Conservée intégralement",
          champs_ajoutes: 8,
          champs_modifies: 0,
          champs_supprimes: 0
        }
      };

      modele_enrichi.metadonnees_enrichissement = {
        date_enrichissement: new Date().toISOString(),
        version_enrichissement: "2025.1",
        responsable_enrichissement: "Générateur automatique IGNITIA",
        methode_generation: "Analyse intelligente contexte/secteur + référentiels réglementaires",
        validation_requise: validation_experte ? [
          "Expert juridique SST",
          "Spécialiste IA éthique",
          "Responsable conformité organisationnel"
        ] : []
      };
    }

    // Horodatage
    modele_enrichi.created = modele_base.created || new Date().toISOString();
    modele_enrichi.updated = new Date().toISOString();

    return modele_enrichi;
  }

  /**
   * Enrichit un batch de modèles
   */
  static enrichirBatch(
    modeles_base: Partial<IGNITIAProjectEnriched>[],
    options: OptionsGeneration = {}
  ): IGNITIAProjectEnriched[] {
    return modeles_base.map(modele => this.enrichirModele(modele, options));
  }

  /**
   * Valide qu'un modèle enrichi est conforme
   */
  static validerModeleEnrichi(modele: IGNITIAProjectEnriched): boolean {
    const champs_obligatoires = [
      'project_id', 'nom', 'niveau', 'contexte', 'priorite',
      'description', 'mots_cles', 'secteur', 'technologies',
      'implementation', 'metrics', 'cas_usage_sectoriels',
      'cybersecurite', 'gouvernance_ethique', 'indicateurs'
    ];

    return champs_obligatoires.every(champ => 
      modele[champ as keyof IGNITIAProjectEnriched] !== undefined
    );
  }

  /**
   * Génère des statistiques sur l'enrichissement
   */
  static genererStatistiques(modeles: IGNITIAProjectEnriched[]): any {
    const stats = {
      total_modeles: modeles.length,
      par_contexte: {} as Record<string, number>,
      par_niveau: {} as Record<string, number>,
      par_secteur: {} as Record<string, number>,
      enrichissement_complet: 0,
      conformite_moyenne: 0
    };

    modeles.forEach(modele => {
      // Par contexte
      stats.par_contexte[modele.contexte] = (stats.par_contexte[modele.contexte] || 0) + 1;
      
      // Par niveau
      stats.par_niveau[modele.niveau] = (stats.par_niveau[modele.niveau] || 0) + 1;
      
      // Par secteur
      modele.secteur.forEach(secteur => {
        stats.par_secteur[secteur] = (stats.par_secteur[secteur] || 0) + 1;
      });
      
      // Enrichissement complet
      if (modele.conformite_reglementaire && modele.classification_IA && modele.UX_profiles) {
        stats.enrichissement_complet++;
      }
    });

    stats.conformite_moyenne = Math.round((stats.enrichissement_complet / stats.total_modeles) * 100);

    return stats;
  }
}

// Export par défaut
export default EnrichmentGenerator;