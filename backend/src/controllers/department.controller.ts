import type { FastifyRequest, FastifyReply } from "fastify";
import {
  CreateDepartmentInput,
  UpdateDepartmentInput,
  DepartmentFilter,
} from "@app/shared/schemas";
import { departmentService } from "../services/department.service";
import { sendSuccess } from "../utils/http";
import { ValidationError } from "../utils/errors";
import { toRequestContext } from "../utils/request-context";

export const departmentController = {
  async list(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = DepartmentFilter.safeParse(req.query);
    if (!parsed.success) throw new ValidationError("Invalid filter", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const rows = await departmentService.list(req.server, ctx, parsed.data);
    return sendSuccess(reply, rows);
  },

  async findById(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const ctx = toRequestContext(req.auth!);
    const row = await departmentService.findById(req.server, ctx, id);
    return sendSuccess(reply, row);
  },

  async create(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = CreateDepartmentInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const row = await departmentService.create(req.server, ctx, parsed.data);
    return sendSuccess(reply, row, 201);
  },

  async update(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const parsed = UpdateDepartmentInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const row = await departmentService.update(req.server, ctx, id, parsed.data);
    return sendSuccess(reply, row);
  },

  async remove(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const ctx = toRequestContext(req.auth!);
    await departmentService.remove(req.server, ctx, id);
    return sendSuccess(reply, { success: true });
  },
};
