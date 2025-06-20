// src/App.tsx
// Version complète avec route XAI intégrée

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProfileScianRefactored from "./pages/ProfileScianRefactored";
import ProjectFormPage from "./pages/ProjectForm"; // 🆕 AJOUT
import ProjectFormXAI from "./pages/ProjectFormXAI"; // 🆕 NOUVEAU: Import route XAI
import NotFound from "./pages/NotFound";
import TestAI from "./pages/TestAI";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profile-scian" element={<ProfileScianRefactored />} />
          <Route path="/project/new" element={<ProjectFormPage />} /> {/* 🆕 ROUTE EXISTANTE */}
          <Route path="/project/new-xai" element={<ProjectFormXAI />} /> {/* 🆕 NOUVELLE ROUTE XAI */}
          <Route path="/test-ai" element={<TestAI />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;