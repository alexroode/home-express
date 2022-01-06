import { google } from "googleapis";
import config from "config";

export async function getGoogleDriveApi() {
  const jwtClient = new google.auth.JWT(
    config.get<string>("googleClientEmail"),
    undefined,
    config.get<string>("googleClientPrivateKey"),
    ["https://www.googleapis.com/auth/drive"]
  );
  await jwtClient.authorize();
  return google.drive({ auth: jwtClient, version: "v3"});
}