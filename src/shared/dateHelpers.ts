import * as moment from "moment";

function formatYear(moment: moment.Moment): string {
    if (!moment) {
      return "";
    }
    return moment.format("YYYY");
}

function formatDate(moment: moment.Moment): string {
    if (!moment) {
        return "";
    }
    return moment.format("MMMM D, YYYY");
}

export { formatYear, formatDate };