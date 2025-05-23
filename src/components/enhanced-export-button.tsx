
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Database, Image } from "lucide-react";
import { Project } from "@/types/project";
import { SCIAN_SECTORS, getPriorityText } from "@/data/scian-sectors";

interface EnhancedExportButtonProps {
  projects: Project[];
}

const EnhancedExportButton = ({ projects }: EnhancedExportButtonProps) => {
  const [exportOptions, setExportOptions] = useState({
    includeWeights: true,
    includeStatistics: true,
    includeDetails: true,
    format: "csv"
  });

  const exportToCSV = (includeExtended = false) => {
    if (projects.length === 0) return;

    const baseHeaders = [
      "Rang", "Projet", "Score Global", "Impact", "Excellence", "Faisabilité", 
      "Gouvernance", "Sécurité", "Acceptabilité", "Pérennité"
    ];
    
    const extendedHeaders = [
      "Secteur SCIAN", "Priorité Sectorielle", "Score Priorité", 
      "Impact Mortalité", "Prévalence Sectorielle", "Potentiel IA", 
      "Conformité Législation", "Disponibilité Données", "Délai Implémentation"
    ];

    const headers = includeExtended ? [...baseHeaders, ...extendedHeaders] : baseHeaders;

    const sortedProjects = [...projects].sort((a, b) => {
      if (a.priority && b.priority) {
        if (a.priority.score !== b.priority.score) {
          return b.priority.score - a.priority.score;
        }
      } else if (a.priority) return -1;
      else if (b.priority) return 1;
      return b.score - a.score;
    });

    const dataRows = sortedProjects.map((project, index) => {
      const baseData = [
        (index + 1).toString(),
        project.name,
        project.score.toString(),
        project.criteria.impact.toString(),
        project.criteria.excellence.toString(),
        project.criteria.faisabilite.toString(),
        project.criteria.gouvernance.toString(),
        project.criteria.securite.toString(),
        project.criteria.acceptabilite.toString(),
        project.criteria.perennite.toString()
      ];

      if (includeExtended) {
        const sectorName = project.scianSectorId 
          ? SCIAN_SECTORS.find(s => s.id === project.scianSectorId)?.name || '-' 
          : '-';
        
        const priority = project.priority 
          ? getPriorityText(project.priority.level) 
          : '-';

        const extendedData = [
          sectorName,
          priority,
          project.priority?.score?.toString() || '-',
          project.priority?.details?.mortalityImpact?.toString() || '-',
          project.priority?.details?.sectorPrevalence?.toString() || '-',
          project.priority?.details?.aiPreventivePotential?.toString() || '-',
          project.priority?.details?.legislationCompliance?.toString() || '-',
          project.priority?.details?.dataAvailability?.toString() || '-',
          project.priority?.details?.implementationDelay?.toString() || '-'
        ];

        return [...baseData, ...extendedData];
      }

      return baseData;
    });

    const csvContent = [
      headers.join(";"),
      ...dataRows.map(row => row.join(";"))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    const date = new Date().toISOString().slice(0, 10);
    const suffix = includeExtended ? "_detaille" : "_standard";
    link.setAttribute("href", url);
    link.setAttribute("download", `priorisation-projets-ia-sst${suffix}_${date}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        projectCount: projects.length,
        includeWeights: exportOptions.includeWeights,
        includeStatistics: exportOptions.includeStatistics
      },
      projects: projects.map(project => ({
        ...project,
        sectorInfo: project.scianSectorId ? SCIAN_SECTORS.find(s => s.id === project.scianSectorId) : null
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    const date = new Date().toISOString().slice(0, 10);
    link.setAttribute("href", url);
    link.setAttribute("download", `priorisation-projets-ia-sst_${date}.json`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = () => {
    switch (exportOptions.format) {
      case "csv-basic":
        exportToCSV(false);
        break;
      case "csv-extended":
        exportToCSV(true);
        break;
      case "json":
        exportToJSON();
        break;
      default:
        exportToCSV(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={projects.length === 0}
          className="ml-2"
        >
          <Download className="h-4 w-4 mr-2" />
          Export avancé
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Options d'export
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-3 block">Format d'export</label>
            <Select 
              value={exportOptions.format} 
              onValueChange={(value) => setExportOptions(prev => ({...prev, format: value}))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv-basic">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    CSV Standard
                  </div>
                </SelectItem>
                <SelectItem value="csv-extended">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    CSV Détaillé (avec priorités)
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    JSON Complet
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Contenu à inclure</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="weights"
                  checked={exportOptions.includeWeights}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({...prev, includeWeights: checked as boolean}))
                  }
                />
                <label htmlFor="weights" className="text-sm">Pondérations des critères</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="statistics"
                  checked={exportOptions.includeStatistics}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({...prev, includeStatistics: checked as boolean}))
                  }
                />
                <label htmlFor="statistics" className="text-sm">Statistiques sectorielles</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="details"
                  checked={exportOptions.includeDetails}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({...prev, includeDetails: checked as boolean}))
                  }
                />
                <label htmlFor="details" className="text-sm">Détails de priorisation</label>
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-gray-600">
                <strong>{projects.length}</strong> projet(s) à exporter
              </div>
              {projects.length > 0 && (
                <Badge variant="outline" className="mt-2">
                  Format: {exportOptions.format.toUpperCase()}
                </Badge>
              )}
            </CardContent>
          </Card>

          <Button onClick={handleExport} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedExportButton;
