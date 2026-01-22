# Introduction to React Native - Summary

This section covers the introduction to React Native, setting up the development environment, and initializing a React Native application with Expo.

## What is React Native?

### Traditional Native Development

**Problem:**
- iOS: Requires Objective C or Swift
- Android: Requires Java, Scala, or Kotlin
- Two separate applications needed
- Different programming languages
- High development resource requirements

### Cross-Platform Solutions

**Cordova Approach:**
- Uses browser as rendering engine
- HTML5, CSS3, JavaScript
- Runs in embedded browser window
- **Limitations:**
  - Poor performance
  - Not native look-and-feel
  - Limited access to native features

**React Native Approach:**
- Native Android and iOS apps using JavaScript and React
- Cross-platform components
- Uses actual native UI components
- **Benefits:**
  - JSX, components, props, state, hooks
  - Familiar React ecosystem (Redux, Apollo, React Router)
  - Fast development velocity
  - Gentle learning curve for React developers

### Key Benefits

**From Coinbase:**
> "If we were to reduce the benefits of React Native to a single word, it would be 'velocity'. On average, our team was able to onboard engineers in less time, share more code, and ultimately deliver features faster than if we had taken a purely native approach."

## About This Part

### Application Overview

**Rate Repository App:**
- Rate GitHub repositories
- Sort and filter reviewed repositories
- User registration and login
- Create reviews for repositories
- Backend provided (focus on React Native)

### Prerequisites

**Required Knowledge:**
- JavaScript
- React
- GraphQL

**Recommended Parts:**
- Part 1: Introduction to React
- Part 2: Communicating with server
- Part 5: Testing React apps
- Part 7: React router, custom hooks, styling
- Part 8: GraphQL

**Not Required:**
- Deep server-side development knowledge
- Server-side code provided

### Exercise Structure

**Important Notes:**
- All exercises submitted to **single GitHub repository**
- Model solutions available for each section
- Develop application as material progresses
- **Do not wait** until exercises to start development
- Submit to different course instance than parts 0-9
- Parts 1-4 in submission = sections a-d in this part

**Credits:**
- Complete at least **25 exercises** = **2 credits**
- Submit via exercise submission system

## Initializing the Application

### Expo

**What is Expo?**
- Platform for React Native development
- Eases setup, development, building, deployment
- Simplifies React Native workflow

### Creating the Project

**Command:**
```bash
npx create-expo-app rate-repository-app --template expo-template-blank@sdk-50
```

**Key Points:**
- `@sdk-50` sets Expo SDK version to 50
- Supports React Native version 0.73
- Using other SDK versions may cause issues
- Expo has some limitations vs React Native CLI
- Limitations don't affect this material's application

### Installing Dependencies

**Additional Dependencies:**
```bash
npx expo install react-native-web@~0.19.6 react-dom@18.2.0 @expo/metro-runtime@~3.1.1
```

**Purpose:**
- `react-native-web`: Web support
- `react-dom`: DOM rendering for web
- `@expo/metro-runtime`: Metro bundler runtime

### Project Structure

```
rate-repository-app/
├── App.js              # Root component (don't rename/move)
├── app.json            # Expo configuration
├── package.json        # Dependencies and scripts
├── node_modules/       # Installed packages
└── src/                # Source code directory (we'll add files here)
```

**Important:**
- `App.js` is the root component
- Expo imports it by default
- Don't rename or move `App.js`

### Package.json Scripts

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  }
}
```

**Scripts:**
- `npm start`: Start Metro bundler
- `npm run android`: Start with Android emulator
- `npm run ios`: Start with iOS simulator
- `npm run web`: Start in browser

### Running the Application

**Start Metro Bundler:**
```bash
npm start
```

**What Happens:**
- Metro bundler starts (JavaScript bundler for React Native)
- Expo CLI opens in terminal
- Provides commands for viewing logs and starting app

**Opening in Browser:**
- Press "w" key in terminal
- Application opens in browser
- Changes visible after refresh

**Note:** If script fails, check Node version (should be version 20)

## Development Environment

### Options

**1. Browser View**
- Quick and easy
- Press "w" in terminal
- Poor simulation of native environment
- Good for quick testing

**2. Emulators**
- Better native simulation
- macOS: Both Android and iOS
- Linux/Windows: Android only

**3. Expo Mobile App**
- Best development experience
- Use actual mobile device
- More concrete than emulators

### Setting Up Emulators

**Android Emulator:**
- Use Android Studio
- Works on any operating system
- Set up Android emulator with Android Studio

**iOS Simulator:**
- Use Xcode
- macOS only
- Set up iOS simulator with Xcode

**Using Emulators:**
1. Start emulator
2. Run `npm start`
3. Press "a" for Android or "i" for iOS
4. Expo connects to emulator
5. Application appears (may take a while)

### Expo Mobile App

**Installation:**
- Follow Expo's documentation
- Install on your mobile device
- Available for iOS and Android

**Requirements:**
- Mobile device and computer on **same local network**
- Same Wi-Fi network

**Usage:**
1. Start Expo development tools: `npm start`
2. QR code appears in terminal
3. Scan QR code:
   - Android: Use Expo app
   - iOS: Use Camera app
4. App builds JavaScript bundle
5. Application appears

**Reopening:**
- Access from "Recently opened" list
- In "Projects" view in Expo app
- No need to scan QR code again

## ESLint Configuration

### Installation

**Dependencies:**
```bash
npm install --save-dev eslint @babel/eslint-parser eslint-plugin-react eslint-plugin-react-native
```

**Packages:**
- `eslint`: Core ESLint
- `@babel/eslint-parser`: Babel parser for ESLint
- `eslint-plugin-react`: React-specific rules
- `eslint-plugin-react-native`: React Native-specific rules

### Configuration File

**File: `.eslintrc.json`**
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

**Configuration Details:**
- `plugins`: React and React Native plugins
- `settings.react.version`: Auto-detect React version
- `extends`: Recommended rules from ESLint and React
- `parser`: Babel parser for modern JavaScript
- `env`: React Native environment
- `rules`: Custom rules
  - `react/prop-types`: Off (using TypeScript/not needed)
  - `react/react-in-jsx-scope`: Off (React 17+ doesn't need import)

### Lint Script

**package.json:**
```json
{
  "scripts": {
    "lint": "eslint ./src/**/*.{js,jsx} App.js --no-error-on-unmatched-pattern"
  }
}
```

**Usage:**
```bash
npm run lint
```

**Details:**
- Checks files in `src/` directory
- Checks `App.js`
- `--no-error-on-unmatched-pattern`: Don't error if no files match

### Editor Integration

**Visual Studio Code:**
1. Go to Extensions
2. Search for "ESLint"
3. Install ESLint extension
4. Enable it

**Benefits:**
- Real-time linting
- Visual indicators
- Auto-fix suggestions

## Debugging

### Console.log

**Location:**
- Messages appear in Expo development tools
- Terminal window shows console output
- Simple but effective

### React Native Developer Menu

**Access:**
- Shake device (physical device)
- Cmd+D (iOS simulator)
- Cmd+M (Android emulator)

**Features:**
- Reload app
- Debug remote JS
- Show element inspector
- Performance monitor

### React DevTools

**Installation:**
```bash
npx react-devtools
```

**Features:**
- Inspect React element tree
- View component props
- View component state
- Debug React components

**Usage:**
- Run command in separate terminal
- DevTools window opens
- Connect to running app

### Additional Tools

**Expo Debugging Documentation:**
- Comprehensive debugging guide
- Network inspection
- Performance profiling
- Error reporting

## Best Practices

### 1. Development Environment

**Recommendation:**
- Try both emulator and Expo mobile app
- Find what works best for you
- Use emulator for quick testing
- Use physical device for final testing

### 2. Code Organization

**Structure:**
- Keep `App.js` in root
- Add components to `src/` directory
- Organize by feature
- Keep components modular

### 3. Linting

**Setup:**
- Configure ESLint early
- Integrate with editor
- Fix linting errors immediately
- Customize rules as needed

### 4. Debugging

**Approach:**
- Start with console.log
- Use React DevTools for components
- Use network inspector for API calls
- Use performance monitor for optimization

### 5. Git Workflow

**Repository:**
- Create GitHub repository early
- Commit frequently
- Push regularly
- Use meaningful commit messages

## Common Patterns

### Basic App Structure

```javascript
// App.js
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello React Native!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

### Hot Reloading

**How It Works:**
- Save file
- Changes appear automatically
- No need to restart
- Fast development cycle

**Note:**
- Browser: May need refresh
- Emulator/Device: Automatic

## Exercises

### Exercise 10.1: Initializing the application

Initialize your application with Expo command-line interface and set up the development environment either using an emulator or Expo's mobile app. It is recommended to try both and find out which development environment is the most suitable for you. The name of the application is not that relevant. You can, for example, go with `rate-repository-app`.

To submit this exercise and all future exercises you need to create a new GitHub repository. The name of the repository can be for example the name of the application you initialized with `expo init`. If you decide to create a private repository, add GitHub user mluukkai as a repository collaborator. The collaborator status is only used for verifying your submissions.

Now that the repository is created, run `git init` within your application's root directory to make sure that the directory is initialized as a Git repository. Next, to add the created repository as the remote run `git remote add origin git@github.com:<YOURGITHUBUSERNAME>/<NAMEOFYOUR_REPOSITORY>.git` (remember to replace the placeholder values in the command). Finally, just commit and push your changes into the repository and you are all done.

**Steps:**
1. Initialize Expo app: `npx create-expo-app rate-repository-app --template expo-template-blank@sdk-50`
2. Install dependencies: `npx expo install react-native-web@~0.19.6 react-dom@18.2.0 @expo/metro-runtime@~3.1.1`
3. Set up development environment (emulator or Expo mobile app)
4. Create GitHub repository
5. Initialize Git and push code

### Exercise 10.2: Setting up the ESLint

Set up ESLint in your project so that you can perform linter checks by running `npm run lint`. To get most of linting it is also recommended to integrate ESLint with your editor.

**Steps:**
1. Install ESLint dependencies
2. Create `.eslintrc.json` configuration file
3. Add lint script to `package.json`
4. Test linting with `npm run lint`
5. Integrate ESLint with editor (VSCode extension)
6. Fix any linting errors

**Note:** This is the last exercise in this section. Push your code to GitHub and mark all finished exercises in the exercise submission system. Exercises in this section should be submitted to part 1 in the exercise submission system.
