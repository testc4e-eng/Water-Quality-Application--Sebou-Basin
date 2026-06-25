export interface StationInfo {
  id: string;
  name: string;
  type: 'hydro' | 'dam' | 'guard_dam';
  coordinates: [number, number]; // [longitude, latitude]
  rawId?: number | string;
}

export const POLLUTION_CATEGORIES = [
  { id: 'hydrocarbures', label: 'Hydrocarbures', defaultSpeedKmh: 4 },
  { id: 'metaux_lourds', label: 'Métaux Lourds', defaultSpeedKmh: 2.5 },
  { id: 'eaux_usees', label: 'Eaux Usées Brutes', defaultSpeedKmh: 5 },
  { id: 'agricole', label: 'Rejet Agricole / Pesticides', defaultSpeedKmh: 5 },
  { id: 'autre', label: 'Autre pollution chimique', defaultSpeedKmh: 4 },
];

/**
 * Simule la propagation en listant toutes les stations en aval avec un ETA.
 * (Utilise une logique fictive d'Est en Ouest : longitude décroissante)
 */
export const calculatePollutionPropagation = (
  pollutionLon: number, 
  pollutionLat: number, 
  categoryId: string, 
  declarationTime: Date,
  stations: StationInfo[]
) => {
  const category = POLLUTION_CATEGORIES.find(c => c.id === categoryId) || POLLUTION_CATEGORIES[0];
  const speed = category.defaultSpeedKmh;

  // Filtre et tri d'Est en Ouest (longitude décroissante)
  const downstreamStations = stations
    .filter(s => s.coordinates[0] < pollutionLon)
    .sort((a, b) => b.coordinates[0] - a.coordinates[0]);

  const results = downstreamStations.map((station, index) => {
    // Distance approximative (très fictive, 1 degré de longitude = ~90km ici)
    const lonDiff = Math.abs(pollutionLon - station.coordinates[0]);
    const distanceFromPollution = lonDiff * 90;

    const hoursToReach = distanceFromPollution / speed;
    const estimatedArrivalTime = new Date(declarationTime.getTime() + hoursToReach * 3600 * 1000);

    return {
      station,
      distanceFromPollution,
      hoursToReach,
      estimatedArrivalTime
    };
  });

  return results;
};
