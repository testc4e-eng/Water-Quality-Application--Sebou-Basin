import { useEffect, useState } from "react";
import { Maximize } from "lucide-react";
import { BusinessSidebarV1 } from "@/components/DashboardMetier/V1/BusinessSidebarV1";
import { AnalysisWorkspace } from "@/components/analysis-workspace/AnalysisWorkspace";
import { MapV1 } from "@/components/DashboardMetier/V1/MapV1";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useMediaQuery } from "@/hooks/use-media-query"; // Assuming we have this, or we can just use simple useEffect

// Un simple hook custom au cas où
function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
}


export default function DashboardCartoMetier() {
  const width = useWindowWidth();
  
  const { 
    isLeftPanelOpen, 
    isRightPanelOpen, 
    setRightPanelOpen,
    setLeftPanelCompact,
    widgets
  } = useWorkspaceStore();

  const [selectedFilters, setSelectedFilters] = useState<{
    support_type?: string;
    domain?: string;
    subdomain?: string;
    parameter_code?: string;
    bassin_nom?: string;
  }>({});

  useEffect(() => {
    // Responsive auto-adjustments
    if (width < 1100) {
      setLeftPanelCompact(true);
    } else {
      setLeftPanelCompact(false);
    }
  }, [width, setLeftPanelCompact]);

  // Par défaut : workspace ouvert si au moins un widget existe
  useEffect(() => {
    if (widgets.length > 0 && !isRightPanelOpen) {
      setRightPanelOpen(true);
    }
  }, [widgets.length, isRightPanelOpen, setRightPanelOpen]);

  return (
    <div className="relative h-[calc(100vh-72px)] w-full overflow-hidden bg-slate-50">
      {/* Map layer */}
      <div className="absolute inset-0 z-0">
         <MapV1 
            filters={selectedFilters} 
            onSelectObject={() => {}} // Not strictly needed anymore since popup adds directly to workspace
         />
      </div>

      {/* Custom Fullscreen Button */}
      <div className="absolute top-4 left-[350px] z-20 pointer-events-auto">
        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(err => console.error(err));
            } else {
              document.exitFullscreen().catch(err => console.error(err));
            }
          }}
          className="bg-white/90 backdrop-blur-md p-2 rounded shadow border border-slate-200 text-slate-700 hover:text-indigo-600 hover:bg-white transition-colors"
          title="Plein écran (Global)"
        >
          <Maximize className="h-5 w-5" />
        </button>
      </div>

      {/* Floating Left Panel */}
      {isLeftPanelOpen && (
        <div className={`absolute left-4 top-4 z-10 bottom-4 pointer-events-none transition-all duration-300 ${width < 900 ? 'w-full left-0 right-0 top-auto h-[40vh] bg-white' : ''}`}>
          <div className="h-full pointer-events-auto shadow-xl rounded-xl border border-slate-200 bg-white/88 backdrop-blur-md overflow-hidden flex flex-col w-auto max-w-[28vw] min-w-[220px]">
             <BusinessSidebarV1 
                filters={selectedFilters} 
                onFiltersChange={setSelectedFilters} 
             />
          </div>
        </div>
      )}

      {/* Workspace Panel (replacing Right Panel) */}
      {isRightPanelOpen && (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
             <AnalysisWorkspace />
        </div>
      )}
    </div>
  );
}
