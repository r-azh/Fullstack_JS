# Keeping Green - Summary

This section covers keeping the main branch green, working with Pull Requests, conditional deployments, versioning strategies, automatic version bumping, and branch protection.

## Overview

The main branch should always remain **green**. Being green means all steps of the build pipeline complete successfully:
- Project builds successfully
- Tests run without errors
- Linter has no complaints
- All checks pass

**Why is this important?**
- Main branch is what gets deployed to production
- Failures mean new features cannot be deployed
- Need ability to roll back safely if bugs are discovered

## Keeping Main Branch Green

### The Rule

**Avoid committing directly to main branch.**

**Instead:**
1. Create a branch based on freshest main branch
2. Commit changes on that branch
3. Create Pull Request (PR) when ready
4. Get code reviewed
5. Merge to main after approval

### Working with Pull Requests

**Pull Request Process:**
1. Checkout new branch locally
2. Make and commit changes
3. Push branch to remote repository
4. Create pull request for review
5. Get code reviewed
6. Merge to main after approval

**Why Use Pull Requests?**

1. **Catch Issues:**
   - Even experienced developers overlook issues
   - Tunnel vision effect
   - Fresh eyes catch problems

2. **Different Perspective:**
   - Reviewer offers different point of view
   - Can suggest improvements
   - Share knowledge

3. **Knowledge Sharing:**
   - At least one other developer familiar with changes
   - Better team understanding
   - Easier maintenance

4. **CI Pipeline:**
   - Run all CI tasks before merge
   - Catch issues early
   - Prevent broken code in main

## Pull Request Workflows

### Updating Workflow Triggers

**Current Trigger (Main Branch Only):**
```yaml
on:
  push:
    branches:
      - main
```

**Updated Trigger (PRs and Main):**
```yaml
on:
  push:
    branches:
      - main
  pull_request:
    branches: [main]
    types: [opened, synchronize]
```

**Explanation:**
- `pull_request` trigger runs on PRs
- `branches: [main]` - PRs targeting main branch
- `types: [opened, synchronize]` - When PR is opened or updated
- Still runs on direct pushes to main (for now)

**Why Both?**
- PR trigger: Catch issues before merge
- Push trigger: Still works if someone pushes directly
- Will protect main branch later

### Creating a Pull Request

**Steps:**
1. Create and push branch
2. Go to GitHub repository
3. Click "Compare & pull request" button
4. Fill in PR description
5. Select your own repository as base (not original!)
6. Submit pull request

**Important:**
- Make sure base repository is YOUR fork
- Not the original repository
- Default might be wrong!

**PR Interface:**
- Description and discussion
- CI checks at bottom
- Status of each check
- Green board = all checks pass
- Click "Details" to see logs

## Conditional Deployment

### The Problem

**Current Issue:**
- All steps run for pull requests
- Including deployment step!
- Don't want to deploy PR code

**Solution: Conditional Deployment**

**Add `if` condition to deployment step:**
```yaml
- name: Deploy
  if: ${{ github.event_name == 'push' }}
  run: flyctl deploy --remote-only
```

**How It Works:**
- `github.event_name` tells us what triggered workflow
- When PR is merged, event name is `push` (paradoxically!)
- When PR is opened/updated, event name is `pull_request`
- Only deploy on `push` events (main branch)

**Testing:**
1. Push code to branch (not main)
2. Open pull request
3. Verify deployment step is **skipped**
4. Merge PR to main
5. Verify deployment **runs**

## Versioning

### Purpose

**Most Important Purpose:**
- Uniquely identify software we're running
- Identify code associated with version
- Order versions chronologically

**Use Cases:**
- Roll back to previous version
- Identify when bug was introduced
- Track what code is in production

### Semantic Versioning

**Format:**
`{major}.{minor}.{patch}`

**Example:**
- `1.2.3`
  - Major: `1`
  - Minor: `2`
  - Patch: `3`

**Change Types:**
- **Patch:** Fix functionality without changing external behavior
- **Minor:** Small changes to functionality (as viewed from outside)
- **Major:** Complete changes or major functionality changes

**Examples:**
- React 18.2.0 (major 18, minor 2)
- npm libraries follow semantic versioning

**Determining Code:**
- Version number in file (code-based)
- Git tags or GitHub releases (repo-based)
- External system (spreadsheet, etc.)

**Version Order:**
- Easy to order: `1.3.7` < `2.0.0` < `2.1.5` < `2.2.0`
- Easy to communicate: "Roll back to 3.2.4"
- Need list of releases to know latest

### Hash Versioning

**Format:**
- Hash (random-looking string)
- Derived from repository contents
- Git commit hash (unique for any change set)

**Example:**
- `d052aa41edfb4a7671c974c5901f4abe1c2db071`
- `12c6f6738a18154cb1cef7cf0607a681f72eaff3`

**Determining Code:**
- Simple: Look up commit by hash
- Exact code for that version
- Always unique

**Version Order:**
- Cannot tell order from hash alone
- Need Git log to see ordering
- Not human-friendly

**Use Cases:**
- Almost always used with automation
- Pain to copy 32-character hashes manually
- Good for artifact naming

### Comparing Versioning Strategies

**Semantic Versioning:**

**Advantages:**
- Human-readable
- Easy to communicate
- Easy to order
- Good for releases
- Users understand meaning

**Disadvantages:**
- Requires manual version bumps
- Can be forgotten
- Need to track what code = what version

**Best For:**
- Deploying services
- Libraries (npm packages)
- When version number matters to users
- Public releases

**Hash Versioning:**

**Advantages:**
- Automatic (commit hash)
- Always unique
- Exact code identification
- Good for automation
- Prevents accidents

**Disadvantages:**
- Not human-readable
- Hard to communicate
- Cannot tell order from hash
- Not user-friendly

**Best For:**
- Development/testing
- Artifact naming
- Automated builds
- Internal use
- When every commit is built

**Example Use Case:**
- Working on version 3.2.2
- Fix failing test
- Push commit
- Without hash versioning: artifact name doesn't change
- If upload fails: tests run against old artifact
- Wrong test results!
- With hash versioning: version must change
- Upload failure = error (artifact doesn't exist)
- Better than silent failure

### Best of Both Worlds

**Combined Approach:**
- Use hash versioning during development
- Use semantic versioning for releases
- Both point to same commit

**How It Works:**
1. **Development:**
   - CI uses commit hash for artifacts
   - Automated and transparent
   - Developers don't need to know

2. **Release:**
   - CI builds and tests code
   - Gives semantic version number
   - Tags commit with version
   - Version points to specific commit

**Benefits:**
- Development: Automatic, no mistakes
- Release: Human-readable, meaningful
- Both: Tested code, traceable

**The Catch:**
- Two naming conventions
- Need to track both
- Can be confusing
- But manageable with automation

## Automatic Version Bumping

### Using github-tag-action

**Action:**
`anothrNick/github-tag-action`

**Purpose:**
- Automatically bump version
- Tag release with version number
- Only on main branch merges

**Basic Setup:**
```yaml
- name: Bump version and push tag
  uses: anothrNick/github-tag-action@1.64.0
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Important:**
- Use most recent version (check action page)
- `GITHUB_TOKEN` is automatically available
- Action needs write access to repo

### Authentication

**GITHUB_TOKEN:**
- Automatically provided by GitHub
- Needs read and write permissions
- Configure in repository settings

**Settings:**
1. Go to repository Settings
2. Select Actions → General
3. Under "Workflow permissions"
4. Select "Read and write permissions"
5. Save

**Error:**
- "Token has no write access"
- Solution: Enable write permissions

### Configuration Options

**Default Behavior:**
- Minor bump by default
- Middle number incremented

**Change to Patch Bump:**
```yaml
- name: Bump version and push tag
  uses: anothrNick/github-tag-action@1.64.0
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    DEFAULT_BUMP: patch  # Change to patch
```

**Other Options:**
- See action README for all options
- Customize bump behavior
- Custom version format
- Dry run mode

### Workflow Structure

**Separate Job for Versioning:**

```yaml
name: Deployment pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches: [main]
    types: [opened, synchronize]

jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-latest
    steps:
      # lint, test, build, deploy steps
      
  tag_release:
    needs: [simple_deployment_pipeline]
    runs-on: ubuntu-latest
    steps:
      - name: Bump version and push tag
        uses: anothrNick/github-tag-action@1.64.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          DEFAULT_BUMP: patch
        if: ${{ github.event_name == 'push' }}
```

**Key Points:**
- `needs: [simple_deployment_pipeline]` - Wait for other job
- Jobs run in parallel by default
- Dependency ensures order
- Only tag if tests pass and deploy succeeds
- Only tag on push (not PR)

**Why Separate Job?**
- Versioning should happen after deployment
- Only if everything succeeds
- Clean separation of concerns

### Dry Run Mode

**Testing Configuration:**
```yaml
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  DRY_RUN: true  # Output version without tagging
```

**Purpose:**
- Test configuration without creating tags
- See what version would be created
- Debug issues
- Remove before production

### Viewing Tags

**After Successful Run:**
- Repository shows "tags" indicator
- Click "view all tags" to see list
- Each tag shows:
  - Version number
  - Commit it points to
  - Date created

**Tag Details:**
- Navigate to individual tag
- See commit details
- See what code is in that version

## Skipping Commits

### The Need

**Sometimes:**
- Valid reason to skip deployment
- Don't want to tag certain commits
- Example: Documentation-only changes
- Example: Configuration changes

### Implementation

**Skip Keyword:**
- Use `#skip` in commit message
- Check commit messages in workflow
- Skip deployment and tagging if found

**GitHub Context:**
```yaml
- name: Check commit messages
  env:
    COMMIT_MESSAGES: ${{ toJson(github.event.commits.*.message) }}
  run: echo "$COMMIT_MESSAGES"
```

**Important:**
- `github.event.commits` only available on push/merge
- Empty for pull requests
- Not needed for PRs anyway

**Condition:**
```yaml
if: ${{ github.event_name == 'push' && !contains(join(github.event.commits.*.message, ' '), '#skip') }}
```

**Explanation:**
- Only on push events
- Join all commit messages
- Check if contains '#skip'
- Negate with `!`

**Apply To:**
- Deployment step
- Tagging step
- Any step that should be skipped

### Reusable Conditions

**Define at Workflow Level:**
```yaml
name: Deployment pipeline

env:
  SHOULD_DEPLOY: ${{ github.event_name == 'push' && !contains(join(github.event.commits.*.message, ' '), '#skip') }}

jobs:
  simple_deployment_pipeline:
    steps:
      - name: Deploy
        if: ${{ env.SHOULD_DEPLOY == 'true' }}
        run: flyctl deploy
```

**Benefits:**
- Define once, use everywhere
- Easier to maintain
- Less repetition
- Clearer intent

### Job-Level Conditions

**Using Job Outputs:**
```yaml
jobs:
  job1:
    outputs:
      job2_can_run: ${{ steps.final.outcome == 'success' }}
    steps:
      - id: final
        run: echo

  job2:
    needs: [job1]
    if: ${{ needs.job1.outputs.job2_can_run == 'true' }}
    steps:
      # steps here
```

**Note:**
- `env` variables not accessible at job level
- Use job outputs instead
- Reference with `needs.job1.outputs`

## Third-Party Actions Security

### Version vs Hash

**Using Version:**
```yaml
uses: anothrNick/github-tag-action@1.64.0
```

**Problem:**
- Git tags can be moved
- Today's 1.64.0 might be different next week
- Not guaranteed to be same code

**Using Hash:**
```yaml
uses: anothrNick/github-tag-action@8c8163ef62cf9c4677c8e800f36270af27930f42
```

**Benefits:**
- Commit hash never changes
- Guaranteed same code
- More secure
- Prevents malicious updates

**How to Find Hash:**
- Look at action's repository
- Find commit for version tag
- Copy commit hash
- Use hash instead of version

### Security Considerations

**GitHub Actions:**
- Trusted by GitHub
- Thoroughly tested
- Less risk

**Third-Party Actions:**
- Code might be buggy
- Could be malicious
- Author credentials could be compromised
- Use hash for security

**Best Practice:**
- Use hash for third-party actions
- Use version for GitHub actions (usually OK)
- Review action code if possible
- Keep actions updated (but with hash)

## Branch Protection

### Why Protect Main Branch

**Main Branch:**
- Most important branch
- Should never be broken
- What gets deployed to production
- Needs protection

**Protection Options:**
- Require pull request approval
- Require status checks to pass
- Prevent force pushes
- Prevent deletion
- And more

### Setting Up Protection

**Steps:**
1. Go to repository Settings
2. Select "Branches" from left menu
3. Click "Add rule" button
4. Type branch name pattern ("main")
5. Select protection options

**Essential Protections:**

1. **Require pull request approval:**
   - At least one approval required
   - Prevents direct merges
   - Ensures code review

2. **Require status checks to pass:**
   - All CI checks must pass
   - Linting must pass
   - Tests must pass
   - Cannot merge if checks fail

3. **Require branches to be up to date:**
   - Branch must be current with main
   - Prevents merge conflicts
   - Ensures compatibility

**Select Status Checks:**
- Check all relevant checks
- Linting check
- Testing check
- Building check
- Any other checks

### Administrator Override

**Note:**
- Administrators can override restrictions
- Non-administrators cannot
- Use responsibly
- Only in emergencies

### Benefits

**Prevents:**
- Broken code in main
- Untested code in production
- Merge conflicts
- Accidental deletions

**Ensures:**
- Code is reviewed
- Tests pass
- Linting passes
- Main branch stays green

## Best Practices

### 1. Always Use Branches

```bash
# ✅ Good: Create branch
git checkout -b feature-branch
git commit -m "Add feature"
git push origin feature-branch

# ❌ Bad: Commit directly to main
git checkout main
git commit -m "Add feature"
```

### 2. Run CI on PRs

```yaml
# ✅ Good: Run on PRs
on:
  pull_request:
    branches: [main]

# ❌ Bad: Only on main
on:
  push:
    branches: [main]
```

### 3. Conditional Deployment

```yaml
# ✅ Good: Only deploy on main
- name: Deploy
  if: ${{ github.event_name == 'push' }}
  run: flyctl deploy

# ❌ Bad: Deploy on PRs
- name: Deploy
  run: flyctl deploy
```

### 4. Use Semantic Versioning for Releases

```yaml
# ✅ Good: Semantic versioning
- name: Bump version
  uses: anothrNick/github-tag-action@1.64.0
  env:
    DEFAULT_BUMP: patch

# ❌ Bad: Manual versioning
# Easy to forget, error-prone
```

### 5. Protect Main Branch

```yaml
# ✅ Good: Protected branch
# Requires PR approval
# Requires status checks

# ❌ Bad: Unprotected branch
# Anyone can push
# No checks required
```

### 6. Use Hash for Third-Party Actions

```yaml
# ✅ Good: Use hash
uses: anothrNick/github-tag-action@8c8163ef62cf9c4677c8e800f36270af27930f42

# ❌ Bad: Use version (can change)
uses: anothrNick/github-tag-action@1.64.0
```

## Common Issues and Solutions

### Issue: Workflow Not Running on PR

**Solution:**
- Check trigger configuration
- Ensure `pull_request` trigger is set
- Check branch name matches
- Verify PR targets correct branch

### Issue: Deployment Runs on PR

**Solution:**
- Add `if` condition to deployment step
- Check `github.event_name == 'push'`
- Verify condition syntax

### Issue: Version Not Bumping

**Solution:**
- Check GITHUB_TOKEN permissions
- Ensure write access enabled
- Check if condition is correct
- Verify job dependency

### Issue: Cannot Merge PR

**Solution:**
- Check branch protection rules
- Ensure all status checks pass
- Get required approvals
- Update branch if needed

### Issue: Skip Not Working

**Solution:**
- Check commit message format
- Verify `#skip` is in message
- Check condition syntax
- Test with dry run

## Summary

### Key Takeaways

1. **Keep Main Green:**
   - Always use branches
   - Create pull requests
   - Get code reviewed
   - Run CI on PRs

2. **Conditional Deployment:**
   - Only deploy on main branch
   - Use `if` conditions
   - Check `github.event_name`

3. **Versioning:**
   - Semantic for releases
   - Hash for development
   - Automate with actions
   - Tag releases

4. **Branch Protection:**
   - Protect main branch
   - Require PR approval
   - Require status checks
   - Prevent broken code

5. **Security:**
   - Use hash for third-party actions
   - Review action code
   - Keep actions updated

### Next Steps

- Exercise 11.13: Update workflow for PRs
- Exercise 11.14: Conditional deployment
- Exercise 11.15: Add versioning
- Exercise 11.16: Skip commits
- Exercise 11.17: Protect main branch
