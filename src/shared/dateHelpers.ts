import moment from "moment";
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

function isDateInPast(date: moment.Moment) {
  return moment().isAfter(date);
}

export { formatYear, formatDate, formatPieceYear, isDateInPast };