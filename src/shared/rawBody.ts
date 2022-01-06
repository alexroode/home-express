export function rawBodySaver (req: any, _res, buffer: Buffer, encoding: BufferEncoding) {
  if (buffer && buffer.length) {
    req.rawBody = buffer.toString(encoding || "utf8");
  }
}