import { FastifyInstance } from "fastify";
import { Music } from "../music/musicService";
import { formatDate, formatPieceYear, formatYear } from "../shared/dateHelpers";

async function routes (fastify: FastifyInstance) {
  fastify.get("/", async (request, reply) => {
    const latestWork = await Music.getLatest(4);
    return reply.view("index", {
      title: "Home",
      latestWork: latestWork,
      formatDate: formatDate,
      formatYear: formatYear,
      formatPieceYear: formatPieceYear
    });
  });

  fastify.get("/bio", (request, reply) => {
    return reply.view("bio", { title: "Bio" });
  });

  fastify.get("/cart", (request, reply) => {
    return reply.view("cart", { title: "Cart" });
  });

  fastify.get("/privacy-policy", (request, reply) => {
    return reply.view("privacy-policy", { title: "Privacy Policy"});
  });
}

export const HomeRoutes = routes;