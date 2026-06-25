// /* frontend/src/components/Dashboard/AlertPanel.jsx */
// import React, { useEffect, useState } from "react";
// import { api } from "@/api/client"; // ✅ bon import (export nommé), baseURL = /api/v1

// export default function AlertPanel() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         // baseURL centralisée => on appelle juste "/alerts"
//         const res = await api.get("/alerts");
//         if (!alive) return;
//         setItems(Array.isArray(res.data) ? res.data : []);
//       } catch (e) {
//         if (!alive) return;
//         // message réseau + 404/500
//         const msg = e?.response?.data?.detail || e?.message || "Erreur réseau";
//         setError(msg);
//       } finally {
//         alive && setLoading(false);
//       }
//     })();
//     return () => {
//       alive = false;
//     };
//   }, []);

//   if (loading) return <div className="card p-3">Chargement des alertes…</div>;
//   if (error)
//     return <div className="card p-3 text-red-600">Erreur : {error}</div>;
//   if (!items.length) return <div className="card p-3">Aucune alerte</div>;

//   return (
//     <div className="card p-3 space-y-3">
//       {items.map((a) => (
//         <div key={a.id} className="rounded-md border p-3">
//           <div className="font-semibold">
//             {(a.stationName || a.station || a.station_id) + ""} — {a.type}
//           </div>
//           <div className="text-xs text-muted-foreground">
//             {a.date ? new Date(a.date).toLocaleString() : "—"}
//           </div>
//           <div className="text-sm">{a.message || "—"}</div>
//         </div>
//       ))}
//     </div>
//   );
// }


/* frontend/src/components/Dashboard/AlertPanel.jsx */
import React, { useEffect, useState } from "react";
import { api } from "@/api/client";
import { 
  AlertTriangle, 
  Info, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  Bell,
  BellRing,
  MapPin,
  Waves,
  Droplets,
  Wind,
  Gauge,
  Thermometer,
  Activity,
  XCircle,
  RefreshCw
} from "lucide-react";

export default function AlertPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, critical, warning, info
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/alerts");
        if (!alive) return;
        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        if (!alive) return;
        const msg = e?.response?.data?.detail || e?.message || "Erreur réseau";
        setError(msg);
      } finally {
        alive && setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Fonction pour déterminer le type d'alerte et sa couleur
  const getAlertType = (alert) => {
    const type = (alert.type || "").toLowerCase();
    const message = (alert.message || "").toLowerCase();
    
    if (type.includes("crit") || type.includes("danger") || type.includes("error") || 
        message.includes("crit") || message.includes("danger") || message.includes("error")) {
      return "critical";
    }
    if (type.includes("warn") || message.includes("warn") || 
        type.includes("attention") || message.includes("attention")) {
      return "warning";
    }
    if (type.includes("info") || message.includes("info") || 
        type.includes("notif") || message.includes("notif")) {
      return "info";
    }
    if (type.includes("success") || message.includes("success") || 
        type.includes("valid") || message.includes("valid")) {
      return "success";
    }
    return "info"; // Par défaut
  };

  // Fonction pour obtenir l'icône en fonction du type d'alerte
  const getAlertIcon = (type) => {
    switch(type) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  // Fonction pour obtenir la couleur de fond en fonction du type
  const getAlertStyles = (type) => {
    switch(type) {
      case "critical":
        return {
          bg: "bg-gradient-to-r from-red-50 to-red-100/50",
          border: "border-l-4 border-red-500",
          badge: "bg-red-100 text-red-700 border-red-200",
          iconBg: "bg-red-100"
        };
      case "warning":
        return {
          bg: "bg-gradient-to-r from-amber-50 to-amber-100/50",
          border: "border-l-4 border-amber-500",
          badge: "bg-amber-100 text-amber-700 border-amber-200",
          iconBg: "bg-amber-100"
        };
      case "success":
        return {
          bg: "bg-gradient-to-r from-green-50 to-green-100/50",
          border: "border-l-4 border-green-500",
          badge: "bg-green-100 text-green-700 border-green-200",
          iconBg: "bg-green-100"
        };
      case "info":
      default:
        return {
          bg: "bg-gradient-to-r from-blue-50 to-blue-100/50",
          border: "border-l-4 border-blue-500",
          badge: "bg-blue-100 text-blue-700 border-blue-200",
          iconBg: "bg-blue-100"
        };
    }
  };

  // Fonction pour obtenir l'icône de station
  const getStationIcon = (stationName) => {
    const name = (stationName || "").toLowerCase();
    if (name.includes("eau") || name.includes("water") || name.includes("mer") || name.includes("rivière")) {
      return <Droplets className="h-3.5 w-3.5" />;
    }
    if (name.includes("vent") || name.includes("wind")) {
      return <Wind className="h-3.5 w-3.5" />;
    }
    if (name.includes("temp") || name.includes("thermo")) {
      return <Thermometer className="h-3.5 w-3.5" />;
    }
    if (name.includes("press") || name.includes("baro")) {
      return <Gauge className="h-3.5 w-3.5" />;
    }
    if (name.includes("vague") || name.includes("wave")) {
      return <Waves className="h-3.5 w-3.5" />;
    }
    return <Activity className="h-3.5 w-3.5" />;
  };

  // Filtrer les alertes
  const filteredItems = items.filter(item => {
    if (filter === "all") return true;
    const type = getAlertType(item);
    return type === filter;
  });

  // Compter les alertes par type
  const counts = {
    all: items.length,
    critical: items.filter(i => getAlertType(i) === "critical").length,
    warning: items.filter(i => getAlertType(i) === "warning").length,
    info: items.filter(i => getAlertType(i) === "info").length,
    success: items.filter(i => getAlertType(i) === "success").length
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <BellRing className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Alertes</h2>
            </div>
            <div className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">
              En direct
            </div>
          </div>
        </div>
        <div className="p-8 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Bell className="h-6 w-6 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Chargement des alertes...</p>
          <p className="text-sm text-gray-400">Récupération des données en cours</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Erreur de chargement</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Une erreur est survenue</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Centre d'alertes</h2>
            </div>
            <div className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">
              Système
            </div>
          </div>
        </div>
        <div className="p-8 flex flex-col items-center justify-center">
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-800">Aucune alerte</h3>
          <p className="text-gray-500 text-center max-w-sm mt-1">
            Tout fonctionne normalement. Vous serez notifié en cas d'événement important.
          </p>
          <div className="mt-6 flex gap-2">
            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1">
              <RefreshCw className="h-3 w-3" /> Auto
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
              Système OK
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all hover:shadow-2xl">
      {/* En-tête avec gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <BellRing className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Centre d'alertes</h2>
              <p className="text-xs text-white/80 mt-0.5">
                {items.length} alerte{items.length > 1 ? 's' : ''} active{items.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm transition-all flex items-center gap-1 backdrop-blur-sm"
          >
            <span>Filtres</span>
            <span className="text-xs bg-white/30 px-1.5 rounded-full">{filter !== "all" ? 1 : 0}</span>
          </button>
        </div>

        {/* Badges de statistiques */}
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1
              ${filter === "all" 
                ? 'bg-white text-blue-600 shadow-lg' 
                : 'bg-white/20 text-white hover:bg-white/30'}`}
          >
            <span>Tous</span>
            <span className={`px-1.5 rounded-full ${filter === "all" ? 'bg-blue-100 text-blue-600' : 'bg-white/30'}`}>
              {counts.all}
            </span>
          </button>
          {counts.critical > 0 && (
            <button
              onClick={() => setFilter("critical")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1
                ${filter === "critical" 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : 'bg-red-500/20 text-white hover:bg-red-500/30'}`}
            >
              <AlertCircle className="h-3 w-3" />
              <span>Critique</span>
              <span className="px-1 rounded-full bg-white/30">{counts.critical}</span>
            </button>
          )}
          {counts.warning > 0 && (
            <button
              onClick={() => setFilter("warning")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1
                ${filter === "warning" 
                  ? 'bg-amber-500 text-white shadow-lg' 
                  : 'bg-amber-500/20 text-white hover:bg-amber-500/30'}`}
            >
              <AlertTriangle className="h-3 w-3" />
              <span>Attention</span>
              <span className="px-1 rounded-full bg-white/30">{counts.warning}</span>
            </button>
          )}
          {counts.info > 0 && (
            <button
              onClick={() => setFilter("info")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1
                ${filter === "info" 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-blue-500/20 text-white hover:bg-blue-500/30'}`}
            >
              <Info className="h-3 w-3" />
              <span>Info</span>
              <span className="px-1 rounded-full bg-white/30">{counts.info}</span>
            </button>
          )}
          {counts.success > 0 && (
            <button
              onClick={() => setFilter("success")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1
                ${filter === "success" 
                  ? 'bg-green-500 text-white shadow-lg' 
                  : 'bg-green-500/20 text-white hover:bg-green-500/30'}`}
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>Succès</span>
              <span className="px-1 rounded-full bg-white/30">{counts.success}</span>
            </button>
          )}
        </div>
      </div>

      {/* Liste des alertes */}
      <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center">
            <div className="inline-flex p-3 bg-gray-100 rounded-full">
              <Info className="h-6 w-6 text-gray-400" />
            </div>
            <p className="mt-2 text-gray-500">Aucune alerte avec ce filtre</p>
            <button
              onClick={() => setFilter("all")}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Voir toutes les alertes
            </button>
          </div>
        ) : (
          filteredItems.map((a, index) => {
            const type = getAlertType(a);
            const styles = getAlertStyles(type);
            const stationName = a.stationName || a.station || a.station_id || "Station inconnue";
            
            return (
              <div
                key={a.id || index}
                className={`${styles.bg} ${styles.border} p-4 transition-all hover:shadow-md group relative overflow-hidden`}
              >
                {/* Effet de survol */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                
                <div className="flex gap-3">
                  {/* Icône avec fond coloré */}
                  <div className={`flex-shrink-0 ${styles.iconBg} w-10 h-10 rounded-xl flex items-center justify-center`}>
                    {getAlertIcon(type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-800">
                            {a.type || "Alerte"}
                          </h3>
                          <span className={`${styles.badge} px-2 py-0.5 rounded-full text-xs font-medium border`}>
                            {type === "critical" ? "Critique" :
                             type === "warning" ? "Attention" :
                             type === "success" ? "Succès" : "Information"}
                          </span>
                        </div>
                        
                        {/* Station */}
                        <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          <span className="truncate max-w-[200px]">{stationName}</span>
                          <span className="ml-1 p-0.5 bg-gray-100 rounded-full">
                            {getStationIcon(stationName)}
                          </span>
                        </div>
                        
                        {/* Message */}
                        {a.message && a.message !== "—" && (
                          <p className="mt-2 text-sm text-gray-700 bg-white/50 p-2 rounded-lg border border-gray-100">
                            {a.message}
                          </p>
                        )}
                      </div>
                      
                      {/* Date */}
                      {a.date && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 bg-white/70 px-2 py-1 rounded-full whitespace-nowrap">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(a.date).toLocaleString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit'
                          })}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Informations supplémentaires si présentes */}
                    {(a.value || a.unit || a.threshold) && (
                      <div className="mt-3 flex gap-2 flex-wrap">
                        {a.value && (
                          <div className="bg-white/70 px-2 py-1 rounded-lg text-xs border border-gray-200">
                            <span className="text-gray-500">Valeur:</span>
                            <span className="ml-1 font-mono font-medium">{a.value}</span>
                            {a.unit && <span className="ml-0.5 text-gray-500">{a.unit}</span>}
                          </div>
                        )}
                        {a.threshold && (
                          <div className="bg-white/70 px-2 py-1 rounded-lg text-xs border border-gray-200">
                            <span className="text-gray-500">Seuil:</span>
                            <span className="ml-1 font-mono">{a.threshold}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pied de page avec indicateur de mise à jour */}
      <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Mise à jour en temps réel</span>
        </div>
        <div className="flex items-center gap-1">
          <RefreshCw className="h-3 w-3" />
          <span>{new Date().toLocaleTimeString('fr-FR')}</span>
        </div>
      </div>
    </div>
  );
}
