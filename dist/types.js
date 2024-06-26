"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateView = exports.StartWeek = exports.Mode = exports.TransitionMode = void 0;
var TransitionMode;
(function (TransitionMode) {
    TransitionMode["FADE"] = "fade";
    TransitionMode["SLIDE"] = "slide";
    TransitionMode["ZOOM"] = "zoom";
})(TransitionMode = exports.TransitionMode || (exports.TransitionMode = {}));
var Mode;
(function (Mode) {
    Mode["DAY"] = "day";
    Mode["MONTH"] = "month";
    Mode["TIMELINE"] = "timeline";
    Mode["WEEK"] = "week";
})(Mode = exports.Mode || (exports.Mode = {}));
var StartWeek;
(function (StartWeek) {
    StartWeek["MON"] = "mon";
    StartWeek["SUN"] = "sun";
})(StartWeek = exports.StartWeek || (exports.StartWeek = {}));
var DateView;
(function (DateView) {
    DateView["YEAR"] = "year";
    DateView["MONTH"] = "month";
    DateView["DAY"] = "day";
})(DateView = exports.DateView || (exports.DateView = {}));
//# sourceMappingURL=types.js.map