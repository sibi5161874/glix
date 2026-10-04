/**
 * Conventional Commits — enforced on every commit.
 * Format: type(scope): subject
 * Example: feat(auth): add magic-link login
 */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // new feature
        "fix", // bug fix
        "docs", // docs only
        "style", // formatting, no code change
        "refactor", // neither fix nor feature
        "perf", // perf improvement
        "test", // tests
        "build", // build system
        "ci", // CI config
        "chore", // maintenance
        "revert", // revert a commit
      ],
    ],
    "subject-case": [2, "always", ["lower-case", "sentence-case"]],
    "subject-max-length": [2, "always", 72],
    "body-max-line-length": [1, "always", 100],
  },
};
