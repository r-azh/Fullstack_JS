# Deployment

This section covers deploying applications to production using GitHub Actions, including deployment to Fly.io and Render, health checks, and deployment strategies.

## Overview

After writing an application, we need to deploy it for real users. This section covers automating deployments with GitHub Actions to ensure safe, reliable deployments.

**Key Goals:**
- Automate deployment process
- Prevent broken code from reaching production
- Handle deployment failures gracefully
- Implement health checks
- Enable rollback capabilities

## Deployment Principles

### Key Requirements

- Fail gracefully at any step
- Never leave software in broken state
- Notify on failures
- Allow rollback to previous deployment
- Handle user requests during deployment
- Ensure requirements are met before deployment

### Desired Features

- Fast deployment
- Zero downtime
- Reliable and repeatable

## Fly.io Deployment

### Setup

1. Create Fly.io app
2. Generate API token: `fly tokens create deploy`
3. Configure `fly.toml` with processes and HTTP service
4. Update `.dockerignore` to include build files
5. Add `/version` endpoint to verify deployment

### Automation

- Use `superfly/flyctl-actions/setup-flyctl@master` action
- Set `FLY_API_TOKEN` secret in GitHub
- Deploy with `flyctl deploy --remote-only`

### Health Check

- Add `/health` endpoint
- Configure HTTP checks in `fly.toml`
- Use canary deployment strategy
- Prevents broken deployments

## Render Deployment

### Setup

1. Create Render web service
2. Configure build and start commands
3. Disable auto-deploy
4. Test manual deployment

### Automation

**Option 1: Custom Action**
- Search GitHub Actions marketplace
- Use action with most stars
- **Warning:** `render-action` was unreliable (Jan 2024)

**Option 2: Deploy Hook (Recommended)**
- Get deploy hook from Render settings
- Set `RENDER_API_KEY` and `RENDER_SERVICE_ID` secrets
- Trigger deployment with curl

### Health Check

- Add `/health` endpoint
- Configure Health Check Path in Render settings
- Ensures functional deployments

## Exercises

- 11.10: Set up manual deployment (Fly.io or Render)
- 11.11: Automate deployment with GitHub Actions
- 11.12: Implement health checks

## Resources

- [Fly.io Documentation](https://fly.io/docs/)
- [Render Documentation](https://render.com/docs)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
