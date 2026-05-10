import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageTransition from "./components/PageTransition";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useLenis } from "@/hooks/useLenis";
import "./styles/ab-bouw.css";

import Home from "./pages/abbouw/Home";
import OverOns from "./pages/abbouw/OverOns";
import Diensten from "./pages/abbouw/Diensten";
import Realisaties from "./pages/abbouw/Realisaties";
import Werkwijze from "./pages/abbouw/Werkwijze";
import Contact from "./pages/abbouw/Contact";
import Construct from "./pages/abbouw/Construct";
import Ecologisch from "./pages/abbouw/Ecologisch";
import Interieur from "./pages/abbouw/Interieur";
import Dakwerken from "./pages/abbouw/Dakwerken";
import Bad from "./pages/abbouw/Bad";
import Gevel from "./pages/abbouw/Gevel";
import Privacy from "./pages/abbouw/Privacy";
import Voorwaarden from "./pages/abbouw/Voorwaarden";
import Cookies from "./pages/abbouw/Cookies";
import Blog from "./pages/abbouw/Blog";
import BlogPost from "./pages/abbouw/BlogPost";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => {
  useLenis();
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/over" element={<OverOns />} />
          <Route path="/diensten" element={<Diensten />} />
          <Route path="/realisaties" element={<Realisaties />} />
          <Route path="/werkwijze" element={<Werkwijze />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/construct" element={<Construct />} />
          <Route path="/ecologisch" element={<Ecologisch />} />
          <Route path="/interieur" element={<Interieur />} />
          <Route path="/dakwerken" element={<Dakwerken />} />
          <Route path="/bad" element={<Bad />} />
          <Route path="/gevel" element={<Gevel />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/voorwaarden" element={<Voorwaarden />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </PageTransition>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
