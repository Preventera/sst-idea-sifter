
import React from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScianSector, SCIAN_SECTORS, PRIORITY_WEIGHTS, getPriorityText } from "@/data/scian-sectors";

interface PriorityInfoProps {
  scianSectorId: string | undefined;
  priorityScore: number | undefined;
  priorityLevel: 'high' | 'medium' | 'low' | undefined;
}

const PriorityInfo = ({ scianSectorId, priorityScore, priorityLevel }: PriorityInfoProps) => {
  if (!scianSectorId) return null;

  const sector = SCIAN_SECTORS.find(s => s.id === scianSectorId);
  if (!sector) return null;
  
  return (
    <div className="mb-6 border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Priorisation sectorielle</h3>
        {priorityLevel && (
          <Badge variant="outline" className={`ml-2 ${priorityLevel === 'high' ? 'bg-green-100 text-green-700' : priorityLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
            {priorityScore && `${priorityScore.toFixed(2)} - `}{getPriorityText(priorityLevel)}
          </Badge>
        )}
      </div>
      
      <Alert className="mb-4">
        <AlertDescription>
          Secteur: <strong>{sector.name}</strong> - La priorisation est calculée automatiquement selon les facteurs de risque de ce secteur
        </AlertDescription>
      </Alert>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="factors">
          <AccordionTrigger>Facteurs de risque du secteur</AccordionTrigger>
          <AccordionContent>
            <div className="text-sm">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="font-medium">Facteur</div>
                <div className="font-medium text-right">Valeur (1-5)</div>
                
                <div>Impact sur la mortalité</div>
                <div className="text-right">{sector.riskFactors.mortalityImpact} <span className="text-xs text-gray-500">× {PRIORITY_WEIGHTS.mortalityImpact * 100}%</span></div>
                
                <div>Prévalence sectorielle</div>
                <div className="text-right">{sector.riskFactors.sectorPrevalence} <span className="text-xs text-gray-500">× {PRIORITY_WEIGHTS.sectorPrevalence * 100}%</span></div>
                
                <div>Potentiel préventif IA</div>
                <div className="text-right">{sector.riskFactors.aiPreventivePotential} <span className="text-xs text-gray-500">× {PRIORITY_WEIGHTS.aiPreventivePotential * 100}%</span></div>
                
                <div>Conformité législative</div>
                <div className="text-right">{sector.riskFactors.legislationCompliance} <span className="text-xs text-gray-500">× {PRIORITY_WEIGHTS.legislationCompliance * 100}%</span></div>
                
                <div>Disponibilité des données</div>
                <div className="text-right">{sector.riskFactors.dataAvailability} <span className="text-xs text-gray-500">× {PRIORITY_WEIGHTS.dataAvailability * 100}%</span></div>
                
                <div>Délai de mise en œuvre</div>
                <div className="text-right">{sector.riskFactors.implementationDelay} <span className="text-xs text-gray-500">× {PRIORITY_WEIGHTS.implementationDelay * 100}%</span></div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="legend">
          <AccordionTrigger>Légende des priorités</AccordionTrigger>
          <AccordionContent>
            <div className="text-sm space-y-1">
              <div className="flex items-center"><span className="inline-block w-4 h-4 bg-green-100 mr-2 rounded"></span> &gt; 4,2 = 🟢 Haute priorité</div>
              <div className="flex items-center"><span className="inline-block w-4 h-4 bg-yellow-100 mr-2 rounded"></span> 3,5 - 4,2 = 🟡 Priorité moyenne</div>
              <div className="flex items-center"><span className="inline-block w-4 h-4 bg-red-100 mr-2 rounded"></span> &lt; 3,5 = 🔴 Faible priorité</div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PriorityInfo;
