import { useEffect, useMemo, useRef, useState } from "react";
import type { FeatureCollection } from "geojson";
import type { MapLayerMouseEvent, MapRef } from "react-map-gl/maplibre";
import Map, { Layer, Source } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import { getPropagationNetworkGeoJSON } from "@/api/propagation";

interface PollutionSignalMapProps {
  onSignal: (lat: number, lon: number) => void;
  signalPoint?: { lat: number; lon: number } | null;
  propagationPath?: FeatureCollection;
}

export default function PollutionSignalMap({
  onSignal,
  signalPoint,
  propagationPath,
}: PollutionSignalMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [networkData, setNetworkData] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    let cancelled = false;
    getPropagationNetworkGeoJSON()
      .then((data) => {
        if (!cancelled) setNetworkData(data);
      })
      .catch(() => {
        if (!cancelled) setNetworkData(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signalGeojson = useMemo<FeatureCollection | null>(() => {
    if (!signalPoint) return null;
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [signalPoint.lon, signalPoint.lat],
          },
          properties: {},
        },
      ],
    };
  }, [signalPoint]);

  const handleClick = (event: MapLayerMouseEvent) => {
    const { lat, lng } = event.lngLat;
    onSignal(lat, lng);
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
      <Map
        ref={mapRef}
        initialViewState={{
          latitude: 34.4,
          longitude: -4.8,
          zoom: 7.1,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        onClick={handleClick}
        cursor="crosshair"
      >
        {networkData && (
          <Source id="hydro-network" type="geojson" data={networkData}>
            <Layer
              id="hydro-lines"
              type="line"
              paint={{
                "line-color": "#3b82f6",
                "line-width": 1,
                "line-opacity": 0.6,
              }}
            />
          </Source>
        )}

        {signalGeojson && (
          <Source id="signal-point" type="geojson" data={signalGeojson}>
            <Layer
              id="signal-marker"
              type="circle"
              paint={{
                "circle-radius": 9,
                "circle-color": "#dc2626",
                "circle-stroke-color": "#ffffff",
                "circle-stroke-width": 2,
              }}
            />
          </Source>
        )}

        {propagationPath && (
          <Source id="propagation-path" type="geojson" data={propagationPath}>
            <Layer
              id="propagation-path-layer"
              type="line"
              paint={{
                "line-color": "#f59e0b",
                "line-width": 4,
                "line-opacity": 0.85,
              }}
            />
          </Source>
        )}
      </Map>

      <div className="pointer-events-none absolute left-4 top-4 max-w-xs rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-sm shadow">
        <div className="font-medium text-slate-900">Signalisation pollution</div>
        <div className="text-xs text-slate-600">
          Cliquez sur la carte pour positionner une source de rejet
        </div>
      </div>
    </div>
  );
}
