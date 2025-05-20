
import React from "react";
import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface CriteriaSliderProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  colorClass: string;
}

const CriteriaSlider = ({
  label,
  description,
  value,
  onChange,
  colorClass,
}: CriteriaSliderProps) => {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Label className="text-base font-medium">{label}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <button className="ml-2 text-gray-400 hover:text-gray-600">
                <Info className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <p className="text-sm text-gray-600">{description}</p>
            </PopoverContent>
          </Popover>
        </div>
        <span 
          className={`font-bold text-lg px-3 py-1 rounded-md ${getScoreColor(value)}`}
        >
          {value}
        </span>
      </div>
      <Slider
        value={[value]}
        min={1}
        max={10}
        step={1}
        className={`${colorClass}`}
        onValueChange={(values) => onChange(values[0])}
      />
    </div>
  );
};

export const getScoreColor = (score: number): string => {
  if (score >= 8) return "bg-green-100 text-green-700";
  if (score >= 6) return "bg-blue-100 text-blue-700";
  if (score >= 4) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

export default CriteriaSlider;
