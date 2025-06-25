// src/hooks/use-ai-assistant.ts
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabaseClient } from '@/lib/supabaseClient';

export interface AIAssistantOptions {
  type: 'project_description' | 'project_improvement' | 'questionnaire_synthesis' | 'project_suggestions';
  prompt: string;
  context?: string;
}

export interface AIAnalysisOptions {
  analysisType: 'project_ideas' | 'questionnaire_analysis' | 'response_patterns' | 'risk_assessment' | 'compliance_check';
  text: string;
  context?: string;
}

export const useAIAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const generateContent = async (prompt: string, type: string = 'project_suggestions', context?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Génération de contenu avec Claude...', { prompt, type, context });
      
      // FORCER CLAUDE UNIQUEMENT - Ne plus utiliser OpenAI
      const { data, error } = await supabaseClient.functions.invoke('claude-analyzer', {
        body: {
          analysisType: type === 'project_suggestions' ? 'questionnaire_analysis' : type,
          text: prompt,
          context: context || ''
        }
      });
      
      if (error) throw error;
      
      setResult(data.result);
      console.log('✅ Génération réussie:', data.result);
      return data.result;
    } catch (err) {
      console.error('❌ AI Generation Error:', err);
      
      // Fallback pour démo - génère une réponse structurée locale
      const fallbackResponse = generateFallbackResponse(prompt, type, context);
      setResult(fallbackResponse);
      
      toast({
        title: "Mode démo activé",
        description: "Génération d'idées en mode hors ligne pour la démonstration.",
        duration: 5000
      });
      
      return fallbackResponse;
    } finally {
      setIsLoading(false);
    }
  };
  
  const analyzeContent = async (options: AIAnalysisOptions) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Analyse de contenu avec Claude...', options);
      
      // Utilisation exclusive de Claude
      const { data, error } = await supabaseClient.functions.invoke('claude-analyzer', {
        body: options
      });
      
      if (error) throw error;
      
      setResult(data.result);
      return data.result;
    } catch (err) {
      console.error('❌ AI Analysis Error:', err);
      
      // Fallback pour démo
      const fallbackResponse = generateFallbackAnalysis(options);
      setResult(fallbackResponse);
      
      toast({
        title: "Analyse en mode hors ligne",
        description: "L'analyse est générée localement pour la démo.",
        duration: 5000
      });
      
      return fallbackResponse;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fonction de fallback pour les démonstrations
  const generateFallbackResponse = (prompt: string, type: string, context?: string) => {
    const sectorMatch = prompt.match(/secteur (\d+)/i);
    const sector = sectorMatch ? sectorMatch[1] : '23';
    
    // Déterminer le secteur d'activité pour contextualiser
    const getSectorName = (sectorCode: string) => {
      const sectors: Record<string, string> = {
        '11': 'Agriculture, foresterie, pêche et chasse',
        '21': 'Extraction minière, exploitation en carrière, et extraction de pétrole et de gaz',
        '22': 'Services publics',
        '23': 'Construction',
        '31': 'Fabrication',
        '44': 'Commerce de détail',
        '48': 'Transport et entreposage',
        '54': 'Services professionnels, scientifiques et techniques',
        '62': 'Soins de santé et assistance sociale',
        '72': 'Hébergement et services de restauration'
      };
      return sectors[sectorCode] || 'Construction';
    };
    
    const sectorName = getSectorName(sector);
    
    return `## 🎯 Projet IA-SST pour le secteur ${sector} - ${sectorName}

### Étape 1 : Identification du problème
- **Problématique principale** : Dans le secteur ${sectorName.toLowerCase()}, les principaux risques concernent les accidents liés aux équipements et l'exposition aux dangers environnementaux.
- **Impact actuel** : Ces risques entraînent des blessures, des arrêts de travail prolongés et des coûts significatifs pour les entreprises.
- **Données CNESST** : Analyse de ${Math.floor(Math.random() * 50000 + 10000)} incidents rapportés sur les 3 dernières années.

### Étape 2 : Applicabilité de l'IA
- **Technologies pertinentes** : Vision par ordinateur, apprentissage automatique supervisé, et analyse prédictive.
- **Avantage de l'IA** : Passage d'une approche réactive à une prévention proactive basée sur la détection précoce des risques.
- **Maturité technologique** : Solutions éprouvées dans des contextes similaires.

### Étape 3 : Conception de la solution
- **Architecture technique** : Système de capteurs IoT combiné à des modèles de deep learning pour la détection d'anomalies.
- **Interface utilisateur** : Dashboard temps réel pour les superviseurs avec alertes automatiques et recommandations d'actions.
- **Intégration système** : Compatible avec les systèmes HSE existants via API RESTful.

### Étape 4 : Données nécessaires
- **Historique des incidents** : Base de données des accidents et quasi-accidents des 5 dernières années.
- **Données environnementales** : Mesures de température, humidité, bruit, poussières selon le secteur.
- **Données comportementales** : Patterns d'utilisation des équipements de protection individuelle.

### Étape 5 : Développement du modèle
- **Algorithmes recommandés** : Random Forest pour la classification des risques, LSTM pour la prédiction temporelle.
- **Validation** : Tests avec experts SST du secteur pour calibrer les seuils et réduire les faux positifs.
- **Performance cible** : Précision > 85%, rappel > 90% pour la détection des situations à risque élevé.

### Étape 6 : Intégration dans le système HSE
- **Déploiement** : Approche pilote sur un site, puis déploiement progressif.
- **Formation** : Programme de formation pour les équipes sur l'utilisation du système IA.
- **Procédures** : Mise à jour des protocoles de sécurité pour intégrer les alertes IA.

### Étape 7 : Évaluation continue
- **KPIs de sécurité** : Réduction du nombre d'incidents, diminution de la gravité des accidents.
- **KPIs techniques** : Temps de réponse du système, taux de faux positifs/négatifs.
- **Acceptation utilisateur** : Enquêtes de satisfaction et adoption des recommandations IA.

### Étape 8 : Catégorie ELON et recommandations
- **Catégorie ELON prioritaire** : **Lieux** - La surveillance environnementale est critique pour ce secteur.
- **Actions immédiates** : Installation de capteurs dans les zones à risque identifiées.
- **Évolution future** : Extension vers l'analyse comportementale (Nature humaine) et optimisation des équipements.

---

**💡 Estimation de l'impact :**
- Réduction potentielle des incidents : 25-40%
- ROI projeté : 18-24 mois
- Niveau de maturité technologique : Élevé (TRL 7-8)

*Cette suggestion est générée en mode démo. Pour une analyse personnalisée avec vos données réelles, activez la connexion Claude.*`;
  };
  
  const generateFallbackAnalysis = (options: AIAnalysisOptions) => {
    // Logique pour générer une analyse de fallback selon le type
    const analysisType = options.analysisType;
    
    if (analysisType === 'project_ideas') {
      return `## 📊 Évaluation automatique du projet

### Analyse multicritères (Échelle 1-10)

**🔧 Faisabilité technique : 7/10**
- Technologies disponibles et matures
- Expertise requise accessible sur le marché
- Intégration possible avec l'infrastructure existante

**💼 Valeur commerciale : 8/10**
- ROI potentiel attractif (18-24 mois)
- Marché en demande croissante pour les solutions IA-SST
- Avantage concurrentiel significatif

**🛡️ Réduction des risques : 9/10**
- Impact direct sur la sécurité des travailleurs
- Prévention proactive vs réactive
- Réduction mesurable des incidents

**💰 Coût d'implémentation : 6/10**
- Investissement initial modéré
- Coûts d'infrastructure et formation à prévoir
- Économies à long terme importantes

**⏱️ Temps de mise en marché : 5/10**
- Développement estimé à 12-18 mois
- Phase pilote recommandée (3-6 mois)
- Déploiement progressif nécessaire

**👥 Acceptation utilisateur : 7/10**
- Bénéfice clair pour la sécurité
- Formation requise pour l'adoption
- Résistance au changement possible

**📋 Conformité réglementaire : 8/10**
- Alignement avec les normes SST québécoises
- Contribution à la conformité CNESST
- Documentation et traçabilité améliorées

### 🎯 Score global : 7.1/10
**Recommandation : Projet hautement recommandé**

Ce projet présente un excellent équilibre entre impact sécuritaire et faisabilité technique. La forte valeur ajoutée en termes de réduction des risques justifie l'investissement requis.`;
    }
    
    // Autres types d'analyse...
    return `## Analyse générale

L'analyse de votre contenu révèle des opportunités intéressantes pour l'amélioration de la sécurité au travail grâce à l'intelligence artificielle.

**Points clés identifiés :**
- Potentiel d'automatisation élevé
- Bénéfices sécuritaires significatifs  
- Faisabilité technique confirmée

**Recommandations :**
- Procéder à une étude de faisabilité détaillée
- Consulter les parties prenantes clés
- Évaluer les ressources nécessaires

*Analyse générée en mode démo.*`;
  };
  
  return {
    generateContent,
    analyzeContent,
    isLoading,
    result,
    error
  };
};