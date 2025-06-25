// src/components/ui/xai-explanation.tsx
// Composant XAI pour afficher les explications contextuelles dans IGNITIA
// VERSION CORRIGÉE - Compatible avec le nouveau système de bascule

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  HelpCircle, 
  Brain, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  FileText,
  Target,
  AlertTriangle,
  BarChart2,
  Shield,
  Lightbulb
} from 'lucide-react';
import { 
  genererExplicationComplete, 
  XAIExplanation, 
  ProjectContext 
} from '@/utils/xai-context-engine';

// Interface pour les propriétés du composant
interface XAIExplanationProps {
  critere: string;
  score: number;
  contexteProjet: ProjectContext;
  labelCritere: string;
  onExplicationGenerate?: (explanation: XAIExplanation) => void;
}

export const XAIExplanationComponent: React.FC<XAIExplanationProps> = ({
  critere,
  score,
  contexteProjet,
  labelCritere,
  onExplicationGenerate
}) => {
  const [explanation, setExplanation] = useState<XAIExplanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Détecter si nous utilisons la version enrichie
  const isEnhancedVersion = useMemo(() => {
    if (!explanation) return false;
    return explanation.versionMoteur === 'api' || 
           explanation.niveauConfiance >= 8 ||
           (explanation.metriquesTempsReel !== undefined);
  }, [explanation]);

  // Générer l'explication XAI
  const genererExplication = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`🧠 Génération XAI pour ${critere} (score: ${score})`);
      
      const explication = await genererExplicationComplete(critere, score, contexteProjet);
      
      setExplanation(explication);
      setShowDetails(true);
      onExplicationGenerate?.(explication);
      
      console.log(`✅ Explication générée via ${explication.versionMoteur || 'système'}`);
      
    } catch (error) {
      console.error('❌ Erreur génération XAI:', error);
      setError('Impossible de générer l\'explication. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Obtenir la couleur selon le score
  const getCouleurScore = (score: number) => {
    if (score >= 8) return 'text-green-700 bg-green-50';
    if (score >= 6) return 'text-yellow-700 bg-yellow-50';
    return 'text-red-700 bg-red-50';
  };

  // Obtenir l'icône selon le niveau de confiance
  const getIconeConfiance = (confiance: number) => {
    if (confiance >= 8) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (confiance >= 6) return <TrendingUp className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-3">
      {/* En-tête avec score et bouton d'explication */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">{labelCritere}</span>
          <Badge className={`${getCouleurScore(score)} border-0`}>
            {score}/10
          </Badge>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={genererExplication}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          {isLoading ? (
            <>
              <Clock className="h-3 w-3 animate-spin" />
              Analyse XAI...
            </>
          ) : (
            <>
              <HelpCircle className="h-3 w-3" />
              Pourquoi ce score ?
            </>
          )}
        </Button>
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Explication détaillée */}
      {explanation && showDetails && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Brain className="h-5 w-5" />
              Explication IA Explicable (XAI)
              <div className="flex items-center gap-1 ml-auto">
                {getIconeConfiance(explanation.niveauConfiance)}
                <Badge variant="outline" className="bg-blue-100 text-blue-700">
                  Confiance: {explanation.niveauConfiance}/10
                  {isEnhancedVersion && explanation.niveauConfiance >= 9 && (
                    <span className="ml-1">⭐</span>
                  )}
                </Badge>
                {explanation.versionMoteur === 'api' && (
                  <Badge variant="outline" className="bg-green-100 text-green-700 text-xs">
                    API
                  </Badge>
                )}
              </div>
            </CardTitle>
            {explanation.performanceMetrics && (
              <div className="text-xs text-gray-600">
                Source: {explanation.performanceMetrics.sourceUtilisee} • 
                Temps: {explanation.performanceMetrics.tempsReponse}ms
              </div>
            )}
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* 1. Contexte sectoriel */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-900">Contexte sectoriel</span>
                {explanation.metriquesTempsReel && (
                  <Badge variant="outline" className="text-xs bg-purple-50">
                    {explanation.metriquesTempsReel.totalEnregistrements.toLocaleString()} données
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-700 bg-white/60 p-3 rounded-lg">
                {explanation.contexteSectoriel}
              </p>
            </div>

            {/* 2. Justification basée sur les données */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900">Justification données</span>
                {explanation.metriquesTempsReel && (
                  <Badge variant="outline" className="text-xs bg-green-50">
                    MAJ: {explanation.metriquesTempsReel.derniereMiseAJour}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-700 bg-white/60 p-3 rounded-lg">
                {explanation.justificationDonnees}
              </p>
            </div>

            {/* 3. Recommandation pratique */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-900">Recommandation pratique</span>
              </div>
              <Alert className="bg-orange-50 border-orange-200">
                <AlertDescription className="text-orange-800 whitespace-pre-line">
                  {explanation.recommandationPratique}
                </AlertDescription>
              </Alert>
            </div>

            {/* 4. Visualisations (si disponibles) */}
            {explanation.visualisations && explanation.visualisations.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Données sectorielles</span>
                  <Badge variant="outline" className="text-xs bg-blue-50">
                    {explanation.visualisations.length} visualisation(s)
                  </Badge>
                </div>
                <div className="bg-white/60 p-3 rounded-lg">
                  <p className="text-sm text-blue-700">
                    📊 Visualisations disponibles : {explanation.visualisations.map(v => v.titre).join(', ')}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Note: Intégration des graphiques en cours de développement
                  </p>
                </div>
              </div>
            )}

            {/* 5. Sources de données */}
            {explanation.sourcesDonnees && explanation.sourcesDonnees.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-900">Sources de données</span>
                </div>
                <div className="bg-white/60 p-3 rounded-lg">
                  <ul className="list-disc list-inside space-y-1">
                    {explanation.sourcesDonnees.map((source, index) => (
                      <li key={index} className="text-xs text-gray-600">{source}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 6. Traçabilité */}
            <details className="group">
              <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Traçabilité et auditabilité
                <span className="text-xs text-gray-500 ml-auto">Cliquer pour détails</span>
              </summary>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 whitespace-pre-line">
                {explanation.tracabilite}
              </div>
            </details>

            {/* Boutons d'action */}
            <div className="flex justify-between items-center pt-2 border-t border-blue-200">
              <div className="flex items-center gap-2">
                {isEnhancedVersion && (
                  <Badge className="bg-emerald-100 text-emerald-700">
                    <Lightbulb className="h-3 w-3 mr-1" />
                    Version enrichie
                  </Badge>
                )}
                {explanation.versionMoteur && (
                  <Badge variant="outline" className="text-xs">
                    Moteur: {explanation.versionMoteur.toUpperCase()}
                  </Badge>
                )}
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowDetails(false)}
              >
                Fermer l'explication
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Composant simplifié pour intégration rapide
export const XAIQuickExplanation: React.FC<{
  critere: string;
  score: number;
  justification: string;
  confiance: number;
}> = ({ critere, score, justification, confiance }) => {
  const [showJustification, setShowJustification] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowJustification(!showJustification)}
          className="p-1 h-6 w-6"
        >
          <HelpCircle className="h-3 w-3" />
        </Button>
        {showJustification && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
            Confiance: {confiance}/10
          </Badge>
        )}
      </div>
      
      {showJustification && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
          <p className="text-sm text-blue-800">{justification}</p>
        </div>
      )}
    </div>
  );
};

export default XAIExplanationComponent;