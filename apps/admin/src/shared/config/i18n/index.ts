import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector/cjs";
import { initReactI18next } from "node_modules/react-i18next";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // resources: {
    //   en: { translation: en },
    // },
    fallbackLng: "en",
    supportedLngs: ["en"],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
