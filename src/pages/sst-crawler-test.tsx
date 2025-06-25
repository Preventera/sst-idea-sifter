// src/pages/sst-crawler-test.tsx

import React, { useState, useEffect } from 'react';
import { SSTCrawlerStatusCard } from '@/components/sst-crawler/status-card';
import { sstCrawlerService } from '@/services/sst-crawler-service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  BarChart3,
  Settings,
  Activity,
  Database
} from 'lucide-react';

export default function SSTCrawlerTestPage() {
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [diagnostic, setDiagnostic] = useState<any>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [diagnosticLoading, setDiagnosticLoading] = useState<boolean>(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const availableSources = sstCrawlerService.getAvailableSources();
      setSources(availableSources);
      
      // Charger aussi les statistiques initiales
      await loadStatistics();
    } catch (error) {
      console.error('Erreur lors du chargement des sources:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await sstCrawlerService.getUsageStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const runDiagnostic = async () => {
    try {
      setDiagnosticLoading(true);
      const result = await sstCrawlerService.performSystemDiagnostic();
      setDiagnostic(result);
      await loadStatistics(); // Rafraîchir aussi les statistiques
    } catch (error) {
      console.error('Erreur lors du diagnostic:', error);
      setDiagnostic({
        error: true,
        message: error.message
      });
    } finally {
      setDiagnosticLoading(false);
    }
  };

  const getHealthBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800">🟢 Sain</Badge>;
      case 'unhealthy':
        return <Badge className="bg-red-100 text-red-800">🔴 Problème</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">🟡 Inconnu</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Chargement de l'interface de test SST Crawler...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Settings className="h-8 w-8 text-blue-600" />
          Test d'intégration SST Crawler
        </h1>
        <p className="text-gray-600 mt-2">
          Cette page permet de tester et surveiller l'intégration du module SST Crawler dans IGNITIA.
        </p>
      </div>

      {/* Section diagnostic et statistiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Diagnostic système */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Diagnostic Système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={runDiagnostic} 
                disabled={diagnosticLoading}
                className="w-full"
              >
                {diagnosticLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Diagnostic en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Lancer le diagnostic
                  </>
                )}
              </Button>

              {diagnostic && !diagnostic.error && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>État général:</span>
                    {getHealthBadge(diagnostic.systemHealth.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      {diagnostic.systemHealth.details.basePathExists ? 
                        <CheckCircle className="h-4 w-4 text-green-500" /> : 
                        <XCircle className="h-4 w-4 text-red-500" />
                      }
                      <span>Répertoire</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {diagnostic.systemHealth.details.automationScriptExists ? 
                        <CheckCircle className="h-4 w-4 text-green-500" /> : 
                        <XCircle className="h-4 w-4 text-red-500" />
                      }
                      <span>Scripts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {diagnostic.systemHealth.details.sourcesFileExists ? 
                        <CheckCircle className="h-4 w-4 text-green-500" /> : 
                        <XCircle className="h-4 w-4 text-red-500" />
                      }
                      <span>Configuration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {diagnostic.crawling.inProgress ? 
                        <Activity className="h-4 w-4 text-blue-500" /> : 
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      }
                      <span>{diagnostic.crawling.status}</span>
                    </div>
                  </div>

                  {diagnostic.recommendations && diagnostic.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Recommandations:</h4>
                      <div className="space-y-1">
                        {diagnostic.recommendations.map((rec: string, index: number) => (
                          <p key={index} className="text-xs bg-gray-50 p-2 rounded">
                            {rec}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {diagnostic && diagnostic.error && (
                <div className="bg-red-50 p-3 rounded border border-red-200">
                  <div className="flex items-center gap-2 text-red-700">
                    <XCircle className="h-4 w-4" />
                    <span className="font-medium">Erreur de diagnostic</span>
                  </div>
                  <p className="text-red-600 text-sm mt-1">{diagnostic.message}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistiques d'utilisation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Statistiques d'utilisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statistics ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="text-2xl font-bold text-blue-600">
                      {statistics.totalSources}
                    </div>
                    <div className="text-sm text-blue-800">Sources configurées</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <div className="text-2xl font-bold text-green-600">
                      {statistics.dataCollected}
                    </div>
                    <div className="text-sm text-green-800">Éléments collectés</div>
                  </div>
                </div>

                {statistics.sourceDetails && statistics.sourceDetails.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Détail par source:</h4>
                    <div className="space-y-2">
                      {statistics.sourceDetails.map((source: any, index: number) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="capitalize">{source.source}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{source.itemCount}</span>
                            {source.hasData ? 
                              <CheckCircle className="h-4 w-4 text-green-500" /> :
                              <Database className="h-4 w-4 text-gray-400" />
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <Database className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Lancez le diagnostic pour voir les statistiques
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Section sources */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Database className="h-6 w-6" />
          Sources SST Crawler ({sources.length})
        </h2>
        
        {sources.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                <h3 className="text-lg font-medium mb-2">Aucune source disponible</h3>
                <p className="text-gray-500 mb-4">
                  Veuillez vérifier la configuration de SST Crawler et exécuter un diagnostic.
                </p>
                <Button onClick={runDiagnostic}>
                  Lancer le diagnostic
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sources.map((source) => (
              <SSTCrawlerStatusCard key={source} source={source} />
            ))}
          </div>
        )}
      </div>

      {/* Note technique */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Intégration réussie</h3>
              <p className="text-blue-800 text-sm">
                Le sous-module SST Crawler est maintenant intégré à IGNITIA. Vous pouvez utiliser cette interface pour 
                surveiller et tester les fonctionnalités de collecte de données depuis les sources québécoises en SST.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}