import React, { useState } from 'react';
import { Building2, Users, Shield, User, ChevronRight, Save, Plus, Trash2, ArrowLeft, Brain } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CompanyProfile from '@/components/profile-scian/CompanyProfile';

const ProfileScian = () => {
  const navigate = useNavigate();
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
    aiProjects: {
      projects: [],
      organizationalMaturity: {
        aiStrategy: 1,
        dataManagement: 1,
        techInfrastructure: 1,
        talentsSkills: 1,
        organizationalCulture: 1
      },
      mainConcerns: [],
      overallReadiness: ''
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
    'Moyen',
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

  // Composantes détaillées par système
  const sstSystemComponents = {
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

  const sstMethodologies = [
    'Méthode Kinney - Évaluation quantitative des risques',
    'HAZOP - Hazard and Operability Study',
    'FMEA/AMDEC - Analyse des modes de défaillance',
    'What-If Analysis - Analyse des scénarios',
    'Job Safety Analysis (JSA)',
    'Bow-Tie Analysis - Analyse nœud papillon',
    'LOPA - Layer of Protection Analysis',
    'Root Cause Analysis (RCA)',
    'Fault Tree Analysis (FTA)',
    'Event Tree Analysis (ETA)',
    'Swiss Cheese Model',
    '5 Pourquoi (5 Whys)',
    'Ishikawa (Diagramme en arête de poisson)',
    'STAMP - Systems-Theoretic Accident Model'
  ];

  const digitalPlatforms = [
    'SafetyCulture (iAuditor) - Inspections et audits',
    'Intelex EHS - Gestion complète EHS',
    'SIGMA-RH - SST intégrée RH avec IA',
    'Smaat (Maerix) - SSE multi-sites',
    'Tervene - Audits et prévention terrain',
    'MEDIAL+ - Conforme CNESST Québec',
    'ConvergePoint - Intégration SharePoint',
    'Risk and Safety Solutions - Milieux à haut risque',
    'SAP S/4HANA EHS - Intégration ERP',
    'EHS Insight - Solution internationale',
    'Enablon (Wolters Kluwer) - Enterprise EHS',
    'Gensuite - Cloud EHS Management',
    'ProcessMAP (Appian) - EHS Automation',
    'Cority - Comprehensive EHS Software',
    'VelocityEHS - Integrated EHS Platform'
  ];

  const workOrganizationTypes = [
    'Organisation traditionnelle hiérarchique',
    'Organisation matricielle',
    'Équipes autonomes',
    'Travail en rotation',
    'Télétravail hybride',
    'Organisation en réseau'
  ];

  const shiftPatterns = [
    'Horaire régulier de jour',
    'Horaire de soir',
    'Horaire de nuit',
    'Rotation 2 équipes',
    'Rotation 3 équipes',
    'Horaire 4/10 (4 jours, 10h)',
    'Horaire flexible',
    'Travail sur appel'
  ];

  const subcontractingLevels = [
    'Aucune sous-traitance',
    'Sous-traitance occasionnelle (<25%)',
    'Sous-traitance modérée (25-50%)',
    'Sous-traitance importante (>50%)'
  ];

  const workforceStabilityLevels = [
    'Très stable (turnover <5%)',
    'Stable (turnover 5-15%)',
    'Modérément stable (turnover 15-25%)',
    'Instable (turnover >25%)'
  ];

  const safetyClimateOptions = [
    'Culture de sécurité exemplaire',
    'Culture de sécurité développée',
    'Culture de sécurité en développement',
    'Culture de sécurité déficiente'
  ];

  const communicationMethods = [
    'Réunions SST régulières',
    'Affichage physique',
    'Plateforme numérique',
    'Formation en présentiel',
    'E-learning',
    'Boîte à suggestions',
    'Système de signalement numérique',
    'Communication par équipe'
  ];

  const decisionMakingProcesses = [
    'Décision centralisée',
    'Décision participative',
    'Délégation d\'autorité',
    'Consensus d\'équipe',
    'Comités de décision'
  ];

  const changeManagementApproaches = [
    'Gestion formelle du changement',
    'Processus informel',
    'Approche réactive',
    'Pas de processus défini'
  ];

  // Mapping des risques spécifiques par secteur SCIAN basé sur les documents
  const sectorSpecificRisks = {
    '11': ['Accidents avec machines agricoles', 'Exposition aux pesticides', 'Chutes', 'Coupures', 'Noyade'],
    '22': ['Chocs électriques', 'Chutes de hauteur', 'Exposition à l\'amiante', 'Risques chimiques'],
    '23': ['Chutes de hauteur', 'Écrasement par engins', 'Électrocution', 'Bruit', 'Poussières'],
    '31-33': ['Happement par machines', 'Brûlures', 'Exposition chimique', 'Troubles musculosquelettiques', 'Vibrations'],
    '41': ['Manutention manuelle', 'Écrasement', 'Accidents avec chariots élévateurs'],
    '44-45': ['Vol et violence', 'Troubles musculosquelettiques', 'Chutes', 'Coupures'],
    '48-49': ['Accidents de la route', 'Manutention lourde', 'Exposition à substances dangereuses'],
    '62': ['Exposition aux agents biologiques', 'Violence au travail', 'Troubles musculosquelettiques'],
    '72': ['Brûlures', 'Coupures', 'Troubles musculosquelettiques', 'Exposition à agents biologiques']
  };

  // Données pour l'onglet Projets IA
  const iso42001Criteria = [
    { id: 'strategic', name: 'Pertinence stratégique', description: 'Alignement avec les objectifs d\'affaires' },
    { id: 'innovation', name: 'Innovation et différenciation', description: 'Potentiel d\'innovation et avantage concurrentiel' },
    { id: 'resources', name: 'Ressources et faisabilité', description: 'Disponibilité des ressources et faisabilité technique' },
    { id: 'risks', name: 'Gestion des risques', description: 'Identification et mitigation des risques' },
    { id: 'viability', name: 'Viabilité économique', description: 'Retour sur investissement et viabilité financière' },
    { id: 'ethics', name: 'Éthique et conformité', description: 'Respect des principes éthiques et réglementaires' },
    { id: 'governance', name: 'Gouvernance et pilotage', description: 'Structure de gouvernance et capacité de pilotage' },
    { id: 'impact', name: 'Impact organisationnel', description: 'Impact sur l\'organisation et gestion du changement' }
  ];

  const maturityDimensions = [
    { id: 'aiStrategy', name: 'Stratégie IA', description: 'Vision et stratégie organisationnelle IA' },
    { id: 'dataManagement', name: 'Gestion des données', description: 'Qualité, gouvernance et architecture des données' },
    { id: 'techInfrastructure', name: 'Infrastructure technologique', description: 'Capacités techniques et infrastructure IT' },
    { id: 'talentsSkills', name: 'Talents et compétences', description: 'Compétences humaines et formation IA' },
    { id: 'organizationalCulture', name: 'Culture organisationnelle', description: 'Adoption et culture d\'innovation IA' }
  ];

  const maturityLevels = [
    { value: 1, label: 'Débutant', description: 'Aucune expérience, exploration initiale' },
    { value: 2, label: 'En développement', description: 'Premières initiatives, apprentissage' },
    { value: 3, label: 'Intermédiaire', description: 'Projets pilotes, processus en développement' },
    { value: 4, label: 'Avancé', description: 'Déploiements opérationnels, processus matures' },
    { value: 5, label: 'Expert', description: 'Leadership sectoriel, innovation continue' }
  ];

  const aiReadinessLevels = [
    'Non préparé - Besoins de formation majeurs',
    'Débutant - Formation et stratégie nécessaires',
    'En développement - Projets pilotes recommandés',
    'Prêt - Capacité de déploiement opérationnel',
    'Leader - Innovation et excellence IA'
  ];

  const mainConcerns = [
    'Sécurité et protection des données personnelles',
    'Transparence et explicabilité des algorithmes',
    'Biais et équité dans les décisions automatisées',
    'Impact sur l\'emploi et transformation du travail',
    'Responsabilité et gouvernance des systèmes IA',
    'Formation et développement des compétences',
    'Éthique et valeurs organisationnelles',
    'Conformité réglementaire et juridique',
    'Investissements et retour sur investissement',
    'Intégration avec les systèmes existants'
  ];

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

  // Fonction pour obtenir les risques spécifiques selon le secteur SCIAN sélectionné
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

  // Nouvelles fonctions pour l'onglet Projets IA
  const addAIProject = () => {
    const newProject = {
      id: Date.now(),
      name: '',
      description: '',
      status: 'En planification',
      criteria: {
        strategic: 0,
        innovation: 0,
        resources: 0,
        risks: 0,
        viability: 0,
        ethics: 0,
        governance: 0,
        impact: 0
      },
      totalScore: 0,
      priority: 'Moyenne'
    };

    setProfileData(prev => ({
      ...prev,
      aiProjects: {
        ...prev.aiProjects,
        projects: [...prev.aiProjects.projects, newProject]
      }
    }));
  };

  const removeAIProject = (id) => {
    setProfileData(prev => ({
      ...prev,
      aiProjects: {
        ...prev.aiProjects,
        projects: prev.aiProjects.projects.filter(project => project.id !== id)
      }
    }));
  };

  const updateAIProject = (id, field, value) => {
    setProfileData(prev => ({
      ...prev,
      aiProjects: {
        ...prev.aiProjects,
        projects: prev.aiProjects.projects.map(project => {
          if (project.id === id) {
            const updatedProject = { ...project, [field]: value };

            // Recalculer le score total si c'est un critère
            if (field === 'criteria') {
              const criteriaValues = value as Record<string, number>;
              const scores = Object.values(criteriaValues);
              const totalScore = scores.reduce((sum, score) => sum + score, 0);
              updatedProject.totalScore = totalScore;
              updatedProject.priority = totalScore >= 32 ? 'Haute' : totalScore >= 16 ? 'Moyenne' : 'Faible';
            }

            return updatedProject;
          }
          return project;
        })
      }
    }));
  };

  const updateMaturityDimension = (dimension, value) => {
    setProfileData(prev => ({
      ...prev,
      aiProjects: {
        ...prev.aiProjects,
        organizationalMaturity: {
          ...prev.aiProjects.organizationalMaturity,
          [dimension]: value
        }
      }
    }));
  };

  const updateAIProjects = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      aiProjects: { ...prev.aiProjects, [field]: value }
    }));
  };

  const calculateMaturityAverage = () => {
    const maturity = profileData.aiProjects.organizationalMaturity;
    const average = (Number(maturity.aiStrategy) + Number(maturity.dataManagement) + Number(maturity.techInfrastructure) +
                    Number(maturity.talentsSkills) + Number(maturity.organizationalCulture)) / 5;
    return Math.round(average * 10) / 10;
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
                    >
                      <option value="">Évaluer le niveau de sous-traitance</option>
                      {subcontractingLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </input>
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
              </div>}}

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
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Save size={16} />
            Sauvegarder le profil
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScian;
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
    { id: 'ai-projects', name: 'Projets IA', icon: Brain },
    { id: 'risks', name: 'Profil de Risque', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-800">
              Questionnaire IGNITIA - Profil SCIAN HSE
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </div>
          <p className="text-gray-600">
            Configuration du profil utilisateur pour l'évaluation des risques en santé, sécurité et environnement avec évaluation des projets IA
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex border-b overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
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
            <CompanyProfile
              companyData={profileData.company}
              onUpdateCompany={updateCompany}
            />
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
              {/* Évaluation des projets IA selon ISO 42001 */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Évaluation des Projets IA (ISO 42001)</h2>
                  <button
                    onClick={addAIProject}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"        
                  >
                    <Plus size={16} />
                    Nouveau Projet IA
                  </button>
                </div>

                {profileData.aiProjects.projects.length === 0 ? (
                  <p className="text-gray-500 italic">Aucun projet IA ajouté</p>
                ) : (
                  <div className="space-y-6">
                    {profileData.aiProjects.projects.map((project) => (
                      <div key={project.id} className="border rounded-lg p-6 bg-gray-50">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du projet</label>
                                <input
                                  type="text"
                                  value={project.name}
                                  onChange={(e) => updateAIProject(project.id, 'name', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholder="Nom du projet IA"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                                <select
                                  value={project.status}
                                  onChange={(e) => updateAIProject(project.id, 'status', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                  <option value="En planification">En planification</option>
                                  <option value="En développement">En développement</option>
                                  <option value="En test">En test</option>
                                  <option value="Déployé">Déployé</option>
                                  <option value="Suspendu">Suspendu</option>
                                </select>
                              </div>
                            </div>

                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                              <textarea
                                value={project.description}
                                onChange={(e) => updateAIProject(project.id, 'description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                rows={3}
                                placeholder="Description du projet et objectifs"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {iso42001Criteria.map((criterion) => (
                                <div key={criterion.id}>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {criterion.name}
                                    <span className="text-xs text-gray-500 block">{criterion.description}</span>
                                  </label>
                                  <select
                                    value={project.criteria[criterion.id]}
                                    onChange={(e) => {
                                      const newCriteria = { ...project.criteria, [criterion.id]: parseInt(e.target.value) };
                                      updateAIProject(project.id, 'criteria', newCriteria);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  >
                                    <option value={0}>0 - Non évalué</option>
                                    <option value={1}>1 - Très faible</option>
                                    <option value={2}>2 - Faible</option>
                                    <option value={3}>3 - Moyen</option>
                                    <option value={4}>4 - Bon</option>
                                    <option value={5}>5 - Excellent</option>
                                  </select>
                                </div>
                              ))}
                            </div>

                            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-purple-800">Score total: {project.totalScore}/40</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  project.priority === 'Haute' ? 'bg-red-100 text-red-800' :
                                  project.priority === 'Moyenne' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  Priorité: {project.priority}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => removeAIProject(project.id)}
                            className="text-red-600 hover:text-red-800 ml-4"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-purple-800 mb-2">Méthodologie d'évaluation ISO 42001</h3>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• <strong>Score 0-1:</strong> Projet non viable ou très risqué</li>
                    <li>• <strong>Score 2-3:</strong> Projet nécessitant des améliorations importantes</li>
                    <li>• <strong>Score 4-5:</strong> Projet prêt pour développement/déploiement</li>
                    <li>• <strong>Priorité Haute:</strong> Score total ≥ 32/40</li>
                    <li>• <strong>Priorité Moyenne:</strong> Score total 16-31/40</li>
                    <li>• <strong>Priorité Faible:</strong> Score total ≤ 15/40</li>
                  </ul>
                </div>
              </div>

              {/* Maturité organisationnelle IA */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Maturité Organisationnelle IA (Forum IA Québec)</h2>

                <div className="space-y-6">
                  {maturityDimensions.map((dimension) => (
                    <div key={dimension.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {dimension.name}
                        <span className="text-xs text-gray-500 block">{dimension.description}</span>
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={profileData.aiProjects.organizationalMaturity[dimension.id]}
                          onChange={(e) => updateMaturityDimension(dimension.id, parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <span className="w-32 text-sm font-medium text-gray-700">
                          {maturityLevels.find(level => level.value === profileData.aiProjects.organizationalMaturity[dimension.id])?.label}       
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {maturityLevels.find(level => level.value === profileData.aiProjects.organizationalMaturity[dimension.id])?.description}   
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-blue-800">Maturité moyenne: {calculateMaturityAverage()}/5</span>
                  </div>
                  <div className="text-sm text-blue-700">
                    Niveau organisationnel: {
                      calculateMaturityAverage() >= 4.5 ? 'Expert - Innovation continue' :
                      calculateMaturityAverage() >= 3.5 ? 'Avancé - Déploiements opérationnels' :
                      calculateMaturityAverage() >= 2.5 ? 'Intermédiaire - Projets pilotes' :
                      calculateMaturityAverage() >= 1.5 ? 'En développement - Apprentissage' :
                      'Débutant - Exploration initiale'
                    }
                  </div>
                </div>
              </div>

              {/* Préoccupations principales */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Préoccupations Principales (Conseil de l'Innovation du Québec)</h2>     

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Principales préoccupations identifiées pour votre organisation
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {mainConcerns.map((concern) => (
                        <label key={concern} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            checked={profileData.aiProjects.mainConcerns.includes(concern)}
                            onChange={() => toggleArrayItem(
                              profileData.aiProjects.mainConcerns,
                              concern,
                              (newArray) => updateAIProjects('mainConcerns', newArray)
                            )}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">{concern}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Évaluation de la préparation globale de l'organisation
                    </label>
                    <select
                      value={profileData.aiProjects.overallReadiness}
                      onChange={(e) => updateAIProjects('overallReadiness', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Évaluer la préparation globale</option>
                      {aiReadinessLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6 bg-amber-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-amber-800 mb-2">Recommandations du Conseil de l'Innovation</h3>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• <strong>Formation continue :</strong> "L'IA exige un investissement soutenu en formation et développement des compétences"</li>
                    <li>• <strong>Gouvernance éthique :</strong> "Mettre en place des comités d'éthique et des processus de validation"</li>  
                    <li>• <strong>Approche graduée :</strong> "Commencer par des projets pilotes avant le déploiement à grande échelle"</li> 
                    <li>• <strong>Collaboration :</strong> "Favoriser les partenariats avec les centres de recherche québécois"</li>
                    <li>• <strong>Mesure d'impact :</strong> "Établir des KPIs clairs pour mesurer le succès des initiatives IA"</li>
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