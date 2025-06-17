// Test Component pour valider le fonctionnement du générateur IA
// Fichier: src/components/test/ai-generator-test.tsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useAIAssistant } from '@/hooks/use-ai-assistant';

interface TestCriteria {
  technicalFeasibility: number;
  businessValue: number;
  riskReduction: number;
  implementationCost: number;
  timeToMarket: number;
  stakeholderSupport: number;
  regulatoryCompliance: number;
}

interface TestResult {
  success: boolean;
  response: string;
  error?: string;
  timestamp: string;
}

export function AIGeneratorTest() {
  const { analyzeContent, isLoading } = useAIAssistant();
  const [testSector, setTestSector] = useState('Construction');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');

  const testCriteria: TestCriteria = {
    technicalFeasibility: 8,
    businessValue: 7,
    riskReduction: 9,
    implementationCost: 6,
    timeToMarket: 7,
    stakeholderSupport: 8,
    regulatoryCompliance: 9
  };

  const runTest = async () => {
    console.log('🧪 DÉBUT DU TEST - Génération IA');
    
    try {
      // Créer le texte des critères
      const criteriaText = Object.entries(testCriteria)
        .map(([key, value]) => `${key}: ${value}/10`)
        .join(', ');

      console.log('📊 Critères de test:', criteriaText);
      console.log('🏗️ Secteur de test:', testSector);

      // Appeler l'API avec le prompt structuré en 8 étapes
      const result = await analyzeContent({
        analysisType: 'project_ideas',
        text: `Tu es un expert HSE spécialisé dans l'application de l'intelligence artificielle pour la prévention des accidents et l'amélioration de la performance sécurité. Génère une étude de cas d'usage d'IA basée sur ces critères: ${criteriaText}.

Étape 1 : Identification du problème
- Dans le secteur ${testSector}, le principal risque lié à ces critères concerne: [description spécifique].
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
- Explique pourquoi cette catégorie est critique pour ce projet.`,
        context: `Secteur: ${testSector}, Critères: ${criteriaText}`
      });

      console.log('✅ Réponse reçue:', result);

      setCurrentResponse(result || 'Aucune réponse reçue');
      
      const testResult: TestResult = {
        success: !!result,
        response: result || 'Aucune réponse',
        timestamp: new Date().toLocaleTimeString()
      };

      setTestResults(prev => [testResult, ...prev]);

    } catch (error) {
      console.error('❌ Erreur lors du test:', error);
      
      const testResult: TestResult = {
        success: false,
        response: '',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        timestamp: new Date().toLocaleTimeString()
      };

      setTestResults(prev => [testResult, ...prev]);
    }
  };

  const clearTests = () => {
    setTestResults([]);
    setCurrentResponse('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Test du Générateur IA - Prompt 8 Étapes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Configuration du test */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Secteur de test</label>
              <Select value={testSector} onValueChange={setTestSector}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Construction">Construction</SelectItem>
                  <SelectItem value="Fabrication">Fabrication</SelectItem>
                  <SelectItem value="Transport et entreposage">Transport et entreposage</SelectItem>
                  <SelectItem value="Soins de santé">Soins de santé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Critères de test</label>
              <div className="text-xs text-gray-600 mt-1">
                Faisabilité: 8/10, Valeur: 7/10, Risques: 9/10, Coût: 6/10, Temps: 7/10, Support: 8/10, Conformité: 9/10
              </div>
            </div>
          </div>

          {/* Boutons de contrôle */}
          <div className="flex gap-2">
            <Button 
              onClick={runTest} 
              disabled={isLoading}
              className="flex-1"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {isLoading ? 'Test en cours...' : 'Lancer le test'}
            </Button>
            <Button 
              onClick={clearTests} 
              variant="outline"
              disabled={testResults.length === 0}
            >
              Vider les résultats
            </Button>
          </div>

          {/* Affichage de la réponse actuelle */}
          {currentResponse && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-2">Dernière réponse générée:</h4>
              <pre className="text-sm whitespace-pre-wrap font-sans text-gray-700">
                {currentResponse}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historique des tests */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Historique des tests
              <Badge variant="outline">{testResults.length} test(s)</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className={`border rounded-lg p-3 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm font-medium">
                        {result.success ? 'Test réussi' : 'Test échoué'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{result.timestamp}</span>
                  </div>
                  
                  {result.error && (
                    <div className="text-sm text-red-700 mb-2">
                      <strong>Erreur:</strong> {result.error}
                    </div>
                  )}
                  
                  {result.response && (
                    <div className="text-xs text-gray-600 max-h-32 overflow-y-auto">
                      <strong>Réponse:</strong> {result.response.substring(0, 200)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions de validation */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <AlertTriangle className="w-5 h-5" />
            Critères de validation
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800">
          <p className="mb-2"><strong>✅ Test réussi si:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>La réponse contient les 8 étapes structurées</li>
            <li>Le contenu est spécifique au secteur sélectionné</li>
            <li>Les critères fournis sont pris en compte</li>
            <li>La catégorie ELON est clairement identifiée</li>
            <li>Aucune erreur dans la console du navigateur</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}