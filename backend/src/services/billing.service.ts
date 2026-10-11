import type { FastifyInstance } from "fastify";
import type { InvoiceFilter } from "@app/shared/schemas";
import type { RequestContext } from "../plugins/db.plugin";
import {
  billingRepository,
  type PlanRow,
  type SubscriptionRow,
  type InvoiceRow,
} from "../repositories/billing.repository";
import { NotFoundError, ConflictError } from "../utils/errors";

/**
 * This project has no payment gateway wired up (no Stripe/PayPal/Razorpay
 * keys anywhere in env config) — tier changes are recorded as `gateway:
 * 'manual'` subscriptions/invoices, matching the `gateway` column's own
 * check constraint (`stripe`, `paypal`, `manual` — see db/migrations/015_billing.sql).
 * No real payment is collected; this is an admin-confirmed record, not a
 * charge. A real gateway can be layered in later behind the same
 * `changeTier` entry point without changing its callers.
 */
function priceForCurrency(plan: PlanRow, currency: string): string {
  if (currency === "AED") return plan.priceAed;
  if (currency === "SAR") return plan.priceSar;
  return plan.priceUsd;
}

export const billingService = {
  async listPlans(fastify: FastifyInstance, ctx: RequestContext): Promise<PlanRow[]> {
    return fastify.withTenant(ctx, (client) => billingRepository.listActivePlans(client));
  },

  async getSubscription(
    fastify: FastifyInstance,
    ctx: RequestContext,
  ): Promise<SubscriptionRow | null> {
    return fastify.withTenant(ctx, (client) =>
      billingRepository.getCurrentSubscription(client, ctx.orgId),
    );
  },

  async listInvoices(
    fastify: FastifyInstance,
    ctx: RequestContext,
    filter: InvoiceFilter,
  ): Promise<{ items: InvoiceRow[]; total: number; page: number; limit: number }> {
    return fastify.withTenant(ctx, (client) =>
      billingRepository.listInvoices(client, ctx.orgId, filter),
    );
  },

  /**
   * Reads go through the org's own RLS-scoped session (`withTenant`), same as
   * every other tenant feature — but `015_billing.sql`'s own RLS policies
   * (`subscriptions_write_superadmin`, `invoices_write_superadmin`) only let
   * `is_platform_admin()` INSERT/UPDATE those two tables, never an org_admin
   * writing their own row. That's not an oversight to work around: a tenant
   * freely writing its own billing ledger is the wrong trust boundary even
   * for a "manual" gateway. So the actual subscription/invoice writes run
   * through `withPlatform` instead — the platform processing the tier change
   * on the org's behalf, which is what those RLS policies already encode.
   * `organizations.plan_id` itself IS org_admin-writable (`orgs_update_admin_or_owner`
   * in `006_rls_policies.sql` has no superadmin restriction), so that one
   * write stays on the tenant-scoped client.
   *
   * These are two separate transactions, not one atomic unit — a crash
   * between them could leave a subscription/invoice recorded without the
   * org's `plan_id` reflecting it yet. Platform-side writes run first and
   * the tenant-side `plan_id` update last, so the worst case of a crash is
   * an orphaned billing record (harmless, reconcilable) rather than an org
   * that believes it's upgraded with no billing trail at all.
   */
  async changeTier(
    fastify: FastifyInstance,
    ctx: RequestContext,
    planId: string,
  ): Promise<SubscriptionRow> {
    const { plan, currency, alreadyOnPlan } = await fastify.withTenant(ctx, async (client) => {
      const plan = await billingRepository.findPlanById(client, planId);
      if (!plan || !plan.isActive) throw new NotFoundError("Plan not found");

      const current = await billingRepository.getCurrentSubscription(client, ctx.orgId);
      const currency = await billingRepository.getOrgCurrency(client, ctx.orgId);
      return { plan, currency, alreadyOnPlan: current?.planId === planId };
    });

    if (alreadyOnPlan) throw new ConflictError("Already subscribed to this plan");

    const amount = priceForCurrency(plan, currency);

    await fastify.withPlatform({ userId: ctx.userId }, async (client) => {
      await billingRepository.cancelActiveSubscriptions(client, ctx.orgId);
      await billingRepository.createInvoice(client, ctx.orgId, currency, amount);
      await billingRepository.createSubscription(client, ctx.orgId, planId, currency, amount);
    });

    return fastify.withTenant(ctx, async (client) => {
      await billingRepository.setOrgPlan(client, ctx.orgId, planId);
      return (await billingRepository.getCurrentSubscription(client, ctx.orgId))!;
    });
  },
};
