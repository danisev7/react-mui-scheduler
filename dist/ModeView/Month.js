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
const styles_1 = require("@mui/material/styles");
const TableCell_1 = __importDefault(require("@mui/material/TableCell"));
const TableRow_1 = __importDefault(require("@mui/material/TableRow"));
const material_1 = require("@mui/material");
const date_fns_1 = require("date-fns");
const EventItem_1 = __importDefault(require("../EventItem"));
const TableContainer_1 = __importDefault(require("@mui/material/TableContainer"));
const Paper_1 = __importDefault(require("@mui/material/Paper"));
const Table_1 = __importDefault(require("@mui/material/Table"));
const TableHead_1 = __importDefault(require("@mui/material/TableHead"));
const TableBody_1 = __importDefault(require("@mui/material/TableBody"));
const Box_1 = __importDefault(require("@mui/material/Box"));
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const EventNoteRounded_1 = __importDefault(require("@mui/icons-material/EventNoteRounded"));
const StyledTableCell = (0, styles_1.styled)(TableCell_1.default)(({ theme }) => ({
    [`&.${material_1.tableCellClasses.head}`]: {
        borderTop: `1px ${theme.palette.divider} solid !important`,
        borderBottom: `1px ${theme.palette.divider} solid !important`,
        borderLeft: `1px ${theme.palette.divider} solid !important`,
        ["&:nth-of-type(1)"]: {
            borderLeft: `0px !important`,
        },
    },
    [`&.${material_1.tableCellClasses.body}`]: {
        fontSize: 12,
        height: 96,
        width: 64,
        maxWidth: 64,
        cursor: "pointer",
        verticalAlign: "top",
        borderLeft: `1px ${theme.palette.divider} solid`,
        ["&:nth-of-type(7n+1)"]: {
            borderLeft: 0,
        },
    },
}));
const MonthModeView = ({ rows = [], options, columns = [], legacyStyle, searchResult, onTaskClick, onCellClick, onEventsChange, }) => {
    const theme = (0, styles_1.useTheme)();
    const [state, setState] = (0, react_1.useState)({});
    const today = new Date();
    const currentDaySx = {
        width: 24,
        height: 22,
        margin: "auto",
        display: "block",
        paddingTop: "2px",
        borderRadius: "50%",
    };
    const onCellDragOver = (e) => {
        e.preventDefault();
    };
    const onCellDragStart = (e, item, rowIndex) => {
        setState({
            ...state,
            itemTransfer: { item, rowIndex },
        });
    };
    const onCellDragEnter = (e, elementId, rowIndex) => {
        e.preventDefault();
        setState({
            ...state,
            transferTarget: { elementId, rowIndex },
        });
    };
    const onCellDragEnd = (e) => {
        e.preventDefault();
        if (!state.itemTransfer && !state.transferTarget)
            return;
        const transfer = state.itemTransfer;
        const transferTarget = state.transferTarget;
        const rowsCopy = Array.from(rows);
        const rowInd = rowsCopy.findIndex((d) => d.id === transferTarget?.rowIndex);
        if (rowInd !== -1) {
            const dayInd = rowsCopy[rowInd]?.days?.findIndex((d) => d.id === transferTarget?.elementId);
            if (dayInd !== -1) {
                const day = rowsCopy[rowInd]?.days[dayInd];
                // Get day of the date (DD)
                if (!transfer?.item?.day)
                    transfer.item.day = transfer?.item?.startDate.getDay();
                if (transfer?.item?.day !== day?.day) {
                    const itemCheck = day.events.findIndex((item) => item.day === transfer.item.day &&
                        item.label === transfer.item.label);
                    if (itemCheck === -1) {
                        const prevDay = rowsCopy[transfer.rowIndex].days.find((d) => d.day === transfer.item.day);
                        const itemIndexToRemove = prevDay?.events?.findIndex((i) => i.id === transfer.item.id);
                        if (itemIndexToRemove === undefined || itemIndexToRemove === -1) {
                            return;
                        }
                        prevDay?.events?.splice(itemIndexToRemove, 1);
                        transfer.item.day = day?.day;
                        transfer.item.date = day?.date;
                        day.events.push(transfer.item);
                        setState({
                            ...state,
                            rows: rowsCopy,
                            itemTransfer: null,
                            transferTarget: null,
                        });
                        onEventsChange && onEventsChange(transfer.item);
                    }
                }
            }
        }
    };
    const handleCellClick = (event, row, day) => {
        event.preventDefault();
        event.stopPropagation();
        if (day?.events?.length === 0 && onCellClick) {
            onCellClick(event, row, day);
        }
    };
    const renderEvents = (events = [], rowId) => events?.map((event) => searchResult
        ? event?.groupLabel === searchResult?.groupLabel ||
            event?.user === searchResult?.user
        : !searchResult && (react_1.default.createElement(EventItem_1.default, { event: event, rowId: rowId, elevation: 0, boxSx: { px: 0.5 }, key: `item-d-${event?.id}-${rowId}`, onClick: (e) => handleTaskClick(e, event), onDragStart: (e) => onCellDragStart(e, event, rowId), sx: {
                width: "100%",
                py: 0,
                my: 0.3,
                color: theme.palette.common.white,
                backgroundColor: event?.color || theme.palette.primary.light,
                textAlign: "left",
            } })));
    const handleTaskClick = (event, task) => {
        event.preventDefault();
        event.stopPropagation();
        onTaskClick && onTaskClick(event, task);
    };
    return (react_1.default.createElement(TableContainer_1.default, { component: Paper_1.default, sx: { boxShadow: "none" } },
        react_1.default.createElement(Table_1.default, { size: "small", "aria-label": "simple table", stickyHeader: true, sx: { minWidth: options.minWidth || 650 } },
            legacyStyle && (react_1.default.createElement(TableHead_1.default, { sx: { height: 24 } },
                react_1.default.createElement(TableRow_1.default, null, columns?.map((column, index) => (react_1.default.createElement(StyledTableCell, { align: "center", key: column?.headerName + "-" + index }, column?.headerName)))))),
            react_1.default.createElement(TableBody_1.default, null, rows?.map((row, index) => (react_1.default.createElement(TableRow_1.default, { key: `row-${row.id}-${index}` }, row?.days?.map((day, indexD) => {
                const currentDay = day.day === today.getUTCDate() &&
                    (0, date_fns_1.isSameMonth)(day.date, today);
                return (react_1.default.createElement(StyledTableCell, { scope: "row", component: "th", sx: { px: 0.5, position: "relative" }, key: `day-${day.id}`, onDragEnd: onCellDragEnd, onDragOver: onCellDragOver, onDragEnter: (e) => onCellDragEnter(e, day.id, row.id), onClick: (event) => handleCellClick(event, row, day) },
                    react_1.default.createElement(Box_1.default, { sx: { height: "100%", overflowY: "visible" } },
                        !legacyStyle &&
                            index === 0 &&
                            columns[indexD]?.headerName?.toUpperCase(),
                        react_1.default.createElement(Typography_1.default, { variant: "body2", sx: {
                                ...currentDaySx,
                                textAlign: "center",
                                background: currentDay &&
                                    (0, styles_1.alpha)(theme.palette.primary.main, 1),
                                color: currentDay && theme.palette.common.white,
                            } }, day.day),
                        day?.events?.length > 0 &&
                            renderEvents(day?.events, row.id),
                        legacyStyle && day?.events?.length === 0 && (react_1.default.createElement(EventNoteRounded_1.default, { fontSize: "small", htmlColor: theme.palette.mode === "light"
                                ? theme.palette.divider
                                : (0, styles_1.lighten)(theme.palette.common.white, 0.5) })))));
            }))))))));
};
exports.default = MonthModeView;
//# sourceMappingURL=Month.js.map