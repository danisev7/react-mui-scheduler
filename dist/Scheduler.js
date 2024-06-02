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
const react_i18next_1 = require("react-i18next");
const types_1 = require("./types");
const date_fns_1 = require("date-fns");
const Zoom_1 = __importDefault(require("@mui/material/Zoom"));
const Fade_1 = __importDefault(require("@mui/material/Fade"));
const Slide_1 = __importDefault(require("@mui/material/Slide"));
const locale_1 = require("date-fns/locale");
const Paper_1 = __importDefault(require("@mui/material/Paper"));
const dateFnsContext_1 = __importDefault(require("./locales/dateFnsContext"));
const Toolbar_1 = __importDefault(require("./Toolbar"));
const Grid_1 = __importDefault(require("@mui/material/Grid"));
const Month_1 = __importDefault(require("./ModeView/Month"));
const Week_1 = __importDefault(require("./ModeView/Week"));
const Day_1 = __importDefault(require("./ModeView/Day"));
const TimeLine_1 = __importDefault(require("./ModeView/TimeLine"));
const utils_1 = require("@mui/utils");
const defaultOptions = {
    transitionMode: types_1.TransitionMode.ZOOM,
    startWeekOn: types_1.StartWeek.MON,
    defaultMode: types_1.Mode.WEEK,
    minWidth: 540,
    maxWidth: 540,
    minHeight: 540,
    maxHeight: 540,
    reverseTimelineOrder: false,
    displayTimelineByGroupLabel: false,
};
const defaultToolbarProps = {
    showSearchBar: true,
    showSwitchModeButtons: {
        showMonthButton: true,
        showWeekButton: true,
        showDayButton: true,
        showTimelineButton: true,
    },
    showDatePicker: true,
    showOptions: true,
    optionMenus: [],
    showTodayAction: true,
};
const Scheduler = ({ events, locale = "en", options, alertProps, onCellClick, legacyStyle = false, onTaskClick, toolbarProps, onEventsChange, onAlertCloseButtonClicked, onDateChange, }) => {
    (0, styles_1.useTheme)();
    options = (0, utils_1.deepmerge)(defaultOptions, options);
    toolbarProps = (0, utils_1.deepmerge)(defaultToolbarProps, toolbarProps);
    const { t, i18n } = (0, react_i18next_1.useTranslation)(["common"]);
    const weeks = [
        t("mon"),
        t("tue"),
        t("wed"),
        t("thu"),
        t("fri"),
        t("sat"),
        t("sun"),
    ];
    const [state, setState] = (0, react_1.useState)({});
    const [searchResult, setSearchResult] = (0, react_1.useState)();
    const [selectedDay, setSelectedDay] = (0, react_1.useState)(new Date());
    const [alertState, setAlertState] = (0, react_1.useState)(alertProps);
    const [mode, setMode] = (0, react_1.useState)(options.defaultMode);
    const [daysInMonth, setDaysInMonth] = (0, react_1.useState)((0, date_fns_1.getDaysInMonth)(new Date()));
    const [startWeekOn, setStartWeekOn] = (0, react_1.useState)(options.startWeekOn);
    const [selectedDate, setSelectedDate] = (0, react_1.useState)((0, date_fns_1.format)(new Date(), "MMMM-yyyy"));
    const [weekDays, updateWeekDays] = (0, react_1.useReducer)(() => options?.startWeekOn?.toUpperCase() === "SUN"
        ? [t("sun"), t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat")]
        : weeks, weeks);
    const TransitionModeComponent = options.transitionMode === types_1.TransitionMode.ZOOM
        ? Zoom_1.default
        : options.transitionMode === types_1.TransitionMode.FADE
            ? Fade_1.default
            : Slide_1.default;
    let dateFnsLocale;
    switch (locale) {
        case "fr":
            dateFnsLocale = locale_1.fr;
            break;
        case "ko":
            dateFnsLocale = locale_1.ko;
            break;
        case "de":
            dateFnsLocale = locale_1.de;
            break;
        case "es":
            dateFnsLocale = locale_1.es;
            break;
        case "ar":
            dateFnsLocale = locale_1.ar;
            break;
        case "ja":
            dateFnsLocale = locale_1.ja;
            break;
        case "ru":
            dateFnsLocale = locale_1.ru;
            break;
        case "zh":
            dateFnsLocale = locale_1.zhCN;
            break;
        case "br":
            dateFnsLocale = locale_1.ptBR;
            break;
        default:
            dateFnsLocale = locale_1.enUS;
    }
    const getMonthHeader = () => weekDays.map((day, i) => ({
        id: `row-day-header-${i + 1}`,
        flex: 1,
        sortable: false,
        editable: false,
        align: "center",
        headerName: day,
        headerAlign: "center",
        field: `rowday${i + 1}`,
        headerClassName: "scheduler-theme--header",
    }));
    const getMonthRows = () => {
        const rows = [];
        const daysBefore = [];
        const iteration = (0, date_fns_1.getWeeksInMonth)(selectedDay);
        const startOnSunday = startWeekOn?.toUpperCase() === "SUN" &&
            t("sun").toUpperCase() === weekDays[0].toUpperCase();
        const monthStartDate = (0, date_fns_1.startOfMonth)(selectedDay); // First day of month
        const monthStartDay = (0, date_fns_1.getDay)(monthStartDate); // Index of the day in week
        let dateDay = parseInt((0, date_fns_1.format)(monthStartDate, "dd")); // Month start day
        // Condition check helper
        const checkCondition = (v) => startOnSunday ? v <= monthStartDay : v < monthStartDay;
        if (monthStartDay >= 1) {
            // Add days of precedent month
            // If Sunday is the first day of week, apply b <= monthStartDay
            // and days: (monthStartDay-b) + 1
            for (let i = 1; checkCondition(i); i++) {
                const subDate = (0, date_fns_1.sub)(monthStartDate, {
                    days: monthStartDay - i + (startOnSunday ? 1 : 0),
                });
                const day = parseInt((0, date_fns_1.format)(subDate, "dd"));
                const data = events.filter((event) => (0, date_fns_1.isSameDay)(subDate, event?.startDate));
                daysBefore.push({
                    id: `day_-${day}`,
                    day: day,
                    date: subDate,
                    events: data,
                });
            }
        }
        else if (!startOnSunday) {
            for (let i = 6; i > 0; i--) {
                const subDate = (0, date_fns_1.sub)(monthStartDate, { days: i });
                const day = parseInt((0, date_fns_1.format)(subDate, "dd"));
                const data = events.filter((event) => (0, date_fns_1.isSameDay)(subDate, event?.startDate));
                daysBefore.push({
                    id: `day_-${day}`,
                    day: day,
                    date: subDate,
                    events: data,
                });
            }
        }
        if (daysBefore.length > 0) {
            rows.push({ id: 0, days: daysBefore });
        }
        // Add days and events events
        for (let i = 0; i < iteration; i++) {
            const obj = [];
            for (let j = 0; 
            // This condition ensure that days will not exceed 31
            // i === 0 ? 7 - daysBefore?.length means that we subtract inserted days
            // in the first line to 7
            j < (i === 0 ? 7 - daysBefore.length : 7) && dateDay <= daysInMonth; j++) {
                const date = (0, date_fns_1.parse)(`${dateDay}-${selectedDate}`, "dd-MMMM-yyyy", new Date());
                const data = events.filter((event) => (0, date_fns_1.isSameDay)(date, event?.startDate));
                obj.push({
                    id: `day_-${dateDay}`,
                    date,
                    events: data,
                    day: dateDay,
                });
                dateDay++;
            }
            if (i === 0 && daysBefore.length > 0) {
                rows[0].days = rows[0].days.concat(obj);
                continue;
            }
            if (obj.length > 0) {
                rows.push({ id: i, days: obj });
            }
        }
        // Check if last row is not fully filled
        const lastRow = rows[iteration - 1];
        const lastRowDaysDiff = 7 - lastRow?.days?.length;
        const lastDaysData = [];
        if (lastRowDaysDiff > 0) {
            const day = lastRow.days[lastRow?.days?.length - 1];
            let addDate = day.date;
            for (let i = dateDay; i < dateDay + lastRowDaysDiff; i++) {
                addDate = (0, date_fns_1.add)(addDate, { days: 1 });
                const d = (0, date_fns_1.format)(addDate, "dd");
                const data = events.filter((event) => (0, date_fns_1.isSameDay)(addDate, event?.startDate));
                lastDaysData.push({
                    id: `day_-${d}`,
                    date: addDate,
                    day: d,
                    events: data,
                });
            }
            rows[iteration - 1].days = rows[iteration - 1].days.concat(lastDaysData);
        }
        return rows;
    };
    const getWeekHeader = () => {
        const data = [];
        const weekStart = (0, date_fns_1.startOfWeek)(selectedDay, {
            weekStartsOn: startWeekOn === types_1.StartWeek.MON ? 1 : 0,
        });
        for (let i = 0; i < 7; i++) {
            const date = (0, date_fns_1.add)(weekStart, { days: i });
            data.push({
                date: date,
                weekDay: (0, date_fns_1.format)(date, "iii", { locale: dateFnsLocale }),
                day: (0, date_fns_1.format)(date, "dd", { locale: dateFnsLocale }),
                month: (0, date_fns_1.format)(date, "MM", { locale: dateFnsLocale }),
            });
        }
        return data;
    };
    const getWeekRows = () => {
        const HOURS = 24; //* 2
        const data = [];
        let dayStartHour = (0, date_fns_1.startOfDay)(selectedDay);
        for (let i = 0; i <= HOURS; i++) {
            const id = `line_${i}`;
            const label = (0, date_fns_1.format)(dayStartHour, "p", { locale: dateFnsLocale });
            //TODO Add everyday event capability
            //if (i === 0) {
            //id = `line_everyday`; label = 'Everyday'
            //}
            //TODO Place the processing bloc here if everyday capability is available
            // ...
            if (i > 0) {
                //Start processing bloc
                const obj = { id, label, days: [] };
                const columns = getWeekHeader();
                // eslint-disable-next-line
                columns.map((column, index) => {
                    const data = events.filter((event) => (0, date_fns_1.isSameDay)(column?.date, event?.startDate) &&
                        (0, date_fns_1.format)(event?.startDate, "p", {
                            locale: dateFnsLocale,
                        })?.toUpperCase() === label?.toUpperCase());
                    obj.days.push({
                        id: `column-${index}_m-${column.month}_d-${column.day}_${id}`,
                        date: column?.date,
                        events: data,
                    });
                });
                // Label affectation
                data.push(obj); // End processing bloc
                dayStartHour = (0, date_fns_1.add)(dayStartHour, { minutes: 60 }); // 30
            }
            //if (i > 0) {
            //  dayStartHour = add(dayStartHour, {minutes: 30})
            //}
        }
        return data;
    };
    const getDayHeader = () => [
        {
            date: selectedDay,
            weekDay: (0, date_fns_1.format)(selectedDay, "iii", { locale: dateFnsLocale }),
            day: (0, date_fns_1.format)(selectedDay, "dd", { locale: dateFnsLocale }),
            month: (0, date_fns_1.format)(selectedDay, "MM", { locale: dateFnsLocale }),
        },
    ];
    const getDayRows = () => {
        const HOURS = 24;
        const data = [];
        let dayStartHour = (0, date_fns_1.startOfDay)(selectedDay);
        for (let i = 0; i <= HOURS; i++) {
            const id = `line_${i}`;
            const label = (0, date_fns_1.format)(dayStartHour, "p", { locale: dateFnsLocale });
            if (i > 0) {
                const obj = { id, label, days: [] };
                const columns = getDayHeader();
                const column = columns[0];
                const matchedEvents = events.filter((event) => (0, date_fns_1.isSameDay)(column?.date, event?.startDate) &&
                    (0, date_fns_1.format)(event?.startDate, "p", {
                        locale: dateFnsLocale,
                    })?.toUpperCase() === label?.toUpperCase());
                obj.days.push({
                    id: `column-_m-${column?.month}_d-${column?.day}_${id}`,
                    date: column?.date,
                    events: matchedEvents,
                });
                data.push(obj);
                dayStartHour = (0, date_fns_1.add)(dayStartHour, { minutes: 60 });
            }
        }
        return data;
    };
    const handleDateChange = (day, date) => {
        setDaysInMonth(day);
        setSelectedDay(date);
        setSelectedDate((0, date_fns_1.format)(date, "MMMM-yyyy"));
        onDateChange && onDateChange(day, date);
    };
    const handleModeChange = (mode) => {
        setMode(mode);
    };
    const onSearchResult = (item) => {
        setSearchResult(item);
    };
    const handleEventsChange = async (item) => {
        onEventsChange && onEventsChange(item);
        const eventIndex = events.findIndex((e) => e.id === item?.id);
        if (eventIndex !== -1) {
            const oldObject = Object.assign({}, events[eventIndex]);
            if (alertState?.showNotification && !alertState.open) {
                setAlertState({
                    ...alertState,
                    open: true,
                    message: `
            ${item?.label} successfully moved from ${oldObject?.startDate}
            ${(0, date_fns_1.format)(oldObject?.startDate, "HH:mm")} to ${(0, date_fns_1.format)(item?.endDate, "yyyy-mm-dd")} ${(0, date_fns_1.format)(item?.startDate, "HH:mm")}
          `,
                });
                setTimeout(() => {
                    setAlertState({ ...alertState, open: false, message: "" });
                }, alertState.delay);
            }
        }
    };
    (0, react_1.useEffect)(() => {
        switch (mode) {
            case types_1.Mode.DAY:
                setState({
                    ...state,
                    columns: getDayHeader(),
                    rows: getDayRows(),
                });
                break;
            case types_1.Mode.WEEK:
                setState({
                    ...state,
                    columns: getWeekHeader(),
                    rows: getWeekRows(),
                });
                break;
            case types_1.Mode.MONTH:
                setState({
                    ...state,
                    columns: getMonthHeader(),
                    rows: getMonthRows(),
                });
                break;
            case types_1.Mode.TIMELINE:
                setState({
                    ...state,
                    columns: getDayHeader(),
                    rows: events,
                });
                break;
        }
    }, [
        mode,
        weekDays,
        daysInMonth,
        selectedDay,
        selectedDate,
        dateFnsLocale,
        i18n.language,
        startWeekOn,
    ]);
    (0, react_1.useEffect)(() => {
        if (locale !== i18n.language) {
            localStorage.setItem("i18nextLng", locale.toLowerCase());
            i18n.changeLanguage(locale.toLowerCase());
            updateWeekDays();
        }
    }, [locale]);
    (0, react_1.useEffect)(() => {
        if (options?.defaultMode !== mode) {
            setMode(options?.defaultMode);
        }
    }, [options.defaultMode]);
    (0, react_1.useEffect)(() => {
        if (options?.startWeekOn !== startWeekOn) {
            setStartWeekOn(options?.startWeekOn);
        }
        updateWeekDays();
    }, [options.startWeekOn]);
    return (react_1.default.createElement(Paper_1.default, { variant: "outlined", elevation: 0, sx: { p: 0 } },
        react_1.default.createElement(dateFnsContext_1.default.Provider, { value: dateFnsLocale },
            react_1.default.createElement(Toolbar_1.default, { events: events, switchMode: mode, alertProps: alertState, toolbarProps: toolbarProps, onDateChange: handleDateChange, onModeChange: handleModeChange, onSearchResult: onSearchResult, onAlertCloseButtonClicked: onAlertCloseButtonClicked }),
            react_1.default.createElement(Grid_1.default, { container: true, spacing: 0, alignItems: "center", justifyContent: "start" },
                mode === types_1.Mode.MONTH && (react_1.default.createElement(TransitionModeComponent, { in: true },
                    react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                        react_1.default.createElement(Month_1.default, { options: options, rows: state?.rows, columns: state?.columns, legacyStyle: legacyStyle, onTaskClick: onTaskClick, onCellClick: onCellClick, searchResult: searchResult, onEventsChange: handleEventsChange })))),
                mode === types_1.Mode.WEEK && (react_1.default.createElement(TransitionModeComponent, { in: true },
                    react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                        react_1.default.createElement(Week_1.default, { options: options, rows: state?.rows, columns: state?.columns, onTaskClick: onTaskClick, onCellClick: onCellClick, searchResult: searchResult, onEventsChange: handleEventsChange })))),
                mode === types_1.Mode.DAY && (react_1.default.createElement(TransitionModeComponent, { in: true },
                    react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                        react_1.default.createElement(Day_1.default, { options: options, date: selectedDate, rows: state?.rows, columns: state?.columns, onTaskClick: onTaskClick, onCellClick: onCellClick, searchResult: searchResult, onEventsChange: handleEventsChange }))))),
            mode === types_1.Mode.TIMELINE && (react_1.default.createElement(TransitionModeComponent, { in: true },
                react_1.default.createElement(Grid_1.default, { container: true, spacing: 2, alignItems: "start" },
                    react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                        react_1.default.createElement(TimeLine_1.default, { options: options, rows: state?.rows, onTaskClick: onTaskClick, searchResult: searchResult }))))))));
};
exports.default = Scheduler;
//# sourceMappingURL=Scheduler.js.map