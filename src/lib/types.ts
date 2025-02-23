export interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

export interface SavedLink {
  url: string;
  title: string;
  note: string;
  timestamp: number;
  categories?: string[];
  isPinned?: boolean;
  lastOpenedAt?: number;
}

export type View = "home" | "cold-storage" | "trash" | "settings";
