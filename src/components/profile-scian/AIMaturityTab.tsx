// src/components/profile-scian/AIMaturityTab.tsx
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import type { ProfileData } from './types';
import { IRSST_CATEGORIES, OCDE_CLASSIFICATIONS, EXPLAINABILITY_LEVELS } from './types';

interface AIMaturityTabProps {
  profileData: ProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
  addProject: () => void;
  removeProject: (id: string) => void;
}

const AIMaturityTab: React.FC<AIMaturityTabProps> = ({ 
  profileData, 
  setProfileData, 
  addProject, 
  removeProject 
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Intelligence artificielle et maturité organisationnelle</h2>
        
        {/* Projets IA enrichis */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Projets d'IA en SST</h3>
          
          {/* Formulaire d'ajout de projet enrichi */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white mb-4">
            <h4 className="font-medium text-gray-900 mb-3">Ajouter un projet IA</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du projet *
                </label>
                <input
                  type="text"
                  value={profileData.newProject.name}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    newProject: { ...prev.newProject, name: e.target.value }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom du projet IA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie IRSST
                </label>
                <select
                  value={profileData.newProject.irsstCategory}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    newProject: { ...prev.newProject, irsstCategory: e.target.value }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner catégorie IRSST</option>
                  {IRSST_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classification OCDE
                </label>
                <select
                  value={profileData.newProject.ocdeClassification}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    newProject: { ...prev.newProject, ocdeClassification: e.target.value }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner classification OCDE</option>
                  {OCDE_CLASSIFICATIONS.map((classification) => (
                    <option key={classification} value={classification}>{classification}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niveau d'explicabilité
                </label>
                <select
                  value={profileData.newProject.explainabilityLevel}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    newProject: { ...prev.newProject, explainabilityLevel: e.target.value }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner niveau</option>
                  {EXPLAINABILITY_LEVELS.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description du projet *
                </label>
                <textarea
                  value={profileData.newProject.description}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    newProject: { ...prev.newProject, description: e.target.value }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Description détaillée du projet et de ses objectifs SST"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut du projet
                </label>
                <select
                  value={profileData.newProject.status}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    newProject: { ...prev.newProject, status: e.target.value as any }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Planifié">Planifié</option>
                  <option value="En cours">En cours</option>
                  <option value="En test">En test</option>
                  <option value="Déployé">Déployé</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Impact SST mesuré
                </label>
                <input
                  type="text"
                  value={profileData.newProject.measuredImpact}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    newProject: { ...prev.newProject, measuredImpact: e.target.value }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: Réduction 15% accidents, ROI 2.3x"
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profileData.newProject.loi25Compliance}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        newProject: { ...prev.newProject, loi25Compliance: e.target.checked }
                      }))}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Conforme à la Loi 25 (protection données Québec)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profileData.newProject.governanceCommittee}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        newProject: { ...prev.newProject, governanceCommittee: e.target.checked }
                      }))}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Comité de gouvernance IA</span>
                  </label>
                </div>
              </div>
            </div>
            <Button onClick={addProject} className="mt-4 bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter le projet
            </Button>
          </div>

          {/* Liste des projets IA */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Projets enregistrés ({profileData.aiProjects.length})</h4>
            {profileData.aiProjects.map((project) => (
              <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h5 className="font-medium text-gray-900">{project.name}</h5>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {project.status}
                      </span>
                      {project.irsstCategory && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          IRSST: {project.irsstCategory.split(' - ')[0]}
                        </span>
                      )}
                      {project.loi25Compliance && (
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                          Loi 25
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                    <div className="text-xs text-gray-500 space-y-1">
                      {project.ocdeClassification && (
                        <div><span className="font-medium">OCDE:</span> {project.ocdeClassification}</div>
                      )}
                      {project.explainabilityLevel && (
                        <div><span className="font-medium">Explicabilité:</span> {project.explainabilityLevel}</div>
                      )}
                      {project.measuredImpact && (
                        <div><span className="font-medium">Impact:</span> {project.measuredImpact}</div>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => removeProject(project.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:border-red-300 ml-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {profileData.aiProjects.length === 0 && (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                Aucun projet IA enregistré. Ajoutez votre premier projet ci-dessus.
              </div>
            )}
          </div>
        </div>

        {/* Évaluation de maturité IA enrichie */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Évaluation de maturité organisationnelle IA</h3>
          <p className="text-sm text-gray-600 mb-6">Évaluez votre niveau de maturité sur les aspects clés de l'IA en SST (échelle 1-5)</p>
          <div className="space-y-6">
            {Object.entries(profileData.maturityScores).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">
                    {key === 'dataGovernance' && 'Gouvernance des données'}
                    {key === 'aiReadiness' && 'Préparation technologique à l\'IA'}
                    {key === 'processIntegration' && 'Intégration des processus'}
                    {key === 'changeManagement' && 'Gestion du changement'}
                    {key === 'riskManagement' && 'Gestion des risques IA'}
                    {key === 'ethicsCompliance' && 'Conformité éthique et réglementaire'}
                    {key === 'humanOversight' && 'Supervision humaine'}
                  </label>
                  <span className="text-sm font-medium text-gray-900 bg-blue-100 px-2 py-1 rounded">
                    {value}/5
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={value}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    maturityScores: { ...prev.maturityScores, [key]: parseInt(e.target.value) }
                  }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Débutant</span>
                  <span>Intermédiaire</span>
                  <span>Avancé</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMaturityTab;