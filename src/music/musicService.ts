import * as fs from "fs-extra";
import * as path from "path";
import * as moment from "moment";
import { MusicLibrary, Piece, Category } from "./music";
import { NotFound } from "../shared/errors";

function notFound(): Promise<any> {
    return Promise.reject(NotFound);
}

export class MusicService {
  private readonly filePath = path.join(__dirname, "music.json");
  private music: MusicLibrary = {
    categories: [],
    pieces: []
  };
  private modifiedDate = new Date(0);

  private readMusicFromFile(): Promise<MusicLibrary> {
    return fs.readFile(this.filePath, "utf8")
      .then(jsonString => {
        const json = JSON.parse(jsonString.trim());

        json.pieces.forEach(piece => {
          piece.date = moment(piece.date, "YYYY/MM/DD");

          if (piece.video) {
            piece.video.forEach(video => {
              video.date = moment(video.date, "YYYY/MM/DD");
            });
          }
        });

        this.music = json;
        this.modifiedDate = new Date();
        return this.music;
      });
  }

  private isOutdated(): Promise<boolean> {
    return fs.stat(this.filePath)
      .then(stats => stats.mtime > this.modifiedDate);
  }

  getAll(): Promise<MusicLibrary> {
    return this.isOutdated().then(outdated => {
      if (outdated) {
        return this.readMusicFromFile();
      }

      return this.music;
    });
  }

  getInCategory(categoryId: string): Promise<Piece[]> {
    return this.getAll().then(result => {
        const pieces = result.pieces.filter(p => p.categoryId === categoryId);
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
      .sort((p1, p2) => p2.date.diff(p1.date))
      .slice(0, count));
  }
}

export const Music = new MusicService();