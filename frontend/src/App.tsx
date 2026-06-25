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
import AccueilSadPage from "./pages/AccueilSadPage";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import DataViewer from "./pages/DataViewer";
import NotFound from "./pages/NotFound";
import Dashboard1 from "./pages/Dashboard1";
import Dashboard2 from "./pages/Dashboard2";
import DashboardCartographique from "./pages/DashboardCartographique";
import DashboardCartoMetier from "./pages/DashboardCartoMetier";
import DashboardQualiteReglementaire from "./pages/DashboardQualiteReglementaire";
import DashboardScenarios from "./pages/DashboardScenarios";
import DashboardPollution from "./pages/DashboardPollution";
import DashboardDataQuality from "./pages/DashboardDataQuality";
import DashboardAdministration from "./pages/DashboardAdministration";
import PollutionIdpDevPage from "./pages/PollutionIdpDevPage";
import DataScanPage from "./pages/admin/DataScanPage";
import DataGovernanceAuditPage from "./pages/admin/DataGovernanceAuditPage";
import PasswordResetRequestsPage from "./pages/admin/PasswordResetRequestsPage";
import UsersAuditHubPage from "./pages/admin/UsersAuditHubPage";
import IngestionPage from "./pages/admin/IngestionPage";
import PopupRulesPage from "./pages/admin/PopupRulesPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import MetauxPage from "./pages/qualite/MetauxPage";
import { getAuthSession, hasAnyPermission } from "./lib/authz";

const queryClient = new QueryClient();
const DecisionDashboardTest = React.lazy(() => import("./pages/DecisionDashboardTest"));

function AdminOnly({ children }: { children: JSX.Element }) {
  const auth = getAuthSession();
  const canManageUsers = hasAnyPermission(
    ["security.users.manage", "security.password_reset.manage", "security.logs.read"],
    auth.permissions,
  );
  return canManageUsers ? children : <Navigate to="/" replace />;
}

function AuthenticatedOnly({ children }: { children: JSX.Element }) {
  const isAuthenticated = !!getAuthSession().accessToken;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PermissionOnly({
  permissions,
  children,
}: {
  permissions: string[];
  children: JSX.Element;
}) {
  const auth = getAuthSession();
  if (!auth.accessToken) {
    return <Navigate to="/login" replace />;
  }
  return hasAnyPermission(permissions, auth.permissions) ? children : <Navigate to="/" replace />;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<AccueilSadPage />} />
        <Route path="accueil-sad" element={<AccueilSadPage />} />
        <Route path="landing" element={<LandingPage />} />
        <Route path="dashboard" element={<Dashboard1 />} />
        <Route path="dashboard-cartographique" element={<DashboardCartographique />} />
        <Route path="dashboard-carto-metier" element={<DashboardCartoMetier />} />
        <Route path="dashboard-qualite-reglementaire" element={<DashboardQualiteReglementaire />} />
        <Route path="dashboard-data-qa" element={<DashboardDataQuality />} />
        <Route path="dashboard-2" element={<Navigate to="/dashboard-carto-metier" replace />} />
        <Route path="carte" element={<Dashboard2 />} />
        <Route path="dashboard-analytique" element={<Navigate to="/dashboard-carto-metier" replace />} />
        <Route path="analyses" element={<Navigate to="/dashboard-carto-metier" replace />} />
        <Route path="dashboard-scenarios" element={<DashboardScenarios />} />
        <Route path="dashboard-pollution" element={<DashboardPollution />} />
        <Route path="pollution" element={<DashboardPollution />} />
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
        <Route path="expert" element={<Navigate to="/dashboard-data-qa" replace />} />
        <Route path="administration" element={<DashboardAdministration />} />
        <Route
          path="admin/data-governance/audit"
          element={
            <PermissionOnly permissions={["data_admin.audit.read"]}>
              <DataGovernanceAuditPage />
            </PermissionOnly>
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
