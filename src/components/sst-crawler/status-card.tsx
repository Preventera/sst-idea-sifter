// src/components/sst-crawler/status-card.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { sstCrawlerService } from '@/services/sst-crawler-service';
import { Loader2, RefreshCw, Play, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface StatusCardProps {
  source: string;
}

export function SSTCrawlerStatusCard({ source }: StatusCardProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [crawling, setCrawling] = useState<boolean>(false);
  const [crawlingResult, setCrawlingResult] = useState<string | null>(null);

  // Charger les données au chargement du composant
  useEffect(() => {
    loadData();
  }, [source]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const sourceData = await sstCrawlerService.getLatestData(source);
      setData(sourceData);
    } catch (err: any) {
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerCrawling = async () => {
    try {
      setCrawling(true);
      setCrawlingResult(null);
      const result = await sstCrawlerService.triggerCrawling(source, 5);
      setCrawlingResult(result.message);
      
      if (result.success) {
        // Recharger les données après un délai (laisser le temps au crawling de s'exécuter)
        setTimeout(() => {
          loadData();
        }, 10000);
      }
    } catch (err: any) {
      setCrawlingResult(`Erreur: ${err.message}`);
    } finally {
      setCrawling(false);
    }
  };

  const getStatusIcon = () => {
    if (loading) return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    if (error) return <XCircle className="h-5 w-5 text-red-500" />;
    if (data && data.count > 0) return <CheckCircle className="h-5 w-5 text-green-500" />;
    return <AlertCircle className="h-5 w-5 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (loading) return "Chargement...";
    if (error) return "Erreur";
    if (data && data.count > 0) return "Données disponibles";
    return "Aucune donnée";
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center items-center min-h-[200px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Chargement des données pour {source}...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            Erreur: {source}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={loadData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 capitalize">
          {getStatusIcon()}
          {source}
        </CardTitle>
        <CardDescription>
          <span className="font-medium">{getStatusText()}</span>
          {data && (
            <>
              <span className="mx-2">•</span>
              <span>{data.count} éléments collectés</span>
              {data.lastUpdated && (
                <>
                  <span className="mx-2">•</span>
                  <span className="text-xs">
                    Mis à jour: {new Date(data.lastUpdated).toLocaleString('fr-CA')}
                  </span>
                </>
              )}
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data && data.summary && (
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm mb-2">📊 Résumé des données</h4>
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Total:</span> {data.summary.totalItems} éléments
                </p>
                
                {data.summary.typeDistribution && Object.keys(data.summary.typeDistribution).length > 0 && (
                  <div>
                    <p className="font-medium">Distribution par type:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {Object.entries(data.summary.typeDistribution).map(([type, count]) => (
                        <li key={type} className="text-xs">
                          <span className="capitalize">{type}:</span> {count as number} éléments
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {data.summary.hasContent && (
                  <p className="text-green-600 text-xs">
                    ✅ Contenu textuel disponible pour analyse
                  </p>
                )}
              </div>
            </div>
            
            {data.summary.domainDistribution && Object.keys(data.summary.domainDistribution).length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">🌐 Sources collectées</h4>
                <div className="grid grid-cols-1 gap-1">
                  {Object.entries(data.summary.domainDistribution)
                    .slice(0, 3)
                    .map(([domain, count]) => (
                      <div key={domain} className="text-xs flex justify-between">
                        <span className="truncate">{domain}</span>
                        <span className="font-medium">{count as number}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {crawlingResult && (
          <div className={`mt-4 p-3 rounded-md text-sm ${
            crawlingResult.includes('Erreur') 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            <p>{crawlingResult}</p>
          </div>
        )}
        
        {data && data.items && data.items.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-sm mb-2">📄 Aperçu des données (derniers éléments)</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {data.items.slice(0, 3).map((item: any, index: number) => (
                <div key={index} className="text-xs p-2 bg-gray-50 rounded border">
                  <p className="font-medium truncate">
                    {item.title || item.name || item.url || `Élément ${index + 1}`}
                  </p>
                  {item.url && (
                    <p className="text-gray-500 truncate">{item.url}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={loadData} disabled={crawling}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Rafraîchir
        </Button>
        <Button onClick={handleTriggerCrawling} disabled={crawling}>
          {crawling ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Collecte en cours...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Lancer collecte
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}