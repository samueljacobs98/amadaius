# Contributing to Amadaius

First off, thank you for taking the time to contribute! We welcome community contributions to make Amadaius even better.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Commit Messages](#commit-messages)
4. [Linting and Code Style](#linting-and-code-style)
5. [Testing](#testing)
6. [Pull Requests](#pull-requests)
7. [Release & Versioning](#release--versioning)
8. [License](#license)

---

## Getting Started

1. **Fork this repository**  
   Create your own fork of the project so you can make changes without affecting the original repository.

2. **Clone your fork**

   ```bash
   git clone https://github.com/<your-username>/amadaius.git
   cd amadaius
   ```

3. **Set up your environment**

- You'll need Node.js.
- Install the project dependencies:
  ```bash
  pnpm install
  ```

---

## Development Workflow

1. **Create a new branch**

   ```bash
   git checkout -b feat/awesome-new-feature
   ```

   Use a branch name that clearly describes its purpose (e.g., `feat/...`, `fix/...`, `docs/...`, `chore/...`, etc.).

2. **Implement your changes** (code, docs, tests, etc.)
3. **Add, commit, and push:**

   ```bash
   git add .
   git commit -m "feat: add awesome new feature"
   git push origin feat/awesome-new-feature
   ```

4. **Create a pull request**

---

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) to ensure consistent commit messages. This helps with automatic changelog generation and versioning.

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Build process or auxiliary tool changes

### Examples

- `feat: add new feature`
- `fix: correct typo`
- `docs: update README`
- `style: format code`
- `refactor: improve variable names`
- `perf: improve performance`
- `test: add missing tests`
- `chore: update CI configuration`

---

## Linting and Code Style

**Linting**: We use ESLint and Prettier to enforce code style and formatting. Run the following command to check for linting errors:

**Run Lint**:

```bash
pnpm run lint
```

Make sure there are no errors before pushing your changes.

**Formatting**: We use Prettier to format code. Run the following command to format your code:

```bash
pnpm run format:check
```

To automatically format files, run:

```bash
pnpm run format:fix
```

---

## Testing

We use Jest for testing. Run the following command to run tests:

```bash
pnpm test
```

This command will also generate a coverage report in the `coverage` directory by default.

Please ensure that:

- New features have corresponding test coverage.
- Fixes include a test that fails without the fix and passes with it.

---

## Pull Requests

When you open a pull request (PR):

1. **Explain your changes** clearly in the PR description. Include the reason for the change, how to test it, and any related issues.
2. **CI Checks**: Our GitHub Actions CI will automatically run to:

- Lint your code
- Build the TypeScript project
- Run tests with coverage

3. **Review**: We will review your PR. If any changes or clarifications are needed, we will request them.

---

## Release & Versioning

We use [Semantic Versioning](https://semver.org/) for versioning. When we merge changes to the `main` branch, we will automatically publish a new version based on the commit messages.

All you need to do is **follow the commit message conventions** and ensure that your changes are ready for release.

---

## License

By contributing to Amadaius, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

**Thank you for contributing!** 🎉 If you have any questions, feel free to open an issue or start a discussion.
