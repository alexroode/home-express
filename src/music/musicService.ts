import * as fs from "fs-extra";
import * as _ from "lodash";
import * as path from "path";
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
        this.music = JSON.parse(jsonString.trim());
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
        const pieces = _.filter(result.pieces, { "categoryId": categoryId });
        return pieces;
    });
  }

  findCategory(id: string): Promise<Category> {
    return this.getAll().then(result => {
      const category = _.find(result.categories, { "id": id });
      if (category) {
          return category;
      }

      return notFound();
    });
  }

  findPiece(id: string, categoryId: string): Promise<Piece> {
    return this.getAll().then(result => {
      const piece = _.find(result.pieces, { "id": id, "categoryId": categoryId });
      if (piece) {
          return piece;
      }

      return notFound();
    });
  }
}

export const Music = new MusicService();