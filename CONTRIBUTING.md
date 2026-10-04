# Contributing Guidelines

## Development Workflow

1. **Branching Strategy**: Branch from \`main\` using Conventional Branch names:
   - \`feat/feature-name\`
   - \`fix/bug-description\`
   - \`chore/task-name\`
2. **Commit Conventions**: Conventional Commits standard enforced via commitlint:
   - \`feat: add employee export\`
   - \`fix: resolve leave balance deduction calculation\`
   - \`docs: update API spec\`
3. **Pre-commit Checks**: Husky runs \`lint-staged\` and type checking before commits and pushes.
4. **Code Standards**:
   - Strict TypeScript (\`noImplicitAny\`, no \`any\` without rationale comment).
   - Zod validation at all system boundaries.
   - Tenant scoping (\`org_id\`) on all database operations.
