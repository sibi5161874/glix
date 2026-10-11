import type { FastifyPluginAsync } from "fastify";
import { CreateLeadInput } from "@app/shared/schemas";
import { leadsRepository } from "../../repositories/leads.repository";
import { billingRepository } from "../../repositories/billing.repository";
import { platformSettingsRepository } from "../../repositories/platform-settings.repository";
import { sendSuccess } from "../../utils/http";
import { ValidationError } from "../../utils/errors";

const publicRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/contact", async (req, reply) => {
    const parsed = CreateLeadInput.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError("Invalid contact form input", parsed.error.flatten());
    }
    const client = await fastify.pg.connect();
    try {
      const lead = await leadsRepository.createLead(client, parsed.data);
      return sendSuccess(
        reply,
        { id: lead.id, message: "Thank you for reaching out! We will contact you shortly." },
        201,
      );
    } finally {
      client.release();
    }
  });

  fastify.get("/plans", async (_req, reply) => {
    const client = await fastify.pg.connect();
    try {
      const plans = await billingRepository.listActivePlans(client);
      return sendSuccess(reply, plans);
    } finally {
      client.release();
    }
  });

  fastify.get("/settings", async (_req, reply) => {
    const client = await fastify.pg.connect();
    try {
      const settings = await platformSettingsRepository.listSettings(client);
      const publicSettings = settings.filter(
        (s) => s.key.startsWith("landing.") || s.key.startsWith("legal."),
      );
      return sendSuccess(reply, publicSettings);
    } finally {
      client.release();
    }
  });
};

export default publicRoutes;
