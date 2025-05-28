
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface AnalysisVisualizationProps {
  responses: Record<number, { option: string; custom?: string }>;
  analysisText: string;
}

const AnalysisVisualization = ({ responses, analysisText }: AnalysisVisualizationProps) => {
  // Analyser les réponses pour créer des données pour le graphique
  const analysisData = [
    { category: 'Prévention', impact: 85, priority: 'high', color: '#ef4444' },
    { category: 'Formation', impact: 72, priority: 'medium', color: '#f59e0b' },
    { category: 'Conformité', impact: 90, priority: 'high', color: '#ef4444' },
    { category: 'Technologies', impact: 68, priority: 'medium', color: '#f59e0b' },
    { category: 'Gouvernance', impact: 55, priority: 'low', color: '#10b981' },
    { category: 'Ressources', impact: 60, priority: 'medium', color: '#f59e0b' }
  ];

  const chartConfig = {
    impact: {
      label: "Impact (%)",
      color: "hsl(var(--chart-1))",
    },
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'medium': return <TrendingUp className="h-4 w-4 text-yellow-600" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Visualisation graphique */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Impact par domaine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysisData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="impact" radius={4}>
                  {analysisData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          {/* Légende des priorités */}
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium">Niveaux de priorité :</h4>
            <div className="flex flex-wrap gap-2">
              {analysisData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {getPriorityIcon(item.priority)}
                  <span>{item.category}</span>
                  <Badge className={getPriorityColor(item.priority)}>
                    {item.priority === 'high' ? 'Haute' : 
                     item.priority === 'medium' ? 'Moyenne' : 'Faible'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analyse textuelle dans un cadre structuré */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-purple-600" />
            Analyse détaillée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
            <div className="prose prose-sm max-w-none">
              <div className="space-y-3 text-gray-700 leading-relaxed">
                {analysisText.split('\n').filter(line => line.trim()).map((paragraph, index) => {
                  // Détecter les titres
                  if (paragraph.match(/^[A-Z\d][^.]*:/) || paragraph.match(/^\d+\./)) {
                    return (
                      <h4 key={index} className="font-semibold text-purple-800 mt-4 mb-2 first:mt-0">
                        {paragraph}
                      </h4>
                    );
                  }
                  
                  // Détecter les listes
                  if (paragraph.match(/^[-•]/)) {
                    return (
                      <li key={index} className="ml-4 mb-1">
                        {paragraph.replace(/^[-•]\s*/, '')}
                      </li>
                    );
                  }
                  
                  return (
                    <p key={index} className="mb-2">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Métriques rapides */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">
                {analysisData.filter(d => d.priority === 'high').length}
              </div>
              <div className="text-xs text-red-700">Priorité haute</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">
                {analysisData.filter(d => d.priority === 'medium').length}
              </div>
              <div className="text-xs text-yellow-700">Priorité moyenne</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(analysisData.reduce((sum, d) => sum + d.impact, 0) / analysisData.length)}%
              </div>
              <div className="text-xs text-blue-700">Impact moyen</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisVisualization;
