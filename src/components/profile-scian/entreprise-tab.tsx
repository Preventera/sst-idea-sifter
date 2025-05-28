
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SCIAN_SECTORS } from "@/data/scian-sectors";

const EntrepriseTab = () => {
  const [formData, setFormData] = useState({
    nomEntreprise: "",
    codeScian: "",
    secteurActivite: "",
    tailleEntreprise: "",
    adresse: "",
    telephone: "",
    email: ""
  });

  const taillesEntreprise = [
    "1-9 employés (Très petite entreprise)",
    "10-49 employés (Petite entreprise)", 
    "50-249 employés (Moyenne entreprise)",
    "250-499 employés (Grande entreprise)",
    "500+ employés (Très grande entreprise)"
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Informations de l'entreprise</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nom-entreprise">Nom de l'entreprise</Label>
          <Input
            id="nom-entreprise"
            placeholder="Nom complet de l'entreprise"
            value={formData.nomEntreprise}
            onChange={(e) => setFormData({...formData, nomEntreprise: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="code-scian">Code SCIAN</Label>
          <Input
            id="code-scian"
            placeholder="Ex: 23621"
            value={formData.codeScian}
            onChange={(e) => setFormData({...formData, codeScian: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="secteur-activite">Secteur d'activité</Label>
          <Select 
            value={formData.secteurActivite} 
            onValueChange={(value) => setFormData({...formData, secteurActivite: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un secteur" />
            </SelectTrigger>
            <SelectContent>
              {SCIAN_SECTORS.map((sector) => (
                <SelectItem key={sector.id} value={sector.id}>
                  {sector.name} ({sector.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="taille-entreprise">Taille de l'entreprise</Label>
          <Select 
            value={formData.tailleEntreprise} 
            onValueChange={(value) => setFormData({...formData, tailleEntreprise: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner la taille" />
            </SelectTrigger>
            <SelectContent>
              {taillesEntreprise.map((taille) => (
                <SelectItem key={taille} value={taille}>
                  {taille}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="adresse">Adresse</Label>
          <Input
            id="adresse"
            placeholder="Adresse complète"
            value={formData.adresse}
            onChange={(e) => setFormData({...formData, adresse: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="telephone">Téléphone</Label>
          <Input
            id="telephone"
            placeholder="(XXX) XXX-XXXX"
            value={formData.telephone}
            onChange={(e) => setFormData({...formData, telephone: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="contact@entreprise.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
      </div>
    </div>
  );
};

export default EntrepriseTab;
