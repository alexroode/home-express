import { readFile } from "fs/promises";
import * as path from "path";
import moment from "moment";
import { marked } from "marked";
import { MusicLibrary, Piece, Category } from "./music.js";
import { NotFound } from "../shared/errors.js";

function notFound(): Promise<any> {
  return Promise.reject(NotFound);
}

function mapJsonDate(dateString: string): moment.Moment {
  if (!dateString) {
    return undefined;
  }
  return moment(dateString, "YYYY/MM/DD");
}

async function loadDescription(piece: any) {
  const filePath = path.join(import.meta.dirname, "pieces", piece.id + ".md");
  try {
    const markdown = await readFile(filePath, "utf8");
    const description = marked(markdown);
    piece.description = description;
  } catch {
    piece.description = "";
  }
}

function dateReviver(key: keyof(Piece) | keyof(Performance), value: any) {
  if (key === "revisionDate" || key === "date") {
    return mapJsonDate(value);
  }
  return value;
}

export class MusicService {
  private readonly filePath = path.join(import.meta.dirname, "music.json");
  private music?: MusicLibrary = undefined;

  private async readMusicFromFile(): Promise<MusicLibrary> {
    const jsonString = await readFile(this.filePath, "utf8");
    const json = JSON.parse(jsonString.trim(), dateReviver);

    await Promise.all(json.pieces.map(piece => loadDescription(piece)));

    this.music = json;
    return this.music;
  }

  private sortPieces(a: Piece, b: Piece): number {
    const aDate = a.revisionDate || a.date;
    const bDate = b.revisionDate || b.date;
    return bDate.diff(aDate);
  }

  async getLibrary(): Promise<MusicLibrary> {
    if (this.music) {
      return this.music;
    }
    return this.readMusicFromFile();
  }

  async getInCategory(categoryId: string): Promise<Piece[]> {
    const library = await this.getLibrary();
    const pieces = library.pieces
      .filter(p => p.categoryId === categoryId)
      .sort(this.sortPieces);
    return pieces;
  }

  async findCategory(id: string): Promise<Category> {
    const library = await this.getLibrary();
    const category = library.categories.find(c => c.id === id);
    if (category) {
      return category;
    }
    return notFound();
  }

  async findPiece(id: string, categoryId: string): Promise<Piece> {
    const library = await this.getLibrary();
    const piece = library.pieces.find(p => p.id === id && p.categoryId === categoryId);
    if (piece) {
      return piece;
    }
    return notFound();
  }

  async getLatest(count: number): Promise<Piece[]> {
    const library = await this.getLibrary();
    return [...library.pieces]
      .sort(this.sortPieces)
      .slice(0, count);
  }
}

export const Music = new MusicService();