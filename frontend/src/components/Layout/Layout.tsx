/* frontend/src/components/Layout/Layout.tsx */
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className={["flex min-w-0 flex-1 flex-col", sidebarCollapsed ? "lg:pl-20" : "lg:pl-72"].join(" ")}>
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
        />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
