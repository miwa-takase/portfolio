export type DesignMode = "design1" | "design2";

export const designModes: { label: string; value: DesignMode }[] = [
  { label: "Design 1", value: "design1" },
  { label: "Design 2", value: "design2" },
];

export const DESIGN_MODE_STORAGE_KEY = "site-design-mode";
export const DESIGN_MODE_VERSION_KEY = "site-design-mode-version";
export const DESIGN_MODE_VERSION = "2";

export function readDesignMode(): DesignMode {
  if (typeof window === "undefined") return "design1";
  if (
    window.localStorage.getItem(DESIGN_MODE_VERSION_KEY) !== DESIGN_MODE_VERSION
  ) {
    return "design1";
  }
  const stored =
    window.localStorage.getItem(DESIGN_MODE_STORAGE_KEY) ??
    window.localStorage.getItem("home-design-mode");
  return stored === "design2" ? "design2" : "design1";
}
