import * as moment from "moment";

export interface MusicLibrary {
  readonly categories: Category[];
  readonly pieces: Piece[];
}

export interface Category {
  readonly name: string;
  readonly id: string;
  readonly description: string;
}

export interface Piece {
  readonly categoryId: string;
  readonly id: string;
  readonly instrumentation: string;
  readonly subtitle: string;
  readonly title: string;
  readonly accolades: string;
  readonly description: string;
  readonly hasView: boolean;
  readonly date: moment.Moment;
  readonly revisionDate?: moment.Moment;
  readonly duration: number;
  readonly grade: number;
  readonly scores: Document[];
  readonly audio: AudioFile[];
  readonly video: YoutubeVideo[];
  readonly products?: StripePriceReference[];
}

export interface Document {
  readonly url: string;
  readonly title: string;
}

export interface AudioFile {
  readonly url: string;
  readonly title: string;
}

export interface YoutubeVideo {
  readonly youtubeId: string;
  readonly title: string;
  readonly date: moment.Moment;
  readonly performers: string[];
}

export interface StripePriceReference {
  readonly priceId: string;
  readonly name: string;
  readonly prod: boolean;
}