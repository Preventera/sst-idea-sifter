
import React from "react";
import { Button } from "@/components/ui/button";
import { Project } from "../types/project";

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
      "Impact",
      "Confiance",
      "Facilité",
      "Acceptabilité",
      "Valeur Réglementaire",
      "Alignement Éthique",
      "Score Global"
    ];

    // Trier les projets par score
    const sortedProjects = [...projects].sort((a, b) => b.score - a.score);

    // Créer les lignes de données
    const dataRows = sortedProjects.map((project, index) => [
      (index + 1).toString(),
      project.name,
      project.criteria.impact.toString(),
      project.criteria.confiance.toString(),
      project.criteria.facilite.toString(),
      project.criteria.acceptabilite.toString(),
      project.criteria.valeurReglementaire.toString(),
      project.criteria.alignementEthique.toString(),
      project.score.toString()
    ]);

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
