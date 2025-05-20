
import React from "react";
import CriteriaSlider from "../criteria-slider";
import { criteriaDescriptions } from "./criteria-descriptions";
import { Criteria } from "../../types/project";

interface StandardCriteriaProps {
  criteria: Criteria;
  updateCriteria: (key: keyof Criteria, value: number) => void;
}

const StandardCriteria = ({ criteria, updateCriteria }: StandardCriteriaProps) => {
  return (
    <div className="space-y-2">
      <CriteriaSlider
        label="Impact et pertinence en SST"
        description={criteriaDescriptions.impact}
        value={criteria.impact}
        onChange={(value) => updateCriteria("impact", value)}
        colorClass="bg-sst-blue"
      />
      <CriteriaSlider
        label="Excellence scientifique et innovation"
        description={criteriaDescriptions.excellence}
        value={criteria.excellence}
        onChange={(value) => updateCriteria("excellence", value)}
        colorClass="bg-sst-blue"
      />
      <CriteriaSlider
        label="Faisabilité et maturité du projet"
        description={criteriaDescriptions.faisabilite}
        value={criteria.faisabilite}
        onChange={(value) => updateCriteria("faisabilite", value)}
        colorClass="bg-sst-blue"
      />
      <CriteriaSlider
        label="Gouvernance, éthique et conformité"
        description={criteriaDescriptions.gouvernance}
        value={criteria.gouvernance}
        onChange={(value) => updateCriteria("gouvernance", value)}
        colorClass="bg-sst-dark-blue"
      />
      <CriteriaSlider
        label="Sécurité, robustesse et gestion des risques"
        description={criteriaDescriptions.securite}
        value={criteria.securite}
        onChange={(value) => updateCriteria("securite", value)}
        colorClass="bg-sst-dark-blue"
      />
      <CriteriaSlider
        label="Acceptabilité et valeur pour les parties prenantes"
        description={criteriaDescriptions.acceptabilite}
        value={criteria.acceptabilite}
        onChange={(value) => updateCriteria("acceptabilite", value)}
        colorClass="bg-sst-dark-blue"
      />
      <CriteriaSlider
        label="Exploitation, diffusion et pérennité"
        description={criteriaDescriptions.perennite}
        value={criteria.perennite}
        onChange={(value) => updateCriteria("perennite", value)}
        colorClass="bg-sst-dark-blue"
      />
    </div>
  );
};

export default StandardCriteria;
