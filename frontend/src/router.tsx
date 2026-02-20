// frontend/src/router.tsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Layout from "./components/Layout/Layout";

// Pages existantes
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Dashboard2 from "./pages/Dashboard2";
import DashboardClimate from "./pages/DashboardClimate";
import About from "./pages/About";
import Contact from "./pages/Contact";
import DataViewer from "./pages/DataViewer";
import AuthPage from "./pages/Login";
import NotFound from "./pages/NotFound";

// Router avec flags v7
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard-2" element={<Dashboard2 />} />
        <Route path="dashboard-climate"element={<DashboardClimate />}/>
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
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

export default router;
