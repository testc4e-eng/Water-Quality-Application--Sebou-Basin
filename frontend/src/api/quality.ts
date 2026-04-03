const API_BASE = "http://localhost:8000/api/v1/quality";

export type PollutionInventoryRow = {
  source: string;
  sourceType: string;
  parameter: string;
  sourceName: string;
  location: string;
  period: string;
  measuredValue: number;
  unit: string;
};

export const fetchPollutionInventoryRows = async (): Promise<PollutionInventoryRow[]> => {
  const res = await fetch(`${API_BASE}/inventory/rows`);
  if (!res.ok) throw new Error("Erreur inventaire pollution");
  return res.json();
};

// Compat legacy exports kept temporarily for older quality widgets.
type LegacyRow = {
  station: string;
  date: string;
  n: number;
  o: number;
  p: number;
};

const STATIONS = ["AIT_TAMLIL", "SEBOU_01", "SEBOU_02"];

function generateMockData(): LegacyRow[] {
  const rows: LegacyRow[] = [];
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
      current.setDate(current.getDate() + 1);
    }
  });

  return rows;
}

const MOCK_DATA = generateMockData();

function aggregateMonthly(rows: LegacyRow[]): LegacyRow[] {
  const map: Record<string, LegacyRow[]> = {};

  rows.forEach((row) => {
    const monthKey = `${row.station}-${row.date.slice(0, 7)}`;
    if (!map[monthKey]) map[monthKey] = [];
    map[monthKey].push(row);
  });

  return Object.values(map).map((group) => {
    const first = group[0];
    const mean = (key: "n" | "o" | "p") => group.reduce((sum, row) => sum + row[key], 0) / group.length;

    return {
      station: first.station,
      date: `${first.date.slice(0, 7)}-01`,
      n: +mean("n").toFixed(2),
      o: +mean("o").toFixed(2),
      p: +mean("p").toFixed(2),
    };
  });
}

function filterLegacyData(params: any): LegacyRow[] {
  let stations: string[] = [];
  if (Array.isArray(params.station_code)) stations = params.station_code;
  else if (typeof params.station_code === "string") stations = params.station_code.split(",");
  else stations = STATIONS;

  let filtered = MOCK_DATA.filter(
    (row) => stations.includes(row.station) && row.date >= params.date_start && row.date <= params.date_end
  );

  if (params.aggregation === "M") filtered = aggregateMonthly(filtered);
  return filtered;
}

export const fetchQualityStations = async () => Promise.resolve(STATIONS.map((station_code) => ({ station_code })));
export const fetchQualityTable = async (params: any) => Promise.resolve(filterLegacyData(params));
export const fetchQualityChart = async (params: any) => Promise.resolve(filterLegacyData(params));
export const fetchQualityKPIs = async (params: any) => {
  const filtered = filterLegacyData(params);
  if (filtered.length === 0) return Promise.resolve({ n: 0, o: 0, p: 0 });

  const mean = (key: "n" | "o" | "p") => filtered.reduce((sum, row) => sum + row[key], 0) / filtered.length;
  return Promise.resolve({ n: mean("n"), o: mean("o"), p: mean("p") });
};

