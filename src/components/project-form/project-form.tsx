// src/components/project-form/project-form.tsx
// VERSION COMPLÈTEMENT CORRIGÉE - Interface harmonisée + Import Windows

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useAIAssistant } from '@/hooks/use-ai-assistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sectorsData } from '@/data/data_sectors'; // ✅ CORRIGÉ pour Windows
import { 
  Lightbulb, 
  Save, 
  Wand2, 
  CheckCircle, 
  AlertCircle,
  Brain,
  Target,
  Zap
} from 'lucide-react';

// ✅ INTERFACE CORRIGÉE - Utilise scores au lieu de criteria
interface ProjectFormData {
  id: string;
  name: string;
  description: string;
  sector: string;
  scores: {  // ✅ CORRIGÉ: criteria → scores
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
}

interface ProjectFormProps {
  onAddProject: (project: ProjectFormData) => void;
  editingProject?: ProjectFormData | null;
  onUpdateProject?: (project: ProjectFormData) => void;
  onCancelEdit?: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  onAddProject,
  editingProject,
  onUpdateProject,
  onCancelEdit
}) => {
  const { toast } = useToast();
  const { generateContent, analyzeContent, isLoading, result } = useAIAssistant();

  // ✅ STATE CORRIGÉ avec scores
  const [formData, setFormData] = useState<ProjectFormData>({
    id: '',
    name: '',
    description: '',
    sector: '',
    scores: {  // ✅ CORRIGÉ: criteria → scores
      technicalFeasibility: 5,
      businessValue: 5,
      riskReduction: 5,
      implementationCost: 5,
      timeToMarket: 5,
      stakeholderSupport: 5,
      regulatoryCompliance: 5
    },
    score: 5.0,
    priority: 'medium'
  });

  const [generatedIdeas, setGeneratedIdeas] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [autoScoreSuggestions, setAutoScoreSuggestions] = useState<Record<string, number>>({});
  const [showAutoScoreAlert, setShowAutoScoreAlert] = useState(false);
  const [autoScoreConfidence, setAutoScoreConfidence] = useState(0);

  // ✅ CALCUL DU SCORE CORRIGÉ
  const calculateScore = (scores: typeof formData.scores): number => {
    const values = Object.values(scores);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.round(average * 100) / 100;
  };

  // ✅ CALCUL DE PRIORITÉ CORRIGÉ
  const calculatePriority = (score: number): string => {
    if (score >= 7) return 'high';
    if (score >= 5) return 'medium';
    return 'low';
  };

  // ✅ MISE À JOUR DES SCORES
  const updateScore = (scoreKey: keyof typeof formData.scores, value: number) => {
    const newScores = { ...formData.scores, [scoreKey]: value };
    const newScore = calculateScore(newScores);
    const newPriority = calculatePriority(newScore);

    setFormData(prev => ({
      ...prev,
      scores: newScores,  // ✅ CORRIGÉ: criteria → scores
      score: newScore,
      priority: newPriority
    }));
  };

  // ✅ GÉNÉRATION D'IDÉES CORRIGÉE
  const handleGenerateIdeas = async () => {
    if (!formData.sector) {
      toast({
        title: "Secteur requis",
        description: "Veuillez sélectionner un secteur d'activité d'abord.",
        variant: "destructive"
      });
      return;
    }

    const selectedSector = sectorsData.find(s => s.value === formData.sector);
    const prompt = `Générer une idée de projet IA-SST pour le secteur ${formData.sector} - ${selectedSector?.label}. Context: ${formData.description || 'Aucune description fournie'}`;

    try {
      const ideas = await generateContent(prompt, 'project_suggestions', `Secteur SCIAN: ${formData.sector}`);
      setGeneratedIdeas(ideas || '');
      
      toast({
        title: "Idées générées !",
        description: "Les suggestions d'idées IA-SST ont été générées avec succès.",
        duration: 3000
      });
    } catch (error) {
      console.error('Erreur génération idées:', error);
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer les idées. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  // ✅ AUTO-ÉVALUATION CORRIGÉE
  const handleAutoEvaluation = async () => {
    if (!formData.name || !formData.description) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir le nom et la description du projet d'abord.",
        variant: "destructive"
      });
      return;
    }

    setIsEvaluating(true);

    try {
      const projectDescription = `
        Nom: ${formData.name}
        Description: ${formData.description}
        Secteur: ${sectorsData.find(s => s.value === formData.sector)?.label || formData.sector}
      `;

      const result = await analyzeContent({
        analysisType: 'project_ideas',
        text: projectDescription,
        context: 'Évaluer ce projet selon les 7 critères sur une échelle de 1 à 10.'
      });

      // ✅ EXTRACTION DES SCORES CORRIGÉE
      const scores = extractScoresFromResponse(result || '');
      
      if (Object.keys(scores).length > 0) {
        setAutoScoreSuggestions(scores);
        setShowAutoScoreAlert(true);
        setAutoScoreConfidence(8);
      } else {
        throw new Error("Format de réponse invalide");
      }
    } catch (error) {
      console.error('❌ Erreur auto-évaluation:', error);
      toast({
        title: "Auto-évaluation en mode démo",
        description: "Scores suggérés générés localement.",
        duration: 3000
      });
      
      // Fallback avec scores par défaut
      setAutoScoreSuggestions({
        technicalFeasibility: 7,
        businessValue: 8,
        riskReduction: 9,
        implementationCost: 6,
        timeToMarket: 5,
        stakeholderSupport: 7,
        regulatoryCompliance: 8
      });
      setShowAutoScoreAlert(true);
      setAutoScoreConfidence(6);
    } finally {
      setIsEvaluating(false);
    }
  };

  // ✅ FONCTION D'EXTRACTION DES SCORES
  const extractScoresFromResponse = (response: string): Record<string, number> => {
    try {
      const scores: Record<string, number> = {};
      
      const scorePatterns = [
        { key: 'technicalFeasibility', patterns: ['faisabilité technique', 'technical feasibility'] },
        { key: 'businessValue', patterns: ['valeur commerciale', 'business value', 'valeur d\'affaires'] },
        { key: 'riskReduction', patterns: ['réduction des risques', 'risk reduction'] },
        { key: 'implementationCost', patterns: ['coût d\'implémentation', 'implementation cost'] },
        { key: 'timeToMarket', patterns: ['temps de mise en marché', 'time to market'] },
        { key: 'stakeholderSupport', patterns: ['acceptation utilisateur', 'stakeholder support'] },
        { key: 'regulatoryCompliance', patterns: ['conformité réglementaire', 'regulatory compliance'] }
      ];
      
      scorePatterns.forEach(({ key, patterns }) => {
        patterns.some(pattern => {
          const regex = new RegExp(`${pattern}\\s*:?\\s*(\\d+)[/\\s]*(10|dix)`, 'i');
          const match = response.match(regex);
          
          if (match && match[1]) {
            scores[key] = parseInt(match[1], 10);
            return true;
          }
          return false;
        });
      });
      
      return scores;
    } catch (error) {
      console.error('❌ Erreur extraction scores:', error);
      return {};
    }
  };

  // ✅ APPLICATION DES SCORES SUGGÉRÉS
  const applyAutoScores = () => {
    const newScores = { ...formData.scores, ...autoScoreSuggestions };
    const newScore = calculateScore(newScores);
    const newPriority = calculatePriority(newScore);

    setFormData(prev => ({
      ...prev,
      scores: newScores,  // ✅ CORRIGÉ
      score: newScore,
      priority: newPriority
    }));

    setShowAutoScoreAlert(false);
    toast({
      title: "Scores appliqués !",
      description: `Score total mis à jour : ${newScore}/10`,
      duration: 3000
    });
  };

  // ✅ SOUMISSION DU FORMULAIRE CORRIGÉE
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez entrer un nom pour le projet.",
        variant: "destructive"
      });
      return;
    }

    const projectData: ProjectFormData = {
      ...formData,
      id: editingProject?.id || `project_${Date.now()}`,
    };

    if (editingProject && onUpdateProject) {
      onUpdateProject(projectData);
    } else {
      onAddProject(projectData);  // ✅ CORRIGÉ: envoie scores au lieu de criteria
    }

    // Reset form
    if (!editingProject) {
      setFormData({
        id: '',
        name: '',
        description: '',
        sector: '',
        scores: {  // ✅ CORRIGÉ
          technicalFeasibility: 5,
          businessValue: 5,
          riskReduction: 5,
          implementationCost: 5,
          timeToMarket: 5,
          stakeholderSupport: 5,
          regulatoryCompliance: 5
        },
        score: 5.0,
        priority: 'medium'
      });
      setGeneratedIdeas('');
    }
  };

  // ✅ INITIALISATION AVEC PROJET EN ÉDITION
  useEffect(() => {
    if (editingProject) {
      setFormData(editingProject);
    }
  }, [editingProject]);

  // ✅ RENDU DU COMPOSANT - Interface conservée
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            {editingProject ? 'Modifier le projet' : 'Nouveau projet IA-SST'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Informations de base</TabsTrigger>
                <TabsTrigger value="criteria">Critères d'évaluation</TabsTrigger>
                <TabsTrigger value="assistant">Assistant IA</TabsTrigger>
              </TabsList>

              {/* TAB 1: Informations de base */}
              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom du projet *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Système de détection IA des risques de chute"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sector">Secteur d'activité</Label>
                    <select
                      id="sector"
                      value={formData.sector}
                      onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Sélectionner un secteur</option>
                      {sectorsData.map((sector) => (
                        <option key={sector.value} value={sector.value}>
                          {sector.value} - {sector.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description du projet</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez les objectifs, la technologie envisagée, et l'impact attendu..."
                    rows={4}
                  />
                </div>
              </TabsContent>

              {/* TAB 2: Critères d'évaluation */}
              <TabsContent value="criteria" className="space-y-6">
                {showAutoScoreAlert && (
                  <Alert>
                    <Brain className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                      <span>
                        IA suggère des scores basés sur votre description (Confiance: {autoScoreConfidence}/10)
                      </span>
                      <div className="flex gap-2">
                        <Button onClick={applyAutoScores} size="sm">
                          Appliquer
                        </Button>
                        <Button 
                          onClick={() => setShowAutoScoreAlert(false)} 
                          variant="outline" 
                          size="sm"
                        >
                          Ignorer
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{formData.score}/10</div>
                  <div className="text-sm text-gray-600">Score total</div>
                  <Badge variant={
                    formData.priority === 'high' ? 'default' :
                    formData.priority === 'medium' ? 'secondary' : 'outline'
                  }>
                    Priorité {formData.priority === 'high' ? 'Haute' : 
                             formData.priority === 'medium' ? 'Moyenne' : 'Faible'}
                  </Badge>
                </div>

                <div className="space-y-6">
                  {/* ✅ SLIDERS CORRIGÉS avec scores */}
                  {Object.entries(formData.scores).map(([key, value]) => {
                    const labels: Record<string, string> = {
                      technicalFeasibility: 'Faisabilité technique',
                      businessValue: 'Valeur d\'affaires',
                      riskReduction: 'Réduction des risques',
                      implementationCost: 'Coût d\'implémentation',
                      timeToMarket: 'Temps de mise en marché',
                      stakeholderSupport: 'Support des parties prenantes',
                      regulatoryCompliance: 'Conformité réglementaire'
                    };

                    const suggestions = autoScoreSuggestions[key];

                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>{labels[key]}</Label>
                          <div className="flex items-center gap-2">
                            {suggestions && (
                              <Badge variant="outline" className="text-xs">
                                IA suggère: {suggestions}
                              </Badge>
                            )}
                            <span className="text-sm font-medium">{value}/10</span>
                          </div>
                        </div>
                        <Slider
                          value={[value]}
                          onValueChange={(values) => updateScore(key as keyof typeof formData.scores, values[0])}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleAutoEvaluation}
                    disabled={isEvaluating || !formData.name || !formData.description}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Wand2 className={`h-4 w-4 ${isEvaluating ? 'animate-spin' : ''}`} />
                    {isEvaluating ? 'Évaluation en cours...' : 'Évaluer automatiquement'}
                  </Button>
                </div>
              </TabsContent>

              {/* TAB 3: Assistant IA */}
              <TabsContent value="assistant" className="space-y-4">
                <div className="flex justify-center">
                  <Button
                    onClick={handleGenerateIdeas}
                    disabled={isLoading || !formData.sector}
                    className="flex items-center gap-2"
                  >
                    <Lightbulb className={`h-4 w-4 ${isLoading ? 'animate-pulse' : ''}`} />
                    {isLoading ? 'Génération en cours...' : 'Générer des idées contextualisées'}
                  </Button>
                </div>

                {(generatedIdeas || result) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        Idées générées par IA
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                          {generatedIdeas || result}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            {/* Boutons d'action */}
            <div className="flex justify-between">
              <div>
                {editingProject && onCancelEdit && (
                  <Button type="button" variant="outline" onClick={onCancelEdit}>
                    Annuler
                  </Button>
                )}
              </div>
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {editingProject ? 'Mettre à jour' : 'Sauvegarder le projet'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectForm;
export { ProjectForm };