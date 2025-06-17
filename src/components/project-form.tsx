// src/components/project-form.tsx

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Wand2, Brain } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAIAssistant } from "@/hooks/use-ai-assistant";
import { useProfileScianData } from "@/hooks/useProfileScianData";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Criteria {
  technicalFeasibility: number;
  businessValue: number;
  riskReduction: number;
  implementationCost: number;
  timeToMarket: number;
  stakeholderSupport: number;
  regulatoryCompliance: number;
}

interface Project {
  id?: string;
  name: string;
  description: string;
  sector: string;
  criteria: Criteria;
  score: number;
  priority: 'Haute' | 'Moyenne' | 'Faible';
  createdAt?: string;
}

interface ProjectFormProps {
  onAddProject: (project: Project) => void;
  editingProject: Project | null;
  onUpdateProject: (project: Project) => void;
  onCancelEdit: () => void;
}

const criteriaLabels = {
  technicalFeasibility: 'Faisabilité technique',
  businessValue: 'Valeur d\'affaires',
  riskReduction: 'Réduction des risques',
  implementationCost: 'Coût d\'implémentation',
  timeToMarket: 'Temps de mise en marché',
  stakeholderSupport: 'Support des parties prenantes',
  regulatoryCompliance: 'Conformité réglementaire'
};

const sectors = [
  'Agriculture, foresterie, pêche et chasse',
  'Extraction minière, exploitation en carrière, et extraction de pétrole et de gaz',
  'Services publics',
  'Construction',
  'Fabrication',
  'Commerce de gros',
  'Commerce de détail',
  'Transport et entreposage',
  'Industrie de l\'information et industrie culturelle',
  'Finance et assurances',
  'Services immobiliers et services de location et de location à bail',
  'Services professionnels, scientifiques et techniques',
  'Gestion de sociétés et d\'entreprises',
  'Services administratifs, services de soutien, services de gestion des déchets et services d\'assainissement',
  'Services d\'enseignement',
  'Soins de santé et assistance sociale',
  'Arts, spectacles et loisirs',
  'Services d\'hébergement et de restauration',
  'Autres services (sauf les administrations publiques)',
  'Administrations publiques'
];

export const ProjectForm: React.FC<ProjectFormProps> = ({
  onAddProject,
  editingProject,
  onUpdateProject,
  onCancelEdit,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Project>({
    name: '',
    description: '',
    sector: '',
    criteria: {
      technicalFeasibility: 5,
      businessValue: 5,
      riskReduction: 5,
      implementationCost: 5,
      timeToMarket: 5,
      stakeholderSupport: 5,
      regulatoryCompliance: 5
    },
    score: 0,
    priority: 'Moyenne'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const { generateContent, analyzeContent, isLoading } = useAIAssistant();
  
  // NOUVEAU: Hook d'intégration ProfileScian
  const { 
    enrichedData, 
    generateEnrichedPrompt, 
    isProfileComplete, 
    getProfileSummary,
    hasProfile 
  } = useProfileScianData();

  useEffect(() => {
    if (editingProject) {
      setFormData(editingProject);
    }
  }, [editingProject]);

  useEffect(() => {
    const score = calculateScore(formData.criteria);
    const priority = calculatePriority(score);
    setFormData(prev => ({ ...prev, score, priority }));
  }, [formData.criteria]);

  const calculateScore = (criteria: Criteria): number => {
    const weights = {
      technicalFeasibility: 0.2,
      businessValue: 0.25,
      riskReduction: 0.2,
      implementationCost: 0.1,
      timeToMarket: 0.1,
      stakeholderSupport: 0.1,
      regulatoryCompliance: 0.05
    };

    let totalScore = 0;
    Object.entries(criteria).forEach(([key, value]) => {
      const weight = weights[key as keyof typeof weights];
      // Le coût d'implémentation est inversé (plus le coût est bas, plus le score est élevé)
      const adjustedValue = key === 'implementationCost' ? 11 - value : value;
      totalScore += adjustedValue * weight;
    });

    return Math.round(totalScore * 10) / 10;
  };

  const calculatePriority = (score: number): 'Haute' | 'Moyenne' | 'Faible' => {
    if (score >= 8) return 'Haute';
    if (score >= 6) return 'Moyenne';
    return 'Faible';
  };

  const handleCriteriaChange = (key: keyof Criteria, value: number[]) => {
    setFormData(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [key]: value[0]
      }
    }));
  };

  // Fonction generateProjectIdeas avec intégration ProfileScian
  const generateProjectIdeas = async () => {
    if (!formData.sector) {
      toast({
        title: "Secteur requis",
        description: "Veuillez sélectionner un secteur avant de générer des idées.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Créer le texte des critères pour le contexte
      const criteriaText = Object.entries(formData.criteria)
        .map(([key, value]) => `${criteriaLabels[key as keyof typeof criteriaLabels]}: ${value}/10`)
        .join(', ');

      let prompt: string;
      let contextInfo: string;

      // NOUVEAU: Utiliser les données ProfileScian si disponibles
      if (hasProfile && isProfileComplete()) {
        // Prompt enrichi avec les données du profil
        const userInput = `Projet IA-SST: ${formData.name || 'Génération d\'idées'} avec les critères: ${criteriaText}`;
        prompt = generateEnrichedPrompt('', userInput);
        contextInfo = `Contexte ProfileScian: ${getProfileSummary()}`;
        
        toast({
          title: "Mode contextuel activé",
          description: `Génération basée sur votre profil: ${enrichedData?.companySector}`,
        });
      } else {
        // Prompt standard si pas de profil configuré
        prompt = `Tu es un expert HSE spécialisé dans l'application de l'intelligence artificielle pour la prévention des accidents et l'amélioration de la performance sécurité. Génère une étude de cas d'usage d'IA basée sur ces critères: ${criteriaText}.

Étape 1 : Identification du problème
- Dans le secteur ${formData.sector}, le principal risque lié à ces critères concerne: [description spécifique].
- Ce problème entraîne [impact en termes de sécurité, coûts, opérations].

Étape 2 : Applicabilité de l'IA
- Explique comment des techniques IA peuvent résoudre ce problème.
- Met en évidence la valeur ajoutée de l'IA pour la prévention proactive.

Étape 3 : Conception de la solution
- Propose une architecture IA adaptée aux critères fournis.
- Détaille les modules clés: alertes en temps réel, tableaux de bord HSE, etc.

Étape 4 : Données nécessaires
- Liste les sources de données pertinentes pour ce cas d'usage.
- Décris le processus de préparation des données.

Étape 5 : Développement du modèle
- Sélectionne un algorithme adapté à ce cas d'usage.
- Décris les métriques de performance et méthodes de test.

Étape 6 : Intégration dans le système HSE
- Explique comment intégrer cette solution à l'environnement existant.
- Décris la formation nécessaire pour les utilisateurs.

Étape 7 : Évaluation continue
- Définis des métriques de succès pertinentes pour ce projet.
- Propose une stratégie d'amélioration continue.

Étape 8 : Catégorie ELON
- Indique la catégorie prioritaire: [Équipement / Lieux / Opérations / Nature Humaine].
- Explique pourquoi cette catégorie est critique pour ce projet.`;
        
        contextInfo = `Secteur: ${formData.sector}, Critères: ${criteriaText}`;
      }

      // Appeler l'API avec le prompt approprié
      const result = await analyzeContent({
        analysisType: 'project_ideas',
        text: prompt,
        context: contextInfo
      });

      if (result) {
        setFormData(prev => ({ ...prev, name: result }));
        
        toast({
          title: "Idées générées avec succès",
          description: hasProfile && isProfileComplete() ? 
            "Génération personnalisée selon votre profil SCIAN" : 
            "Génération basée sur les critères fournis"
        });
      }
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer les idées. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.sector) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir le nom du projet et sélectionner un secteur.",
        variant: "destructive"
      });
      return;
    }

    try {
      const projectData = {
        ...formData,
        id: editingProject?.id || crypto.randomUUID(),
        createdAt: editingProject?.createdAt || new Date().toISOString()
      };

      if (editingProject?.id) {
        // Mise à jour
        const { error } = await supabase
          .from('projects')
          .update({
            name: projectData.name,
            description: projectData.description,
            sector: projectData.sector,
            criteria: projectData.criteria,
            score: projectData.score,
            priority: projectData.priority
          })
          .eq('id', editingProject.id);

        if (error) throw error;
        onUpdateProject(projectData);
      } else {
        // Création
        const { error } = await supabase
          .from('projects')
          .insert([{
            id: projectData.id,
            name: projectData.name,
            description: projectData.description,
            sector: projectData.sector,
            criteria: projectData.criteria,
            score: projectData.score,
            priority: projectData.priority,
            created_at: projectData.createdAt
          }]);

        if (error) throw error;
        onAddProject(projectData);
      }

      toast({
        title: editingProject ? "Projet mis à jour" : "Projet créé",
        description: `Le projet "${projectData.name}" a été ${editingProject ? 'mis à jour' : 'créé'} avec succès.`
      });

      // Réinitialiser le formulaire si création
      if (!editingProject) {
        setFormData({
          name: '',
          description: '',
          sector: '',
          criteria: {
            technicalFeasibility: 5,
            businessValue: 5,
            riskReduction: 5,
            implementationCost: 5,
            timeToMarket: 5,
            stakeholderSupport: 5,
            regulatoryCompliance: 5
          },
          score: 0,
          priority: 'Moyenne'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{editingProject ? 'Modifier le projet' : 'Nouveau projet IA-SST'}</span>
          <div className="flex items-center gap-2">
            {/* NOUVEAU: Indicateur de profil ProfileScian */}
            {hasProfile && isProfileComplete() && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Brain className="w-3 h-3 mr-1" />
                Profil SCIAN
              </Badge>
            )}
            <Badge variant={formData.priority === 'Haute' ? 'destructive' : formData.priority === 'Moyenne' ? 'default' : 'secondary'}>
              {formData.priority}
            </Badge>
            <Badge variant="outline">Score: {formData.score}/10</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {hasProfile && isProfileComplete() ? (
              <>
                <strong>Mode contextuel activé:</strong> Les idées IA seront générées en tenant compte de votre profil SCIAN ({enrichedData?.companySector}). 
                <br />
                <small className="text-gray-600">Profil: {getProfileSummary()}</small>
              </>
            ) : (
              <>
                Ce formulaire est utilisé pour évaluer les projets IA en santé-sécurité au travail selon plusieurs critères. 
                <br />
                <small className="text-blue-600">💡 Configurez votre profil SCIAN pour des suggestions personnalisées.</small>
              </>
            )}
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom du projet avec bouton de génération amélioré */}
          <div>
            <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom / Description du projet
            </label>
            <div className="space-y-2">
              <input
                id="project-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Caméra intelligente pour détecter le non-port des EPI"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                type="button"
                variant="outline"
                onClick={generateProjectIdeas} 
                disabled={isLoading || isGenerating}
                className={`w-full flex items-center justify-center gap-2 ${
                  hasProfile && isProfileComplete() ? 'border-green-200 text-green-700 hover:bg-green-50' : ''
                }`}
              >
                <Wand2 className="h-4 w-4" />
                {isLoading || isGenerating ? 'Génération en cours...' : 
                  hasProfile && isProfileComplete() ? 
                    'Générer des idées personnalisées avec l\'IA' : 
                    'Générer des idées avec l\'IA'
                }
              </Button>
              {formData.name && formData.name.length > 100 && (
                <div className="bg-blue-50 p-3 rounded border border-blue-200 mt-2">
                  <p className="text-sm text-blue-700 whitespace-pre-wrap">{formData.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Secteur SCIAN */}
          <div>
            <label htmlFor="scian-sector" className="block text-sm font-medium text-gray-700 mb-1">
              Secteur d'activité
            </label>
            <select
              id="scian-sector"
              value={formData.sector}
              onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un secteur</option>
              {sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>

          {/* Description du projet */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description détaillée (optionnel)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez plus en détail votre projet d'IA appliquée à la SST..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Critères d'évaluation */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold">Critères d'évaluation</h3>

            {Object.entries(criteriaLabels).map(([key, label]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">{label}</label>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {formData.criteria[key as keyof Criteria]}/10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={formData.criteria[key as keyof Criteria]}
                  onChange={(e) => handleCriteriaChange(key as keyof Criteria, [parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Faible (1)</span>
                  <span>Élevé (10)</span>
                </div>
              </div>
            ))}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Score calculé</span>
              </div>
              <p className="text-sm text-blue-800">
                Score global: <strong>{formData.score}/10</strong> - Priorité: <strong>{formData.priority}</strong>
              </p>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-2 pt-4">
            {editingProject && (
              <Button type="button" variant="outline" onClick={onCancelEdit}>
                Annuler
              </Button>
            )}
            <Button type="submit">
              {editingProject ? 'Mettre à jour le projet' : 'Créer le projet'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};