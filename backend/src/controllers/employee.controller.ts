import type { FastifyRequest, FastifyReply } from "fastify";
import { CreateEmployeeInput, UpdateEmployeeInput, EmployeeFilter } from "@app/shared/schemas";
import { employeeService } from "../services/employee.service";
import { sendSuccess } from "../utils/http";
import { ValidationError } from "../utils/errors";
import { toRequestContext } from "../utils/request-context";

export const employeeController = {
  async list(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = EmployeeFilter.safeParse(req.query);
    if (!parsed.success) throw new ValidationError("Invalid query", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const { rows, total, page, limit } = await employeeService.list(req.server, ctx, parsed.data);
    return sendSuccess(reply, { items: rows, total, page, limit });
  },

  async detail(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const ctx = toRequestContext(req.auth!);
    const row = await employeeService.findById(req.server, ctx, id);
    return sendSuccess(reply, row);
  },

  async create(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = CreateEmployeeInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const row = await employeeService.create(req.server, ctx, parsed.data);
    return sendSuccess(reply, row, 201);
  },

  async update(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const parsed = UpdateEmployeeInput.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid input", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const row = await employeeService.update(req.server, ctx, id, parsed.data);
    return sendSuccess(reply, row);
  },

  async remove(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = req.params as { id: string };
    const ctx = toRequestContext(req.auth!);
    await employeeService.remove(req.server, ctx, id);
    return sendSuccess(reply, { success: true });
  },

  async importCsv(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const file = await req.file();
    if (!file) throw new ValidationError("No file uploaded");
    const buffer = await file.toBuffer();
    const ctx = toRequestContext(req.auth!);
    const summary = await employeeService.importCsv(req.server, ctx, buffer.toString("utf8"));
    return sendSuccess(reply, summary);
  },

  async exportXlsx(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = EmployeeFilter.safeParse(req.query);
    if (!parsed.success) throw new ValidationError("Invalid query", parsed.error.flatten());
    const ctx = toRequestContext(req.auth!);
    const buffer = await employeeService.exportWorkbook(req.server, ctx, parsed.data);
    reply.header(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    reply.header("Content-Disposition", 'attachment; filename="employees.xlsx"');
    return reply.send(buffer);
  },
};
