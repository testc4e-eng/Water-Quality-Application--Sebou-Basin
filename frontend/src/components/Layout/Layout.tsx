/* frontend/src/components/Layout/Layout.tsx */
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

const Layout = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [autoCompactSidebar, setAutoCompactSidebar] = useState(false);

  const isInstitutionalRoute = useMemo(() => {
    const path = location.pathname;
    return (
      path === "/" ||
      path === "/accueil-sad" ||
      path === "/dashboard-carto-metier" ||
      path === "/dashboard-qualite-reglementaire" ||
      path === "/dashboard-pollution" ||
      path === "/dashboard-pollution-propagation" ||
      path === "/dashboard-data-qa" ||
      path === "/administration" ||
      path.startsWith("/admin/")
    );
  }, [location.pathname]);

  useEffect(() => {
    const updateSidebarMode = () => {
      setAutoCompactSidebar(window.innerWidth < 1400 || window.innerHeight < 900);
    };

    updateSidebarMode();
    window.addEventListener("resize", updateSidebarMode);
    return () => window.removeEventListener("resize", updateSidebarMode);
  }, []);

  const effectiveSidebarCollapsed = autoCompactSidebar || sidebarCollapsed;

  return (
    <div className={`flex min-h-screen ${isInstitutionalRoute ? "bg-[#EEF5FF]" : "bg-slate-50"}`}>
      <Sidebar collapsed={effectiveSidebarCollapsed} />
      <div
        className={[
          "flex min-h-screen min-w-0 flex-1 flex-col",
          effectiveSidebarCollapsed ? "lg:pl-[56px]" : "lg:pl-[188px]",
        ].join(" ")}
      >
        <Header
          sidebarCollapsed={effectiveSidebarCollapsed}
          onToggleSidebar={() => {
            if (autoCompactSidebar) return;
            setSidebarCollapsed((value) => !value);
          }}
        />
        <main className={`min-w-0 flex-1 ${isInstitutionalRoute ? "bg-[#EEF5FF]" : ""}`}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
