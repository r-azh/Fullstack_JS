# Exercises: Extending the Bloglist - Summary

This section contains exercises 7.9-7.21 that extend the BlogList application from parts 4 and 5. These exercises apply advanced state management techniques (Redux, React Query, Context) and add new features like user views, navigation, comments, and styling.

## Overview

The exercises are divided into several categories:
1. **Code Formatting** (7.9)
2. **State Management** (7.10-7.13) - Choose Redux OR React Query/Context
3. **Views** (7.14-7.17)
4. **Comments** (7.18-7.19)
5. **Styling** (7.20-7.21)

**Important Notes:**
- Many exercises require refactoring existing code
- Take baby steps - don't leave the app broken for long periods
- Exercises 7.10-7.13 have two alternative versions (Redux or React Query/Context)
- You can skip exercises if needed, but they build on each other

## Exercise 7.9: Automatic Code Formatting

### Objective
Integrate Prettier for automatic code formatting alongside ESLint.

### Prettier Overview

**What is Prettier?**
- Opinionated code formatter
- Automatically formats code on save
- Works alongside ESLint
- Enforces consistent code style

**Key Features:**
- Formats JavaScript, JSX, CSS, JSON, Markdown, etc.
- Configurable rules
- Editor integration
- CI/CD integration

### Setup

#### 1. Install Prettier

```bash
npm install --save-dev prettier
```

#### 2. Create Prettier Configuration

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "avoid"
}
```

#### 3. Create .prettierignore

```
// .prettierignore
node_modules
build
dist
coverage
```

#### 4. Add Scripts to package.json

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,json,css,md}\""
  }
}
```

#### 5. Editor Integration

**VS Code:**
1. Install "Prettier - Code formatter" extension
2. Add to settings.json:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### ESLint Integration

Install eslint-config-prettier to avoid conflicts:

```bash
npm install --save-dev eslint-config-prettier
```

Update ESLint config:

```js
// eslint.config.js
export default [
  // ... other configs
  'prettier', // Must be last
]
```

### Usage

**Format all files:**
```bash
npm run format
```

**Check formatting:**
```bash
npm run format:check
```

**Format on save:**
- Automatically formats when you save files (if editor configured)

## Exercises 7.10-7.13: State Management

**Important:** Choose ONE of two paths:
- **Path A:** Redux (exercises 7.10-7.13)
- **Path B:** React Query and Context (exercises 7.10-7.13)

You can do both for maximum learning!

### Path A: Redux

#### Exercise 7.10: Redux, Step 1

**Objective:** Refactor notification state to Redux.

**Steps:**
1. Install Redux Toolkit:
```bash
npm install @reduxjs/toolkit react-redux
```

2. Create notification slice:
```js
// src/reducers/notificationReducer.js
import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return null
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer
```

3. Configure store:
```js
// src/store.js
import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'

const store = configureStore({
  reducer: {
    notification: notificationReducer
  }
})

export default store
```

4. Wrap app with Provider:
```js
// src/main.jsx
import { Provider } from 'react-redux'
import store from './store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

5. Use in components:
```js
// src/components/Notification.jsx
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  // ... render notification
}
```

```js
// src/components/SomeComponent.jsx
import { useDispatch } from 'react-redux'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const SomeComponent = () => {
  const dispatch = useDispatch()
  
  const showNotification = (message) => {
    dispatch(setNotification(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }
}
```

#### Exercise 7.11: Redux, Step 2

**Objective:** Store blog posts in Redux store. Display blogs and create new blogs.

**Steps:**
1. Create blog slice:
```js
// src/reducers/blogReducer.js
import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    }
  }
})

export const { setBlogs, appendBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (newBlog) => {
  return async (dispatch) => {
    const blog = await blogService.create(newBlog)
    dispatch(appendBlog(blog))
    return blog
  }
}

export default blogSlice.reducer
```

2. Add to store:
```js
// src/store.js
import blogReducer from './reducers/blogReducer'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer
  }
})
```

3. Use in components:
```js
// src/App.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  // ... rest of component
}
```

#### Exercise 7.12: Redux, Step 3

**Objective:** Add like and delete functionality for blogs.

**Steps:**
1. Add reducers to blog slice:
```js
// src/reducers/blogReducer.js
const blogSlice = createSlice({
  // ...
  reducers: {
    // ...
    updateBlog(state, action) {
      const id = action.payload.id
      return state.map(blog =>
        blog.id !== id ? blog : action.payload
      )
    },
    removeBlog(state, action) {
      const id = action.payload
      return state.filter(blog => blog.id !== id)
    }
  }
})

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.update({
      ...blog,
      likes: blog.likes + 1
    })
    dispatch(updateBlog(updatedBlog))
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch(removeBlog(id))
  }
}
```

2. Use in components:
```js
import { useDispatch } from 'react-redux'
import { likeBlog, deleteBlog } from '../reducers/blogReducer'

const Blog = ({ blog }) => {
  const dispatch = useDispatch()
  
  const handleLike = () => {
    dispatch(likeBlog(blog))
  }
  
  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title}?`)) {
      dispatch(deleteBlog(blog.id))
    }
  }
}
```

#### Exercise 7.13: Redux, Step 4

**Objective:** Store signed-in user in Redux store.

**Steps:**
1. Create user slice:
```js
// src/reducers/userReducer.js
import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser() {
      return null
    }
  }
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
```

2. Add to store and use in login/logout:
```js
// src/components/LoginForm.jsx
import { useDispatch } from 'react-redux'
import { setUser } from '../reducers/userReducer'

const LoginForm = () => {
  const dispatch = useDispatch()
  
  const handleLogin = async (credentials) => {
    const user = await loginService.login(credentials)
    dispatch(setUser(user))
    // ...
  }
}
```

### Path B: React Query and Context

#### Exercise 7.10: React Query and Context step 1

**Objective:** Use useReducer and Context for notification state.

**Steps:**
1. Create notification context:
```js
// src/NotificationContext.jsx
import { createContext, useReducer, useContext } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationContextProvider')
  }
  return context
}
```

2. Wrap app with provider:
```js
// src/main.jsx
import { NotificationContextProvider } from './NotificationContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <NotificationContextProvider>
    <App />
  </NotificationContextProvider>
)
```

3. Use in components:
```js
import { useNotification } from '../NotificationContext'

const SomeComponent = () => {
  const [notification, notificationDispatch] = useNotification()
  
  const showNotification = (message) => {
    notificationDispatch({ type: 'SET', payload: message })
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR' })
    }, 5000)
  }
}
```

#### Exercise 7.11: React Query and Context step 2

**Objective:** Use React Query for blog posts state.

**Steps:**
1. Install React Query:
```bash
npm install @tanstack/react-query
```

2. Setup QueryClient:
```js
// src/main.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <NotificationContextProvider>
      <App />
    </NotificationContextProvider>
  </QueryClientProvider>
)
```

3. Use in components:
```js
// src/App.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from './services/blogs'

const App = () => {
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll
  })

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  if (result.isLoading) return <div>loading...</div>
  if (result.isError) return <div>error...</div>

  const blogs = result.data

  // ... rest of component
}
```

#### Exercise 7.12: React Query and Context step 3

**Objective:** Add like and delete functionality.

**Steps:**
```js
const likeBlogMutation = useMutation({
  mutationFn: (blog) => blogService.update({
    ...blog,
    likes: blog.likes + 1
  }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['blogs'] })
  }
})

const deleteBlogMutation = useMutation({
  mutationFn: blogService.remove,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['blogs'] })
  }
})
```

#### Exercise 7.13: React Query and Context step 4

**Objective:** Use useReducer and Context for logged-in user.

**Steps:**
1. Create user context (similar to notification context):
```js
// src/UserContext.jsx
import { createContext, useReducer, useContext } from 'react'

const UserContext = createContext()

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null)

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserContextProvider')
  }
  return context
}
```

2. Use in login/logout:
```js
import { useUser } from '../UserContext'

const LoginForm = () => {
  const [user, userDispatch] = useUser()
  
  const handleLogin = async (credentials) => {
    const loggedInUser = await loginService.login(credentials)
    userDispatch({ type: 'SET', payload: loggedInUser })
  }
}
```

## Exercises 7.14-7.17: Views

These exercises are common to both Redux and React Query versions.

### Exercise 7.14: Users View

**Objective:** Implement a view displaying all users with their basic information.

**Requirements:**
- Display table/list of all users
- Show user name and number of blogs created
- Accessible via route (e.g., `/users`)

**Implementation:**

1. Create users service:
```js
// src/services/users.js
import axios from 'axios'
const baseUrl = '/api/users'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export default { getAll }
```

2. Create Users component:
```js
// src/pages/Users.jsx
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import userService from '../services/users'

const Users = () => {
  const result = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll
  })

  if (result.isLoading) return <div>loading...</div>
  if (result.isError) return <div>error...</div>

  const users = result.data

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
```

3. Add route:
```js
// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Users from './pages/Users'

<Routes>
  <Route path="/users" element={<Users />} />
  {/* other routes */}
</Routes>
```

### Exercise 7.15: Individual User View

**Objective:** Implement a view for individual users showing all their blog posts.

**Requirements:**
- Display user's name
- List all blog posts by that user
- Accessible via route (e.g., `/users/:id`)
- Handle case when user data not loaded yet

**Implementation:**

1. Create User component:
```js
// src/pages/User.jsx
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'

const User = () => {
  const id = useParams().id

  const result = useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getById(id)
  })

  if (result.isLoading) return <div>loading...</div>
  if (result.isError) return <div>error...</div>

  const user = result.data

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default User
```

2. Add route:
```js
<Route path="/users/:id" element={<User />} />
```

**Important:** Handle the case when navigating directly to a user page (data not loaded):
```js
if (!user) {
  return null // or loading spinner
}
```

### Exercise 7.16: Blog View

**Objective:** Implement a separate view for individual blog posts.

**Requirements:**
- Display full blog post details
- Show likes, author, URL
- Accessible via route (e.g., `/blogs/:id`)
- Clicking blog title in list navigates to this view
- Remove expand/collapse functionality from list (exercise 5.7)

**Implementation:**

1. Create Blog component:
```js
// src/pages/Blog.jsx
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux' // or useUser hook
import blogService from '../services/blogs'

const Blog = () => {
  const id = useParams().id
  const navigate = useNavigate()
  const user = useSelector(state => state.user) // or useUser()

  const result = useQuery({
    queryKey: ['blogs', id],
    queryFn: () => blogService.getById(id)
  })

  const likeMutation = useMutation({
    mutationFn: (blog) => blogService.update({
      ...blog,
      likes: blog.likes + 1
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs', id] })
    }
  })

  if (result.isLoading) return <div>loading...</div>
  if (result.isError) return <div>error...</div>

  const blog = result.data

  if (!blog) {
    return null
  }

  const canDelete = user && user.username === blog.user.username

  return (
    <div>
      <h2>{blog.title}</h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        {blog.likes} likes
        <button onClick={() => likeMutation.mutate(blog)}>like</button>
      </div>
      <div>added by {blog.user.name}</div>
      {canDelete && (
        <button onClick={() => handleDelete(blog.id)}>remove</button>
      )}
    </div>
  )
}

export default Blog
```

2. Update blog list to use Link:
```js
// src/pages/Blogs.jsx
import { Link } from 'react-router-dom'

const Blogs = () => {
  // ...
  return (
    <div>
      {blogs.map(blog => (
        <div key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </div>
      ))}
    </div>
  )
}
```

3. Add route:
```js
<Route path="/blogs/:id" element={<Blog />} />
```

### Exercise 7.17: Navigation

**Objective:** Implement a navigation menu for the application.

**Requirements:**
- Navigation links to main views
- Active link highlighting
- Responsive design
- Accessible from all pages

**Implementation:**

1. Create Navigation component:
```js
// src/components/Navigation.jsx
import { Link, useMatch } from 'react-router-dom'

const Navigation = () => {
  const blogsMatch = useMatch('/blogs')
  const usersMatch = useMatch('/users')

  return (
    <nav>
      <Link to="/blogs" className={blogsMatch ? 'active' : ''}>
        blogs
      </Link>
      <Link to="/users" className={usersMatch ? 'active' : ''}>
        users
      </Link>
      {/* login/logout */}
    </nav>
  )
}

export default Navigation
```

2. Or use NavLink for active styling:
```js
import { NavLink } from 'react-router-dom'

<NavLink to="/blogs" className={({ isActive }) => isActive ? 'active' : ''}>
  blogs
</NavLink>
```

3. Add to App:
```js
import Navigation from './components/Navigation'

const App = () => {
  return (
    <div>
      <Navigation />
      <Routes>
        {/* routes */}
      </Routes>
    </div>
  )
}
```

## Exercises 7.18-7.19: Comments

### Exercise 7.18: Comments, step 1

**Objective:** Display comments for blog posts (backend only).

**Requirements:**
- Display comments received from backend
- Comments are anonymous (no user association)
- Show comments on blog view

**Backend Endpoint:**
- GET `/api/blogs/:id` returns blog with comments array

**Implementation:**

1. Update Blog component to display comments:
```js
// src/pages/Blog.jsx
const Blog = () => {
  // ...
  const blog = result.data

  return (
    <div>
      {/* blog details */}
      <h3>comments</h3>
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}
```

### Exercise 7.19: Comments, step 2

**Objective:** Allow users to add comments from the frontend.

**Requirements:**
- Form to add new comment
- POST request to `/api/blogs/:id/comments`
- Update UI after adding comment

**Implementation:**

1. Add comment service method:
```js
// src/services/blogs.js
const addComment = async (id, comment) => {
  const response = await axios.post(`/api/blogs/${id}/comments`, { comment })
  return response.data
}
```

2. Update Blog component:
```js
// src/pages/Blog.jsx
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const Blog = () => {
  const [comment, setComment] = useState('')
  const queryClient = useQueryClient()

  const addCommentMutation = useMutation({
    mutationFn: (comment) => blogService.addComment(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs', id] })
      setComment('')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    addCommentMutation.mutate(comment)
  }

  return (
    <div>
      {/* blog details */}
      <h3>comments</h3>
      <form onSubmit={handleSubmit}>
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Exercises 7.20-7.21: Styles

### Exercise 7.20: Styles, step 1

**Objective:** Improve application appearance using one of the methods from the course.

**Options:**
1. **React Bootstrap** - Component library
2. **MaterialUI** - Material Design components
3. **Styled Components** - CSS-in-JS

**Implementation Examples:**

**React Bootstrap:**
```js
import { Container, Navbar, Nav, Table } from 'react-bootstrap'

const Navigation = () => {
  return (
    <Navbar bg="light">
      <Container>
        <Navbar.Brand>Blog App</Navbar.Brand>
        <Nav>
          <Nav.Link href="/blogs">blogs</Nav.Link>
          <Nav.Link href="/users">users</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  )
}
```

**MaterialUI:**
```js
import { AppBar, Toolbar, Button, Container } from '@mui/material'

const Navigation = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/blogs">
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
      </Toolbar>
    </AppBar>
  )
}
```

**Styled Components:**
```js
import styled from 'styled-components'

const Navigation = styled.nav`
  background-color: #f0f0f0;
  padding: 1rem;
  
  a {
    margin-right: 1rem;
    text-decoration: none;
    
    &.active {
      font-weight: bold;
    }
  }
`
```

### Exercise 7.21: Styles, step 2

**Objective:** Spend at least one hour styling the application.

**Focus Areas:**
- Consistent color scheme
- Typography
- Spacing and layout
- Responsive design
- Interactive elements (hover, focus states)
- Forms styling
- Tables styling
- Navigation styling

**Best Practices:**
- Use a design system or style guide
- Ensure accessibility (contrast, focus indicators)
- Test on different screen sizes
- Keep it simple and clean
- Use consistent spacing scale

## Refactoring Tips

1. **Take Baby Steps:**
   - Make small, incremental changes
   - Test after each change
   - Don't leave app broken for long

2. **Use Git:**
   - Commit frequently
   - Use branches for experiments
   - Easy to revert if needed

3. **Test Thoroughly:**
   - Test each feature after refactoring
   - Check edge cases
   - Verify all routes work

4. **Keep It Working:**
   - Don't refactor everything at once
   - Maintain functionality while refactoring
   - Add new features after refactoring is stable

## Common Patterns

### Conditional Rendering for Loading States

```js
if (result.isLoading) return <div>loading...</div>
if (result.isError) return <div>error occurred</div>
if (!data) return null
```

### Error Handling

```js
const result = useQuery({
  queryKey: ['blogs'],
  queryFn: blogService.getAll,
  retry: 1,
  onError: (error) => {
    // Handle error
  }
})
```

### Optimistic Updates

```js
const mutation = useMutation({
  mutationFn: updateBlog,
  onMutate: async (newBlog) => {
    await queryClient.cancelQueries({ queryKey: ['blogs'] })
    const previousBlogs = queryClient.getQueryData(['blogs'])
    queryClient.setQueryData(['blogs'], (old) => 
      old.map(blog => blog.id === newBlog.id ? newBlog : blog)
    )
    return { previousBlogs }
  },
  onError: (err, newBlog, context) => {
    queryClient.setQueryData(['blogs'], context.previousBlogs)
  }
})
```

## Exercises Summary

| Exercise | Topic | Difficulty |
|----------|-------|------------|
| 7.9 | Prettier Setup | Easy |
| 7.10 | Notification State | Medium |
| 7.11 | Blog State | Medium |
| 7.12 | Like/Delete | Medium |
| 7.13 | User State | Medium |
| 7.14 | Users View | Easy |
| 7.15 | User View | Medium |
| 7.16 | Blog View | Medium |
| 7.17 | Navigation | Easy |
| 7.18 | Display Comments | Easy |
| 7.19 | Add Comments | Medium |
| 7.20 | Basic Styling | Medium |
| 7.21 | Advanced Styling | Hard |

## Resources

- [Prettier Documentation](https://prettier.io/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [React Router Documentation](https://reactrouter.com/)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [MaterialUI](https://mui.com/)
- [Styled Components](https://styled-components.com/)
