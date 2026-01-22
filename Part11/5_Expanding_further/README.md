# Expanding Further

This section covers advanced CI/CD topics including visibility, notifications, metrics, periodic tasks, and building your own deployment pipeline.

## Overview

Beyond basic CI/CD, there are additional features that add value:
- **Visibility:** Stakeholders need to see progress
- **Notifications:** Alert team when builds finish
- **Metrics:** Track build times and trends
- **Periodic Tasks:** Automated scheduled checks
- **Your Own Pipeline:** Apply knowledge to real projects

## Visibility and Understanding

### Stakeholders

- Not just developers and users
- People inside and outside development team
- Need to track development progress
- Make decisions on what to develop

### Integrations

- Git ↔ Project management software
- Git ↔ Bug tracking systems
- Pull requests ↔ Issue tracking
- Automatic issue updates

## Notifications

### The Problem

- Builds take longer as projects grow
- Developers start other work
- Forgets about build
- PRs waiting, deployments not noticed

### Solutions

- GitHub default notifications (email)
- Custom integrations (Discord, Slack)
- Success and failure notifications
- Include build details

### Discord Integration

1. Register on Discord
2. Join course Discord
3. Get webhook from channel
4. Add to GitHub Secrets
5. Use Discord action in workflow

## Metrics

### Purpose

- Track build times
- Understand trends
- Identify problems
- Plan optimizations

### Types

- **Self-reported:** Each build reports duration
- **Fetched:** Data fetched from API afterward

### Storage

- Time-series databases
- Cloud services (Datadog, etc.)
- Visualize trends
- Set alerts

## Periodic Tasks

### Categories

1. **Tools Available:**
   - Use existing tools (Dependabot)
   - Well-tested
   - Free for open source

2. **Custom Tasks:**
   - No tool available
   - Automate with GitHub Actions
   - Use scheduled trigger

### Scheduled Workflows

```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
```

## Health Checks

### Purpose

- Monitor application health
- Catch runtime issues
- Detect problems early
- Alert team quickly

### Implementation

- Use health check action
- Schedule regularly
- Test with push trigger first
- Reduce frequency to save hours

## Building Your Own Pipeline

### The Challenge

- Have existing application
- Need to add CI/CD pipeline
- Common real-world scenario

### Process

1. Choose application
2. Create new repository
3. Copy and restructure code
4. Set up CI/CD pipeline
5. Test deployment
6. Protect main branch

## Exercises

- 11.18: Set up Discord notifications
- 11.19: Periodic health check
- 11.20: Build your own pipeline
- 11.21: Protect branch and get review

## Resources

- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Discord Webhooks](https://discord.com/developers/docs/resources/webhook)
- [Cron Syntax](https://crontab.guru/)
- [Dependabot](https://docs.github.com/en/code-security/dependabot)
