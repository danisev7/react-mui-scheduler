import React, { FC, JSX, useEffect, useReducer, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import {
  AlertProps,
  ColumnHeader,
  Day,
  Event,
  Mode,
  ModeState,
  Option,
  Row,
  RowHeader,
  StartWeek,
  ToolbarProps,
  TransitionMode,
} from "./types";
import {
  add,
  format,
  getDay,
  getDaysInMonth,
  getWeeksInMonth,
  isSameDay,
  parse,
  startOfDay,
  startOfMonth,
  startOfWeek,
  sub,
} from "date-fns";
import Zoom from "@mui/material/Zoom";
import Fade from "@mui/material/Fade";
import Slide from "@mui/material/Slide";
import { ar, de, enUS, es, fr, ja, ko, ptBR, ru, zhCN } from "date-fns/locale";
import Paper from "@mui/material/Paper";
import DateFnsLocaleContext from "./locales/dateFnsContext";
import SchedulerToolbar from "./Toolbar";
import Grid from "@mui/material/Grid";
import MonthModeView from "./ModeView/Month";
import WeekModeView from "./ModeView/Week";
import DayModeView from "./ModeView/Day";
import TimeLineModeView from "./ModeView/TimeLine";
import { deepmerge } from "@mui/utils";

const defaultOptions: Option = {
  transitionMode: TransitionMode.ZOOM,
  startWeekOn: StartWeek.MON,
  defaultMode: Mode.WEEK,
  minWidth: 540,
  maxWidth: 540,
  minHeight: 540,
  maxHeight: 540,
  reverseTimelineOrder: false,
  displayTimelineByGroupLabel: false,
};
const defaultToolbarProps: ToolbarProps = {
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

interface SchedulerProps {
  events: Event[];
  locale?: string;
  options?: Option;
  alertProps?: AlertProps;
  legacyStyle?: boolean;
  toolbarProps?: ToolbarProps;
  onCellClick?: (
    event: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    row: Row,
    day?: Day,
  ) => void;
  onTaskClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    task: Event,
  ) => void;
  onEventsChange?: (item: Event) => void;
  onAlertCloseButtonClicked?: (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void;
  onDateChange?: (day: number, date: number | Date | null) => void;
}

const Scheduler: FC<SchedulerProps> = ({
  events,
  locale = "en",
  options,
  alertProps,
  onCellClick,
  legacyStyle = false,
  onTaskClick,
  toolbarProps,
  onEventsChange,
  onAlertCloseButtonClicked,
  onDateChange,
}): JSX.Element => {
  useTheme();
  options = deepmerge(defaultOptions, options) as Option;
  toolbarProps = deepmerge(defaultToolbarProps, toolbarProps) as ToolbarProps;

  const { t, i18n } = useTranslation(["common"]);
  const weeks = [
    t("mon"),
    t("tue"),
    t("wed"),
    t("thu"),
    t("fri"),
    t("sat"),
    t("sun"),
  ];
  const [state, setState] = useState<ModeState>({});
  const [searchResult, setSearchResult] = useState<Event>();
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [alertState, setAlertState] = useState<AlertProps | undefined>(
    alertProps,
  );
  const [mode, setMode] = useState(options.defaultMode);
  const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(new Date()));
  const [startWeekOn, setStartWeekOn] = useState<StartWeek | undefined>(
    options.startWeekOn,
  );
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "MMMM-yyyy"),
  );
  const [weekDays, updateWeekDays] = useReducer(
    () =>
      options?.startWeekOn?.toUpperCase() === "SUN"
        ? [t("sun"), t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat")]
        : weeks,
    weeks,
  );

  const TransitionModeComponent =
    options.transitionMode === TransitionMode.ZOOM
      ? Zoom
      : options.transitionMode === TransitionMode.FADE
        ? Fade
        : Slide;

  let dateFnsLocale: Locale;
  switch (locale) {
    case "fr":
      dateFnsLocale = fr;
      break;
    case "ko":
      dateFnsLocale = ko;
      break;
    case "de":
      dateFnsLocale = de;
      break;
    case "es":
      dateFnsLocale = es;
      break;
    case "ar":
      dateFnsLocale = ar;
      break;
    case "ja":
      dateFnsLocale = ja;
      break;
    case "ru":
      dateFnsLocale = ru;
      break;
    case "zh":
      dateFnsLocale = zhCN;
      break;
    case "br":
      dateFnsLocale = ptBR;
      break;
    default:
      dateFnsLocale = enUS;
  }

  const getMonthHeader = (): ColumnHeader[] =>
    weekDays.map((day, i) => ({
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
    const rows: Row[] = [];
    const daysBefore: Day[] = [];
    const iteration = getWeeksInMonth(selectedDay);
    const startOnSunday =
      startWeekOn?.toUpperCase() === "SUN" &&
      t("sun").toUpperCase() === weekDays[0].toUpperCase();
    const monthStartDate = startOfMonth(selectedDay); // First day of month
    const monthStartDay = getDay(monthStartDate); // Index of the day in week
    let dateDay = parseInt(format(monthStartDate, "dd")); // Month start day
    // Condition check helper
    const checkCondition = (v: number): boolean =>
      startOnSunday ? v <= monthStartDay : v < monthStartDay;
    if (monthStartDay >= 1) {
      // Add days of precedent month
      // If Sunday is the first day of week, apply b <= monthStartDay
      // and days: (monthStartDay-b) + 1
      for (let i = 1; checkCondition(i); i++) {
        const subDate = sub(monthStartDate, {
          days: monthStartDay - i + (startOnSunday ? 1 : 0),
        });
        const day = parseInt(format(subDate, "dd"));
        const data = events.filter((event) =>
          isSameDay(subDate, event?.startDate),
        );
        daysBefore.push({
          id: `day_-${day}`,
          day: day,
          date: subDate,
          events: data,
        });
      }
    } else if (!startOnSunday) {
      for (let i = 6; i > 0; i--) {
        const subDate = sub(monthStartDate, { days: i });
        const day = parseInt(format(subDate, "dd"));
        const data = events.filter((event) =>
          isSameDay(subDate, event?.startDate),
        );
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
      const obj: Day[] = [];

      for (
        let j = 0;
        // This condition ensure that days will not exceed 31
        // i === 0 ? 7 - daysBefore?.length means that we subtract inserted days
        // in the first line to 7
        j < (i === 0 ? 7 - daysBefore.length : 7) && dateDay <= daysInMonth;
        j++
      ) {
        const date = parse(
          `${dateDay}-${selectedDate}`,
          "dd-MMMM-yyyy",
          new Date(),
        );
        const data = events.filter((event) =>
          isSameDay(date, event?.startDate),
        );
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
    const lastDaysData: Day[] = [];

    if (lastRowDaysDiff > 0) {
      const day = lastRow.days[lastRow?.days?.length - 1];
      let addDate = day.date as Date;
      for (let i = dateDay; i < dateDay + lastRowDaysDiff; i++) {
        addDate = add(addDate, { days: 1 });
        const d = format(addDate, "dd");
        const data = events.filter((event) =>
          isSameDay(addDate, event?.startDate),
        );
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
    const weekStart = startOfWeek(selectedDay, {
      weekStartsOn: startWeekOn === StartWeek.MON ? 1 : 0,
    });
    for (let i = 0; i < 7; i++) {
      const date = add(weekStart, { days: i });
      data.push({
        date: date,
        weekDay: format(date, "iii", { locale: dateFnsLocale }),
        day: format(date, "dd", { locale: dateFnsLocale }),
        month: format(date, "MM", { locale: dateFnsLocale }),
      });
    }
    return data;
  };

  const getWeekRows = () => {
    const HOURS = 24; //* 2
    const data = [];
    let dayStartHour = startOfDay(selectedDay);
    for (let i = 0; i <= HOURS; i++) {
      const id = `line_${i}`;
      const label = format(dayStartHour, "p", { locale: dateFnsLocale });

      //TODO Add everyday event capability
      //if (i === 0) {
      //id = `line_everyday`; label = 'Everyday'
      //}
      //TODO Place the processing bloc here if everyday capability is available
      // ...

      if (i > 0) {
        //Start processing bloc
        const obj: Row = { id, label, days: [] };
        const columns = getWeekHeader();
        // eslint-disable-next-line
        columns.map((column, index) => {
          const data = events.filter(
            (event) =>
              isSameDay(column?.date, event?.startDate) &&
              format(event?.startDate, "p", {
                locale: dateFnsLocale,
              })?.toUpperCase() === label?.toUpperCase(),
          );
          obj.days.push({
            id: `column-${index}_m-${column.month}_d-${column.day}_${id}`,
            date: column?.date,
            events: data,
          });
        });
        // Label affectation
        data.push(obj); // End processing bloc
        dayStartHour = add(dayStartHour, { minutes: 60 }); // 30
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
      weekDay: format(selectedDay, "iii", { locale: dateFnsLocale }),
      day: format(selectedDay, "dd", { locale: dateFnsLocale }),
      month: format(selectedDay, "MM", { locale: dateFnsLocale }),
    },
  ];

  const getDayRows = () => {
    const HOURS = 24;
    const data = [];
    let dayStartHour = startOfDay(selectedDay);

    for (let i = 0; i <= HOURS; i++) {
      const id = `line_${i}`;
      const label = format(dayStartHour, "p", { locale: dateFnsLocale });

      if (i > 0) {
        const obj: Row = { id, label, days: [] };
        const columns = getDayHeader();
        const column = columns[0];
        const matchedEvents = events.filter(
          (event) =>
            isSameDay(column?.date, event?.startDate) &&
            format(event?.startDate, "p", {
              locale: dateFnsLocale,
            })?.toUpperCase() === label?.toUpperCase(),
        );
        obj.days.push({
          id: `column-_m-${column?.month}_d-${column?.day}_${id}`,
          date: column?.date,
          events: matchedEvents,
        });

        data.push(obj);
        dayStartHour = add(dayStartHour, { minutes: 60 });
      }
    }
    return data;
  };

  const handleDateChange = (day: number, date: Date): void => {
    setDaysInMonth(day);
    setSelectedDay(date);
    setSelectedDate(format(date as number | Date, "MMMM-yyyy"));
    onDateChange && onDateChange(day, date);
  };

  const handleModeChange = (mode: Mode): void => {
    setMode(mode);
  };

  const onSearchResult = (item: Event): void => {
    setSearchResult(item);
  };

  const handleEventsChange = async (item: Event): Promise<void> => {
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
            ${format(oldObject?.startDate, "HH:mm")} to ${format(
            item?.endDate,
            "yyyy-mm-dd",
          )} ${format(item?.startDate, "HH:mm")}
          `,
        });
        setTimeout(() => {
          setAlertState({ ...alertState, open: false, message: "" });
        }, alertState.delay);
      }
    }
  };

  useEffect(() => {
    switch (mode) {
      case Mode.DAY:
        setState({
          ...state,
          columns: getDayHeader(),
          rows: getDayRows(),
        });
        break;
      case Mode.WEEK:
        setState({
          ...state,
          columns: getWeekHeader(),
          rows: getWeekRows(),
        });
        break;
      case Mode.MONTH:
        setState({
          ...state,
          columns: getMonthHeader(),
          rows: getMonthRows(),
        });
        break;
      case Mode.TIMELINE:
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

  useEffect(() => {
    if (locale !== i18n.language) {
      localStorage.setItem("i18nextLng", locale.toLowerCase());
      i18n.changeLanguage(locale.toLowerCase());
      updateWeekDays();
    }
  }, [locale]);

  useEffect(() => {
    if (options?.defaultMode !== mode) {
      setMode(options?.defaultMode as Mode);
    }
  }, [options.defaultMode]);

  useEffect(() => {
    if (options?.startWeekOn !== startWeekOn) {
      setStartWeekOn(options?.startWeekOn);
    }
    updateWeekDays();
  }, [options.startWeekOn]);

  return (
    <Paper variant="outlined" elevation={0} sx={{ p: 0 }}>
      <DateFnsLocaleContext.Provider value={dateFnsLocale}>
        <SchedulerToolbar
          events={events}
          switchMode={mode as Mode}
          alertProps={alertState}
          toolbarProps={toolbarProps}
          onDateChange={handleDateChange}
          onModeChange={handleModeChange}
          onSearchResult={onSearchResult}
          onAlertCloseButtonClicked={onAlertCloseButtonClicked}
        />
        <Grid container spacing={0} alignItems="center" justifyContent="start">
          {mode === Mode.MONTH && (
            <TransitionModeComponent in>
              <Grid item xs={12}>
                <MonthModeView
                  options={options}
                  rows={state?.rows as RowHeader[]}
                  columns={state?.columns}
                  legacyStyle={legacyStyle}
                  onTaskClick={onTaskClick}
                  onCellClick={onCellClick}
                  searchResult={searchResult}
                  onEventsChange={handleEventsChange}
                />
              </Grid>
            </TransitionModeComponent>
          )}
          {mode === Mode.WEEK && (
            <TransitionModeComponent in>
              <Grid item xs={12}>
                <WeekModeView
                  options={options}
                  rows={state?.rows as Row[]}
                  columns={state?.columns}
                  onTaskClick={onTaskClick}
                  onCellClick={onCellClick}
                  searchResult={searchResult as Event}
                  onEventsChange={handleEventsChange}
                />
              </Grid>
            </TransitionModeComponent>
          )}
          {mode === Mode.DAY && (
            <TransitionModeComponent in>
              <Grid item xs={12}>
                <DayModeView
                  options={options}
                  date={selectedDate}
                  rows={state?.rows as Row[]}
                  columns={state?.columns}
                  onTaskClick={onTaskClick}
                  onCellClick={onCellClick}
                  searchResult={searchResult}
                  onEventsChange={handleEventsChange}
                />
              </Grid>
            </TransitionModeComponent>
          )}
        </Grid>
        {mode === Mode.TIMELINE && (
          <TransitionModeComponent in>
            <Grid container spacing={2} alignItems="start">
              <Grid item xs={12}>
                <TimeLineModeView
                  options={options}
                  rows={state?.rows as Event[]}
                  onTaskClick={onTaskClick}
                  searchResult={searchResult}
                />
              </Grid>
            </Grid>
          </TransitionModeComponent>
        )}
      </DateFnsLocaleContext.Provider>
    </Paper>
  );
};

export default Scheduler;
