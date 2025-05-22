
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Project } from "../types/project";
import { getScoreColor } from "./criteria-slider";
import { getPriorityText } from "../data/scian-sectors";

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectList = ({ projects, onEdit, onDelete }: ProjectListProps) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <p className="text-gray-500">Aucun projet ajouté pour le moment.</p>
        <p className="text-gray-500 text-sm mt-2">
          Utilisez le formulaire ci-dessus pour ajouter votre premier projet.
        </p>
      </div>
    );
  }

  const sortedProjects = [...projects].sort((a, b) => {
    // D'abord par priorité sectorielle (si disponible)
    if (a.priority && b.priority) {
      if (a.priority.score !== b.priority.score) {
        return b.priority.score - a.priority.score;
      }
    } else if (a.priority) {
      return -1; // a a une priorité, b n'en a pas
    } else if (b.priority) {
      return 1; // b a une priorité, a n'en a pas
    }
    
    // Ensuite par score de critères
    return b.score - a.score;
  });

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Rang</TableHead>
            <TableHead>Projet</TableHead>
            <TableHead className="hidden md:table-cell">Impact</TableHead>
            <TableHead className="hidden md:table-cell">Excel.</TableHead>
            <TableHead className="hidden md:table-cell">Faisab.</TableHead>
            <TableHead className="hidden lg:table-cell">Gouv.</TableHead>
            <TableHead className="hidden lg:table-cell">Sécurité</TableHead>
            <TableHead className="hidden lg:table-cell">Accept.</TableHead>
            <TableHead className="hidden lg:table-cell">Péren.</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Priorité</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProjects.map((project, index) => (
            <TableRow key={project.id} className={index === 0 ? "bg-blue-50" : ""}>
              <TableCell className="font-bold text-center">
                {index + 1}
                {index === 0 && (
                  <span className="block text-xs font-normal text-blue-600">Top</span>
                )}
              </TableCell>
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell className="hidden md:table-cell">{project.criteria.impact}</TableCell>
              <TableCell className="hidden md:table-cell">{project.criteria.excellence}</TableCell>
              <TableCell className="hidden md:table-cell">{project.criteria.faisabilite}</TableCell>
              <TableCell className="hidden lg:table-cell">{project.criteria.gouvernance}</TableCell>
              <TableCell className="hidden lg:table-cell">{project.criteria.securite}</TableCell>
              <TableCell className="hidden lg:table-cell">{project.criteria.acceptabilite}</TableCell>
              <TableCell className="hidden lg:table-cell">{project.criteria.perennite}</TableCell>
              <TableCell>
                <Badge className={`text-base px-2 ${getScoreColor(project.score).replace('bg-', 'bg-opacity-50 bg-')}`}>
                  {project.score}
                </Badge>
                <div className="md:hidden mt-2 grid grid-cols-3 gap-1">
                  <span className="text-xs">I: {project.criteria.impact}</span>
                  <span className="text-xs">E: {project.criteria.excellence}</span>
                  <span className="text-xs">F: {project.criteria.faisabilite}</span>
                  <span className="text-xs">G: {project.criteria.gouvernance}</span>
                  <span className="text-xs">S: {project.criteria.securite}</span>
                  <span className="text-xs">A: {project.criteria.acceptabilite}</span>
                  <span className="text-xs">P: {project.criteria.perennite}</span>
                </div>
              </TableCell>
              <TableCell>
                {project.priority ? (
                  <Badge className={`text-xs px-2 ${project.priority.level === 'high' ? 'bg-green-100 text-green-700' : project.priority.level === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {getPriorityText(project.priority.level)}
                  </Badge>
                ) : (
                  <span className="text-xs text-gray-500">Non définie</span>
                )}
              </TableCell>
              <TableCell className="text-right space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(project)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Éditer</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(project.id)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Supprimer</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectList;
