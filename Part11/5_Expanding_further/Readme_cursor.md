# Expanding Further - Summary

This section covers advanced CI/CD topics including visibility, notifications, metrics, periodic tasks, and building your own deployment pipeline.

## Overview

Beyond basic CI/CD, there are additional features that add value:
- **Visibility:** Stakeholders need to see progress
- **Notifications:** Alert team when builds finish
- **Metrics:** Track build times and trends
- **Periodic Tasks:** Automated scheduled checks
- **Your Own Pipeline:** Apply knowledge to real projects

## Visibility and Understanding

### The Need

**Stakeholders:**
- Not just developers and users
- People inside and outside development team
- Need to track development progress
- Make decisions on what to develop

**Solution: Integrations**

**Common Integrations:**
- Git ↔ Project management software
- Git ↔ Bug tracking systems
- Pull requests ↔ Issue tracking

### Example: Issue Tracking Integration

**Workflow:**
1. Working on issue #123
2. Name PR: `BUG-123: Fix user copy issue`
3. Bug tracking system notices `BUG-123`
4. Automatically moves issue to "Done" when PR merged

**Benefits:**
- Automatic issue updates
- Link code changes to issues
- Better project visibility
- Less manual work

**Implementation:**
- Reference tracking system in PR names
- Reference in commit messages
- Integration handles the rest

## Notifications

### The Problem

**Build Time Increases:**
- Simple projects: quick builds
- Complex projects: longer builds
- Developer starts other work
- Forgets about build
- Build finishes, no one notices

**Consequences:**
- PRs waiting for merge
- Affects other developers
- Think deployment happened but didn't
- Miscommunication with team/customers
- "Bug should be fixed" but it's not deployed

### Solutions

**Range from Simple to Complex:**
1. **Simple:** Notifications
2. **Complex:** Auto-merge passing code

**We'll Focus on Notifications:**
- Least interference with workflow
- Developer stays in control
- Simple to implement

### GitHub Default Notifications

**Built-in:**
- Email on build failure (default)
- Can change to: all builds
- GitHub web interface alerts
- Configurable in settings

**Limitations:**
- May not work for all use cases
- Email might be missed
- Need more visibility

### Custom Notifications

**Integrations Available:**
- Slack
- Discord
- Microsoft Teams
- And more

**How It Works:**
- GitHub Actions sends notification
- Based on build status
- Customizable messages
- Can include build details

### Discord Integration

**Setup:**
1. Register on Discord (if needed)
2. Join course Discord: https://study.cs.helsinki.fi/discord/join/fullstack
3. Find webhook in `fullstack_webhook` channel
4. Get webhook URL from pinned message
5. **Never commit webhook to GitHub!**

**Actions Available:**
- Search GitHub Actions Marketplace
- Search for "discord"
- Choose action with:
  - Many stars
  - Good documentation
  - Active maintenance

**Example: discord-webhook-notify**
- Popular choice
- Good documentation
- Easy to use

## Metrics

### The Need

**Build Time Tracking:**
- Projects get more complex
- Builds take longer
- Need to understand trends

**Questions to Answer:**
- How long did builds take months ago?
- How long do they take now?
- Linear progression or sudden jump?
- What caused the increase?

**Value:**
- Know if optimization is worth it
- Plan for future growth
- Identify problems early

### Types of Metrics

**Self-Reported (Push Metrics):**
- Each build reports its duration
- Sent to database/service
- Risk: Reporting takes time
- May impact total build time

**Fetched (Pull Metrics):**
- Data fetched from API afterward
- No impact on build time
- More complex setup

### Storage Options

**Time-Series Databases:**
- Optimized for time-based data
- Good for trends
- Examples: InfluxDB, TimescaleDB

**Cloud Services:**
- Easy to aggregate metrics
- Pre-built dashboards
- Examples: Datadog, New Relic

**Benefits:**
- Visualize trends
- Set alerts
- Compare periods
- Identify anomalies

## Periodic Tasks

### The Need

**Regular Tasks:**
- Security vulnerability checks
- Dependency updates
- Health checks
- Cleanup tasks
- Reports

**Two Categories:**

1. **Tools Available:**
   - Use existing tools
   - Example: Dependabot for security
   - Free for open source
   - Well-tested

2. **Custom Tasks:**
   - No tool available
   - Automate yourself
   - Use GitHub Actions scheduled trigger

### Scheduled Workflows

**Cron Syntax:**
```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
```

**Examples:**
- `0 0 * * *` - Daily at midnight
- `0 */6 * * *` - Every 6 hours
- `0 0 * * 1` - Weekly on Monday

**Important:**
- Uses UTC time
- May have delays
- First run can take time (up to 1 hour)

### Dependabot

**Purpose:**
- Check packages for security vulnerabilities
- Free for open source projects
- Automated dependency updates
- GitHub-provided tool

**Advice:**
- Use existing tools when possible
- Don't reinvent the wheel
- Focus on your core business
- Security tools are complex

## Health Checks

### The Need

**Beyond CI Pipeline:**
- Pipeline prevents bad code deployment
- But many other error sources:
  - Database becomes unavailable
  - External service down
  - Server crashes
  - Network issues

**Solution: Periodic Health Check**

**What It Does:**
- Regularly ping application
- HTTP GET request to server
- Check if application responds
- Alert if application is down

**Benefits:**
- Catch runtime issues
- Detect problems early
- Monitor application health
- Alert team quickly

### Implementation

**Using url-health-check Action:**
- Search GitHub Actions Marketplace
- Find health check action
- Configure to ping your app
- Schedule regularly

**Workflow Structure:**
```yaml
name: Health Check

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  push:  # For testing

jobs:
  health_check:
    runs-on: ubuntu-latest
    steps:
      - name: Health check
        uses: url-health-check@v1
        with:
          url: 'https://your-app.fly.dev/health'
```

**Testing:**
- Start with push trigger
- Test that check works
- Then switch to schedule
- Simulate failure to verify

**Important Notes:**
- First scheduled run can take ~1 hour
- Test with push trigger first
- Reduce frequency after testing (max once per 24 hours)
- Or disable to save free hours

## Building Your Own Pipeline

### The Challenge

**Real-World Scenario:**
- Have existing application
- Need to add CI/CD pipeline
- "Legacy code" situation
- Common in real life

**Candidates:**
- Phonebook app (parts 2-3)
- Blog app (parts 4-5)
- Redux anecdotes (part 6)
- Your own application

### Restructuring

**First Step: Repository Structure**

**Option 1: Backend at Root**
```
repository/
  backend/
    app.js
    package.json
  frontend/
    src/
    package.json
  .github/
    workflows/
```

**Option 2: Copy Example Structure**
- Use example app from this part
- Or structure from part 7
- Whatever makes sense

**Recommendation:**
- Frontend and backend in same repository
- Makes CI/CD simpler
- Not required but recommended

### Process

**Steps:**
1. Create new repository
2. Copy old code
3. Restructure as needed
4. Set up CI/CD pipeline
5. Test deployment
6. Protect main branch

**Why New Repository?**
- Fresh start makes it easier
- In real life, do in existing repo
- But for learning, new repo is cleaner

**This is a Long Exercise:**
- Common real-world situation
- Good learning experience
- Apply all knowledge gained

## Exercise Details

### Exercise 11.18: Build Notifications

**Task:**
- Set up Discord webhook notifications
- Success notification when version deployed
- Error notification when build fails
- Error should be verbose (include commit info)

**Steps:**
1. Register on Discord
2. Join course Discord
3. Get webhook from `fullstack_webhook` channel
4. Search for Discord action in marketplace
5. Add to workflow
6. Configure success/error messages
7. Test with build success and failure

**File: `.github/workflows/pipeline.yml`**
```yaml
- name: Notify Discord on success
  if: success() && github.event_name == 'push'
  uses: sarisia/actions-status-discord@v1
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
    title: "Deployment Successful"
    description: "New version deployed successfully"

- name: Notify Discord on failure
  if: failure()
  uses: sarisia/actions-status-discord@v1
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
    title: "Build Failed"
    description: "Build failed for commit ${{ github.sha }}"
    color: 0xff0000
```

**Check Job Status:**
- Use `job.status` or `steps.*.outcome`
- Check documentation for action

### Exercise 11.19: Periodic Health Check

**Task:**
- Set up scheduled health check
- Ping deployed application
- Detect when application breaks
- Write to separate workflow file

**Steps:**
1. Find health check action (url-health-check or alternative)
2. Create new workflow file
3. Start with push trigger (for testing)
4. Configure to ping `/health` endpoint
5. Test that it works
6. Switch to scheduled trigger
7. Simulate failure to verify detection

**File: `.github/workflows/health-check.yml`**
```yaml
name: Health Check

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  push:  # For testing

jobs:
  health_check:
    runs-on: ubuntu-latest
    steps:
      - name: Health check
        uses: url-health-check@v1
        with:
          url: 'https://your-app.fly.dev/health'
          max-attempts: 3
```

**Important:**
- First scheduled run can take ~1 hour
- Test with push trigger first
- Reduce frequency after testing
- Or disable to save free hours

### Exercise 11.20: Your Own Pipeline

**Task:**
- Build CI/CD pipeline for your own app
- Restructure if needed
- Apply all knowledge from this part

**Steps:**
1. Choose application:
   - Phonebook app
   - Blog app
   - Redux anecdotes
   - Your own app
2. Create new repository
3. Copy code to new repo
4. Restructure:
   - Backend and frontend in same repo
   - Logical structure
5. Set up CI/CD:
   - Linting
   - Testing
   - Building
   - Deployment
   - Versioning
6. Test everything works
7. Protect main branch

**This is a Long Exercise:**
- Common real-world scenario
- Good practice
- Apply everything learned

### Exercise 11.21: Protect and Review

**Task:**
- Protect main branch
- Prevent administrators from merging without review
- Create pull request
- Ask mluukkai to review
- Merge after review

**Steps:**
1. Protect main branch:
   - Go to repository Settings
   - Branches → Add rule
   - Require PR approval
   - Require status checks
   - **Prevent administrators from bypassing**
2. Create pull request:
   - Create branch
   - Make changes
   - Open PR
3. Add collaborator:
   - Go to repository Settings
   - Collaborators → Add people
   - Add mluukkai
   - Send collaboration invite
4. Request review:
   - Ping in Discord
   - Include collaboration invite link
   - Not the PR link!
5. Wait for review
6. Merge after approval

**Important:**
- Include collaboration invite link in Discord ping
- Not the pull request link
- Reviewer must be collaborator

## Best Practices

### 1. Use Existing Tools

```yaml
# ✅ Good: Use Dependabot
# GitHub provides it, well-tested

# ❌ Bad: Build your own security scanner
# Unless security is your business
```

### 2. Store Webhooks as Secrets

```yaml
# ✅ Good: Use secrets
webhook: ${{ secrets.DISCORD_WEBHOOK }}

# ❌ Bad: Hardcode webhook
webhook: "https://discord.com/api/webhooks/..."
```

### 3. Test Scheduled Workflows

```yaml
# ✅ Good: Test with push first
on:
  schedule:
    - cron: '0 */6 * * *'
  push:  # For testing

# ❌ Bad: Schedule immediately
# Might not work, hard to debug
```

### 4. Reduce Health Check Frequency

```yaml
# ✅ Good: Once per day
- cron: '0 0 * * *'  # Daily

# ❌ Bad: Every minute
# Consumes all free hours
```

### 5. Separate Workflow Files

```yaml
# ✅ Good: Separate files
health-check.yml
pipeline.yml

# ❌ Bad: Everything in one file
# Hard to manage
```

## Common Issues and Solutions

### Issue: Webhook Not Working

**Solution:**
- Verify webhook URL is correct
- Check webhook is in secrets
- Test webhook manually
- Check action documentation

### Issue: Scheduled Workflow Not Running

**Solution:**
- First run can take ~1 hour
- Check cron syntax is correct
- Verify workflow file is in `.github/workflows/`
- Check repository has activity

### Issue: Health Check False Positives

**Solution:**
- Increase timeout
- Add retry logic
- Check network issues
- Verify endpoint is correct

### Issue: Too Many Free Hours Used

**Solution:**
- Reduce health check frequency
- Disable if not needed
- Use more efficient workflows
- Monitor usage

## Submitting Exercises

### Two Repositories

**Repositories:**
1. Pokedex (example project)
2. Your own project

**Submission:**
- Can only submit one repository
- Put link to other repository in submission form
- Both must be complete

### Requirements

**All Exercises Must Be Completed:**
- Exercises 11.1-11.21
- All must be done
- No partial credit

### Getting Credits

**Steps:**
1. Complete all exercises
2. Submit via submission system
3. Include link to second repository
4. Request credits
5. Download certificate

**Note:**
- Need registration for course part
- See course information for details

## Summary

### Key Takeaways

1. **Visibility:**
   - Stakeholders need to see progress
   - Integrations help track issues
   - Link code to project management

2. **Notifications:**
   - Alert team when builds finish
   - Use Discord, Slack, etc.
   - Never commit webhooks

3. **Metrics:**
   - Track build times
   - Understand trends
   - Plan optimizations

4. **Periodic Tasks:**
   - Use existing tools (Dependabot)
   - Automate custom tasks
   - Schedule with cron

5. **Health Checks:**
   - Monitor application health
   - Catch runtime issues
   - Alert on problems

6. **Your Own Pipeline:**
   - Apply knowledge to real projects
   - Restructure as needed
   - Common real-world scenario

### Next Steps

- Exercise 11.18: Set up notifications
- Exercise 11.19: Periodic health check
- Exercise 11.20: Build your own pipeline
- Exercise 11.21: Protect branch and get review
- Submit exercises and get credits
