
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const SystemeSstTab = () => {
  const [systemeSelectionne, setSystemeSelectionne] = useState("");
  const [composantes, setComposantes] = useState<Record<string, boolean>>({});

  const systemesSst = [
    {
      id: "iso45001",
      nom: "ISO 45001:2018",
      description: "Système de management de la santé et de la sécurité au travail",
      composantes: [
        "Contexte de l'organisme",
        "Leadership et participation des travailleurs", 
        "Planification",
        "Support",
        "Fonctionnement",
        "Évaluation des performances",
        "Amélioration"
      ]
    },
    {
      id: "csaz1000",
      nom: "CSA Z1000",
      description: "Gestion de la santé et sécurité au travail",
      composantes: [
        "Politique et engagement",
        "Planification",
        "Mise en œuvre",
        "Évaluation et mesures correctives"
      ]
    },
    {
      id: "iloosh",
      nom: "ILO-OSH 2001",
      description: "Principes directeurs concernant les systèmes de gestion de la sécurité et de la santé au travail",
      composantes: [
        "Politique",
        "Organisation",
        "Planification et mise en œuvre", 
        "Évaluation",
        "Action en vue d'améliorations"
      ]
    },
    {
      id: "ohsas18001",
      nom: "OHSAS 18001",
      description: "Système de management de la santé et sécurité au travail (obsolète)",
      composantes: [
        "Politique SST",
        "Planification",
        "Mise en œuvre et fonctionnement",
        "Vérification",
        "Revue de direction"
      ]
    },
    {
      id: "personalise",
      nom: "Système personnalisé",
      description: "Système développé spécifiquement pour l'organisation",
      composantes: [
        "Politique et objectifs",
        "Responsabilités",
        "Formation et sensibilisation",
        "Communication",
        "Documentation",
        "Contrôle opérationnel",
        "Préparation aux urgences",
        "Surveillance et mesure",
        "Enquêtes d'incidents",
        "Audits internes",
        "Revue de direction"
      ]
    }
  ];

  const systemeActuel = systemesSst.find(s => s.id === systemeSelectionne);

  const handleComposanteChange = (composante: string, checked: boolean) => {
    setComposantes(prev => ({
      ...prev,
      [composante]: checked
    }));
  };

  const getImplementationLevel = () => {
    if (!systemeActuel) return 0;
    const implementees = Object.values(composantes).filter(Boolean).length;
    const total = systemeActuel.composantes.length;
    return Math.round((implementees / total) * 100);
  };

  const getNiveauCouleur = (niveau: number) => {
    if (niveau >= 80) return "bg-green-100 text-green-800";
    if (niveau >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Système de gestion SST</h3>
      
      <div>
        <Label htmlFor="systeme-sst">Système SST utilisé</Label>
        <Select value={systemeSelectionne} onValueChange={setSystemeSelectionne}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un système SST" />
          </SelectTrigger>
          <SelectContent>
            {systemesSst.map((systeme) => (
              <SelectItem key={systeme.id} value={systeme.id}>
                <div>
                  <div className="font-medium">{systeme.nom}</div>
                  <div className="text-sm text-gray-600">{systeme.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {systemeActuel && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">{systemeActuel.nom}</CardTitle>
              <Badge className={getNiveauCouleur(getImplementationLevel())}>
                {getImplementationLevel()}% implémenté
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{systemeActuel.description}</p>
          </CardHeader>
          <CardContent>
            <h4 className="font-medium mb-4">Composantes implémentées</h4>
            <div className="space-y-3">
              {systemeActuel.composantes.map((composante) => (
                <div key={composante} className="flex items-center space-x-3">
                  <Checkbox
                    id={composante}
                    checked={composantes[composante] || false}
                    onCheckedChange={(checked) => handleComposanteChange(composante, checked as boolean)}
                  />
                  <Label htmlFor={composante} className="text-sm">
                    {composante}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recommandations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="text-gray-600">
              📋 <strong>ISO 45001:2018</strong> est le standard international le plus récent
            </p>
            <p className="text-gray-600">
              🇨🇦 <strong>CSA Z1000</strong> est spécifiquement conçu pour le contexte canadien
            </p>
            <p className="text-gray-600">
              🌍 <strong>ILO-OSH 2001</strong> offre des principes directeurs flexibles
            </p>
            {getImplementationLevel() < 50 && (
              <p className="text-orange-600 font-medium">
                ⚠️ Votre niveau d'implémentation est faible. Priorisez les composantes essentielles.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemeSstTab;
