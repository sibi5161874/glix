import type { PoolClient } from "pg";
import type { CreateHolidayInput, UpdateHolidayInput, HolidayFilter } from "@app/shared/schemas";

export interface HolidayRow {
  id: string;
  orgId: string;
  name: string;
  date: string;
  isRecurring: boolean;
  createdAt: string;
}

const SELECT_COLUMNS = `
  id, org_id, name, to_char(date, 'YYYY-MM-DD') as date, is_recurring,
  to_char(created_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS."000Z"') as created_at
`;

export const holidayRepository = {
  async list(client: PoolClient, orgId: string, filter: HolidayFilter): Promise<HolidayRow[]> {
    const where = ["org_id = $1"];
    const params: unknown[] = [orgId];
    if (filter.year) {
      params.push(filter.year);
      where.push(`extract(year from date) = $${params.length}`);
    }
    const { rows } = await client.query(
      `select ${SELECT_COLUMNS} from public.holidays where ${where.join(" and ")} order by date`,
      params,
    );
    return rows.map(mapRow);
  },

  async findById(client: PoolClient, id: string): Promise<HolidayRow | null> {
    const { rows } = await client.query(
      `select ${SELECT_COLUMNS} from public.holidays where id = $1`,
      [id],
    );
    return rows[0] ? mapRow(rows[0]) : null;
  },

  async create(client: PoolClient, orgId: string, input: CreateHolidayInput): Promise<HolidayRow> {
    const { rows } = await client.query(
      `insert into public.holidays (org_id, name, date, is_recurring)
       values ($1,$2,$3,$4) returning id`,
      [orgId, input.name, input.date, input.isRecurring],
    );
    return (await holidayRepository.findById(client, rows[0].id))!;
  },

  async update(
    client: PoolClient,
    id: string,
    input: UpdateHolidayInput,
  ): Promise<HolidayRow | null> {
    const fields: Record<string, unknown> = {
      name: input.name,
      date: input.date,
      is_recurring: input.isRecurring,
    };
    const keys = Object.keys(fields).filter((k) => fields[k] !== undefined);
    if (keys.length === 0) return holidayRepository.findById(client, id);

    const setSql = keys.map((k, i) => `${k} = $${i + 2}`).join(", ");
    await client.query(`update public.holidays set ${setSql} where id = $1`, [
      id,
      ...keys.map((k) => fields[k]),
    ]);
    return holidayRepository.findById(client, id);
  },

  async remove(client: PoolClient, id: string): Promise<boolean> {
    const result = await client.query("delete from public.holidays where id = $1", [id]);
    return result.rowCount != null && result.rowCount > 0;
  },
};

function mapRow(r: Record<string, unknown>): HolidayRow {
  return {
    id: r["id"] as string,
    orgId: r["org_id"] as string,
    name: r["name"] as string,
    date: r["date"] as string,
    isRecurring: r["is_recurring"] as boolean,
    createdAt: r["created_at"] as string,
  };
}
