// src/hooks/useProfileScianData.ts
import { useState, useEffect } from 'react';
import { ProfileScianData } from '@/types/profile-scian';

interface EnrichedProfileData {
  // Données de base
  companyName: string;
  scianSector: string;
  companySector: string;
  companySize: string;
  
  // Risques sectoriels
  sectorRisks: string[];
  selectedRisks: string[];
  
  // Méthodologies SST
  sstMethodologies: string[];
  sstCertifications: string[];
  
  // Contexte organisationnel
  workOrganization: string;
  safetyClimate: string;
  
  // Indicateurs de maturité
  hasHSEPolicy: boolean;
  hasFormalSSTSystem: boolean;
  complianceFrameworks: string[];
}

interface ContextualPromptData {
  sectorContext: string;
  riskContext: string;
  methodologyContext: string;
  organizationalContext: string;
  complianceContext: string;
}

const PROFILE_SCIAN_STORAGE_KEY = 'ignitia-profile-scian';

export const useProfileScianData = () => {
  const [profileData, setProfileData] = useState<ProfileScianData | null>(null);
  const [enrichedData, setEnrichedData] = useState<EnrichedProfileData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger les données du ProfileScian depuis localStorage
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(PROFILE_SCIAN_STORAGE_KEY);
      if (storedData) {
        const parsedData: ProfileScianData = JSON.parse(storedData);
        setProfileData(parsedData);
        setEnrichedData(enrichProfileData(parsedData));
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil SCIAN:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Enrichir les données brutes pour faciliter leur utilisation
  const enrichProfileData = (data: ProfileScianData): EnrichedProfileData => {
    return {
      // Données de base
      companyName: data.company?.name || '',
      scianSector: data.company?.scianCode || '',
      companySector: data.company?.sector || '',
      companySize: data.company?.size || '',
      
      // Risques sectoriels (simulés - à adapter selon votre structure)
      sectorRisks: getSectorSpecificRisks(data.company?.sector),
      selectedRisks: data.riskProfile?.identifiedRisks || [],
      
      // Méthodologies SST
      sstMethodologies: data.sstSystem?.selectedMethodologies || [],
      sstCertifications: data.sstSystem?.certifications || [],
      
      // Contexte organisationnel
      workOrganization: data.riskProfile?.workOrganization || '',
      safetyClimate: data.riskProfile?.safetyClimate || '',
      
      // Indicateurs de maturité
      hasHSEPolicy: data.hsePolicies?.hasWrittenPolicy || false,
      hasFormalSSTSystem: data.sstSystem?.hasFormalSystem || false,
      complianceFrameworks: data.hsePolicies?.complianceFrameworks || [],
    };
  };

  // Obtenir les risques spécifiques au secteur
  const getSectorSpecificRisks = (sector: string): string[] => {
    const sectorRiskMap: Record<string, string[]> = {
      'Construction': [
        'Chutes de hauteur',
        'Accidents avec équipements lourds',
        'Exposition à substances dangereuses',
        'Risques électriques'
      ],
      'Fabrication': [
        'Accidents de machines',
        'Exposition chimique',
        'Troubles musculo-squelettiques',
        'Risques de brûlures'
      ],
      'Transport et entreposage': [
        'Accidents de la route',
        'Manutention lourde',
        'Fatigue du conducteur',
        'Accidents de chargement'
      ],
      'Soins de santé et assistance sociale': [
        'Exposition à agents pathogènes',
        'Piqûres et coupures',
        'Stress professionnel',
        'Troubles musculo-squelettiques'
      ]
    };
    
    return sectorRiskMap[sector] || ['Risques professionnels généraux'];
  };

  // Générer un contexte enrichi pour les prompts IA
  const getContextualPromptData = (): ContextualPromptData => {
    if (!enrichedData) {
      return {
        sectorContext: '',
        riskContext: '',
        methodologyContext: '',
        organizationalContext: '',
        complianceContext: ''
      };
    }

    return {
      sectorContext: enrichedData.companySector ? 
        `Dans le secteur ${enrichedData.companySector} (${enrichedData.scianSector})` : 
        'Dans votre secteur d\'activité',
      
      riskContext: enrichedData.sectorRisks.length > 0 ? 
        `Les principaux risques identifiés incluent: ${enrichedData.sectorRisks.join(', ')}` : 
        'Selon les risques professionnels généraux',
      
      methodologyContext: enrichedData.sstMethodologies.length > 0 ? 
        `L'organisation utilise les méthodologies: ${enrichedData.sstMethodologies.join(', ')}` : 
        'En tenant compte des méthodologies SST standards',
      
      organizationalContext: `Organisation du travail: ${enrichedData.workOrganization}. Climat de sécurité: ${enrichedData.safetyClimate}`,
      
      complianceContext: enrichedData.complianceFrameworks.length > 0 ? 
        `Conformité aux cadres: ${enrichedData.complianceFrameworks.join(', ')}` : 
        'Selon les exigences réglementaires applicables'
    };
  };

  // Générer un prompt enrichi pour l'assistant IA
  const generateEnrichedPrompt = (basePrompt: string, userInput: string): string => {
    if (!enrichedData) {
      return basePrompt.replace('[CONTEXTE_UTILISATEUR]', userInput);
    }

    const contextData = getContextualPromptData();
    
    const enrichedPrompt = `Tu es un expert HSE spécialisé dans l'application de l'intelligence artificielle pour la prévention des accidents et l'amélioration de la performance sécurité.

CONTEXTE ORGANISATIONNEL:
- ${contextData.sectorContext}
- ${contextData.riskContext}
- ${contextData.methodologyContext}
- ${contextData.organizationalContext}
- ${contextData.complianceContext}

DEMANDE DE L'UTILISATEUR: ${userInput}

Génère une étude de cas d'usage d'IA personnalisée selon ce contexte:

Étape 1 : Identification du problème
- ${contextData.sectorContext}, le principal risque lié à "${userInput}" concerne: [description spécifique au secteur].
- Ce problème entraîne [impact en termes de sécurité, coûts, opérations] particulièrement dans votre contexte organisationnel.

Étape 2 : Applicabilité de l'IA
- Explique comment des techniques IA peuvent résoudre ce problème en tenant compte de vos méthodologies actuelles.
- Met en évidence la valeur ajoutée de l'IA pour la prévention proactive dans votre secteur.

Étape 3 : Conception de la solution
- Propose une architecture IA adaptée à votre environnement organisationnel.
- Détaille les modules clés: alertes en temps réel, tableaux de bord HSE, intégration avec vos systèmes existants.

Étape 4 : Données nécessaires
- Liste les sources de données pertinentes disponibles dans votre secteur.
- Priorise selon vos méthodologies SST en place: ${enrichedData.sstMethodologies.join(', ') || 'méthodologies standards'}.

Étape 5 : Développement du modèle
- Sélectionne un algorithme adapté aux spécificités de votre secteur.
- Décris les métriques de performance alignées sur vos certifications: ${enrichedData.sstCertifications.join(', ') || 'standards industriels'}.

Étape 6 : Intégration dans le système HSE
- Explique comment intégrer cette solution à votre environnement ${enrichedData.workOrganization}.
- Décris la formation nécessaire en tenant compte de votre climat de sécurité actuel.

Étape 7 : Évaluation continue
- Définis des métriques de succès pertinentes pour votre secteur.
- Propose une stratégie d'amélioration continue adaptée à vos cadres de conformité.

Étape 8 : Catégorie ELON
- Indique la catégorie prioritaire: [Équipement / Lieux / Opérations / Nature Humaine].
- Explique pourquoi cette catégorie est critique pour ${enrichedData.companySector}.`;

    return enrichedPrompt;
  };

  // Vérifier si le profil est suffisamment rempli pour la contextualisation
  const isProfileComplete = (): boolean => {
    return !!(enrichedData?.companySector && enrichedData?.scianSector);
  };

  // Obtenir un résumé du profil pour affichage
  const getProfileSummary = (): string => {
    if (!enrichedData) return 'Aucun profil configuré';
    
    const parts = [];
    if (enrichedData.companyName) parts.push(enrichedData.companyName);
    if (enrichedData.companySector) parts.push(enrichedData.companySector);
    if (enrichedData.companySize) parts.push(`Taille: ${enrichedData.companySize}`);
    
    return parts.length > 0 ? parts.join(' • ') : 'Profil partiellement configuré';
  };

  return {
    // États
    profileData,
    enrichedData,
    isLoaded,
    
    // Fonctions utilitaires
    getContextualPromptData,
    generateEnrichedPrompt,
    isProfileComplete,
    getProfileSummary,
    
    // Métadonnées
    hasProfile: !!profileData,
    isComplete: isProfileComplete(),
    summary: getProfileSummary()
  };
};