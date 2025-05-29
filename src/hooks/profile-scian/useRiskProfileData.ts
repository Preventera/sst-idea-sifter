import { useState } from 'react';
import { RiskProfile, OrganizationalContext } from '@/types/profile-scian';

// Données initiales pour le contexte organisationnel
const initialOrganizationalContext: OrganizationalContext = {
  workOrganization: '',
  shiftPatterns: [],
  subcontractingLevel: '',
  workforceStability: '',
  safetyClimate: '',
  communicationMethods: [],
  decisionMakingProcess: '',
  changeManagement: ''
};

// Données initiales pour le profil de risque
const initialRiskProfile: RiskProfile = {
  primaryRisks: [],
  riskLevel: '',
  previousIncidents: false,
  organizationalContext: initialOrganizationalContext,
  specificSectorRisks: []
};

/**
 * Hook personnalisé pour gérer les données du profil de risque
 */
export const useRiskProfileData = (initialData?: RiskProfile) => {
  // État pour les données du profil de risque
  const [riskProfileData, setRiskProfileData] = useState<RiskProfile>(
    initialData || initialRiskProfile
  );

  /**
   * Mise à jour d'un champ spécifique du profil de risque
   * @param field Le champ à mettre à jour
   * @param value La nouvelle valeur
   */
  const updateRiskProfileField = <K extends keyof RiskProfile>(field: K, value: RiskProfile[K]) => {
    setRiskProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Mise à jour d'un champ spécifique du contexte organisationnel
   * @param field Le champ à mettre à jour
   * @param value La nouvelle valeur
   */
  const updateOrganizationalContextField = <K extends keyof OrganizationalContext>(
    field: K,
    value: OrganizationalContext[K]
  ) => {
    setRiskProfileData(prev => ({
      ...prev,
      organizationalContext: {
        ...prev.organizationalContext,
        [field]: value
      }
    }));
  };

  /**
   * Ajoute ou supprime un élément dans un tableau du profil de risque
   * @param field Le champ de type tableau à modifier
   * @param item L'élément à ajouter ou supprimer
   */
  const toggleRiskProfileArrayItem = <K extends keyof RiskProfile>(
    field: K,
    item: string
  ) => {
    if (Array.isArray(riskProfileData[field])) {
      const array = riskProfileData[field] as string[];
      const newArray = array.includes(item)
        ? array.filter(i => i !== item)
        : [...array, item];
      
      updateRiskProfileField(field, newArray as RiskProfile[K]);
    }
  };

  /**
   * Ajoute ou supprime un élément dans un tableau du contexte organisationnel
   * @param field Le champ de type tableau à modifier
   * @param item L'élément à ajouter ou supprimer
   */
  const toggleOrganizationalContextArrayItem = <K extends keyof OrganizationalContext>(
    field: K,
    item: string
  ) => {
    if (Array.isArray(riskProfileData.organizationalContext[field])) {
      const array = riskProfileData.organizationalContext[field] as string[];
      const newArray = array.includes(item)
        ? array.filter(i => i !== item)
        : [...array, item];
      
      updateOrganizationalContextField(field, newArray as OrganizationalContext[K]);
    }
  };

  /**
   * Récupère les risques spécifiques au secteur sélectionné
   * @param sector Le code du secteur SCIAN
   * @param sectorRisks L'objet contenant les risques par secteur
   */
  const getSectorRisks = (
    sector: string,
    sectorRisks: Record<string, string[]>
  ): string[] => {
    return sector && sectorRisks[sector] ? sectorRisks[sector] : [];
  };

  /**
   * Réinitialise les données du profil de risque
   */
  const resetRiskProfileData = () => {
    setRiskProfileData(initialRiskProfile);
  };

  /**
   * Vérifie si les données du profil de risque sont valides
   */
  const validateRiskProfileData = (): boolean => {
    // Le niveau de risque doit être sélectionné
    if (!riskProfileData.riskLevel) {
      return false;
    }
    
    // Le type d'organisation du travail doit être sélectionné
    if (!riskProfileData.organizationalContext.workOrganization) {
      return false;
    }
    
    return true;
  };

  return {
    riskProfileData,
    setRiskProfileData,
    updateRiskProfileField,
    updateOrganizationalContextField,
    toggleRiskProfileArrayItem,
    toggleOrganizationalContextArrayItem,
    getSectorRisks,
    resetRiskProfileData,
    validateRiskProfileData
  };
};