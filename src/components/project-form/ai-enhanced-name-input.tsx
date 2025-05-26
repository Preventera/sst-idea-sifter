
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import AITextEnhancer from '@/components/ai-assistant/ai-text-enhancer';
import ProjectDescriptionGenerator from '@/components/ai-assistant/project-description-generator';
import { Criteria } from '@/types/project';

interface AIEnhancedNameInputProps {
  name: string;
  setName: (name: string) => void;
  criteria: Criteria;
  scianSectorId?: string;
}

const AIEnhancedNameInput = ({ name, setName, criteria, scianSectorId }: AIEnhancedNameInputProps) => {
  return (
    <div className="mb-6">
      <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-1">
        Nom / Description du projet
      </label>
      <Input
        id="project-name"
        placeholder="Ex: Caméra intelligente pour détecter le non-port des EPI"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full"
      />
      
      <div className="mt-3 flex flex-wrap gap-2">
        {name.trim() && (
          <AITextEnhancer
            originalText={name}
            onApply={setName}
            context={`Secteur: ${scianSectorId || 'Non spécifié'}`}
            placeholder="Description du projet IA-SST"
          />
        )}
        
        <ProjectDescriptionGenerator
          criteria={criteria}
          scianSectorId={scianSectorId}
          onGenerate={setName}
        />
      </div>
    </div>
  );
};

export default AIEnhancedNameInput;
