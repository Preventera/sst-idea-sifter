
import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // État pour stocker notre valeur
  const [value, setValue] = useState<T>(() => {
    try {
      // Récupérer depuis localStorage par clé
      const item = window.localStorage.getItem(key);
      // Analyser le JSON stocké ou retourner initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // En cas d'erreur, utiliser la valeur initiale
      console.log("Erreur lors de la récupération depuis localStorage:", error);
      return initialValue;
    }
  });

  // Retourner une version enrobée de la fonction useState's setter
  // qui persiste la nouvelle valeur dans localStorage.
  useEffect(() => {
    try {
      // Sauvegarder dans localStorage
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // A un usage plus avancé, on pourrait gérer l'erreur
      console.log("Erreur lors de la sauvegarde dans localStorage:", error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}
