## Source
- Type: [Postgres / MySQL / MSSQL / CSV]
- Access: [dump / API / export]
- Size: [rows, GB]

## Target
Postgres (Supabase), multi-tenant

## Field mapping
| Legacy table | Legacy field | Target table | Target field | Transform | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |

## Data cleaning rules
- Trim whitespace
- Normalize phone numbers to E.164
- Map legacy status codes → new enums
- Handle null / empty consistently

## Cutover plan
1. Freeze legacy writes
2. Export snapshot
3. Run migration script (dry-run first)
4. Verify row counts, FK integrity
5. Switch DNS / feature flag
6. Monitor 24h
7. Decommission legacy (30 days later)

## Rollback plan
1. Re-enable legacy writes
2. Point traffic back
3. Log rollback reason in `audit_log`

## Dry-run checklist
- [ ] Row counts match source
- [ ] No orphaned FKs
- [ ] Enums mapped (no unknown values)
- [ ] PII columns handled per `SECURITY.md`
- [ ] `data.import` audit entries written
- [ ] Timestamps preserved
- [ ] Soft-deleted records handled per policy
