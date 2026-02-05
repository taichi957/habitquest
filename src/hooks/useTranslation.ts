import { useLanguageStore } from "../store/useLanguageStore";
import { t } from "../i18n/translations";

export function useTranslation() {
  const language = useLanguageStore((s) => s.language);

  return (key: string, params?: Record<string, string | number>) => {
    return t(key, language, params);
  };
}

// ✅ Export useLanguageStore để dùng trong components
export { useLanguageStore };
