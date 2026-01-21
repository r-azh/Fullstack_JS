# [Exercises 7.1.-7.3.](https://fullstackopen.com/en/part7/react_router#exercises-7-1-7-3)

Let's make a new version of the anecdote application that uses React Router.

You can take the project from this repository <https://github.com/fullstack-hy2020/routed-anecdotes> as the base of your solution.

_Start by removing the git configuration of the cloned repository, and by installing dependencies_

```bash
cd routed-anecdotes   // go to the directory of cloned repository
rm -rf .git
npm install
```

## 7.1: Routed anecdotes, step 1

Add React Router to the anecdotes application. The default view should show the list of anecdotes.

The navigation should work by clicking the links in the menu and the address bar should change when navigating between views.

**Details:**
- Install react-router-dom
- Set up BrowserRouter in main.jsx
- Create Routes for different views
- Add navigation menu with Links
- Default view shows list of anecdotes

## 7.2: Routed anecdotes, step 2

Add a view for showing a single anecdote. Navigating to the page `/anecdotes/:id` should show the anecdote with that id.

**Details:**
- Create route for `/anecdotes/:id`
- Create component to display single anecdote
- Use useParams to get anecdote id
- Link from anecdote list to individual anecdote
- Handle case when anecdote not found

## 7.3: Routed anecdotes, step 3

Use the `useNavigate` hook. If the user is created a new anecdote, the application should automatically navigate to showing the view for all anecdotes and the newly created anecdote should be highlighted for five seconds.

**Details:**
- Use useNavigate in form component
- Navigate to anecdotes list after creation
- Highlight newly created anecdote
- Remove highlight after 5 seconds
- Show notification if needed

# [Exercises 7.4.-7.8.](https://fullstackopen.com/en/part7/custom_hooks#exercises-7-4-7-8)

## 7.4: Custom hooks step 1

Let's make a custom hook called `useField` for managing the state of a form field.

The hook should return an object with the properties `type`, `value`, `onChange`, and `reset`.

**Details:**
- Create useField hook
- Accept type as parameter
- Return object with type, value, onChange, reset
- Use in form components
- Test with different input types

## 7.5: Custom hooks step 2

Spread the attributes of the `useField` hook in the form inputs.

**Details:**
- Use spread operator with useField
- Apply to all form inputs
- Verify all attributes are passed correctly
- Clean up form code

## 7.6: Custom hooks step 3

If you haven't done so already, extract the logic for communicating with the backend into its own custom hook.

**Details:**
- Create useResource hook
- Handle fetching and creating resources
- Return resources and service object
- Use in multiple components
- Support different API endpoints

## 7.7: Ultimate hooks

The code of the application responsible for communicating with the backend of the application should be moved to its own file under the directory `services`.

**Details:**
- Move API communication to services directory
- Create service modules for different resources
- Import and use services in hooks
- Keep hooks focused on state management

## 7.8: Ultimate hooks

Create a custom hook called `useCountry` for fetching country data from the REST Countries API.

The hook should take a country name as a parameter and return the country data.

**Details:**
- Create useCountry hook
- Fetch data from REST Countries API
- Handle loading and error states
- Return country data
- Use in components to display country information

# [Exercises: Extending the bloglist](https://fullstackopen.com/en/part7/exercises_extending_the_bloglist)

The exercises for styling (Bootstrap, MaterialUI, styled-components) are part of the "Extending the bloglist" exercise set. These exercises involve adding styling to the bloglist application that was built in previous parts.

## Styling Exercises (part of bloglist extension)

### Add Bootstrap or MaterialUI

Add Bootstrap or MaterialUI to the bloglist application to improve its appearance.

**Details:**
- Install react-bootstrap or @mui/material
- Add Bootstrap CSS or MaterialUI setup
- Style forms, tables, and navigation
- Use framework components throughout
- Ensure responsive design

### Styled Components

Alternatively, use styled-components to style the bloglist application.

**Details:**
- Install styled-components
- Create styled components for layout
- Style forms and buttons
- Use props for dynamic styling
- Create a cohesive design system

### Responsive Design

Ensure the application works well on mobile devices.

**Details:**
- Test on different screen sizes
- Use responsive utilities
- Mobile-friendly navigation
- Responsive tables and forms
- Touch-friendly buttons

# [Webpack Exercises](https://fullstackopen.com/en/part7/webpack)

The exercises for Webpack are part of the "Extending the bloglist" exercise set. They involve understanding how bundling works and configuring Webpack.

## Webpack Concepts

Understanding how Webpack works is important even if you use Vite or Create React App, as they use bundlers under the hood.

**Key Concepts to Understand:**
- How bundling works
- Entry points and output
- Loaders for different file types
- Development vs production modes
- Source maps for debugging
- Environment-based configuration

**Note:** These exercises are conceptual and help understand the build process. In practice, you'll likely use Vite or Create React App which handle Webpack configuration for you.

# [Class Components and Miscellaneous](https://fullstackopen.com/en/part7/class_components_miscellaneous)

The exercises for class components and miscellaneous topics are part of the "Extending the bloglist" exercise set. These exercises involve understanding legacy React patterns and best practices.

## Class Components (Legacy)

Understanding class components is important for working with legacy React code.

**Key Concepts:**
- Class component syntax
- State management with `this.state`
- Lifecycle methods
- `setState` method
- `this` binding

**Note:** For new projects, use functional components with hooks. Class components are only needed for:
- Maintaining legacy code
- Error boundaries (until functional components support them)
- Understanding existing codebases

## Code Organization

Learn different ways to organize React applications.

**Details:**
- Component-based structure
- Feature-based structure
- Domain-driven structure
- When to use each approach
- Monorepo structure

## Security

Understand common web application security risks.

**Details:**
- OWASP Top 10
- SQL/NoSQL injection prevention
- XSS protection
- Keeping dependencies updated
- Using `npm audit`
- Server-side validation
- HTTPS usage

## Current Trends

Learn about modern web development trends.

**Details:**
- TypeScript for type safety
- Server-side rendering (SSR)
- Progressive Web Apps (PWA)
- Microservices architecture
- Serverless functions
- Modern bundlers (Vite, esbuild)

# [Exercises 7.9.-7.21.: Extending the Bloglist](https://fullstackopen.com/en/part7/exercises_extending_the_bloglist)

These exercises extend the BlogList application from parts 4 and 5, applying advanced state management techniques and adding new features.

**Important Notes:**
- Many exercises require refactoring existing code
- Take baby steps - don't leave the app broken for long periods
- Exercises 7.10-7.13 have two alternative versions (Redux OR React Query/Context)
- You can skip exercises if needed, but they build on each other

## 7.9: Automatic Code Formatting

Take Prettier to use in your app and configure it to work with your editor.

**Details:**
- Install Prettier as a dev dependency
- Create `.prettierrc` configuration file
- Create `.prettierignore` file
- Add format scripts to `package.json`
- Configure editor to format on save
- Integrate with ESLint using `eslint-config-prettier`
- Format all existing code
- Test that formatting works correctly

**Key Concepts:**
- Prettier is an opinionated code formatter
- Works alongside ESLint (different purposes)
- Can format JavaScript, JSX, CSS, JSON, Markdown
- Editor integration for automatic formatting
- CI/CD integration for consistent formatting

## State Management: Redux (Exercises 7.10-7.13)

**Note:** There are two alternative versions for exercises 7.10-7.13. You can do state management using Redux OR React Query and Context. If you want to maximize learning, do both versions!

### 7.10: Redux, Step 1

Refactor the application to use Redux to manage the notification data.

**Details:**
- Install `@reduxjs/toolkit` and `react-redux`
- Create notification reducer using `createSlice`
- Configure Redux store with `configureStore`
- Wrap app with `Provider` component
- Replace notification state with Redux state
- Use `useSelector` to read notification state
- Use `useDispatch` to dispatch notification actions
- Update all components that use notifications
- Test that notifications still work correctly

### 7.11: Redux, Step 2

**Note:** This and the next two exercises are quite laborious but incredibly educational.

Store the information about blog posts in the Redux store. In this exercise, it is enough that you can see the blogs in the backend and create a new blog.

You are free to manage the state for logging in and creating new blog posts by using the internal state of React components.

**Details:**
- Create blog reducer using `createSlice`
- Add blog reducer to store
- Create async action creators using Redux Thunk
- Create `initializeBlogs` action to fetch all blogs
- Create `createBlog` action to add new blog
- Replace blog state with Redux state
- Use `useSelector` to read blogs from store
- Use `useDispatch` to dispatch blog actions
- Update components to use Redux for blogs
- Test fetching and creating blogs

### 7.12: Redux, Step 3

Expand your solution so that it is again possible to like and delete a blog.

**Details:**
- Add `updateBlog` reducer case
- Add `removeBlog` reducer case
- Create `likeBlog` async action creator
- Create `deleteBlog` async action creator
- Update blog components to use like/delete actions
- Handle optimistic updates if desired
- Test liking and deleting blogs
- Ensure UI updates correctly after actions

### 7.13: Redux, Step 4

Store the information about the signed-in user in the Redux store.

**Details:**
- Create user reducer using `createSlice`
- Add user reducer to store
- Create `setUser` and `clearUser` actions
- Replace user state with Redux state
- Update login component to dispatch user actions
- Update logout to clear user from store
- Use `useSelector` to read user state
- Update components that check user authentication
- Test login and logout functionality

## State Management: React Query and Context (Exercises 7.10-7.13)

**Note:** There are two alternative versions for exercises 7.10-7.13. You can do state management using Redux OR React Query and Context. If you want to maximize learning, do both versions!

### 7.10: React Query and Context step 1

Refactor the app to use the `useReducer`-hook and context to manage the notification data.

**Details:**
- Create `NotificationContext` using `createContext`
- Create `NotificationContextProvider` component
- Use `useReducer` for notification state management
- Create notification reducer with SET and CLEAR actions
- Wrap app with `NotificationContextProvider`
- Create custom `useNotification` hook
- Replace notification state with context
- Update all components to use notification context
- Test that notifications still work correctly

### 7.11: React Query and Context step 2

Use React Query to manage the state for blog posts. For this exercise, it is sufficient that the application displays existing blogs and that the creation of a new blog is successful.

You are free to manage the state for logging in and creating new blog posts by using the internal state of React components.

**Details:**
- Install `@tanstack/react-query`
- Create `QueryClient` and wrap app with `QueryClientProvider`
- Use `useQuery` hook to fetch blogs
- Use `useMutation` hook to create new blogs
- Use `useQueryClient` to invalidate queries after mutations
- Handle loading and error states
- Replace blog state with React Query
- Update components to use React Query hooks
- Test fetching and creating blogs

### 7.12: React Query and Context step 3

Expand your solution so that it is again possible to like and delete a blog.

**Details:**
- Create `useMutation` for liking blogs
- Create `useMutation` for deleting blogs
- Invalidate queries after successful mutations
- Update blog components to use like/delete mutations
- Handle optimistic updates if desired
- Test liking and deleting blogs
- Ensure UI updates correctly after actions

### 7.13: React Query and Context step 4

Use the `useReducer`-hook and context to manage the data for the logged in user.

**Details:**
- Create `UserContext` using `createContext`
- Create `UserContextProvider` component
- Use `useReducer` for user state management
- Create user reducer with SET and CLEAR actions
- Wrap app with `UserContextProvider`
- Create custom `useUser` hook
- Replace user state with context
- Update login component to use user context
- Update logout to clear user from context
- Test login and logout functionality

## Views (Exercises 7.14-7.17)

The rest of the tasks are common to both the Redux and React Query versions.

### 7.14: Users view

Implement a view to the application that displays all of the basic information related to users.

**Details:**
- Create users service for API calls
- Create Users component/page
- Use React Query or Redux to fetch users
- Display users in a table or list
- Show user name and number of blogs created
- Add route for `/users`
- Add link to navigation menu
- Handle loading and error states
- Make user names clickable (link to individual user view)

### 7.15: Individual User View

Implement a view for individual users that displays all of the blog posts added by that user.

You can access this view by clicking the name of the user in the view that lists all users.

**Details:**
- Create User component/page
- Use `useParams` to get user id from URL
- Fetch individual user data
- Display user's name
- List all blog posts by that user
- Add route for `/users/:id`
- Link blog titles to individual blog view
- Handle loading and error states
- **Important:** Handle case when navigating directly to user page (data not loaded yet) - use conditional rendering to return `null` if user is undefined

### 7.16: Blog View

Implement a separate view for blog posts. Users should be able to access this view by clicking the name of the blog post in the view that lists all of the blog posts.

After you're done with this exercise, the functionality that was implemented in exercise 5.7 is no longer necessary. Clicking a blog post no longer needs to expand the item in the list and display the details of the blog post.

**Details:**
- Create Blog component/page
- Use `useParams` to get blog id from URL
- Fetch individual blog data
- Display full blog details (title, author, URL, likes)
- Show like button and functionality
- Show delete button (only if user owns the blog)
- Add route for `/blogs/:id`
- Update blog list to use `Link` instead of expand/collapse
- Remove expand/collapse functionality from list
- Handle loading and error states
- Handle case when blog not found

### 7.17: Navigation

Implement a navigation menu for the application.

**Details:**
- Create Navigation component
- Add links to main views (blogs, users)
- Add login/logout functionality
- Use `NavLink` or `useMatch` for active link styling
- Make navigation accessible from all pages
- Style navigation appropriately
- Ensure responsive design
- Add to App component

## Comments (Exercises 7.18-7.19)

### 7.18: Comments, step 1

Implement the functionality for commenting the blog posts. Comments should be anonymous, meaning that they are not associated with the user who left the comment.

In this exercise, it is enough for the frontend to only display the comments that the application receives from the backend.

An appropriate mechanism for adding comments to a blog post would be an HTTP POST request to the `api/blogs/:id/comments` endpoint.

**Details:**
- Update Blog component to display comments
- Comments are received from backend in blog object
- Display comments in a list
- Comments are anonymous (no user association)
- Handle case when blog has no comments
- Style comments appropriately

### 7.19: Comments, step 2

Extend your application so that users can add comments to blog posts from the frontend.

**Details:**
- Add comment form to Blog component
- Create service method to add comments (POST to `/api/blogs/:id/comments`)
- Use `useMutation` (React Query) or async action (Redux) to add comments
- Update UI after adding comment (invalidate queries or dispatch action)
- Clear form after successful submission
- Handle errors when adding comments
- Show loading state while adding comment
- Update comments list immediately after adding

## Styles (Exercises 7.20-7.21)

### 7.20: Styles, step 1

Improve the appearance of your application by applying one of the methods shown in the course material.

**Details:**
- Choose one styling approach:
  - React Bootstrap (install `react-bootstrap` and Bootstrap CSS)
  - MaterialUI (install `@mui/material` and `@emotion`)
  - Styled Components (install `styled-components`)
- Style navigation menu
- Style forms (login, blog creation, comments)
- Style tables/lists (blogs, users)
- Style buttons and interactive elements
- Ensure consistent design throughout
- Test on different screen sizes

### 7.21: Styles, step 2

You can mark this exercise as finished if you use an hour or more for styling your application.

**Details:**
- Spend at least one hour on styling
- Create a cohesive design system
- Ensure consistent color scheme
- Improve typography
- Add proper spacing and layout
- Ensure responsive design
- Add hover and focus states
- Improve accessibility (contrast, focus indicators)
- Polish all UI elements
- Test thoroughly on different devices

This was the last exercise for this part of the course and it's time to push your code to GitHub and mark all of your finished exercises to the exercise submission system.
