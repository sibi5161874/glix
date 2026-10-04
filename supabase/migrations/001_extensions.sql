-- 001: Extensions and helper functions
-- -------------------------------------------------------------------

-- UUID generation
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Case-insensitive text (useful for slugs, emails)
create extension if not exists "citext";

-- Trigger helper: auto-update updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
