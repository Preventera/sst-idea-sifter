import React from 'react';
import { CompanyData } from '@/types/profile-scian';
import { scianSectors, companySizes } from '@/data/profile-scian-data';

interface CompanyTabProps {
  companyData: CompanyData;
  updateCompanyField: (field: keyof CompanyData, value: string) => void;
}

/**
 * Composant pour l'onglet Entreprise du profil SCIAN
 */
const CompanyTab: React.FC<CompanyTabProps> = ({ companyData, updateCompanyField }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Informations de l'entreprise</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'entreprise</label>
          <input
            type="text"
            value={companyData.name}
            onChange={(e) => updateCompanyField('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nom complet de l'entreprise"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Code SCIAN</label>
          <input
            type="text"
            value={companyData.scianCode}
            onChange={(e) => updateCompanyField('scianCode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 23621"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Secteur d'activité</label>
          <select
            value={companyData.sector}
            onChange={(e) => updateCompanyField('sector', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner un secteur</option>
            {scianSectors.map((sector) => (
              <option key={sector.code} value={sector.code}>
                {sector.code} - {sector.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Taille de l'entreprise</label>
          <select
            value={companyData.size}
            onChange={(e) => updateCompanyField('size', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner la taille</option>
            {companySizes.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
          <input
            type="text"
            value={companyData.address}
            onChange={(e) => updateCompanyField('address', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Adresse complète"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
          <input
            type="tel"
            value={companyData.phone}
            onChange={(e) => updateCompanyField('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="(XXX) XXX-XXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={companyData.email}
            onChange={(e) => updateCompanyField('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="contact@entreprise.com"
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyTab;