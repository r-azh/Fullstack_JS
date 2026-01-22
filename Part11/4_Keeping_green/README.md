# Keeping Green

This section covers keeping the main branch green, working with Pull Requests, conditional deployments, versioning strategies, and branch protection.

## Overview

The main branch should always remain **green** - meaning all build pipeline steps complete successfully. This ensures production deployments are always from working code.

**Key Concepts:**
- Use branches and pull requests
- Run CI on pull requests
- Conditional deployment (only on main)
- Automatic versioning
- Branch protection

## Keeping Main Branch Green

### The Rule

**Never commit directly to main branch.**

**Process:**
1. Create branch from main
2. Make changes on branch
3. Create pull request
4. Get code reviewed
5. Merge after approval

## Pull Requests

### Benefits

- Catch issues before merge
- Code review and knowledge sharing
- Run CI pipeline before merge
- Prevent broken code in main

### Workflow Triggers

```yaml
on:
  push:
    branches:
      - main
  pull_request:
    branches: [main]
    types: [opened, synchronize]
```

## Conditional Deployment

### Problem

Deployment runs on pull requests (shouldn't!)

### Solution

```yaml
- name: Deploy
  if: ${{ github.event_name == 'push' }}
  run: flyctl deploy
```

Only deploy on push events (main branch merges).

## Versioning

### Semantic Versioning

- Format: `{major}.{minor}.{patch}`
- Human-readable
- Easy to communicate
- Good for releases

### Hash Versioning

- Uses commit hash
- Automatic
- Always unique
- Good for development

### Automatic Versioning

```yaml
- name: Bump version and push tag
  uses: anothrNick/github-tag-action@1.64.0
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    DEFAULT_BUMP: patch
```

## Skipping Commits

Use `#skip` in commit message to skip deployment and tagging.

```yaml
env:
  SHOULD_DEPLOY: ${{ github.event_name == 'push' && !contains(join(github.event.commits.*.message, ' '), '#skip') }}
```

## Branch Protection

### Essential Protections

1. Require pull request approval
2. Require status checks to pass
3. Require branches to be up to date

### Setup

1. Go to repository Settings
2. Select "Branches"
3. Add rule for "main"
4. Select protection options
5. Save

## Exercises

- 11.13: Update workflow for pull requests
- 11.14: Conditional deployment
- 11.15: Add automatic versioning
- 11.16: Skip commits with #skip
- 11.17: Protect main branch

## Resources

- [GitHub Actions Events](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows)
- [github-tag-action](https://github.com/anothrNick/github-tag-action)
- [Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
