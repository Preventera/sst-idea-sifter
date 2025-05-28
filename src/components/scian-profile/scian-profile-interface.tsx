
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StandardProfile from './standard-profile';
import AdvancedProfile from './advanced-profile';

const SCIANProfileInterface = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profils SCIAN - Priorisation IA en SST
          </h1>
          <p className="text-gray-600">
            Analysez et gérez les profils de secteurs d'activité pour optimiser l'implémentation de l'IA en santé et sécurité au travail.
          </p>
        </div>

        {/* Interface à onglets */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="standard" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="standard">Profil Standard</TabsTrigger>
                <TabsTrigger value="advanced">Profil Avancé</TabsTrigger>
              </TabsList>
              
              <TabsContent value="standard" className="mt-6">
                <StandardProfile />
              </TabsContent>
              
              <TabsContent value="advanced" className="mt-6">
                <AdvancedProfile />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SCIANProfileInterface;
