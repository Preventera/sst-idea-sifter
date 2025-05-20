
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Criteria } from "../../types/project";

interface WeightedCriteriaProps {
  criteria: Criteria;
  weights: Record<keyof Criteria, number>;
  updateCriteria: (key: keyof Criteria, value: number) => void;
  updateWeight: (key: string, value: number) => void;
}

const WeightedCriteria = ({ criteria, weights, updateCriteria, updateWeight }: WeightedCriteriaProps) => {
  const criteriaLabels: Record<keyof Criteria, string> = {
    impact: "Impact et pertinence",
    excellence: "Excellence et innovation",
    faisabilite: "Faisabilité et maturité",
    gouvernance: "Gouvernance et éthique",
    securite: "Sécurité et robustesse",
    acceptabilite: "Acceptabilité terrain",
    perennite: "Pérennité et diffusion"
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(criteria).map(([key, value]) => {
        const keyTyped = key as keyof Criteria;
        const label = criteriaLabels[keyTyped];
        
        return (
          <div key={key} className="border rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">{label}</span>
              <span className="font-bold">{value}/10</span>
            </div>
            <Slider
              value={[value]}
              min={1}
              max={10}
              step={1}
              className="mb-3"
              onValueChange={(values) => updateCriteria(keyTyped, values[0])}
            />
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">Pondération:</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((w) => (
                  <button
                    key={w}
                    type="button"
                    className={`w-8 h-8 rounded-full text-sm ${
                      weights[keyTyped] === w
                        ? "bg-sst-blue text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => updateWeight(key, w)}
                  >
                    {w}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeightedCriteria;
