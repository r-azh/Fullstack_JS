# Introduction to CI/CD - Summary

This section introduces Continuous Integration (CI) and Continuous Deployment (CD) concepts, explaining why they are important and how they help teams work together effectively.

## Overview

This part focuses on building robust deployment pipelines. Unlike previous parts, this part is more about **configuration** than writing code. Debugging configurations can be challenging, so patience and discipline are essential.

**Prerequisites:**
- Complete at least parts 0-5 before starting
- 21 exercises total (all must be completed)
- Exercises submitted via submissions system (different course instance than parts 0-7)

## Getting Software to Production

### The Challenge

Writing software is only part of the process. Eventually, we need to:
- Deploy software to production
- Give it to real users
- Maintain and release new versions
- Work with other developers

### Common Problems

**"Works on My Machine" Problem:**
- Code works on one developer's machine but not another's
- Different operating systems
- Different library versions
- Environment inconsistencies

**Deployment Conflicts:**
- Multiple developers making changes
- Unclear deployment process
- Risk of overwriting changes
- No defined workflow

**Solution:**
- Strictly defined build and deployment processes
- Clear workflow for all circumstances
- Automated processes

## Key Terms

### Branches

**Definition:**
- Multiple copies, streams, or versions of code that coexist
- Main branch (usually `main` or `master`) is the default
- Each branch is a copy of main with diverging changes

**Purpose:**
- Allow developers to work independently
- Each developer can have one or more branches
- Changes can be merged back to main when ready
- Prevents conflicts during development

**Challenge:**
- When one developer merges, other branches diverge
- Need to ensure compatibility with current main branch
- Requires synchronization strategies

**Resources:**
- Read more about branches from Git documentation

### Pull Request (PR)

**Definition:**
- Mechanism for merging branches back to main
- Developer requests changes to be merged
- Another developer reviews and merges the PR

**Process:**
1. Developer creates branch with changes
2. Developer opens pull request
3. Another developer reviews
4. PR is merged to main branch

**Example:**
- If you've proposed changes to course material, you've made a pull request!

### Build

**Definition:**
- Preparing software to run on target platform
- Meaning varies by language

**Examples:**
- **TypeScript → JavaScript:** Transpiling TypeScript to JavaScript
- **Compiled languages (C, Rust):** Compiling code into executable
- **React/JavaScript:** Using Webpack to bundle production version

**Purpose:**
- Transform source code into runnable software
- Optimize for production
- Package dependencies

**Note:**
- Some interpreted languages (Python, Ruby) may not need build step
- Build complexity varies by language and platform

### Deploy

**Definition:**
- Putting software where end-users can use it

**Examples:**
- **Libraries:** Pushing npm package to npmjs.com
- **Web apps:** Deploying to hosting service (Fly.io, Render)

**Deployment Complexity:**
- Simple: Manual scripts and push to hosting
- Complex: Zero downtime deployments, database migrations, blue-green deployments

**In This Part:**
- Build simple deployment pipeline
- Automatically deploy each commit
- Deploy only if code doesn't break
- Use Fly.io or Render

## What is CI?

### Strict Definition

**Continuous Integration (CI):**
- Merging developer changes to main branch frequently
- Wikipedia suggests: "several times a day"
- Industry usage often refers to what happens after merge

### CI Steps

After merging, we typically want to:

1. **Lint:**
   - Keep code clean and maintainable
   - Ensure merge compatibility
   - Enforce coding standards

2. **Build:**
   - Put code together into runnable bundle
   - Transform source to production-ready code
   - Package dependencies

3. **Test:**
   - Ensure existing features still work
   - Catch regressions early
   - Validate functionality

4. **Package:**
   - Put everything in easily movable batch
   - Create distributable artifact
   - Prepare for deployment

5. **Deploy:**
   - Make software available to users
   - Push to production environment
   - Update live application

### Important Principles

**Strict Definition:**
- Process should be strictly defined
- Same steps every time
- No ambiguity

**Not a Constraint:**
- Should enable easier development
- Should facilitate team cooperation
- Should be automated

**Automation:**
- Use CI systems (e.g., GitHub Actions)
- Automate all steps
- Reduce manual work

## Packaging and Deployment in CI

### Packaging

**Why Include:**
- Issues often crop up during packaging
- Not usually tested locally
- Important to test in CI environment

**Benefits:**
- Test packaging during CI workflow
- Verify code in same form as production
- Catch packaging issues early

### Deployment

**Why Include:**
- Consistency and repeatability
- Same process for all branches
- Only difference: check if on main branch

**Benefits:**
- Maintain deployment process with CI
- Same workflow for development and production
- Easier to maintain and debug

## Continuous Delivery/Deployment (CD)

### Definitions

**Continuous Delivery:**
- Main branch kept deployable at all times
- Code is always ready to deploy
- Manual deployment trigger

**Continuous Deployment:**
- Automated deployments from main branch
- Every merge to main triggers deployment
- Fully automated process

### CI vs CD

**Overlap:**
- Concepts frequently cross between CI and CD
- Deployment sometimes considered part of CI
- Often used together as "CI/CD"

**Usage:**
- Terms "CI" and "CI/CD" used interchangeably
- Focus on the process, not terminology
- Both aim for automated, reliable workflows

## Why is CI/CD Important?

### Problem Prevention

**Direct Commits to Main:**
- Can disallow commits directly to main branch
- Require pull requests for all changes
- Enforce code review

**Untested Code:**
- Run CI on all Pull Requests
- Allow merges only when conditions met
- Ensure tests pass before merge

**Inconsistent Builds:**
- Build packages in known CI environment
- Same environment every time
- Reproducible builds

### Additional Benefits

**Always Deployable:**
- If CI/CD deploys on every merge to main
- Production always matches main branch
- Know what's running in production

**No Overwrites:**
- Only allow merges when branch is up to date
- Developers don't overwrite each other's changes
- Clear merge history

**Assumption:**
- In this part, we assume main branch = production
- Other workflows may use release branches
- Adapt to your team's needs

## Important Principles

### CI/CD is Not the Goal

**The Goal:**
- Better, faster software development
- Fewer preventable bugs
- Better team cooperation

**CI/CD is a Tool:**
- Configure to the task at hand
- Keep end goal in mind
- Answer specific questions

### Key Questions CI Should Answer

1. **How to ensure tests run on all code that will be deployed?**
   - Automate test execution
   - Run on all PRs and merges
   - Block deployment if tests fail

2. **How to ensure main branch is deployable at all times?**
   - Require tests to pass before merge
   - Keep main branch stable
   - Quick feedback on issues

3. **How to ensure builds are consistent?**
   - Use same environment every time
   - Document build process
   - Reproducible builds

4. **How to ensure changes don't overwrite each other?**
   - Require branches to be up to date
   - Use pull requests
   - Merge conflicts resolved before merge

5. **How to make deployments automatic or one-click?**
   - Deploy on merge to main
   - Or provide deployment button
   - Automate deployment process

### Scientific Evidence

**Study Results:**
- Book: "Accelerate: The Science of Lean Software and DevOps"
- Large study on CI/CD benefits
- Reported in scientific articles

**Benefits:**
- Improves profitability
- Increases product quality
- Increases market share
- Shortens time to market
- Reduces developer burnout
- Makes developers happier

## Documented Behavior

### The Problem

**Undocumented Features:**
- Bugs as "undocumented features"
- Unknown outcomes
- Unexpected behavior

**Example:**
- PR label defines release type (major/minor/patch)
- What if label is missing?
- What if label changes mid-build?
- Which label is used?

### The Solution

**Fail Safely:**
- Cover all cases you can think of
- Fail build if unexpected happens
- Alert developer of issues

**Example:**
- If label changes mid-build
- Fail the build
- Notify developer
- Better than deploying wrong version

**Benefits:**
- Clear error messages
- Prevent bad deployments
- Document expected behavior

## Consistency

### The Requirement

**Same Thing Every Time:**
- Required tasks performed
- In the right order
- Every single time

**Example:**
- Tests must run
- Tests must run against code that will be deployed
- No use if tests only run on branch
- Must test merged code

**Critical Concept:**
- Same process every time
- Predictable outcomes
- No surprises

## Code Always Deployable

### The Principle

**Main Branch = Production:**
- Main branch contains production code
- Always ready to deploy
- Easy to fix bugs

**Workflow:**
1. Bug found in production
2. Pull main branch (know it's production code)
3. Fix bug
4. Make pull request
5. Merge and deploy

### Alternative (Bad)

**Main Branch ≠ Production:**
- Main branch not deployable
- Production code unknown
- Complex workflow

**Problems:**
1. Find what code is in production
2. Pull that specific version
3. Fix bug
4. Figure out how to push back
5. Work out deployment
6. Different workflow from normal

**Result:**
- More complex
- Error-prone
- Slower

## Knowing What Code is Deployed

### The Need

**Version Information:**
- Know exactly what's running in production
- Version number or commit SHA
- Track releases

**Commit SHA:**
- Uniquely identifying hash of commit
- Attached to code
- Exact version identification

### Benefits

**Bug Tracking:**
- Find when bug was introduced
- Find when it was released
- Track affected users

**Data Issues:**
- If bug writes bad data to database
- Track when bad data was written
- Find affected records
- Based on release time

**Release History:**
- Combine version with release history
- Track all releases
- Understand impact

## Types of CI Setup

### Separate Server

**Requirement:**
- Dedicate separate server for CI tasks
- Minimize interference
- Ensure predictability

**Options:**
1. Self-hosted server
2. Cloud service

## Self-Hosted (Jenkins)

### Advantages

**Control:**
- Entire environment under your control
- Control number of resources
- Full customization

**Security:**
- Secrets never exposed to others
- Complete control over security
- Internal network

**Flexibility:**
- Do anything you want on hardware
- No platform limitations
- Custom configurations

**Billing:**
- Based on hardware
- Pay for server
- Usage doesn't change billing

### Disadvantages

**Complexity:**
- Jenkins is complicated to set up
- Lots of boilerplate/template code
- Steep learning curve

**Domain-Specific Language:**
- Must use Jenkins' DSL
- Less familiar syntax
- More configuration needed

**Hardware Risks:**
- Hardware failures possible
- Need to maintain server
- Can be issue with heavy use

**Popularity:**
- Jenkins is most popular self-hosted option
- Extremely flexible
- Plugins for almost anything

## Cloud-Based (GitHub Actions)

### Advantages

**Simplicity:**
- Setup of environment not your concern
- Just tell it what to do
- Put file in repository

**Configuration:**
- CI config usually simpler
- At least for "normal" usage
- Easy to get started

**No Maintenance:**
- No server to maintain
- No hardware to worry about
- Platform handles infrastructure

**Integration:**
- Works seamlessly with GitHub
- No third-party setup needed
- Immediate availability

### Disadvantages

**Limitations:**
- May become limited for special cases
- Platform may not support everything
- Less flexible than self-hosted

**Resources:**
- Resource limitations
- GitHub Actions: 2 vCPUs, 8GB RAM
- Can't just get bigger server

**Billing:**
- Billed by build time
- Can get expensive with heavy use
- Less predictable costs

**Special Requirements:**
- Difficult for special hardware (e.g., GPU)
- May not support all use cases
- Limited customization

## Choosing Between Options

### Cloud-Based (Recommended for Most)

**Best For:**
- Small to medium projects
- No special requirements
- Standard use cases

**Benefits:**
- Simple configuration
- No setup hassle
- Usually cheaper for small projects
- No maintenance

### Self-Hosted (For Larger Projects)

**Best For:**
- Larger projects
- Need for more resources
- Multiple teams/projects
- Special requirements

**Benefits:**
- More resources available
- Full control
- Cost-effective at scale
- Custom configurations

## Why GitHub Actions for This Course

### Reasons

**Already Using GitHub:**
- Using GitHub for source code
- Natural integration
- No additional accounts needed

**Easy to Use:**
- Robust CI solution immediately
- No server setup
- No third-party configuration

**Quality:**
- One of best cloud-based solutions
- Gained lots of popularity
- Released November 2019
- Active development

**Perfect Fit:**
- Matches course needs
- Standard use cases
- Easy to learn
- Good documentation

## Summary

### Key Takeaways

1. **CI/CD Purpose:**
   - Better, faster development
   - Fewer bugs
   - Better team cooperation

2. **Important Principles:**
   - Documented behavior
   - Consistency
   - Always deployable
   - Know what's deployed

3. **CI Steps:**
   - Lint
   - Build
   - Test
   - Package
   - Deploy

4. **Setup Options:**
   - Self-hosted (Jenkins)
   - Cloud-based (GitHub Actions)
   - Choose based on needs

5. **This Course:**
   - Use GitHub Actions
   - Focus on configuration
   - Build deployment pipelines

### Next Steps

- Exercise 11.1: Reflection on CI/CD concepts
- Exercise 11.2: Fork example project
- Build deployment pipeline
- Apply to your own projects

## Exercises

### Exercise 11.1: Warming up

Think about a hypothetical situation with a team of 6 people working on an application in active development.

**Task:**
- Pick a language (Python, Java, Ruby, etc.)
- Write 200-300 words
- Answer specific questions
- Save to `exercise1.md` in repository root

**Questions to Answer:**

1. **CI Tools:**
   - What tools handle linting in your chosen language?
   - What tools handle testing?
   - What tools handle building?
   - Search for specific tools

2. **CI Alternatives:**
   - What alternatives exist besides Jenkins and GitHub Actions?
   - Research other CI platforms
   - Compare options

3. **Self-Hosted vs Cloud:**
   - Which setup is better for this scenario?
   - Why?
   - What information is needed to decide?

**Remember:**
- No "right" answers
- Focus on reasoning
- Research and think critically
- Check word count at wordcounter.net
