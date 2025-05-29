import React from 'react';
import { SSTManagementSystem } from '@/types/profile-scian';
import { TabLayout, CheckboxGroup } from '@/components/profile-scian/common';
import { 
  sstSystemTypes, 
  sstCertifications, 
  sstSystemComponents,
  sstMethodologies,
} from '@/data/profile-scian-data';

interface SystemTabProps {
  systemData: SSTManagementSystem;
  selectedSystemType: string;
  updateSystemField: <K extends keyof SSTManagementSystem>(field: K, value: SSTManagementSystem[K]) => void;
  toggleArrayItem: (field: keyof SSTManagementSystem, item: string) => void;
  getSystemComponentsByType: (componentsByType: Record<string, string[]>) => string[];
}

/**
 * Composant pour l'onglet Système SST du profil SCIAN
 */
const SystemTab: React.FC<SystemTabProps> = ({ 
  systemData,
  selectedSystemType,
  updateSystemField,
  toggleArrayItem,
  getSystemComponentsByType
}) => {
  // Récupérer les composantes du système en fonction du type sélectionné
  const systemComponents = getSystemComponentsByType(sstSystemComponents);

  return (
    <div className="space-y-6">
      {/* Système de gestion SST principal */}
      <TabLayout title="Système de Gestion SST">
        <div>
          <label className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              checked={systemData.hasImplementedSystem}
              onChange={(e) => updateSystemField('hasImplementedSystem', e.target.checked)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">
              L'entreprise a mis en place un système de gestion SST formalisé
            </span>
          </label>
        </div>

        {systemData.hasImplementedSystem && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de système SST <span className="text-red-500">*</span>
                </label>
                <select
                  value={systemData.systemType}
                  onChange={(e) => updateSystemField('systemType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner le système de gestion SST</option>
                  {sstSystemTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {systemData.hasImplementedSystem && !systemData.systemType && (
                  <p className="text-red-500 text-sm mt-1">
                    Veuillez sélectionner un type de système
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dernier audit du système
                </label>
                <input
                  type="date"
                  value={systemData.lastAudit}
                  onChange={(e) => updateSystemField('lastAudit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <CheckboxGroup
              label="Certifications SST obtenues"
              options={sstCertifications}
              selectedOptions={systemData.certifications}
              onChange={(newCertifications) => updateSystemField('certifications', newCertifications)}
              columns={2}
            />

            {systemData.hasImplementedSystem && systemData.certifications.length === 0 && (
              <p className="text-amber-500 text-sm mt-1">
                Veuillez sélectionner au moins une certification
              </p>
            )}

            {selectedSystemType && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Composantes du système {selectedSystemType.split(' - ')[0]} mises en place
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {systemComponents.map((component) => (
                    <label key={component} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={systemData.systemComponents.includes(component)}
                        onChange={() => toggleArrayItem('systemComponents', component)}
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
      </TabLayout>

      {/* Méthodologies d'analyse des risques */}
      <TabLayout title="Méthodologies d'Analyse des Risques">
        <CheckboxGroup
          label="Méthodes d'analyse des risques utilisées"
          options={sstMethodologies}
          selectedOptions={[]} // À connecter à l'état
          onChange={() => {}} // À implémenter
          columns={2}
        />

        <div className="mt-6 bg-amber-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-amber-800 mb-2">Focus sur les méthodes d'évaluation</h3>
          <div className="text-sm text-amber-700 space-y-2">
            <p><strong>Méthode Kinney :</strong> Évaluation quantitative basée sur Probabilité × Exposition × Conséquences</p>
            <p><strong>HAZOP :</strong> Analyse systématique des déviations pour identifier les dangers</p>
            <p><strong>Bow-Tie :</strong> Visualisation des barrières préventives et protectives</p>
            <p><strong>5M :</strong> Analyse des causes : Matière, Matériel, Main-d'œuvre, Milieu, Méthode</p>
          </div>
        </div>
      </TabLayout>
    </div>
  );
};

export default SystemTab;