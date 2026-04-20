"use client";
import { useEffect } from "react";

interface ShortcutOptions {
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
}

export function useKeyboardShortcuts({ onUndo, onRedo, onExport }: ShortcutOptions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (!ctrl) return;

      switch (e.key.toLowerCase()) {
        case "z":
          e.preventDefault();
          if (e.shiftKey) {
            onRedo();
          } else {
            onUndo();
          }
          break;
        case "y":
          e.preventDefault();
          onRedo();
          break;
        case "s":
          e.preventDefault();
          onExport();
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onUndo, onRedo, onExport]);
}