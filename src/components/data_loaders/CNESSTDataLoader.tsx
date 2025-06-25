// src/components/data_loaders/CNESSTDataLoader.tsx
import { useEffect, useState } from 'react';

// Types pour les données CNESST
interface CNESSTDataLoaderProps {
  onLoadComplete?: () => void;
  onLoadError?: (error: Error) => void;
}

const CNESSTDataLoader: React.FC<CNESSTDataLoaderProps> = ({
  onLoadComplete,
  onLoadError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadCNESSTData = async () => {
      if (isLoaded || isLoading) return;
      
      setIsLoading(true);
      try {
        console.log("Simulation de chargement des données CNESST...");
        
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simuler un chargement réussi
        console.log("Données CNESST simulées chargées avec succès");
        setIsLoaded(true);
        onLoadComplete?.();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erreur inconnue lors du chargement des données CNESST');
        console.error("Erreur lors du chargement des données CNESST:", error);
        setError(error);
        onLoadError?.(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCNESSTData();
  }, [onLoadComplete, onLoadError, isLoaded, isLoading]);

  // Ce composant ne rend rien visuellement
  return null;
};

export default CNESSTDataLoader;