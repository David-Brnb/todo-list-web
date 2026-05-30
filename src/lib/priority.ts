// Priority maps between the UI selector values (Spanish) and the backend enum.
// alta ↔ HIGH, media ↔ MEDIUM, baja ↔ LOW.

export type PriorityUi = "alta" | "media" | "baja";
export type PriorityApi = "HIGH" | "MEDIUM" | "LOW";

const UI_TO_API: Record<PriorityUi, PriorityApi> = {
  alta: "HIGH",
  media: "MEDIUM",
  baja: "LOW",
};

const API_TO_UI: Record<PriorityApi, PriorityUi> = {
  HIGH: "alta",
  MEDIUM: "media",
  LOW: "baja",
};

export function toApiPriority(p: PriorityUi): PriorityApi {
  return UI_TO_API[p];
}

export function toUiPriority(p: string): PriorityUi {
  return API_TO_UI[p as PriorityApi] ?? "media";
}
