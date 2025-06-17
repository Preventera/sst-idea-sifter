import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Lightbulb, Save, X, Wand2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { AIEnhancedNameInput } from '@/components/project-form/ai-enhanced-name-input';
import { ProjectDescriptionGenerator } from '@/components/ai-assistant/project-description-generator';

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
  project?: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
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

export function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
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

  const [generatedDescriptions, setGeneratedDescriptions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (project) {
      setFormData(project);
    }
  }, [project]);

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

  const handleGenerateIdeas = async () => {
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

      // Appeler le générateur de description avec le nouveau prompt structuré
      const descriptions = await generateProjectDescriptions(formData.sector, criteriaText);
      setGeneratedDescriptions(descriptions);
      setActiveTab('ai-assistant');
      
      toast({
        title: "Idées générées avec succès",
        description: `${descriptions.length} idées de projets IA-SST ont été générées.`
      });
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

  const generateProjectDescriptions = async (sector: string, criteriaText: string): Promise<string[]> => {
    // Cette fonction devrait appeler l'API avec le prompt structuré en 8 étapes
    // Pour l'instant, nous retournons un exemple
    return [
      `🎯 PROJET IA-SST: Système de prévention intelligent pour ${sector}

Étape 1 : Identification du problème
- Dans le secteur ${sector}, le principal risque concerne la détection tardive des situations dangereuses
- Ce problème entraîne des accidents évitables et des coûts opérationnels élevés

Étape 2 : Applicabilité de l'IA
- Vision par ordinateur pour analyser les comportements à risque en temps réel
- Apprentissage automatique pour prédire les incidents basés sur les patterns historiques

Étape 3 : Conception de la solution
- Architecture modulaire avec capteurs IoT et caméras intelligentes
- Tableaux de bord HSE avec alertes prédictives et rapports automatisés

Étape 4 : Données nécessaires
- Historiques d'incidents des 5 dernières années
- Données de capteurs environnementaux (température, bruit, gaz)
- Images/vidéos des zones de travail

Étape 5 : Développement du modèle
- Algorithmes de deep learning pour reconnaissance d'images
- Métriques: précision >95%, temps de réponse <2 secondes

Étape 6 : Intégration dans le système HSE
- API REST pour intégration avec systèmes existants
- Formation de 40h pour les préventeurs et superviseurs

Étape 7 : Évaluation continue
- Réduction de 30% des incidents dans les 12 premiers mois
- Amélioration continue basée sur les retours utilisateurs

Étape 8 : Catégorie ELON
- Catégorie prioritaire: **Opérations**
- Critical car 70% des accidents surviennent pendant les opérations de routine`
    ];
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
        id: project?.id || crypto.randomUUID(),
        createdAt: project?.createdAt || new Date().toISOString()
      };

      if (project?.id) {
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
          .eq('id', project.id);

        if (error) throw error;
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
      }

      onSave(projectData);
      toast({
        title: project ? "Projet mis à jour" : "Projet créé",
        description: `Le projet "${projectData.name}" a été ${project ? 'mis à jour' : 'créé'} avec succès.`
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive"
      });
    }
  };

  const useGeneratedDescription = (description: string) => {
    setFormData(prev => ({ ...prev, description }));
    setActiveTab('basic');
    toast({
      title: "Description appliquée",
      description: "La description générée a été appliquée au projet."
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{project ? 'Modifier le projet' : 'Nouveau projet IA-SST'}</span>
            <div className="flex items-center gap-2">
              <Badge variant={formData.priority === 'Haute' ? 'destructive' : formData.priority === 'Moyenne' ? 'default' : 'secondary'}>
                {formData.priority}
              </Badge>
              <Badge variant="outline">Score: {formData.score}/10</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Informations de base</TabsTrigger>
              <TabsTrigger value="criteria">Critères d'évaluation</TabsTrigger>
              <TabsTrigger value="ai-assistant">Assistant IA</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du projet *</Label>
                  <AIEnhancedNameInput
                    value={formData.name}
                    onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                    sector={formData.sector}
                    criteria={formData.criteria}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sector">Secteur d'activité *</Label>
                  <Select value={formData.sector} onValueChange={(value) => setFormData(prev => ({ ...prev, sector: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description du projet</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez votre projet d'IA appliquée à la SST..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    {project ? 'Mettre à jour' : 'Créer le projet'}
                  </Button>
                  <Button type="button" variant="outline" onClick={onCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="criteria" className="space-y-6">
              {Object.entries(criteriaLabels).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>{label}</Label>
                    <Badge variant="outline">{formData.criteria[key as keyof Criteria]}/10</Badge>
                  </div>
                  <Slider
                    value={[formData.criteria[key as keyof Criteria]]}
                    onValueChange={(value) => handleCriteriaChange(key as keyof Criteria, value)}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Faible</span>
                    <span>Élevé</span>
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
            </TabsContent>

            <TabsContent value="ai-assistant" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Assistant IA pour la génération d'idées</h3>
                <Button 
                  onClick={handleGenerateIdeas} 
                  disabled={isGenerating || !formData.sector}
                  variant="outline"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Génération en cours...' : 'Générer des idées'}
                </Button>
              </div>

              {!formData.sector && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    Veuillez d'abord sélectionner un secteur d'activité dans l'onglet "Informations de base".
                  </p>
                </div>
              )}

              {generatedDescriptions.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Idées de projets générées:</h4>
                  {generatedDescriptions.map((description, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white">
                      <pre className="text-sm text-gray-700 mb-3 whitespace-pre-wrap font-sans">
                        {description}
                      </pre>
                      <Button 
                        onClick={() => useGeneratedDescription(description)}
                        size="sm"
                        variant="outline"
                      >
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Utiliser cette description
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {generatedDescriptions.length === 0 && formData.sector && (
                <div className="p-8 text-center text-gray-500">
                  <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Cliquez sur "Générer des idées" pour obtenir des suggestions de projets IA-SST personnalisées pour votre secteur.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}