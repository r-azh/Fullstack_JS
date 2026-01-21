# Webpack - Summary

This section covers Webpack, a bundler used to bundle JavaScript applications for browsers.

## Introduction

### What is a Bundler?

A bundler combines multiple JavaScript files (modules) into one or more optimized files for production. This is necessary because:

- Older browsers don't support ES6 modules
- Loading many separate files causes performance overhead
- Code needs to be transpiled and optimized

### Why Webpack?

- **Most Popular**: Webpack was the most popular bundler for years
- **Mature**: Well-established with extensive ecosystem
- **Flexible**: Highly configurable
- **Used by Create React App**: Create React App uses Webpack under the hood

### Modern Alternatives

- **Vite**: Faster, uses esbuild (used in this course)
- **esbuild**: Extremely fast, but lacks some features
- **Parcel**: Zero-configuration bundler
- **Rollup**: Optimized for libraries

## Basic Webpack Setup

### Project Structure

```
webpack-basic/
├── build/              # Output directory
├── src/
│   └── index.js       # Entry point
├── package.json
└── webpack.config.js  # Webpack configuration
```

### Installation

```bash
npm install --save-dev webpack webpack-cli
```

### Basic Configuration

```js
// webpack.config.js
const path = require('path')

const config = () => {
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    }
  }
}

module.exports = config
```

**Key Points:**
- `entry`: Starting point for bundling
- `output.path`: Absolute path to output directory
- `output.filename`: Name of bundled file
- `__dirname`: Node variable for current directory

### Alternative Configuration Format

```js
// webpack.config.js (object format)
const path = require('path')

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js'
  }
}

module.exports = config
```

**Note:** Function format is needed for advanced features like environment-based configuration.

### Build Script

```json
// package.json
{
  "scripts": {
    "build": "webpack --mode=development"
  }
}
```

**Modes:**
- `development`: Unminified, includes source maps
- `production`: Minified, optimized

## Bundling Process

### How Bundling Works

1. **Entry Point**: Webpack starts from `entry` file
2. **Dependency Graph**: Follows all `import` statements
3. **Transformation**: Applies loaders to transform files
4. **Bundling**: Combines everything into output file(s)
5. **Optimization**: Minifies and optimizes (in production)

### Example

```js
// src/index.js
import App from './App'

const hello = name => {
  console.log(`hello ${name}`)
}

App()
```

```js
// src/App.js
const App = () => {
  return null
}

export default App
```

**Result:** Webpack bundles both files into `build/main.js`

## Bundling React

### Installation

```bash
npm install react react-dom
```

### React Setup

```js
// src/index.js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

```js
// src/App.js
import React from 'react'

const App = () => {
  return (
    <div>
      hello webpack
    </div>
  )
}

export default App
```

### HTML File

```html
<!-- build/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/javascript" src="./main.js"></script>
  </body>
</html>
```

## Loaders

Loaders tell Webpack how to process different file types before bundling.

### Babel Loader for JSX

JSX needs to be transformed to JavaScript. Use babel-loader:

```js
// webpack.config.js
const path = require('path')

const config = () => {
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      ]
    }
  }
}

module.exports = config
```

**Installation:**
```bash
npm install @babel/core babel-loader @babel/preset-react --save-dev
```

**Loader Configuration:**
- `test`: Regex pattern to match files (`.js$` matches .js files)
- `loader`: Loader to use (`babel-loader`)
- `options`: Configuration for the loader

**How it works:**
- JSX is transformed to `React.createElement()` calls
- Example: `<div>hello</div>` → `React.createElement('div', null, 'hello')`

### CSS Loaders

To import CSS files, use css-loader and style-loader:

```js
// webpack.config.js
module: {
  rules: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-react']
      }
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }
  ]
}
```

**Installation:**
```bash
npm install style-loader css-loader --save-dev
```

**How it works:**
- `css-loader`: Reads CSS files
- `style-loader`: Injects CSS into `<style>` tag in HTML
- CSS is bundled into JavaScript file
- No separate CSS file needed (unless using mini-css-extract-plugin)

**Usage:**

```css
/* src/index.css */
.container {
  margin: 10px;
  background-color: #dee8e4;
}
```

```js
// src/index.js
import './index.css'
```

## Transpiling

Transpiling converts code from one JavaScript version to another.

### Babel Presets

**@babel/preset-react**: Transforms JSX to JavaScript

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-react']
  }
}
```

**@babel/preset-env**: Transforms modern JavaScript to ES5

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-env', '@babel/preset-react']
  }
}
```

**Installation:**
```bash
npm install @babel/preset-env --save-dev
```

**What it does:**
- Converts `const` → `var`
- Converts arrow functions → `function` keyword
- Converts template literals → string concatenation
- Makes code compatible with older browsers

### Example Transformation

**Before (ES6+):**
```js
const App = () => {
  return <div>hello</div>
}
```

**After (ES5):**
```js
var App = function App() {
  return React.createElement('div', null, 'hello')
}
```

## Webpack Dev Server

Webpack Dev Server provides hot reloading during development.

### Installation

```bash
npm install --save-dev webpack-dev-server
```

### Configuration

```js
// webpack.config.js
const config = () => {
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    },
    devServer: {
      static: path.resolve(__dirname, 'build'),
      compress: true,
      port: 3000
    },
    // ...
  }
}
```

### Script

```json
// package.json
{
  "scripts": {
    "build": "webpack --mode=development",
    "start": "webpack serve --mode=development"
  }
}
```

**Key Points:**
- `static`: Directory to serve files from
- `compress`: Enable gzip compression
- `port`: Port number (default: 8080)
- Bundled code exists only in memory (not written to disk)
- Automatic browser refresh on code changes

## Source Maps

Source maps map bundled code back to original source files for debugging.

### Configuration

```js
// webpack.config.js
const config = () => {
  return {
    // ...
    devtool: 'source-map'
  }
}
```

**Benefits:**
- See original source code in browser DevTools
- Accurate error messages with correct line numbers
- Use Chrome debugger with original code
- Easier debugging experience

**Types:**
- `source-map`: Full source map (separate file)
- `inline-source-map`: Inline source map
- `eval-source-map`: Fastest, good for development
- `cheap-module-source-map`: Faster, less accurate

## Minification

Minification reduces file size by removing whitespace, comments, and shortening variable names.

### Production Mode

```json
// package.json
{
  "scripts": {
    "build": "webpack --mode=production",
    "start": "webpack serve --mode=development"
  }
}
```

**What happens:**
- Code is minified automatically
- Variable names shortened
- Comments removed
- Whitespace removed
- Dead code elimination

**Example:**

**Before:**
```js
function hello(name) {
  console.log(`Hello ${name}`)
}
```

**After:**
```js
function h(n){console.log("Hello "+n)}
```

**File Size Reduction:**
- Development: ~1MB
- Production: ~200KB (80% reduction)

## Environment Configuration

Different configurations for development and production.

### Using argv.mode

```js
// webpack.config.js
const path = require('path')
const webpack = require('webpack')

const config = (env, argv) => {
  console.log('argv.mode:', argv.mode)

  const backend_url = argv.mode === 'production'
    ? 'https://notes2023.fly.dev/api/notes'
    : 'http://localhost:3001/notes'

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    },
    // ...
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(backend_url)
      })
    ]
  }
}

module.exports = config
```

**Key Points:**
- `config(env, argv)`: Function receives environment and arguments
- `argv.mode`: Current mode (development/production)
- `DefinePlugin`: Defines global constants
- `JSON.stringify()`: Required for string values

### Using Global Constants

```js
// src/App.js
const App = () => {
  const notes = useNotes(BACKEND_URL)  // Global constant

  return (
    <div>
      {notes.length} notes on server {BACKEND_URL}
    </div>
  )
}
```

**Note:** Constants are replaced at build time, not runtime.

## Polyfills

Polyfills add missing functionality to older browsers.

### Promise Polyfill

```bash
npm install promise-polyfill
```

```js
// src/index.js
import PromisePolyfill from 'promise-polyfill'

if (!window.Promise) {
  window.Promise = PromisePolyfill
}

// Rest of application code
```

**What it does:**
- Checks if `Promise` exists
- If not, adds polyfill
- Makes code work in IE and older browsers

### Core-js and Regenerator Runtime

For async/await support:

```bash
npm install core-js regenerator-runtime
```

```js
// src/index.js
import 'core-js/stable/index.js'
import 'regenerator-runtime/runtime.js'

// Rest of application code
```

**What they provide:**
- `core-js`: Polyfills for ES6+ features
- `regenerator-runtime`: Support for async/await

## Complete Webpack Configuration

### Full Example

```js
// webpack.config.js
const path = require('path')
const webpack = require('webpack')

const config = (env, argv) => {
  const backend_url = argv.mode === 'production'
    ? 'https://notes2023.fly.dev/api/notes'
    : 'http://localhost:3001/notes'

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    },
    devServer: {
      static: path.resolve(__dirname, 'build'),
      compress: true,
      port: 3000
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(backend_url)
      })
    ]
  }
}

module.exports = config
```

## Webpack vs Vite

| Feature | Webpack | Vite |
|---------|---------|------|
| **Speed** | Slower | Much faster |
| **Configuration** | Complex | Simple |
| **Hot Reload** | Good | Excellent |
| **Maturity** | Very mature | Newer |
| **Ecosystem** | Extensive | Growing |
| **Best For** | Complex setups | Modern apps |

## Best Practices

### 1. Use Development Mode for Development

```json
{
  "scripts": {
    "start": "webpack serve --mode=development"
  }
}
```

### 2. Use Production Mode for Builds

```json
{
  "scripts": {
    "build": "webpack --mode=production"
  }
}
```

### 3. Enable Source Maps in Development

```js
devtool: 'source-map'
```

### 4. Separate Configurations

For complex projects, split config into:
- `webpack.config.dev.js`
- `webpack.config.prod.js`
- `webpack.config.common.js`

### 5. Optimize Bundle Size

- Use code splitting
- Tree shaking (automatic in production)
- Lazy loading
- Analyze bundle with `webpack-bundle-analyzer`

## File Structure

```
webpack-react/
├── build/                 # Output directory
│   ├── index.html        # HTML file
│   └── main.js           # Bundled JavaScript
├── src/
│   ├── index.js          # Entry point
│   ├── App.js            # App component
│   └── index.css         # Styles
├── package.json
└── webpack.config.js     # Webpack configuration
```

## Common Loaders

| Loader | Purpose | File Types |
|--------|---------|------------|
| `babel-loader` | Transpile JS/JSX | `.js`, `.jsx` |
| `css-loader` | Process CSS | `.css` |
| `style-loader` | Inject CSS | `.css` |
| `file-loader` | Handle files | `.png`, `.jpg`, etc. |
| `url-loader` | Inline small files | `.png`, `.jpg`, etc. |
| `sass-loader` | Process Sass | `.scss`, `.sass` |

## Exercises

The exercises for this section are part of the "Extending the bloglist" exercise set at the end of Part 7. They involve understanding how bundling works and configuring Webpack.

### Understanding Bundling

Learn how Webpack bundles JavaScript modules into a single file.

**Details:**
- Understand entry points and output
- See how modules are combined
- Learn about dependency graphs
- Understand the bundling process

### Configuring Webpack for React

Set up Webpack to work with React and JSX.

**Details:**
- Configure babel-loader for JSX
- Set up React and ReactDOM
- Configure CSS loaders
- Create HTML entry point

### Development vs Production

Configure different settings for development and production.

**Details:**
- Use different backend URLs
- Enable source maps in development
- Minify code in production
- Use DefinePlugin for environment variables

### Source Maps and Debugging

Enable source maps for better debugging experience.

**Details:**
- Configure devtool option
- Understand different source map types
- Debug with original source code
- Use Chrome DevTools effectively

**Note:** These exercises are conceptual and help understand the build process. In practice, you'll likely use Vite or Create React App which handle Webpack configuration for you.
