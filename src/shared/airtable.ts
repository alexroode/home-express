import Airtable from "airtable";
import config from "config";

export function getAirtableBase() {
  const airtable = new Airtable({apiKey: config.get<string>("airtableApiKey")});
  return airtable.base(config.get<string>("airtableBaseId"));
}

export async function getAirtableProducts(base: Airtable.Base, productIds: string[]) {
  const productsTableName = config.get<string>("airtableProductsTableName");
  const productsTable = base.table(productsTableName);
  const products = await productsTable.select().all();
  return products.filter(product => productIds.indexOf(product.id) > -1);
}

export async function getAirtableOrder(base: Airtable.Base, orderId: string) {
  const orderTableName = config.get<string>("airtableOrdersTableName");
  const records = await base.table(orderTableName).select({ filterByFormula: `{URL ID} = "${orderId}"` }).all();

  if (records.length === 0) {
    return undefined;
  }

  return records[0];
}