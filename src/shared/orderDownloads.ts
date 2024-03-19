import config from "config";
import { OrderDownload } from "../ecommerce/products";
import { readdir, stat } from "fs/promises";
import path from "path";
import mime from "mime";
import fs from "fs";

export async function getDownload(filename: string): Promise<OrderDownload | undefined> {
  const basePath = config.get<string>("orderDownloadsRootPath");
  const files = await readdir(basePath);

  if (files.indexOf(filename) < 0) {
    return undefined;
  }

  const stats = await stat(path.join(basePath, filename));
  const mimeType = mime.lookup(filename);

  return {
    name: filename,
    size: stats.size.toString(),
    mimeType
  };
}

export function getDownloadStream(download: OrderDownload): fs.ReadStream {
  const basePath = config.get<string>("orderDownloadsRootPath");
  const fullPath = path.join(basePath, download.name);
  return fs.createReadStream(fullPath);
}