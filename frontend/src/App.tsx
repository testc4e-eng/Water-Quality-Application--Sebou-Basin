/* frontend/src/App.tsx */
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Navigate,
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
import Dashboard1 from "./pages/Dashboard1";
import Dashboard2 from "./pages/Dashboard2";
import DashboardAnalytique from "./pages/DashboardAnalytique";
import DashboardCartographique from "./pages/DashboardCartographique";
import DashboardCartoMetier from "./pages/DashboardCartoMetier";
import DashboardQualiteReglementaire from "./pages/DashboardQualiteReglementaire";
import DashboardScenarios from "./pages/DashboardScenarios";
import DashboardPollution from "./pages/DashboardPollution";
import PollutionIdpDevPage from "./pages/PollutionIdpDevPage";
import DataScanPage from "./pages/admin/DataScanPage";
import PasswordResetRequestsPage from "./pages/admin/PasswordResetRequestsPage";
import UsersAuditHubPage from "./pages/admin/UsersAuditHubPage";
import IngestionPage from "./pages/admin/IngestionPage";
import PopupRulesPage from "./pages/admin/PopupRulesPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import MetauxPage from "./pages/qualite/MetauxPage";

const queryClient = new QueryClient();
const DecisionDashboardTest = React.lazy(() => import("./pages/DecisionDashboardTest"));

function AdminOnly({ children }: { children: JSX.Element }) {
  const isAdmin = localStorage.getItem("is_superuser") === "true";
  return isAdmin ? children : <Navigate to="/" replace />;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="dashboard" element={<Dashboard1 />} />
        <Route path="dashboard-cartographique" element={<DashboardCartographique />} />
        <Route path="dashboard-carto-metier" element={<DashboardCartoMetier />} />
        <Route path="dashboard-qualite-reglementaire" element={<DashboardQualiteReglementaire />} />
        <Route path="dashboard-2" element={<Dashboard2 />} />
        <Route path="carte" element={<Dashboard2 />} />
        <Route path="dashboard-analytique" element={<DashboardAnalytique />} />
        <Route path="dashboard-scenarios" element={<DashboardScenarios />} />
        <Route path="dashboard-pollution" element={<DashboardPollution />} />
        <Route path="pollution-idp-dev" element={<PollutionIdpDevPage />} />
        <Route path="qualite/metaux" element={<MetauxPage />} />
        <Route
          path="decision-dashboard-test"
          element={
            <Suspense fallback={<div className="p-6 text-sm text-slate-600">Chargement du dashboard test...</div>}>
              <DecisionDashboardTest />
            </Suspense>
          }
        />
        <Route path="admin/data-scan" element={<DataScanPage />} />
        <Route
          path="admin/gestion-users"
          element={
            <AdminOnly>
              <UsersAuditHubPage />
            </AdminOnly>
          }
        />
        <Route
          path="admin/users"
          element={
            <AdminOnly>
              <Navigate to="/admin/gestion-users?mode=users" replace />
            </AdminOnly>
          }
        />
        <Route
          path="admin/password-resets"
          element={
            <AdminOnly>
              <PasswordResetRequestsPage />
            </AdminOnly>
          }
        />
        <Route
          path="admin/audit"
          element={
            <AdminOnly>
              <Navigate to="/admin/gestion-users?mode=audit" replace />
            </AdminOnly>
          }
        />
        <Route
          path="admin/ingestion"
          element={
            <AdminOnly>
              <IngestionPage />
            </AdminOnly>
          }
        />
        <Route
          path="admin/popup-rules"
          element={
            <AdminOnly>
              <PopupRulesPage />
            </AdminOnly>
          }
        />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route
          path="data"
          element={
            <AdminOnly>
              <DataViewer />
            </AdminOnly>
          }
        />
      </Route>

      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
      <Route path="*" element={<NotFound />} />
    </>
  )
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
