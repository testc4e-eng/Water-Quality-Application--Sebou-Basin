import type { MapBusinessEntityProperties } from "@/api/mapBusiness";

import { MetadataCard, type MetadataCardVariant } from "./MetadataCard";

interface BusinessPopupProps {
  properties?: MapBusinessEntityProperties | null;
  loading?: boolean;
  error?: unknown | null;
  variant?: MetadataCardVariant;
}

export function BusinessPopup({ properties, loading, error, variant = "full" }: BusinessPopupProps) {
  return <MetadataCard properties={properties} loading={loading} error={error} variant={variant} />;
}
