"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = require("i18next");
const react_i18next_1 = require("react-i18next");
const common_json_1 = __importDefault(require("./en/common.json"));
const common_json_2 = __importDefault(require("./fr/common.json"));
const common_json_3 = __importDefault(require("./ko/common.json"));
const common_json_4 = __importDefault(require("./de/common.json"));
const common_json_5 = __importDefault(require("./es/common.json"));
const common_json_6 = __importDefault(require("./ar/common.json"));
const common_json_7 = __importDefault(require("./ja/common.json"));
const common_json_8 = __importDefault(require("./zh/common.json"));
const common_json_9 = __importDefault(require("./pt-br/common.json"));
const resources = {
    en: { common: common_json_1.default },
    fr: { common: common_json_2.default },
    ko: { common: common_json_3.default },
    de: { common: common_json_4.default },
    es: { common: common_json_5.default },
    ar: { common: common_json_6.default },
    ja: { common: common_json_7.default },
    zh: { common: common_json_8.default },
    br: { common: common_json_9.default },
};
const i18n = (0, i18next_1.createInstance)({
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
});
i18n.use(react_i18next_1.initReactI18next).init();
exports.default = i18n;
//# sourceMappingURL=i18n.js.map