
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, AlertCircle } from "lucide-react";

interface QuestionnaireProgressProps {
  currentSection: number;
  totalSections: number;
  answeredQuestions: number;
  totalQuestions: number;
  completedSections: number;
}

const QuestionnaireProgress = ({ 
  currentSection,
  totalSections,
  answeredQuestions,
  totalQuestions,
  completedSections
}: QuestionnaireProgressProps) => {
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

          <div className="flex justify-between items-center text-sm">
            <span>Section actuelle: {currentSection + 1}/{totalSections}</span>
            <span>Sections complètes: {completedSections}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionnaireProgress;
