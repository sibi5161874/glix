# Autonomous Execution & Non-Interactive Mode Standard

## Core Directives

1. **Auto-Approve & Proactive Execution**:
   - Execute all terminal commands, file reads, writes, and validations autonomously without pausing to ask the user for permission.
   - Do not ask "May I run this command?", "Should I proceed with creating these files?", or similar permission requests.

2. **Doubt vs Permission Distinction**:
   - **Permission (Forbidden to ask)**: Routine command execution, file creation, linting, formatting, test runs, and dependency installations. Execute directly.
   - **Doubts / Ambiguities (Allowed & Encouraged)**: Unclear business requirements, ambiguous legacy data mappings, conflicting architectural decisions, or destructive operations outside the scope. Ask structured questions to clarify.

3. **Continuous Verification**:
   - Always run verification checks (`format:check`, `typecheck`, `lint`, `test`) proactively after code modifications.
