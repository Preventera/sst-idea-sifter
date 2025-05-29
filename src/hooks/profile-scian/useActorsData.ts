import { useState } from 'react';
import { Actor } from '@/types/profile-scian';

/**
 * Hook personnalisé pour gérer un groupe d'acteurs
 */
export const useActorsData = (initialActors: Actor[] = []) => {
  // État pour la liste des acteurs
  const [actors, setActors] = useState<Actor[]>(initialActors);

  /**
   * Ajoute un nouvel acteur à la liste
   */
  const addActor = () => {
    const newActor: Actor = {
      id: Date.now(), // Utilisation de la date actuelle comme ID unique
      name: '',
      role: '',
      department: '',
      email: '',
      phone: '',
      certifications: []
    };

    setActors(prev => [...prev, newActor]);
  };

  /**
   * Supprime un acteur de la liste
   * @param id L'ID de l'acteur à supprimer
   */
  const removeActor = (id: number) => {
    setActors(prev => prev.filter(actor => actor.id !== id));
  };

  /**
   * Met à jour un champ spécifique d'un acteur
   * @param id L'ID de l'acteur à mettre à jour
   * @param field Le champ à mettre à jour
   * @param value La nouvelle valeur
   */
  const updateActor = (id: number, field: keyof Actor, value: string) => {
    setActors(prev => prev.map(actor => 
      actor.id === id ? { ...actor, [field]: value } : actor
    ));
  };

  /**
   * Ajoute ou supprime une certification pour un acteur
   * @param id L'ID de l'acteur
   * @param certification La certification à ajouter ou supprimer
   */
  const toggleActorCertification = (id: number, certification: string) => {
    setActors(prev => prev.map(actor => {
      if (actor.id === id) {
        const certifications = actor.certifications || [];
        const newCertifications = certifications.includes(certification)
          ? certifications.filter(c => c !== certification)
          : [...certifications, certification];
        
        return { ...actor, certifications: newCertifications };
      }
      return actor;
    }));
  };

  /**
   * Réinitialise la liste des acteurs
   */
  const resetActors = () => {
    setActors([]);
  };

  return {
    actors,
    setActors,
    addActor,
    removeActor,
    updateActor,
    toggleActorCertification,
    resetActors
  };
};