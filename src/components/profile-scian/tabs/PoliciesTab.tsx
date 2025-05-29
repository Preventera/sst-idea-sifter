import React from 'react';
import { HSEPolicies } from '@/types/profile-scian';
import { TabLayout, CheckboxGroup } from '@/components/profile-scian/common';
import { complianceFrameworks } from '@/data/profile-scian-data';

interface PoliciesTabProps {
  policiesData: HSEPolicies;
  updatePolicyField: <K extends keyof HSEPolicies>(field: K, value: HSEPolicies[K]) => void;
}

/**
 * Composant pour l'onglet Politiques HSE du profil SCIAN
 */
const PoliciesTab: React.FC<PoliciesTabProps> = ({ 
  policiesData,
  updatePolicyField
}) => {
  const handleToggleFramework = (newFrameworks: string[]) => {
    updatePolicyField('complianceFramework', newFrameworks);
  };

  return (
    <TabLayout title="Politiques HSE">
      <div>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={policiesData.hasWrittenPolicy}
            onChange={(e) => updatePolicyField('hasWrittenPolicy', e.target.checked)}
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
          value={policiesData.lastReview}
          onChange={(e) => updatePolicyField('lastReview', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!policiesData.hasWrittenPolicy}
        />
        {policiesData.hasWrittenPolicy && !policiesData.lastReview && (
          <p className="text-red-500 text-sm mt-1">
            Veuillez indiquer la date de dernière révision
          </p>
        )}
      </div>

      <CheckboxGroup
        label="Cadres de conformité appliqués"
        options={complianceFrameworks}
        selectedOptions={policiesData.complianceFramework}
        onChange={handleToggleFramework}
        columns={2}
      />

      {policiesData.complianceFramework.length === 0 && (
        <p className="text-amber-500 text-sm mt-1">
          Veuillez sélectionner au moins un cadre de conformité
        </p>
      )}

      {/* Informations supplémentaires sur les cadres de conformité */}
      {policiesData.complianceFramework.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Résumé des cadres sélectionnés</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            {policiesData.complianceFramework.includes('ISO 45001') && (
              <li>• <strong>ISO 45001:</strong> Norme internationale pour les systèmes de management de la santé et de la sécurité au travail</li>
            )}
            {policiesData.complianceFramework.includes('CNESST (Quebec)') && (
              <li>• <strong>CNESST:</strong> Organisme québécois responsable de l'application des lois et règlements en matière de SST</li>
            )}
            {policiesData.complianceFramework.includes('RSST (Règlement sur la santé et la sécurité du travail)') && (
              <li>• <strong>RSST:</strong> Cadre réglementaire québécois définissant les normes minimales de SST</li>
            )}
          </ul>
        </div>
      )}
    </TabLayout>
  );
};

export default PoliciesTab;