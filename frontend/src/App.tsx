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
import UserManagementPage from "./pages/admin/UserManagementPage";
import PasswordResetRequestsPage from "./pages/admin/PasswordResetRequestsPage";
import AuditLogsPage from "./pages/admin/AuditLogsPage";
import IngestionPage from "./pages/admin/IngestionPage";
import PopupRulesPage from "./pages/admin/PopupRulesPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

const queryClient = new QueryClient();

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
        <Route path="dashboard-2" element={<Dashboard2 />} />
        <Route path="carte" element={<Dashboard2 />} />
        <Route path="dashboard-analytique" element={<DashboardAnalytique />} />
        <Route path="dashboard-scenarios" element={<DashboardScenarios />} />
        <Route path="admin/data-scan" element={<DataScanPage />} />
        <Route
          path="admin/users"
          element={
            <AdminOnly>
              <UserManagementPage />
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
              <AuditLogsPage />
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
