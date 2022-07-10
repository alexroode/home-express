import * as fs from "fs-extra";
import * as path from "path";
import moment from "moment";
import { marked } from "marked";
import { MusicLibrary, Piece, Category } from "./music";
import { NotFound } from "../shared/errors";

function notFound(): Promise<any> {
  return Promise.reject(NotFound);
}

function mapJsonDate(dateString: string): moment.Moment {
  if (!dateString) {
    return undefined;
  }
  return moment(dateString, "YYYY/MM/DD");
}

function loadDescription(piece: any): Promise<any> {
  const filePath = path.join(__dirname, "pieces", piece.id + ".md");
  return fs.readFile(filePath, "utf8")
    .then((markdown: string) => marked(markdown))
    .then((description: string) => piece.description = description)
    .catch(() => {
      piece.description = "";
    });
}

export class MusicService {
  private readonly filePath = path.join(__dirname, "music.json");
  private music?: MusicLibrary = undefined;
  private modifiedDate = new Date(0);

  private readMusicFromFile(): Promise<MusicLibrary> {
    return fs.readFile(this.filePath, "utf8")
      .then(jsonString => {
        const json = JSON.parse(jsonString.trim());

        json.pieces.forEach(piece => {
          piece.date = mapJsonDate(piece.date);
          piece.revisionDate = mapJsonDate(piece.revisionDate);

          if (piece.video) {
            piece.video.forEach(video => {
              video.date = mapJsonDate(video.date);
            });
          }
        });

        return Promise.all(json.pieces.map(piece => loadDescription(piece)))
          .then(() => json);
      })
      .then((json: any) => {
        this.music = json;
        this.modifiedDate = new Date();
        return this.music;
      });
  }

  private isOutdated(): Promise<boolean> {
    return fs.stat(this.filePath)
      .then(stats => stats.mtime > this.modifiedDate);
  }

  private sortPieces(a: Piece, b: Piece): number {
    const aDate = a.revisionDate || a.date;
    const bDate = b.revisionDate || b.date;
    return bDate.diff(aDate);
  }

  getAll(): Promise<MusicLibrary> {
    if (this.music) {
      return Promise.resolve(this.music);
    }
    return this.readMusicFromFile();
  }

  getInCategory(categoryId: string): Promise<Piece[]> {
    return this.getAll().then(result => {
      const pieces = result.pieces
        .filter(p => p.categoryId === categoryId)
        .sort(this.sortPieces);
      return pieces;
    });
  }

  findCategory(id: string): Promise<Category> {
    return this.getAll().then(result => {
      const category = result.categories.find(c => c.id === id);
      if (category) {
        return category;
      }

      return notFound();
    });
  }

  findPiece(id: string, categoryId: string): Promise<Piece> {
    return this.getAll().then(result => {
      const piece = result.pieces.find(p => p.id === id && p.categoryId === categoryId);
      if (piece) {
        return piece;
      }

      return notFound();
    });
  }

  getLatest(count: number): Promise<Piece[]> {
    return this.getAll().then(result => [...result.pieces]
      .sort(this.sortPieces)
      .slice(0, count));
  }
}

export const Music = new MusicService();