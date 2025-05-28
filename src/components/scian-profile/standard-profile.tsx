
import React, { useState } from 'react';
import { Building2, Users, Shield, AlertTriangle, TrendingUp, FileText, Settings, Target, Brain, Lightbulb, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { SCIAN_SECTORS, calculateSectorPriorityScore, getPriorityLevel, getPriorityText, getPriorityColor } from '@/data/scian-sectors';
import { useAIAssistant } from '@/hooks/use-ai-assistant';
import LLMSelector, { LLMProvider } from '@/components/ai-assistant/llm-selector';

const StandardProfile = () => {
  const [selectedSector, setSelectedSector] = useState(SCIAN_SECTORS[0]);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [generatedProject, setGeneratedProject] = useState('');
  const [selectedLLM, setSelectedLLM] = useState<LLMProvider>('claude');
  const { generateContent, analyzeContent, isLoading } = useAIAssistant();
  
  const priorityScore = calculateSectorPriorityScore(selectedSector);
  const priorityLevel = getPriorityLevel(priorityScore);
  const priorityColor = getPriorityColor(priorityLevel);

  // Cas d'usage sectoriels détaillés
  const getSectorUseCases = (sectorId: string) => {
    const useCases = {
      "23": [ // Construction
        {
          title: "Détection automatique des EPI",
          description: "Caméras intelligentes pour vérifier le port des équipements de protection",
          aiTech: "Vision par ordinateur",
          impact: "Réduction de 40% des accidents liés aux EPI",
          implementation: "2-3 mois"
        },
        {
          title: "Surveillance des zones dangereuses",
          description: "Système d'alerte automatique pour les espaces confinés et zones à risque",
          aiTech: "IoT + Machine Learning",
          impact: "Prévention des accidents mortels",
          implementation: "4-6 mois"
        },
        {
          title: "Prédiction des pannes d'équipement",
          description: "Maintenance prédictive des grues et équipements lourds",
          aiTech: "Analyse prédictive",
          impact: "Réduction de 60% des pannes critiques",
          implementation: "6-8 mois"
        }
      ],
      "31-33": [ // Fabrication
        {
          title: "Surveillance des machines automatisée",
          description: "Détection précoce des anomalies sur les chaînes de production",
          aiTech: "Capteurs IoT + IA",
          impact: "Réduction de 50% des arrêts non planifiés",
          implementation: "3-4 mois"
        },
        {
          title: "Analyse des gestes ergonomiques",
          description: "Évaluation en temps réel des postures de travail",
          aiTech: "Vision par ordinateur",
          impact: "Diminution de 35% des TMS",
          implementation: "2-3 mois"
        },
        {
          title: "Contrôle qualité intelligent",
          description: "Détection automatique des défauts et risques produits",
          aiTech: "Deep Learning",
          impact: "Amélioration de 90% de la détection",
          implementation: "4-5 mois"
        }
      ],
      "21": [ // Extraction minière
        {
          title: "Surveillance environnementale 24/7",
          description: "Monitoring continu des gaz et conditions atmosphériques",
          aiTech: "Capteurs + Analyse prédictive",
          impact: "Prévention totale des intoxications",
          implementation: "6-8 mois"
        },
        {
          title: "Détection précoce d'éboulements",
          description: "Système d'alerte basé sur l'analyse géologique en temps réel",
          aiTech: "Capteurs sismiques + IA",
          impact: "Zéro accident lié aux éboulements",
          implementation: "8-12 mois"
        },
        {
          title: "Optimisation des parcours sécuritaires",
          description: "Navigation intelligente dans les mines souterraines",
          aiTech: "GPS + Machine Learning",
          impact: "Réduction de 70% des incidents de déplacement",
          implementation: "4-6 mois"
        }
      ]
    };
    
    return useCases[sectorId as keyof typeof useCases] || [];
  };

  const generateProjectIdea = async () => {
    const criteriaText = Object.entries(selectedSector.riskFactors)
      .map(([key, value]) => `${key}: ${value}/5`)
      .join(', ');

    const context = `Secteur SCIAN: ${selectedSector.id} - ${selectedSector.name}. Statistiques: ${selectedSector.statistics?.accidentCount || 0} accidents, taux de mortalité: ${selectedSector.statistics?.mortalityRate || 0}`;
    
    const prompt = `En tant qu'expert en IA-SST, génère une description détaillée d'un projet innovant d'intelligence artificielle pour améliorer la sécurité au travail dans le secteur ${selectedSector.name}. 

Critères du secteur: ${criteriaText}

Le projet doit être:
- Concret et réalisable
- Adapté aux risques spécifiques de ce secteur
- Innovant en termes de technologie IA
- Mesurable en termes d'impact SST

Structure ta réponse avec:
1. Nom du projet
2. Description technique (150-200 mots)
3. Technologies IA utilisées
4. Impact attendu sur la sécurité
5. Délai d'implémentation estimé
6. Budget approximatif`;

    try {
      let result = null;
      
      if (selectedLLM === 'openai') {
        result = await generateContent({
          type: 'project_description',
          prompt,
          context
        });
      } else {
        result = await analyzeContent({
          analysisType: 'questionnaire_analysis',
          text: prompt,
          context
        });
      }
      
      if (result) {
        setGeneratedProject(result);
        setShowAIGenerator(true);
      }
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
    }
  };

  const currentUseCases = getSectorUseCases(selectedSector.id);

  return (
    <div className="space-y-6">
      {/* Sélecteur de secteur */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Secteur d'activité SCIAN
          </CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={selectedSector.id}
            onChange={(e) => {
              const sector = SCIAN_SECTORS.find(s => s.id === e.target.value);
              if (sector) setSelectedSector(sector);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SCIAN_SECTORS.map((sector) => (
              <option key={sector.id} value={sector.id}>
                {sector.id} - {sector.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-600">{selectedSector.description}</p>
        </CardContent>
      </Card>

      {/* Vue d'ensemble du profil */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score de Priorité IA</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{priorityScore}/5</div>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${priorityColor}`}>
              {getPriorityText(priorityLevel)}
            </div>
            <Progress value={(priorityScore / 5) * 100} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accidents (2023)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedSector.statistics?.accidentCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Taux: {selectedSector.statistics?.mortalityRate || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potentiel IA</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedSector.riskFactors.aiPreventivePotential}/5</div>
            <p className="text-xs text-muted-foreground">
              Prévention par IA
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Générateur de projets IA */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Générateur de Projets IA-SST
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <LLMSelector
              selectedLLM={selectedLLM}
              onLLMChange={setSelectedLLM}
              onGenerate={generateProjectIdea}
              isLoading={isLoading}
            />
            
            {showAIGenerator && generatedProject && (
              <div className="mt-4 p-4 bg-white rounded-lg border">
                <h4 className="font-semibold text-gray-800 mb-2">💡 Projet Généré par IA</h4>
                <Textarea
                  value={generatedProject}
                  onChange={(e) => setGeneratedProject(e.target.value)}
                  className="min-h-[200px]"
                  placeholder="Le projet généré apparaîtra ici..."
                />
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={generateProjectIdea} disabled={isLoading}>
                    🔄 Régénérer
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAIGenerator(false)}>
                    Fermer
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cas d'usage sectoriels */}
      {currentUseCases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Cas d'Usage IA Sectoriels - {selectedSector.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentUseCases.map((useCase, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="flex items-start gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <h4 className="font-semibold text-gray-800">{useCase.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{useCase.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {useCase.aiTech}
                      </Badge>
                    </div>
                    <div className="text-xs text-green-700 font-medium">
                      📈 {useCase.impact}
                    </div>
                    <div className="text-xs text-blue-700">
                      ⏱️ Implémentation: {useCase.implementation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Facteurs de risque détaillés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Analyse des Facteurs de Risque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(selectedSector.riskFactors).map(([key, value]) => {
              const labels = {
                mortalityImpact: 'Impact sur la mortalité',
                sectorPrevalence: 'Prévalence du secteur',
                aiPreventivePotential: 'Potentiel préventif IA',
                legislationCompliance: 'Conformité législative',
                dataAvailability: 'Disponibilité des données',
                implementationDelay: 'Délai d\'implémentation',
                conformiteLSST: 'Conformité LSST'
              };
              
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{labels[key as keyof typeof labels]}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={(value / 5) * 100} className="w-24" />
                    <span className="text-sm font-semibold w-8">{value}/5</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques du secteur */}
      {selectedSector.statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Principales Causes d'Accidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedSector.statistics.accidentCauses?.map((cause, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <span className="text-sm">{cause}</span>
                    <Badge variant="secondary">{index + 1}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Zones de Prévention Clés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedSector.statistics.keyPreventionAreas?.map((area, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-md">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{area}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recommandations IA enrichies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Recommandations d'Implémentation IA Avancées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {priorityLevel === 'high' && (
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  🚀 Secteur Hautement Prioritaire - Plan d'Action Immédiat
                </h4>
                <p className="text-sm text-green-700 mb-4">
                  Ce secteur présente un excellent potentiel pour l'implémentation de solutions d'IA en SST avec un ROI élevé.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-green-800 mb-2">Phase 1 (0-3 mois)</h5>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Audit technologique et identification des quick wins</li>
                      <li>• Formation de l'équipe de pilotage IA-SST</li>
                      <li>• Sélection du premier cas d'usage prioritaire</li>
                      <li>• Budget alloué: 50-100k$ pour POC</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-green-800 mb-2">Phase 2 (3-12 mois)</h5>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Déploiement du projet pilote</li>
                      <li>• Mesure des KPI sécurité et ROI</li>
                      <li>• Extension à d'autres sites/équipes</li>
                      <li>• Budget: 200-500k$ pour déploiement</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-green-100 rounded-md">
                  <h6 className="font-medium text-green-800 mb-1">🎯 Objectifs Mesurables</h6>
                  <div className="text-sm text-green-700">
                    <span className="font-medium">Réduction attendue:</span> 30-50% des incidents, ROI de 300-500% sur 2 ans
                  </div>
                </div>
              </div>
            )}
            
            {priorityLevel === 'medium' && (
              <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                  ⚡ Secteur à Potentiel Modéré - Approche Progressive
                </h4>
                <p className="text-sm text-yellow-700 mb-4">
                  Des opportunités existent mais nécessitent une analyse coûts-bénéfices approfondie.
                </p>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-yellow-800 mb-2">Étapes Recommandées</h5>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Analyse de faisabilité (2-3 mois, 20-50k$)</li>
                      <li>• Benchmark secteur et retours d'expérience</li>
                      <li>• Test sur un périmètre restreint</li>
                      <li>• Évaluation ROI avant extension</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-yellow-100 rounded-md">
                    <h6 className="font-medium text-yellow-800 mb-1">📊 Indicateurs de Réussite</h6>
                    <div className="text-sm text-yellow-700">
                      ROI positif attendu après 18-24 mois, réduction d'incidents de 15-30%
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {priorityLevel === 'low' && (
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                  🔍 Secteur Nécessitant Plus d'Analyse - Préparation à Long Terme
                </h4>
                <p className="text-sm text-red-700 mb-4">
                  L'implémentation d'IA nécessite des prérequis importants dans ce secteur.
                </p>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-red-800 mb-2">Prérequis à Développer</h5>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Digitalisation des processus SST existants</li>
                      <li>• Formation des équipes aux technologies</li>
                      <li>• Amélioration de la collecte de données</li>
                      <li>• Renforcement de la culture sécurité</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-red-800 mb-2">Horizon 2-3 ans</h5>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Solutions sur mesure avec partenaires tech</li>
                      <li>• Approche graduelle par étapes</li>
                      <li>• Budget préparatoire: 100-200k$ sur 2 ans</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StandardProfile;
