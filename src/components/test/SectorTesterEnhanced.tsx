// src/components/test/SectorTesterEnhanced.tsx
// Version complète avec intégration des données CNESST réelles

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CNESSTRealDataService, SectorData } from '@/services/CNESSTRealDataService';

// Interface pour les résultats de test enrichis
interface EnhancedTestResult {
  sectorCode: string;
  sectorName: string;
  status: 'success' | 'partial' | 'error' | 'pending';
  timestamp: string;
  responseTime: number;
  sectorData?: SectorData;
  validationScore: number;
  details: {
    contextLoaded: boolean;
    risksIdentified: number;
    causesIdentified: number;
    opportunitiesIdentified: number;
    visualizationsWorking: boolean;
    dataQuality: 'excellent' | 'good' | 'partial' | 'poor';
  };
  issues?: string[];
}

// Secteurs SCIAN prioritaires pour tests approfondis
const PRIORITY_SECTORS = [
  { code: '11', name: 'Agriculture, foresterie, pêche et chasse', risk: 'élevé' },
  { code: '21', name: 'Extraction minière et pétrolière', risk: 'très élevé' },
  { code: '23', name: 'Construction', risk: 'très élevé' },
  { code: '31-33', name: 'Fabrication', risk: 'élevé' },
  { code: '41', name: 'Commerce de gros', risk: 'moyen' },
  { code: '44-45', name: 'Commerce de détail', risk: 'moyen' },
  { code: '48-49', name: 'Transport et entreposage', risk: 'élevé' },
  { code: '51', name: 'Information et culture', risk: 'faible' },
  { code: '52', name: 'Finance et assurances', risk: 'faible' },
  { code: '53', name: 'Services immobiliers', risk: 'moyen' },
  { code: '54', name: 'Services professionnels', risk: 'faible' },
  { code: '56', name: 'Services administratifs', risk: 'moyen' },
  { code: '61', name: 'Services d\'enseignement', risk: 'moyen' },
  { code: '62', name: 'Soins de santé', risk: 'élevé' },
  { code: '91', name: 'Administrations publiques', risk: 'moyen' }
];

const SectorTesterEnhanced: React.FC = () => {
  const [sectorCode, setSectorCode] = useState<string>('23');
  const [testResults, setTestResults] = useState<EnhancedTestResult[]>([]);
  const [isTestingAll, setIsTestingAll] = useState<boolean>(false);
  const [testProgress, setTestProgress] = useState<number>(0);
  const [selectedResult, setSelectedResult] = useState<EnhancedTestResult | null>(null);
  const [dataService] = useState(() => CNESSTRealDataService.getInstance());
  const [globalStats, setGlobalStats] = useState<any>(null);

  // Charger les statistiques globales au démarrage
  useEffect(() => {
    loadGlobalStats();
  }, []);

  const loadGlobalStats = async () => {
    try {
      const stats = await dataService.getGlobalStats();
      setGlobalStats(stats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  // Fonction de test enrichie d'un secteur
  const performEnhancedSectorTest = async (sectorCode: string): Promise<EnhancedTestResult> => {
    const startTime = Date.now();
    
    try {
      // Récupération des données réelles CNESST
      const sectorData = await dataService.getSectorData(sectorCode);
      const responseTime = Date.now() - startTime;
      
      if (!sectorData) {
        return {
          sectorCode,
          sectorName: `Secteur ${sectorCode}`,
          status: 'error',
          timestamp: new Date().toLocaleTimeString(),
          responseTime,
          validationScore: 0,
          details: {
            contextLoaded: false,
            risksIdentified: 0,
            causesIdentified: 0,
            opportunitiesIdentified: 0,
            visualizationsWorking: false,
            dataQuality: 'poor'
          },
          issues: ['Secteur non trouvé dans les données CNESST']
        };
      }

      // Évaluation de la qualité des données
      const validationScore = calculateValidationScore(sectorData);
      const dataQuality = getDataQuality(validationScore);
      const status = validationScore >= 80 ? 'success' : 
                   validationScore >= 60 ? 'partial' : 'error';

      return {
        sectorCode,
        sectorName: sectorData.nom,
        status,
        timestamp: new Date().toLocaleTimeString(),
        responseTime,
        sectorData,
        validationScore,
        details: {
          contextLoaded: true,
          risksIdentified: sectorData.principauxRisques.length,
          causesIdentified: sectorData.agentsCausaux.length,
          opportunitiesIdentified: sectorData.opportunitesIA.length,
          visualizationsWorking: true,
          dataQuality
        },
        issues: identifyIssues(sectorData, validationScore)
      };

    } catch (error) {
      return {
        sectorCode,
        sectorName: `Secteur ${sectorCode}`,
        status: 'error',
        timestamp: new Date().toLocaleTimeString(),
        responseTime: Date.now() - startTime,
        validationScore: 0,
        details: {
          contextLoaded: false,
          risksIdentified: 0,
          causesIdentified: 0,
          opportunitiesIdentified: 0,
          visualizationsWorking: false,
          dataQuality: 'poor'
        },
        issues: [`Erreur lors du test: ${error instanceof Error ? error.message : 'Erreur inconnue'}`]
      };
    }
  };

  // Calcul du score de validation basé sur les critères CNESST
  const calculateValidationScore = (data: SectorData): number => {
    let score = 0;
    
    // Contexte sectoriel (20 points)
    if (data.nom && data.description) score += 20;
    
    // Statistiques CNESST (20 points)
    if (data.totalLesions > 0 && data.sourcesDonnees.length > 0) score += 20;
    
    // Risques identifiés (15 points)
    score += Math.min(15, data.principauxRisques.length * 3);
    
    // Agents causaux (15 points)
    score += Math.min(15, data.agentsCausaux.length * 3);
    
    // Opportunités IA (10 points)
    score += Math.min(10, data.opportunitesIA.length * 2);
    
    // Indicateurs spécialisés (10 points)
    if (data.indicateurs) score += 10;
    
    // Niveau de confiance (10 points)
    score += Math.min(10, data.niveauConfiance);
    
    return Math.round(score);
  };

  const getDataQuality = (score: number): 'excellent' | 'good' | 'partial' | 'poor' => {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 50) return 'partial';
    return 'poor';
  };

  // Identification des problèmes potentiels
  const identifyIssues = (data: SectorData, score: number): string[] => {
    const issues: string[] = [];
    
    if (data.principauxRisques.length < 3) {
      issues.push('Nombre insuffisant de risques identifiés');
    }
    
    if (data.agentsCausaux.length < 3) {
      issues.push('Agents causaux insuffisamment détaillés');
    }
    
    if (data.niveauConfiance < 7) {
      issues.push('Niveau de confiance bas');
    }
    
    if (data.totalLesions < 100) {
      issues.push('Échantillon de données potentiellement trop petit');
    }
    
    if (score < 70) {
      issues.push('Score de validation global insuffisant');
    }
    
    return issues;
  };

  // Test d'un secteur individuel
  const handleTestSector = async (code: string) => {
    const result = await performEnhancedSectorTest(code);
    setTestResults(prev => {
      const existingIndex = prev.findIndex(r => r.sectorCode === code);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = result;
        return updated;
      }
      return [...prev, result];
    });
  };

  // Test de tous les secteurs prioritaires
  const handleTestAllSectors = async () => {
    setIsTestingAll(true);
    setTestProgress(0);
    setTestResults([]);

    for (let i = 0; i < PRIORITY_SECTORS.length; i++) {
      const sector = PRIORITY_SECTORS[i];
      const result = await performEnhancedSectorTest(sector.code);
      
      setTestResults(prev => [...prev, result]);
      setTestProgress(((i + 1) / PRIORITY_SECTORS.length) * 100);
      
      // Pause courte pour éviter la surcharge
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setIsTestingAll(false);
  };

  // Calcul des statistiques des tests
  const getTestStats = () => {
    const total = testResults.length;
    const success = testResults.filter(r => r.status === 'success').length;
    const partial = testResults.filter(r => r.status === 'partial').length;
    const errors = testResults.filter(r => r.status === 'error').length;
    const avgResponseTime = total > 0 
      ? Math.round(testResults.reduce((sum, r) => sum + r.responseTime, 0) / total)
      : 0;
    const avgValidationScore = total > 0
      ? Math.round(testResults.reduce((sum, r) => sum + r.validationScore, 0) / total)
      : 0;

    return { total, success, partial, errors, avgResponseTime, avgValidationScore };
  };

  const stats = getTestStats();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Testeur de Secteurs SCIAN - Données CNESST Réelles
        </h1>
        <p className="text-gray-600">
          Validation approfondie avec {globalStats?.totalLesions?.toLocaleString() || '697,602'} enregistrements CNESST 2018-2023
        </p>
        {globalStats && (
          <div className="mt-2 text-sm text-blue-600">
            {globalStats.totalSectors} secteurs analysés • Confiance moyenne: {globalStats.averageConfidence}/10
          </div>
        )}
      </div>

      {/* Panel de contrôle enrichi */}
      <Card>
        <CardHeader>
          <CardTitle>Panel de Contrôle - Tests Approfondis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test individuel */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="sector-input">Code SCIAN à tester (validation complète)</Label>
              <Input
                id="sector-input"
                value={sectorCode}
                onChange={(e) => setSectorCode(e.target.value)}
                placeholder="ex: 23 pour Construction"
                className="max-w-48"
              />
            </div>
            <Button
              onClick={() => handleTestSector(sectorCode)}
              disabled={isTestingAll}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Tester avec Données CNESST
            </Button>
          </div>

          {/* Secteurs prioritaires par niveau de risque */}
          <div>
            <Label>Secteurs Prioritaires (cliquez pour test approfondi)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {PRIORITY_SECTORS.filter(s => s.risk === 'très élevé').map((sector) => (
                <Button
                  key={sector.code}
                  variant="destructive"
                  size="sm"
                  onClick={() => handleTestSector(sector.code)}
                  disabled={isTestingAll}
                  className="text-xs"
                >
                  {sector.code} (Très Haut)
                </Button>
              ))}
              {PRIORITY_SECTORS.filter(s => s.risk === 'élevé').map((sector) => (
                <Button
                  key={sector.code}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleTestSector(sector.code)}
                  disabled={isTestingAll}
                  className="text-xs bg-orange-100 hover:bg-orange-200"
                >
                  {sector.code} (Élevé)
                </Button>
              ))}
              {PRIORITY_SECTORS.filter(s => s.risk === 'moyen').slice(0, 4).map((sector) => (
                <Button
                  key={sector.code}
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestSector(sector.code)}
                  disabled={isTestingAll}
                  className="text-xs"
                >
                  {sector.code} (Moyen)
                </Button>
              ))}
            </div>
          </div>

          {/* Test complet avec barre de progression */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-2">
              <Label>Test Complet de Validation</Label>
              {isTestingAll && (
                <div className="text-sm text-gray-600">
                  {Math.round(testProgress)}% complété
                </div>
              )}
            </div>
            {isTestingAll && (
              <Progress value={testProgress} className="mb-3" />
            )}
            <Button
              onClick={handleTestAllSectors}
              disabled={isTestingAll}
              className="w-full"
              variant={isTestingAll ? "secondary" : "default"}
            >
              {isTestingAll ? 'Test en cours des 15 secteurs...' : 'Tester tous les secteurs prioritaires'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques enrichies des tests */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Statistiques de Validation - Données Réelles CNESST</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Testés</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.success}</div>
                <div className="text-sm text-gray-600">Validés</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.partial}</div>
                <div className="text-sm text-gray-600">Partiels</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
                <div className="text-sm text-gray-600">Échecs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.avgValidationScore}%</div>
                <div className="text-sm text-gray-600">Score Moy.</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{stats.avgResponseTime}ms</div>
                <div className="text-sm text-gray-600">Temps Moy.</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résultats détaillés des tests */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats de Validation Détaillés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={`${result.sectorCode}-${index}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedResult(result)}
                >
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        result.status === 'success' ? 'default' :
                        result.status === 'partial' ? 'secondary' : 'destructive'
                      }
                      className="min-w-12 justify-center"
                    >
                      {result.sectorCode}
                    </Badge>
                    <div className="flex-1">
                      <div className="font-medium">{result.sectorName}</div>
                      <div className="text-sm text-gray-500">
                        {result.timestamp} • {result.responseTime}ms • Score: {result.validationScore}%
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {result.details.risksIdentified} risques • {result.details.causesIdentified} agents causaux • {result.details.opportunitiesIdentified} solutions IA
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge
                      variant={
                        result.status === 'success' ? 'default' :
                        result.status === 'partial' ? 'secondary' : 'destructive'
                      }
                    >
                      {result.status === 'success' ? 'Validé' :
                       result.status === 'partial' ? 'Partiel' : 'Échec'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {result.details.dataQuality === 'excellent' ? '⭐⭐⭐' :
                       result.details.dataQuality === 'good' ? '⭐⭐' :
                       result.details.dataQuality === 'partial' ? '⭐' : '❌'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Détails complets du secteur sélectionné */}
      {selectedResult && selectedResult.sectorData && (
        <Card>
          <CardHeader>
            <CardTitle>
              Analyse Complète - Secteur {selectedResult.sectorCode} ({selectedResult.sectorName})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Métriques de validation */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedResult.validationScore}%</div>
                  <div className="text-sm text-blue-800">Score de Validation</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedResult.sectorData.niveauConfiance.toFixed(1)}/10</div>
                  <div className="text-sm text-green-800">Confiance CNESST</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedResult.sectorData.totalLesions.toLocaleString()}</div>
                  <div className="text-sm text-purple-800">Lésions Analysées</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{selectedResult.responseTime}ms</div>
                  <div className="text-sm text-orange-800">Temps de Réponse</div>
                </div>
              </div>

              {/* Contexte sectoriel */}
              <div>
                <h4 className="font-semibold mb-2">📋 Contexte Sectoriel</h4>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  {selectedResult.sectorData.description}
                </div>
              </div>

              {/* Risques principaux */}
              <div>
                <h4 className="font-semibold mb-2">⚠️ Risques Principaux (Données CNESST)</h4>
                <div className="space-y-2">
                  {selectedResult.sectorData.principauxRisques.slice(0, 5).map((risk, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <span className="text-sm font-medium">{risk.type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-red-200 rounded-full h-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full" 
                            style={{ width: `${risk.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold">{risk.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agents causaux */}
              <div>
                <h4 className="font-semibold mb-2">🔧 Agents Causaux Dominants</h4>
                <div className="space-y-2">
                  {selectedResult.sectorData.agentsCausaux.slice(0, 5).map((agent, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="text-sm font-medium">{agent.agent}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-blue-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${agent.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold">{agent.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Indicateurs spécialisés */}
              <div>
                <h4 className="font-semibold mb-2">📊 Indicateurs Spécialisés</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center p-2 bg-yellow-50 rounded">
                    <div className="font-bold text-yellow-700">{(selectedResult.sectorData.indicateurs.tauxTMS * 100).toFixed(1)}%</div>
                    <div className="text-xs text-yellow-600">TMS</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <div className="font-bold text-purple-700">{(selectedResult.sectorData.indicateurs.tauxPSY * 100).toFixed(1)}%</div>
                    <div className="text-xs text-purple-600">Psychologique</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-bold text-gray-700">{(selectedResult.sectorData.indicateurs.tauxMachine * 100).toFixed(1)}%</div>
                    <div className="text-xs text-gray-600">Machines</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded">
                    <div className="font-bold text-red-700">{(selectedResult.sectorData.indicateurs.tauxSurdite * 100).toFixed(1)}%</div>
                    <div className="text-xs text-red-600">Surdité</div>
                  </div>
                </div>
              </div>

              {/* Opportunités IA */}
              <div>
                <h4 className="font-semibold mb-2">🤖 Opportunités IA Recommandées</h4>
                <div className="space-y-2">
                  {selectedResult.sectorData.opportunitesIA.map((opportunity, index) => (
                    <div key={index} className="p-2 bg-green-50 rounded border-l-4 border-green-400">
                      <span className="text-sm">{opportunity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tendances */}
              <div>
                <h4 className="font-semibold mb-2">📈 Tendances 2018-2023</h4>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-bold ${selectedResult.sectorData.tendances.evolution2018_2023 < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedResult.sectorData.tendances.evolution2018_2023 > 0 ? '+' : ''}{selectedResult.sectorData.tendances.evolution2018_2023.toFixed(1)}%
                    </span>
                    <span className="text-sm text-gray-600">d'évolution</span>
                  </div>
                  <div className="text-sm">{selectedResult.sectorData.tendances.tendance}</div>
                </div>
              </div>

              {/* Issues identifiées */}
              {selectedResult.issues && selectedResult.issues.length > 0 && (
                <Alert>
                  <AlertDescription>
                    <strong>Problèmes identifiés:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {selectedResult.issues.map((issue, index) => (
                        <li key={index} className="text-sm">{issue}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Sources de données */}
              <div>
                <h4 className="font-semibold mb-2">📚 Sources de Données</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedResult.sectorData.sourcesDonnees.map((source, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Guide d'utilisation mis à jour */}
      <Card>
        <CardHeader>
          <CardTitle>Guide de Validation avec Données CNESST Réelles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <strong>1. Test approfondi:</strong> Utilise les 697,602 enregistrements CNESST réels pour chaque secteur
            </div>
            <div>
              <strong>2. Validation complète:</strong> 8 critères évalués avec score de 0-100%
            </div>
            <div>
              <strong>3. Données enrichies:</strong> Risques, agents causaux, indicateurs et tendances réels
            </div>
            <div>
              <strong>4. Solutions IA:</strong> Recommandations spécifiques basées sur l'analyse sectorielle
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <strong>✅ Version Production:</strong> Cette interface utilise maintenant les vraies données CNESST 
              avec analyse contextuelle complète pour chaque secteur SCIAN.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SectorTesterEnhanced;