import { FromSchema } from "json-schema-to-ts";

export const contactRequest = {
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string" },
    message: { type: "string" },
    "g-recaptcha-response": { type: "string" },
  },
  required: ["name", "email", "message", "g-recaptcha-response"],
} as const;

export type IContactRequest = FromSchema<typeof contactRequest>;