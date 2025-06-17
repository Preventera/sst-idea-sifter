import React, { useState } from 'react';
// CORRECTION REQUISE:
import { AIEnhancedNameInput } from '@/components/project-form/ai-enhanced-name-input';
import { Button } from '@/components/ui/button';

const TestAI: React.FC = () => {
  const [name, setName] = useState('');
  const dummyCriteria = {
    impact: 5,
    excellence: 5,
    faisabilite: 5,
    gouvernance: 5,
    securite: 5,
    acceptabilite: 5,
    perennite: 5
  };

  return (
    <div className="container p-8">
      <h1 className="text-2xl font-bold mb-6">Test de l'Assistant IA</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <AIEnhancedNameInput 
          name={name}
          setName={setName}
          criteria={dummyCriteria}
          scianSectorId="23"
        />
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Résultat:</h3>
          <div className="border p-4 rounded-md bg-gray-50 whitespace-pre-wrap">
            {name || "Aucun résultat généré"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAI;