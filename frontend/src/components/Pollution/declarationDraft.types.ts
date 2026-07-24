export interface PollutionDeclarationDraft {
  pollutant: "NH4";
  detectedAt: string;
  crejetMgL: string;
  qrejetM3s: string;
  qsebouM3s: string;
  qinnaouenM3s: string;
  qouerghaM3s: string;
  comment: string;
}

export function getDefaultDetectedAtInputValue(date = new Date()) {
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export const EMPTY_POLLUTION_DECLARATION_DRAFT: PollutionDeclarationDraft = {
  pollutant: "NH4",
  detectedAt: getDefaultDetectedAtInputValue(),
  crejetMgL: "",
  qrejetM3s: "",
  qsebouM3s: "",
  qinnaouenM3s: "",
  qouerghaM3s: "",
  comment: "",
};
