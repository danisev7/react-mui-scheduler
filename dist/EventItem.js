"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const Paper_1 = __importDefault(require("@mui/material/Paper"));
const Box_1 = __importDefault(require("@mui/material/Box"));
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const date_fns_1 = require("date-fns");
const dateFnsContext_1 = __importDefault(require("./locales/dateFnsContext"));
const EventItem = ({ event, rowId, sx, boxSx, elevation, onClick, onDragStart, }) => {
    const dateFnsLocale = (0, react_1.useContext)(dateFnsContext_1.default);
    return (react_1.default.createElement(Paper_1.default, { sx: sx, draggable: false, onClick: onClick, onDragStart: onDragStart, elevation: elevation || 0, key: `item-d-${event?.id}-${rowId}` },
        react_1.default.createElement(Box_1.default, { sx: boxSx },
            react_1.default.createElement(Typography_1.default, { variant: "body2", sx: { fontSize: 14 } }, event?.label),
            react_1.default.createElement(Typography_1.default, { variant: "caption", sx: { fontSize: 11 } },
                (0, date_fns_1.format)(event?.startDate, "p", { locale: dateFnsLocale }),
                " - ",
                (0, date_fns_1.format)(event?.endDate, "p", { locale: dateFnsLocale })))));
};
exports.default = EventItem;
//# sourceMappingURL=EventItem.js.map