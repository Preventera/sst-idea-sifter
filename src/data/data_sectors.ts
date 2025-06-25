// src/data/sectors.ts
// Données des secteurs SCIAN pour IGNITIA

export interface SectorData {
  value: string;
  label: string;
  description?: string;
}

export const sectorsData: SectorData[] = [
  {
    value: "11",
    label: "Agriculture, foresterie, pêche et chasse",
    description: "Production agricole, forestière, pêche et chasse"
  },
  {
    value: "21",
    label: "Extraction minière, exploitation en carrière, et extraction de pétrole et de gaz",
    description: "Industries extractives"
  },
  {
    value: "22",
    label: "Services publics",
    description: "Électricité, gaz, eau et gestion des déchets"
  },
  {
    value: "23",
    label: "Construction",
    description: "Construction de bâtiments et d'infrastructures"
  },
  {
    value: "31",
    label: "Fabrication",
    description: "Transformation de matières premières en produits finis"
  },
  {
    value: "32",
    label: "Fabrication",
    description: "Autres activités de fabrication"
  },
  {
    value: "33",
    label: "Fabrication",
    description: "Fabrication diverses"
  },
  {
    value: "41",
    label: "Commerce de gros",
    description: "Vente en gros de marchandises"
  },
  {
    value: "44",
    label: "Commerce de détail",
    description: "Vente au détail de marchandises"
  },
  {
    value: "45",
    label: "Commerce de détail",
    description: "Autres commerces de détail"
  },
  {
    value: "48",
    label: "Transport et entreposage",
    description: "Transport de personnes et de marchandises"
  },
  {
    value: "49",
    label: "Transport et entreposage",
    description: "Autres services de transport"
  },
  {
    value: "51",
    label: "Industrie de l'information et industrie culturelle",
    description: "Information, médias et culture"
  },
  {
    value: "52",
    label: "Finance et assurances",
    description: "Services financiers et d'assurance"
  },
  {
    value: "53",
    label: "Services immobiliers et services de location et de location à bail",
    description: "Immobilier et location"
  },
  {
    value: "54",
    label: "Services professionnels, scientifiques et techniques",
    description: "Conseils, recherche et services techniques"
  },
  {
    value: "55",
    label: "Gestion de sociétés et d'entreprises",
    description: "Sièges sociaux et gestion d'entreprises"
  },
  {
    value: "56",
    label: "Services administratifs, services de soutien, services de gestion des déchets et services d'assainissement",
    description: "Services de soutien aux entreprises"
  },
  {
    value: "61",
    label: "Services d'enseignement",
    description: "Éducation et formation"
  },
  {
    value: "62",
    label: "Soins de santé et assistance sociale",
    description: "Services de santé et services sociaux"
  },
  {
    value: "71",
    label: "Arts, spectacles et loisirs",
    description: "Divertissement et loisirs"
  },
  {
    value: "72",
    label: "Hébergement et services de restauration",
    description: "Hôtels, restaurants et services alimentaires"
  },
  {
    value: "81",
    label: "Autres services (sauf les administrations publiques)",
    description: "Services personnels et de réparation"
  },
  {
    value: "91",
    label: "Administrations publiques",
    description: "Services gouvernementaux"
  }
];

export default sectorsData;