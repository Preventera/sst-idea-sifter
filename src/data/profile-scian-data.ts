export const scianSectors = [
  { code: '11', name: 'Agriculture, foresterie, pêche et chasse' },
  { code: '21', name: 'Extraction minière, exploitation en carrière, et extraction de pétrole et de gaz' },
  { code: '22', name: 'Services publics' },
  { code: '23', name: 'Construction' },
  { code: '31-33', name: 'Fabrication' },
  { code: '41', name: 'Commerce de gros' },
  { code: '44-45', name: 'Commerce de détail' },
  { code: '48-49', name: 'Transport et entreposage' },
  { code: '51', name: 'Industrie de l\'information et industrie culturelle' },
  { code: '52', name: 'Finance et assurances' },
  { code: '53', name: 'Services immobiliers et services de location et de location à bail' },
  { code: '54', name: 'Services professionnels, scientifiques et techniques' },
  { code: '55', name: 'Gestion de sociétés et d\'entreprises' },
  { code: '56', name: 'Services administratifs, services de soutien, services de gestion des déchets et services d\'assainissement' },
  { code: '61', name: 'Services d\'enseignement' },
  { code: '62', name: 'Soins de santé et assistance sociale' },
  { code: '71', name: 'Arts, spectacles et loisirs' },
  { code: '72', name: 'Services d\'hébergement et de restauration' },
  { code: '81', name: 'Autres services (sauf les administrations publiques)' },
  { code: '91', name: 'Administrations publiques' }
];

export const companySizes = [
  'Micro-entreprise (1-4 employés)',
  'Petite entreprise (5-49 employés)',
  'Moyenne entreprise (50-249 employés)',
  'Grande entreprise (250+ employés)'
];

export const riskLevels = [
  'Faible',
  'Modéré',
  'Élevé',
  'Très élevé'
];

export const complianceFrameworks = [
  'CNESST (Quebec)',
  'RSST (Règlement sur la santé et la sécurité du travail)',
  'CSTC (Code de sécurité pour les travaux de construction)',
  'ISO 45001',
  'ISO 14001',
  'OHSAS 18001',
  'CSA Z1000',
  'ILO-OSH 2001',
  'Autre'
];

export const sstSystemTypes = [
  'ISO 45001:2018 - Systèmes de management de la santé et de la sécurité au travail',
  'CSA Z1000-14 - Gestion de la santé et sécurité au travail',
  'ILO-OSH 2001 - Principes directeurs de l\'OIT concernant les systèmes de gestion de la SST',
  'OHSAS 18001 - Systèmes de management de la santé et de la sécurité au travail (obsolète)',
  'AS/NZS 4801 - Systèmes de management de la santé et de la sécurité au travail',
  'BS 8800 - Guide pour les systèmes de management de la santé et de la sécurité au travail',
  'ANSI/AIHA Z10 - Systèmes de management de la santé et sécurité au travail',
  'Système CNESST - Approche québécoise de prévention',
  'DuPont STOP - Sécurité par l\'observation préventive',
  'Behaviour Based Safety (BBS)',
  'Six Sigma SST',
  'Lean Safety Management',
  'Système personnalisé hybride',
  'Pas de système formalisé'
];

export const sstCertifications = [
  'ISO 45001:2018 - Certification internationale',
  'CSA Z1000-14 - Certification canadienne',
  'OHSAS 18001 - Certification (en transition)',
  'Certification CNESST Québec',
  'AS/NZS 4801 - Certification Australie/Nouvelle-Zélande',
  'ANSI/AIHA Z10 - Certification américaine',
  'Autre certification nationale',
  'Aucune certification formelle'
];

export const sstSystemComponents = {
  'ISO 45001': [
    '4. Contexte de l\'organisme',
    '5. Leadership et participation des travailleurs',
    '6. Planification',
    '7. Support',
    '8. Fonctionnement',
    '9. Évaluation des performances',
    '10. Amélioration'
  ],
  'CSA Z1000': [
    'Engagement et responsabilité de la direction',
    'Politique en matière de SST',
    'Planification',
    'Mise en œuvre',
    'Vérification et mesures correctives',
    'Examen par la direction'
  ],
  'ILO-OSH 2001': [
    'Politique de SST',
    'Organisation',
    'Planification et mise en œuvre',
    'Évaluation',
    'Action en vue d\'améliorations'
  ],
  'Général': [
    'Gestion des incidents et accidents',
    'Identification et évaluation des risques',
    'Contrôles opérationnels',
    'Gestion de la conformité réglementaire',
    'Gestion documentaire et traçabilité',
    'Gestion des audits et inspections',
    'Suivi des formations et compétences',
    'Tableaux de bord et indicateurs KPI',
    'Gestion de la santé et du bien-être',
    'Plans d\'actions correctives/préventives',
    'Gestion de crise et plans d\'urgence',
    'Communication et sensibilisation',
    'Consultation et participation des travailleurs',
    'Gestion des entrepreneurs et sous-traitants',
    'Surveillance de la santé au travail',
    'Gestion des équipements de protection',
    'Analyse des tendances et benchmarking',
    'Collecte de données mobile et IoT',
    'Intégration ERP et systèmes existants',
    'Reporting réglementaire automatisé'
  ]
};

export const workOrganizationTypes = [
  'Organisation traditionnelle hiérarchique',
  'Organisation matricielle',
  'Équipes autonomes',
  'Travail en rotation',
  'Télétravail hybride',
  'Organisation en réseau'
];

export const shiftPatterns = [
  'Horaire régulier de jour',
  'Horaire de soir',
  'Horaire de nuit',
  'Rotation 2 équipes',
  'Rotation 3 équipes',
  'Horaire 4/10 (4 jours, 10h)',
  'Horaire flexible',
  'Travail sur appel'
];

export const subcontractingLevels = [
  'Aucune sous-traitance',
  'Sous-traitance occasionnelle (<25%)',
  'Sous-traitance modérée (25-50%)',
  'Sous-traitance importante (>50%)'
];

export const workforceStabilityLevels = [
  'Très stable (turnover <5%)',
  'Stable (turnover 5-15%)',
  'Modérément stable (turnover 15-25%)',
  'Instable (turnover >25%)'
];

export const safetyClimateOptions = [
  'Culture de sécurité exemplaire',
  'Culture de sécurité développée',
  'Culture de sécurité en développement',
  'Culture de sécurité déficiente'
];

export const communicationMethods = [
  'Réunions SST régulières',
  'Affichage physique',
  'Plateforme numérique',
  'Formation en présentiel',
  'E-learning',
  'Boîte à suggestions',
  'Système de signalement numérique',
  'Communication par équipe'
];

export const decisionMakingProcesses = [
  'Décision centralisée',
  'Décision participative',
  'Délégation d\'autorité',
  'Consensus d\'équipe',
  'Comités de décision'
];

export const changeManagementApproaches = [
  'Gestion formelle du changement',
  'Processus informel',
  'Approche réactive',
  'Pas de processus défini'
];

export const sectorSpecificRisks = {
  '11': ['Accidents avec machines agricoles', 'Exposition aux pesticides', 'Chutes', 'Coupures', 'Noyade'],
  '21': ['Effondrement', 'Explosions', 'Exposition à la silice', 'Bruit intense', 'Émanations toxiques'],
  '22': ['Chocs électriques', 'Chutes de hauteur', 'Exposition à l\'amiante', 'Risques chimiques'],
  '23': ['Chutes de hauteur', 'Écrasement par engins', 'Électrocution', 'Bruit', 'Poussières'],
  '31-33': ['Happement par machines', 'Brûlures', 'Exposition chimique', 'Troubles musculosquelettiques', 'Vibrations'],
  '41': ['Manutention manuelle', 'Écrasement', 'Accidents avec chariots élévateurs'],
  '44-45': ['Vol et violence', 'Troubles musculosquelettiques', 'Chutes', 'Coupures'],
  '48-49': ['Accidents de la route', 'Manutention lourde', 'Exposition à substances dangereuses'],
  '62': ['Exposition aux agents biologiques', 'Violence au travail', 'Troubles musculosquelettiques'],
  '72': ['Brûlures', 'Coupures', 'Troubles musculosquelettiques', 'Exposition à agents biologiques']
};