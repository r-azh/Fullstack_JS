# Introduction to Containers - Summary

This section introduces containers, Docker, and the fundamental concepts needed to work with containerized applications.

## Overview

This part focuses on **configuration** rather than JavaScript code. Exercises may not require coding - applications are provided via GitHub, and your task is to configure them.

**Prerequisites:**
- Basic knowledge of Node, Express, and React
- Parts 1-5 completed
- Basic command line/terminal knowledge

**Important:**
- All exercises submitted to **single GitHub repository**
- Includes source code and configurations
- Need terminal/command line experience

## What are Containers?

### Definition

**Containers:**
- Encapsulate application into single package
- Include application and all dependencies
- Run isolated from other containers
- OS-level virtualization

**Key Characteristics:**
- Prevent application from accessing device files/resources
- Developers can grant permissions
- Specify available resources
- Lightweight compared to VMs

### Containers vs Virtual Machines

**Virtual Machines (VMs):**
- Run multiple operating systems on single physical machine
- Must run whole operating system
- Higher overhead
- More resource-intensive

**Containers:**
- Use host operating system
- Only need to run single process
- Minimal overhead
- Much lighter weight

**Comparison:**
- **VMs:** Full OS, high overhead, slower
- **Containers:** Shared OS, low overhead, fast

### Benefits of Containers

**1. Quick to Scale:**
- Lightweight nature enables fast scaling
- Easy to start/stop containers
- Efficient resource usage

**2. Run Identically Anywhere:**
- Same container runs on:
  - Your machine
  - Server
  - Cloud environment
  - Different operating systems

**3. Cloud Support:**
- AWS, Google Cloud, Microsoft Azure all support containers
- AWS Fargate, Google Cloud Run (serverless)
- Container can stop when not used (serverless)

**4. Development and Production:**
- Use containers in development
- Use containers in production
- Same environment everywhere

### Common Scenarios

**Scenario 1: Multiple Node Versions**
- New app needs Node 20
- Legacy app needs Node 16
- **Solution:** Run each in separate container
- Isolated, no conflicts

**Scenario 2: Moving to Server**
- App works on your machine
- Doesn't work on server
- Missing dependencies or environment differences
- **Solution:** Container runs same environment everywhere
- Limits differences between environments

**"Works in my Container" Issue:**
- Play on "Works on my machine"
- Container works locally but breaks on server
- Usually a usage error
- Still better than no containerization

## About This Part

### Focus

**Not JavaScript Code:**
- Focus on environment configuration
- Configuration files
- Docker setup
- Container orchestration

**Exercises:**
- May not require coding
- Applications provided via GitHub
- Your task: configure them
- Submit configurations

### Repository Structure

**Single Repository:**
- All source code
- All configurations
- All exercise answers
- Submit one repository

### Prerequisites

**Required Knowledge:**
- Node.js basics
- Express basics
- React basics
- Parts 1-5 completed

**Command Line:**
- Basic terminal/command line knowledge
- If stuck, see warning below

## Warning: Command Line Knowledge

### The Warning

**If you:**
- Only used graphical interface
- Never touched Linux/terminal
- Get stuck in first exercises

**Then:**
- Do Part 1 of "Computing tools for CS studies"
- Link: https://tkt-lapio.github.io/en/
- Skip "SSH connection" and Exercise 11
- Includes everything you need

**Why:**
- This part requires terminal usage
- Docker commands are terminal-based
- Need to be comfortable with command line

## Docker

### What is Docker?

**Docker:**
- Most popular containerization technology
- Pioneered container standards
- Set of products for managing containers
- Enables container benefits

**Docker Products:**
- **Docker Engine:** Turns images into containers
- **Docker Compose:** Orchestrates multiple containers
- **Docker Hub:** Registry for images

### Docker Compose

**Purpose:**
- Orchestrate (control) multiple containers
- Set up complex local development environments
- Manage container relationships
- In final version: won't need Node installed locally!

## Core Concepts

### Images vs Containers

**The Confusion:**
- Terms are often used interchangeably
- But they're different!

**Image:**
- **Immutable** file
- Includes code, dependencies, instructions
- Can be downloaded/built
- Cannot be edited after creation
- Can create new image from existing (add layers)

**Container:**
- **Runtime instance** of an image
- Created from image when you run it
- Only exists during runtime
- Cannot build or download container
- Can start/stop/remove containers

**Cooking Metaphor:**
- **Image:** Pre-cooked, frozen treat
- **Container:** The delicious treat (when you eat it)

**Key Points:**
- Images are files (immutable)
- Containers are running instances
- Everyone says "container" for both
- But technically different

### Image Names

**Format:**
`registry/organisation/image:tag`

**Example:**
- `hello-world:latest`
- Full name: `index.docker.io/library/hello-world:latest`

**Parts:**
- **registry:** Where image is stored (default: Docker Hub)
- **organisation:** Owner/namespace (default: library)
- **image:** Image name
- **tag:** Version (default: latest)

**Docker Hub:**
- Free registry for images
- `library` organization shortened to `_` in URLs
- Example: https://hub.docker.com/_/hello-world

### Image Layers and Digests

**Layers:**
- Each step/command creates a layer
- Image built from multiple layers
- Layers are cached and reusable

**Digest:**
- Unique identifier based on layers
- SHA256 hash
- Used to verify image hasn't changed
- Example: `sha256:5122f6204b6a3596e048758cabba3c46b1c937a46b5be6225b835d091b90e46c`

## Docker Architecture

### Docker Client and Daemon

**Docker Daemon:**
- Background service
- Makes sure containers are running
- Manages images and containers
- Handles container execution

**Docker Client:**
- Command-line tool (`docker`)
- Interacts with daemon
- Sends commands to daemon
- Receives output from daemon

**How It Works:**
1. You run `docker` command (client)
2. Client contacts daemon
3. Daemon executes command
4. Daemon sends output to client
5. Client displays in terminal

## Basic Docker Commands

### Running Containers

**Basic Command:**
```bash
docker container run IMAGE-NAME
```

**What It Does:**
- Creates container from image
- Runs container
- Downloads image if not present
- Executes default command

**Example:**
```bash
docker container run hello-world
```

**Output Shows:**
1. Image not found locally
2. Pulling from Docker Hub
3. Downloading layers
4. Image digest
5. Container output

### Interactive Containers

**Flags:**
- `-i, --interactive`: Keep STDIN open
- `-t, --tty`: Allocate pseudo-TTY
- `-it`: Both flags together

**Purpose:**
- Allow interaction with container
- Type commands inside container
- See output in real-time

**Example:**
```bash
docker container run -it ubuntu bash
```

**What Happens:**
- Runs Ubuntu image
- Executes `bash` command
- Connects you to container
- You're now inside container

### Other Useful Flags

**`--rm`:**
- Remove container after execution
- Clean up automatically
- Example: `docker container run --rm ubuntu ls`

**`--name`:**
- Give container a custom name
- Easier to reference later
- Example: `docker container run -it --name my-container ubuntu bash`

### Listing Containers

**List Running Containers:**
```bash
docker container ls
# or shorter:
docker ps
```

**List All Containers (Including Stopped):**
```bash
docker container ls -a
# or:
docker ps -a
```

**Output Shows:**
- Container ID
- Image used
- Command executed
- Created time
- Status
- Names

### Container Identification

**Two Ways to Identify:**
1. **Container ID:** Unique identifier (e.g., `b8548b9faec3`)
2. **Container Name:** Human-friendly name (e.g., `hopeful_clarke`)

**Both Work:**
- Most commands accept either
- ID is always unique
- Name is easier to remember

### Starting Stopped Containers

**Command:**
```bash
docker start CONTAINER-ID-OR-NAME
```

**Interactive Start:**
```bash
docker start -i CONTAINER-ID-OR-NAME
```

**What Happens:**
- Starts existing container
- Uses same files/changes
- Continues from where it stopped

### Stopping Containers

**Kill Container:**
```bash
docker kill CONTAINER-ID-OR-NAME
```

**What It Does:**
- Sends SIGKILL signal
- Forces process to exit
- Container stops immediately

**vs Stop:**
- `stop` sends SIGTERM (graceful)
- `kill` sends SIGKILL (immediate)
- Use `kill` if container won't stop

### Removing Containers

**Command:**
```bash
docker container rm CONTAINER-ID-OR-NAME
```

**What It Does:**
- Removes container
- Cannot remove running container
- Must stop first

**Remove All Stopped:**
```bash
docker container prune
```

### Copying Files

**Copy to Container:**
```bash
docker container cp LOCAL-FILE CONTAINER-NAME:PATH
```

**Example:**
```bash
docker container cp ./index.js hello-node:/usr/src/app/index.js
```

**What It Does:**
- Copies file from host to container
- Works while container is running
- Useful for adding files

### Creating Images from Containers

**Command:**
```bash
docker commit CONTAINER-ID-OR-NAME NEW-IMAGE-NAME
```

**What It Does:**
- Creates new image from container
- Includes all changes made
- Saves current state

**Example:**
```bash
docker commit hopeful_clarke hello-node-world
```

**Check Changes First:**
```bash
docker container diff CONTAINER-ID-OR-NAME
```

### Listing Images

**Command:**
```bash
docker image ls
```

**Output Shows:**
- Repository (image name)
- Tag (version)
- Image ID
- Created time
- Size

### Pulling Images

**Command:**
```bash
docker image pull IMAGE-NAME
```

**What It Does:**
- Downloads image without running
- Useful for preparing images
- Can pull specific tags

**Example:**
```bash
docker image pull hello-world
```

## Working Inside Containers

### Installing Software

**Ubuntu/Debian:**
```bash
apt-get update
apt-get install -y PACKAGE-NAME
```

**Example - Install Nano:**
```bash
apt-get update
apt-get -y install nano
```

**Note:**
- Inside container, you're usually root
- No need for `sudo`
- Can install packages directly

### Installing Node.js

**Method 1: NodeSource (Recommended)**
```bash
curl -sL https://deb.nodesource.com/setup_20.x | bash
apt install -y nodejs
```

**Prerequisites:**
- Need `curl` installed first
- Install with: `apt-get install -y curl`

**Method 2: Use Node Image**
- Use official Node image from Docker Hub
- Already has Node installed
- Example: `node:20`

### Editing Files

**Nano Editor:**
```bash
nano /path/to/file
```

**Nano Commands:**
- `Ctrl + O`: Save
- `Ctrl + X`: Exit
- `Ctrl + K`: Cut line
- `Ctrl + U`: Paste

**Other Options:**
- `vi` or `vim` (more complex)
- `echo` for simple files
- Copy from host with `docker cp`

## Using Pre-built Images

### Node.js Image

**Official Node Image:**
- Available on Docker Hub
- Link: https://hub.docker.com/_/node
- Multiple versions available
- Already has Node installed

**Using Node Image:**
```bash
docker container run -it --name hello-node node:20 bash
```

**Benefits:**
- No need to install Node
- Pre-configured
- Official and maintained
- Multiple versions

**Versions:**
- `node:20` - Node 20
- `node:18` - Node 18
- `node:latest` - Latest version
- Many more available

## Best Practices

### 1. Use Pre-built Images

```bash
# ✅ Good: Use official Node image
docker container run -it node:20 bash

# ❌ Bad: Install Node manually in Ubuntu
docker container run -it ubuntu bash
# Then install Node...
```

### 2. Name Your Containers

```bash
# ✅ Good: Named container
docker container run -it --name my-app node:20 bash

# ❌ Bad: Random name
docker container run -it node:20 bash
# Hard to find later
```

### 3. Use --rm for One-off Containers

```bash
# ✅ Good: Auto-remove
docker container run --rm ubuntu ls

# ❌ Bad: Leaves stopped containers
docker container run ubuntu ls
# Need to clean up manually
```

### 4. Check Container Status

```bash
# ✅ Good: Check before acting
docker container ls -a
docker start CONTAINER-NAME

# ❌ Bad: Assume container state
docker start CONTAINER-NAME
# Might already be running
```

### 5. Use Interactive Mode When Needed

```bash
# ✅ Good: Interactive for editing
docker start -i CONTAINER-NAME

# ❌ Bad: Start without -i
docker start CONTAINER-NAME
# Can't interact with it
```

## Common Issues and Solutions

### Issue: Container Exits Immediately

**Solution:**
- Container needs a command to run
- Use interactive mode: `-it`
- Specify command: `bash` or `sh`
- Example: `docker container run -it ubuntu bash`

### Issue: Can't Interact with Container

**Solution:**
- Forgot `-i` flag
- Start with: `docker start -i CONTAINER-NAME`
- Or run new container with `-it`

### Issue: File Changes Lost

**Solution:**
- Changes in container are temporary
- Commit container to image: `docker commit`
- Or use volumes (covered later)
- Or copy files with `docker cp`

### Issue: Image Not Found

**Solution:**
- Check image name spelling
- Check if image exists on Docker Hub
- Pull image first: `docker image pull IMAGE-NAME`
- Check internet connection

### Issue: Permission Denied

**Solution:**
- Docker needs superuser access
- Use `sudo` if needed (Linux)
- Or add user to docker group
- On Mac/Windows, Docker Desktop handles this

## Exercises

The exercises (12.1-12.4) involve:
- Using command line and curl
- Running containers
- Working inside containers
- Installing software in containers
- Creating files and directories
- Installing Node.js
- Running JavaScript in containers
