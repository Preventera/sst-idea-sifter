
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
      implementationDelay: 3
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
      implementationDelay: 3
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
      implementationDelay: 2
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
      implementationDelay: 3
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
      implementationDelay: 4
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
      implementationDelay: 2
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
      implementationDelay: 3
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
      implementationDelay: 4
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
  implementationDelay: 0.10
};

// Calcule le score pondéré pour un secteur
export function calculateSectorPriorityScore(sector: ScianSector): number {
  const { riskFactors } = sector;
  
  const score = 
    (riskFactors.mortalityImpact * PRIORITY_WEIGHTS.mortalityImpact) +
    (riskFactors.sectorPrevalence * PRIORITY_WEIGHTS.sectorPrevalence) +
    (riskFactors.aiPreventivePotential * PRIORITY_WEIGHTS.aiPreventivePotential) +
    (riskFactors.legislationCompliance * PRIORITY_WEIGHTS.legislationCompliance) +
    (riskFactors.dataAvailability * PRIORITY_WEIGHTS.dataAvailability) +
    (riskFactors.implementationDelay * PRIORITY_WEIGHTS.implementationDelay);
  
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
