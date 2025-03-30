import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MantrasPage from "./pages/MantrasPage";
import LiveDarshan from "./pages/LiveDarshan";
import SacredTexts from "./pages/SacredTexts";
import UserSettings from "./pages/UserSettings";
import PujaRituals from "./pages/PujaRituals";
import SplashScreen from "./components/auth/SplashScreen";
import FindPriests from "./pages/FindPriests";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  
  // Handle when splash screen completes (user can skip the splash screen)
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {showSplash ? (
              <Route path="*" element={<SplashScreen mode="splash" onComplete={handleSplashComplete} />} />
            ) : (
              <>
                <Route path="/" element={
                  localStorage.getItem('isLoggedIn') === 'true' ? 
                  <Index /> : 
                  <Navigate to="/login" replace />
                } />
                <Route path="/login" element={<SplashScreen mode="login" />} />
                <Route path="/mantras" element={<MantrasPage />} />
                <Route path="/darshan" element={<LiveDarshan />} />
                <Route path="/puja-rituals" element={<PujaRituals />} />
                <Route path="/find-priests" element={<FindPriests />} />
                <Route path="/pdf-reader" element={<SacredTexts />} />
                <Route path="/settings" element={<UserSettings />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
