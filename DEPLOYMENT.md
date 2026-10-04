# Deployment Guide

This document outlines the deployment workflow and hosting environments.

## Environments

| Environment | Frontend URL | Backend API URL | Database |
| :--- | :--- | :--- | :--- |
| **Development** | \`http://localhost:3000\` | \`http://localhost:4000\` | Local Supabase Docker |
| **Staging** | \`https://staging.yourdomain.com\` | \`https://api-staging.yourdomain.com\` | Supabase Staging Project |
| **Production** | \`https://app.yourdomain.com\` | \`https://api.yourdomain.com\` | Supabase Production Project |

## Deployment Strategy

- **Frontend (\`frontend/\`):** Hosted on Vercel with Next.js App Router edge caching.
- **Backend (\`backend/\`):** Fastify Node.js container hosted on Fly.io / Railway.
- **Database & Storage:** Supabase managed PostgreSQL with RLS and S3-compatible private buckets.

## CI/CD Pipeline

Every pull request to \`main\` triggers GitHub Actions:
1. \`pnpm typecheck\`
2. \`pnpm lint\`
3. \`pnpm test\`
4. \`pnpm test:e2e\`
