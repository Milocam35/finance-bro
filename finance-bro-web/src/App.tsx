import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import Credits from "./pages/Credits";
import MortgageLoans from "./pages/MortgageLoans";
import VehicleCredits from "./pages/VehicleCredits";
import EducationCredits from "./pages/EducationCredits";
import InversionCredits from "./pages/InversionCredits";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import NotFound from "./pages/NotFound";
import { ScrollToTop } from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/creditos" element={<Credits />} />
          <Route path="/creditos-hipotecarios" element={<MortgageLoans />} />
          <Route path="/creditos-vehiculo" element={<VehicleCredits />} />
          <Route path="/creditos-educativos" element={<EducationCredits />} />
          <Route path="/creditos-libre-inversion" element={<InversionCredits />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
