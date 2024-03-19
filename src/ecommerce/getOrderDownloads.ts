import config from "config";
import moment from "moment";
import { readdir, stat } from "fs/promises";
import path from "path";
import mime from "mime";
import fs from "fs";
import { OrderDownload, OrderDownloads } from "../../shared/types.js";
import { getAirtableOrder, getAirtableProducts, getAirtableBase } from "../shared/airtable.js";
import { isDateInPast } from "../shared/dateHelpers.js";
import { AppError, NotFound } from "../shared/errors.js";

const orderDownloadsCache: {[orderId: string]: OrderDownloads} = {};

export async function getOrderDownloads(orderId: string): Promise<OrderDownloads> {
  if (orderDownloadsCache[orderId]) {
    return orderDownloadsCache[orderId];
  }

  const base = getAirtableBase();
  const order = await getAirtableOrder(base, orderId);

  if (!order) {
    throw NotFound;
  }
  const expirationDate = moment(order.get("Expiration Date") as string, "YYYY-MM-DD");

  if (isDateInPast(expirationDate)) {
    const orderDownloads = {
      id: orderId,
      downloads: [],
      expirationDate: expirationDate,
      isExpired: true,
    };
    orderDownloadsCache[orderId] = orderDownloads;

  } else {
    const productIds = order.get("Products") as string[];
    const products = await getAirtableProducts(base, productIds);

    const downloads: OrderDownload[] = [];
    for (const productId of productIds) {
      const product = products.find(product => product.id === productId);
      const filename = product.get("Filename") as string;

      const file = await getDownload(filename);
      if (!file) {
        throw new AppError("File did not exist", 500);
      }
      downloads.push(file);
    }

    const orderDownloads = {
      id: orderId,
      downloads,
      expirationDate: expirationDate,
      isExpired: false
    };
    orderDownloadsCache[orderId] = orderDownloads;
  }

  return orderDownloadsCache[orderId];
}

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