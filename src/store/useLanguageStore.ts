import { create } from "zustand";
import { persist } from "zustand/middleware";

// ✅ EXPORT Language TYPE
export type Language = "en" | "vi" | "ja";

type LanguageState = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (lang) =>
        set({
          language: lang,
        }),
    }),
    {
      name: "habitquest-language",
    }
  )
);
