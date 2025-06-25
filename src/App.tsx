// src/App.tsx
// Version avec SectorTesterEnhanced + SST Crawler + Système de Modèles Optimisé pour 1000+ éléments

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages existantes
import Index from "./pages/Index";
import ProfileScianRefactored from "./pages/ProfileScianRefactored";
import ProjectFormPage from "./pages/ProjectForm";
import ProjectFormXAI from "./pages/ProjectFormXAI";
import NotFound from "./pages/NotFound";
import TestAI from "./pages/TestAI";

// Import du nouveau testeur avec données CNESST réelles
import SectorTesterEnhanced from "./components/test/SectorTesterEnhanced";

// Import de la page de test SST Crawler
import SSTCrawlerTestPage from "./pages/sst-crawler-test";

// 🚀 NOUVEAU : Import du système de modèles optimisé pour 1000+ éléments
import ModelsPage from "./pages/ModelsPage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        <BrowserRouter>
          <Routes>
            {/* 🏠 Page d'accueil principale */}
            <Route path="/" element={<Index />} />
            
            {/* 👤 Profil SCIAN refactorisé */}
            <Route path="/profile-scian" element={<ProfileScianRefactored />} />
            
            {/* 📝 Formulaires de création de projet */}
            <Route path="/project/new" element={<ProjectFormPage />} />
            <Route path="/project/new-xai" element={<ProjectFormXAI />} />
            
            {/* 🧪 Pages de test et développement */}
            <Route path="/test-ai" element={<TestAI />} />
            
            {/* 📊 Route mise à jour pour utiliser SectorTesterEnhanced avec données CNESST réelles */}
            <Route path="/test-sectors" element={<SectorTesterEnhanced />} />
            
            {/* 🔍 Nouvelle route pour tester l'intégration SST Crawler */}
            <Route path="/sst-crawler-test" element={<SSTCrawlerTestPage />} />
            
            {/* 🎯 NOUVEAU : Route pour le système de modèles optimisé (1000+ modèles) */}
            <Route path="/models" element={<ModelsPage />} />
            
            {/* 🚫 Page 404 pour routes non trouvées */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;