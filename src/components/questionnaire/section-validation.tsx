
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";

interface SectionValidationProps {
  section: any;
  responses: Record<number, { option: string; custom?: string }>;
}

const SectionValidation = ({ section, responses }: SectionValidationProps) => {
  const getValidationStatus = () => {
    const answeredQuestions = section.questions.filter((q: any) => responses[q.id]?.option).length;
    const totalQuestions = section.questions.length;
    
    if (answeredQuestions === totalQuestions) {
      return {
        type: "success",
        icon: <CheckCircle className="h-4 w-4" />,
        title: "Section complète",
        message: `Toutes les questions ont été renseignées (${answeredQuestions}/${totalQuestions})`
      };
    }
    
    if (answeredQuestions > 0) {
      return {
        type: "warning",
        icon: <AlertTriangle className="h-4 w-4" />,
        title: "Section partiellement complète",
        message: `${answeredQuestions}/${totalQuestions} questions renseignées. Continuez pour une analyse plus précise.`
      };
    }
    
    return {
      type: "info",
      icon: <Info className="h-4 w-4" />,
      title: "Section non commencée",
      message: "Cette section vous aidera à préciser vos besoins IA-SST."
    };
  };

  const validation = getValidationStatus();

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "success": return "default";
      case "warning": return "destructive";
      default: return "default";
    }
  };

  return (
    <Alert variant={getAlertVariant(validation.type)} className="mb-4">
      {validation.icon}
      <AlertDescription>
        <span className="font-medium">{validation.title}</span> - {validation.message}
      </AlertDescription>
    </Alert>
  );
};

export default SectionValidation;
