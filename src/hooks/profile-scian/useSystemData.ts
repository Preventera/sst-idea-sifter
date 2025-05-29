import { useState } from 'react';
import { SSTManagementSystem } from '@/types/profile-scian';

// Données initiales pour le système de gestion SST
const initialSSTSystem: SSTManagementSystem = {
  hasImplementedSystem: false,
  systemType: '',
  certifications: [],
  lastAudit: '',
  systemComponents: []
};

/**
 * Hook personnalisé pour gérer les données du système SST
 */
export const useSystemData = (initialData?: SSTManagementSystem) => {
  // État pour les données du système SST
  const [systemData, setSystemData] = useState<SSTManagementSystem>(
    initialData || initialSSTSystem
  );

  // État pour suivre le type de système sélectionné (pour afficher les composantes appropriées)
  const [selectedSystemType, setSelectedSystemType] = useState<string>('');

  /**
   * Mise à jour d'un champ spécifique
   * @param field Le champ à mettre à jour
   * @param value La nouvelle valeur
   */
  const updateSystemField = <K extends keyof SSTManagementSystem>(field: K, value: SSTManagementSystem[K]) => {
    setSystemData(prev => ({
      ...prev,
      [field]: value
    }));

    // Si le champ est systemType, mettre à jour le type sélectionné
    if (field === 'systemType') {
      setSelectedSystemType(value as string);
    }
  };

  /**
   * Ajoute ou supprime un élément dans un tableau
   * @param field Le champ de type tableau à modifier
   * @param item L'élément à ajouter ou supprimer
   */
  const toggleArrayItem = <K extends keyof SSTManagementSystem>(
    field: K,
    item: string
  ) => {
    if (Array.isArray(systemData[field])) {
      const array = systemData[field] as string[];
      const newArray = array.includes(item)
        ? array.filter(i => i !== item)
        : [...array, item];
      
      updateSystemField(field, newArray as SSTManagementSystem[K]);
    }
  };

  /**
   * Réinitialise les données du système SST
   */
  const resetSystemData = () => {
    setSystemData(initialSSTSystem);
    setSelectedSystemType('');
  };

  /**
   * Vérifie si les données du système SST sont valides
   */
  const validateSystemData = (): boolean => {
    // Si un système est implémenté, le type doit être sélectionné
    if (systemData.hasImplementedSystem && !systemData.systemType) {
      return false;
    }
    
    // Si un système est implémenté, au moins une certification doit être sélectionnée
    if (systemData.hasImplementedSystem && systemData.certifications.length === 0) {
      return false;
    }
    
    return true;
  };

  /**
   * Détermine les composantes du système à afficher en fonction du type sélectionné
   */
  const getSystemComponentsByType = (componentsByType: Record<string, string[]>): string[] => {
    if (selectedSystemType.includes('ISO 45001')) return componentsByType['ISO 45001'];
    if (selectedSystemType.includes('CSA Z1000')) return componentsByType['CSA Z1000'];
    if (selectedSystemType.includes('ILO-OSH')) return componentsByType['ILO-OSH 2001'];
    return componentsByType['Général'];
  };

  return {
    systemData,
    setSystemData,
    selectedSystemType,
    updateSystemField,
    toggleArrayItem,
    resetSystemData,
    validateSystemData,
    getSystemComponentsByType
  };
};