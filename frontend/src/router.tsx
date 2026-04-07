// frontend/src/router.tsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Layout from "./components/Layout/Layout";

// Pages existantes
import LandingPage from "./pages/LandingPage";
import Dashboard2 from "./pages/Dashboard2";
import DashboardClimate from "./pages/DashboardClimate";
import DashboardCartographique from "./pages/DashboardCartographique";
import DashboardAnalytique from "./pages/DashboardAnalytique";
import DashboardScenarios from "./pages/DashboardScenarios";
import About from "./pages/About";
import Contact from "./pages/Contact";
import DataViewer from "./pages/DataViewer";
import AuthPage from "./pages/Login";
import NotFound from "./pages/NotFound";
import UserManagementPage from "./pages/admin/UserManagementPage";

// Router avec flags v7
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="dashboard-cartographique" element={<DashboardCartographique />} />
        <Route path="dashboard-analytique" element={<DashboardAnalytique />} />
        <Route path="dashboard" element={<Dashboard2 />} />
        <Route path="dashboard-2" element={<Dashboard2 />} />
        <Route path="dashboard-climate" element={<DashboardClimate />} />
        <Route path="dashboard-scenarios" element={<DashboardScenarios />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="data" element={<DataViewer />} />
        <Route path="admin/users" element={<UserManagementPage />} />
      </Route>

      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="*" element={<NotFound />} />
    </>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

export default router;
