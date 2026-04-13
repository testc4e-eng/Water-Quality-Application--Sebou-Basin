export type GeometryType = "point" | "line" | "polygon";

export type PointStyle = {
  color: string;
  radius: number;
  opacity: number;
  strokeColor: string;
  strokeWidth: number;
};

export type LineStyle = {
  color: string;
  width: number;
  opacity: number;
};

export type PolygonStyle = {
  fillColor: string;
  fillOpacity: number;
  strokeColor: string;
  strokeWidth: number;
};

export type StyleConfig = {
  type: "simple";
  point?: PointStyle;
  line?: LineStyle;
  polygon?: PolygonStyle;
};

export type PopupField = {
  name: string;
  alias: string;
  order: number;
  visible: boolean;
  format: "date" | "number" | null;
  formatOptions?: Record<string, unknown> | null;
};

export type PopupConfig = {
  fields: PopupField[];
};

export type LayerConfig = {
  id: number;
  layer_name: string;
  geometry_type: GeometryType;
  style_config: StyleConfig;
  popup_config: PopupConfig;
  is_active: boolean;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
};

export type LayerConfigCreate = {
  layer_name: string;
  geometry_type: GeometryType;
  style_config: StyleConfig;
  popup_config: PopupConfig;
};

export type LayerConfigUpdate = {
  geometry_type: GeometryType;
  style_config: StyleConfig;
  popup_config: PopupConfig;
};
