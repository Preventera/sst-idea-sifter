import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Actor } from '@/types/profile-scian';

/**
 * Props pour le composant ActorSection
 */
interface ActorSectionProps {
  title: string;
  actors: Actor[];
  onAddActor: () => void;
  onRemoveActor: (id: number) => void;
  onUpdateActor: (id: number, field: keyof Actor, value: string) => void;
}

/**
 * Composant pour afficher et gérer une section d'acteurs (membres)
 */
export const ActorSection: React.FC<ActorSectionProps> = ({
  title,
  actors,
  onAddActor,
  onRemoveActor,
  onUpdateActor
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <button
          onClick={onAddActor}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Ajouter
        </button>
      </div>
      
      {actors.length === 0 ? (
        <p className="text-gray-500 italic">Aucun membre ajouté</p>
      ) : (
        <div className="space-y-4">
          {actors.map((actor) => (
            <div key={actor.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-gray-800">Membre #{actor.id}</h4>
                <button
                  onClick={() => onRemoveActor(actor.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <input
                    type="text"
                    value={actor.name}
                    onChange={(e) => onUpdateActor(actor.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rôle/Fonction</label>
                  <input
                    type="text"
                    value={actor.role}
                    onChange={(e) => onUpdateActor(actor.id, 'role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
                  <input
                    type="text"
                    value={actor.department}
                    onChange={(e) => onUpdateActor(actor.id, 'department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={actor.email}
                    onChange={(e) => onUpdateActor(actor.id, 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Props pour le composant CheckboxGroup
 */
interface CheckboxGroupProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onChange: (options: string[]) => void;
  columns?: 1 | 2;
}

/**
 * Composant pour afficher un groupe de cases à cocher
 */
export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  selectedOptions,
  onChange,
  columns = 1
}) => {
  const toggleOption = (option: string) => {
    const newOptions = selectedOptions.includes(option)
      ? selectedOptions.filter(o => o !== option)
      : [...selectedOptions, option];
    onChange(newOptions);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>
      <div className={`grid grid-cols-1 ${columns === 2 ? 'md:grid-cols-2' : ''} gap-3`}>
        {options.map((option) => (
          <label key={option} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => toggleOption(option)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

/**
 * Props pour le composant TabLayout
 */
interface TabLayoutProps {
  title: string;
  children: React.ReactNode;
}

/**
 * Composant pour le layout commun des onglets
 */
export const TabLayout: React.FC<TabLayoutProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">{title}</h2>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};