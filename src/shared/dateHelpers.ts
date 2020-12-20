import * as moment from "moment";
import { format } from "path";
import { Piece } from "../music/music";

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

function formatPieceYear(piece: Piece): string {
    let result = formatYear(piece.date);

    if (piece.revisionDate) {
        result += " / " + formatYear(piece.revisionDate);
    }

    return result;
}

export { formatYear, formatDate, formatPieceYear };