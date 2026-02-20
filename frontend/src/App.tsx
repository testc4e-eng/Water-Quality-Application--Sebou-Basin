/* frontend/src/App.tsx */
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import Layout from "./components/Layout/Layout";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import DataViewer from "./pages/DataViewer";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Dashboard2 from "./pages/Dashboard2";
import DashboardClimate from "./pages/DashboardClimate";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard-2" element={<Dashboard2 />} />
        <Route path="dashboard-climate" element={<DashboardClimate />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="data" element={<DataViewer />} />
      </Route>

      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="*" element={<NotFound />} />
    </>
  ),
  {
    // ✅ ici c’est OK
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* ✅ PAS de prop "future" ici */}
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
