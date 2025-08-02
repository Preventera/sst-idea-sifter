// src/components/profile-scian/ProfileScianMain.tsx
import React, { useState } from 'react';
import { Building2, Users, Shield, Brain, AlertTriangle, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { ProfileData, Actor, AIProject } from './types';
import CompanyInfoTab from './CompanyInfoTab';
import ActorsTab from './ActorsTab';
import HSETab from './HSETab';
import AIMaturityTab from './AIMaturityTab';
import RiskProfileTab from './RiskProfileTab';

const ProfileScianMain = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('company');

  // État centralisé pour tout le profil
  const [profileData, setProfileData] = useState<ProfileData>({
    company: {
      name: '',
      scianCode: '',
      scianDescription: '',
      sector: '',
      address: '',
      city: '',
      province: 'Québec',
      postalCode: '',
      phone: '',
      email: '',
      website: '',
      foundingYear: '',
      numberOfEmployees: '',
      annualRevenue: '',
      numberOfSites: '',
      installationTypes: [],
      unionPresence: false,
      unionOrganizations: [],
      secondarySectors: [],
      description: ''
    },
    actors: [],
    newActor: {
      name: '',
      role: '',
      type: 'COSS',
      seniority: '',
      sstCertifications: [],
      sstTrainingHours: '',
      specificResponsibilities: '',
      languages: [],
      authorityLevel: ''
    },
    hseData: {
      policies: {
        writtenPolicy: false,
        lastRevision: '',
        policyScope: [],
        communicationMethod: ''
      },
      regulatoryCompliance: {
        lsst: {
          preventionProgram: false,
          sstCommittee: false,
          preventionRepresentative: false,
          workplaceInspections: false,
          inspectionFrequency: ''
        },
        rss: {
          epiProgram: false,
          safetyTraining: false,
          riskAssessment: false,
          emergencyProcedures: false
        },
        cstc: {
          applicable: false,
          constructionSafetyCode: false,
          fallProtection: false,
          scaffoldingSafety: false
        },
        lmrsst: {
          applicable: false,
          miningType: '',
          undergroundSafety: false,
          explosivesSafety: false
        }
      },
      managementSystem: {
        type: '',
        certifications: [],
        systemComponents: [],
        auditFrequency: '',
        complianceStatus: 'Conforme'
      },
      incidentHistory: {
        accidentsWithStoppage: '',
        accidentsWithoutStoppage: '',
        nearMisses: '',
        annualWorkHours: '',
        frequencyRate: 0,
        severityRate: 0,
        lastMajorIncident: ''
      },
      cnessInspections: {
        lastInspectionDate: '',
        inspectionResults: '',
        correctiveNotices: [],
        fines: [],
        correctiveActions: [],
        nextInspection: ''
      },
      resources: {
        annualBudget: '',
        trainingBudget: '',
        dedicatedPersonnel: '',
        externalConsultants: false
      }
    },
    aiProjects: [],
    newProject: {
      name: '',
      description: '',
      category: '',
      irsstCategory: '',
      ocdeClassification: '',
      status: 'Planifié',
      loi25Compliance: false,
      explainabilityLevel: '',
      scianSectors: [],
      measuredImpact: '',
      governanceCommittee: false
    },
    maturityScores: {
      dataGovernance: 3,
      aiReadiness: 3,
      processIntegration: 3,
      changeManagement: 3,
      riskManagement: 3,
      ethicsCompliance: 3,
      humanOversight: 3
    },
    riskProfile: {
      overallRiskLevel: 'Moyen',
      primaryRisks: [],
      riskControls: [],
      assessmentMethod: '',
      lastAssessment: '',
      nextAssessment: '',
      organizationalContext: {
        workPatterns: {
          shiftTypes: [],
          workSchedule: '',
          remoteWork: false,
          remoteWorkPercentage: ''
        },
        communicationMethods: [],
        decisionMakingProcess: '',
        changeManagementApproach: '',
        safetyCulture: '',
        employeeEngagement: ''
      },
      sectorSpecificRisks: [],
      riskMapping: {
        highRiskActivities: [],
        criticalControlPoints: [],
        emergencyScenarios: []
      }
    }
  });

  // Fonctions de mise à jour centralisées
  const updateCompanyInfo = (field: keyof ProfileData['company'], value: any) => {
    setProfileData(prev => ({
      ...prev,
      company: { ...prev.company, [field]: value }
    }));
  };

  const updateHSEData = (section: keyof ProfileData['hseData'], field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      hseData: {
        ...prev.hseData,
        [section]: { ...prev.hseData[section], [field]: value }
      }
    }));
  };

  const addActor = () => {
    if (profileData.newActor.name && profileData.newActor.role) {
      const actor: Actor = {
        id: Date.now().toString(),
        ...profileData.newActor
      };
      setProfileData(prev => ({
        ...prev,
        actors: [...prev.actors, actor],
        newActor: {
          name: '',
          role: '',
          type: 'COSS',
          seniority: '',
          sstCertifications: [],
          sstTrainingHours: '',
          specificResponsibilities: '',
          languages: [],
          authorityLevel: ''
        }
      }));
    }
  };

  const removeActor = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      actors: prev.actors.filter(actor => actor.id !== id)
    }));
  };

  const addProject = () => {
    if (profileData.newProject.name && profileData.newProject.description) {
      const project: AIProject = {
        id: Date.now().toString(),
        ...profileData.newProject
      };
      setProfileData(prev => ({
        ...prev,
        aiProjects: [...prev.aiProjects, project],
        newProject: {
          name: '',
          description: '',
          category: '',
          irsstCategory: '',
          ocdeClassification: '',
          status: 'Planifié',
          loi25Compliance: false,
          explainabilityLevel: '',
          scianSectors: [],
          measuredImpact: '',
          governanceCommittee: false
        }
      }));
    }
  };

  const removeProject = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      aiProjects: prev.aiProjects.filter(project => project.id !== id)
    }));
  };

  const handleSave = () => {
    // Calcul automatique des taux de fréquence
    if (profileData.hseData.incidentHistory.annualWorkHours) {
      const workHours = parseInt(profileData.hseData.incidentHistory.annualWorkHours);
      const accidents = parseInt(profileData.hseData.incidentHistory.accidentsWithStoppage) || 0;
      const frequencyRate = (accidents * 200000) / workHours;
      
      setProfileData(prev => ({
        ...prev,
        hseData: {
          ...prev.hseData,
          incidentHistory: {
            ...prev.hseData.incidentHistory,
            frequencyRate: parseFloat(frequencyRate.toFixed(2))
          }
        }
      }));
    }

    localStorage.setItem('profileScian', JSON.stringify(profileData));
    alert('Profil sauvegardé avec succès !');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profil SCIAN Entreprise</h1>
                <p className="text-gray-600">Configuration complète de votre profil organisationnel</p>
              </div>
            </div>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder le profil
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'company', label: 'Entreprise', icon: Building2 },
                { id: 'actors', label: 'Acteurs SST', icon: Users },
                { id: 'hse', label: 'HSE', icon: Shield },
                { id: 'ai', label: 'IA & Maturité', icon: Brain },
                { id: 'risks', label: 'Profil de risques', icon: AlertTriangle }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Rendu conditionnel des onglets */}
            {activeTab === 'company' && (
              <CompanyInfoTab 
                profileData={profileData} 
                updateCompanyInfo={updateCompanyInfo} 
              />
            )}
            {activeTab === 'actors' && (
              <ActorsTab 
                profileData={profileData} 
                setProfileData={setProfileData}
                addActor={addActor}
                removeActor={removeActor}
              />
            )}
            {activeTab === 'hse' && (
              <HSETab 
                profileData={profileData} 
                updateHSEData={updateHSEData}
                setProfileData={setProfileData}
              />
            )}
            {activeTab === 'ai' && (
              <AIMaturityTab 
                profileData={profileData} 
                setProfileData={setProfileData}
                addProject={addProject}
                removeProject={removeProject}
              />
            )}
            {activeTab === 'risks' && (
              <RiskProfileTab 
                profileData={profileData} 
                setProfileData={setProfileData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScianMain;