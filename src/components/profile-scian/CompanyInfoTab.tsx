// src/components/profile-scian/CompanyInfoTab.tsx
import React from 'react';
import type { ProfileData } from './types';
import { INSTALLATION_TYPES } from './types';

interface CompanyInfoTabProps {
  profileData: ProfileData;
  updateCompanyInfo: (field: keyof ProfileData['company'], value: any) => void;
}

const CompanyInfoTab: React.FC<CompanyInfoTabProps> = ({ profileData, updateCompanyInfo }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations de l'entreprise</h2>
        
        {/* Informations de base */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de base</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'entreprise *
              </label>
              <input
                type="text"
                value={profileData.company.name}
                onChange={(e) => updateCompanyInfo('name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom complet de l'entreprise"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code SCIAN *
              </label>
              <input
                type="text"
                value={profileData.company.scianCode}
                onChange={(e) => updateCompanyInfo('scianCode', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ex: 541330"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description du secteur d'activité
              </label>
              <input
                type="text"
                value={profileData.company.scianDescription}
                onChange={(e) => updateCompanyInfo('scianDescription', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ex: Services de génie-conseil"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Année de fondation
              </label>
              <input
                type="number"
                value={profileData.company.foundingYear}
                onChange={(e) => updateCompanyInfo('foundingYear', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ex: 1995"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre d'employés
              </label>
              <select
                value={profileData.company.numberOfEmployees}
                onChange={(e) => updateCompanyInfo('numberOfEmployees', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="1-4">1-4 employés</option>
                <option value="5-19">5-19 employés</option>
                <option value="20-99">20-99 employés</option>
                <option value="100-499">100-499 employés</option>
                <option value="500+">500+ employés</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chiffre d'affaires annuel (CAD)
              </label>
              <select
                value={profileData.company.annualRevenue}
                onChange={(e) => updateCompanyInfo('annualRevenue', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="< 100K">Moins de 100K $</option>
                <option value="100K-500K">100K $ - 500K $</option>
                <option value="500K-2M">500K $ - 2M $</option>
                <option value="2M-10M">2M $ - 10M $</option>
                <option value="10M+">Plus de 10M $</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de sites/succursales
              </label>
              <input
                type="number"
                value={profileData.company.numberOfSites}
                onChange={(e) => updateCompanyInfo('numberOfSites', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ex: 3"
              />
            </div>
          </div>
        </div>

        {/* Adresse */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <input
                type="text"
                value={profileData.company.address}
                onChange={(e) => updateCompanyInfo('address', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Adresse complète"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <input
                type="text"
                value={profileData.company.city}
                onChange={(e) => updateCompanyInfo('city', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ville"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code postal
              </label>
              <input
                type="text"
                value={profileData.company.postalCode}
                onChange={(e) => updateCompanyInfo('postalCode', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="G1A 1A1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={profileData.company.phone}
                onChange={(e) => updateCompanyInfo('phone', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(418) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Courriel
              </label>
              <input
                type="email"
                value={profileData.company.email}
                onChange={(e) => updateCompanyInfo('email', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="contact@entreprise.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site web
              </label>
              <input
                type="url"
                value={profileData.company.website}
                onChange={(e) => updateCompanyInfo('website', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://www.entreprise.com"
              />
            </div>
          </div>
        </div>

        {/* Types d'installations */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Types d'installations</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {INSTALLATION_TYPES.map((type) => (
              <label key={type} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={profileData.company.installationTypes.includes(type)}
                  onChange={(e) => {
                    const types = profileData.company.installationTypes;
                    if (e.target.checked) {
                      updateCompanyInfo('installationTypes', [...types, type]);
                    } else {
                      updateCompanyInfo('installationTypes', types.filter(t => t !== type));
                    }
                  }}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Présence syndicale */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Présence syndicale</h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={profileData.company.unionPresence}
                onChange={(e) => updateCompanyInfo('unionPresence', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">Présence syndicale dans l'entreprise</span>
            </label>
            {profileData.company.unionPresence && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organisations syndicales présentes
                </label>
                <textarea
                  value={profileData.company.unionOrganizations.join('\n')}
                  onChange={(e) => updateCompanyInfo('unionOrganizations', e.target.value.split('\n').filter(org => org.trim()))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Une organisation par ligne..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Description de l'entreprise</h3>
          <textarea
            value={profileData.company.description}
            onChange={(e) => updateCompanyInfo('description', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Description des activités principales, mission, vision..."
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoTab;