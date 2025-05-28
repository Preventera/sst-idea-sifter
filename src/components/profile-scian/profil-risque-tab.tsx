
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const ProfilRisqueTab = () => {
  const [methodologieSelectionnee, setMethodologieSelectionnee] = useState("");
  const [plateformeSelectionnee, setPlateformeSelectionnee] = useState("");
  const [risquesSpecifiques, setRisquesSpecifiques] = useState<Record<string, boolean>>({});

  const methodologiesAnalyse = [
    "Analyse préliminaire des risques (APR)",
    "Analyse des modes de défaillance (AMDE/AMDEC)",
    "Méthode HAZOP",
    "Analyse par arbre de défaillance",
    "Analyse par arbre d'événements",
    "Méthode What-If",
    "LOPA (Layer of Protection Analysis)",
    "Bow-Tie Analysis",
    "Job Safety Analysis (JSA)",
    "Task Risk Assessment",
    "Évaluation des risques chimiques",
    "Évaluation ergonomique",
    "Analyse des risques psychosociaux",
    "Risk Assessment Matrix"
  ];

  const plateformesNumeriques = [
    "Gensuite",
    "Intelex",
    "Enablon",
    "ProcessMAP",
    "VelocityEHS",
    "Cority",
    "SafetyCulture (iAuditor)",
    "EcoOnline",
    "ChemWatch",
    "SDS Manager", 
    "WHMIS Portal",
    "Safety Management Suite",
    "HSE Mobile Apps",
    "Custom QHSE Platform",
    "Aucune plateforme numérique"
  ];

  const risquesParSecteur = {
    "23": [ // Construction
      "Chutes de hauteur",
      "Écrasement par équipement",
      "Électrocution",
      "Exposition à l'amiante",
      "Bruit et vibrations",
      "Troubles musculo-squelettiques"
    ],
    "31-33": [ // Fabrication
      "Pièces mobiles de machines",
      "Exposition à des substances chimiques",
      "Espaces confinés",
      "Manutention manuelle",
      "Rayonnements",
      "Incendie et explosion"
    ],
    "21": [ // Extraction minière
      "Éboulements et effondrements",
      "Gaz toxiques",
      "Explosions",
      "Poussières de silice",
      "Équipements lourds",
      "Espaces confinés"
    ],
    "default": [
      "Chutes et glissades",
      "Troubles musculo-squelettiques",
      "Stress et fatigue",
      "Exposition à des agents biologiques",
      "Incendie",
      "Violence au travail"
    ]
  };

  const getRisquesDisponibles = () => {
    // Ici on pourrait récupérer le secteur SCIAN depuis le contexte
    return risquesParSecteur["default"];
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Profil de risque et méthodologies</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Méthodologie d'analyse des risques</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={methodologieSelectionnee} onValueChange={setMethodologieSelectionnee}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une méthodologie" />
              </SelectTrigger>
              <SelectContent>
                {methodologiesAnalyse.map((methodo) => (
                  <SelectItem key={methodo} value={methodo}>
                    {methodo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Plateforme numérique QHSE</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={plateformeSelectionnee} onValueChange={setPlateformeSelectionnee}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une plateforme" />
              </SelectTrigger>
              <SelectContent>
                {plateformesNumeriques.map((plateforme) => (
                  <SelectItem key={plateforme} value={plateforme}>
                    {plateforme}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Risques spécifiques identifiés</CardTitle>
          <p className="text-sm text-gray-600">
            Sélectionnez les risques présents dans votre organisation
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {getRisquesDisponibles().map((risque) => (
              <div key={risque} className="flex items-center space-x-2">
                <Checkbox
                  id={risque}
                  checked={risquesSpecifiques[risque] || false}
                  onCheckedChange={(checked) => 
                    setRisquesSpecifiques(prev => ({...prev, [risque]: checked as boolean}))
                  }
                />
                <Label htmlFor={risque} className="text-sm">
                  {risque}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contexte organisationnel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="enjeux-internes">Enjeux internes</Label>
            <Textarea
              id="enjeux-internes"
              placeholder="Culture de sécurité, ressources disponibles, structure organisationnelle..."
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="enjeux-externes">Enjeux externes</Label>
            <Textarea
              id="enjeux-externes"
              placeholder="Réglementation, clients, fournisseurs, communauté locale..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="parties-interessees">Parties intéressées pertinentes</Label>
            <Textarea
              id="parties-interessees"
              placeholder="Employés, syndicats, CNESST, clients, sous-traitants..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recommandations IA pour la SST</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">🤖 Détection prédictive</Badge>
              <span className="text-sm">Anticipation des incidents par analyse de données</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">📱 Formation adaptive</Badge>
              <span className="text-sm">Personnalisation des formations selon les profils</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-800">🔍 Surveillance automatisée</Badge>
              <span className="text-sm">Monitoring en temps réel des conditions de travail</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-100 text-orange-800">📊 Analyse comportementale</Badge>
              <span className="text-sm">Identification des comportements à risque</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilRisqueTab;
