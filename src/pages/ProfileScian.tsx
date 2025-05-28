
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Building, Users, Shield, Settings, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EntrepriseTab from "@/components/profile-scian/entreprise-tab";
import ActeursTab from "@/components/profile-scian/acteurs-tab";
import PolitiquesHseTab from "@/components/profile-scian/politiques-hse-tab";
import SystemeSstTab from "@/components/profile-scian/systeme-sst-tab";
import ProfilRisqueTab from "@/components/profile-scian/profil-risque-tab";

const ProfileScian = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("entreprise");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                Questionnaire IGNITIA - Profil SCIAN HSE
              </h1>
            </div>
            <p className="text-gray-600">
              Configuration du profil utilisateur pour l'évaluation des risques en santé, sécurité et environnement
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profil SCIAN HSE</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="entreprise" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Entreprise
                </TabsTrigger>
                <TabsTrigger value="acteurs" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Acteurs
                </TabsTrigger>
                <TabsTrigger value="politiques-hse" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Politiques HSE
                </TabsTrigger>
                <TabsTrigger value="systeme-sst" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Système SST
                </TabsTrigger>
                <TabsTrigger value="profil-risque" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Profil de Risque
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="entreprise">
                  <EntrepriseTab />
                </TabsContent>
                
                <TabsContent value="acteurs">
                  <ActeursTab />
                </TabsContent>
                
                <TabsContent value="politiques-hse">
                  <PolitiquesHseTab />
                </TabsContent>
                
                <TabsContent value="systeme-sst">
                  <SystemeSstTab />
                </TabsContent>
                
                <TabsContent value="profil-risque">
                  <ProfilRisqueTab />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileScian;
