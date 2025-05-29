import React from 'react';
import { RiskProfile } from '@/types/profile-scian';
import { TabLayout, CheckboxGroup } from '@/components/profile-scian/common';
import { 
  riskLevels,
  workOrganizationTypes,
  shiftPatterns,
  subcontractingLevels,
  workforceStabilityLevels,
  safetyClimateOptions,
  communicationMethods,
  decisionMakingProcesses,
  changeManagementApproaches,
  sectorSpecificRisks
} from '@/data/profile-scian-data';

interface RisksTabProps {
  riskProfileData: RiskProfile;
  sectorCode: string;
  updateRiskProfileField: <K extends keyof RiskProfile>(field: K, value: RiskProfile[K]) => void;
  updateOrganizationalContextField: (field: string, value: any) => void;
  toggleRiskProfileArrayItem: (field: keyof RiskProfile, item: string) => void;
  toggleOrganizationalContextArrayItem: (field: string, item: string) => void;
  getSectorRisks: (sector: string, sectorRisks: Record<string, string[]>) => string[];
}

/**
 * Composant pour l'onglet Profil de Risque du profil SCIAN
 */
const RisksTab: React.FC<RisksTabProps> = ({
  riskProfileData,
  sectorCode,
  updateRiskProfileField,
  updateOrganizationalContextField,
  toggleRiskProfileArrayItem,
  toggleOrganizationalContextArrayItem,
  getSectorRisks
}) => {
  // Récupérer les risques spécifiques au secteur
  const sectorRisks = getSectorRisks(sectorCode, sectorSpecificRisks);

  return (
    <div className="space-y-6">
      {/* Risques spécifiques par secteur */}
      <TabLayout title="Risques spécifiques par secteur SCIAN">
        {sectorCode ? (
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Risques identifiés pour le secteur {sectorCode}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sectorRisks.map((risk) => (
                <label key={risk} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={riskProfileData.specificSectorRisks.includes(risk)}
                    onChange={() => toggleRiskProfileArrayItem('specificSectorRisks', risk)}
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
      </TabLayout>

      {/* Contexte organisationnel */}
      <TabLayout title="Contexte organisationnel">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type d'organisation du travail
            </label>
            <select
              value={riskProfileData.organizationalContext.workOrganization}
              onChange={(e) => updateOrganizationalContextField('workOrganization', e.target.value)}
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
              value={riskProfileData.organizationalContext.subcontractingLevel}
              onChange={(e) => updateOrganizationalContextField('subcontractingLevel', e.target.value)}
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
              value={riskProfileData.organizationalContext.workforceStability}
              onChange={(e) => updateOrganizationalContextField('workforceStability', e.target.value)}
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
              value={riskProfileData.organizationalContext.safetyClimate}
              onChange={(e) => updateOrganizationalContextField('safetyClimate', e.target.value)}
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
              value={riskProfileData.organizationalContext.decisionMakingProcess}
              onChange={(e) => updateOrganizationalContextField('decisionMakingProcess', e.target.value)}
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
              value={riskProfileData.organizationalContext.changeManagement}
              onChange={(e) => updateOrganizationalContextField('changeManagement', e.target.value)}
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
          <CheckboxGroup
            label="Horaires et modalités de travail"
            options={shiftPatterns}
            selectedOptions={riskProfileData.organizationalContext.shiftPatterns}
            onChange={(newPatterns) => updateOrganizationalContextField('shiftPatterns', newPatterns)}
            columns={2}
          />
        </div>

        <div className="mt-6">
          <CheckboxGroup
            label="Méthodes de communication SST"
            options={communicationMethods}
            selectedOptions={riskProfileData.organizationalContext.communicationMethods}
            onChange={(newMethods) => updateOrganizationalContextField('communicationMethods', newMethods)}
            columns={2}
          />
        </div>
      </TabLayout>

      {/* Évaluation globale des risques */}
      <TabLayout title="Évaluation globale des risques">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau de risque global évalué
            </label>
            <select
              value={riskProfileData.riskLevel}
              onChange={(e) => updateRiskProfileField('riskLevel', e.target.value)}
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
                checked={riskProfileData.previousIncidents}
                onChange={(e) => updateRiskProfileField('previousIncidents', e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">
                L'entreprise a eu des incidents HSE significatifs dans les 3 dernières années
              </span>
            </label>
          </div>
        </div>
      </TabLayout>
    </div>
  );
};

export default RisksTab;