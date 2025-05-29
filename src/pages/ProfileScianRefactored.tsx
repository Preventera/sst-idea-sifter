import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Building2, Users, Shield, User, ArrowLeft, Save, Brain } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Importation des composants d'onglets
import CompanyTab from '@/components/profile-scian/tabs/CompanyTab';
import ActorsTab from '@/components/profile-scian/tabs/ActorsTab';
import PoliciesTab from '@/components/profile-scian/tabs/PoliciesTab';
import SystemTab from '@/components/profile-scian/tabs/SystemTab';
import RisksTab from '@/components/profile-scian/tabs/RisksTab';

// Importation des hooks personnalisés
import { useCompanyData } from '@/hooks/profile-scian/useCompanyData';
import { useActorsData } from '@/hooks/profile-scian/useActorsData';
import { usePoliciesData } from '@/hooks/profile-scian/usePoliciesData';
import { useSystemData } from '@/hooks/profile-scian/useSystemData';
import { useRiskProfileData } from '@/hooks/profile-scian/useRiskProfileData';

// Importation des types
import { Actor, ProfileScianData } from '@/types/profile-scian';

/**
 * Composant principal du profil SCIAN (version refactorisée)
 */
const ProfileScianRefactored: React.FC = () => {
  const navigate = useNavigate();
  
  // Gestion des onglets
  const [activeTab, setActiveTab] = useState<'company' | 'actors' | 'policies' | 'system' | 'risks'>('company');
  
  // Utilisation des hooks personnalisés
  const { 
    companyData, 
    updateCompanyField 
  } = useCompanyData();
  
  // Hooks pour les acteurs
  const {
    actors,
    addActor: addMainActor,
    removeActor: removeMainActor,
    updateActor: updateMainActor
  } = useActorsData();
  
  const {
    actors: sstCommittee,
    addActor: addSSTCommitteeMember,
    removeActor: removeSSTCommitteeMember,
    updateActor: updateSSTCommitteeMember
  } = useActorsData();
  
  const {
    actors: cossMembers,
    addActor: addCOSSMember,
    removeActor: removeCOSSMember,
    updateActor: updateCOSSMember
  } = useActorsData();
  
  const {
    actors: cstcMembers,
    addActor: addCSTCMember,
    removeActor: removeCSTCMember,
    updateActor: updateCSTCMember
  } = useActorsData();
  
  const {
    actors: management,
    addActor: addManagementMember,
    removeActor: removeManagementMember,
    updateActor: updateManagementMember
  } = useActorsData();
  
  // Hook pour les politiques HSE
  const {
    policiesData,
    updatePolicyField
  } = usePoliciesData();
  
  // Hook pour le système SST
  const {
    systemData,
    selectedSystemType,
    updateSystemField,
    toggleArrayItem: toggleSystemArrayItem,
    getSystemComponentsByType
  } = useSystemData();
  
  // Hook pour le profil de risque
  const {
    riskProfileData,
    updateRiskProfileField,
    updateOrganizationalContextField,
    toggleRiskProfileArrayItem,
    toggleOrganizationalContextArrayItem,
    getSectorRisks
  } = useRiskProfileData();
  
  // Fonction pour ajouter un acteur selon le type
  const handleAddActor = (type: 'actors' | 'sstCommittee' | 'cossMembers' | 'cstcMembers' | 'management') => {
    switch (type) {
      case 'actors':
        addMainActor();
        break;
      case 'sstCommittee':
        addSSTCommitteeMember();
        break;
      case 'cossMembers':
        addCOSSMember();
        break;
      case 'cstcMembers':
        addCSTCMember();
        break;
      case 'management':
        addManagementMember();
        break;
    }
  };
  
  // Fonction pour supprimer un acteur selon le type
  const handleRemoveActor = (type: 'actors' | 'sstCommittee' | 'cossMembers' | 'cstcMembers' | 'management', id: number) => {
    switch (type) {
      case 'actors':
        removeMainActor(id);
        break;
      case 'sstCommittee':
        removeSSTCommitteeMember(id);
        break;
      case 'cossMembers':
        removeCOSSMember(id);
        break;
      case 'cstcMembers':
        removeCSTCMember(id);
        break;
      case 'management':
        removeManagementMember(id);
        break;
    }
  };
  
  // Fonction pour mettre à jour un acteur selon le type
  const handleUpdateActor = (
    type: 'actors' | 'sstCommittee' | 'cossMembers' | 'cstcMembers' | 'management',
    id: number,
    field: keyof Actor,
    value: string
  ) => {
    switch (type) {
      case 'actors':
        updateMainActor(id, field, value);
        break;
      case 'sstCommittee':
        updateSSTCommitteeMember(id, field, value);
        break;
      case 'cossMembers':
        updateCOSSMember(id, field, value);
        break;
      case 'cstcMembers':
        updateCSTCMember(id, field, value);
        break;
      case 'management':
        updateManagementMember(id, field, value);
        break;
    }
  };
  
  // Fonction pour sauvegarder le profil
  const handleSaveProfile = () => {
    // Création de l'objet de données complet
    const profileData: ProfileScianData = {
      company: companyData,
      actors,
      sstCommittee,
      cossMembers,
      cstcMembers,
      management,
      hsePolicies: policiesData,
      sstManagementSystem: systemData,
      riskProfile: riskProfileData
    };
    
    // Ici, vous pourriez sauvegarder les données dans localStorage ou les envoyer à une API
    console.log('Profil sauvegardé:', profileData);
    
    // Redirection vers la page principale (à adapter selon vos besoins)
    // navigate('/');
  };
  
  // Définition des onglets
  const tabs = [
    { id: 'company', name: 'Entreprise', icon: Building2 },
    { id: 'actors', name: 'Acteurs', icon: Users },
    { id: 'policies', name: 'Politiques HSE', icon: Shield },
    { id: 'system', name: 'Système SST', icon: Shield },
    { id: 'risks', name: 'Profil de Risque', icon: User }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Questionnaire IGNITIA - Profil SCIAN HSE
              </h1>
              <p className="text-gray-600">
                Configuration du profil utilisateur pour l'évaluation des risques en santé, sécurité et environnement
              </p>
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={16} />
              Retour
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex border-b overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
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
            <CompanyTab
              companyData={companyData}
              updateCompanyField={updateCompanyField}
            />
          )}

          {activeTab === 'actors' && (
            <ActorsTab
              actors={actors}
              sstCommittee={sstCommittee}
              cossMembers={cossMembers}
              cstcMembers={cstcMembers}
              management={management}
              onAddActor={handleAddActor}
              onRemoveActor={handleRemoveActor}
              onUpdateActor={handleUpdateActor}
            />
          )}

          {activeTab === 'policies' && (
            <PoliciesTab
              policiesData={policiesData}
              updatePolicyField={updatePolicyField}
            />
          )}

          {activeTab === 'system' && (
            <SystemTab
              systemData={systemData}
              selectedSystemType={selectedSystemType}
              updateSystemField={updateSystemField}
              toggleArrayItem={toggleSystemArrayItem}
              getSystemComponentsByType={getSystemComponentsByType}
            />
          )}

          {activeTab === 'risks' && (
            <RisksTab
              riskProfileData={riskProfileData}
              sectorCode={companyData.sector}
              updateRiskProfileField={updateRiskProfileField}
              updateOrganizationalContextField={updateOrganizationalContextField}
              toggleRiskProfileArrayItem={toggleRiskProfileArrayItem}
              toggleOrganizationalContextArrayItem={toggleOrganizationalContextArrayItem}
              getSectorRisks={getSectorRisks}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            Annuler
          </Button>
          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={handleSaveProfile}
          >
            <Save size={16} />
            Sauvegarder le profil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScianRefactored;