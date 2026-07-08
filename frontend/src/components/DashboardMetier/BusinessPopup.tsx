import type { MapBusinessEntityProperties } from "@/api/mapBusiness";

import { MetadataCard, type MetadataCardVariant } from "./MetadataCard";

interface BusinessPopupProps {
  properties?: MapBusinessEntityProperties | null;
  loading?: boolean;
  error?: unknown | null;
  variant?: MetadataCardVariant;
  actions?: React.ReactNode;
}

export function BusinessPopup({ properties, loading, error, variant = "full", actions }: BusinessPopupProps) {
  return <MetadataCard properties={properties} loading={loading} error={error} variant={variant} actions={actions} />;
}
