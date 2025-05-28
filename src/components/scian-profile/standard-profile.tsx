
import React, { useState } from 'react';
import { Building2, Users, Shield, AlertTriangle, TrendingUp, FileText, Settings, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SCIAN_SECTORS, calculateSectorPriorityScore, getPriorityLevel, getPriorityText, getPriorityColor } from '@/data/scian-sectors';

const StandardProfile = () => {
  const [selectedSector, setSelectedSector] = useState(SCIAN_SECTORS[0]);
  
  const priorityScore = calculateSectorPriorityScore(selectedSector);
  const priorityLevel = getPriorityLevel(priorityScore);
  const priorityColor = getPriorityColor(priorityLevel);

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

      {/* Recommandations IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Recommandations d'Implémentation IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {priorityLevel === 'high' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">🚀 Secteur Hautement Prioritaire</h4>
                <p className="text-sm text-green-700 mb-3">
                  Ce secteur présente un excellent potentiel pour l'implémentation de solutions d'IA en SST.
                </p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Démarrer par des projets pilotes ciblés</li>
                  <li>• Investir dans la formation du personnel</li>
                  <li>• Établir des partenariats avec des fournisseurs d'IA</li>
                  <li>• Développer un plan de déploiement progressif</li>
                </ul>
              </div>
            )}
            
            {priorityLevel === 'medium' && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">⚡ Secteur à Potentiel Modéré</h4>
                <p className="text-sm text-yellow-700 mb-3">
                  Des opportunités existent mais nécessitent une analyse plus approfondie.
                </p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Évaluer les besoins spécifiques</li>
                  <li>• Commencer par des solutions simples</li>
                  <li>• Surveiller les développements technologiques</li>
                  <li>• Planifier une implémentation à moyen terme</li>
                </ul>
              </div>
            )}
            
            {priorityLevel === 'low' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">🔍 Secteur Nécessitant Plus d'Analyse</h4>
                <p className="text-sm text-red-700 mb-3">
                  L'implémentation d'IA pourrait être plus complexe dans ce secteur.
                </p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Identifier les défis spécifiques</li>
                  <li>• Améliorer la collecte de données</li>
                  <li>• Renforcer la conformité réglementaire</li>
                  <li>• Considérer des solutions sur mesure</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StandardProfile;
