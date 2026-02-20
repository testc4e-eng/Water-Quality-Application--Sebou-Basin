// ===============================================
// MOCK QUALITY DATA MULTI-STATION
// ===============================================

type Row = {
  station: string;
  date: string;
  n: number;
  o: number;
  p: number;
};

const STATIONS = ["AIT_TAMLIL", "SEBOU_01", "SEBOU_02"];

// ===============================================
// GENERATION MOCK DATA (JOURNALIER)
// ===============================================

function generateMockData(): Row[] {
  const rows: Row[] = [];

  const start = new Date("1992-01-01");
  const end = new Date("2020-12-31");

  STATIONS.forEach((station, index) => {
    const current = new Date(start);

    while (current <= end) {
      rows.push({
        station,
        date: current.toISOString().slice(0, 10),

        n: +(Math.random() * 10 + 5 + index * 2).toFixed(2),
        o: +(Math.random() * 20 + 10 + index * 3).toFixed(2),
        p: +(Math.random() * 5 + 1 + index).toFixed(2),
      });

      // 🔥 INCREMENT JOURNALIER
      current.setDate(current.getDate() + 1);
    }
  });

  return rows;
}

const MOCK_DATA = generateMockData();


// ===============================================
// AGRÉGATION MENSUELLE
// ===============================================

function aggregateMonthly(rows: Row[]): Row[] {
  const map: Record<string, Row[]> = {};

  rows.forEach((r) => {
    const monthKey = r.station + "-" + r.date.slice(0, 7); // YYYY-MM

    if (!map[monthKey]) {
      map[monthKey] = [];
    }

    map[monthKey].push(r);
  });

  const aggregated: Row[] = [];

  Object.values(map).forEach((group) => {
    const first = group[0];

    const mean = (key: "n" | "o" | "p") =>
      group.reduce((sum, r) => sum + r[key], 0) / group.length;

    aggregated.push({
      station: first.station,
      date: first.date.slice(0, 7) + "-01", // premier jour du mois
      n: +mean("n").toFixed(2),
      o: +mean("o").toFixed(2),
      p: +mean("p").toFixed(2),
    });
  });

  return aggregated;
}


// ===============================================
// FILTER CORE FUNCTION (ROBUSTE)
// ===============================================

function filterData(params: any): Row[] {
  let stations: string[] = [];

  if (Array.isArray(params.station_code)) {
    stations = params.station_code;
  } else if (typeof params.station_code === "string") {
    stations = params.station_code.split(",");
  } else {
    stations = STATIONS;
  }

  let filtered = MOCK_DATA.filter(
    (r) =>
      stations.includes(r.station) &&
      r.date >= params.date_start &&
      r.date <= params.date_end
  );

  // 🔥 AGRÉGATION
  if (params.aggregation === "M") {
    filtered = aggregateMonthly(filtered);
  }

  return filtered;
}


// ===============================================
// MOCK API FUNCTIONS
// ===============================================

export const fetchQualityStations = async () => {
  return Promise.resolve(
    STATIONS.map((s) => ({ station_code: s }))
  );
};


// ----------------------------
// TABLE
// ----------------------------
export const fetchQualityTable = async (params: any) => {
  return Promise.resolve(filterData(params));
};


// ----------------------------
// CHART
// ----------------------------
export const fetchQualityChart = async (params: any) => {
  return Promise.resolve(filterData(params));
};


// ----------------------------
// KPIs (MOYENNES)
// ----------------------------
export const fetchQualityKPIs = async (params: any) => {
  const filtered = filterData(params);

  if (filtered.length === 0) {
    return Promise.resolve({ n: 0, o: 0, p: 0 });
  }

  const mean = (key: "n" | "o" | "p") =>
    filtered.reduce((sum, r) => sum + r[key], 0) / filtered.length;

  return Promise.resolve({
    n: mean("n"),
    o: mean("o"),
    p: mean("p"),
  });
};
