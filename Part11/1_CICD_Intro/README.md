# Introduction to CI/CD

This section introduces Continuous Integration (CI) and Continuous Deployment (CD) concepts, explaining why they are important and how they help teams work together effectively.

## Overview

This part focuses on building robust deployment pipelines. Unlike previous parts, this part is more about **configuration** than writing code. Debugging configurations can be challenging, so patience and discipline are essential.

**Key Points:**
- 21 exercises total (all must be completed)
- Exercises submitted via submissions system (different course instance)
- Prerequisites: Complete at least parts 0-5
- Focus on configuration, not code

## Key Concepts

### Terms

- **Branches**: Multiple versions of code that coexist
- **Pull Request (PR)**: Mechanism for merging branches
- **Build**: Preparing software to run on target platform
- **Deploy**: Putting software where users can access it

### CI Steps

1. **Lint**: Keep code clean and maintainable
2. **Build**: Put code together into runnable bundle
3. **Test**: Ensure existing features still work
4. **Package**: Put everything in easily movable batch
5. **Deploy**: Make software available to users

### Important Principles

- **Documented behavior**: Know exactly what will happen
- **Consistency**: Same thing happens every time
- **Always deployable**: Main branch always ready
- **Version tracking**: Know what code is deployed

### CI Setup Types

**Self-Hosted (Jenkins):**
- Full control
- More complex setup
- Hardware maintenance required
- Better for large projects

**Cloud-Based (GitHub Actions):**
- Easy setup
- No maintenance
- Resource limitations
- Better for small-medium projects

## Exercise

### Exercise 11.1: Warming up

Reflect on CI/CD concepts by:
- Choosing a programming language
- Researching CI tools (linting, testing, building)
- Finding CI platform alternatives
- Deciding between self-hosted and cloud-based

Write 200-300 words and save to `exercise1.md` in repository root.

## Resources

- [Git Branches Documentation](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)
- [Martin Fowler on CI](https://martinfowler.com/articles/continuousIntegration.html)
- [Accelerate Book](https://www.amazon.com/Accelerate-Software-Performing-Technology-Organizations/dp/1942788339)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
