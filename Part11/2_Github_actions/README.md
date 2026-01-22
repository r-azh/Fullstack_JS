# Getting Started with GitHub Actions

This section covers setting up GitHub Actions workflows, understanding workflow structure, and implementing CI/CD pipelines.

## Overview

GitHub Actions operate on **workflows** - a series of jobs that run when specific events trigger them. Each job contains steps that tell GitHub Actions what to do.

**Key Concepts:**
- Workflows are defined in `.github/workflows/` directory
- Each workflow is a YAML file
- Workflows are triggered by events (push, PR, etc.)
- Jobs run in parallel, steps run sequentially

## Workflow Structure

```
Workflow
├── Job
│   ├── Step
│   └── Step
└── Job
    └── Step
```

## Basic Workflow Elements

1. **name:** Workflow name
2. **on:** Events that trigger workflow
3. **jobs:** Jobs to execute

## Common Steps

### Environment Setup

```yaml
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
  with:
    node-version: '20'
- name: Install dependencies
  run: npm install
```

### CI Steps

```yaml
- name: Check style
  run: npm run eslint
- name: Build
  run: npm run build
- name: Test
  run: npm test
- name: E2E tests
  run: npm run test:e2e
```

## Example Project

**Repository:** `full-stack-open-pokedex`

**Features:**
- Frontend and backend in same repository
- Uses Node 16
- Uses Webpack (not Vite)
- Uses Jest (not Vitest)

## Exercises

- 11.2: Fork and set up example project
- 11.3: Create Hello World workflow
- 11.4: Extend workflow with date and directory
- 11.5: Implement linting workflow
- 11.6: Fix code issues
- 11.7: Add build and test steps
- 11.8: Fix failing tests
- 11.9: Implement end-to-end tests

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Playwright Documentation](https://playwright.dev/)
- [Cypress Documentation](https://docs.cypress.io/)
