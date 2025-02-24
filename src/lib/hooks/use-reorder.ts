import { ReorderState } from "../types";
import { useStorage } from "./use-storage";

const STORAGE_KEY = "reorder-state";

export function useReorder() {
  const [reorderState, setReorderState] = useStorage<ReorderState>(STORAGE_KEY, "viewing");

  return {
    reorderState,
    isReordering: reorderState === "reordering",
    startReordering: () => setReorderState("reordering"),
    stopReordering: () => setReorderState("viewing"),
    toggleReordering: () => 
      setReorderState(state => state === "reordering" ? "viewing" : "reordering"),
  };
} 
