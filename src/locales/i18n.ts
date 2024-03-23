import { createInstance, Resource } from "i18next"
import { initReactI18next } from "react-i18next"

import trEN from "./en/common.json"
import trFR from "./fr/common.json"
import trKO from "./ko/common.json"
import trDE from "./de/common.json"
import trES from "./es/common.json"
import trAR from "./ar/common.json"
import trJA from "./ja/common.json"
import trZH from "./zh/common.json"
import trBR from "./pt-br/common.json"

const resources = {
  en: { common: trEN },
  fr: { common: trFR },
  ko: { common: trKO },
  de: { common: trDE },
  es: { common: trES },
  ar: { common: trAR },
  ja: { common: trJA },
  zh: { common: trZH },
  br: { common: trBR },
} as Resource

const i18n = createInstance({
  resources,
  // lng: localStorage.getItem("i18nextLng") as string,
  lng: "es",
  ns: ["common"],
  defaultNS: "common",
  fallbackNS: "common",
  fallbackLng: ["en", "es", "dev"],
  debug: false,
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  react: {
    useSuspense: false,
  },
})

i18n.use(initReactI18next).init()

export default i18n
