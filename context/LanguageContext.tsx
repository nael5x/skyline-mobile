import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Language,
  TranslationKey,
  translations,
} from "@/constants/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "ar",
  setLanguage: () => {},
  t: (key) => key,
  isRTL: true,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ar");

  useEffect(() => {
    AsyncStorage.getItem("language").then((saved) => {
      if (saved === "ar" || saved === "tr") {
        setLanguageState(saved);
      } else {
        // إذا كان مخزن سابقًا en أو أي قيمة قديمة، نرجعه للعربية
        setLanguageState("ar");
        AsyncStorage.setItem("language", "ar");
      }
    });
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem("language", lang);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[language]?.[key] ?? key;
    },
    [language]
  );

  const isRTL = language === "ar";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);