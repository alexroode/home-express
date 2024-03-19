import moment from "moment";
import { GoogleDriveDownload, OrderDownloads } from "../../shared/types.js";
import { getAirtableOrder, getAirtableProducts, getAirtableBase } from "../shared/airtable.js";
import { isDateInPast } from "../shared/dateHelpers.js";
import { NotFound } from "../shared/errors.js";
import { getGoogleDriveApi } from "../shared/googleDrive.js";

const orderDownloadsCache: {[orderId: string]: OrderDownloads} = {};

export async function getOrderDownloads(orderId: string): Promise<OrderDownloads> {
  if (orderDownloadsCache[orderId]) {
    return orderDownloadsCache[orderId];
  }

  const base = getAirtableBase();
  const googleDriveApi = await getGoogleDriveApi();
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

    const downloads: GoogleDriveDownload[] = [];
    for (const productId of productIds) {
      const product = products.find(product => product.id === productId);
      const googleDriveId = product.get("Google Drive ID") as string;

      const file = await googleDriveApi.files.get({ fileId: googleDriveId, fields: "id, name, size, mimeType" });
      downloads.push({
        id: file.data.id,
        mimeType: file.data.mimeType,
        size: file.data.size,
        name: file.data.name
      });
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