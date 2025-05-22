
// Données des secteurs SCIAN avec leurs facteurs de priorisation
export interface ScianSector {
  id: string;
  name: string;
  description: string;
  riskFactors: {
    mortalityImpact: number; // 1-5
    sectorPrevalence: number; // 1-5
    aiPreventivePotential: number; // 1-5
    legislationCompliance: number; // 1-5
    dataAvailability: number; // 1-5
    implementationDelay: number; // 1-5
    conformiteLSST?: number; // 1-5 (nouveau critère)
  };
  statistics?: {
    accidentCount?: number;
    mortalityRate?: number;
    accidentCauses?: string[];
    keyPreventionAreas?: string[];
  };
}

export const SCIAN_SECTORS: ScianSector[] = [
  {
    id: "23",
    name: "Construction",
    description: "Secteur de la construction",
    riskFactors: {
      mortalityImpact: 5,
      sectorPrevalence: 5,
      aiPreventivePotential: 5,
      legislationCompliance: 5,
      dataAvailability: 3,
      implementationDelay: 3,
      conformiteLSST: 5
    },
    statistics: {
      accidentCount: 57,
      mortalityRate: 0.35,
      accidentCauses: ["Chutes de hauteur", "Écrasement", "Électrocution"],
      keyPreventionAreas: ["Contrôle des énergies", "Supervision des équipements mobiles"]
    }
  },
  {
    id: "31-33",
    name: "Fabrication",
    description: "Secteurs de la fabrication",
    riskFactors: {
      mortalityImpact: 4,
      sectorPrevalence: 4,
      aiPreventivePotential: 5,
      legislationCompliance: 4,
      dataAvailability: 4,
      implementationDelay: 3,
      conformiteLSST: 4
    },
    statistics: {
      accidentCount: 38,
      mortalityRate: 0.28,
      accidentCauses: ["Pièces mobiles", "Chutes d'équipement", "Exposition à des substances"],
      keyPreventionAreas: ["Supervision humaine", "Détection précoce des risques"]
    }
  },
  {
    id: "21",
    name: "Extraction minière",
    description: "Extraction minière, exploitation en carrière, et extraction de pétrole et de gaz",
    riskFactors: {
      mortalityImpact: 5,
      sectorPrevalence: 3,
      aiPreventivePotential: 5,
      legislationCompliance: 5,
      dataAvailability: 4,
      implementationDelay: 2,
      conformiteLSST: 5
    },
    statistics: {
      accidentCount: 29,
      mortalityRate: 0.22,
      accidentCauses: ["Éboulements", "Explosions", "Défaillances équipements"],
      keyPreventionAreas: ["Détection préventive", "Contrôle des environnements confinés"]
    }
  },
  {
    id: "48-49",
    name: "Transport et entreposage",
    description: "Transport et entreposage",
    riskFactors: {
      mortalityImpact: 4,
      sectorPrevalence: 4,
      aiPreventivePotential: 4,
      legislationCompliance: 4,
      dataAvailability: 3,
      implementationDelay: 3,
      conformiteLSST: 4
    },
    statistics: {
      accidentCount: 42,
      mortalityRate: 0.29,
      accidentCauses: ["Accidents routiers", "Manutention", "Chutes"],
      keyPreventionAreas: ["Surveillance équipements mobiles", "Analyse prédictive fatigue"]
    }
  },
  {
    id: "62",
    name: "Soins de santé",
    description: "Soins de santé et assistance sociale",
    riskFactors: {
      mortalityImpact: 2,
      sectorPrevalence: 5,
      aiPreventivePotential: 4,
      legislationCompliance: 5,
      dataAvailability: 5,
      implementationDelay: 4,
      conformiteLSST: 3
    },
    statistics: {
      accidentCount: 36,
      mortalityRate: 0.08,
      accidentCauses: ["TMS", "Expositions biologiques", "Risques psychosociaux"],
      keyPreventionAreas: ["Analyse maladies professionnelles", "Formation adaptive"]
    }
  },
  {
    id: "11",
    name: "Agriculture",
    description: "Agriculture, foresterie, pêche et chasse",
    riskFactors: {
      mortalityImpact: 4,
      sectorPrevalence: 3,
      aiPreventivePotential: 4,
      legislationCompliance: 3,
      dataAvailability: 2,
      implementationDelay: 2,
      conformiteLSST: 3
    },
    statistics: {
      accidentCount: 31,
      mortalityRate: 0.25,
      accidentCauses: ["Machines agricoles", "Intoxications", "Chutes"],
      keyPreventionAreas: ["Contrôle des équipements", "Détection d'expositions"]
    }
  },
  {
    id: "22",
    name: "Services publics",
    description: "Services publics",
    riskFactors: {
      mortalityImpact: 4,
      sectorPrevalence: 2,
      aiPreventivePotential: 5,
      legislationCompliance: 5,
      dataAvailability: 4,
      implementationDelay: 3,
      conformiteLSST: 4
    },
    statistics: {
      accidentCount: 19,
      mortalityRate: 0.12,
      accidentCauses: ["Électrocution", "Explosion", "Travaux en hauteur"],
      keyPreventionAreas: ["Gestion des énergies dangereuses", "Surveillance automatisée"]
    }
  },
  {
    id: "44-45",
    name: "Commerce de détail",
    description: "Commerce de détail",
    riskFactors: {
      mortalityImpact: 2,
      sectorPrevalence: 4,
      aiPreventivePotential: 3,
      legislationCompliance: 3,
      dataAvailability: 3,
      implementationDelay: 4,
      conformiteLSST: 2
    },
    statistics: {
      accidentCount: 27,
      mortalityRate: 0.05,
      accidentCauses: ["Chutes", "Blessures manutention", "Agressions"],
      keyPreventionAreas: ["Formation adaptive", "Détection des comportements à risque"]
    }
  }
];

// Utilisé pour calculer le score de priorité pondéré
export const PRIORITY_WEIGHTS = {
  mortalityImpact: 0.25,
  sectorPrevalence: 0.15,
  aiPreventivePotential: 0.20,
  legislationCompliance: 0.20,
  dataAvailability: 0.10,
  implementationDelay: 0.10,
  conformiteLSST: 0.20 // Nouveau critère avec poids important basé sur LSST
};

// Calcule le score pondéré pour un secteur
export function calculateSectorPriorityScore(sector: ScianSector): number {
  const { riskFactors } = sector;
  
  // Calculer le score avec les facteurs originaux
  let score = 
    (riskFactors.mortalityImpact * PRIORITY_WEIGHTS.mortalityImpact) +
    (riskFactors.sectorPrevalence * PRIORITY_WEIGHTS.sectorPrevalence) +
    (riskFactors.aiPreventivePotential * PRIORITY_WEIGHTS.aiPreventivePotential) +
    (riskFactors.legislationCompliance * PRIORITY_WEIGHTS.legislationCompliance) +
    (riskFactors.dataAvailability * PRIORITY_WEIGHTS.dataAvailability) +
    (riskFactors.implementationDelay * PRIORITY_WEIGHTS.implementationDelay);

  // Ajouter le score de conformité LSST si disponible
  if (riskFactors.conformiteLSST) {
    score += riskFactors.conformiteLSST * PRIORITY_WEIGHTS.conformiteLSST;
    // Ajuster pour maintenir l'échelle relative malgré l'ajout d'un critère
    score = score / (1 + PRIORITY_WEIGHTS.conformiteLSST);
  }
  
  return Math.round(score * 100) / 100; // Arrondir à 2 décimales
}

// Obtenir le niveau de priorité basé sur le score
export function getPriorityLevel(score: number): 'high' | 'medium' | 'low' {
  if (score > 4.2) return 'high';
  if (score >= 3.5) return 'medium';
  return 'low';
}

// Obtenir la couleur associée au niveau de priorité
export function getPriorityColor(level: 'high' | 'medium' | 'low'): string {
  switch (level) {
    case 'high': return 'bg-green-100 text-green-700';
    case 'medium': return 'bg-yellow-100 text-yellow-700';
    case 'low': return 'bg-red-100 text-red-700';
  }
}

// Obtenir le texte du niveau de priorité en français
export function getPriorityText(level: 'high' | 'medium' | 'low'): string {
  switch (level) {
    case 'high': return '🟢 Haute';
    case 'medium': return '🟡 Moyenne';
    case 'low': return '🔴 Faible';
  }
}

// Obtenir les détails de priorité complets
export function calculateDetailedPriority(sector: ScianSector) {
  const { riskFactors } = sector;
  
  const score = calculateSectorPriorityScore(sector);
  const level = getPriorityLevel(score);
  
  const details = {
    mortalityImpact: riskFactors.mortalityImpact,
    sectorPrevalence: riskFactors.sectorPrevalence,
    aiPreventivePotential: riskFactors.aiPreventivePotential,
    legislationCompliance: riskFactors.legislationCompliance,
    dataAvailability: riskFactors.dataAvailability,
    implementationDelay: riskFactors.implementationDelay,
    conformiteLSST: riskFactors.conformiteLSST || 3, // Valeur par défaut si non spécifiée
  };
  
  return {
    score,
    level,
    details
  };
}
