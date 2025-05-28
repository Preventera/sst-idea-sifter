
import React from "react";
import { 
  Select, 
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SCIAN_SECTORS } from "@/data/scian-sectors";

interface ScianSectorSelectProps {
  selectedSectorId: string | undefined;
  setSelectedSectorId: (id: string | undefined) => void;
}

const ScianSectorSelect = ({ selectedSectorId, setSelectedSectorId }: ScianSectorSelectProps) => {
  return (
    <div className="mb-6">
      <label htmlFor="scian-sector" className="block text-sm font-medium text-gray-700 mb-1">
        Secteur SCIAN (optionnel)
      </label>
      <Select 
        value={selectedSectorId || ""} 
        onValueChange={(value) => setSelectedSectorId(value || undefined)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez un secteur industriel" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Secteurs industriels</SelectLabel>
            <SelectItem value="">Aucun secteur spécifié</SelectItem>
            {SCIAN_SECTORS.map((sector) => (
              <SelectItem key={sector.id} value={sector.id}>
                {sector.name} ({sector.id})
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <p className="mt-1 text-xs text-gray-500">
        La sélection d'un secteur permet une priorisation automatique selon les critères HSE
      </p>
    </div>
  );
};

export default ScianSectorSelect;
