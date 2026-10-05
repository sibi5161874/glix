# Open Questions & Decisions Log

| # | Question | Context | Priority | Status | Recommendation |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Q-01** | Superadmin Portal Password Update | Brief specified `superadmin@glix.ae` with `Connect1@345`, which returned mismatch on `/superadmin/login`. | P1 | Open | Confirm new password for superadmin, or seed fresh credentials in the self-hosted PostgreSQL migration/seed script. |
| **Q-02** | Default Leave Entitlement Rules | Are annual leave days calculated on calendar days or working days by default? | P2 | Answered | Standard UAE/GCC labor law computes 30 calendar days or 22 working days annually. |
| **Q-03** | Currency Precision & Formatting | Currency selection supports AED, USD, EUR, GBP, INR, SAR, QAR, OMR, BHD. | P2 | Resolved | Implemented via `currency.ts` formatting with localized currency symbols. |
