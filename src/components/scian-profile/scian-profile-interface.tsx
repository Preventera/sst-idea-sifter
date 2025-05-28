
import React, { useState } from 'react';
import { Building2, Users, Shield, User, Plus, Trash2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SCIANProfileInterface = () => {
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    company: {
      name: '',
      scianCode: '',
      sector: '',
      size: '',
      address: '',
      phone: '',
      email: ''
    },
    actors: [],
    sstCommittee: [],
    cossMembers: [],
    cstcMembers: [],
    management: [],
    hsePolicies: {
      hasWrittenPolicy: false,
      lastReview: '',
      complianceFramework: []
    },
    sstManagementSystem: {
      hasImplementedSystem: false,
      systemType: '',
      certifications: [],
      lastAudit: '',
      systemComponents: []
    },
    aiProjectEvaluation: {
      hasAIProjects: false,
      projects: [],
      organizationalMaturity: {
        strategy: '',
        data: '',
        technology: '',
        talents: '',
        culture: ''
      },
      mainConcerns: []
    },
    riskProfile: {
      primaryRisks: [],
      riskLevel: '',
      previousIncidents: false,
      organizationalContext: {
        workOrganization: '',
        shiftPatterns: [],
        subcontractingLevel: '',
        workforceStability: '',
        safetyClimate: '',
        communicationMethods: [],
        decisionMakingProcess: '',
        changeManagement: ''
      },
      specificSectorRisks: []
    }
  });

  const [activeTab, setActiveTab] = useState('company');

  const scianSectors = [
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

  const companySizes = [
    'Micro-entreprise (1-4 employés)',
    'Petite entreprise (5-49 employés)',
    'Moyenne entreprise (50-249 employés)',
    'Grande entreprise (250+ employés)'
  ];

  const riskLevels = [
    'Faible',
    'Modéré',
    'Élevé',
    'Très élevé'
  ];

  const complianceFrameworks = [
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

  const sstSystemTypes = [
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

  const sstCertifications = [
    'ISO 45001:2018 - Certification internationale',
    'CSA Z1000-14 - Certification canadienne',
    'OHSAS 18001 - Certification (en transition)',
    'Certification CNESST Québec',
    'AS/NZS 4801 - Certification Australie/Nouvelle-Zélande',
    'ANSI/AIHA Z10 - Certification américaine',
    'Autre certification nationale',
    'Aucune certification formelle'
  ];

  const sstMethodologies = [
    'Méthode Kinney (Probabilité × Exposition × Conséquences)',
    'HAZOP (Hazard and Operability Study)',
    'Analyse Bow-Tie (Barrières préventives et protectives)',
    'Méthode 5M (Matière, Matériel, Main-d\'œuvre, Milieu, Méthode)',
    'AMDEC (Analyse des Modes de Défaillance, de leurs Effets et de leur Criticité)',
    'What-If Analysis',
    'Job Safety Analysis (JSA)',
    'Task Risk Assessment (TRA)',
    'LOPA (Layer of Protection Analysis)',
    'Matrice de risques classique (Probabilité × Gravité)'
  ];

  const digitalPlatforms = [
    'SAP EHS Management',
    'Enablon (Wolters Kluwer)',
    'Cority',
    'Gensuite',
    'ProcessMAP',
    'Intelex (Honeywell)',
    'Dakota Software',
    'Workday HCM (module SST)',
    'SafetySync',
    'VelocityEHS',
    'SHE Software',
    'Plateforme personnalisée/développée en interne',
    'Aucune plateforme numérique'
  ];

  const sstSystemComponents = {
    'ISO 45001': [
      'Politique de santé et sécurité au travail',
      'Identification des dangers et évaluation des risques',
      'Objectifs SST et planification',
      'Ressources, rôles, responsabilités et autorités',
      'Compétence et sensibilisation',
      'Communication et consultation',
      'Documentation et maîtrise de l\'information',
      'Planification et maîtrise opérationnelles',
      'Préparation et réponse aux situations d\'urgence',
      'Surveillance, mesure, analyse et évaluation',
      'Audit interne',
      'Revue de direction',
      'Non-conformité et action corrective',
      'Amélioration continue'
    ],
    'CSA Z1000': [
      'Engagement de la direction et responsabilité',
      'Planification du programme',
      'Mise en œuvre et fonctionnement',
      'Évaluation et actions correctives',
      'Revue de gestion et amélioration'
    ],
    'ILO-OSH 2001': [
      'Politique en matière de SST',
      'Organisation',
      'Planification et mise en œuvre',
      'Évaluation',
      'Action en faveur d\'améliorations'
    ],
    'Général': [
      'Politique SST',
      'Identification des risques',
      'Planification des mesures',
      'Formation et sensibilisation',
      'Surveillance et contrôle',
      'Amélioration continue'
    ]
  };

  const workOrganizationTypes = [
    'Traditionnel hiérarchique',
    'Équipes autonomes',
    'Organisation matricielle',
    'Organisation en réseau',
    'Travail hybride (bureau/télétravail)',
    'Organisation agile/lean'
  ];

  const shiftPatterns = [
    'Horaires fixes de jour (7h-15h)',
    'Horaires fixes de soir (15h-23h)',
    'Horaires fixes de nuit (23h-7h)',
    'Rotation 2 équipes (jour/soir)',
    'Rotation 3 équipes (jour/soir/nuit)',
    'Horaires flexibles',
    'Travail sur appel',
    'Horaires comprimés (4 jours/semaine)',
    'Travail de fin de semaine',
    'Travail saisonnier'
  ];

  const subcontractingLevels = [
    'Aucune sous-traitance',
    'Sous-traitance occasionnelle (<10% des activités)',
    'Sous-traitance modérée (10-30% des activités)',
    'Sous-traitance importante (30-60% des activités)',
    'Sous-traitance intensive (>60% des activités)'
  ];

  const workforceStabilityLevels = [
    'Très stable (>90% employés permanents)',
    'Stable (70-90% employés permanents)',
    'Modérément stable (50-70% employés permanents)',
    'Instable (30-50% employés permanents)',
    'Très instable (<30% employés permanents)'
  ];

  const safetyClimateOptions = [
    'Excellent - Culture proactive de sécurité',
    'Bon - Engagement fort en sécurité',
    'Satisfaisant - Conformité réglementaire',
    'À améliorer - Réactivité aux incidents',
    'Déficient - Approche minimale'
  ];

  const communicationMethods = [
    'Réunions sécurité hebdomadaires',
    'Bulletins/newsletters SST',
    'Affichage obligatoire et volontaire',
    'Formations en présentiel',
    'E-learning et formations virtuelles',
    'Plateforme numérique collaborative',
    'Applications mobiles SST',
    'Boîte à suggestions',
    'Comités paritaires',
    'Communications d\'urgence'
  ];

  const decisionMakingProcesses = [
    'Décision centralisée par la direction',
    'Décision participative avec consultation',
    'Décision collaborative avec les équipes',
    'Décision déléguée aux superviseurs',
    'Processus mixte selon le contexte'
  ];

  const changeManagementApproaches = [
    'Gestion formelle du changement (méthode Kotter, ADKAR, etc.)',
    'Approche collaborative et participative',
    'Communication descendante traditionnelle',
    'Adaptation progressive et itérative',
    'Résistance ou approche minimale'
  ];

  // Critères d'évaluation des projets IA selon ISO 42001 et meilleures pratiques québécoises
  const aiEvaluationCriteria = [
    {
      name: 'Pertinence stratégique',
      description: 'Alignement avec les objectifs d\'affaires, valeur ajoutée, impact sur la performance'
    },
    {
      name: 'Innovation et différenciation',
      description: 'Degré d\'innovation, avantage concurrentiel, originalité de la solution'
    },
    {
      name: 'Ressources et faisabilité',
      description: 'Adéquation des ressources humaines, techniques et financières'
    },
    {
      name: 'Gestion des risques',
      description: 'Identification des risques techniques, opérationnels, juridiques, éthiques'
    },
    {
      name: 'Viabilité économique',
      description: 'Analyse coûts-bénéfices, retour sur investissement, potentiel commercial'
    },
    {
      name: 'Éthique et conformité',
      description: 'Respect des lois, protection des données, conformité aux normes'
    },
    {
      name: 'Gouvernance et pilotage',
      description: 'Structure de gouvernance, implication des parties prenantes'
    },
    {
      name: 'Impact organisationnel',
      description: 'Capacité d\'intégration, acceptabilité, transformation des processus'
    }
  ];

  const aiMaturityLevels = [
    'Débutant (1/5) - Aucune stratégie formelle',
    'En développement (2/5) - Stratégie émergente',
    'Intermédiaire (3/5) - Stratégie définie',
    'Avancé (4/5) - Stratégie intégrée',
    'Expert (5/5) - Leadership en IA'
  ];

  const aiConcerns = [
    'Manque de compétences et de formation interne',
    'Défis de gouvernance et de transparence',
    'Responsabilité et enjeux juridiques',
    'Risques éthiques et biais algorithmiques',
    'Coûts et investissements',
    'Résistance au changement et climat d\'incertitude',
    'Opacité des algorithmes (boîte noire)',
    'Gestion des données personnelles',
    'Intégration avec les systèmes existants',
    'Mesure du ROI des projets IA'
  ];

  const sectorSpecificRisks = {
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

  const addActor = (type) => {
    const newActor = {
      id: Date.now(),
      name: '',
      role: '',
      department: '',
      email: '',
      phone: '',
      certifications: []
    };

    setProfileData(prev => ({
      ...prev,
      [type]: [...prev[type], newActor]
    }));
  };

  const removeActor = (type, id) => {
    setProfileData(prev => ({
      ...prev,
      [type]: prev[type].filter(actor => actor.id !== id)
    }));
  };

  const updateActor = (type, id, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [type]: prev[type].map(actor => 
        actor.id === id ? { ...actor, [field]: value } : actor
      )
    }));
  };

  const updateCompany = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      company: { ...prev.company, [field]: value }
    }));
  };

  const [selectedSystemType, setSelectedSystemType] = useState('');

  const updateSSTSystem = (field, value) => {
    if (field === 'systemType') {
      setSelectedSystemType(value);
    }
    setProfileData(prev => ({
      ...prev,
      sstManagementSystem: { ...prev.sstManagementSystem, [field]: value }
    }));
  };

  const getSystemComponents = () => {
    if (selectedSystemType.includes('ISO 45001')) return sstSystemComponents['ISO 45001'];
    if (selectedSystemType.includes('CSA Z1000')) return sstSystemComponents['CSA Z1000'];
    if (selectedSystemType.includes('ILO-OSH')) return sstSystemComponents['ILO-OSH 2001'];
    return sstSystemComponents['Général'];
  };

  const updateRiskProfile = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        riskProfile: { 
          ...prev.riskProfile, 
          [parent]: { ...prev.riskProfile[parent], [child]: value }
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        riskProfile: { ...prev.riskProfile, [field]: value }
      }));
    }
  };

  const updateHSEPolicies = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      hsePolicies: { ...prev.hsePolicies, [field]: value }
    }));
  };

  const updateAIEvaluation = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        aiProjectEvaluation: { 
          ...prev.aiProjectEvaluation, 
          [parent]: { ...prev.aiProjectEvaluation[parent], [child]: value }
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        aiProjectEvaluation: { ...prev.aiProjectEvaluation, [field]: value }
      }));
    }
  };

  const addAIProject = () => {
    const newProject = {
      id: Date.now(),
      name: '',
      description: '',
      status: '',
      evaluationScores: {},
      totalScore: 0
    };

    setProfileData(prev => ({
      ...prev,
      aiProjectEvaluation: {
        ...prev.aiProjectEvaluation,
        projects: [...prev.aiProjectEvaluation.projects, newProject]
      }
    }));
  };

  const removeAIProject = (id) => {
    setProfileData(prev => ({
      ...prev,
      aiProjectEvaluation: {
        ...prev.aiProjectEvaluation,
        projects: prev.aiProjectEvaluation.projects.filter(project => project.id !== id)
      }
    }));
  };

  const updateAIProject = (id, field, value) => {
    setProfileData(prev => ({
      ...prev,
      aiProjectEvaluation: {
        ...prev.aiProjectEvaluation,
        projects: prev.aiProjectEvaluation.projects.map(project => 
          project.id === id ? { ...project, [field]: value } : project
        )
      }
    }));
  };

  const getSectorRisks = () => {
    const sector = profileData.company.sector;
    return sectorSpecificRisks[sector] || [];
  };

  const toggleArrayItem = (array, item, updateFunction) => {
    const newArray = array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
    updateFunction(newArray);
  };

  const saveProfile = () => {
    toast({
      title: "Profil sauvegardé",
      description: "Le profil SCIAN HSE a été sauvegardé avec succès."
    });
  };

  const renderActorSection = (type, title, actors) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <button
          onClick={() => addActor(type)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Ajouter
        </button>
      </div>
      
      {actors.length === 0 ? (
        <p className="text-gray-500 italic">Aucun membre ajouté</p>
      ) : (
        <div className="space-y-4">
          {actors.map((actor) => (
            <div key={actor.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-gray-800">Membre #{actor.id}</h4>
                <button
                  onClick={() => removeActor(type, actor.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <input
                    type="text"
                    value={actor.name}
                    onChange={(e) => updateActor(type, actor.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rôle/Fonction</label>
                  <input
                    type="text"
                    value={actor.role}
                    onChange={(e) => updateActor(type, actor.id, 'role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
                  <input
                    type="text"
                    value={actor.department}
                    onChange={(e) => updateActor(type, actor.id, 'department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={actor.email}
                    onChange={(e) => updateActor(type, actor.id, 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'company', name: 'Entreprise', icon: Building2 },
    { id: 'actors', name: 'Acteurs', icon: Users },
    { id: 'policies', name: 'Politiques HSE', icon: Shield },
    { id: 'system', name: 'Système SST', icon: Shield },
    { id: 'ai-projects', name: 'Projets IA', icon: User },
    { id: 'risks', name: 'Profil de Risque', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Questionnaire IGNITIA - Profil SCIAN HSE
          </h1>
          <p className="text-gray-600">
            Configuration du profil utilisateur pour l'évaluation des risques en santé, sécurité et environnement
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={20} />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'company' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Informations de l'entreprise</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'entreprise</label>
                  <input
                    type="text"
                    value={profileData.company.name}
                    onChange={(e) => updateCompany('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom complet de l'entreprise"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Code SCIAN</label>
                  <input
                    type="text"
                    value={profileData.company.scianCode}
                    onChange={(e) => updateCompany('scianCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 23621"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secteur d'activité</label>
                  <select
                    value={profileData.company.sector}
                    onChange={(e) => updateCompany('sector', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner un secteur</option>
                    {scianSectors.map((sector) => (
                      <option key={sector.code} value={sector.code}>
                        {sector.code} - {sector.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Taille de l'entreprise</label>
                  <select
                    value={profileData.company.size}
                    onChange={(e) => updateCompany('size', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner la taille</option>
                    {companySizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <input
                    type="text"
                    value={profileData.company.address}
                    onChange={(e) => updateCompany('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Adresse complète"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={profileData.company.phone}
                    onChange={(e) => updateCompany('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(XXX) XXX-XXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.company.email}
                    onChange={(e) => updateCompany('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="contact@entreprise.com"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'actors' && (
            <div className="space-y-6">
              {renderActorSection('actors', 'Acteurs principaux', profileData.actors)}
              {renderActorSection('sstCommittee', 'Comité SST', profileData.sstCommittee)}
              {renderActorSection('cossMembers', 'Membres CoSS', profileData.cossMembers)}
              {renderActorSection('cstcMembers', 'Responsables CSTC (Code de sécurité pour les travaux de construction)', profileData.cstcMembers)}
              {renderActorSection('management', 'Direction/Dirigeants', profileData.management)}
            </div>
          )}

          {activeTab === 'policies' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Politiques HSE</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={profileData.hsePolicies.hasWrittenPolicy}
                      onChange={(e) => updateHSEPolicies('hasWrittenPolicy', e.target.checked)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      L'entreprise possède une politique HSE écrite
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dernière révision de la politique
                  </label>
                  <input
                    type="date"
                    value={profileData.hsePolicies.lastReview}
                    onChange={(e) => updateHSEPolicies('lastReview', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Cadres de conformité appliqués
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {complianceFrameworks.map((framework) => (
                      <label key={framework} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={profileData.hsePolicies.complianceFramework.includes(framework)}
                          onChange={() => toggleArrayItem(
                            profileData.hsePolicies.complianceFramework,
                            framework,
                            (newArray) => updateHSEPolicies('complianceFramework', newArray)
                          )}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{framework}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              {/* Système de gestion SST principal */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Système de Gestion SST</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-3 mb-4">
                      <input
                        type="checkbox"
                        checked={profileData.sstManagementSystem.hasImplementedSystem}
                        onChange={(e) => updateSSTSystem('hasImplementedSystem', e.target.checked)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        L'entreprise a mis en place un système de gestion SST formalisé
                      </span>
                    </label>
                  </div>

                  {profileData.sstManagementSystem.hasImplementedSystem && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type de système SST <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={profileData.sstManagementSystem.systemType}
                            onChange={(e) => updateSSTSystem('systemType', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Sélectionner le système de gestion SST</option>
                            {sstSystemTypes.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dernier audit du système
                          </label>
                          <input
                            type="date"
                            value={profileData.sstManagementSystem.lastAudit}
                            onChange={(e) => updateSSTSystem('lastAudit', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Certifications SST obtenues
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {sstCertifications.map((cert) => (
                            <label key={cert} className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={profileData.sstManagementSystem.certifications.includes(cert)}
                                onChange={() => toggleArrayItem(
                                  profileData.sstManagementSystem.certifications,
                                  cert,
                                  (newArray) => updateSSTSystem('certifications', newArray)
                                )}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className="text-sm text-gray-700">{cert}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {selectedSystemType && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Composantes du système {selectedSystemType.split(' - ')[0]} mises en place
                          </label>
                          <div className="grid grid-cols-1 gap-3">
                            {getSystemComponents().map((component) => (
                              <label key={component} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                                <input
                                  type="checkbox"
                                  checked={profileData.sstManagementSystem.systemComponents.includes(component)}
                                  onChange={() => toggleArrayItem(
                                    profileData.sstManagementSystem.systemComponents,
                                    component,
                                    (newArray) => updateSSTSystem('systemComponents', newArray)
                                  )}
                                  className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm text-gray-700 font-medium">{component}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-blue-800 mb-2">Rappel des paramètres clés d'un système SST</h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• <strong>Politique SST :</strong> Engagement formel de la direction</li>
                          <li>• <strong>Identification des risques :</strong> Processus systématique d'évaluation</li>
                          <li>• <strong>Planification :</strong> Objectifs, actions et ressources</li>
                          <li>• <strong>Mise en œuvre :</strong> Procédures, formations, contrôles</li>
                          <li>• <strong>Suivi et mesure :</strong> Indicateurs, audits, inspections</li>
                          <li>• <strong>Amélioration continue :</strong> Révision et adaptation</li>
                          <li>• <strong>Consultation :</strong> Participation des travailleurs</li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Méthodologies d'analyse des risques */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Méthodologies d'Analyse des Risques</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Méthodes d'analyse des risques utilisées
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sstMethodologies.map((method) => (
                      <label key={method} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-6 bg-amber-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-amber-800 mb-2">Focus sur les méthodes d'évaluation</h3>
                  <div className="text-sm text-amber-700 space-y-2">
                    <p><strong>Méthode Kinney :</strong> Évaluation quantitative basée sur Probabilité × Exposition × Conséquences</p>
                    <p><strong>HAZOP :</strong> Analyse systématique des déviations pour identifier les dangers</p>
                    <p><strong>Bow-Tie :</strong> Visualisation des barrières préventives et protectives</p>
                    <p><strong>5M :</strong> Analyse des causes : Matière, Matériel, Main-d'œuvre, Milieu, Méthode</p>
                  </div>
                </div>
              </div>

              {/* Plateformes numériques */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Plateformes Numériques QHSE/SSE</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Plateformes de gestion QHSE/SSE utilisées
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {digitalPlatforms.map((platform) => (
                      <label key={platform} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-6 bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-green-800 mb-2">Tendances 2025 des plateformes SSE</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• <strong>IA générative :</strong> Assistance à l'analyse des risques et rédaction des rapports</li>
                    <li>• <strong>IoT et capteurs :</strong> Surveillance en temps réel des conditions de travail</li>
                    <li>• <strong>Mobile-first :</strong> Applications mobiles pour la collecte de données terrain</li>
                    <li>• <strong>Intégration ERP :</strong> Connexion avec les systèmes existants (SAP, Oracle)</li>
                    <li>• <strong>Analytics avancés :</strong> Prédiction des incidents et analyses prédictives</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai-projects' && (
            <div className="space-y-6">
              {/* Évaluation des projets IA */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Évaluation des Projets d'Intelligence Artificielle</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-3 mb-4">
                      <input
                        type="checkbox"
                        checked={profileData.aiProjectEvaluation.hasAIProjects}
                        onChange={(e) => updateAIEvaluation('hasAIProjects', e.target.checked)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        L'entreprise développe ou utilise des projets d'intelligence artificielle
                      </span>
                    </label>
                  </div>

                  {profileData.aiProjectEvaluation.hasAIProjects && (
                    <>
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">Projets IA en cours</h3>
                        <button
                          onClick={addAIProject}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <Plus size={16} />
                          Ajouter un projet
                        </button>
                      </div>

                      {profileData.aiProjectEvaluation.projects.length === 0 ? (
                        <p className="text-gray-500 italic">Aucun projet IA ajouté</p>
                      ) : (
                        <div className="space-y-4">
                          {profileData.aiProjectEvaluation.projects.map((project) => (
                            <div key={project.id} className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="font-medium text-gray-800">Projet #{project.id}</h4>
                                <button
                                  onClick={() => removeAIProject(project.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du projet</label>
                                  <input
                                    type="text"
                                    value={project.name}
                                    onChange={(e) => updateAIProject(project.id, 'name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ex: Chatbot service client"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                                  <select
                                    value={project.status}
                                    onChange={(e) => updateAIProject(project.id, 'status', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="">Sélectionner le statut</option>
                                    <option value="concept">Concept</option>
                                    <option value="development">En développement</option>
                                    <option value="testing">En test</option>
                                    <option value="production">En production</option>
                                    <option value="paused">En pause</option>
                                  </select>
                                </div>
                              </div>

                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                  value={project.description}
                                  onChange={(e) => updateAIProject(project.id, 'description', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  rows="3"
                                  placeholder="Description détaillée du projet IA"
                                />
                              </div>

                              <div>
                                <h5 className="font-medium text-gray-700 mb-3">Évaluation selon les critères ISO 42001</h5>
                                <div className="grid grid-cols-1 gap-3">
                                  {aiEvaluationCriteria.map((criterion) => (
                                    <div key={criterion.name} className="flex items-center justify-between p-3 bg-white rounded border">
                                      <div className="flex-1">
                                        <div className="font-medium text-sm text-gray-800">{criterion.name}</div>
                                        <div className="text-xs text-gray-600">{criterion.description}</div>
                                      </div>
                                      <select
                                        className="ml-4 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        defaultValue=""
                                      >
                                        <option value="">--</option>
                                        <option value="1">1 - Très faible</option>
                                        <option value="2">2 - Faible</option>
                                        <option value="3">3 - Moyen</option>
                                        <option value="4">4 - Bon</option>
                                        <option value="5">5 - Excellent</option>
                                      </select>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-blue-800 mb-2">Méthodologie d'évaluation</h3>
                        <p className="text-sm text-blue-700 mb-2">
                          Chaque projet est évalué selon 8 critères fondamentaux basés sur ISO 42001 et les meilleures pratiques québécoises.
                        </p>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• <strong>Score de 1-2 :</strong> Projet à revoir ou abandonner</li>
                          <li>• <strong>Score de 3 :</strong> Projet acceptable avec améliorations</li>
                          <li>• <strong>Score de 4-5 :</strong> Projet recommandé pour implémentation</li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Maturité organisationnelle IA */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Maturité Organisationnelle en IA</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stratégie IA</label>
                    <select
                      value={profileData.aiProjectEvaluation.organizationalMaturity.strategy}
                      onChange={(e) => updateAIEvaluation('organizationalMaturity.strategy', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Évaluer la maturité stratégique</option>
                      {aiMaturityLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gestion des données</label>
                    <select
                      value={profileData.aiProjectEvaluation.organizationalMaturity.data}
                      onChange={(e) => updateAIEvaluation('organizationalMaturity.data', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Évaluer la maturité des données</option>
                      {aiMaturityLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Infrastructure technologique</label>
                    <select
                      value={profileData.aiProjectEvaluation.organizationalMaturity.technology}
                      onChange={(e) => updateAIEvaluation('organizationalMaturity.technology', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Évaluer la maturité technologique</option>
                      {aiMaturityLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Talents et compétences</label>
                    <select
                      value={profileData.aiProjectEvaluation.organizationalMaturity.talents}
                      onChange={(e) => updateAIEvaluation('organizationalMaturity.talents', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Évaluer la maturité des talents</option>
                      {aiMaturityLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Culture organisationnelle IA</label>
                    <select
                      value={profileData.aiProjectEvaluation.organizationalMaturity.culture}
                      onChange={(e) => updateAIEvaluation('organizationalMaturity.culture', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Évaluer la maturité culturelle</option>
                      {aiMaturityLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6 bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-green-800 mb-2">Référentiel de maturité IA - Forum IA Québec</h3>
                  <p className="text-sm text-green-700 mb-2">
                    Évaluation selon les 5 dimensions critiques pour une intégration réussie de l'IA :
                  </p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• <strong>Stratégie :</strong> Vision et alignement avec les objectifs d'affaires</li>
                    <li>• <strong>Données :</strong> Qualité, accessibilité et gouvernance des données</li>
                    <li>• <strong>Technologie :</strong> Infrastructure et capacités techniques</li>
                    <li>• <strong>Talents :</strong> Compétences et formation du personnel</li>
                    <li>• <strong>Culture :</strong> Adoption et acceptation organisationnelle</li>
                  </ul>
                </div>
              </div>

              {/* Préoccupations principales */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Préoccupations en matière d'IA</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Principales préoccupations de l'organisation concernant l'IA
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {aiConcerns.map((concern) => (
                      <label key={concern} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={profileData.aiProjectEvaluation.mainConcerns.includes(concern)}
                          onChange={() => toggleArrayItem(
                            profileData.aiProjectEvaluation.mainConcerns,
                            concern,
                            (newArray) => updateAIEvaluation('mainConcerns', newArray)
                          )}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{concern}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-6 bg-amber-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-amber-800 mb-2">Recommandations du Conseil de l'innovation du Québec</h3>
                  <p className="text-sm text-amber-700 mb-2">
                    "Les entreprises québécoises expriment le besoin d'un accompagnement accru pour comprendre les impacts de l'IA, 
                    renforcer les compétences internes, et assurer une gouvernance responsable et transparente des systèmes déployés."
                  </p>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Développer des programmes de formation IA internes</li>
                    <li>• Mettre en place une gouvernance transparente</li>
                    <li>• Établir des frameworks éthiques et de conformité</li>
                    <li>• Investir dans l'explicabilité des algorithmes</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'risks' && (
            <div className="space-y-6">
              {/* Risques spécifiques par secteur */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Risques spécifiques par secteur SCIAN</h2>
                
                {profileData.company.sector ? (
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-3">
                      Risques identifiés pour le secteur {profileData.company.sector}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getSectorRisks().map((risk) => (
                        <label key={risk} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={profileData.riskProfile.specificSectorRisks.includes(risk)}
                            onChange={() => toggleArrayItem(
                              profileData.riskProfile.specificSectorRisks,
                              risk,
                              (newArray) => updateRiskProfile('specificSectorRisks', newArray)
                            )}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">{risk}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-amber-600 bg-amber-50 p-4 rounded-lg">
                    Veuillez d'abord sélectionner un secteur d'activité dans l'onglet "Entreprise" pour voir les risques spécifiques.
                  </p>
                )}
              </div>

              {/* Contexte organisationnel */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Contexte organisationnel</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type d'organisation du travail
                    </label>
                    <select
                      value={profileData.riskProfile.organizationalContext.workOrganization}
                      onChange={(e) => updateRiskProfile('organizationalContext.workOrganization', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner le type d'organisation</option>
                      {workOrganizationTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Niveau de sous-traitance
                    </label>
                    <select
                      value={profileData.riskProfile.organizationalContext.subcontractingLevel}
                      onChange={(e) => updateRiskProfile('organizationalContext.subcontractingLevel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Évaluer le niveau de sous-traitance</option>
                      {subcontractingLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stabilité de la main-d'œuvre
                    </label>
                    <select
                      value={profileData.riskProfile.organizationalContext.workforceStability}
                      onChange={(e) => updateRiskProfile('organizationalContext.workforceStability', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Évaluer la stabilité</option>
                      {workforceStabilityLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Climat de sécurité
                    </label>
                    <select
                      value={profileData.riskProfile.organizationalContext.safetyClimate}
                      onChange={(e) => updateRiskProfile('organizationalContext.safetyClimate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Évaluer le climat de sécurité</option>
                      {safetyClimateOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Processus de prise de décision
                    </label>
                    <select
                      value={profileData.riskProfile.organizationalContext.decisionMakingProcess}
                      onChange={(e) => updateRiskProfile('organizationalContext.decisionMakingProcess', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner le processus</option>
                      {decisionMakingProcesses.map((process) => (
                        <option key={process} value={process}>{process}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Approche de gestion du changement
                    </label>
                    <select
                      value={profileData.riskProfile.organizationalContext.changeManagement}
                      onChange={(e) => updateRiskProfile('organizationalContext.changeManagement', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner l'approche</option>
                      {changeManagementApproaches.map((approach) => (
                        <option key={approach} value={approach}>{approach}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Horaires et modalités de travail
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {shiftPatterns.map((pattern) => (
                      <label key={pattern} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={profileData.riskProfile.organizationalContext.shiftPatterns.includes(pattern)}
                          onChange={() => toggleArrayItem(
                            profileData.riskProfile.organizationalContext.shiftPatterns,
                            pattern,
                            (newArray) => updateRiskProfile('organizationalContext.shiftPatterns', newArray)
                          )}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{pattern}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Méthodes de communication SST
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {communicationMethods.map((method) => (
                      <label key={method} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={profileData.riskProfile.organizationalContext.communicationMethods.includes(method)}
                          onChange={() => toggleArrayItem(
                            profileData.riskProfile.organizationalContext.communicationMethods,
                            method,
                            (newArray) => updateRiskProfile('organizationalContext.communicationMethods', newArray)
                          )}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Évaluation globale des risques */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Évaluation globale des risques</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Niveau de risque global évalué
                    </label>
                    <select
                      value={profileData.riskProfile.riskLevel}
                      onChange={(e) => updateRiskProfile('riskLevel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Évaluer le niveau de risque</option>
                      {riskLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={profileData.riskProfile.previousIncidents}
                        onChange={(e) => updateRiskProfile('previousIncidents', e.target.checked)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        L'entreprise a eu des incidents HSE significatifs dans les 3 dernières années
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            Annuler
          </button>
          <button 
            onClick={saveProfile}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Save size={16} />
            Sauvegarder le profil
          </button>
        </div>
      </div>
    </div>
  );
};

export default SCIANProfileInterface;
