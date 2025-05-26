
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Check, X, RefreshCw } from 'lucide-react';
import { useAIAssistant } from '@/hooks/use-ai-assistant';

interface AITextEnhancerProps {
  originalText: string;
  onApply: (enhancedText: string) => void;
  context?: string;
  placeholder?: string;
}

const AITextEnhancer = ({ originalText, onApply, context, placeholder }: AITextEnhancerProps) => {
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [enhancedText, setEnhancedText] = useState('');
  const { generateContent, isLoading } = useAIAssistant();

  const handleEnhance = async () => {
    if (!originalText.trim()) return;

    const result = await generateContent({
      type: 'project_improvement',
      prompt: `Améliore ce texte en le rendant plus clair et professionnel : "${originalText}"`,
      context
    });

    if (result) {
      setEnhancedText(result);
      setShowSuggestion(true);
    }
  };

  const handleApply = () => {
    onApply(enhancedText);
    setShowSuggestion(false);
  };

  const handleReject = () => {
    setShowSuggestion(false);
    setEnhancedText('');
  };

  if (showSuggestion) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Suggestion IA</span>
          </div>
          
          <Textarea
            value={enhancedText}
            onChange={(e) => setEnhancedText(e.target.value)}
            className="mb-3 bg-white"
            rows={4}
          />
          
          <div className="flex gap-2">
            <Button size="sm" onClick={handleApply} className="bg-blue-600 hover:bg-blue-700">
              <Check className="h-4 w-4 mr-1" />
              Appliquer
            </Button>
            <Button size="sm" variant="outline" onClick={handleReject}>
              <X className="h-4 w-4 mr-1" />
              Rejeter
            </Button>
            <Button size="sm" variant="outline" onClick={handleEnhance} disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Regénérer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleEnhance}
      disabled={!originalText.trim() || isLoading}
      className="text-blue-600 border-blue-200 hover:bg-blue-50"
    >
      <Sparkles className="h-4 w-4 mr-1" />
      {isLoading ? 'Amélioration...' : '✨ Améliorer avec l\'IA'}
    </Button>
  );
};

export default AITextEnhancer;
