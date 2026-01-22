# Part 10 Exercises

This file contains exercises for Part 10: React Native as they are covered in the course material.

## Introduction

Part 10 covers React Native, a framework for building native mobile applications using React. The exercises will be added as we progress through the sections.

**Important Notes:**
- All exercises must be submitted to a **single GitHub repository**
- Exercises are submitted to a **different course instance** than parts 0-9
- Parts 1-4 in submission system = sections a-d in this part
- Complete at least **25 exercises** to earn **2 credits**
- Develop application as material progresses (don't wait for exercises)

# [Exercises 10.1-10.2.: Introduction to React Native](https://fullstackopen.com/en/part10/introduction_to_react_native#exercise-10-1)

## 10.1: Initializing the application

Initialize your application with Expo command-line interface and set up the development environment either using an emulator or Expo's mobile app. It is recommended to try both and find out which development environment is the most suitable for you. The name of the application is not that relevant. You can, for example, go with `rate-repository-app`.

To submit this exercise and all future exercises you need to create a new GitHub repository. The name of the repository can be for example the name of the application you initialized with `expo init`. If you decide to create a private repository, add GitHub user mluukkai as a repository collaborator. The collaborator status is only used for verifying your submissions.

Now that the repository is created, run `git init` within your application's root directory to make sure that the directory is initialized as a Git repository. Next, to add the created repository as the remote run `git remote add origin git@github.com:<YOURGITHUBUSERNAME>/<NAMEOFYOUR_REPOSITORY>.git` (remember to replace the placeholder values in the command). Finally, just commit and push your changes into the repository and you are all done.

**Details:**
- Initialize Expo application:
  ```bash
  npx create-expo-app rate-repository-app --template expo-template-blank@sdk-50
  ```
- Install additional dependencies:
  ```bash
  npx expo install react-native-web@~0.19.6 react-dom@18.2.0 @expo/metro-runtime@~3.1.1
  ```
- Set up development environment:
  - **Option 1: Android Emulator**
    - Install Android Studio
    - Set up Android emulator
    - Run `npm start`
    - Press "a" to open in Android emulator
  - **Option 2: iOS Simulator** (macOS only)
    - Install Xcode
    - Set up iOS simulator
    - Run `npm start`
    - Press "i" to open in iOS simulator
  - **Option 3: Expo Mobile App**
    - Install Expo app on mobile device
    - Ensure device and computer on same Wi-Fi network
    - Run `npm start`
    - Scan QR code with Expo app (Android) or Camera app (iOS)
- Create GitHub repository:
  - Create new repository (can be private)
  - If private, add `mluukkai` as collaborator
- Initialize Git:
  ```bash
  git init
  git remote add origin git@github.com:<YOURGITHUBUSERNAME>/<NAMEOFYOUR_REPOSITORY>.git
  git add .
  git commit -m "Initial commit"
  git push -u origin main
  ```
- Test application:
  - Verify app runs in chosen environment
  - Make small change to `App.js`
  - Verify hot reloading works
- Submit exercise:
  - Push code to GitHub
  - Mark exercise as complete in submission system (Part 1)

## 10.2: Setting up the ESLint

Set up ESLint in your project so that you can perform linter checks by running `npm run lint`. To get most of linting it is also recommended to integrate ESLint with your editor.

**Details:**
- Install ESLint dependencies:
  ```bash
  npm install --save-dev eslint @babel/eslint-parser eslint-plugin-react eslint-plugin-react-native
  ```
- Create `.eslintrc.json` file:
  ```json
  {
    "plugins": ["react", "react-native"],
    "settings": {
      "react": {
        "version": "detect"
      }
    },
    "extends": ["eslint:recommended", "plugin:react/recommended"],
    "parser": "@babel/eslint-parser",
    "env": {
      "react-native/react-native": true
    },
    "rules": {
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off"
    }
  }
  ```
- Add lint script to `package.json`:
  ```json
  {
    "scripts": {
      "lint": "eslint ./src/**/*.{js,jsx} App.js --no-error-on-unmatched-pattern"
    }
  }
  ```
- Test linting:
  ```bash
  npm run lint
  ```
- Integrate with editor (VSCode):
  - Open Extensions
  - Search for "ESLint"
  - Install ESLint extension
  - Enable extension
  - Verify linting works in editor
- Fix any linting errors:
  - Review linting output
  - Fix errors in `App.js` if any
  - Verify no errors remain
- Commit changes:
  ```bash
  git add .
  git commit -m "Add ESLint configuration"
  git push
  ```
- Submit exercise:
  - Mark exercise as complete in submission system (Part 1)

# [Exercises 10.3-10.10.: React Native Basics](https://fullstackopen.com/en/part10/react_native_basics#exercise-10-3)

## 10.3: The reviewed repositories list

In this exercise, we will implement the first version of the reviewed repositories list. The list should contain the repository's full name, description, language, number of forks, number of stars, rating average and number of reviews. Luckily React Native provides a handy component for displaying a list of data, which is the FlatList component.

Implement components `RepositoryList` and `RepositoryItem` in the `components` directory's files `RepositoryList.jsx` and `RepositoryItem.jsx`. The `RepositoryList` component should render the `FlatList` component and `RepositoryItem` a single item on the list (hint: use the `FlatList` component's `renderItem` prop). Use this as the basis for the `RepositoryList.jsx` file:

```javascript
import { FlatList, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
});

const repositories = [
  {
    id: 'jaredpalmer.formik',
    fullName: 'jaredpalmer/formik',
    description: 'Build forms in React, without the tears',
    language: 'TypeScript',
    forksCount: 1589,
    stargazersCount: 21553,
    ratingAverage: 88,
    reviewCount: 4,
    ownerAvatarUrl: 'https://avatars2.githubusercontent.com/u/4060187?v=4',
  },
  {
    id: 'rails.rails',
    fullName: 'rails/rails',
    description: 'Ruby on Rails',
    language: 'Ruby',
    forksCount: 18349,
    stargazersCount: 45377,
    ratingAverage: 100,
    reviewCount: 2,
    ownerAvatarUrl: 'https://avatars1.githubusercontent.com/u/4223?v=4',
  },
  {
    id: 'django.django',
    fullName: 'django/django',
    description: 'The Web framework for perfectionists with deadlines.',
    language: 'Python',
    forksCount: 21015,
    stargazersCount: 48496,
    ratingAverage: 73,
    reviewCount: 5,
    ownerAvatarUrl: 'https://avatars2.githubusercontent.com/u/27804?v=4',
  },
  {
    id: 'reduxjs.redux',
    fullName: 'reduxjs/redux',
    description: 'Predictable state container for JavaScript apps',
    language: 'TypeScript',
    forksCount: 13902,
    stargazersCount: 52869,
    ratingAverage: 0,
    reviewCount: 0,
    ownerAvatarUrl: 'https://avatars3.githubusercontent.com/u/13142323?v=4',
  },
];

const ItemSeparator = () => <View style={styles.separator} />;

const RepositoryList = () => {
  return (
    <FlatList
      data={repositories}
      ItemSeparatorComponent={ItemSeparator}
      // other props
    />
  );
};

export default RepositoryList;
```

_Do not_ alter the contents of the `repositories` variable, it should contain everything you need to complete this exercise. Render the `RepositoryList` component in the `Main` component which we previously added to the `Main.jsx` file.

**Details:**
- Create `src/components/RepositoryList.jsx`:
  - Import `FlatList`, `View`, `StyleSheet`
  - Define `repositories` array (don't modify)
  - Create `ItemSeparator` component
  - Create `RepositoryList` component:
    - Use `FlatList` component
    - Set `data` prop to `repositories`
    - Set `ItemSeparatorComponent` to `ItemSeparator`
    - Add `renderItem` prop to render `RepositoryItem`
    - Add `keyExtractor` prop for unique keys
- Create `src/components/RepositoryItem.jsx`:
  - Accept `item` prop
  - Display repository information:
    - Full name
    - Description
    - Language
    - Forks count
    - Stars count
    - Rating average
    - Review count
  - Use `Text` component for text
  - Use `View` for layout
- Update `src/components/Main.jsx`:
  - Import `RepositoryList`
  - Render `RepositoryList` component
- Test the list:
  - Verify repositories display
  - Verify separators between items
  - Verify scrolling works

## 10.4: The app bar

We will soon need to navigate between different views in our application. That is why we need an app bar to display tabs for switching between different views. Create a file `AppBar.jsx` in the `components` folder with the following content:

```javascript
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    // ...
  },
  // ...
});

const AppBar = () => {
  return <View style={styles.container}>{/* ... */}</View>;
};

export default AppBar;
```

Now that the `AppBar` component will prevent the status bar from overlapping the content, you can remove the `marginTop` style we added for the `Main` component earlier in the `Main.jsx` file. The `AppBar` component should currently contain a tab with the text "Repositories". Make the tab pressable by using the Pressable component but you don't have to handle the `onPress` event in any way. Add the `AppBar` component to the `Main` component so that it is the uppermost component on the screen.

**Details:**
- Create `src/components/AppBar.jsx`:
  - Import `View`, `StyleSheet`, `Constants`
  - Create styles with `paddingTop: Constants.statusBarHeight`
  - Add background color (e.g., `#24292e`)
  - Create tab with "Repositories" text
  - Use `Pressable` component for tab
  - Style appropriately
- Update theme configuration:
  - Add app bar background color to theme
  - Use theme color in `AppBar` component
- Create `AppBarTab` component (optional but recommended):
  - Separate component for tabs
  - Makes it easy to add more tabs
- Update `src/components/Main.jsx`:
  - Remove `marginTop` from container style
  - Import `AppBar`
  - Add `AppBar` as first component
- Test app bar:
  - Verify app bar displays
  - Verify status bar spacing correct
  - Verify tab is pressable

## 10.5: Polished reviewed repositories list

The current version of the reviewed repositories list looks quite grim. Modify the `RepositoryItem` component so that it also displays the repository author's avatar image. You can implement this by using the Image component. Counts, such as the number of stars and forks, larger than or equal to 1000 should be displayed in thousands with the precision of one decimal and with a "k" suffix. This means that for example fork count of 8439 should be displayed as "8.4k". Also, polish the overall look of the component so that the reviewed repositories list looks something like the example.

**Details:**
- Update `RepositoryItem` component:
  - Import `Image` from `react-native`
  - Add avatar image:
    - Use `Image` component
    - Set `source={{ uri: item.ownerAvatarUrl }}`
    - Style appropriately (width, height, borderRadius)
  - Create `formatCount` function:
    ```javascript
    const formatCount = (count) => {
      if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}k`;
      }
      return count.toString();
    };
    ```
  - Apply formatting to:
    - Stars count
    - Forks count
  - Polish styling:
    - Add background colors
    - Improve spacing
    - Add language tag styling
    - Use theme colors
- Update theme:
  - Add `mainBackground` color (e.g., `#e1e4e8`)
  - Add language tag background color (use `primary`)
- Split into smaller components (optional):
  - Create `StatItem` component for statistics
  - Create `LanguageTag` component
- Test polished list:
  - Verify avatar images display
  - Verify count formatting works
  - Verify styling looks good
  - Verify language tags styled correctly

## 10.6: The sign-in view

We will soon implement a form, that a user can use to _sign in_ to our application. Before that, we must implement a view that can be accessed from the app bar. Create a file `SignIn.jsx` in the `components` directory with the following content:

```javascript
import Text from './Text';

const SignIn = () => {
  return <Text>The sign-in view</Text>;
};

export default SignIn;
```

Set up a route for this `SignIn` component in the `Main` component. Also, add a tab with the text "Sign in" to the app bar next to the "Repositories" tab. Users should be able to navigate between the two views by pressing the tabs (hint: you can use the React router's Link component).

**Details:**
- Install react-router-native:
  ```bash
  npm install react-router-native
  ```
- Update `App.js`:
  - Import `NativeRouter` from `react-router-native`
  - Wrap `Main` component with `NativeRouter`
- Create `src/components/SignIn.jsx`:
  - Import `Text` component
  - Return placeholder text
- Update `src/components/Main.jsx`:
  - Import `Route`, `Routes`, `Navigate` from `react-router-native`
  - Add route for `/signin`:
    ```javascript
    <Route path="/signin" element={<SignIn />} />
    ```
  - Update catch-all route if needed
- Update `src/components/AppBar.jsx`:
  - Import `Link` from `react-router-native`
  - Update `AppBarTab` to use `Link`:
    ```javascript
    <Link to={to}>
      <View style={styles.tab}>
        <Text>{children}</Text>
      </View>
    </Link>
    ```
  - Add "Sign in" tab:
    ```javascript
    <AppBarTab to="/signin">Sign in</AppBarTab>
    ```
- Test navigation:
  - Press "Repositories" tab → goes to `/`
  - Press "Sign in" tab → goes to `/signin`
  - Verify navigation works

## 10.7: Scrollable app bar

As we are adding more tabs to our app bar, it is a good idea to allow horizontal scrolling once the tabs won't fit the screen. The ScrollView component is just the right component for the job.

Wrap the tabs in the `AppBar` component's tabs with a `ScrollView` component:

```javascript
const AppBar = () => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal>{/* ... */}</ScrollView>
    </View>
  );
};
```

Setting the horizontal prop `true` will cause the `ScrollView` component to scroll horizontally once the content won't fit the screen. Note that, you will need to add suitable style properties to the `ScrollView` component so that the tabs will be laid in a _row_ inside the flex container.

**Details:**
- Update `src/components/AppBar.jsx`:
  - Import `ScrollView` from `react-native`
  - Wrap tabs with `ScrollView`:
    ```javascript
    <ScrollView horizontal style={styles.scrollView}>
      {/* tabs */}
    </ScrollView>
    ```
  - Add styles for `ScrollView`:
    ```javascript
    scrollView: {
      flexDirection: 'row',
    },
    ```
- Test scrolling:
  - Add multiple tabs temporarily
  - Verify horizontal scrolling works
  - Remove extra tabs
  - Verify layout still works

## 10.8: The sign-in form

Implement a sign-in form to the `SignIn` component we added earlier in the `SignIn.jsx` file. The sign-in form should include two text fields, one for the username and one for the password. There should also be a button for submitting the form. You don't need to implement an `onSubmit` callback function, it is enough that the form values are logged using `console.log` when the form is submitted:

```javascript
const onSubmit = (values) => {
  console.log(values);
};
```

The first step is to install Formik:

```bash
npm install formik
```

You can use the `secureTextEntry` prop in the `TextInput` component to obscure the password input.

**Details:**
- Install Formik:
  ```bash
  npm install formik
  ```
- Update `src/components/SignIn.jsx`:
  - Import `useFormik` from `formik`
  - Import `TextInput`, `Pressable` from `react-native`
  - Create form with Formik:
    ```javascript
    const formik = useFormik({
      initialValues: {
        username: '',
        password: '',
      },
      onSubmit: (values) => {
        console.log(values);
      },
    });
    ```
  - Add username `TextInput`:
    - `placeholder="Username"`
    - `value={formik.values.username}`
    - `onChangeText={formik.handleChange('username')}`
  - Add password `TextInput`:
    - `placeholder="Password"`
    - `value={formik.values.password}`
    - `onChangeText={formik.handleChange('password')}`
    - `secureTextEntry` prop
  - Add submit button:
    - Use `Pressable` component
    - `onPress={formik.handleSubmit}`
  - Style form appropriately
- Test form:
  - Enter username and password
  - Submit form
  - Verify values logged to console
  - Verify password is obscured

## 10.9: Validating the sign-in form

Validate the sign-in form so that both username and password fields are required. Note that the `onSubmit` callback implemented in the previous exercise, _should not be called_ if the form validation fails.

The current implementation of the `TextInput` component should display an error message if a touched field has an error. Emphasize this error message by giving it a red color.

On top of the red error message, give an invalid field a visual indication of an error by giving it a red border color.

**Details:**
- Install Yup:
  ```bash
  npm install yup
  ```
- Update `src/components/SignIn.jsx`:
  - Import `* as yup from 'yup'`
  - Create validation schema:
    ```javascript
    const validationSchema = yup.object().shape({
      username: yup.string().required('Username is required'),
      password: yup.string().required('Password is required'),
    });
    ```
  - Add `validationSchema` to `useFormik`:
    ```javascript
    const formik = useFormik({
      initialValues: { username: '', password: '' },
      validationSchema,
      onSubmit: (values) => { console.log(values); },
    });
    ```
  - Add `onBlur` handlers:
    - `onBlur={formik.handleBlur('username')}`
    - `onBlur={formik.handleBlur('password')}`
  - Display error messages:
    ```javascript
    {formik.touched.username && formik.errors.username && (
      <Text style={{ color: '#d73a4a' }}>{formik.errors.username}</Text>
    )}
    ```
  - Add error styling to inputs:
    ```javascript
    style={[
      styles.input,
      formik.touched.username && formik.errors.username && styles.inputError,
    ]}
    ```
  - Add `inputError` style:
    ```javascript
    inputError: {
      borderColor: '#d73a4a',
    },
    ```
- Update theme:
  - Add error color: `error: '#d73a4a'`
- Test validation:
  - Submit empty form → should not call onSubmit
  - Touch field and leave empty → should show error
  - Enter value → error should disappear
  - Verify red border on invalid fields
  - Verify red error messages

## 10.10: A platform-specific font

Currently, the font family of our application is set to `System` in the theme configuration located in the `theme.js` file. Instead of the `System` font, use a platform-specific Sans-serif font. On the Android platform, use the `Roboto` font and on the iOS platform, use the `Arial` font. The default font can be `System`.

**Details:**
- Update `src/theme.js`:
  - Import `Platform` from `react-native`
  - Update `fonts.main`:
    ```javascript
    fonts: {
      main: Platform.select({
        android: 'Roboto',
        ios: 'Arial',
        default: 'System',
      }),
    },
    ```
- Test platform-specific fonts:
  - Test on Android → should use Roboto
  - Test on iOS → should use Arial
  - Test on web → should use System
- Commit changes:
  ```bash
  git add .
  git commit -m "Add platform-specific fonts"
  git push
  ```
- Submit exercise:
  - Mark exercise as complete in submission system (Part 2)

# [Exercises 10.11-10.16.: Communicating with Server](https://fullstackopen.com/en/part10/communicating_with_server#exercise-10-11)

## 10.11: Fetching repositories with Apollo Client

We want to replace the Fetch API implementation in the `useRepositories` hook with a GraphQL query. Open the Apollo Sandbox at `http://localhost:4000` and take a look at the documentation next to the operations editor. Look up the `repositories` query. The query has some arguments, however, all of these are optional so you don't need to specify them. In the Apollo Sandbox form a query for fetching the repositories with the fields you are currently displaying in the application. The result will be paginated and it contains the up to first 30 results by default. For now, you can ignore the pagination entirely.

Once the query is working in the Apollo Sandbox, use it to replace the Fetch API implementation in the `useRepositories` hook. This can be achieved using the useQuery hook. The `gql` template literal tag can be imported from the `@apollo/client` library as instructed earlier. Consider using the structure recommended earlier for the GraphQL related code. To avoid future caching issues, use the `cache-and-network` fetch policy in the query.

**Details:**
- Set up rate-repository-api server:
  - Clone/fork rate-repository-api repository
  - Follow setup instructions in README
  - Start server (default port 4000 for GraphQL)
- Open Apollo Sandbox:
  - Navigate to `http://localhost:4000`
  - Check documentation for `repositories` query
  - Test query with required fields
- Install Apollo Client:
  ```bash
  npm install @apollo/client graphql
  npm install @expo/metro-config@0.17.4
  ```
- Configure Metro bundler:
  - Create `metro.config.js`:
    ```javascript
    const { getDefaultConfig } = require('@expo/metro-config');
    const defaultConfig = getDefaultConfig(__dirname);
    defaultConfig.resolver.sourceExts.push('cjs');
    module.exports = defaultConfig;
    ```
  - Restart Expo: `npx expo start --clear`
- Create GraphQL structure:
  - Create `src/graphql/` directory
  - Create `src/graphql/fragments.js`:
    ```javascript
    import { gql } from '@apollo/client';
    export const REPOSITORY_FRAGMENT = gql`
      fragment RepositoryDetails on Repository {
        id
        fullName
        description
        language
        forksCount
        stargazersCount
        ratingAverage
        reviewCount
        ownerAvatarUrl
      }
    `;
    ```
  - Create `src/graphql/queries.js`:
    ```javascript
    import { gql } from '@apollo/client';
    import { REPOSITORY_FRAGMENT } from './fragments';
    export const GET_REPOSITORIES = gql`
      query {
        repositories {
          edges {
            node {
              ...RepositoryDetails
            }
          }
        }
      }
      ${REPOSITORY_FRAGMENT}
    `;
    ```
- Create Apollo Client:
  - Create `src/utils/apolloClient.js`:
    ```javascript
    import { ApolloClient, InMemoryCache } from '@apollo/client';
    const createApolloClient = () => {
      return new ApolloClient({
        uri: 'http://192.168.1.33:4000/graphql', // Replace with your IP
        cache: new InMemoryCache(),
      });
    };
    export default createApolloClient;
    ```
- Update `App.js`:
  - Import `ApolloProvider` from `@apollo/client/react`
  - Import `createApolloClient`
  - Create client instance
  - Wrap app with `ApolloProvider`
- Update `useRepositories` hook:
  - Remove Fetch API code
  - Import `useQuery` from `@apollo/client/react`
  - Import `GET_REPOSITORIES` query
  - Use `useQuery` with `fetchPolicy: 'cache-and-network'`
  - Extract repositories from query result
  - Return repositories, loading, error
- Test implementation:
  - Verify repositories load from GraphQL
  - Verify no changes needed in `RepositoryList` component
  - Check Expo logs for any errors

## 10.12: Environment variables

Instead of the hardcoded Apollo Server's URL, use an environment variable defined in the `.env` file when initializing the Apollo Client. You can name the environment variable for example `APOLLO_URI`.

_Do not_ try to access environment variables like `process.env.APOLLO_URI` outside the `app.config.js` file. Instead use the `Constants.expoConfig.extra` object like in the previous example. In addition, do not import the dotenv library outside the `app.config.js` file or you will most likely face errors.

**Details:**
- Install dotenv:
  ```bash
  npm install dotenv
  ```
- Convert `app.json` to `app.config.js`:
  - Rename `app.json` to `app.config.js`
  - Convert JSON to JavaScript export:
    ```javascript
    export default {
      name: 'rate-repository-app',
      // ... rest of config
      extra: {
        env: process.env.ENV,
        apolloUri: process.env.APOLLO_URI,
      },
    };
    ```
  - Import dotenv at top:
    ```javascript
    import 'dotenv/config';
    ```
- Create `.env` file:
  ```text
  ENV=development
  APOLLO_URI=http://192.168.1.33:4000/graphql
  ```
  - Replace IP address with your own
- Update `src/utils/apolloClient.js`:
  - Import `Constants` from `expo-constants`
  - Get `apolloUri` from `Constants.expoConfig.extra`
  - Use in Apollo Client configuration:
    ```javascript
    const { apolloUri } = Constants.expoConfig.extra;
    return new ApolloClient({
      uri: apolloUri,
      cache: new InMemoryCache(),
    });
    ```
- Restart Expo:
  - May need to clear cache: `npx expo start --clear`
  - Verify configuration loads correctly
- Test:
  - Verify Apollo Client connects to server
  - Verify queries work correctly
  - Check logs for any errors

## 10.13: The sign in form mutation

The current implementation of the sign in form doesn't do much with the submitted user's credentials. Let's do something about that in this exercise. First, read the rate-repository-api server's authentication documentation and test the provided queries and mutations in the Apollo Sandbox. If the database doesn't have any users, you can populate the database with some seed data. Instructions for this can be found in the getting started section of the README.

Once you have figured out how the authentication works, create a file `useSignIn.js` file in the `hooks` directory. In that file implement a `useSignIn` hook that sends the `authenticate` mutation using the useMutation hook. Note that the `authenticate` mutation has a _single_ argument called `credentials`, which is of type `AuthenticateInput`. This input type contains `username` and `password` fields.

The return value of the hook should be a tuple `[signIn, result]` where `result` is the mutations result as it is returned by the `useMutation` hook and `signIn` a function that runs the mutation with a `{ username, password }` object argument.

**Details:**
- Read authentication documentation:
  - Check rate-repository-api README
  - Test `authenticate` mutation in Apollo Sandbox
  - Populate database with seed data if needed
- Create mutation file:
  - Create `src/graphql/mutations.js`:
    ```javascript
    import { gql } from '@apollo/client';
    export const AUTHENTICATE = gql`
      mutation authenticate($credentials: AuthenticateInput!) {
        authenticate(credentials: $credentials) {
          accessToken
        }
      }
    `;
    ```
- Create `useSignIn` hook:
  - Create `src/hooks/useSignIn.js`
  - Import `useMutation` from `@apollo/client/react`
  - Import `AUTHENTICATE` mutation
  - Implement hook:
    ```javascript
    const useSignIn = () => {
      const [mutate, result] = useMutation(AUTHENTICATE);
      const signIn = async ({ username, password }) => {
        const { data } = await mutate({
          variables: {
            credentials: {
              username,
              password,
            },
          },
        });
        return data;
      };
      return [signIn, result];
    };
    ```
- Update `SignIn` component:
  - Import `useSignIn` hook
  - Call hook: `const [signIn] = useSignIn();`
  - Update `onSubmit`:
    ```javascript
    const onSubmit = async (values) => {
      try {
        const { data } = await signIn({
          username: values.username,
          password: values.password,
        });
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    };
    ```
- Test sign in:
  - Submit form with valid credentials
  - Verify access token logged to console
  - Test with invalid credentials
  - Verify error handling works

## 10.14: Storing the access token step1

Now that we can obtain the access token we need to store it. Create a file `authStorage.js` in the `utils` directory with the following content and implement the methods.

**Details:**
- Install AsyncStorage:
  ```bash
  npx expo install @react-native-async-storage/async-storage
  ```
- Create `src/utils/authStorage.js`:
  ```javascript
  import AsyncStorage from '@react-native-async-storage/async-storage';
  class AuthStorage {
    constructor(namespace = 'auth') {
      this.namespace = namespace;
    }
    async getAccessToken() {
      const rawToken = await AsyncStorage.getItem(
        `${this.namespace}:accessToken`
      );
      return rawToken ? JSON.parse(rawToken) : null;
    }
    async setAccessToken(accessToken) {
      await AsyncStorage.setItem(
        `${this.namespace}:accessToken`,
        JSON.stringify(accessToken)
      );
    }
    async removeAccessToken() {
      await AsyncStorage.removeItem(`${this.namespace}:accessToken`);
    }
  }
  export default AuthStorage;
  ```
- Test storage:
  - Create instance: `const authStorage = new AuthStorage();`
  - Test storing token: `await authStorage.setAccessToken('test-token');`
  - Test retrieving token: `const token = await authStorage.getAccessToken();`
  - Test removing token: `await authStorage.removeAccessToken();`
  - Verify all methods work correctly

## 10.15: Storing the access token step2

Improve the `useSignIn` hook so that it stores the user's access token retrieved from the `authenticate` mutation. The return value of the hook should not change. The only change you should make to the `SignIn` component is that you should redirect the user to the reviewed repositories list view after a successful sign in. You can achieve this by using the useNavigate hook.

After the `authenticate` mutation has been executed and you have stored the user's access token to the storage, you should reset the Apollo Client's store. This will clear the Apollo Client's cache and re-execute all active queries. You can do this by using the Apollo Client's resetStore method. You can access the Apollo Client in the `useSignIn` hook using the useApolloClient hook. Note that the order of the execution is crucial and should be the following:

```javascript
const { data } = await mutate(/* options */);
await authStorage.setAccessToken(/* access token from the data */);
apolloClient.resetStore();
```

**Details:**
- Create AuthStorageContext:
  - Create `src/contexts/AuthStorageContext.js`:
    ```javascript
    import { createContext } from 'react';
    const AuthStorageContext = createContext();
    export default AuthStorageContext;
    ```
- Create `useAuthStorage` hook:
  - Create `src/hooks/useAuthStorage.js`:
    ```javascript
    import { useContext } from 'react';
    import AuthStorageContext from '../contexts/AuthStorageContext';
    const useAuthStorage = () => {
      return useContext(AuthStorageContext);
    };
    export default useAuthStorage;
    ```
- Update `App.js`:
  - Import `AuthStorage` and `AuthStorageContext`
  - Create `authStorage` instance
  - Pass to `createApolloClient(authStorage)`
  - Wrap app with `AuthStorageContext.Provider`:
    ```javascript
    <AuthStorageContext.Provider value={authStorage}>
      <Main />
    </AuthStorageContext.Provider>
    ```
- Update `createApolloClient`:
  - Accept `authStorage` parameter
  - Import `createHttpLink` and `setContext`
  - Create `httpLink` with URI
  - Create `authLink` with `setContext`:
    ```javascript
    const authLink = setContext(async (_, { headers }) => {
      try {
        const accessToken = await authStorage.getAccessToken();
        return {
          headers: {
            ...headers,
            authorization: accessToken ? `Bearer ${accessToken}` : '',
          },
        };
      } catch (e) {
        return { headers };
      }
    });
    ```
  - Return Apollo Client with `authLink.concat(httpLink)`
- Update `useSignIn` hook:
  - Import `useApolloClient` from `@apollo/client/react`
  - Import `useAuthStorage` hook
  - Get `authStorage` and `apolloClient`
  - Update `signIn` function:
    ```javascript
    const signIn = async ({ username, password }) => {
      const { data } = await mutate({
        variables: {
          credentials: { username, password },
        },
      });
      await authStorage.setAccessToken(data.authenticate.accessToken);
      await apolloClient.resetStore();
      return data;
    };
    ```
- Update `SignIn` component:
  - Import `useNavigate` from `react-router-native`
  - Call `navigate` hook
  - Navigate to `/` after successful sign in:
    ```javascript
    const onSubmit = async (values) => {
      try {
        await signIn(values);
        navigate('/');
      } catch (e) {
        console.log(e);
      }
    };
    ```
- Test complete flow:
  - Sign in with valid credentials
  - Verify token stored
  - Verify redirect to repositories list
  - Verify Apollo cache reset
  - Verify authenticated queries work

## 10.16: Sign out

The final step in completing the sign in feature is to implement a sign out feature. The `me` query can be used to check the authenticated user's information. If the query's result is `null`, that means that the user is not authenticated. Open the Apollo Sandbox and run the `me` query. You will probably end up with the `null` result. This is because the Apollo Sandbox is not authenticated, meaning that it doesn't send a valid access token with the request. Revise the authentication documentation and retrieve an access token using the `authenticate` mutation. Use this access token in the `Authorization` header as instructed in the documentation. Now, run the `me` query again and you should be able to see the authenticated user's information.

Open the `AppBar` component in the `AppBar.jsx` file where you currently have the tabs "Repositories" and "Sign in". Change the tabs so that if the user is signed in the tab "Sign out" is displayed, otherwise show the "Sign in" tab. You can achieve this by using the `me` query with the useQuery hook.

Pressing the "Sign out" tab should remove the user's access token from the storage and reset the Apollo Client's store with the resetStore method. Calling the `resetStore` method should automatically re-execute all active queries which means that the `me` query should be re-executed. Note that the order of execution is crucial: access token must be removed from the storage _before_ the Apollo Client's store is reset.

**Details:**
- Test `me` query in Apollo Sandbox:
  - Run query without auth → should return null
  - Get access token using `authenticate` mutation
  - Add `Authorization: Bearer <token>` header
  - Run `me` query again → should return user data
- Create `ME` query:
  - Add to `src/graphql/queries.js`:
    ```javascript
    export const ME = gql`
      query {
        me {
          id
          username
        }
      }
    `;
    ```
- Create `useSignOut` hook:
  - Create `src/hooks/useSignOut.js`:
    ```javascript
    import { useApolloClient } from '@apollo/client/react';
    import useAuthStorage from './useAuthStorage';
    const useSignOut = () => {
      const authStorage = useAuthStorage();
      const apolloClient = useApolloClient();
      const signOut = async () => {
        await authStorage.removeAccessToken();
        await apolloClient.resetStore();
      };
      return signOut;
    };
    export default useSignOut;
    ```
- Update `AppBar` component:
  - Import `useQuery` from `@apollo/client/react`
  - Import `ME` query
  - Import `useSignOut` hook
  - Import `useNavigate` from `react-router-native`
  - Query user: `const { data } = useQuery(ME);`
  - Get sign out function: `const signOut = useSignOut();`
  - Create sign out handler:
    ```javascript
    const handleSignOut = async () => {
      await signOut();
      navigate('/');
    };
    ```
  - Conditionally render tabs:
    ```javascript
    {data?.me ? (
      <Pressable onPress={handleSignOut}>
        <Text>Sign out</Text>
      </Pressable>
    ) : (
      <AppBarTab to="/signin">Sign in</AppBarTab>
    )}
    ```
- Test sign out:
  - Sign in first
  - Verify "Sign out" tab appears
  - Press "Sign out"
  - Verify token removed
  - Verify Apollo cache reset
  - Verify "Sign in" tab appears
  - Verify `me` query returns null

**Note:** This is the last exercise in this section. Push your code to GitHub and mark all finished exercises in the exercise submission system. Exercises in this section should be submitted to part 3 in the exercise submission system.

# [Exercises 10.17-10.27.: Testing and Extending Our Application](https://fullstackopen.com/en/part10/testing_and_extending_our_application#exercise-10-17)

## 10.17: Testing the reviewed repositories list

Implement a test that ensures that the `RepositoryListContainer` component renders repository's name, description, language, forks count, stargazers count, rating average, and review count correctly. One approach in implementing this test is to add a testID prop for the element wrapping a single repository's information.

**Details:**
- Extract pure component:
  - Create `RepositoryListContainer` component
  - Accept `repositories` as prop
  - Extract nodes from edges
  - Render FlatList with RepositoryItem
- Add testID to RepositoryItem:
  - Wrap repository content in View with `testID="repositoryItem"`
- Create test file:
  - Create `src/__tests__/components/RepositoryList.test.js`
  - Use provided repositories data
  - Render `RepositoryListContainer` with mock data
- Test implementation:
  ```javascript
  describe('RepositoryList', () => {
    describe('RepositoryListContainer', () => {
      it('renders repository information correctly', () => {
        const repositories = {
          // ... provided data
        };
        render(<RepositoryListContainer repositories={repositories} />);
        const repositoryItems = screen.getAllByTestId('repositoryItem');
        expect(repositoryItems).toHaveLength(2);
        const [first, second] = repositoryItems;
        // Test first repository
        expect(first).toHaveTextContent('jaredpalmer/formik');
        expect(first).toHaveTextContent('Build forms in React, without the tears');
        expect(first).toHaveTextContent('TypeScript');
        expect(first).toHaveTextContent('1619');
        expect(first).toHaveTextContent('21856');
        expect(first).toHaveTextContent('88');
        expect(first).toHaveTextContent('3');
        // Test second repository
        expect(second).toHaveTextContent('async-library/react-async');
        // ... more assertions
      });
    });
  });
  ```
- Use `toHaveTextContent` matcher:
  - Check all required fields
  - Verify both repositories are tested
- Run tests:
  ```bash
  npm test
  ```
- Verify all assertions pass

## 10.18: Testing the sign in form

Implement a test that ensures that filling the sign in form's username and password fields and pressing the submit button _will call_ the `onSubmit` handler with _correct arguments_. The _first argument_ of the handler should be an object representing the form's values.

**Details:**
- Extract pure component:
  - Create `SignInContainer` component
  - Accept `onSubmit` as prop
  - Move Formik logic to container
  - Keep `SignIn` as wrapper with hook
- Create test file:
  - Create `src/__tests__/components/SignIn.test.js`
  - Import `SignInContainer`
- Test implementation:
  ```javascript
  describe('SignIn', () => {
    describe('SignInContainer', () => {
      it('calls onSubmit function with correct arguments when a valid form is submitted', async () => {
        const onSubmit = jest.fn();
        render(<SignInContainer onSubmit={onSubmit} />);
        fireEvent.changeText(screen.getByPlaceholderText('Username'), 'kalle');
        fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password');
        fireEvent.press(screen.getByText('Sign in'));
        await waitFor(() => {
          expect(onSubmit).toHaveBeenCalledTimes(1);
          expect(onSubmit.mock.calls[0][0]).toEqual({
            username: 'kalle',
            password: 'password',
          });
        });
      });
    });
  });
  ```
- Handle async form submission:
  - Make test function `async`
  - Use `waitFor` helper from React Native Testing Library
  - Wait for onSubmit to be called
- Test form submission:
  - Fill username field
  - Fill password field
  - Press submit button
  - Verify onSubmit called with correct values
- Run tests and verify

## 10.19: The single repository view

Implement a view for a single repository, which contains the same repository information as in the reviewed repositories list but also a button for opening the repository in GitHub.

**Details:**
- Create repository query:
  - Add `GET_REPOSITORY` query to `src/graphql/queries.js`
  - Include repository fields and `url` field
  - Test in Apollo Sandbox first
- Create SingleRepository component:
  - Create `src/components/SingleRepository.jsx`
  - Use `useParams` to get repository ID
  - Use `useQuery` with `GET_REPOSITORY`
  - Use `fetchPolicy: 'cache-and-network'`
- Reuse RepositoryItem:
  - Add `showGitHubButton` prop to RepositoryItem
  - Conditionally render GitHub button
- Implement GitHub button:
  - Install expo-linking: `npx expo install expo-linking`
  - Use `Linking.openURL(repository.url)`
  - Handle button press
- Add route:
  - Add route in Main component: `/repository/:id`
  - Use `useNavigate` in RepositoryList
  - Wrap RepositoryItem with Pressable
  - Navigate on press: `navigate(\`/repository/${item.id}\`)`
- Test implementation:
  - Click repository in list
  - Verify repository details shown
  - Click GitHub button
  - Verify URL opens

## 10.20: Repository's review list

Display repository's reviews in the single repository view. Reviews should be displayed as a scrollable list.

**Details:**
- Update repository query:
  - Add `reviews` field to `GET_REPOSITORY` query
  - Include `first` and `after` arguments
  - Include review fields: `id`, `text`, `rating`, `createdAt`, `user`
  - Include `pageInfo` and `cursor`
- Create ReviewItem component:
  - Create `src/components/ReviewItem.jsx`
  - Display rating, username, date, text
  - Style rating as round container
- Format dates:
  - Install date-fns: `npm install date-fns`
  - Use `format(new Date(review.createdAt), 'dd.MM.yyyy')`
- Update SingleRepository:
  - Extract reviews from edges
  - Use FlatList for reviews
  - Use `ListHeaderComponent` for repository info
  - Use `ItemSeparatorComponent` for spacing
- Style rating:
  - Round container: `borderRadius: width / 2`
  - Fixed width and height
  - Center content
- Test implementation:
  - View repository with reviews
  - Verify reviews displayed correctly
  - Verify dates formatted properly

## 10.21: The review form

Implement a form for creating a review using Formik. The form should have four fields: repository owner's GitHub username, repository's name, a numeric rating, and a textual review.

**Details:**
- Create validation schema:
  - Repository owner's username: required string
  - Repository's name: required string
  - Rating: required number between 0 and 100
  - Review: optional string
- Create CreateReview component:
  - Create `src/components/CreateReview.jsx`
  - Use Formik with validation
  - Use `useMutation` with `CREATE_REVIEW` mutation
- Create mutation:
  - Add `CREATE_REVIEW` to `src/graphql/mutations.js`
  - Test in Apollo Sandbox first
- Implement form:
  - TextInput for owner name
  - TextInput for repository name
  - TextInput for rating (numeric)
  - TextInput for review (multiline)
  - Submit button
- Handle submission:
  - Call mutation with form values
  - Navigate to repository view after success
  - Use `repositoryId` from mutation result
- Add route:
  - Add route in Main: `/create-review`
  - Add tab in AppBar (only for signed-in users)
- Update repository query:
  - Use `fetchPolicy: 'cache-and-network'` in SingleRepository
- Test implementation:
  - Create review for existing repository
  - Verify review appears in list
  - Test validation errors

## 10.22: The sign up form

Implement a sign up form for registering a user using Formik. The form should have three fields: username, password, and password confirmation.

**Details:**
- Create validation schema:
  - Username: required string, length 5-30
  - Password: required string, length 5-50
  - Password confirmation: matches password
  - Use `oneOf` and `ref` for password confirmation:
    ```javascript
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Password confirmation is required')
    ```
- Create SignUp component:
  - Create `src/components/SignUp.jsx`
  - Use Formik with validation
  - Use `useMutation` with `CREATE_USER` mutation
- Create mutation:
  - Add `CREATE_USER` to `src/graphql/mutations.js`
  - Test in Apollo Sandbox
- Handle submission:
  - Create user with mutation
  - Sign in user using `useSignIn` hook
  - Navigate to repositories list
- Add route:
  - Add route in Main: `/signup`
  - Add "Sign up" tab in AppBar (only for non-signed-in users)
- Test implementation:
  - Create new user
  - Verify auto sign-in
  - Test validation errors
  - Test password mismatch

## 10.23: Sorting the reviewed repositories list

Implement a feature that allows users to select the principle used to order the repositories.

**Details:**
- Define sorting options:
  - Latest repositories (default): `CREATED_AT`, `DESC`
  - Highest rated: `RATING_AVERAGE`, `DESC`
  - Lowest rated: `RATING_AVERAGE`, `ASC`
- Update GET_REPOSITORIES query:
  - Add `orderBy` and `orderDirection` arguments
  - Update query definition
- Add sorting state:
  - Use `useState` for selected sort option
  - Default to 'latest'
- Create sorting function:
  ```javascript
  const getSortVariables = () => {
    switch (sortBy) {
      case 'latest':
        return { orderBy: 'CREATED_AT', orderDirection: 'DESC' };
      case 'highest':
        return { orderBy: 'RATING_AVERAGE', orderDirection: 'DESC' };
      case 'lowest':
        return { orderBy: 'RATING_AVERAGE', orderDirection: 'ASC' };
      default:
        return { orderBy: 'CREATED_AT', orderDirection: 'DESC' };
    }
  };
  ```
- Implement picker:
  - Install picker: `npm install @react-native-picker/picker`
  - Or use React Native Paper Menu component
  - Add to ListHeaderComponent
- Update useRepositories:
  - Accept variables as parameter
  - Pass sort variables to query
- Test implementation:
  - Select different sort options
  - Verify repositories reorder correctly

## 10.24: Filtering the reviewed repositories list

Implement a feature for filtering the reviewed repositories list based on a keyword.

**Details:**
- Update GET_REPOSITORIES query:
  - Add `searchKeyword` argument
  - Update query definition
- Install debounce library:
  ```bash
  npm install use-debounce
  ```
- Add search state:
  - Use `useState` for search keyword
  - Use `useDebounce` with 500ms delay
- Create search input:
  - Use TextInput or React Native Paper Searchbar
  - Add to ListHeaderComponent
- Fix focus issue:
  - Convert RepositoryListContainer to class component
  - Define `renderHeader` as class property:
    ```javascript
    export class RepositoryListContainer extends React.Component {
      renderHeader = () => {
        const { searchKeyword, onSearchChange } = this.props;
        return (
          <TextInput
            value={searchKeyword}
            onChangeText={onSearchChange}
            placeholder="Search repositories"
          />
        );
      };
      render() {
        return (
          <FlatList
            ListHeaderComponent={this.renderHeader}
            // ...
          />
        );
      }
    }
    ```
- Update useRepositories:
  - Pass debounced keyword to query
- Test implementation:
  - Type in search field
  - Verify debouncing works
  - Verify results filter correctly
  - Verify input doesn't lose focus

## 10.25: The user's reviews view

Implement a feature which allows user to see their reviews.

**Details:**
- Update GET_CURRENT_USER query:
  - Add `includeReviews` argument with default `false`
  - Use `@include` directive:
    ```javascript
    query getCurrentUser($includeReviews: Boolean = false) {
      me {
        id
        username
        reviews @include(if: $includeReviews) {
          edges {
            node {
              id
              text
              rating
              createdAt
              repository {
                id
                fullName
                url
              }
            }
          }
        }
      }
    }
    ```
- Create MyReviews component:
  - Create `src/components/MyReviews.jsx`
  - Use `useQuery` with `GET_CURRENT_USER`
  - Pass `includeReviews: true`
  - Extract reviews from edges
- Display reviews:
  - Use FlatList
  - Create ReviewItem component
  - Display review details
- Add route:
  - Add route in Main: `/my-reviews`
  - Add "My reviews" tab in AppBar (only for signed-in users)
- Test implementation:
  - View user's reviews
  - Verify all reviews displayed
  - Verify repository information shown

## 10.26: Review actions

Add actions to reviews: view repository button and delete review button.

**Details:**
- Create DELETE_REVIEW mutation:
  - Add to `src/graphql/mutations.js`
  - Test in Apollo Sandbox
- Update ReviewItem:
  - Add "View repository" button
  - Add "Delete review" button
  - Accept `onViewRepository` and `onDelete` props
- Implement delete confirmation:
  - Use `Alert.alert()` from React Native
  - Show confirmation dialog:
    ```javascript
    Alert.alert(
      'Delete review',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: onDelete,
        },
      ]
    );
    ```
- Update MyReviews:
  - Use `useMutation` with `DELETE_REVIEW`
  - Implement `handleDelete` function
  - Call `refetch()` after deletion
  - Pass handlers to ReviewItem
- Implement view repository:
  - Use `navigate` to repository view
  - Pass repository ID
- Test implementation:
  - Click "View repository" button
  - Verify navigation works
  - Click "Delete review" button
  - Verify confirmation appears
  - Confirm deletion
  - Verify review removed
  - Test cancel action

## 10.27: Infinite scrolling for the repository's reviews list

Implement infinite scrolling for the repository's reviews list.

**Details:**
- Update Apollo cache:
  - Add field policy for Repository.reviews:
    ```javascript
    Repository: {
      fields: {
        reviews: relayStylePagination(),
      },
    }
    ```
- Update GET_REPOSITORY query:
  - Ensure `first` and `after` arguments included
  - Ensure `pageInfo` and `cursor` included
- Create useRepository hook:
  - Create `src/hooks/useRepository.js`
  - Similar to `useRepositories`
  - Implement `handleFetchMore`:
    ```javascript
    const handleFetchMore = () => {
      const canFetchMore = !loading && data?.repository.reviews.pageInfo.hasNextPage;
      if (!canFetchMore) return;
      fetchMore({
        variables: {
          after: data.repository.reviews.pageInfo.endCursor,
          // ... other variables
        },
      });
    };
    ```
- Update SingleRepository:
  - Use `useRepository` hook
  - Add `onEndReached` to FlatList
  - Call `fetchMore` when end reached
- Test with small first value:
  - Use `first: 3` initially
  - Create multiple reviews
  - Scroll to end
  - Verify more reviews load
- Adjust first value:
  - Increase to reasonable value (e.g., 4-8)
  - Ensure not too small (triggers immediately)
  - Ensure not too large (hard to test)

**Note:** This is the last exercise in this section. Push your code to GitHub and mark all finished exercises in the exercise submission system. Exercises in this section should be submitted to part 4 in the exercise submission system.

## Notes

- The ESLint configuration provided is basic
- Feel free to customize and add more plugins
- Editor integration provides real-time feedback
- Fix linting errors as you develop
- Keep code quality high from the start
