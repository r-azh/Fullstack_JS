# React Native Basics - Summary

This section covers React Native core components, styling, theming, flexbox layouts, routing, and form state management.

## Core Components

### React vs React Native

**Browser Environment:**
```javascript
const HelloWorld = props => {
  return <div>Hello world!</div>;
};
```

**React Native:**
```javascript
import { Text } from 'react-native';

const HelloWorld = props => {
  return <Text>Hello world!</Text>;
};
```

**Key Differences:**
- React Native uses core components instead of DOM elements
- Core components map to native UI components
- Different component names and APIs

### Core Component Examples

**Text Component:**
- Only component that can have textual children
- Similar to `<strong>`, `<h1>`, etc.
- Required for displaying text

**View Component:**
- Basic UI building block
- Similar to `<div>` element
- Container for other components

**TextInput Component:**
- Text field component
- Similar to `<input>` element
- For user text input

**Pressable Component:**
- Captures press events
- Similar to `<button>` element
- Handles user interactions

### Important Differences

**1. Text Component Requirement:**
- Text must be wrapped in `<Text>` component
- Cannot use text directly in `<View>`
- Only `<Text>` can have textual children

**2. Event Handlers:**
- Must check API documentation for available props
- Not all components support all events
- `Pressable` uses `onPress` instead of `onClick`

**Example:**
```javascript
import { Text, Pressable, Alert } from 'react-native';

const PressableText = props => {
  return (
    <Pressable
      onPress={() => Alert.alert('You pressed the text!')}
    >
      <Text>You can press me</Text>
    </Pressable>
  );
};
```

## Project Structure

### Directory Organization

```
rate-repository-app/
├── App.js              # Root component
├── src/
│   ├── components/     # React components
│   │   ├── Main.jsx
│   │   ├── RepositoryList.jsx
│   │   ├── RepositoryItem.jsx
│   │   └── Text.jsx
│   └── theme.js        # Theme configuration
```

### Main Component

**File: `src/components/Main.jsx`**
```javascript
import Constants from 'expo-constants';
import { Text, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flexGrow: 1,
    flexShrink: 1,
  },
});

const Main = () => {
  return (
    <View style={styles.container}>
      <Text>Rate Repository Application</Text>
    </View>
  );
};

export default Main;
```

**Key Points:**
- Uses `Constants.statusBarHeight` for status bar spacing
- `flexGrow: 1` and `flexShrink: 1` for flexible sizing
- Exported as default

### App Component

**File: `App.js`**
```javascript
import Main from './src/components/Main';

const App = () => {
  return <Main />;
};

export default App;
```

## Manual Reloading

### Developer Menu

**Access Methods:**
- Shake device (physical device)
- Hardware menu → "Shake Gesture" (iOS Simulator)
- ⌘D (iOS Simulator on Mac)
- ⌘M (Android emulator on Mac)
- Ctrl+M (Android emulator on Windows/Linux)

**Actions:**
- Reload application
- Debug remote JS
- Show element inspector
- Performance monitor

**When to Use:**
- Automatic reload not working
- After reload, automatic reload should resume

## Styling

### Style Prop

**Basic Usage:**
```javascript
import { Text, View } from 'react-native';

const BigBlueText = () => {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ color: 'blue', fontSize: 24, fontWeight: '700' }}>
        Big blue text
      </Text>
    </View>
  );
};
```

**Key Points:**
- Style prop accepts object
- Property names in camelCase
- No units (density-independent pixels)

### StyleSheet.create

**Better Approach:**
```javascript
import { Text, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    color: 'blue',
    fontSize: 24,
    fontWeight: '700',
  },
});

const BigBlueText = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Big blue text
      </Text>
    </View>
  );
};
```

**Benefits:**
- Cleaner component code
- Better performance
- Type checking
- Reusable styles

### Style Property Differences

**CSS vs React Native:**
- CSS: `padding-top`, `font-size`
- React Native: `paddingTop`, `fontSize`
- CSS: `20px`, `50%`
- React Native: `20`, `50` (unitless)

**Available Properties:**
- Check React Native Styling Cheat Sheet
- Most CSS properties supported
- Some differences in values

### Array of Styles

**Multiple Styles:**
```javascript
<Text style={[styles.text, styles.bold, customStyle]}>
  Text with multiple styles
</Text>
```

**Conditional Styles:**
```javascript
import { Text, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: 'grey',
    fontSize: 14,
  },
  blueText: {
    color: 'blue',
  },
  bigText: {
    fontSize: 24,
    fontWeight: '700',
  },
});

const FancyText = ({ isBlue, isBig, children }) => {
  const textStyles = [
    styles.text,
    isBlue && styles.blueText,
    isBig && styles.bigText,
  ];

  return <Text style={textStyles}>{children}</Text>;
};
```

**Key Points:**
- Arrays merged left to right
- Later styles override earlier ones
- False values (null, undefined) ignored
- Enables conditional styling

## Theming

### Theme Configuration

**File: `src/theme.js`**
```javascript
const theme = {
  colors: {
    textPrimary: '#24292e',
    textSecondary: '#586069',
    primary: '#0366d6',
  },
  fontSizes: {
    body: 14,
    subheading: 16,
  },
  fonts: {
    main: 'System',
  },
  fontWeights: {
    normal: '400',
    bold: '700',
  },
};

export default theme;
```

**Benefits:**
- Consistent design
- Easy to change globally
- No magic numbers
- Centralized configuration

### Custom Text Component

**File: `src/components/Text.jsx`**
```javascript
import { Text as NativeText, StyleSheet } from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
  text: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.main,
    fontWeight: theme.fontWeights.normal,
  },
  colorTextSecondary: {
    color: theme.colors.textSecondary,
  },
  colorPrimary: {
    color: theme.colors.primary,
  },
  fontSizeSubheading: {
    fontSize: theme.fontSizes.subheading,
  },
  fontWeightBold: {
    fontWeight: theme.fontWeights.bold,
  },
});

const Text = ({ color, fontSize, fontWeight, style, ...props }) => {
  const textStyle = [
    styles.text,
    color === 'textSecondary' && styles.colorTextSecondary,
    color === 'primary' && styles.colorPrimary,
    fontSize === 'subheading' && styles.fontSizeSubheading,
    fontWeight === 'bold' && styles.fontWeightBold,
    style,
  ];

  return <NativeText style={textStyle} {...props} />;
};

export default Text;
```

**Usage:**
```javascript
import Text from './Text';

const Main = () => {
  return (
    <>
      <Text>Simple text</Text>
      <Text style={{ paddingBottom: 10 }}>Text with custom style</Text>
      <Text fontWeight="bold" fontSize="subheading">
        Bold subheading
      </Text>
      <Text color="textSecondary">Text with secondary color</Text>
    </>
  );
};
```

**Benefits:**
- Consistent text styling
- Easy to use variants
- Extensible
- Can create specialized components (e.g., Subheading)

## Flexbox Layout

### Flex Container

**Basic Setup:**
```javascript
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  flexContainer: {
    flexDirection: 'row',
  },
});

const FlexboxExample = () => {
  return <View style={styles.flexContainer}>{/* ... */}</View>;
};
```

**Key Points:**
- `display: 'flex'` is default
- No need to set explicitly
- Controls layout of children

### Flex Container Properties

**flexDirection:**
- `row`: Left to right
- `row-reverse`: Right to left
- `column`: Top to bottom (default in React Native)
- `column-reverse`: Bottom to top

**justifyContent:**
- `flex-start`: Start of main axis (default)
- `flex-end`: End of main axis
- `center`: Center along main axis
- `space-between`: Space between items
- `space-around`: Space around items
- `space-evenly`: Equal space everywhere

**alignItems:**
- `flex-start`: Start of cross axis
- `flex-end`: End of cross axis
- `center`: Center along cross axis
- `baseline`: Align to baseline
- `stretch`: Stretch to fill (default)

### Flex Items

**Basic Example:**
```javascript
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  flexContainer: {
    display: 'flex',
  },
  flexItemA: {
    flexGrow: 0,
    backgroundColor: 'green',
  },
  flexItemB: {
    flexGrow: 1,
    backgroundColor: 'blue',
  },
});

const FlexboxExample = () => {
  return (
    <View style={styles.flexContainer}>
      <View style={styles.flexItemA}>
        <Text>Flex item A</Text>
      </View>
      <View style={styles.flexItemB}>
        <Text>Flex item B</Text>
      </View>
    </View>
  );
};
```

**flexGrow Property:**
- Unitless value
- Defines ability to grow
- `flexGrow: 1` = share space evenly
- `flexGrow: 0` = use only needed space

### React Native Flexbox Differences

**Important Differences:**
- Default `flexDirection` is `column` (not `row`)
- `flex` shorthand doesn't accept multiple values
- Property names in camelCase
- Property values same as CSS

**Resources:**
- A Complete Guide to Flexbox
- Flexbox Playground
- React Native Flexbox documentation

## FlatList Component

### Basic Usage

**File: `src/components/RepositoryList.jsx`**
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
  // ... more repositories
];

const ItemSeparator = () => <View style={styles.separator} />;

const RepositoryList = () => {
  return (
    <FlatList
      data={repositories}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => <RepositoryItem item={item} />}
      keyExtractor={item => item.id}
    />
  );
};

export default RepositoryList;
```

**Key Props:**
- `data`: Array of items
- `renderItem`: Function to render each item
- `keyExtractor`: Function to extract unique key
- `ItemSeparatorComponent`: Component between items

## Routing

### React Router Native

**Installation:**
```bash
npm install react-router-native
```

**Setup:**
```javascript
// App.js
import { StatusBar } from 'expo-status-bar';
import { NativeRouter } from 'react-router-native';
import Main from './src/components/Main';

const App = () => {
  return (
    <>
      <NativeRouter>
        <Main />
      </NativeRouter>
      <StatusBar style="auto" />
    </>
  );
};

export default App;
```

**Routes:**
```javascript
// src/components/Main.jsx
import { StyleSheet, View } from 'react-native';
import { Route, Routes, Navigate } from 'react-router-native';
import RepositoryList from './RepositoryList';
import AppBar from './AppBar';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.mainBackground,
    flexGrow: 1,
    flexShrink: 1,
  },
});

const Main = () => {
  return (
    <View style={styles.container}>
      <AppBar />
      <Routes>
        <Route path="/" element={<RepositoryList />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </View>
  );
};

export default Main;
```

**Key Components:**
- `NativeRouter`: Router for React Native (replaces BrowserRouter)
- `Routes`: Container for routes
- `Route`: Individual route definition
- `Navigate`: Programmatic navigation
- `Link`: Navigation link component

**Differences from Web:**
- No URLs in address bar
- No browser history API
- Uses NativeRouter instead of BrowserRouter
- Same core concepts and hooks

## Form State Management

### Formik Library

**Installation:**
```bash
npm install formik
```

**Basic Usage:**
```javascript
import { Text, TextInput, Pressable, View } from 'react-native';
import { useFormik } from 'formik';

const initialValues = {
  mass: '',
  height: '',
};

const getBodyMassIndex = (mass, height) => {
  return Math.round(mass / Math.pow(height, 2));
};

const BodyMassIndexForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  return (
    <View>
      <TextInput
        placeholder="Weight (kg)"
        value={formik.values.mass}
        onChangeText={formik.handleChange('mass')}
      />
      <TextInput
        placeholder="Height (m)"
        value={formik.values.height}
        onChangeText={formik.handleChange('height')}
      />
      <Pressable onPress={formik.handleSubmit}>
        <Text>Calculate</Text>
      </Pressable>
    </View>
  );
};

const BodyMassIndexCalculator = () => {
  const onSubmit = values => {
    const mass = parseFloat(values.mass);
    const height = parseFloat(values.height);

    if (!isNaN(mass) && !isNaN(height) && height !== 0) {
      console.log(`Your body mass index is: ${getBodyMassIndex(mass, height)}`);
    }
  };

  return <BodyMassIndexForm onSubmit={onSubmit} />;
};

export default BodyMassIndexCalculator;
```

**Key Concepts:**
- `useFormik()`: Custom hook for form state
- `formik.values`: Current form values
- `formik.handleChange`: Update field value
- `formik.handleSubmit`: Submit form
- `formik.handleBlur`: Mark field as touched

**Note:** Read Formik documentation about useFormik() restrictions.

## Form Validation

### Yup Validation Schema

**Installation:**
```bash
npm install yup
```

**Validation Schema:**
```javascript
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  mass: yup
    .number()
    .min(1, 'Weight must be greater or equal to 1')
    .required('Weight is required'),
  height: yup
    .number()
    .min(0.5, 'Height must be greater or equal to 0.5')
    .required('Height is required'),
});

const BodyMassIndexForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <View>
      <TextInput
        placeholder="Weight (kg)"
        value={formik.values.mass}
        onChangeText={formik.handleChange('mass')}
        onBlur={formik.handleBlur('mass')}
      />
      {formik.touched.mass && formik.errors.mass && (
        <Text style={{ color: 'red' }}>{formik.errors.mass}</Text>
      )}
      <TextInput
        placeholder="Height (m)"
        value={formik.values.height}
        onChangeText={formik.handleChange('height')}
        onBlur={formik.handleBlur('height')}
      />
      {formik.touched.height && formik.errors.height && (
        <Text style={{ color: 'red' }}>{formik.errors.height}</Text>
      )}
      <Pressable onPress={formik.handleSubmit}>
        <Text>Calculate</Text>
      </Pressable>
    </View>
  );
};
```

**Key Points:**
- `validationSchema`: Yup schema object
- `formik.errors`: Object with error messages
- `formik.touched`: Object tracking touched fields
- Validation runs on change and submit
- `onSubmit` not called if validation fails

**Validation Approaches:**
1. Validation function (validate prop)
2. Validation schema (validationSchema prop with Yup)

## Platform-Specific Code

### Platform.OS

**Basic Usage:**
```javascript
import { Platform, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: Platform.OS === 'android' ? 'green' : 'blue',
  },
});

const WhatIsMyPlatform = () => {
  return <Text style={styles.text}>Your platform is: {Platform.OS}</Text>;
};
```

**Possible Values:**
- `'android'`
- `'ios'`

### Platform.select

**Object-Based Selection:**
```javascript
const styles = StyleSheet.create({
  text: {
    color: Platform.select({
      android: 'green',
      ios: 'blue',
      default: 'black',
    }),
  },
});
```

**Component Selection:**
```javascript
const MyComponent = Platform.select({
  ios: () => require('./MyIOSComponent'),
  android: () => require('./MyAndroidComponent'),
})();

<MyComponent />;
```

### File Extensions

**Platform-Specific Files:**
- `Button.ios.jsx` - iOS version
- `Button.android.jsx` - Android version

**Import:**
```javascript
import Button from './Button';

const PlatformSpecificButton = () => {
  return <Button />;
};
```

**How It Works:**
- Bundler automatically selects correct file
- Android bundle uses `.android.jsx`
- iOS bundle uses `.ios.jsx`
- No need for conditional imports

## Best Practices

### 1. Use StyleSheet.create

```javascript
// ✅ Good
const styles = StyleSheet.create({
  container: { padding: 20 },
});

// ❌ Bad
<View style={{ padding: 20 }}>
```

### 2. Create Custom Components

```javascript
// ✅ Good: Custom Text component
<Text fontSize="subheading" fontWeight="bold">Title</Text>

// ❌ Bad: Inline styles everywhere
<Text style={{ fontSize: 16, fontWeight: '700' }}>Title</Text>
```

### 3. Use Theme Configuration

```javascript
// ✅ Good: Theme variable
color: theme.colors.primary

// ❌ Bad: Magic number
color: '#0366d6'
```

### 4. Organize Components

```javascript
// ✅ Good: Separate files
src/
  components/
    RepositoryList.jsx
    RepositoryItem.jsx
    Text.jsx

// ❌ Bad: Everything in one file
```

### 5. Use FlatList for Lists

```javascript
// ✅ Good: FlatList for performance
<FlatList data={items} renderItem={...} />

// ❌ Bad: Map with View
{items.map(item => <View>...</View>)}
```

## Common Patterns

### Repository List Item

```javascript
// src/components/RepositoryItem.jsx
import { View, Image, StyleSheet } from 'react-native';
import Text from './Text';

const RepositoryItem = ({ item }) => {
  const formatCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.avatar}
          source={{ uri: item.ownerAvatarUrl }}
        />
        <View style={styles.info}>
          <Text fontWeight="bold" fontSize="subheading">
            {item.fullName}
          </Text>
          <Text color="textSecondary">{item.description}</Text>
        </View>
      </View>
      <View style={styles.stats}>
        <Text>{formatCount(item.stargazersCount)}</Text>
        <Text>{formatCount(item.forksCount)}</Text>
        <Text>{item.reviewCount}</Text>
        <Text>{item.ratingAverage}</Text>
      </View>
      {item.language && (
        <View style={styles.language}>
          <Text style={styles.languageText}>{item.language}</Text>
        </View>
      )}
    </View>
  );
};
```

### App Bar with Tabs

```javascript
// src/components/AppBar.jsx
import { View, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'react-router-native';
import Constants from 'expo-constants';
import theme from '../theme';
import Text from './Text';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBar,
    paddingBottom: 10,
  },
  scrollView: {
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

const AppBarTab = ({ children, to }) => {
  return (
    <Link to={to} underlayColor={theme.colors.appBarTabActive}>
      <View style={styles.tab}>
        <Text fontWeight="bold" color="textAppBar">
          {children}
        </Text>
      </View>
    </Link>
  );
};

const AppBar = () => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.scrollView}>
        <AppBarTab to="/">Repositories</AppBarTab>
        <AppBarTab to="/signin">Sign in</AppBarTab>
      </ScrollView>
    </View>
  );
};

export default AppBar;
```

### Sign-In Form

```javascript
// src/components/SignIn.jsx
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Text from './Text';
import theme from '../theme';

const validationSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const SignIn = () => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Username"
        value={formik.values.username}
        onChangeText={formik.handleChange('username')}
        onBlur={formik.handleBlur('username')}
        style={[
          styles.input,
          formik.touched.username && formik.errors.username && styles.inputError,
        ]}
      />
      {formik.touched.username && formik.errors.username && (
        <Text style={styles.error}>{formik.errors.username}</Text>
      )}
      <TextInput
        placeholder="Password"
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
        secureTextEntry
        style={[
          styles.input,
          formik.touched.password && formik.errors.password && styles.inputError,
        ]}
      />
      {formik.touched.password && formik.errors.password && (
        <Text style={styles.error}>{formik.errors.password}</Text>
      )}
      <Pressable onPress={formik.handleSubmit} style={styles.button}>
        <Text fontWeight="bold" color="textAppBar">Sign in</Text>
      </Pressable>
    </View>
  );
};
```

## Exercises

### Exercise 10.3: The reviewed repositories list

Implement components `RepositoryList` and `RepositoryItem` to display a list of repositories using the `FlatList` component. The list should contain the repository's full name, description, language, number of forks, number of stars, rating average and number of reviews.

**Key Points:**
- Use `FlatList` component for list rendering
- Create `ItemSeparator` component for spacing
- Use `renderItem` prop to render `RepositoryItem`
- Use `keyExtractor` for unique keys
- Render in `Main` component

### Exercise 10.4: The app bar

Create an `AppBar` component with a "Repositories" tab. The app bar should prevent the status bar from overlapping content. Make the tab pressable using the `Pressable` component.

**Key Points:**
- Use `Constants.statusBarHeight` for spacing
- Add background color to theme
- Create reusable `AppBarTab` component
- Remove `marginTop` from `Main` component

### Exercise 10.5: Polished reviewed repositories list

Enhance the `RepositoryItem` component to display avatar images and format large numbers (e.g., 8439 → "8.4k"). Polish the overall styling.

**Key Points:**
- Use `Image` component for avatars
- Create `formatCount` function for number formatting
- Improve styling with theme colors
- Split into smaller components if needed

### Exercise 10.6: The sign-in view

Set up routing with `react-router-native` and create a `SignIn` component. Add a "Sign in" tab to the app bar that navigates to the sign-in view.

**Key Points:**
- Install `react-router-native`
- Wrap app with `NativeRouter`
- Add routes in `Main` component
- Use `Link` component for navigation

### Exercise 10.7: Scrollable app bar

Wrap the app bar tabs with a `ScrollView` component to enable horizontal scrolling when tabs don't fit the screen.

**Key Points:**
- Use `ScrollView` with `horizontal` prop
- Add `flexDirection: 'row'` style
- Test with multiple tabs

### Exercise 10.8: The sign-in form

Implement a sign-in form using Formik with username and password fields. Log form values on submit.

**Key Points:**
- Install `formik`
- Use `useFormik` hook
- Add `TextInput` components
- Use `secureTextEntry` for password
- Handle form submission

### Exercise 10.9: Validating the sign-in form

Add form validation using Yup. Display error messages and add visual error indicators (red border) for invalid fields.

**Key Points:**
- Install `yup`
- Create validation schema
- Display error messages
- Add error styling to inputs
- Prevent submit on validation failure

### Exercise 10.10: A platform-specific font

Use platform-specific fonts: Roboto for Android, Arial for iOS, System as default.

**Key Points:**
- Use `Platform.select` in theme
- Update `fonts.main` configuration
- Test on different platforms

**Note:** This is the last exercise in this section. Push your code to GitHub and mark all finished exercises in the exercise submission system. Exercises in this section should be submitted to part 2 in the exercise submission system.
