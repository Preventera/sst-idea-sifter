
import React from "react";
import { Badge } from "@/components/ui/badge";
import { getPriorityText, getPriorityLevel } from "@/data/scian-sectors";

interface PriorityBadgeProps {
  score?: number;
  level?: 'high' | 'medium' | 'low';
  size?: 'sm' | 'md' | 'lg';
}

const PriorityBadge = ({ score, level, size = 'md' }: PriorityBadgeProps) => {
  const priorityLevel = level || (score ? getPriorityLevel(score) : 'low');
  const priorityText = getPriorityText(priorityLevel);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };
  
  const colorClasses = {
    high: 'bg-green-100 text-green-700 border-green-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    low: 'bg-red-100 text-red-700 border-red-300'
  };
  
  return (
    <Badge className={`${colorClasses[priorityLevel]} ${sizeClasses[size]} font-medium border`}>
      {priorityText}
      {score && (
        <span className="ml-1 opacity-75">
          ({score.toFixed(1)}/5)
        </span>
      )}
    </Badge>
  );
};

export default PriorityBadge;
