import { useState } from 'react';
import { HSEPolicies } from '@/types/profile-scian';

// Données initiales pour les politiques HSE
const initialHSEPolicies: HSEPolicies = {
  hasWrittenPolicy: false,
  lastReview: '',
  complianceFramework: []
};

/**
 * Hook personnalisé pour gérer les données des politiques HSE
 */
export const usePoliciesData = (initialData?: HSEPolicies) => {
  // État pour les données des politiques HSE
  const [policiesData, setPoliciesData] = useState<HSEPolicies>(
    initialData || initialHSEPolicies
  );

  /**
   * Mise à jour d'un champ spécifique
   * @param field Le champ à mettre à jour
   * @param value La nouvelle valeur
   */
  const updatePolicyField = <K extends keyof HSEPolicies>(field: K, value: HSEPolicies[K]) => {
    setPoliciesData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Ajoute ou supprime un élément dans un tableau
   * @param field Le champ de type tableau à modifier
   * @param item L'élément à ajouter ou supprimer
   */
  const toggleArrayItem = <K extends keyof HSEPolicies>(
    field: K,
    item: string
  ) => {
    if (Array.isArray(policiesData[field])) {
      const array = policiesData[field] as string[];
      const newArray = array.includes(item)
        ? array.filter(i => i !== item)
        : [...array, item];
      
      updatePolicyField(field, newArray as HSEPolicies[K]);
    }
  };

  /**
   * Réinitialise les données des politiques
   */
  const resetPoliciesData = () => {
    setPoliciesData(initialHSEPolicies);
  };

  /**
   * Vérifie si les données des politiques sont valides
   */
  const validatePoliciesData = (): boolean => {
    // Si une politique écrite est déclarée, la date de révision doit être renseignée
    if (policiesData.hasWrittenPolicy && !policiesData.lastReview) {
      return false;
    }
    
    // Au moins un cadre de conformité doit être sélectionné
    if (policiesData.complianceFramework.length === 0) {
      return false;
    }
    
    return true;
  };

  return {
    policiesData,
    setPoliciesData,
    updatePolicyField,
    toggleArrayItem,
    resetPoliciesData,
    validatePoliciesData
  };
};