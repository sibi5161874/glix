-- 023: find_employee_login — return dob as text, not `date`
-- -------------------------------------------------------------------
-- node-pg's default type parser for `date` constructs a JS Date from local
-- timezone components, which is an off-by-one-day trap waiting to happen
-- when the backend later compares it to a plain "YYYY-MM-DD" string from the
-- login form. Returning text avoids the whole class of bug at the source.

drop function if exists public.find_employee_login(text);

create function public.find_employee_login(p_employee_code text)
returns table (
  user_id uuid,
  password_hash text,
  dob text,
  employee_id uuid,
  org_id uuid,
  role text,
  employee_status text
)
language sql
security definer
set search_path = public
as $$
  select u.id, u.password_hash, to_char(e.dob, 'YYYY-MM-DD'), e.id, e.org_id, m.role::text, e.status
  from public.employees e
  join public.users u on u.id = e.user_id
  left join public.memberships m on m.org_id = e.org_id and m.user_id = u.id
  where e.employee_code = p_employee_code
  limit 2;
$$;

grant execute on function public.find_employee_login(text) to glix_app;
