import * as fs from 'fs-extra';
import * as _ from 'lodash';
import { MusicLibrary, Piece, Category } from './music';

function notFound(): Promise<any> {
    return Promise.reject(new Error("Not found"));
}

export class MusicService {
  private readonly path = "./src/music/music.json";
  private music: MusicLibrary = {
    categories: [],
    pieces: []
  };
  private modifiedDate = new Date(0);
  
  private readMusicFromFile(): Promise<MusicLibrary> {
    console.log('reading from file');
    return fs.readFile(this.path, 'utf8')
      .then(jsonString => {
        this.music = JSON.parse(jsonString.trim());
        this.modifiedDate = new Date();
        return this.music;
      });
  }
  
  private isOutdated(): Promise<boolean> {
    return fs.stat(this.path)
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
        var pieces = _.filter(result.pieces, { 'categoryId': categoryId });
        return pieces;
    });
  }

  findCategory(id: string): Promise<Category> {
    return this.getAll().then(result => {
      var category = _.find(result.categories, { 'id': id });
      if (category) {
          return category;
      }
      
      return notFound();
    });
  }

  findPiece(id: string, categoryId: string): Promise<Piece> {
    return this.getAll().then(result => {
      var piece = _.find(result.pieces, { 'id': id, 'categoryId': categoryId });
      if (piece) {
          return piece;
      }
      
      return notFound();
    });
  }
};

export const Music = new MusicService();