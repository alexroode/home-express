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
    readonly description: string;
    readonly hasView: boolean;
    readonly date: moment.Moment;
    readonly revisionDate?: moment.Moment;
    readonly duration: number;
    readonly scores: Document[];
    readonly audio: AudioFile[];
    readonly video: YoutubeVideo[];
    readonly productIds: number[];
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

export interface Product {
    readonly localName: string;
    readonly localId: number;
    readonly id: string;
    readonly name: string;
    readonly price: number;
    readonly currency: string;
    readonly price_id: string;
}