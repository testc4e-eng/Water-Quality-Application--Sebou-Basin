/* frontend/src/components/Layout/Layout.tsx */
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { i18n } = useTranslation();
  const isRtl = i18n.resolvedLanguage === "ar";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar collapsed={sidebarCollapsed} isRtl={isRtl} />
      <div
        className={[
          "flex min-h-screen min-w-0 flex-1 flex-col",
          sidebarCollapsed ? (isRtl ? "lg:pr-20" : "lg:pl-20") : (isRtl ? "lg:pr-72" : "lg:pl-72"),
        ].join(" ")}
      >
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
        />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
