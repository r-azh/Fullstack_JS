# Docker Commands Reference

Quick reference for common Docker commands used in this section.

## Container Management

### Run Container
```bash
# Basic run
docker container run IMAGE-NAME

# Interactive with bash
docker container run -it ubuntu bash

# Named container
docker container run -it --name my-container ubuntu bash

# Auto-remove after execution
docker container run --rm ubuntu ls
```

### List Containers
```bash
# Running containers
docker container ls
# or shorter:
docker ps

# All containers (including stopped)
docker container ls -a
# or:
docker ps -a
```

### Start/Stop Containers
```bash
# Start stopped container
docker start CONTAINER-NAME

# Start interactively
docker start -i CONTAINER-NAME

# Stop container
docker stop CONTAINER-NAME

# Kill container (force stop)
docker kill CONTAINER-NAME
```

### Remove Containers
```bash
# Remove container
docker container rm CONTAINER-NAME

# Remove all stopped containers
docker container prune
```

## Image Management

### List Images
```bash
docker image ls
```

### Pull Images
```bash
docker image pull IMAGE-NAME
```

### Create Image from Container
```bash
docker commit CONTAINER-NAME NEW-IMAGE-NAME
```

### Check Container Changes
```bash
docker container diff CONTAINER-NAME
```

## File Operations

### Copy Files
```bash
# Copy from host to container
docker container cp LOCAL-FILE CONTAINER-NAME:PATH

# Example
docker container cp ./index.js hello-node:/usr/src/app/index.js
```

## Common Flags

- `-i, --interactive`: Keep STDIN open
- `-t, --tty`: Allocate pseudo-TTY
- `-it`: Both flags together (interactive)
- `--rm`: Remove container after execution
- `--name`: Give container a name
- `-a, --all`: Show all (including stopped)

## Inside Container Commands

### Package Management (Ubuntu/Debian)
```bash
# Update package list
apt-get update

# Install package
apt-get install -y PACKAGE-NAME

# Install curl
apt-get install -y curl

# Install nano
apt-get install -y nano
```

### Node.js Installation
```bash
# Install Node.js 20
curl -sL https://deb.nodesource.com/setup_20.x | bash
apt install -y nodejs

# Verify installation
node --version
npm --version
```

### File Operations
```bash
# Create directory
mkdir /path/to/directory

# Create file
touch /path/to/file

# Edit with nano
nano /path/to/file

# View file
cat /path/to/file

# List files
ls -la
```

## Script Command

### Record Terminal Session
```bash
# Start recording
script script-answers/exercise12_X.txt

# Do your work
# Commands and output are recorded

# Stop recording
exit
```

**Note:** If `script` doesn't work, just copy-paste commands into a text file.
