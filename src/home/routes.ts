import { FastifyInstance } from "fastify";
import { Music } from "../music/musicService";

async function routes (fastify: FastifyInstance) {
  fastify.get("/", async (_request, reply) => {
    const latestWork = await Music.getLatest(4);
    return reply.view("index", {
      title: "Home",
      latestWork: latestWork
    });
  });

  fastify.get("/bio", (_request, reply) => reply.view("bio", { title: "Bio" }));

  fastify.get("/cart", (_request, reply) => reply.view("cart", { title: "Cart" }));

  fastify.get("/privacy-policy", (_request, reply) => reply.view("privacy-policy", { title: "Privacy Policy"}));
}

export const HomeRoutes = routes;