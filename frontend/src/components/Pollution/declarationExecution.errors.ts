import type { ApiErrorResponse } from "@/api/pollutionDeclarations";

import type { DeclarationExecutionError, DeclarationExecutionStep } from "./declarationExecution.types";

const ERROR_MESSAGES: Record<string, { title: string; message: string; userAction: string }> = {
  DECLARATION_POINT_REQUIRED: {
    title: "Point de declaration manquant",
    message: "Le point de detection est obligatoire avant de lancer l'analyse.",
    userAction: "Selectionnez un point sur la carte ou renseignez ses coordonnees.",
  },
  DECLARATION_INPUT_REQUIRED: {
    title: "Donnees de declaration incompletes",
    message: "Les donnees obligatoires de rejet ou d'hydrologie sont incompletes.",
    userAction: "Completez les champs obligatoires puis relancez l'analyse.",
  },
  INVALID_TRANSITION: {
    title: "Transition non autorisee",
    message: "Le dossier n'est pas dans un etat compatible avec l'action demandee.",
    userAction: "Verifiez l'etat du dossier ou creez une nouvelle declaration.",
  },
  TOPOLOGY_POINT_OFF_NETWORK: {
    title: "Point hors reseau",
    message: "Le point declare ne peut pas etre raccorde au reseau hydrologique.",
    userAction: "Repositionnez le point plus proche du reseau hydrographique.",
  },
  TOPOLOGY_PATH_NOT_FOUND: {
    title: "Analyse bloquee",
    message: "Le point declare ne permet pas de calculer un parcours aval exploitable.",
    userAction: "Selectionnez un point plus proche du reseau hydrographique.",
  },
  TOPOLOGY_GARDE_NOT_REACHED: {
    title: "Barrage de Garde non atteint",
    message: "Le parcours calcule n'atteint pas le Barrage de Garde dans le perimetre MVP.",
    userAction: "Verifiez le point ou classez le dossier hors prototype MVP.",
  },
  TOPOLOGY_SAT_NOT_FOUND: {
    title: "Sidi Allal Tazi non detectee",
    message: "La station Sidi Allal Tazi n'a pas ete detectee sur le parcours.",
    userAction: "Verifiez le point ou le referentiel des stations.",
  },
  TOPOLOGY_SNAP_TOO_FAR: {
    title: "Snap trop eloigne",
    message: "Le point declare est trop eloigne du reseau hydrographique.",
    userAction: "Repositionnez le point avant de relancer l'analyse.",
  },
  MATRIX_UNAVAILABLE: {
    title: "Matrice indisponible",
    message: "La matrice scientifique MVP n'est pas disponible.",
    userAction: "Reessayez plus tard ou basculez en expertise manuelle.",
  },
  MATRIX_OUT_OF_DOMAIN: {
    title: "Limite scientifique",
    message: "Les valeurs saisies ne sont pas couvertes par la matrice NH4 v1.",
    userAction: "Corrigez le scenario ou demandez une validation scientifique.",
  },
  DECLARATION_ANALYSIS_INTERNAL_ERROR: {
    title: "Erreur interne d'analyse",
    message: "Une erreur interne a empeche l'analyse de se terminer.",
    userAction: "Relancez puis signalez l'incident si le probleme persiste.",
  },
};

function isApiErrorPayload(value: unknown): value is ApiErrorResponse {
  return Boolean(value && typeof value === "object" && "code" in value);
}

export function normalizeDeclarationExecutionError(
  error: unknown,
  step: DeclarationExecutionStep
): DeclarationExecutionError {
  const responseData = (error as { response?: { data?: unknown } })?.response?.data;
  const payload = isApiErrorPayload(responseData) ? responseData : null;
  const fallbackCode = payload?.code ?? "DECLARATION_ANALYSIS_INTERNAL_ERROR";
  const known = ERROR_MESSAGES[fallbackCode] ?? ERROR_MESSAGES.DECLARATION_ANALYSIS_INTERNAL_ERROR;
  const technicalMessage =
    payload?.message ?? (error instanceof Error ? error.message : "Erreur inattendue lors de l'analyse.");

  return {
    code: fallbackCode,
    title: known.title,
    message: known.message,
    userAction: payload?.user_action ?? known.userAction,
    step,
    technicalMessage,
  };
}

export { ERROR_MESSAGES as DECLARATION_EXECUTION_ERROR_MESSAGES };
