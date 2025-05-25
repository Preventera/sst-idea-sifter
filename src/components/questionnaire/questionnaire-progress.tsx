
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, AlertCircle } from "lucide-react";

interface QuestionnaireProgressProps {
  sections: any[];
  currentSection: number;
  responses: Record<number, { option: string; custom?: string }>;
  onSectionClick: (index: number) => void;
}

const QuestionnaireProgress = ({ 
  sections, 
  currentSection, 
  responses, 
  onSectionClick 
}: QuestionnaireProgressProps) => {
  const getSectionStatus = (sectionIndex: number) => {
    const section = sections[sectionIndex];
    const answeredQuestions = section.questions.filter((q: any) => responses[q.id]?.option).length;
    const totalQuestions = section.questions.length;
    
    if (answeredQuestions === totalQuestions) return "complete";
    if (answeredQuestions > 0) return "partial";
    return "empty";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "partial": return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete": return "bg-green-100 text-green-800";
      case "partial": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);
  const answeredQuestions = Object.values(responses).filter(r => r.option).length;
  const overallProgress = (answeredQuestions / totalQuestions) * 100;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-sm">Progression globale</h3>
              <Badge variant="outline">
                {answeredQuestions}/{totalQuestions} réponses
              </Badge>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {sections.map((section, index) => {
              const status = getSectionStatus(index);
              const answeredCount = section.questions.filter((q: any) => responses[q.id]?.option).length;
              
              return (
                <button
                  key={section.id}
                  onClick={() => onSectionClick(index)}
                  className={`text-left p-2 rounded-lg border transition-colors ${
                    index === currentSection 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(status)}
                    <span className="text-xs font-medium truncate">
                      {section.title}
                    </span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(status)}`}
                  >
                    {answeredCount}/{section.questions.length}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionnaireProgress;
