// src/components/profile-scian/HSETab.tsx
import React from 'react';
import type { ProfileData } from './types';

interface HSETabProps {
  profileData: ProfileData;
  updateHSEData: (section: keyof ProfileData['hseData'], field: string, value: any) => void;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
}

const HSETab: React.FC<HSETabProps> = ({ profileData, updateHSEData, setProfileData }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Système de gestion HSE</h2>
        
        {/* Politique SST */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Politique de santé et sécurité au travail</h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={profileData.hseData.policies.writtenPolicy}
                onChange={(e) => updateHSEData('policies', 'writtenPolicy', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">Politique SST écrite et approuvée</span>
            </label>
            {profileData.hseData.policies.writtenPolicy && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de dernière révision
                  </label>
                  <input
                    type="date"
                    value={profileData.hseData.policies.lastRevision}
                    onChange={(e) => updateHSEData('policies', 'lastRevision', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Méthode de communication
                  </label>
                  <select
                    value={profileData.hseData.policies.communicationMethod}
                    onChange={(e) => updateHSEData('policies', 'communicationMethod', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Affichage">Affichage dans les locaux</option>
                    <option value="Formation">Session de formation</option>
                    <option value="Intranet">Publication sur intranet</option>
                    <option value="Remise">Remise individuelle</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conformité réglementaire québécoise */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Conformité réglementaire québécoise</h3>
          
          {/* LSST */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">LSST - Loi sur la santé et sécurité au travail</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={profileData.hseData.regulatoryCompliance.lsst.preventionProgram}
                  onChange={(e) => {
                    const newData = { ...profileData.hseData.regulatoryCompliance.lsst, preventionProgram: e.target.checked };
                    setProfileData(prev => ({
                      ...prev,
                      hseData: { ...prev.hseData, regulatoryCompliance: { ...prev.hseData.regulatoryCompliance, lsst: newData }}
                    }));
                  }}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                Programme de prévention établi
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={profileData.hseData.regulatoryCompliance.lsst.sstCommittee}
                  onChange={(e) => {
                    const newData = { ...profileData.hseData.regulatoryCompliance.lsst, sstCommittee: e.target.checked };
                    setProfileData(prev => ({
                      ...prev,
                      hseData: { ...prev.hseData, regulatoryCompliance: { ...prev.hseData.regulatoryCompliance, lsst: newData }}
                    }));
                  }}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                Comité de santé et sécurité
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={profileData.hseData.regulatoryCompliance.lsst.preventionRepresentative}
                  onChange={(e) => {
                    const newData = { ...profileData.hseData.regulatoryCompliance.lsst, preventionRepresentative: e.target.checked };
                    setProfileData(prev => ({
                      ...prev,
                      hseData: { ...prev.hseData, regulatoryCompliance: { ...prev.hseData.regulatoryCompliance, lsst: newData }}
                    }));
                  }}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                Représentant à la prévention
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={profileData.hseData.regulatoryCompliance.lsst.workplaceInspections}
                  onChange={(e) => {
                    const newData = { ...profileData.hseData.regulatoryCompliance.lsst, workplaceInspections: e.target.checked };
                    setProfileData(prev => ({
                      ...prev,
                      hseData: { ...prev.hseData, regulatoryCompliance: { ...prev.hseData.regulatoryCompliance, lsst: newData }}
                    }));
                  }}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                Inspections des lieux de travail
              </label>
            </div>
            {profileData.hseData.regulatoryCompliance.lsst.workplaceInspections && (
              <div className="mt-3 ml-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fréquence des inspections
                </label>
                <select
                  value={profileData.hseData.regulatoryCompliance.lsst.inspectionFrequency}
                  onChange={(e) => {
                    const newData = { ...profileData.hseData.regulatoryCompliance.lsst, inspectionFrequency: e.target.value };
                    setProfileData(prev => ({
                      ...prev,
                      hseData: { ...prev.hseData, regulatoryCompliance: { ...prev.hseData.regulatoryCompliance, lsst: newData }}
                    }));
                  }}
                  className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner</option>
                  <option value="Mensuelle">Mensuelle</option>
                  <option value="Trimestrielle">Trimestrielle</option>
                  <option value="Semestrielle">Semestrielle</option>
                  <option value="Annuelle">Annuelle</option>
                </select>
              </div>
            )}
          </div>

          {/* RSS */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">RSS - Règlement sur la santé et sécurité</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={profileData.hseData.regulatoryCompliance.rss.epiProgram}
                  onChange={(e) => {
                    const newData = { ...profileData.hseData.regulatoryCompliance.rss, epiProgram: e.target.checked };
                    setProfileData(prev => ({
                      ...prev,
                      hseData: { ...prev.hseData, regulatoryCompliance: { ...prev.hseData.regulatoryCompliance, rss: newData }}
                    }));
                  }}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                Programme EPI établi
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={profileData.hseData.regulatoryCompliance.rss.safetyTraining}
                  onChange={(e) => {
                    const newData = { ...profileData.hseData.regulatoryCompliance.rss, safetyTraining: e.target.checked };
                    setProfileData(prev => ({
                      ...prev,
                      hseData: { ...prev.hseData, regulatoryCompliance: { ...prev.hseData.regulatoryCompliance, rss: newData }}
                    }));
                  }}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                Formation sécurité obligatoire
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={profileData.hseData.regulatoryCompliance.rss.riskAssessment}
                  onChange={(e) => {
                    const newData = { ...profileData.hseData.regulatoryCompliance.rss, riskAssessment: e.target.checked };
                    setProfileData(prev => ({
                      ...prev,
                      hseData: { ...prev.hseData, regulatoryCompliance: { ...prev.hseData.regulatoryCompliance, rss: newData }}
                    }));
                  }}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                Évaluation des risques
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={profileData.hseData.regulatoryCompliance.rss.emergencyProcedures}
                  onChange={(e) => {
                    const newData = { ...profileData.hseData.regulatoryCompliance.rss, emergencyProcedures: e.target.checked };
                    setProfileData(prev => ({
                      ...prev,
                      hseData: { ...prev.hseData, regulatoryCompliance: { ...prev.hseData.regulatoryCompliance, rss: newData }}
                    }));
                  }}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                Procédures d'urgence
              </label>
            </div>
          </div>
        </div>

        {/* Historique des incidents */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Historique des incidents et accidents (3 dernières années)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Accidents avec arrêt de travail
              </label>
              <input
                type="number"
                value={profileData.hseData.incidentHistory.accidentsWithStoppage}
                onChange={(e) => {
                  const newData = { ...profileData.hseData.incidentHistory, accidentsWithStoppage: e.target.value };
                  setProfileData(prev => ({
                    ...prev,
                    hseData: { ...prev.hseData, incidentHistory: newData }
                  }));
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Accidents sans arrêt de travail
              </label>
              <input
                type="number"
                value={profileData.hseData.incidentHistory.accidentsWithoutStoppage}
                onChange={(e) => {
                  const newData = { ...profileData.hseData.incidentHistory, accidentsWithoutStoppage: e.target.value };
                  setProfileData(prev => ({
                    ...prev,
                    hseData: { ...prev.hseData, incidentHistory: newData }
                  }));
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quasi-accidents déclarés
              </label>
              <input
                type="number"
                value={profileData.hseData.incidentHistory.nearMisses}
                onChange={(e) => {
                  const newData = { ...profileData.hseData.incidentHistory, nearMisses: e.target.value };
                  setProfileData(prev => ({
                    ...prev,
                    hseData: { ...prev.hseData, incidentHistory: newData }
                  }));
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heures travaillées annuelles
              </label>
              <input
                type="number"
                value={profileData.hseData.incidentHistory.annualWorkHours}
                onChange={(e) => {
                  const newData = { ...profileData.hseData.incidentHistory, annualWorkHours: e.target.value };
                  setProfileData(prev => ({
                    ...prev,
                    hseData: { ...prev.hseData, incidentHistory: newData }
                  }));
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Heures totales"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taux de fréquence calculé
              </label>
              <input
                type="text"
                value={profileData.hseData.incidentHistory.frequencyRate}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                placeholder="Auto-calculé"
              />
            </div>
          </div>
        </div>

        {/* Système de gestion */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Système de gestion SST</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de système
              </label>
              <select
                value={profileData.hseData.managementSystem.type}
                onChange={(e) => updateHSEData('managementSystem', 'type', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner un système</option>
                <option value="ISO 45001">ISO 45001</option>
                <option value="Programme de prévention CNESST">Programme de prévention CNESST</option>
                <option value="Système interne">Système interne</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut de conformité
              </label>
              <select
                value={profileData.hseData.managementSystem.complianceStatus}
                onChange={(e) => updateHSEData('managementSystem', 'complianceStatus', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Conforme">Conforme</option>
                <option value="En cours de mise en conformité">En cours de mise en conformité</option>
                <option value="Non conforme">Non conforme</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fréquence d'audit
              </label>
              <select
                value={profileData.hseData.managementSystem.auditFrequency}
                onChange={(e) => updateHSEData('managementSystem', 'auditFrequency', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="Trimestrielle">Trimestrielle</option>
                <option value="Semestrielle">Semestrielle</option>
                <option value="Annuelle">Annuelle</option>
                <option value="Bisannuelle">Bisannuelle</option>
              </select>
            </div>
          </div>
        </div>

        {/* Budget SST */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Budget et ressources SST</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget SST annuel (CAD)
              </label>
              <input
                type="number"
                value={profileData.hseData.resources.annualBudget}
                onChange={(e) => {
                  const newData = { ...profileData.hseData.resources, annualBudget: e.target.value };
                  setProfileData(prev => ({
                    ...prev,
                    hseData: { ...prev.hseData, resources: newData }
                  }));
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="$ montant"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget formation SST (CAD)
              </label>
              <input
                type="number"
                value={profileData.hseData.resources.trainingBudget}
                onChange={(e) => {
                  const newData = { ...profileData.hseData.resources, trainingBudget: e.target.value };
                  setProfileData(prev => ({
                    ...prev,
                    hseData: { ...prev.hseData, resources: newData }
                  }));
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="$ montant"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Personnel dédié SST (ETP)
              </label>
              <input
                type="number"
                step="0.1"
                value={profileData.hseData.resources.dedicatedPersonnel}
                onChange={(e) => {
                  const newData = { ...profileData.hseData.resources, dedicatedPersonnel: e.target.value };
                  setProfileData(prev => ({
                    ...prev,
                    hseData: { ...prev.hseData, resources: newData }
                  }));
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ex: 1.5"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HSETab;