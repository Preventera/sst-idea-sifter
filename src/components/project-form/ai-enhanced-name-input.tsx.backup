// Fichier: src/components/project-form/ai-enhanced-name-input.tsx
// Version hybride: Structure existante + Intégration ProfileScian

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import AITextEnhancer from '@/components/ai-assistant/ai-text-enhancer';
import LLMSelector, { LLMProvider } from '@/components/ai-assistant/llm-selector';
import { useAIAssistant } from '@/hooks/use-ai-assistant';
import { Criteria } from '@/types/project';
import { SCIAN_SECTORS } from '@/data/scian-sectors';

interface AIEnhancedNameInputProps {
  name: string;
  setName: (name: string) => void;
  criteria: Criteria;
  scianSectorId?: string;
}

const AIEnhancedNameInput = ({ name, setName, criteria, scianSectorId }: AIEnhancedNameInputProps) => {
  const [selectedLLM, setSelectedLLM] = useState<LLMProvider>('claude');
  const { generateContent, analyzeContent, isLoading } = useAIAssistant();
  
  console.log('AIEnhancedNameInput rendered'); // Debug log

  // 🆕 NOUVELLE FONCTION: Récupérer les données contextuelles ProfileScian
  const getContextualData = () => {
    // Données du secteur SCIAN
    const sectorData = SCIAN_SECTORS.find(s => s.id === scianSectorId);
    
    // Récupérer les données du profil SCIAN depuis localStorage (si disponible)
    const profileData = localStorage.getItem('profileScianData');
    let parsedProfile = null;
    
    try {
      if (profileData) {
        parsedProfile = JSON.parse(profileData);
      }
    } catch (error) {
      console.warn('Erreur lors de la lecture du profil SCIAN:', error);
    }

    return {
      sector: sectorData,
      profile: parsedProfile
    };
  };

  // 🆕 NOUVELLE FONCTION: Construire le contexte enrichi
  const buildEnrichedContext = () => {
    const { sector, profile } = getContextualData();
    
    let contextualInfo = "";

    // Ajout du contexte sectoriel détaillé
    if (sector) {
      contextualInfo += `\n--- CONTEXTE SECTORIEL DÉTAILLÉ ---\n`;
      contextualInfo += `Secteur: ${sector.name} (${sector.description})\n`;
      contextualInfo += `Risques principaux: ${sector.statistics?.accidentCauses?.join(', ') || 'Non spécifiés'}\n`;
      contextualInfo += `Zones de prévention: ${sector.statistics?.keyPreventionAreas?.join(', ') || 'Non spécifiées'}\n`;
      contextualInfo += `Taux de mortalité: ${sector.statistics?.mortalityRate || 'Non disponible'}\n`;
      contextualInfo += `Potentiel IA: ${sector.riskFactors.aiPreventivePotential}/5\n`;
    }

    // Ajout du contexte organisationnel (si profil disponible)
    if (profile) {
      contextualInfo += `\n--- CONTEXTE ORGANISATIONNEL ---\n`;
      if (profile.company?.size) {
        contextualInfo += `Taille organisation: ${profile.company.size}\n`;
      }
      if (profile.system?.selectedMethodologies?.length > 0) {
        contextualInfo += `Méthodologies SST: ${profile.system.selectedMethodologies.slice(0, 3).join(', ')}\n`;
      }
      if (profile.company?.industry) {
        contextualInfo += `Industrie spécifique: ${profile.company.industry}\n`;
      }
      if (profile.risks?.specificRisks?.length > 0) {
        contextualInfo += `Risques identifiés: ${profile.risks.specificRisks.slice(0, 3).join(', ')}\n`;
      }
    }

    return contextualInfo;
  };
  
  const generateProjectIdeas = async () => {
    console.log('Génération d\'idées de projet démarrée'); // Debug log
    
    const criteriaText = Object.entries(criteria)
      .map(([key, value]) => `${key}: ${value}/10`)
      .join(', ');
    
    // 🆕 ENRICHISSEMENT: Contexte enrichi avec ProfileScian
    const enrichedContext = buildEnrichedContext();
    const baseContext = scianSectorId ? `Secteur SCIAN: ${scianSectorId}` : '';
    const fullContext = baseContext + enrichedContext;
    
    const prompts = [
      `Génère une description de projet IA-SST innovant basée sur ces critères: ${criteriaText}`,
      `Propose un projet IA-SST axé sur la prévention avec ces scores: ${criteriaText}`,
      `Suggère un projet IA-SST pour améliorer la sécurité au travail: ${criteriaText}`
    ];
    
    // Prendre le premier prompt pour une génération simple
    const prompt = prompts[0];
    
    let result = null;
    
    try {
      if (selectedLLM === 'openai') {
        result = await generateContent({
          type: 'project_description',
          prompt,
          context: fullContext
        });
      } else {
        // 🆕 ENRICHISSEMENT: Prompt contextualisé avec données ProfileScian
        const contextualizedPrompt = `Tu es un expert HSE spécialisé dans l'application de l'intelligence artificielle pour la prévention des accidents et l'amélioration de la performance sécurité. 

${enrichedContext}

Génère une étude de cas d'usage d'IA basée sur ces critères: ${criteriaText}.

CONSIGNES: Adapte spécifiquement ta réponse aux risques sectoriels et au contexte organisationnel mentionnés ci-dessus.

Étape 1 : Identification du problème
- Dans le secteur ${scianSectorId || "concerné"}, le principal risque lié à ces critères concerne: [description spécifique adaptée aux risques sectoriels].
- Ce problème entraîne [impact en termes de sécurité, coûts, opérations].

Étape 2 : Applicabilité de l'IA
- Explique comment des techniques IA peuvent résoudre ce problème spécifique.
- Met en évidence la valeur ajoutée de l'IA pour la prévention proactive dans ce contexte.

Étape 3 : Conception de la solution
- Propose une architecture IA adaptée aux critères fournis et au secteur.
- Détaille les modules clés: alertes en temps réel, tableaux de bord HSE, etc.

Étape 4 : Données nécessaires
- Liste les sources de données pertinentes pour ce cas d'usage sectoriel.
- Décris le processus de préparation des données spécifiques au secteur.

Étape 5 : Développement du modèle
- Sélectionne un algorithme adapté à ce cas d'usage et aux contraintes sectorielles.
- Décris les métriques de performance et méthodes de test appropriées.

Étape 6 : Intégration dans le système HSE
- Explique comment intégrer cette solution à l'environnement existant du secteur.
- Décris la formation nécessaire pour les utilisateurs en tenant compte du contexte organisationnel.

Étape 7 : Évaluation continue
- Définis des métriques de succès pertinentes pour ce projet et ce secteur.
- Propose une stratégie d'amélioration continue adaptée.

Étape 8 : Catégorie ELON
- Indique la catégorie prioritaire: [Équipement / Lieux / Opérations / Nature Humaine].
- Explique pourquoi cette catégorie est critique pour ce projet dans ce secteur spécifique.

IMPORTANT: Utilise les informations contextuelles fournies pour personnaliser chaque étape.`;

        result = await analyzeContent({
          analysisType: 'project_ideas',
          text: contextualizedPrompt,
          context: fullContext
        });
      }
      
      if (result) {
        setName(result);
        console.log('Résultat généré:', result); // Debug log
      }
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
    }
  };

  // 🆕 FONCTION: Afficher le contexte disponible
  const getContextSummary = () => {
    const { sector, profile } = getContextualData();
    const elements = [];
    
    if (sector) {
      elements.push(`Secteur: ${sector.name}`);
    }
    if (profile?.company?.size) {
      elements.push(`Org: ${profile.company.size}`);
    }
    if (profile?.system?.selectedMethodologies?.length > 0) {
      elements.push(`${profile.system.selectedMethodologies.length} méthodologies SST`);
    }
    
    return elements.length > 0 ? elements.join(' • ') : 'Contexte de base uniquement';
  };
  
  return (
    <div className="mb-6 space-y-4">
      <div>
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
      </div>
      
      {/* 🆕 AMÉLIORATION: Sélecteur LLM avec contexte enrichi */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">🤖 Assistant IA pour générer des idées</h4>
        
        {/* 🆕 AJOUT: Affichage du contexte disponible */}
        <div className="text-xs text-gray-500 mb-2 p-2 bg-gray-50 rounded">
          📊 Contexte utilisé: {getContextSummary()}
        </div>
        
        <LLMSelector
          selectedLLM={selectedLLM}
          onLLMChange={setSelectedLLM}
          onGenerate={generateProjectIdeas}
          isLoading={isLoading}
        />
      </div>
      
      {/* Afficher l'amélioration de texte seulement si il y a du texte */}
      {name.trim() && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">✨ Améliorer le texte</h4>
          <AITextEnhancer
            originalText={name}
            onApply={setName}
            context={`Secteur: ${scianSectorId || 'Non spécifié'}`}
            placeholder="Description du projet IA-SST"
          />
        </div>
      )}
    </div>
  );
};

export { AIEnhancedNameInput };