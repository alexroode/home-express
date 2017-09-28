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
    readonly date: string;
    readonly duration: number;
    readonly scores: Document[];
}

export interface Document {
    readonly filename: string;
    readonly title: string;
}

export interface AudioFile {
    readonly filename: string;
    readonly title: string;
}

export interface YoutubeVideo {
    readonly youtubeId: string;
    readonly title: string;
    readonly date: string;
    readonly performers: string[];
}