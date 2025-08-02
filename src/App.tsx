import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProfileScian from "./pages/ProfileScian";
import TestModelsPage from "./pages/TestModelsPage";
import ModelsPage from "./pages/ModelsPage";
import TestPage from "./pages/TestPage"; // 🆕 NOUVELLE IMPORT
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/profile-scian" element={<ProfileScian />} />
            <Route path="/test-models" element={<TestModelsPage />} />
            <Route path="/models" element={<ModelsPage />} />
            
            {/* 🧪 NOUVELLE ROUTE DE TEST AI ASSISTANT */}
            <Route path="/test" element={<TestPage />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;