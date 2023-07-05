import React, { FC } from "react";
import { Event, Option } from "./types";
interface TimeLineModeViewProps {
    options: Option;
    rows: any[];
    searchResult: any;
    onTaskClick?: (event: React.MouseEvent<HTMLDivElement>, task: Event) => void;
}
declare const TimeLineModeView: FC<TimeLineModeViewProps>;
export default TimeLineModeView;