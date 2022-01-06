import Airtable, { FieldSet } from "airtable";
import { nanoid } from "nanoid";
import config from "config";
import Stripe from "stripe";
import moment from "moment";

export function getAirtableBase() {
  const airtable = new Airtable({apiKey: config.get<string>("airtableApiKey")});
  return airtable.base(config.get<string>("airtableBaseId"));
}

export async function getAirtableProducts(base: Airtable.Base, productIds: string[]) {
  const productsTable = getProductsTable(base);
  const products = await productsTable.select().all();
  return products.filter(product => productIds.indexOf(product.id) > -1);
}

export async function getAirtableOrder(base: Airtable.Base, orderId: string) {
  const orderTable = getOrdersTable(base);
  const orders = await orderTable.select({ filterByFormula: `{URL ID} = "${orderId}"` }).all();

  if (orders.length === 0) {
    return undefined;
  }

  return orders[0];
}

function getOrdersTable(base: Airtable.Base): Airtable.Table<FieldSet> {
  const orderTableName = config.get<string>("airtableOrdersTableName");
  return base.table(orderTableName);
}

function getProductsTable(base: Airtable.Base): Airtable.Table<FieldSet> {
  const productsTableName = config.get<string>("airtableProductsTableName");
  return base.table(productsTableName);
}

export async function createAirtableOrder(paymentIntent: Stripe.PaymentIntent) {
  const base = getAirtableBase();
  const ordersTable = getOrdersTable(base);
  const urlId = nanoid();
  const expirationDate = moment().add(4, "weeks");

  try {
    await ordersTable.create([
      {
        "fields": {
          "URL ID": urlId,
          "Payment Intent ID": paymentIntent.id,
          "Status": "Needs Fulfillment",
          "Expiration Date": expirationDate.format("MM/DD/YYYY")
        }
      }
    ]);
  } catch (error) {
    console.log(error);
    throw (error);
  }
}