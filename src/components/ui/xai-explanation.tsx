// src/components/ui/xai-explanation.tsx
// Composant XAI pour afficher les explications contextuelles dans IGNITIA
// ÉTAPE 1.3b - Interface XAI pour explications

import React, { useState, useEffect } from 'react';
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
  AlertTriangle
} from 'lucide-react';
import { xaiEngine, XAIExplanation, ProjectContext } from '@/utils/xai-context-engine';

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

  const genererExplication = async () => {
    setIsLoading(true);
    try {
      const explication = await xaiEngine.genererExplicationXAI(critere, score, contexteProjet);
      setExplanation(explication);
      setShowDetails(true);
      onExplicationGenerate?.(explication);
    } catch (error) {
      console.error('Erreur génération XAI:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCouleurScore = (score: number) => {
    if (score >= 8) return 'text-green-700 bg-green-50';
    if (score >= 6) return 'text-yellow-700 bg-yellow-50';
    return 'text-red-700 bg-red-50';
  };

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
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* 1. Contexte sectoriel */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-900">Contexte sectoriel</span>
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
              </div>
              <p className="text-sm text-gray-700 bg-white/60 p-3 rounded-lg">
                {explanation.justificationDonnees}
              </p>
            </div>

            {/* 3. Recommandation pratique */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-900">Recommandation</span>
              </div>
              <Alert className="bg-orange-50 border-orange-200">
                <AlertDescription className="text-orange-800">
                  {explanation.recommandationPratique}
                </AlertDescription>
              </Alert>
            </div>

            {/* 4. Traçabilité */}
            <details className="group">
              <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Traçabilité et auditabilité
                <span className="text-xs text-gray-500 ml-auto">Cliquer pour détails</span>
              </summary>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                {explanation.tracabilite}
              </div>
            </details>

            {/* 5. Références */}
            {explanation.references.length > 0 && (
              <div className="space-y-2">
                <span className="font-medium text-gray-700 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Références et ressources
                </span>
                <div className="space-y-2">
                  {explanation.references.map((ref, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/60 p-2 rounded-lg">
                      <div className="flex-1">
                        <a 
                          href={ref.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {ref.titre}
                        </a>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {ref.type}
                          </Badge>
                          <span className="text-xs text-gray-500">{ref.date}</span>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">
                        {ref.pertinence}/10
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bouton fermer */}
            <div className="flex justify-end pt-2">
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