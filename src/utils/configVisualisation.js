// src/utils/configVisualisation.js
// Version temporaire simplifiée

export function genererConfigurationsVisualisations(donnees) {
  // Retourne une configuration vide par défaut
  return {
    evolutionAnnuelle: {},
    heatmapLesions: {},
    agentsCausaux: {},
    radarIndicateurs: {}
  };
}

// Fonctions exportées pour compatibilité
export function configEvolutionAnnuelle() {}
export function configHeatmapLesions() {}
export function configAgentsCausaux() {}
export function configRadarIndicateurs() {}
export function preparerDonneesHeatmap() {}