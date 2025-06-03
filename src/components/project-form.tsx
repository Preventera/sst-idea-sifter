// src/components/project-form.tsx

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SCIAN_SECTORS } from "../data/scian-sectors";
import { Project } from "../types/project";

interface ProjectFormProps {
  onAddProject: (project: Project) => void;
  editingProject: Project | null;
  onUpdateProject: (p: Project) => void;
  onCancelEdit: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  onAddProject,
  editingProject,
  onUpdateProject,
  onCancelEdit,
}) => {
  // États pour les champs du formulaire
  const [name, setName] = useState<string>(editingProject?.name ?? "");
  const [scores, setScores] = useState<{
    impact: number;
    excellence: number;
    faisabilite: number;
    gouvernance: number;
    securite: number;
    acceptabilite: number;
    perennite: number;
  }>(
    editingProject?.scores ?? {
      impact: 5,
      excellence: 5,
      faisabilite: 5,
      gouvernance: 5,
      securite: 5,
      acceptabilite: 5,
      perennite: 5,
    }
  );
  const [scianSectorId, setScianSectorId] = useState<string>(
    editingProject?.scianSectorId ?? ""
  );

  // Si on entre en mode édition, on préremplit les champs
  useEffect(() => {
    if (editingProject) {
      setName(editingProject.name);
      setScores(editingProject.scores);
      setScianSectorId(editingProject.scianSectorId ?? "");
    }
  }, [editingProject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculer le score moyen à partir des critères
    const sumScores =
      scores.impact +
      scores.excellence +
      scores.faisabilite +
      scores.gouvernance +
      scores.securite +
      scores.acceptabilite +
      scores.perennite;
    const averageScore = Math.round((sumScores / 7) * 100) / 100;

    const newProject: Project = {
      id: editingProject ? editingProject.id : Date.now().toString(),
      name: name.trim(),
      ideas: editingProject?.ideas ?? [],
      scores,
      score: averageScore,
      scianSectorId: scianSectorId || null,
      priority: editingProject?.priority ?? null,
      created_at: editingProject?.created_at ?? new Date(),
      updated_at: new Date(),
    };

    if (editingProject) {
      onUpdateProject(newProject);
    } else {
      onAddProject(newProject);
    }

    // Réinitialiser le formulaire si on créait un nouveau projet
    if (!editingProject) {
      setName("");
      setScores({
        impact: 5,
        excellence: 5,
        faisabilite: 5,
        gouvernance: 5,
        securite: 5,
        acceptabilite: 5,
        perennite: 5,
      });
      setScianSectorId("");
    } else {
      // En cas d’édition, annuler le mode édition
      onCancelEdit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-6">
      {/* Nom / Description du projet */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Nom / Description</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex : Caméra pour détecter le non-port des EPI"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Sélecteur de secteur SCIAN */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Secteur SCIAN (optionnel)
        </label>
        <Select value={scianSectorId} onValueChange={(val) => setScianSectorId(val)}>
          <SelectTrigger className="mt-1 w-full">
            <SelectValue placeholder="Choisissez un secteur …" />
          </SelectTrigger>
          <SelectContent>
            {SCIAN_SECTORS.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sliders pour chacun des 7 critères */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Impact et pertinence en SST : {scores.impact}
          </label>
          <input
            type="range"
            min={0}
            max={10}
            value={scores.impact}
            onChange={(e) =>
              setScores((prev) => ({ ...prev, impact: Number(e.target.value) }))
            }
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Excellence scientifique : {scores.excellence}
          </label>
          <input
            type="range"
            min={0}
            max={10}
            value={scores.excellence}
            onChange={(e) =>
              setScores((prev) => ({ ...prev, excellence: Number(e.target.value) }))
            }
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Faisabilité et maturité : {scores.faisabilite}
          </label>
          <input
            type="range"
            min={0}
            max={10}
            value={scores.faisabilite}
            onChange={(e) =>
              setScores((prev) => ({ ...prev, faisabilite: Number(e.target.value) }))
            }
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gouvernance & éthique : {scores.gouvernance}
          </label>
          <input
            type="range"
            min={0}
            max={10}
            value={scores.gouvernance}
            onChange={(e) =>
              setScores((prev) => ({ ...prev, gouvernance: Number(e.target.value) }))
            }
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sécurité & risques : {scores.securite}
          </label>
          <input
            type="range"
            min={0}
            max={10}
            value={scores.securite}
            onChange={(e) =>
              setScores((prev) => ({ ...prev, securite: Number(e.target.value) }))
            }
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Acceptabilité : {scores.acceptabilite}
          </label>
          <input
            type="range"
            min={0}
            max={10}
            value={scores.acceptabilite}
            onChange={(e) =>
              setScores((prev) => ({ ...prev, acceptabilite: Number(e.target.value) }))
            }
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pérennité : {scores.perennite}
          </label>
          <input
            type="range"
            min={0}
            max={10}
            value={scores.perennite}
            onChange={(e) =>
              setScores((prev) => ({ ...prev, perennite: Number(e.target.value) }))
            }
            className="w-full"
          />
        </div>
      </div>

      {/* Boutons d’ajout / mise à jour ou annulation */}
      <div className="pt-4">
        <Button type="submit">
          {editingProject ? "Mettre à jour le projet" : "Ajouter le projet"}
        </Button>
        {editingProject && (
          <Button
            variant="outline"
            className="ml-2"
            onClick={(e) => {
              e.preventDefault();
              onCancelEdit();
            }}
          >
            Annuler
          </Button>
        )}
      </div>
    </form>
  );
};

export default ProjectForm;
