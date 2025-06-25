<template>
  <div class="contexte-sectoriel-enrichi">
    <!-- En-tête du composant -->
    <div class="section-header">
      <div class="icon-container">
        <i class="circle-icon"></i>
        <span>Contexte sectoriel enrichi</span>
      </div>
      <div class="confidence-tag">
        <span>Confiance: {{ contexteSectoriel.confiance || '9/10' }}</span>
      </div>
    </div>

    <!-- Informations sectorielles -->
    <div class="secteur-info">
      <h4>{{ contexteSectoriel.secteur }}</h4>
      
      <!-- Tendance sur 5 ans si disponible -->
      <div v-if="contexteSectoriel.tendance" class="tendance-info">
        <div class="tendance-badge" :class="getTendanceClass(contexteSectoriel.tendance.variationTotale)">
          <span>{{ formatVariation(contexteSectoriel.tendance.variationTotale) }}</span>
          <span>lésions (5 ans)</span>
        </div>
        
        <div v-if="contexteSectoriel.tendance.variationPsy" 
             class="tendance-badge" 
             :class="getTendanceClass(contexteSectoriel.tendance.variationPsy, true)">
          <span>{{ formatVariation(contexteSectoriel.tendance.variationPsy) }}</span>
          <span>lésions psychologiques</span>
        </div>
      </div>
    </div>

    <!-- Risques principaux -->
    <div v-if="contexteSectoriel.risquesPrincipaux && contexteSectoriel.risquesPrincipaux.length" class="section-content">
      <h4>Risques principaux identifiés</h4>
      <div class="risques-list">
        <div v-for="(risque, index) in contexteSectoriel.risquesPrincipaux" 
             :key="'risque-'+index" 
             class="risque-item">
          <div class="risque-bar" :style="{ width: risque.pourcentage + '%' }"></div>
          <div class="risque-label">{{ risque.type }}</div>
          <div class="risque-value">{{ risque.pourcentage }}%</div>
        </div>
      </div>
    </div>

    <!-- Agents causaux -->
    <div v-if="contexteSectoriel.agentsCausauxDominants && contexteSectoriel.agentsCausauxDominants.length" class="section-content">
      <h4>Agents causaux dominants</h4>
      <div class="agents-grid">
        <div v-for="(agent, index) in contexteSectoriel.agentsCausauxDominants" 
             :key="'agent-'+index" 
             class="agent-item">
          <div class="agent-percentage">{{ agent.pourcentage }}%</div>
          <div class="agent-type">{{ agent.type }}</div>
        </div>
      </div>
    </div>

    <!-- Population à risque -->
    <div v-if="contexteSectoriel.populationARisque && contexteSectoriel.populationARisque.length" class="section-content">
      <h4>Population à risque</h4>
      <div class="population-list">
        <div v-for="(pop, index) in contexteSectoriel.populationARisque" 
             :key="'pop-'+index" 
             class="population-item">
          <div class="population-description">{{ pop.description }}</div>
          <div class="population-value">{{ pop.pourcentage }}%</div>
        </div>
      </div>
    </div>

    <!-- Indicateurs clés -->
    <div v-if="contexteSectoriel.indicateurs" class="section-content">
      <h4>Indicateurs clés</h4>
      <div class="indicateurs-grid">
        <div class="indicateur-item">
          <div class="indicateur-label">TMS</div>
          <div class="indicateur-value">{{ formatPercentage(contexteSectoriel.indicateurs.tauxTMS) }}</div>
        </div>
        <div class="indicateur-item">
          <div class="indicateur-label">Psychologique</div>
          <div class="indicateur-value">{{ formatPercentage(contexteSectoriel.indicateurs.tauxPSY) }}</div>
        </div>
        <div class="indicateur-item">
          <div class="indicateur-label">Machine</div>
          <div class="indicateur-value">{{ formatPercentage(contexteSectoriel.indicateurs.tauxMachine) }}</div>
        </div>
        <div class="indicateur-item">
          <div class="indicateur-label">Surdité</div>
          <div class="indicateur-value">{{ formatPercentage(contexteSectoriel.indicateurs.tauxSurdite) }}</div>
        </div>
      </div>
    </div>

    <!-- Opportunités IA -->
    <div v-if="contexteSectoriel.opportunitesIA && contexteSectoriel.opportunitesIA.length" class="section-content">
      <h4>Opportunités d'intervention IA</h4>
      <div class="opportunites-list">
        <div v-for="(opportunite, index) in contexteSectoriel.opportunitesIA" 
             :key="'opportunite-'+index" 
             class="opportunite-item">
          <div class="opportunite-icon">
            <i class="lightbulb-icon"></i>
          </div>
          <div class="opportunite-text">{{ opportunite }}</div>
        </div>
      </div>
    </div>

    <!-- Source des données -->
    <div class="data-source">
      <span>Source: Données CNESST {{ latestYear || '2024' }}</span>
      <button class="details-button" @click="toggleDetails">
        {{ showDetails ? 'Masquer les détails' : 'Voir plus de détails' }}
      </button>
    </div>

    <!-- Détails supplémentaires (affichés conditionnellement) -->
    <div v-if="showDetails" class="additional-details">
      <h4>Détails par année</h4>
      <!-- Graphique ou tableau qui serait ajouté ici -->
      <div class="placeholder-chart">
        Graphique d'évolution annuelle
      </div>

      <h4>Distribution des lésions par partie du corps</h4>
      <div class="placeholder-heatmap">
        Heatmap des lésions
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContexteSectorielEnrichi',
  
  props: {
    // Le contexte sectoriel enrichi fourni par le parent
    contexteSectoriel: {
      type: Object,
      required: true,
      default: () => ({
        secteur: "SCIAN 23 - Construction",
        risquesPrincipaux: [],
        agentsCausauxDominants: [],
        populationARisque: [],
        indicateurs: {
          tauxTMS: 0,
          tauxPSY: 0,
          tauxMachine: 0,
          tauxSurdite: 0
        },
        opportunitesIA: []
      })
    }
  },
  
  data() {
    return {
      showDetails: false,
      latestYear: new Date().getFullYear()
    };
  },
  
  methods: {
    /**
     * Bascule l'affichage des détails supplémentaires
     */
    toggleDetails() {
      this.showDetails = !this.showDetails;
    },
    
    /**
     * Formate un pourcentage à partir d'une valeur décimale
     * @param {number} value - Valeur décimale (ex: 0.22)
     * @returns {string} - Pourcentage formaté (ex: "22%")
     */
    formatPercentage(value) {
      if (value === undefined || value === null) return '0%';
      return Math.round(value * 100) + '%';
    },
    
    /**
     * Formate une variation avec signe + ou -
     * @param {number} value - Valeur de variation
     * @returns {string} - Variation formatée avec signe
     */
    formatVariation(value) {
      if (value === undefined || value === null) return '0%';
      const sign = value > 0 ? '+' : '';
      return sign + value + '%';
    },
    
    /**
     * Détermine la classe CSS pour la tendance
     * @param {number} variation - Valeur de variation
     * @param {boolean} inverse - Inverser la logique (pour les indicateurs négatifs)
     * @returns {string} - Classe CSS
     */
    getTendanceClass(variation, inverse = false) {
      if (variation === undefined || variation === null) return '';
      
      // Pour les lésions totales, une diminution est positive
      if (!inverse) {
        return variation < 0 ? 'positive' : 'negative';
      }
      // Pour les lésions psychologiques, une diminution est positive
      else {
        return variation < 0 ? 'positive' : 'negative';
      }
    }
  }
};
</script>

<style scoped>
.contexte-sectoriel-enrichi {
  background-color: #f8f9fc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.icon-container {
  display: flex;
  align-items: center;
}

.circle-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #5e72e4;
  margin-right: 8px;
}

.confidence-tag {
  background-color: #e8f5e9;
  color: #388e3c;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.secteur-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.secteur-info h4 {
  margin: 0;
  color: #344767;
  font-size: 16px;
}

.tendance-info {
  display: flex;
  gap: 10px;
}

.tendance-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.tendance-badge.positive {
  background-color: #e8f5e9;
  color: #388e3c;
}

.tendance-badge.negative {
  background-color: #ffebee;
  color: #d32f2f;
}

.section-content {
  margin-bottom: 20px;
}

.section-content h4 {
  margin: 0 0 8px 0;
  color: #344767;
  font-size: 14px;
  font-weight: 600;
}

/* Styles pour les risques */
.risques-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.risque-item {
  display: flex;
  align-items: center;
  position: relative;
  height: 24px;
}

.risque-bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: rgba(94, 114, 228, 0.2);
  border-radius: 4px;
  z-index: 1;
}

.risque-label {
  position: relative;
  z-index: 2;
  padding-left: 8px;
  flex: 1;
  font-size: 14px;
}

.risque-value {
  position: relative;
  z-index: 2;
  padding-right: 8px;
  font-weight: 600;
  font-size: 14px;
}

/* Styles pour les agents causaux */
.agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.agent-item {
  background-color: white;
  border-radius: 4px;
  padding: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.agent-percentage {
  font-size: 16px;
  font-weight: 600;
  color: #5e72e4;
}

.agent-type {
  font-size: 14px;
  color: #344767;
  margin-top: 4px;
}

/* Styles pour la population à risque */
.population-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.population-item {
  background-color: white;
  border-radius: 4px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.population-description {
  font-size: 14px;
  color: #344767;
  margin-right: 8px;
}

.population-value {
  font-size: 14px;
  font-weight: 600;
  color: #5e72e4;
}

/* Styles pour les indicateurs */
.indicateurs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.indicateur-item {
  background-color: white;
  border-radius: 4px;
  padding: 12px;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.indicateur-label {
  font-size: 14px;
  color: #344767;
  margin-bottom: 4px;
}

.indicateur-value {
  font-size: 16px;
  font-weight: 600;
  color: #5e72e4;
}

/* Styles pour les opportunités */
.opportunites-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.opportunite-item {
  display: flex;
  align-items: flex-start;
  background-color: #edf2ff;
  border-radius: 4px;
  padding: 12px;
}

.opportunite-icon {
  margin-right: 12px;
  color: #5e72e4;
}

.lightbulb-icon::before {
  content: "💡";
}

.opportunite-text {
  font-size: 14px;
  color: #344767;
}

/* Source des données et bouton détails */
.data-source {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  font-size: 12px;
  color: #64748b;
}

.details-button {
  background: none;
  border: none;
  color: #5e72e4;
  cursor: pointer;
  font-size: 12px;
  text-decoration: underline;
}

/* Styles pour les détails supplémentaires */
.additional-details {
  margin-top: 16px;
  border-top: 1px solid #eaecef;
  padding-top: 16px;
}

.placeholder-chart,
.placeholder-heatmap {
  height: 200px;
  background-color: #f1f3f9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  margin-bottom: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .indicateurs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .agents-grid {
    grid-template-columns: 1fr;
  }
  
  .secteur-info {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .tendance-info {
    margin-top: 8px;
  }
}
</style>