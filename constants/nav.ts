export type NavKey =
  | "home"
  | "builder"
  | "recruiterBuilder"
  | "features"
  | "pricing"
  | "templates"
  | "contact";

export interface NavItem {
  href: string;
  key: NavKey;
}
