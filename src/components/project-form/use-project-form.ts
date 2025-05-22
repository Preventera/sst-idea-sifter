
import { useState } from "react";
import { Criteria, Project } from "../../types/project";
import { calculateSectorPriorityScore, getPriorityLevel, SCIAN_SECTORS } from "../../data/scian-sectors";

export const initialCriteria: Criteria = {
  impact: 5,
  excellence: 5,
  faisabilite: 5,
  gouvernance: 5,
  securite: 5,
  acceptabilite: 5,
  perennite: 5
};

export interface ProjectFormProps {
  onAddProject: (project: Project) => void;
  editingProject: Project | null;
  onUpdateProject: (project: Project) => void;
  onCancelEdit: () => void;
}

export function useProjectForm({ onAddProject, editingProject, onUpdateProject }: ProjectFormProps) {
  const [name, setName] = useState(editingProject?.name || "");
  const [criteria, setCriteria] = useState<Criteria>(editingProject?.criteria || initialCriteria);
  const [scianSectorId, setScianSectorId] = useState<string | undefined>(editingProject?.scianSectorId);
  const [weights, setWeights] = useState({
    impact: 1,
    excellence: 1,
    faisabilite: 1,
    gouvernance: 1,
    securite: 1,
    acceptabilite: 1,
    perennite: 1
  });
  const [useWeights, setUseWeights] = useState(false);
  const [criteriaModified, setCriteriaModified] = useState(false);

  const updateCriteria = (key: keyof Criteria, value: number) => {
    setCriteria(prev => ({ ...prev, [key]: value }));
    setCriteriaModified(true);
  };

  const updateWeight = (key: string, value: number) => {
    setWeights(prev => ({ ...prev, [key]: value }));
  };

  const calculateScore = (): number => {
    let score: number;
    
    if (useWeights) {
      const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
      score = Object.entries(criteria).reduce(
        (sum, [key, value]) => sum + value * weights[key as keyof typeof weights], 
        0
      ) / totalWeight;
    } else {
      score = Object.values(criteria).reduce((sum, value) => sum + value, 0) / Object.values(criteria).length;
    }
    
    return Math.round(score * 10) / 10;
  }

  // Calcul de la priorité sectorielle
  const calculatePriority = () => {
    if (!scianSectorId) return undefined;
    
    const sector = SCIAN_SECTORS.find(s => s.id === scianSectorId);
    if (!sector) return undefined;
    
    const score = calculateSectorPriorityScore(sector);
    const level = getPriorityLevel(score);
    
    return {
      score,
      level
    };
  }

  const priority = calculatePriority();

  return {
    name,
    setName,
    criteria,
    scianSectorId,
    setScianSectorId,
    weights,
    useWeights,
    setUseWeights,
    criteriaModified,
    setCriteriaModified,
    updateCriteria,
    updateWeight,
    calculateScore,
    priority,
  };
}
