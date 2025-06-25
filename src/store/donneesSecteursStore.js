// src/store/donneesSecteursStore.js
// Version temporaire simplifiée

// État initial
const state = {
  contexteSectoriel: {
    secteur: "SCIAN 23 - Construction",
    risquesPrincipaux: [
      { type: "Entorse/Foulure", pourcentage: 27 },
      { type: "Fracture", pourcentage: 18 },
      { type: "Contusion", pourcentage: 15 }
    ],
    agentsCausauxDominants: [
      { type: "Échelles et échafaudages", pourcentage: 23 },
      { type: "Outils manuels", pourcentage: 17 },
      { type: "Matériaux de construction", pourcentage: 15 }
    ],
    populationARisque: [
      { description: "Travailleurs 35-44 ans", pourcentage: 38 },
      { description: "Personnel masculin", pourcentage: 87 }
    ],
    indicateurs: {
      tauxTMS: 0.22,
      tauxPSY: 0.05,
      tauxMachine: 0.14,
      tauxSurdite: 0.03
    },
    opportunitesIA: [
      "Systèmes de vision pour détection précoce de situations à risque de chute",
      "Détection de fatigue par analyse posturale",
      "Prédiction personnalisée des risques TMS"
    ],
    tendance: {
      variationTotale: -8,
      variationPsy: 12
    }
  },
  resultatsAggregation: null,
  donneesCompletes: [],
  
  // État du chargement
  chargementEnCours: false,
  chargementTermine: true,
  erreur: null,
  
  // Métadonnées
  derniereMAJ: new Date(),
  fichiersSources: [],
  secteurCourant: '23', // Par défaut, secteur Construction
};

// Service simplifié pour les tests
export class DonneesSecteursService {
  constructor() {
    this.state = { ...state };
    this.listeners = [];
  }
  
  getState() {
    return this.state;
  }
  
  async chargerDonneesCNESST(fichiers) {
    console.log("Simulation de chargement des données CNESST:", fichiers);
    return { ...this.state };
  }
  
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

// Export pour compatibilité
export default {
  namespaced: true,
  state,
  getters: {},
  actions: {},
  mutations: {}
};