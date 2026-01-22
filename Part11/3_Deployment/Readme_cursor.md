# Deployment - Summary

This section covers deploying applications to production using GitHub Actions, including deployment to Fly.io and Render, health checks, and deployment strategies.

## Overview

After writing an application, we need to deploy it for real users. In part 3, we deployed manually with a single command. Now we'll automate deployments with GitHub Actions to ensure safe, reliable deployments.

**Key Goals:**
- Automate deployment process
- Prevent broken code from reaching production
- Handle deployment failures gracefully
- Implement health checks
- Enable rollback capabilities

## Deployment Principles

### Murphy's Law

**"Anything that can go wrong will go wrong."**

We must plan for various failure scenarios:

**Potential Issues:**
- Computer crashes during deployment
- Internet connection dies during deployment
- Specific instruction in deployment script fails
- Software doesn't work on server
- User makes HTTP request just before/during deployment
- Need to roll back to previous version

**Key Rules:**
- Deployment system should **never** leave software in broken state
- Should always know deployment state
- **Silent failures are very bad!**

### What Does a Good Deployment System Do?

**Requirements:**

1. **Fail Gracefully:**
   - Able to fail at **any** step
   - Never leave software in broken state

2. **Notify on Failure:**
   - Let us know when failure happens
   - More important to notify about failure than success

3. **Rollback Capability:**
   - Allow rollback to previous deployment
   - Rollback should be easier than full deployment
   - Best: automatic rollback on failure

4. **Handle User Requests:**
   - Handle HTTP requests just before/during deployment
   - Don't drop user requests

5. **Meet Requirements:**
   - Don't deploy if tests haven't been run
   - Ensure software meets deployment requirements

**Desired Features:**

- **Fast:** Quick deployment process
- **Zero Downtime:** No downtime during deployment
- **Reliable:** Consistent, repeatable process

## Version Endpoint

### Purpose

To verify that deployment actually works and new version is deployed.

**File: `backend/app.js`**
```javascript
app.get('/version', (req, res) => {
  res.send('1') // change this string to ensure a new version deployed
});
```

**Usage:**
- Change version string after deployment
- Check endpoint to verify new version is live
- Helps confirm deployment worked

## Fly.io Deployment

### Exercise 11.10: Manual Deployment Setup

**Steps:**

1. **Create Fly.io App:**
   - Create new app in Fly.io
   - Get app name and configuration

2. **Generate API Token:**
   ```bash
   fly tokens create deploy
   ```
   - Save token securely
   - **Do NOT commit to GitHub**
   - Will use in GitHub Actions later

3. **Configure fly.toml:**

   **File: `fly.toml`**
   ```toml
   [env]
     PORT = "3000" # matches internal_port below

   [processes]
     app = "node app.js" # command to start application

   [http_service]
     internal_port = 3000
     force_https = true
     auto_stop_machines = true
     auto_start_machines = true
     min_machines_running = 0
     processes = ["app"]
   ```

   **Key Points:**
   - `[processes]` defines command to start app
   - Without this, Fly.io starts React dev server (wrong!)
   - `PORT` environment variable passed to app
   - `internal_port` matches PORT value

4. **Update .dockerignore:**

   **File: `.dockerignore`**
   ```
   # Remove this line:
   dist
   ```

   **Purpose:**
   - If `dist` is ignored, production build doesn't get uploaded
   - Must remove to include build files

5. **Manual Deployment:**
   ```bash
   npm run build  # Create production build first
   flyctl deploy  # Deploy to Fly.io
   ```

   **Verify:**
   - App should be accessible
   - Check `/version` endpoint
   - Ensure manual deployment works before automation

### Exercise 11.11: Automatic Deployments

**GitHub Actions Workflow:**

**File: `.github/workflows/pipeline.yml`**
```yaml
name: Deployment pipeline

on:
  push:
    branches:
      - main

jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Check style
        run: npm run eslint
      - name: Build
        run: npm run build
      - name: Test
        run: npm test
      - name: Deploy to Fly.io
        uses: superfly/flyctl-actions/setup-flyctl@master
      - name: Deploy
        run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

**Key Points:**
- Build must happen before deployment
- Use `superfly/flyctl-actions/setup-flyctl@master` action
- Use `--remote-only` flag for deployment
- Access token via `${{ secrets.FLY_API_TOKEN }}`

**Setting Up Secrets:**

1. Go to repository Settings
2. Navigate to Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `FLY_API_TOKEN`
5. Value: Token from `fly tokens create deploy`
6. Click "Add secret"

**Important:**
- Never commit secrets to repository
- Always use GitHub Secrets
- Monitor deployment logs with `flyctl logs`

### Exercise 11.12: Health Check

**Problem:**
- App might start but be broken
- Example: App starts on wrong port
- Fly.io thinks deployment succeeded
- App is deployed in broken state

**Solution: HTTP Health Check**

**1. Add Health Endpoint:**

**File: `backend/app.js`**
```javascript
app.get('/health', (req, res) => {
  res.send('ok');
});
```

**2. Configure HTTP Check in fly.toml:**

**File: `fly.toml`**
```toml
[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

  [[http_service.http_checks]]
    interval = "10s"
    timeout = "2s"
    grace_period = "5s"
    method = "GET"
    path = "/health"
    protocol = "http"
    tls_skip_verify = false
```

**3. Set Deployment Strategy:**

**File: `fly.toml`**
```toml
[deploy]
  strategy = "canary"
```

**Deployment Strategies:**
- **canary:** Deploy to one machine first, check health, then deploy to others
- **immediate:** Deploy to all machines at once
- **rolling:** Deploy to machines one by one

**How It Works:**
1. Fly.io deploys new version
2. Checks `/health` endpoint
3. If health check fails, deployment marked as failed
4. Previous version stays running
5. GitHub Actions workflow fails

**Testing Health Check:**

**Simulate Failure:**
```javascript
app.get('/health', (req, res) => {
  // eslint-disable-next-line no-constant-condition
  if (true) throw('error...');
  res.send('ok');
});
```

**Expected Result:**
- Deployment fails
- Previous version keeps running
- GitHub Actions workflow shows failure

**Check Releases:**
```bash
flyctl releases
```

**Output:**
```
VERSION	STATUS  	DESCRIPTION	USER           	DATE
v19    	failed  	Release    	mluukkai@iki.fi	3m52s ago
v18    	complete	Release    	mluukkai@iki.fi	16h56m ago
```

## Render Deployment

### Exercise 11.10: Manual Deployment Setup

**Steps:**

1. **Create Render App:**
   - Create new web service in Render
   - Configure settings carefully

2. **Build Settings:**
   - **Build Command:** Command to build application
   - **Start Command:** Command to start application
   - **Environment:** Node.js version

3. **Build Script (Optional):**

   **File: `build_step.sh`**
   ```bash
   #!/bin/bash

   echo "Build script"

   # Add commands here
   npm install
   npm run build
   ```

   **Make Executable:**
   ```bash
   chmod +x build_step.sh
   ```

   **Test:**
   ```bash
   ./build_step.sh
   ```

4. **Alternative: Pre Deploy Command:**
   - Use Pre deploy command in Render settings
   - Run one additional command before deployment

5. **Disable Auto-Deploy:**
   - Go to Advanced settings
   - Turn auto-deploy **OFF**
   - We'll control deployment from GitHub Actions

6. **Manual Deploy:**
   - Use "Manual deploy" button
   - Keep Logs open to debug issues
   - Ensure app works before automation

### Exercise 11.11: Automatic Deployments

**Option 1: Custom Action**

**Steps:**
1. Search GitHub Actions marketplace for "render deploy"
2. Choose action with:
   - Most stars
   - Active maintenance
   - Few open issues
3. **Warning:** `render-action` was unreliable (Jan 2024), avoid it

**Get Credentials:**
- **API Key:** Generate from Render dashboard
- **Service ID:** From app URL (starts with `srv-`)
  ```
  https://dashboard.render.com/web/srv-randomcharachtershere
  ```

**Workflow Example:**
```yaml
- name: Deploy to Render
  uses: some-render-action@v1
  with:
    api_key: ${{ secrets.RENDER_API_KEY }}
    service_id: ${{ secrets.RENDER_SERVICE_ID }}
```

**Option 2: Deploy Hook (Recommended)**

**More Reliable Option**

**1. Get Deploy Hook:**
- Go to app settings in Render dashboard
- Find "Deploy Hook" section
- Copy the private URL

**2. Set Up Secrets:**
- Create `RENDER_API_KEY` secret
- Create `RENDER_SERVICE_ID` secret (from URL)

**3. Workflow Step:**

**File: `.github/workflows/pipeline.yml`**
```yaml
- name: Trigger deployment
  run: |
    curl https://api.render.com/deploy/srv-${{ secrets.RENDER_SERVICE_ID }}?key=${{ secrets.RENDER_API_KEY }}
```

**How It Works:**
- Makes HTTP request to Render API
- Triggers deployment on Render
- Render handles the actual deployment

**Monitor Deployment:**
- Check Events tab in Render dashboard
- See when new deployment is ready
- View deployment logs

### Exercise 11.12: Health Check

**Purpose:**
- Ensure app is actually functional
- Beyond just deployment pipeline checks
- Application-level health verification

**1. Add Health Endpoint:**

**File: `backend/app.js`**
```javascript
app.get('/health', (req, res) => {
  res.send('ok');
});
```

**2. Configure Health Check Path:**
- Go to Render dashboard
- Navigate to Settings tab
- Find "Health Check Path" setting
- Set to `/health`

**3. Zero Downtime Deploys:**
- Render should ensure app stays functional
- May not always work on free accounts (Jan 2024)
- Health check helps ensure functionality

**4. Test Deployment:**
- Make code change
- Push to GitHub
- Verify deployment succeeds
- Check health endpoint is accessible

**5. Test Failure:**

**Simulate Broken Deployment:**
```javascript
app.get('/health', (req, res) => {
  // eslint-disable-next-line no-constant-condition
  if (true) throw('error...');
  res.send('ok');
});
```

**Expected Result:**
- Broken version should not deploy
- Previous version keeps running
- Health check fails, deployment rejected

**6. Fix and Verify:**
- Remove broken code
- Push fix to GitHub
- Verify deployment succeeds
- Ensure app works again

## Deployment Workflow Comparison

### Fly.io

**Advantages:**
- Simple configuration
- Good health check support
- Canary deployment strategy
- Clear release management

**Workflow:**
1. Build application
2. Use Fly.io action to deploy
3. Fly.io handles deployment
4. Health checks verify deployment

### Render

**Advantages:**
- Simple deploy hook approach
- Good dashboard for monitoring
- Zero downtime deploys (in theory)

**Disadvantages:**
- Zero downtime may not work on free tier
- More configuration needed
- Deploy hook is more manual

**Workflow:**
1. Build application
2. Trigger deploy hook
3. Render handles deployment
4. Health checks verify deployment

## Best Practices

### 1. Always Build Before Deploy

```yaml
# ✅ Good: Build first
- name: Build
  run: npm run build
- name: Deploy
  run: flyctl deploy

# ❌ Bad: Deploy without build
- name: Deploy
  run: flyctl deploy
```

### 2. Use Secrets for Credentials

```yaml
# ✅ Good: Use secrets
env:
  FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

# ❌ Bad: Hardcode credentials
env:
  FLY_API_TOKEN: "abc123..."
```

### 3. Implement Health Checks

```yaml
# ✅ Good: Health check configured
[[http_service.http_checks]]
  path = "/health"

# ❌ Bad: No health check
# App might be broken but deployed
```

### 4. Use Deployment Strategies

```toml
# ✅ Good: Canary deployment
[deploy]
  strategy = "canary"

# ❌ Bad: Immediate deployment
# All machines at once, risky
```

### 5. Monitor Deployment Logs

```bash
# ✅ Good: Check logs
flyctl logs

# ❌ Bad: Deploy and forget
# No visibility into issues
```

### 6. Test Deployment Locally First

```bash
# ✅ Good: Test manually first
npm run build
flyctl deploy

# ❌ Bad: Automate without testing
# Might have configuration issues
```

## Common Issues and Solutions

### Issue: Deployment Fails Silently

**Solution:**
- Check workflow logs in GitHub Actions
- Check Fly.io/Render logs
- Verify health checks are working
- Ensure error notifications are set up

### Issue: App Deploys But Doesn't Work

**Solution:**
- Implement health check endpoint
- Configure health check in platform
- Use canary deployment strategy
- Check application logs

### Issue: Build Files Missing

**Solution:**
- Ensure build step runs before deploy
- Check `.dockerignore` doesn't exclude build files
- Verify build output is included

### Issue: Wrong Port Configuration

**Solution:**
- Verify PORT environment variable
- Check `internal_port` matches PORT
- Ensure app listens on correct port
- Test locally with same port

### Issue: Secrets Not Working

**Solution:**
- Verify secrets are set in GitHub
- Check secret names match exactly
- Ensure secrets are accessible to workflow
- Test with echo (without exposing value)

## Summary

### Key Takeaways

1. **Automate Deployments:**
   - Use GitHub Actions for automated deployments
   - Build before deploying
   - Run tests before deploying

2. **Health Checks:**
   - Implement `/health` endpoint
   - Configure health checks in platform
   - Prevent broken deployments

3. **Deployment Strategies:**
   - Use canary deployment for safety
   - Test on one machine first
   - Roll out gradually

4. **Security:**
   - Never commit secrets
   - Use GitHub Secrets
   - Keep credentials secure

5. **Monitoring:**
   - Check deployment logs
   - Monitor application logs
   - Verify deployments succeed

6. **Failure Handling:**
   - Plan for failures
   - Implement rollback capability
   - Notify on failures

### Next Steps

- Exercise 11.10: Set up manual deployment
- Exercise 11.11: Automate deployment
- Exercise 11.12: Implement health checks
- Monitor and verify deployments
