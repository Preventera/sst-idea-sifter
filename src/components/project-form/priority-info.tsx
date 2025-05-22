
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { SCIAN_SECTORS, getPriorityText, getPriorityLevel } from "@/data/scian-sectors";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface PriorityInfoProps {
  scianSectorId: string;
  priorityScore?: number;
  priorityLevel?: 'high' | 'medium' | 'low';
}

const PriorityInfo = ({ scianSectorId, priorityScore, priorityLevel }: PriorityInfoProps) => {
  const sector = SCIAN_SECTORS.find(s => s.id === scianSectorId);
  
  if (!sector) return null;
  
  const level = priorityLevel || getPriorityLevel(priorityScore || 0);
  
  // Use className instead of variant for styling based on priority level
  const alertClassName = 
    level === 'high' ? "border-green-500 bg-green-50" : 
    level === 'medium' ? "border-yellow-500 bg-yellow-50" : 
    "border-red-500 bg-red-50";
  
  const alertIcon = 
    level === 'high' ? <CheckCircle className="h-4 w-4 text-green-500" /> : 
    level === 'medium' ? <AlertTriangle className="h-4 w-4 text-yellow-500" /> : 
    <Info className="h-4 w-4 text-red-500" />;

  const levelText = getPriorityText(level);
  
  const getBadgeColor = (value: number) => {
    if (value >= 4) return "bg-green-100 text-green-800";
    if (value >= 3) return "bg-blue-100 text-blue-800";
    if (value >= 2) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="mb-6 space-y-4">
      <Alert className={alertClassName}>
        {alertIcon}
        <AlertTitle className={level === 'high' ? "text-green-800" : level === 'medium' ? "text-yellow-800" : "text-red-800"}>
          Priorisation sectorielle {levelText}
        </AlertTitle>
        <AlertDescription>
          Ce projet dans le secteur <strong>{sector.name}</strong> obtient un score de priorisation 
          de <strong>{priorityScore?.toFixed(2) || "N/A"}</strong>/5 (niveau {levelText.toLowerCase()})
          selon les critères HSE du secteur.
        </AlertDescription>
      </Alert>

      {sector.statistics && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="font-medium mb-2">Statistiques d'accidents - {sector.name}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium">Accidents annuels:</span> {sector.statistics.accidentCount}
            </div>
            <div>
              <span className="font-medium">Taux de mortalité:</span> {(sector.statistics.mortalityRate || 0) * 100}%
            </div>
            
            {sector.statistics.accidentCauses && (
              <div className="col-span-1 md:col-span-2">
                <span className="font-medium">Causes principales:</span>{" "}
                {sector.statistics.accidentCauses.join(", ")}
              </div>
            )}
            
            {sector.statistics.keyPreventionAreas && (
              <div className="col-span-1 md:col-span-2">
                <span className="font-medium">Domaines de prévention clés:</span>{" "}
                {sector.statistics.keyPreventionAreas.join(", ")}
              </div>
            )}
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Critère de priorisation</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Impact sur la mortalité (25%)</TableCell>
            <TableCell className="text-right">
              <Badge className={getBadgeColor(sector.riskFactors.mortalityImpact)}>
                {sector.riskFactors.mortalityImpact}/5
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Prévalence sectorielle (15%)</TableCell>
            <TableCell className="text-right">
              <Badge className={getBadgeColor(sector.riskFactors.sectorPrevalence)}>
                {sector.riskFactors.sectorPrevalence}/5
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Potentiel préventif par l'IA (20%)</TableCell>
            <TableCell className="text-right">
              <Badge className={getBadgeColor(sector.riskFactors.aiPreventivePotential)}>
                {sector.riskFactors.aiPreventivePotential}/5
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Conformité LSST / Législation (20%)</TableCell>
            <TableCell className="text-right">
              <Badge className={getBadgeColor(sector.riskFactors.legislationCompliance)}>
                {sector.riskFactors.legislationCompliance}/5
              </Badge>
            </TableCell>
          </TableRow>
          {sector.riskFactors.conformiteLSST && (
            <TableRow>
              <TableCell>Conformité obligations prévention (20%)</TableCell>
              <TableCell className="text-right">
                <Badge className={getBadgeColor(sector.riskFactors.conformiteLSST)}>
                  {sector.riskFactors.conformiteLSST}/5
                </Badge>
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell>Disponibilité des données (10%)</TableCell>
            <TableCell className="text-right">
              <Badge className={getBadgeColor(sector.riskFactors.dataAvailability)}>
                {sector.riskFactors.dataAvailability}/5
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Délai de mise en œuvre estimé (10%)</TableCell>
            <TableCell className="text-right">
              <Badge className={getBadgeColor(sector.riskFactors.implementationDelay)}>
                {sector.riskFactors.implementationDelay}/5
              </Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default PriorityInfo;
