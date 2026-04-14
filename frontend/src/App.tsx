/* frontend/src/App.tsx */
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
import DashboardScenarios from "./pages/DashboardScenarios";
import DataScanPage from "./pages/admin/DataScanPage";
import PasswordResetRequestsPage from "./pages/admin/PasswordResetRequestsPage";
import UsersAuditHubPage from "./pages/admin/UsersAuditHubPage";
import IngestionPage from "./pages/admin/IngestionPage";
import PopupRulesPage from "./pages/admin/PopupRulesPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

const queryClient = new QueryClient();

function AdminOnly({ children }: { children: JSX.Element }) {
  const isAdmin = localStorage.getItem("is_superuser") === "true";
  return isAdmin ? children : <Navigate to="/" replace />;
}

function AdminOrManager({ children }: { children: JSX.Element }) {
  const isAdmin = localStorage.getItem("is_superuser") === "true";
  if (isAdmin) return children;
  const token = localStorage.getItem("access_token");
  if (!token) return <Navigate to="/" replace />;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return <Navigate to="/" replace />;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, "=");
    const json = atob(padded);
    const data = JSON.parse(json);
    const role = data?.role ?? data?.user?.role ?? data?.type ?? null;
    const roleValue = role ? String(role).toLowerCase() : "";
    const isManager = roleValue === "manager" || roleValue === "gestionnaire";
    return isManager ? children : <Navigate to="/" replace />;
  } catch {
    return <Navigate to="/" replace />;
  }
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="dashboard" element={<Dashboard1 />} />
        <Route path="dashboard-cartographique" element={<DashboardCartographique />} />
        <Route path="dashboard-2" element={<Dashboard2 />} />
        <Route path="carte" element={<Dashboard2 />} />
        <Route path="dashboard-analytique" element={<DashboardAnalytique />} />
        <Route path="dashboard-scenarios" element={<DashboardScenarios />} />
        <Route
          path="admin/data-scan"
          element={
            <AdminOrManager>
              <DataScanPage />
            </AdminOrManager>
          }
        />
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
            <AdminOrManager>
              <IngestionPage />
            </AdminOrManager>
          }
        />
        <Route
          path="admin/popup-rules"
          element={
            <AdminOrManager>
              <PopupRulesPage />
            </AdminOrManager>
          }
        />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route
          path="data"
          element={
            <AdminOrManager>
              <DataViewer />
            </AdminOrManager>
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
