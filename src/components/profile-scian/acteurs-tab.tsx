
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ActeursTab = () => {
  const [acteurs, setActeurs] = useState({
    direction: false,
    rh: false,
    sst: false,
    syndicats: false,
    employes: false,
    comitesSst: false,
    consultants: false,
    organismes: false
  });

  const [details, setDetails] = useState({
    responsableSst: "",
    comiteSstNom: "",
    consultantNom: "",
    organismesPartenaires: ""
  });

  const acteursOptions = [
    { id: "direction", label: "Direction générale", description: "Engagement de la haute direction" },
    { id: "rh", label: "Ressources humaines", description: "Gestion du personnel et formation" },
    { id: "sst", label: "Service SST", description: "Responsable santé-sécurité au travail" },
    { id: "syndicats", label: "Représentants syndicaux", description: "Délégués syndicaux et comités" },
    { id: "employes", label: "Employés", description: "Travailleurs de première ligne" },
    { id: "comitesSst", label: "Comités SST", description: "Comités paritaires de santé-sécurité" },
    { id: "consultants", label: "Consultants externes", description: "Experts en SST et hygiène industrielle" },
    { id: "organismes", label: "Organismes partenaires", description: "CNESST, ASP, associations sectorielles" }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Acteurs impliqués dans la SST</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {acteursOptions.map((acteur) => (
          <Card key={acteur.id} className="p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id={acteur.id}
                checked={acteurs[acteur.id as keyof typeof acteurs]}
                onCheckedChange={(checked) => 
                  setActeurs({...acteurs, [acteur.id]: checked})
                }
              />
              <div className="flex-1">
                <Label htmlFor={acteur.id} className="font-medium">
                  {acteur.label}
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  {acteur.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-4 mt-8">
        <h4 className="font-medium">Détails des acteurs sélectionnés</h4>
        
        {acteurs.sst && (
          <div>
            <Label htmlFor="responsable-sst">Responsable SST principal</Label>
            <Input
              id="responsable-sst"
              placeholder="Nom et fonction du responsable SST"
              value={details.responsableSst}
              onChange={(e) => setDetails({...details, responsableSst: e.target.value})}
            />
          </div>
        )}

        {acteurs.comitesSst && (
          <div>
            <Label htmlFor="comite-sst">Comité SST</Label>
            <Input
              id="comite-sst"
              placeholder="Nom et composition du comité SST"
              value={details.comiteSstNom}
              onChange={(e) => setDetails({...details, comiteSstNom: e.target.value})}
            />
          </div>
        )}

        {acteurs.consultants && (
          <div>
            <Label htmlFor="consultant">Consultants externes</Label>
            <Input
              id="consultant"
              placeholder="Nom des firmes de consultation"
              value={details.consultantNom}
              onChange={(e) => setDetails({...details, consultantNom: e.target.value})}
            />
          </div>
        )}

        {acteurs.organismes && (
          <div>
            <Label htmlFor="organismes">Organismes partenaires</Label>
            <Textarea
              id="organismes"
              placeholder="CNESST, ASP sectorielles, autres partenaires..."
              value={details.organismesPartenaires}
              onChange={(e) => setDetails({...details, organismesPartenaires: e.target.value})}
              rows={3}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ActeursTab;
