// src/components/test/SectorTester.tsx
// Version simplifiée pour tests de secteurs SCIAN sans dépendances complexes

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

// Interface pour les résultats de test
interface TestResult {
  sector: string;
  sectorName: string;
  status: 'success' | 'partial' | 'error';
  timestamp: string;
  responseTime: number;
  message?: string;
}

// Secteurs SCIAN prédéfinis pour les tests
const PREDEFINED_SECTORS = [
  { code: '11', name: 'Agriculture, foresterie, pêche et chasse' },
  { code: '21', name: 'Extraction minière et pétrolière' },
  { code: '23', name: 'Construction' },
  { code: '31-33', name: 'Fabrication' },
  { code: '41', name: 'Commerce de gros' },
  { code: '44-45', name: 'Commerce de détail' },
  { code: '48-49', name: 'Transport et entreposage' },
  { code: '51', name: 'Information et culture' },
  { code: '52', name: 'Finance et assurances' },
  { code: '53', name: 'Services immobiliers' },
  { code: '54', name: 'Services professionnels' },
  { code: '56', name: 'Services administratifs' },
  { code: '61', name: 'Services d\'enseignement' },
  { code: '62', name: 'Soins de santé' },
  { code: '91', name: 'Administrations publiques' }
];

const SectorTester: React.FC = () => {
  const [sectorCode, setSectorCode] = useState<string>('23');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTestingAll, setIsTestingAll] = useState<boolean>(false);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);

  // Fonction pour obtenir le nom d'un secteur
  const getSectorName = (code: string): string => {
    const sector = PREDEFINED_SECTORS.find(s => s.code === code);
    return sector?.name || `Secteur ${code}`;
  };

  // Simulation de test pour un secteur (en attendant l'intégration réelle)
  const simulateSectorTest = (sectorCode: string): Promise<TestResult> => {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      setTimeout(() => {
        const responseTime = Date.now() - startTime;
        const result: TestResult = {
          sector: sectorCode,
          sectorName: getSectorName(sectorCode),
          status: Math.random() > 0.1 ? 'success' : 'partial', // 90% de succès simulé
          timestamp: new Date().toLocaleTimeString(),
          responseTime,
          message: `Test simulé pour le secteur ${sectorCode}`
        };
        resolve(result);
      }, Math.random() * 1000 + 500); // 500ms à 1.5s de délai
    });
  };

  // Tester un secteur individuel
  const handleTestSector = async (code: string) => {
    try {
      const result = await simulateSectorTest(code);
      setTestResults(prev => {
        const existingIndex = prev.findIndex(r => r.sector === code);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = result;
          return updated;
        }
        return [...prev, result];
      });
    } catch (error) {
      console.error('Erreur lors du test du secteur:', error);
    }
  };

  // Tester tous les secteurs
  const handleTestAllSectors = async () => {
    setIsTestingAll(true);
    setTestResults([]);
    
    for (const sector of PREDEFINED_SECTORS) {
      await handleTestSector(sector.code);
    }
    
    setIsTestingAll(false);
  };

  // Calculer les statistiques des tests
  const getTestStats = () => {
    const total = testResults.length;
    const success = testResults.filter(r => r.status === 'success').length;
    const partial = testResults.filter(r => r.status === 'partial').length;
    const errors = testResults.filter(r => r.status === 'error').length;
    const avgResponseTime = total > 0 
      ? Math.round(testResults.reduce((sum, r) => sum + r.responseTime, 0) / total)
      : 0;

    return { total, success, partial, errors, avgResponseTime };
  };

  const stats = getTestStats();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Testeur de Secteurs SCIAN
        </h1>
        <p className="text-gray-600">
          Validation du comportement avec les données CNESST réelles (697,602 enregistrements)
        </p>
      </div>

      {/* Panel de contrôle */}
      <Card>
        <CardHeader>
          <CardTitle>Panel de Contrôle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test individuel */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="sector-input">Code SCIAN à tester</Label>
              <Input
                id="sector-input"
                value={sectorCode}
                onChange={(e) => setSectorCode(e.target.value)}
                placeholder="ex: 23"
                className="max-w-32"
              />
            </div>
            <Button
              onClick={() => handleTestSector(sectorCode)}
              disabled={isTestingAll}
            >
              Tester
            </Button>
          </div>

          {/* Boutons secteurs prédéfinis */}
          <div>
            <Label>Secteurs prédéfinis (cliquez pour tester)</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {PREDEFINED_SECTORS.slice(0, 8).map((sector) => (
                <Button
                  key={sector.code}
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestSector(sector.code)}
                  disabled={isTestingAll}
                >
                  {sector.code}
                </Button>
              ))}
            </div>
          </div>

          {/* Test complet */}
          <div className="pt-4 border-t">
            <Button
              onClick={handleTestAllSectors}
              disabled={isTestingAll}
              className="w-full"
              variant={isTestingAll ? "secondary" : "default"}
            >
              {isTestingAll ? 'Test en cours...' : 'Tester tous les secteurs'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques des tests */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Statistiques des Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.success}</div>
                <div className="text-sm text-gray-600">Succès</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.partial}</div>
                <div className="text-sm text-gray-600">Partiels</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
                <div className="text-sm text-gray-600">Erreurs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{stats.avgResponseTime}ms</div>
                <div className="text-sm text-gray-600">Temps moy.</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résultats des tests */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats des Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={`${result.sector}-${index}`}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedResult(result)}
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        result.status === 'success' ? 'default' :
                        result.status === 'partial' ? 'secondary' : 'destructive'
                      }
                    >
                      {result.sector}
                    </Badge>
                    <div>
                      <div className="font-medium">{result.sectorName}</div>
                      <div className="text-sm text-gray-500">
                        {result.timestamp} • {result.responseTime}ms
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      result.status === 'success' ? 'default' :
                      result.status === 'partial' ? 'secondary' : 'destructive'
                    }
                  >
                    {result.status === 'success' ? 'Succès' :
                     result.status === 'partial' ? 'Partiel' : 'Erreur'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Détails du résultat sélectionné */}
      {selectedResult && (
        <Card>
          <CardHeader>
            <CardTitle>
              Détails - Secteur {selectedResult.sector} ({selectedResult.sectorName})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Statut</Label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        selectedResult.status === 'success' ? 'default' :
                        selectedResult.status === 'partial' ? 'secondary' : 'destructive'
                      }
                    >
                      {selectedResult.status === 'success' ? 'Test réussi' :
                       selectedResult.status === 'partial' ? 'Test partiel' : 'Test échoué'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>Temps de réponse</Label>
                  <div className="mt-1 font-mono">{selectedResult.responseTime}ms</div>
                </div>
              </div>
              
              {selectedResult.message && (
                <div>
                  <Label>Message</Label>
                  <div className="mt-1 p-2 bg-gray-100 rounded text-sm">
                    {selectedResult.message}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>Note:</strong> La prévisualisation XAI détaillée sera disponible 
                  une fois l'intégration avec les données CNESST réelles complétée.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Guide d'utilisation */}
      <Card>
        <CardHeader>
          <CardTitle>Guide d'Utilisation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <strong>1. Test individuel:</strong> Entrez un code SCIAN et cliquez "Tester"
            </div>
            <div>
              <strong>2. Tests rapides:</strong> Utilisez les boutons prédéfinis pour les secteurs courants
            </div>
            <div>
              <strong>3. Test complet:</strong> Cliquez "Tester tous les secteurs" pour une validation complète
            </div>
            <div>
              <strong>4. Analyse:</strong> Cliquez sur un résultat pour voir les détails
            </div>
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <strong>⚠️ Version de test:</strong> Cette interface simule les tests en attendant 
              l'intégration complète avec les 697,602 données CNESST réelles.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SectorTester;