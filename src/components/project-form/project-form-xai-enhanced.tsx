// src/components/project-form/project-form-xai-enhanced.tsx
// Intégration du module XAI dans le ProjectForm existant d'IGNITIA
// ÉTAPE 1.3c - ProjectForm avec XAI intégré

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Brain, Target, TrendingUp, Info, Lightbulb, Zap, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { performAutoScoring, type AutoScoringResult } from '@/utils/ai-auto-scoring';
import { SCIAN_SECTORS } from '@/data/scian-sectors';
import { XAIExplanationComponent, XAIQuickExplanation } from '@/components/ui/xai-explanation';
import { ProjectContext, XAIExplanation } from '@/utils/xai-context-engine';

// Interface harmonisée pour ProjectData
interface ProjectData {
  id: string;
  name: string;
  description: string;
  sector: string;
  criteria: {
    technicalFeasibility: number;
    businessValue: number;
    riskReduction: number;
    implementationCost: number;
    timeToMarket: number;
    stakeholderSupport: number;
    regulatoryCompliance: number;
  };
  score: number;
  priority: string;
  xaiExplanations?: Record<string, XAIExplanation>; // Nouveau : stockage des explications XAI
}

interface ProjectFormXAIProps {
  onAddProject: (project: ProjectData) => void;
  editingProject?: any;
  onUpdateProject?: (project: ProjectData) => void;
  onCancelEdit?: () => void;
}

export const ProjectFormXAIEnhanced: React.FC<ProjectFormXAIProps> = ({
  onAddProject,
  editingProject,
  onUpdateProject,
  onCancelEdit
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic');
  
  // État du formulaire avec support XAI
  const [formData, setFormData] = useState<ProjectData>({
    id: editingProject?.id || crypto.randomUUID(),
    name: editingProject?.name || '',
    description: editingProject?.description || '',
    sector: editingProject?.sector || '',
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
    priority: 'Moyenne',
    xaiExplanations: {} // Nouveau : stockage des explications
  });

  // État pour l'auto-évaluation et XAI
  const [isAutoScoring, setIsAutoScoring] = useState(false);
  const [autoScoringResult, setAutoScoringResult] = useState<AutoScoringResult | null>(null);
  const [showXAIMode, setShowXAIMode] = useState(false);

  // Calcul automatique du score
  useEffect(() => {
    const criteriaValues = Object.values(formData.criteria);
    const average = criteriaValues.reduce((sum, val) => sum + val, 0) / criteriaValues.length;
    const finalScore = Math.round(average * 100) / 100;
    
    let priority = 'Faible';
    if (average >= 7.5) priority = 'Élevée';
    else if (average >= 6) priority = 'Moyenne';

    setFormData(prev => ({ ...prev, score: finalScore, priority }));
  }, [formData.criteria]);

  // Création du contexte projet pour XAI
  const getProjectContext = (): ProjectContext => ({
    nom: formData.name,
    description: formData.description,
    secteurSCIAN: formData.sector,
    criteresEvalues: formData.criteria,
    risquesPrincipaux: getSecteurRisks(formData.sector),
    donneesPilotes: []
  });

  const getSecteurRisks = (sectorId: string): string[] => {
    const risquesBySector: Record<string, string[]> = {
      "2381": ["Chutes de hauteur", "Accidents mortels", "Équipements défaillants"],
      "3361": ["Troubles musculo-squelettiques", "Accidents de machines", "Exposition chimique"],
      "6211": ["Risques biologiques", "Stress professionnel", "Erreurs médicales"]
    };
    return risquesBySector[sectorId] || ["Risques généraux"];
  };

  // Fonction d'auto-évaluation existante
  const handleAutoScoring = async () => {
    if (!formData.name.trim() && !formData.description.trim()) {
      toast({
        title: "Contenu requis",
        description: "Veuillez d'abord saisir le nom ou la description du projet",
        variant: "destructive"
      });
      return;
    }

    setIsAutoScoring(true);
    try {
      const result = await performAutoScoring(
        formData.name,
        formData.description,
        formData.sector,
        false
      );
      
      const mappedResult: AutoScoringResult = {
        ...result,
        criteria: {
          technicalFeasibility: result.criteria.faisabilite,
          businessValue: Math.round((result.criteria.impact + result.criteria.excellence) / 2),
          riskReduction: result.criteria.impact,
          implementationCost: 11 - result.criteria.faisabilite,
          timeToMarket: result.criteria.faisabilite,
          stakeholderSupport: result.criteria.acceptabilite,
          regulatoryCompliance: result.criteria.gouvernance
        } as any
      };
      
      setAutoScoringResult(mappedResult);
      
      toast({
        title: "Auto-évaluation terminée",
        description: `Analyse terminée avec succès. Confiance: ${result.confidence}/10`
      });
    } catch (error) {
      console.error('❌ Erreur lors de l\'auto-évaluation:', error);
      toast({
        title: "Erreur d'auto-évaluation", 
        description: `Erreur: ${error.message || 'Impossible d\'analyser le projet'}`,
        variant: "destructive"
      });
    } finally {
      setIsAutoScoring(false);
    }
  };

  // Nouvelle fonction : gérer la génération d'explication XAI
  const handleXAIExplanation = (critere: string, explanation: XAIExplanation) => {
    setFormData(prev => ({
      ...prev,
      xaiExplanations: {
        ...prev.xaiExplanations,
        [critere]: explanation
      }
    }));

    toast({
      title: "Explication XAI générée",
      description: `Explication contextuelle créée pour ${critere}`
    });
  };

  // Appliquer les suggestions IA
  const applySuggestedScores = () => {
    if (!autoScoringResult) return;
    
    setFormData(prev => ({
      ...prev,
      criteria: autoScoringResult.criteria as any
    }));
    
    toast({
      title: "Scores appliqués",
      description: "Les scores suggérés par l'IA ont été appliqués."
    });
    setAutoScoringResult(null);
  };

  // Ignorer les suggestions
  const ignoreAutoScoring = () => {
    setAutoScoringResult(null);
    toast({
      title: "Suggestions ignorées",
      description: "Les suggestions ont été ignorées."
    });
  };

  // Mise à jour des critères
  const updateCriteria = (key: keyof ProjectData['criteria'], value: number[]) => {
    setFormData(prev => ({
      ...prev,
      criteria: { ...prev.criteria, [key]: value[0] }
    }));
  };

  // Soumission du formulaire
  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez saisir un nom pour le projet.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Description requise",
        description: "Veuillez saisir une description pour le projet.",
        variant: "destructive"
      });
      return;
    }

    if (editingProject && onUpdateProject) {
      onUpdateProject(formData);
    } else {
      onAddProject(formData);
    }

    // Réinitialiser si création
    if (!editingProject) {
      setFormData({
        id: crypto.randomUUID(),
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
        priority: 'Moyenne',
        xaiExplanations: {}
      });
      setActiveTab('basic');
    }
  };

  // Couleur priorité
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Élevée': return 'bg-red-100 text-red-800';
      case 'Moyenne': return 'bg-yellow-100 text-yellow-800';
      case 'Faible': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-blue-600" />
              <span>{editingProject ? 'Modifier le projet' : 'Nouveau projet IA-SST'}</span>
              {showXAIMode && (
                <Badge className="bg-purple-100 text-purple-700">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Mode XAI
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowXAIMode(!showXAIMode)}
                className={showXAIMode ? "bg-purple-50 border-purple-300" : ""}
              >
                <Sparkles className="h-4 w-4 mr-1" />
                {showXAIMode ? 'Désactiver XAI' : 'Activer XAI'}
              </Button>
              <Badge className={getPriorityColor(formData.priority)}>
                {formData.priority}
              </Badge>
              <Badge variant="outline">
                Score: {formData.score}/10
              </Badge>
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

            {/* ONGLET INFORMATIONS DE BASE */}
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom du projet *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Caméra intelligente pour détecter le non-port des EPI"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="sector">Secteur d'activité *</Label>
                  <Select value={formData.sector} onValueChange={(value) => setFormData(prev => ({ ...prev, sector: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      {SCIAN_SECTORS.map((sector) => (
                        <SelectItem key={sector.id} value={sector.id}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description du projet</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez votre projet d'IA appliquée à la SST..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                  />
                </div>

                <Button onClick={() => setActiveTab('criteria')} className="w-full">
                  Continuer vers l'évaluation
                </Button>
              </div>
            </TabsContent>

            {/* ONGLET CRITÈRES D'ÉVALUATION AVEC XAI */}
            <TabsContent value="criteria" className="space-y-6">
              {/* Auto-évaluation IA */}
              <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium text-blue-900">Auto-évaluation IA des critères</h3>
                      {autoScoringResult && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-700">
                          Confiance: {autoScoringResult.confidence}/10
                        </Badge>
                      )}
                    </div>
                    <Button 
                      onClick={handleAutoScoring}
                      disabled={isAutoScoring}
                      variant="default"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isAutoScoring ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Analyse en cours...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          Évaluer automatiquement
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Résultats auto-évaluation */}
              {autoScoringResult && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <div className="flex items-center justify-between">
                      <span>L'IA suggère des scores basés sur l'analyse du projet</span>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={applySuggestedScores} className="bg-green-600 hover:bg-green-700 text-white">
                          Appliquer
                        </Button>
                        <Button size="sm" variant="outline" onClick={ignoreAutoScoring}>
                          Ignorer
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Score total */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Score total: {formData.score}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(formData.score / 10) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Critères individuels avec XAI */}
              <div className="space-y-6">
                {Object.entries(formData.criteria).map(([key, value]) => {
                  const criteriaLabels = {
                    technicalFeasibility: 'Faisabilité technique',
                    businessValue: 'Valeur d\'affaires',
                    riskReduction: 'Réduction des risques',
                    implementationCost: 'Coût d\'implémentation',
                    timeToMarket: 'Temps de mise en marché',
                    stakeholderSupport: 'Support des parties prenantes',
                    regulatoryCompliance: 'Conformité réglementaire'
                  };

                  const descriptions = {
                    technicalFeasibility: 'Complexité technique et ressources requises pour l\'implémentation',
                    businessValue: 'Impact économique et opérationnel attendu du projet',
                    riskReduction: 'Réduction des risques d\'accidents et amélioration de la sécurité',
                    implementationCost: 'Coût total d\'investissement et de déploiement (1=très coûteux, 10=peu coûteux)',
                    timeToMarket: 'Délai estimé pour la mise en œuvre et déploiement',
                    stakeholderSupport: 'Acceptation et support des équipes et direction',
                    regulatoryCompliance: 'Conformité aux normes et réglementations SST'
                  };

                  const suggestionKey = key as keyof typeof autoScoringResult['criteria'];
                  const suggestion = autoScoringResult?.criteria[suggestionKey];

                  return (
                    <div key={key} className="space-y-3">
                      {/* En-tête du critère avec XAI intégré */}
                      {showXAIMode ? (
                        <XAIExplanationComponent
                          critere={key}
                          score={value}
                          contexteProjet={getProjectContext()}
                          labelCritere={criteriaLabels[key as keyof typeof criteriaLabels]}
                          onExplicationGenerate={(explanation) => handleXAIExplanation(key, explanation)}
                        />
                      ) : (
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">
                            {criteriaLabels[key as keyof typeof criteriaLabels]}
                          </Label>
                          <div className="flex items-center gap-2">
                            {suggestion && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                                IA suggère: {suggestion}
                              </Badge>
                            )}
                            <span className="text-lg font-bold text-blue-600">
                              {value}/10
                            </span>
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-gray-600 mb-2">
                        {descriptions[key as keyof typeof descriptions]}
                      </p>
                      
                      <Slider
                        value={[value]}
                        onValueChange={(newValue) => updateCriteria(key as keyof ProjectData['criteria'], newValue)}
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
                  );
                })}
              </div>

              <Button onClick={() => setActiveTab('ai-assistant')} className="w-full">
                Accéder à l'Assistant IA
              </Button>
            </TabsContent>

            {/* ONGLET ASSISTANT IA */}
            <TabsContent value="ai-assistant" className="space-y-4">
              <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <h3 className="font-medium text-purple-900">🚀 Générateur ELON Avancé</h3>
                    {showXAIMode && (
                      <Badge className="bg-purple-100 text-purple-700">
                        <Sparkles className="h-3 w-3 mr-1" />
                        XAI Activé
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-purple-700 mb-4">
                    Assistant IA pour générer des idées de projets contextualisées selon votre secteur d'activité
                  </p>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      L'algorithme ELON analyse les <strong>Équipements</strong>, <strong>Lieux</strong>, <strong>Opérations</strong> et la <strong>Nature humaine</strong> 
                      pour générer des idées de projets IA adaptées à votre secteur.
                      {showXAIMode && (
                        <span className="block mt-2 text-purple-700 font-medium">
                          ✨ Mode XAI : Explications contextuelles activées
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <div className="flex justify-center pt-4">
                <Button onClick={handleSubmit} size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {editingProject ? 'Mettre à jour le projet' : 'Créer le projet'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Boutons d'action */}
          <div className="flex justify-between mt-6 pt-4 border-t">
            {onCancelEdit && (
              <Button variant="outline" onClick={onCancelEdit}>
                Annuler
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                {editingProject ? 'Sauvegarder' : 'Créer le projet'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};