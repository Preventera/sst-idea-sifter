
import React from "react";
import { Button } from "@/components/ui/button";
import { Project } from "../types/project";
import { SCIAN_SECTORS, getPriorityText } from "../data/scian-sectors";

interface ExportButtonProps {
  projects: Project[];
}

const ExportButton = ({ projects }: ExportButtonProps) => {
  const exportToCSV = () => {
    if (projects.length === 0) return;

    // Créer les en-têtes CSV
    const headers = [
      "Rang",
      "Projet",
      "Secteur SCIAN",
      "Priorité sectorielle",
      "Impact",
      "Excellence",
      "Faisabilité",
      "Gouvernance",
      "Sécurité",
      "Acceptabilité",
      "Pérennité",
      "Score Global"
    ];

    // Trier les projets par priorité puis par score
    const sortedProjects = [...projects].sort((a, b) => {
      if (a.priority && b.priority) {
        if (a.priority.score !== b.priority.score) {
          return b.priority.score - a.priority.score;
        }
      } else if (a.priority) {
        return -1;
      } else if (b.priority) {
        return 1;
      }
      return b.score - a.score;
    });

    // Créer les lignes de données
    const dataRows = sortedProjects.map((project, index) => {
      const sectorName = project.scianSectorId 
        ? SCIAN_SECTORS.find(s => s.id === project.scianSectorId)?.name || '-' 
        : '-';
      
      const priority = project.priority 
        ? getPriorityText(project.priority.level) 
        : '-';
        
      return [
        (index + 1).toString(),
        project.name,
        sectorName,
        priority,
        project.criteria.impact.toString(),
        project.criteria.excellence.toString(),
        project.criteria.faisabilite.toString(),
        project.criteria.gouvernance.toString(),
        project.criteria.securite.toString(),
        project.criteria.acceptabilite.toString(),
        project.criteria.perennite.toString(),
        project.score.toString()
      ];
    });

    // Combiner les en-têtes et les données
    const csvContent = [
      headers.join(";"),
      ...dataRows.map(row => row.join(";"))
    ].join("\n");

    // Créer un blob et un lien de téléchargement
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    const date = new Date().toISOString().slice(0, 10);
    link.setAttribute("href", url);
    link.setAttribute("download", `priorisation-projets-ia-sst_${date}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      variant="outline"
      onClick={exportToCSV}
      disabled={projects.length === 0}
      className="ml-auto"
    >
      Exporter en CSV
    </Button>
  );
};

export default ExportButton;
