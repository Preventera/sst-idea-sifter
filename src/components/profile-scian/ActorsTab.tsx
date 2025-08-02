// src/components/profile-scian/ActorsTab.tsx
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import type { ProfileData, Actor } from './types';
import { SST_CERTIFICATIONS, LANGUAGES } from './types';

interface ActorsTabProps {
  profileData: ProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
  addActor: () => void;
  removeActor: (id: string) => void;
}

const ActorsTab: React.FC<ActorsTabProps> = ({ 
  profileData, 
  setProfileData, 
  addActor, 
  removeActor 
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Gestion des acteurs SST</h2>
        
        {/* Formulaire d'ajout d'acteur enrichi */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter un acteur SST</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet *
              </label>
              <input
                type="text"
                value={profileData.newActor.name}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  newActor: { ...prev.newActor, name: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom complet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rôle/Fonction *
              </label>
              <input
                type="text"
                value={profileData.newActor.role}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  newActor: { ...prev.newActor, role: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Titre du poste"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type d'acteur
              </label>
              <select
                value={profileData.newActor.type}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  newActor: { ...prev.newActor, type: e.target.value as Actor['type'] }
                }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="COSS">COSS</option>
                <option value="CSS">CSS</option>
                <option value="RSS">RSS</option>
                <option value="Travailleur">Travailleur</option>
                <option value="Direction">Direction</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ancienneté dans le poste
              </label>
              <select
                value={profileData.newActor.seniority}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  newActor: { ...prev.newActor, seniority: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="< 6 mois">Moins de 6 mois</option>
                <option value="6 mois - 2 ans">6 mois - 2 ans</option>
                <option value="2-5 ans">2-5 ans</option>
                <option value="5-10 ans">5-10 ans</option>
                <option value="10+ ans">Plus de 10 ans</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certifications SST
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {SST_CERTIFICATIONS.map((cert) => (
                  <label key={cert} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={profileData.newActor.sstCertifications.includes(cert)}
                      onChange={(e) => {
                        const certs = profileData.newActor.sstCertifications;
                        if (e.target.checked) {
                          setProfileData(prev => ({
                            ...prev,
                            newActor: { ...prev.newActor, sstCertifications: [...certs, cert] }
                          }));
                        } else {
                          setProfileData(prev => ({
                            ...prev,
                            newActor: { ...prev.newActor, sstCertifications: certs.filter(c => c !== cert) }
                          }));
                        }
                      }}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    {cert}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heures de formation SST (annuel)
              </label>
              <input
                type="number"
                value={profileData.newActor.sstTrainingHours}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  newActor: { ...prev.newActor, sstTrainingHours: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Heures par année"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Langues parlées
              </label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <label key={lang} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={profileData.newActor.languages.includes(lang)}
                      onChange={(e) => {
                        const langs = profileData.newActor.languages;
                        if (e.target.checked) {
                          setProfileData(prev => ({
                            ...prev,
                            newActor: { ...prev.newActor, languages: [...langs, lang] }
                          }));
                        } else {
                          setProfileData(prev => ({
                            ...prev,
                            newActor: { ...prev.newActor, languages: langs.filter(l => l !== lang) }
                          }));
                        }
                      }}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    {lang}
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsabilités SST spécifiques
              </label>
              <textarea
                value={profileData.newActor.specificResponsibilities}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  newActor: { ...prev.newActor, specificResponsibilities: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Décrivez les responsabilités spécifiques en SST..."
              />
            </div>
          </div>
          <Button onClick={addActor} className="mt-4 bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter l'acteur
          </Button>
        </div>

        {/* Liste des acteurs */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Acteurs enregistrés ({profileData.actors.length})</h3>
          {profileData.actors.map((actor) => (
            <div key={actor.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900">{actor.name}</h4>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {actor.type}
                    </span>
                    {actor.seniority && (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                        {actor.seniority}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{actor.role}</p>
                  {actor.sstCertifications.length > 0 && (
                    <div className="mb-2">
                      <span className="text-xs font-medium text-gray-700">Certifications: </span>
                      <span className="text-xs text-gray-600">{actor.sstCertifications.join(', ')}</span>
                    </div>
                  )}
                  {actor.languages.length > 0 && (
                    <div className="mb-2">
                      <span className="text-xs font-medium text-gray-700">Langues: </span>
                      <span className="text-xs text-gray-600">{actor.languages.join(', ')}</span>
                    </div>
                  )}
                  {actor.specificResponsibilities && (
                    <p className="text-xs text-gray-600">{actor.specificResponsibilities}</p>
                  )}
                </div>
                <Button
                  onClick={() => removeActor(actor.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:border-red-300 ml-4"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {profileData.actors.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              Aucun acteur enregistré. Ajoutez votre premier acteur ci-dessus.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActorsTab;