-- 015: Billing bridge — subscriptions, invoices
-- -------------------------------------------------------------------

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  status text not null check (status in ('active', 'trialing', 'past_due', 'canceled')),
  currency text not null,
  amount numeric(10, 2) not null,
  current_period_start timestamptz not null,
  current_period_end timestamptz not null,
  trial_ends_at timestamptz,
  gateway text check (gateway in ('stripe', 'paypal', 'manual')),
  gateway_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

create index subscriptions_org_id_idx on public.subscriptions(org_id);
create index subscriptions_plan_id_idx on public.subscriptions(plan_id);

alter table public.subscriptions enable row level security;

create policy "subscriptions_select_admin_or_superadmin"
  on public.subscriptions for select
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

create policy "subscriptions_write_superadmin"
  on public.subscriptions for all
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

-- ── invoices ────────────────────────────────────────────────────────
create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  invoice_number text unique not null,
  amount numeric(10, 2) not null,
  tax_amount numeric(10, 2) not null default 0,
  currency text not null,
  status text not null check (status in ('draft', 'open', 'paid', 'void')),
  gateway text,
  gateway_invoice_id text,
  issued_at timestamptz not null default now(),
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger invoices_set_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();

create index invoices_org_id_idx on public.invoices(org_id);

alter table public.invoices enable row level security;

create policy "invoices_select_admin_or_superadmin"
  on public.invoices for select
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

create policy "invoices_write_superadmin"
  on public.invoices for all
  using (public.is_platform_admin())
  with check (public.is_platform_admin());
