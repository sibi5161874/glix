# Deployment Guide

This document outlines the deployment workflow and hosting environments.

## Environments

| Environment | Frontend URL | Backend API URL | Database |
| :--- | :--- | :--- | :--- |
| **Development** | \`http://localhost:4000\` | \`http://localhost:5000\` | Local self-hosted PostgreSQL 16 |
| **Staging** | \`https://staging.yourdomain.com\` | \`https://api-staging.yourdomain.com\` | Self-hosted PostgreSQL 16 (staging VPS) |
| **Production** | \`https://app.yourdomain.com\` | \`https://api.yourdomain.com\` | Self-hosted PostgreSQL 16 (production VPS) |

## Deployment Strategy

- **Frontend (\`frontend/\`):** Hosted on Vercel with Next.js App Router edge caching.
- **Backend (\`backend/\`):** Fastify Node.js container hosted on Fly.io / Railway.
- **Database & Storage:** Self-hosted PostgreSQL 16 + VPS filesystem, with Postgres RLS for tenant isolation and attachment metadata tracked in the \`attachments\` table.

## CI/CD Pipeline

Every pull request to \`main\` triggers GitHub Actions:
1. \`pnpm typecheck\`
2. \`pnpm lint\`
3. \`pnpm test\`
4. \`pnpm test:e2e\`
