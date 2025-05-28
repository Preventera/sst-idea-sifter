
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const PolitiquesHseTab = () => {
  const [politiques, setPolitiques] = useState({
    politiqueSst: false,
    politiqueEnvironnement: false,
    codeEthique: false,
    proceduresUrgence: false,
    formationSst: false,
    enqueteAccident: false,
    inspectionPreventive: false,
    gestionRisques: false
  });

  const [maturite, setMaturite] = useState({
    documentation: "basic",
    application: "basic", 
    suivi: "basic",
    amelioration: "basic"
  });

  const politiquesOptions = [
    { 
      id: "politiqueSst", 
      label: "Politique SST", 
      description: "Politique de santé et sécurité au travail",
      priority: "high"
    },
    { 
      id: "politiqueEnvironnement", 
      label: "Politique environnementale", 
      description: "Gestion des impacts environnementaux",
      priority: "medium"
    },
    { 
      id: "codeEthique", 
      label: "Code d'éthique", 
      description: "Valeurs et comportements attendus",
      priority: "medium"
    },
    { 
      id: "proceduresUrgence", 
      label: "Procédures d'urgence", 
      description: "Plans d'évacuation et mesures d'urgence",
      priority: "high"
    },
    { 
      id: "formationSst", 
      label: "Programme de formation SST", 
      description: "Formation continue en santé-sécurité",
      priority: "high"
    },
    { 
      id: "enqueteAccident", 
      label: "Procédure d'enquête d'accident", 
      description: "Investigation et analyse des incidents",
      priority: "high"
    },
    { 
      id: "inspectionPreventive", 
      label: "Inspections préventives", 
      description: "Programme d'inspection systématique",
      priority: "medium"
    },
    { 
      id: "gestionRisques", 
      label: "Gestion des risques", 
      description: "Identification et contrôle des risques",
      priority: "high"
    }
  ];

  const niveauxMaturite = [
    { value: "basic", label: "De base", color: "bg-red-100 text-red-800" },
    { value: "intermediate", label: "Intermédiaire", color: "bg-yellow-100 text-yellow-800" },
    { value: "advanced", label: "Avancé", color: "bg-green-100 text-green-800" }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Politiques et procédures HSE</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {politiquesOptions.map((politique) => (
          <Card key={politique.id} className="p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id={politique.id}
                checked={politiques[politique.id as keyof typeof politiques]}
                onCheckedChange={(checked) => 
                  setPolitiques({...politiques, [politique.id]: checked})
                }
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor={politique.id} className="font-medium">
                    {politique.label}
                  </Label>
                  <Badge className={getPriorityColor(politique.priority)}>
                    {politique.priority === "high" ? "Essentiel" : "Important"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {politique.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h4 className="font-medium mb-4">Niveau de maturité des politiques HSE</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {niveauxMaturite.map((niveau) => (
                <label key={niveau.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="documentation"
                    value={niveau.value}
                    checked={maturite.documentation === niveau.value}
                    onChange={(e) => setMaturite({...maturite, documentation: e.target.value})}
                    className="text-blue-600"
                  />
                  <Badge className={niveau.color}>{niveau.label}</Badge>
                </label>
              ))}
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {niveauxMaturite.map((niveau) => (
                <label key={niveau.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="application"
                    value={niveau.value}
                    checked={maturite.application === niveau.value}
                    onChange={(e) => setMaturite({...maturite, application: e.target.value})}
                    className="text-blue-600"
                  />
                  <Badge className={niveau.color}>{niveau.label}</Badge>
                </label>
              ))}
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Suivi et contrôle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {niveauxMaturite.map((niveau) => (
                <label key={niveau.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="suivi"
                    value={niveau.value}
                    checked={maturite.suivi === niveau.value}
                    onChange={(e) => setMaturite({...maturite, suivi: e.target.value})}
                    className="text-blue-600"
                  />
                  <Badge className={niveau.color}>{niveau.label}</Badge>
                </label>
              ))}
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Amélioration continue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {niveauxMaturite.map((niveau) => (
                <label key={niveau.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="amelioration"
                    value={niveau.value}
                    checked={maturite.amelioration === niveau.value}
                    onChange={(e) => setMaturite({...maturite, amelioration: e.target.value})}
                    className="text-blue-600"
                  />
                  <Badge className={niveau.color}>{niveau.label}</Badge>
                </label>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PolitiquesHseTab;
