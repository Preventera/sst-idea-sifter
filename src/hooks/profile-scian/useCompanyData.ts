import { useState } from 'react';
import { CompanyData } from '@/types/profile-scian';

// Données initiales pour l'entreprise
const initialCompanyData: CompanyData = {
  name: '',
  scianCode: '',
  sector: '',
  size: '',
  address: '',
  phone: '',
  email: ''
};

/**
 * Hook personnalisé pour gérer les données de l'entreprise
 */
export const useCompanyData = (initialData?: CompanyData) => {
  // État pour les données de l'entreprise
  const [companyData, setCompanyData] = useState<CompanyData>(
    initialData || initialCompanyData
  );

  // Fonction pour mettre à jour un champ spécifique
  const updateCompanyField = (field: keyof CompanyData, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fonction pour réinitialiser les données
  const resetCompanyData = () => {
    setCompanyData(initialCompanyData);
  };

  // Fonction pour valider les données
  const validateCompanyData = (): boolean => {
    // Vérifier si les champs obligatoires sont remplis
    const requiredFields: (keyof CompanyData)[] = ['name', 'sector'];
    return requiredFields.every(field => !!companyData[field]);
  };

  return {
    companyData,
    setCompanyData,
    updateCompanyField,
    resetCompanyData,
    validateCompanyData
  };
};