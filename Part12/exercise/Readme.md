# Part 12 Exercises

This file contains exercises for Part 12: Containers as they are covered in the course material.

# [Exercise 12.1: Using a computer (without graphical user interface)](https://fullstackopen.com/en/part12/introduction_to_containers#exercise-12-1)

## Warning

Since we are stepping right outside of our comfort zone as JavaScript developers, this part may require you to take a detour and familiarize yourself with shell / command line / command prompt / terminal before getting started.

If you have only ever used a graphical user interface and never touched e.g. Linux or terminal on Mac, or if you get stuck in the first exercises we recommend doing the Part 1 of "Computing tools for CS studies" first: https://tkt-lapio.github.io/en/. Skip the section for "SSH connection" and Exercise 11. Otherwise, it includes everything you are going to need to get started here!

## Task

**Step 1:** Read the text below the "Warning" header.

**Step 2:** Download this repository and make it your submission repository for this part.

**Details:**
- Download/clone the repository provided in the course
- This will be your submission repository
- All exercises will be submitted here
- Repository should have `script-answers/` directory

**Step 3:** Run `curl http://helsinki.fi` and save the output into a file.

**Details:**
- Open terminal/command line
- Run command: `curl http://helsinki.fi`
- Save output to file: `script-answers/exercise12_1.txt`
- The `script-answers` directory was created in step 2

**Command:**
```bash
curl http://helsinki.fi > script-answers/exercise12_1.txt
```

**Or:**
```bash
curl http://helsinki.fi | tee script-answers/exercise12_1.txt
```

**Verify:**
- Check file exists: `ls script-answers/exercise12_1.txt`
- View contents: `cat script-answers/exercise12_1.txt`
- File should contain HTML output from Helsinki website

# [Exercise 12.2: Running your second container](https://fullstackopen.com/en/part12/introduction_to_containers#exercise-12-2)

Use `script` to record what you do, save the file as `script-answers/exercise12_2.txt`

**Details:**
- Start recording: `script script-answers/exercise12_2.txt`
- Do the exercises
- Stop recording: `exit`
- File will be saved automatically

**If `script` doesn't work:**
- Copy-paste all commands into text file
- Save as `script-answers/exercise12_2.txt`

## Task

The hello-world output gave us an ambitious task to do. Do the following:

**Step 1:** Run an Ubuntu container with the command given by hello-world

**Command:**
```bash
docker container run -it ubuntu bash
```

**What happens:**
- Downloads Ubuntu image if not present
- Creates container from image
- Connects you to container with bash
- You're now inside the container (prompt changes)

**Step 2:** Create directory `/usr/src/app`

**Command (inside container):**
```bash
mkdir /usr/src/app
```

**Verify:**
```bash
ls -la /usr/src/app
```

**Step 3:** Create a file `/usr/src/app/index.js`

**Command (inside container):**
```bash
touch /usr/src/app/index.js
```

**Or using echo:**
```bash
echo "" > /usr/src/app/index.js
```

**Verify:**
```bash
ls -la /usr/src/app/index.js
```

**Step 4:** Run `exit` to quit from the container

**Command (inside container):**
```bash
exit
```

**What happens:**
- Container stops running
- You're back in your host terminal
- Container still exists (just stopped)

**Google should be able to help you with creating directories and files.**

**Note:**
- All steps 2-4 are run **inside the container**
- You'll see `root@CONTAINER-ID:/#` prompt
- That means you're inside the container

# [Exercise 12.3: Ubuntu 101](https://fullstackopen.com/en/part12/introduction_to_containers#exercise-12-3)

Use `script` to record what you do, save the file as `script-answers/exercise12_3.txt`

## Task

Edit the `/usr/src/app/index.js` file inside the container with the now installed Nano and add the following line:

```javascript
console.log('Hello World')
```

**Details:**
- Start the container again (if stopped):
  ```bash
  docker start -i CONTAINER-NAME
  ```
- If you don't have the container, create new one:
  ```bash
  docker container run -it ubuntu bash
  ```
- Install Nano (if not installed):
  ```bash
  apt-get update
  apt-get install -y nano
  ```
- Edit the file:
  ```bash
  nano /usr/src/app/index.js
  ```
- Add the line: `console.log('Hello World')`
- Save and exit Nano:
  - `Ctrl + O` to save
  - `Ctrl + X` to exit
- Verify:
  ```bash
  cat /usr/src/app/index.js
  ```

**If you are not familiar with Nano you can ask for help in the chat or Google.**

**Nano Basics:**
- Arrow keys to move cursor
- Type to add text
- `Ctrl + O`: Save (write out)
- `Ctrl + X`: Exit
- `Ctrl + K`: Cut line
- `Ctrl + U`: Paste

# [Exercise 12.4: Ubuntu 102](https://fullstackopen.com/en/part12/introduction_to_containers#exercise-12-4)

Use `script` to record what you do, save the file as `script-answers/exercise12_4.txt`

## Task

Install Node while inside the container and run the index file with `node /usr/src/app/index.js` in the container.

**Details:**
- Install curl (if not installed):
  ```bash
  apt-get update
  apt-get install -y curl
  ```
- Install Node.js using NodeSource:
  ```bash
  curl -sL https://deb.nodesource.com/setup_20.x | bash
  apt install -y nodejs
  ```
- Verify Node installation:
  ```bash
  node --version
  npm --version
  ```
- Run the JavaScript file:
  ```bash
  node /usr/src/app/index.js
  ```
- Expected output:
  ```
  Hello World
  ```

**The instructions for installing Node are sometimes hard to find, so here is something you can copy-paste:**

```bash
curl -sL https://deb.nodesource.com/setup_20.x | bash
apt install -y nodejs
```

**You will need to install the `curl` into the container. It is installed in the same way as you did with `nano`.**

**After the installation, ensure that you can run your code inside the container with the command:**

```bash
root@CONTAINER-ID:/# node /usr/src/app/index.js
Hello World
```

**Complete Steps:**
1. Start container (if stopped): `docker start -i CONTAINER-NAME`
2. Install curl: `apt-get install -y curl`
3. Install Node: Use provided commands
4. Verify Node: `node --version`
5. Run file: `node /usr/src/app/index.js`
6. Verify output: Should show "Hello World"

# [Exercises 12.5-12.12: Building and Configuring Environments](https://fullstackopen.com/en/part12/building_and_configuring_environments#exercise-12-5)

## 12.5: Containerizing a Node application

Containerize the todo-backend application by creating a Dockerfile and building an image.

**Details:**
- Repository structure:
  - Repository has `todo-app/todo-backend` directory
  - Read README in todo-backend
  - Don't touch todo-frontend yet
- Test application first:
  - Run application outside container
  - Understand what it does
  - Check visit counter at http://localhost:3000/
  - Verify it works before containerizing
- Create Dockerfile:
  - Location: `todo-app/todo-backend/Dockerfile`
  - Use Node 20 as base
  - Set working directory
  - Copy package files first (optimization)
  - Install dependencies
  - Copy application files
  - Set environment variables if needed
  - Use non-root user
  - Define CMD
- Example Dockerfile:
  ```dockerfile
  FROM node:20
  
  WORKDIR /usr/src/app
  
  COPY package*.json ./
  RUN npm ci
  
  COPY . .
  
  ENV DEBUG=todo-backend:*
  
  USER node
  CMD npm start
  ```
- Build image:
  ```bash
  cd todo-app/todo-backend
  docker build -t todo-backend .
  ```
- Run container:
  ```bash
  docker run -p 3000:3000 todo-backend
  ```
- Verify:
  - Open http://localhost:3000/ in browser
  - Visit counter should increase
  - Application should work

## 12.6: Docker compose

Create a docker-compose.yml file for the todo-backend application.

**Details:**
- Create compose file:
  - Location: `todo-app/todo-backend/docker-compose.yml`
  - Define service for backend
  - Specify build context
  - Map ports (use same port: 3000:3000)
- Example file:
  ```yaml
  services:
    app:
      image: todo-backend
      build: .
      ports:
        - 3000:3000
  ```
- Run with compose:
  ```bash
  docker compose up
  ```
- Rebuild if needed:
  ```bash
  docker compose up --build
  ```
- Run in background:
  ```bash
  docker compose up -d
  ```
- Stop services:
  ```bash
  docker compose down
  ```
- Verify:
  - Visit counter should work
  - Application accessible at http://localhost:3000/

## 12.7: Little bit of MongoDB coding

Implement missing routes for getting one todo and updating one todo.

**Details:**
- Prerequisites:
  - Have MongoDB configured (from material)
  - Run backend outside container
  - MongoDB running in container
- Missing routes:
  - GET `/todos/:id` - Get single todo
  - PUT `/todos/:id` - Update single todo
- Implementation:
  - Find route file (likely `routes/todos.js`)
  - Implement GET route:
    ```javascript
    router.get('/:id', async (req, res) => {
      const todo = await Todo.findById(req.params.id);
      if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.json(todo);
    });
    ```
  - Implement PUT route:
    ```javascript
    router.put('/:id', async (req, res) => {
      const { text, done } = req.body;
      const todo = await Todo.findByIdAndUpdate(
        req.params.id,
        { text, done },
        { new: true, runValidators: true }
      );
      if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.json(todo);
    });
    ```
- Test with Postman:
  - Test GET `/todos/:id` with existing ID
  - Test PUT `/todos/:id` with updates
  - Verify responses are correct

## 12.8: Mongo command-line interface

Access MongoDB using docker exec and add a new todo via CLI.

**Details:**
- Use script to record:
  - Start recording: `script script-answers/exercise12_8.txt`
  - Do the work
  - Stop recording: `exit`
- Step 1: Run MongoDB
  ```bash
  docker compose -f docker-compose.dev.yml up -d
  ```
- Step 2: Get container name
  ```bash
  docker container ls
  # or
  docker compose -f docker-compose.dev.yml ps
  ```
- Step 3: Access MongoDB CLI
  ```bash
  docker exec -it CONTAINER-NAME mongosh -u root -p example
  ```
- Step 4: Show databases
  ```bash
  > show dbs
  ```
- Step 5: Use database
  ```bash
  > use the_database
  ```
- Step 6: Show collections
  ```bash
  > show collections
  ```
- Step 7: View todos
  ```bash
  > db.todos.find({})
  ```
- Step 8: Insert new todo
  ```bash
  > db.todos.insert({ 
      text: 'Increase the number of tools in my tool belt', 
      done: false 
    })
  ```
- Step 9: Verify in Express app
  - Check http://localhost:3000/todos
  - New todo should appear
- Step 10: Verify in CLI
  ```bash
  > db.todos.find({})
  ```
  - Should see new todo

## 12.9: Set up Redis for the project

Add Redis service to docker-compose.dev.yml and configure connection.

**Details:**
- Read Redis Docker Hub page:
  - Find default port (6379)
  - Understand configuration options
- Add Redis service:
  - Edit `todo-app/todo-backend/docker-compose.dev.yml`
  - Add redis service after mongo
- Example configuration:
  ```yaml
  services:
    mongo:
      # ... existing config ...
    redis:
      image: redis
      ports:
        - 6379:6379
  ```
- Start Redis:
  ```bash
  docker compose -f docker-compose.dev.yml up -d
  ```
- Test connection:
  - Add to Express server (e.g., `routes/index.js`):
    ```javascript
    const redis = require('../redis');
    ```
  - Start backend with Redis URL:
    ```bash
    REDIS_URL=redis://localhost:6379 MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database npm run dev
    ```
- Verify:
  - If nothing happens: Configuration correct
  - If error: Check Redis is running and URL is correct
- Common error:
  ```
  Error: Redis connection to localhost:637 failed - connect ECONNREFUSED
  ```
  - Solution: Check Redis service is running
  - Check port mapping is correct

## 12.10: Implement todo counter

Implement a counter that saves the number of created todos to Redis.

**Details:**
- Prerequisites:
  - Redis is set up (exercise 12.9)
  - Redis package installed
  - `getAsync` and `setAsync` functions available
- Step 1: Increment counter on todo creation
  - Find route that creates todos (POST `/todos`)
  - Increment counter:
    ```javascript
    const redis = require('../redis');
    
    router.post('/', async (req, res) => {
      // ... create todo ...
      
      // Increment counter
      const currentCount = await redis.getAsync('added_todos');
      const newCount = (parseInt(currentCount) || 0) + 1;
      await redis.setAsync('added_todos', newCount.toString());
      
      res.json(todo);
    });
    ```
- Step 2: Create statistics endpoint
  - Add GET `/statistics` route
  - Return JSON format:
    ```javascript
    router.get('/statistics', async (req, res) => {
      const count = await redis.getAsync('added_todos');
      res.json({
        added_todos: parseInt(count) || 0
      });
    });
    ```
- Test:
  - Create todos via Postman
  - Check http://localhost:3000/statistics
  - Counter should increase
  - Verify format matches requirement

## 12.11: Redis command-line interface

Use redis-cli to access Redis database and manipulate data.

**Details:**
- Use script to record:
  - Start: `script script-answers/exercise12_11.txt`
  - Do the work
  - Stop: `exit`
- Step 1: Get Redis container name
  ```bash
  docker compose -f docker-compose.dev.yml ps
  ```
- Step 2: Access Redis CLI
  ```bash
  docker exec -it CONTAINER-NAME redis-cli
  ```
- Step 3: List all keys
  ```bash
  > KEYS *
  ```
- Step 4: Get counter value
  ```bash
  > GET added_todos
  ```
- Step 5: Set counter to 9001
  ```bash
  > SET added_todos 9001
  ```
- Step 6: Verify in browser
  - Refresh http://localhost:3000/statistics
  - Should show 9001
- Step 7: Create new todo
  - Use Postman to POST new todo
  - Counter should increment
- Step 8: Verify in CLI
  ```bash
  > GET added_todos
  ```
  - Should show 9002 (or incremented value)
- Step 9: Delete key
  ```bash
  > DEL added_todos
  ```
- Step 10: Verify counter works
  - Create new todo
  - Counter should start from 0 (or 1)
  - Verify in statistics endpoint

## 12.12: Persisting data in Redis

Configure Redis to persist data using volumes.

**Details:**
- Step 1: Verify data not persisted
  ```bash
  docker compose -f docker-compose.dev.yml down
  docker compose -f docker-compose.dev.yml up
  ```
  - Check statistics endpoint
  - Counter should be reset to 0
- Step 2: Add persistence
  - Edit `docker-compose.dev.yml`
  - Add command and volume to Redis service:
    ```yaml
    services:
      redis:
        image: redis
        ports:
          - 6379:6379
        command: ['redis-server', '--appendonly', 'yes']
        volumes:
          - ./redis_data:/data
    ```
- Step 3: Add to .gitignore
  - Add `redis_data/` to `.gitignore`
  - Don't commit data directory
- Step 4: Test persistence
  - Start Redis: `docker compose -f docker-compose.dev.yml up -d`
  - Create some todos
  - Check counter value
  - Stop and remove: `docker compose -f docker-compose.dev.yml down`
  - Start again: `docker compose -f docker-compose.dev.yml up -d`
  - Check counter: Should still have value
- Verify:
  - Data survives container restart
  - Counter persists
  - Data directory created on host

# [Exercises 12.13-12.22: Basics of Orchestration](https://fullstackopen.com/en/part12/basics_of_orchestration#exercises-12-13-12-14)

## 12.13: Todo application frontend

Containerize the todo-frontend application and configure it to work with the backend.

**Details:**
- View todo-frontend:
  - Go to `todo-app/todo-frontend`
  - Read README
  - Understand the application
- Test outside container:
  - Run frontend outside container first
  - Ensure it works with backend
  - Backend should be running (outside container)
  - Verify all features work
- Create Dockerfile:
  - Location: `todo-app/todo-frontend/Dockerfile`
  - Use multi-stage build
  - Build stage: Node.js, build app
  - Production stage: Nginx, serve static files
- Set environment variable:
  - Use `ENV` instruction
  - Set `VITE_BACKEND_URL`
  - **Important:** Must be set BEFORE build
  - Vite replaces env vars at build time
- Example Dockerfile:
  ```dockerfile
  # Build stage
  FROM node:20 AS build-stage
  WORKDIR /usr/src/app
  
  COPY package*.json ./
  RUN npm ci
  
  COPY . .
  
  ENV VITE_BACKEND_URL=http://localhost:3000/api
  
  RUN npm run build
  
  # Production stage
  FROM nginx:1.25-alpine
  COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
  ```
- Build image:
  ```bash
  cd todo-app/todo-frontend
  docker build -t todo-frontend .
  ```
- Run container:
  ```bash
  docker run -p 3000:80 todo-frontend
  ```
- Verify:
  - Open http://localhost:3000
  - Should work with backend
  - All features functional

## 12.14: Testing during the build process

Add testing stage to the build process to ensure tests pass before building.

**Details:**
- Extract Todo component:
  - Create `Todo` component
  - Represent single todo
  - Extract from existing code
- Write test:
  - Create test file for Todo component
  - Test component rendering
  - Test component behavior
- Add test stage:
  - Add test stage to Dockerfile
  - Run tests during build
  - Build fails if tests fail
- Example Dockerfile:
  ```dockerfile
  # Test stage
  FROM node:20 AS test-stage
  WORKDIR /usr/src/app
  COPY . .
  RUN npm ci
  RUN npm test
  
  # Build stage
  FROM node:20 AS build-stage
  WORKDIR /usr/src/app
  COPY --from=test-stage /usr/src/app .
  RUN npm run build
  
  # Production stage
  FROM nginx:1.25-alpine
  COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
  ```
- Important:
  - Test stage must pass code to build stage
  - Use `COPY --from=test-stage`
  - Ensures tested code is built
- Verify:
  - Build succeeds if tests pass
  - Build fails if tests fail
  - Tests run automatically

## 12.15: Set up a frontend development environment

Create development environment for todo-frontend using volumes.

**Details:**
- Create dev.Dockerfile:
  - Location: `todo-app/todo-frontend/dev.Dockerfile`
  - Use Node.js base
  - Install dependencies (npm install)
  - Run dev server with --host flag
- Example dev.Dockerfile:
  ```dockerfile
  FROM node:20
  
  WORKDIR /usr/src/app
  
  COPY . .
  
  RUN npm install
  
  CMD ["npm", "run", "dev", "--", "--host"]
  ```
- Create docker-compose.dev.yml:
  - Location: `todo-app/todo-frontend/docker-compose.dev.yml`
  - Define frontend service
  - Use bind mount for volumes
  - Map ports
- Example compose file:
  ```yaml
  services:
    app:
      image: todo-front-dev
      build:
        context: .
        dockerfile: dev.Dockerfile
      volumes:
        - ./:/usr/src/app
      ports:
        - 5173:5173
      container_name: todo-front-dev
  ```
- Run:
  ```bash
  docker compose -f docker-compose.dev.yml up
  ```
- Verify:
  - Edit files on host
  - Changes hot-reload
  - Application works
  - No Node.js needed on host

## 12.16: Run todo-backend in a development container

Set up backend development environment with volumes and nodemon.

**Details:**
- Create dev.Dockerfile:
  - Location: `todo-app/todo-backend/dev.Dockerfile`
  - Use Node.js base
  - Install dependencies
  - Run with nodemon (dev mode)
- Example dev.Dockerfile:
  ```dockerfile
  FROM node:20
  
  WORKDIR /usr/src/app
  
  COPY package*.json ./
  RUN npm install
  
  COPY . .
  
  CMD ["npm", "run", "dev"]
  ```
- Update docker-compose.dev.yml:
  - Edit `todo-app/todo-backend/docker-compose.dev.yml`
  - Add backend service
  - Add volumes for file access
  - Add environment variables
- Environment variables:
  - `MONGO_URL`: Use service name `mongo`
  - `REDIS_URL`: Use service name `redis`
  - Format: `mongodb://user:pass@mongo:27017/database`
  - Format: `redis://redis:6379`
- Example compose file:
  ```yaml
  services:
    mongo:
      # ... existing config ...
    redis:
      # ... existing config ...
    backend:
      image: todo-back-dev
      build:
        context: .
        dockerfile: dev.Dockerfile
      volumes:
        - ./:/usr/src/app
      environment:
        - MONGO_URL=mongodb://the_username:the_password@mongo:27017/the_database
        - REDIS_URL=redis://redis:6379
      container_name: todo-back-dev
  ```
- Important:
  - Use service names in URLs (not localhost)
  - Use container ports (not host ports)
  - Watch console logs for errors
  - Error messages hint at problems
- Verify:
  - Backend runs in container
  - File changes hot-reload
  - Connects to MongoDB
  - Connects to Redis
  - All features work

## 12.17: Set up an Nginx reverse proxy server in front of todo-frontend

Create Nginx reverse proxy in front of todo-frontend.

**Details:**
- Create new compose file:
  - Location: `todo-app/docker-compose.dev.yml`
  - At root of todo-app directory
- Create Nginx config:
  - Location: `todo-app/nginx.dev.conf`
  - Configure reverse proxy
  - Handle root path `/`
- Directory structure:
  ```
  todo-app/
  ├── todo-frontend/
  ├── todo-backend/
  ├── nginx.dev.conf
  └── docker-compose.dev.yml
  ```
- Add services:
  - Nginx service
  - Frontend service (built with dev.Dockerfile)
- Example compose file:
  ```yaml
  services:
    frontend:
      image: todo-front-dev
      build:
        context: ./todo-frontend
        dockerfile: dev.Dockerfile
      volumes:
        - ./todo-frontend:/usr/src/app
      container_name: todo-front-dev
    
    nginx:
      image: nginx:1.20.1
      volumes:
        - ./nginx.dev.conf:/etc/nginx/nginx.conf:ro
      ports:
        - 8080:80
      container_name: reverse-proxy
      depends_on:
        - frontend
  ```
- Example nginx.dev.conf:
  ```nginx
  events { }
  
  http {
    server {
      listen 80;
      
      location / {
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        
        proxy_pass http://frontend:5173;
      }
    }
  }
  ```
- Note:
  - Don't need to support `--build` flag
  - Build frontend separately
  - Focus on configuration
- Verify:
  - Access http://localhost:8080
  - Frontend loads through Nginx
  - Hot-reload works

## 12.18: Configure the Nginx server to be in front of todo-backend

Add backend service and configure Nginx to proxy API requests.

**Details:**
- Add backend service:
  - Add to `todo-app/docker-compose.dev.yml`
  - Use dev.Dockerfile
  - Add volumes and environment
- Update Nginx config:
  - Add new location block
  - Handle `/api/` path
  - Proxy to backend
- Example nginx.dev.conf:
  ```nginx
  events { }
  
  http {
    server {
      listen 80;
      
      # Frontend
      location / {
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        
        proxy_pass http://frontend:5173;
      }
      
      # Backend API
      location /api/ {
        proxy_pass http://backend:3000/;
      }
    }
  }
  ```
- Important: Trailing slash
  - `proxy_pass http://backend:3000/;` (with trailing slash)
  - Removes `/api` prefix from request
  - `/api/todos` → `/todos` in backend
  - Without trailing slash: keeps prefix (wrong!)
- Update compose file:
  ```yaml
  services:
    frontend:
      # ... existing config ...
    backend:
      image: todo-back-dev
      build:
        context: ./todo-backend
        dockerfile: dev.Dockerfile
      volumes:
        - ./todo-backend:/usr/src/app
      environment:
        - MONGO_URL=mongodb://the_username:the_password@mongo:27017/the_database
        - REDIS_URL=redis://redis:6379
      container_name: todo-back-dev
    nginx:
      depends_on:
        - frontend
        - backend
  ```
- Verify:
  - Access http://localhost:8080/api/todos
  - Should proxy to backend
  - Backend responds correctly

## 12.19: Connect the services, todo-frontend with todo-backend

Configure frontend to connect to backend through Nginx.

**Details:**
- Understand request flow:
  - React code runs in browser (not container!)
  - Browser downloads React code from container
  - Browser executes React code
  - API requests go through Nginx
- Update VITE_BACKEND_URL:
  - Set in dev.Dockerfile or environment
  - Should point to Nginx: `http://localhost:8080/api`
  - Browser makes requests to this URL
  - Nginx proxies to backend
- Frontend configuration:
  - Update environment variable
  - Rebuild frontend if needed
  - Or set in compose file
- Example compose update:
  ```yaml
  services:
    frontend:
      build:
        context: ./todo-frontend
        dockerfile: dev.Dockerfile
      volumes:
        - ./todo-frontend:/usr/src/app
      environment:
        - VITE_BACKEND_URL=http://localhost:8080/api
  ```
- Remove exposed ports:
  - Frontend and backend don't need ports
  - Only Nginx needs port
  - Services communicate internally
- Final compose structure:
  ```yaml
  services:
    frontend:
      # No ports!
      volumes:
        - ./todo-frontend:/usr/src/app
    
    backend:
      # No ports!
      volumes:
        - ./todo-backend:/usr/src/app
      environment:
        - ...
    
    nginx:
      ports:
        - 8080:80  # Only this needed
      depends_on:
        - frontend
        - backend
  ```
- Verify:
  - All features work
  - Can edit source files
  - Changes take effect (hot-reload)
  - Frontend accesses backend through Nginx
  - Check browser network tab: requests to `8080/api/todos`
  - No direct access to backend/frontend ports needed

## 12.20: Production docker-compose.yml

Create production setup with all services.

**Details:**
- Create production compose:
  - Location: `todo-app/docker-compose.yml`
  - All services: frontend, backend, mongo, redis, nginx
- Use production Dockerfiles:
  - Frontend: `Dockerfile` (not dev.Dockerfile)
  - Backend: `Dockerfile` (not dev.Dockerfile)
- Directory structure:
  ```
  todo-app/
  ├── todo-frontend/
  ├── todo-backend/
  ├── nginx.dev.conf
  ├── docker-compose.dev.yml
  ├── nginx.conf
  └── docker-compose.yml
  ```
- Production compose example:
  ```yaml
  services:
    frontend:
      build:
        context: ./todo-frontend
        dockerfile: Dockerfile
    
    backend:
      build:
        context: ./todo-backend
        dockerfile: Dockerfile
      environment:
        - MONGO_URL=mongodb://the_username:the_password@mongo:27017/the_database
        - REDIS_URL=redis://redis:6379
    
    mongo:
      image: mongo
      environment:
        MONGO_INITDB_ROOT_USERNAME: root
        MONGO_INITDB_ROOT_PASSWORD: example
        MONGO_INITDB_DATABASE: the_database
      volumes:
        - ./todo-backend/mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
        - mongo_data:/data/db
    
    redis:
      image: redis
      command: ['redis-server', '--appendonly', 'yes']
      volumes:
        - redis_data:/data
    
    nginx:
      image: nginx:1.20.1
      volumes:
        - ./nginx.conf:/etc/nginx/nginx.conf:ro
      ports:
        - 8080:80
      depends_on:
        - frontend
        - backend
  
  volumes:
    mongo_data:
    redis_data:
  ```
- Production nginx.conf:
  ```nginx
  events { }
  
  http {
    server {
      listen 80;
      
      location / {
        proxy_pass http://frontend:80;
      }
      
      location /api/ {
        proxy_pass http://backend:3000/;
      }
    }
  }
  ```
- Verify:
  - Build all images
  - Start all services
  - Access http://localhost:8080
  - All features work
  - Production mode (no hot-reload)

## 12.21: Your own app development environment

Create containerized development environment for your own full stack app.

**Details:**
- Choose application:
  - Any full stack app from course
  - Or your own application
- Structure:
  ```
  my-app/
  ├── frontend/
  │   └── dev.Dockerfile
  ├── backend/
  │   └── dev.Dockerfile
  ├── nginx.dev.conf
  └── docker-compose.dev.yml
  ```
- Create dev.Dockerfiles:
  - Frontend: Development mode with hot-reload
  - Backend: Development mode with nodemon
- Create nginx.dev.conf:
  - Proxy frontend at `/`
  - Proxy backend at `/api/`
- Create docker-compose.dev.yml:
  - All services: frontend, backend, databases
  - Volumes for file access
  - Environment variables
  - Nginx reverse proxy
- Verify:
  - All services work
  - Can edit files
  - Changes hot-reload
  - Frontend connects to backend
  - All features functional

## 12.22: Your own app production setup

Create containerized production setup for your own app.

**Details:**
- Structure:
  ```
  my-app/
  ├── frontend/
  │   ├── dev.Dockerfile
  │   └── Dockerfile
  ├── backend/
  │   ├── dev.Dockerfile
  │   └── Dockerfile
  ├── nginx.dev.conf
  ├── nginx.conf
  ├── docker-compose.dev.yml
  └── docker-compose.yml
  ```
- Create production Dockerfiles:
  - Frontend: Multi-stage build with Nginx
  - Backend: Production optimized
- Create production compose:
  - All services in production mode
  - No volumes (except data)
  - Production Nginx config
  - Data persistence
- Verify:
  - Build succeeds
  - All services start
  - Application works
  - Production optimized
