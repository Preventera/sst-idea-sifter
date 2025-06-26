// src/utils/json-converter.ts
// Convertisseur optimisé pour la structure IGNITIA existante

import { Project } from "../types/project";
import { IGNITIAModelJSON } from "../types/project-models";

/**
 * Convertit un modèle JSON enrichi vers le format Project IGNITIA existant
 */
export function convertJSONToProject(jsonModel: IGNITIAModelJSON): Project {
  // Mapping du niveau vers difficulty
  const difficultyMap: Record<string, 'Beginner' | 'Intermediate' | 'Advanced'> = {
    'Débutant': 'Beginner',
    'Intermédiaire': 'Intermediate', 
    'Avancé': 'Advanced'
  };

  // Mapping de la priorité vers ROI
  const roiMap: Record<string, 'Low' | 'Medium' | 'High'> = {
    'Faible': 'Low',
    'Moyenne': 'Medium',
    'Élevée': 'High'
  };

  // Estimation du temps selon la complexité
  const timeMap: Record<string, string> = {
    'Débutant': '2-3 mois',
    'Intermédiaire': '4-5 mois',
    'Avancé': '6+ mois'
  };

  return {
    id: jsonModel.project_id,
    name: jsonModel.nom,
    description: jsonModel.description,
    category: jsonModel.contexte,
    difficulty: difficultyMap[jsonModel.niveau] || 'Intermediate',
    estimatedTime: timeMap[jsonModel.niveau] || '4-5 mois',
    roi: roiMap[jsonModel.priorite] || 'Medium',
    requirements: jsonModel.implementation.prerequisites,
    technologies: jsonModel.technologies,
    businessValue: jsonModel.priorite === 'Élevée' ? 85 : jsonModel.priorite === 'Moyenne' ? 65 : 45,
    implementation: jsonModel.implementation.steps,
    risks: [`Complexité ${jsonModel.niveau}`, 'Adoption utilisateur', 'Intégration système'],
    sectors: jsonModel.secteur,
    tags: jsonModel.mots_cles,
    views: jsonModel.metrics.views,
    likes: Math.floor(jsonModel.metrics.usage * 0.6), // Approximation
    rating: jsonModel.metrics.rating,
    createdAt: jsonModel.created || new Date().toISOString(),
    updatedAt: jsonModel.updated || new Date().toISOString()
  };
}

/**
 * Convertit un Project IGNITIA vers le format JSON enrichi
 */
export function convertProjectToJSON(project: Project): IGNITIAModelJSON {
  // Mapping inverse
  const niveauMap: Record<string, 'Débutant' | 'Intermédiaire' | 'Avancé'> = {
    'Beginner': 'Débutant',
    'Intermediate': 'Intermédiaire',
    'Advanced': 'Avancé'
  };

  const prioriteMap: Record<string, 'Faible' | 'Moyenne' | 'Élevée'> = {
    'Low': 'Faible',
    'Medium': 'Moyenne', 
    'High': 'Élevée'
  };

  const contexteMap: Record<string, 'Opérations' | 'Équipement' | 'Lieux' | 'Nature humaine'> = {
    'Operations': 'Opérations',
    'Equipment': 'Équipement',
    'Locations': 'Lieux',
    'Human Nature': 'Nature humaine',
    // Fallbacks pour la compatibilité
    'Opérations': 'Opérations',
    'Équipement': 'Équipement',
    'Lieux': 'Lieux',
    'Nature humaine': 'Nature humaine'
  };

  return {
    project_id: project.id,
    nom: project.name,
    niveau: niveauMap[project.difficulty] || 'Intermédiaire',
    contexte: contexteMap[project.category] || 'Opérations',
    priorite: prioriteMap[project.roi] || 'Moyenne',
    description: project.description,
    mots_cles: project.tags || [],
    secteur: project.sectors || [],
    technologies: project.technologies || [],
    implementation: {
      technologies: project.technologies || [],
      prerequisites: project.requirements || [],
      steps: project.implementation || []
    },
    metrics: {
      views: project.views || 0,
      usage: project.likes || 0,
      rating: project.rating || 0
    },
    cas_usage_sectoriels: [
      {
        titre: "Cas d'usage général",
        description: project.description.slice(0, 150) + "...",
        reference: "Analyse IGNITIA automatisée"
      }
    ],
    cybersecurite: {
      donnees_sensibles: true,
      mesures: ["Chiffrement AES-256", "Authentification multi-facteurs", "Audit régulier"],
      conformite: ["Loi 25", "ISO 27001"]
    },
    gouvernance_ethique: {
      transparence: "Algorithmes explicables et documentés",
      equite: "Analyse de biais régulière et correction",
      responsabilite: "Validation humaine des décisions critiques",
      protection_donnees: "Anonymisation systématique des données",
      conformite: ["CNESST", "Loi 25", "ISO 45001"],
      audit: "Audit annuel obligatoire par organisme indépendant",
      recours: "Formulaire de signalement et révision accessible"
    },
    indicateurs: {
      conformite_loi_25: true,
      audit_biais_valide: true,
      explicabilite_activee: true
    },
    created: project.createdAt,
    updated: project.updatedAt
  };
}

/**
 * Batch converter pour traiter plusieurs projets
 */
export function convertJSONArrayToProjects(jsonModels: IGNITIAModelJSON[]): Project[] {
  return jsonModels.map(convertJSONToProject);
}

/**
 * Batch converter inverse
 */
export function convertProjectsToJSONArray(projects: Project[]): IGNITIAModelJSON[] {
  return projects.map(convertProjectToJSON);
}

/**
 * Validation des données JSON
 */
export function validateJSONModel(model: any): boolean {
  const requiredFields = [
    'project_id', 'nom', 'niveau', 'contexte', 'priorite',
    'description', 'mots_cles', 'secteur', 'technologies',
    'implementation', 'metrics'
  ];
  
  return requiredFields.every(field => 
    model && typeof model === 'object' && field in model
  );
}

/**
 * Génération d'ID automatique compatible IGNITIA
 */
export function generateProjectId(nom: string, contexte: string): string {
  const acronymeMap: Record<string, string> = {
    'Opérations': 'OPS',
    'Équipement': 'EQP', 
    'Lieux': 'LOC',
    'Nature humaine': 'HUM'
  };
  
  const acronyme = acronymeMap[contexte] || 'GEN';
  const timestamp = Date.now().toString().slice(-6);
  const nameHash = nom.replace(/\s+/g, '').substring(0, 3).toUpperCase();
  
  return `GenAISafety-${acronyme}-${nameHash}${timestamp}`;
}