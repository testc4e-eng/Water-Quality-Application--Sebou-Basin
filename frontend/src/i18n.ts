import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import fr from "./locales/fr/translation.json";
import en from "./locales/en/translation.json";
import ar from "./locales/ar/translation.json";

const resources = {
  fr: { translation: fr },
  en: { translation: en },
  ar: { translation: ar },
};

const setDirection = (lng: string) => {
  const isRtl = lng === "ar";
  document.documentElement.dir = isRtl ? "rtl" : "ltr";
  document.documentElement.classList.toggle("rtl", isRtl);
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "fr",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  })
  .then(() => {
    setDirection(i18n.language);
  });

i18n.on("languageChanged", (lng) => {
  setDirection(lng);
});

export default i18n;
