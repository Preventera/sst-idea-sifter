import { useState, useEffect } from 'react';
import { Project } from '../../types/project';

export interface ProjectFormProps {
  onAddProject: (project: Project) => void;
  editingProject: Project | null;
  onUpdateProject: (project: Project) => void;
  onCancelEdit: () => void;
}

interface UseProjectFormProps {
  onAddProject: (project: Project) => void;
  editingProject: Project | null;
  onUpdateProject: (project: Project) => void;
  onCancelEdit: () => void;
}

export const useProjectForm = ({ onAddProject, editingProject, onUpdateProject, onCancelEdit }: UseProjectFormProps) => {
  const [name, setName] = useState("");
  const [scianSectorId, setScianSectorId] = useState<string | null>(null);
  const [criteriaModified, setCriteriaModified] = useState(false);
  const [criteria, setCriteria] = useState({
    impact: 5,
    excellence: 5,
    faisabilite: 5,
    gouvernance: 5,
    securite: 5,
    acceptabilite: 5,
    perennite: 5,
  });
  const [weights, setWeights] = useState({
    impact: 1,
    excellence: 1,
    faisabilite: 1,
    gouvernance: 1,
    securite: 1,
    acceptabilite: 1,
    perennite: 1,
  });
  const [useWeights, setUseWeights] = useState(false);

  const updateCriteria = (key: string, value: number) => {
    setCriteria(prev => ({ ...prev, [key]: value }));
    setCriteriaModified(true);
  };

  const updateWeight = (key: string, value: number) => {
    setWeights(prev => ({ ...prev, [key]: value }));
  };

  const calculateScore = () => {
    if (useWeights) {
      const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
      const weightedSum = Object.entries(criteria).reduce((sum, [key, value]) => {
        return sum + (value * weights[key as keyof typeof weights]);
      }, 0);
      return Math.round((weightedSum / totalWeight) * 100) / 100;
    } else {
      const sum = Object.values(criteria).reduce((sum, value) => sum + value, 0);
      return Math.round((sum / 7) * 100) / 100;
    }
  };

  // Pré-remplir en mode édition
  useEffect(() => {
    if (editingProject) {
      setName(editingProject.name);
      setCriteria(editingProject.scores);
      setScianSectorId(editingProject.scianSectorId);
      setCriteriaModified(false);
    } else {
      setName("");
      setCriteria({
        impact: 5,
        excellence: 5,
        faisabilite: 5,
        gouvernance: 5,
        securite: 5,
        acceptabilite: 5,
        perennite: 5,
      });
      setScianSectorId(null);
      setCriteriaModified(false);
    }
  }, [editingProject]);

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
    priority: null, // À adapter selon votre logique
  };
};