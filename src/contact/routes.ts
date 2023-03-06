import { FastifyInstance } from "fastify";
import { recaptchaSiteKey } from "../shared/recaptcha";
import { contactRequest, IContactRequest } from "./contactRequest";
import formData from "form-data";
import Mailgun from "mailgun.js";
import config from "config";

async function routes (fastify: FastifyInstance) {
  fastify.get("/contact", (_request, reply) => reply.view("contact", { title: "Contact", recaptchaSiteKey }));

  fastify.post<{ Body: IContactRequest }>(
    "/api/contact",
    {
      schema: {
        body: contactRequest
      }
    },
    async (request, reply) => {
      const data = request.body;
      const mailgun = new Mailgun(formData);
      const mailgunClient = mailgun.client({ key: config.get<string>("mailgunApiKey"), username: "api" });

      const message = {
        to: [config.get<string>("contactToEmail")],
        from: "Contact Form <contact@alexander-roode.com>",
        subject: "Contact Form Submission",
        html: `<strong>Name</strong>: ${data.name}<br/>` +
        `<strong>Email</strong>: ${data.email}<br/>` +
        `<strong>Message</strong>: <br/><p>${data.message}</p>`
      };

      await mailgunClient.messages.create(config.get<string>("mailgunDomain"), message);

      return reply.status(204).send();
    }
  );
}

export const ContactRoutes = routes;