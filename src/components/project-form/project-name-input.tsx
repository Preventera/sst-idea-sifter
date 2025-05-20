
import React from "react";
import { Input } from "@/components/ui/input";

interface ProjectNameInputProps {
  name: string;
  setName: (name: string) => void;
}

const ProjectNameInput = ({ name, setName }: ProjectNameInputProps) => {
  return (
    <div className="mb-6">
      <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-1">
        Nom / Description du projet
      </label>
      <Input
        id="project-name"
        placeholder="Ex: Caméra intelligente pour détecter le non-port des EPI"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full"
      />
    </div>
  );
};

export default ProjectNameInput;
