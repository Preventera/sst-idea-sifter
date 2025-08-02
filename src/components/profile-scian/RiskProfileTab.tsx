// src/components/profile-scian/RiskProfileTab.tsx
import React from 'react';
import type { ProfileData } from './types';
import { SHIFT_TYPES, COMMUNICATION_METHODS, RISK_ASSESSMENT_METHODS, SECTOR_SPECIFIC_RISKS } from './types';

interface RiskProfileTabProps {
  profileData: ProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
}

const RiskProfileTab: React.FC<RiskProfileTabProps> = ({ profileData, setProfileData }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Profil de risques et contexte organisationnel</h2>
        
        {/* Évaluation des risques */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Évaluation des risques SST</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Niveau de risque global
              </label>
              <select
                value={profileData.riskProfile.overallRiskLevel}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  riskProfile: { ...prev.riskProfile, overallRiskLevel: e.target.value }
                }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Faible">Faible</option>
                <option value="Moyen">Moyen</option>
                <option value="Élevé">Élevé</option>
                <option value="Critique">Critique</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Méthode d'évaluation
              </label>
              <select
                value={profileData.riskProfile.assessmentMethod}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  riskProfile: { ...prev.riskProfile, assessmentMethod: e.target.value }
                }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner méthode</option>
                {RISK_ASSESSMENT_METHODS.map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dernière évaluation
              </label>
              <input
                type="date"
                value={profileData.riskProfile.lastAssessment}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  riskProfile: { ...prev.riskProfile, lastAssessment: e.target.value }
                }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Risques spécifiques par secteur */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Risques primaires identifiés</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {profileData.company.scianCode && SECTOR_SPECIFIC_RISKS[profileData.company.scianCode.substring(0, 2)] ? 
                SECTOR_SPECIFIC_RISKS[profileData.company.scianCode.substring(0, 2)].map((risk) => (
                  <label key={risk} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={profileData.riskProfile.primaryRisks.includes(risk)}
                      onChange={(e) => {
                        const risks = profileData.riskProfile.primaryRisks;
                        if (e.target.checked) {
                          setProfileData(prev => ({
                            ...prev,
                            riskProfile: { ...prev.riskProfile, primaryRisks: [...risks, risk] }
                          }));
                        } else {
                          setProfileData(prev => ({
                            ...prev,
                            riskProfile: { ...prev.riskProfile, primaryRisks: risks.filter(r => r !== risk) }
                          }));
                        }
                      }}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    {risk}
                  </label>
                )) :
                // Risques génériques si pas de code SCIAN spécifique
                [
                  'Chutes de hauteur',
                  'Machines et équipements',
                  'Substances chimiques',
                  'Bruit et vibrations',
                  'Troubles musculo-squelettiques',
                  'Stress et fatigue',
                  'Incendie et explosion',
                  'Véhicules et transport'
                ].map((risk) => (
                  <label key={risk} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={profileData.riskProfile.primaryRisks.includes(risk)}
                      onChange={(e) => {
                        const risks = profileData.riskProfile.primaryRisks;
                        if (e.target.checked) {
                          setProfileData(prev => ({
                            ...prev,
                            riskProfile: { ...prev.riskProfile, primaryRisks: [...risks, risk] }
                          }));
                        } else {
                          setProfileData(prev => ({
                            ...prev,
                            riskProfile: { ...prev.riskProfile, primaryRisks: risks.filter(r => r !== risk) }
                          }));
                        }
                      }}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    {risk}
                  </label>
                ))
              }
            </div>
          </div>
        </div>

        {/* Contexte organisationnel détaillé */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contexte organisationnel</h3>
          
          {/* Patterns de travail */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Modèles de travail</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Types d'équipes/horaires
                </label>
                <div className="space-y-2">
                  {SHIFT_TYPES.map((shift) => (
                    <label key={shift} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={profileData.riskProfile.organizationalContext.workPatterns.shiftTypes.includes(shift)}
                        onChange={(e) => {
                          const shifts = profileData.riskProfile.organizationalContext.workPatterns.shiftTypes;
                          if (e.target.checked) {
                            setProfileData(prev => ({
                              ...prev,
                              riskProfile: {
                                ...prev.riskProfile,
                                organizationalContext: {
                                  ...prev.riskProfile.organizationalContext,
                                  workPatterns: {
                                    ...prev.riskProfile.organizationalContext.workPatterns,
                                    shiftTypes: [...shifts, shift]
                                  }
                                }
                              }
                            }));
                          } else {
                            setProfileData(prev => ({
                              ...prev,
                              riskProfile: {
                                ...prev.riskProfile,
                                organizationalContext: {
                                  ...prev.riskProfile.organizationalContext,
                                  workPatterns: {
                                    ...prev.riskProfile.organizationalContext.workPatterns,
                                    shiftTypes: shifts.filter(s => s !== shift)
                                  }
                                }
                              }
                            }));
                          }
                        }}
                        className="mr-2 h-4 w-4 text-blue-600"
                      />
                      {shift}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Travail à distance
                </label>
                <div className="space-y-3">
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={profileData.riskProfile.organizationalContext.workPatterns.remoteWork}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        riskProfile: {
                          ...prev.riskProfile,
                          organizationalContext: {
                            ...prev.riskProfile.organizationalContext,
                            workPatterns: {
                              ...prev.riskProfile.organizationalContext.workPatterns,
                              remoteWork: e.target.checked
                            }
                          }
                        }
                      }))}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    Travail à distance possible
                  </label>
                  {profileData.riskProfile.organizationalContext.workPatterns.remoteWork && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pourcentage télétravail
                      </label>
                      <select
                        value={profileData.riskProfile.organizationalContext.workPatterns.remoteWorkPercentage}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          riskProfile: {
                            ...prev.riskProfile,
                            organizationalContext: {
                              ...prev.riskProfile.organizationalContext,
                              workPatterns: {
                                ...prev.riskProfile.organizationalContext.workPatterns,
                                remoteWorkPercentage: e.target.value
                              }
                            }
                          }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Sélectionner</option>
                        <option value="< 25%">Moins de 25%</option>
                        <option value="25-50%">25% - 50%</option>
                        <option value="50-75%">50% - 75%</option>
                        <option value="> 75%">Plus de 75%</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Communication SST */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Méthodes de communication SST</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {COMMUNICATION_METHODS.map((method) => (
                <label key={method} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={profileData.riskProfile.organizationalContext.communicationMethods.includes(method)}
                    onChange={(e) => {
                      const methods = profileData.riskProfile.organizationalContext.communicationMethods;
                      if (e.target.checked) {
                        setProfileData(prev => ({
                          ...prev,
                          riskProfile: {
                            ...prev.riskProfile,
                            organizationalContext: {
                              ...prev.riskProfile.organizationalContext,
                              communicationMethods: [...methods, method]
                            }
                          }
                        }));
                      } else {
                        setProfileData(prev => ({
                          ...prev,
                          riskProfile: {
                            ...prev.riskProfile,
                            organizationalContext: {
                              ...prev.riskProfile.organizationalContext,
                              communicationMethods: methods.filter(m => m !== method)
                            }
                          }
                        }));
                      }
                    }}
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  {method}
                </label>
              ))}
            </div>
          </div>

          {/* Processus organisationnels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Processus de prise de décision
              </label>
              <select
                value={profileData.riskProfile.organizationalContext.decisionMakingProcess}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  riskProfile: {
                    ...prev.riskProfile,
                    organizationalContext: {
                      ...prev.riskProfile.organizationalContext,
                      decisionMakingProcess: e.target.value
                    }
                  }
                }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="Décision centralisée">Décision centralisée</option>
                <option value="Décision participative">Décision participative</option>
                <option value="Délégation d'autorité">Délégation d'autorité</option>
                <option value="Consensus d'équipe">Consensus d'équipe</option>
                <option value="Comités de décision">Comités de décision</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Approche gestion du changement
              </label>
              <select
                value={profileData.riskProfile.organizationalContext.changeManagementApproach}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  riskProfile: {
                    ...prev.riskProfile,
                    organizationalContext: {
                      ...prev.riskProfile.organizationalContext,
                      changeManagementApproach: e.target.value
                    }
                  }
                }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="Gestion formelle du changement">Gestion formelle du changement</option>
                <option value="Processus informel">Processus informel</option>
                <option value="Approche réactive">Approche réactive</option>
                <option value="Pas de processus défini">Pas de processus défini</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Culture de sécurité
              </label>
              <select
                value={profileData.riskProfile.organizationalContext.safetyCulture}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  riskProfile: {
                    ...prev.riskProfile,
                    organizationalContext: {
                      ...prev.riskProfile.organizationalContext,
                      safetyCulture: e.target.value
                    }
                  }
                }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Évaluer</option>
                <option value="Culture de sécurité excellente">Culture de sécurité excellente</option>
                <option value="Culture de sécurité développée">Culture de sécurité développée</option>
                <option value="Culture de sécurité en développement">Culture de sécurité en développement</option>
                <option value="Culture de sécurité déficiente">Culture de sécurité déficiente</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Engagement des employés
              </label>
              <select
                value={profileData.riskProfile.organizationalContext.employeeEngagement}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  riskProfile: {
                    ...prev.riskProfile,
                    organizationalContext: {
                      ...prev.riskProfile.organizationalContext,
                      employeeEngagement: e.target.value
                    }
                  }
                }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Évaluer</option>
                <option value="Très élevé">Très élevé</option>
                <option value="Élevé">Élevé</option>
                <option value="Modéré">Modéré</option>
                <option value="Faible">Faible</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mesures de contrôle */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mesures de contrôle des risques</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Équipements de protection individuelle (EPI)',
              'Formation et sensibilisation',
              'Procédures de travail sécuritaires',
              'Inspections régulières',
              'Maintenance préventive',
              'Surveillance médicale',
              'Signalisation de sécurité',
              'Systèmes d\'alarme et détection',
              'Contrôles d\'ingénierie',
              'Substitution de substances dangereuses'
            ].map((control) => (
              <label key={control} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={profileData.riskProfile.riskControls.includes(control)}
                  onChange={(e) => {
                    const controls = profileData.riskProfile.riskControls;
                    if (e.target.checked) {
                      setProfileData(prev => ({
                        ...prev,
                        riskProfile: { ...prev.riskProfile, riskControls: [...controls, control] }
                      }));
                    } else {
                      setProfileData(prev => ({
                        ...prev,
                        riskProfile: { ...prev.riskProfile, riskControls: controls.filter(c => c !== control) }
                      }));
                    }
                  }}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                {control}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskProfileTab;