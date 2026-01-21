# Basic Webpack Example

A minimal example demonstrating basic Webpack bundling.

## Features

- Basic bundling
- Module imports
- Simple configuration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the application:
```bash
npm run build
```

3. Check the output in `build/main.js`

## Project Structure

```
webpack-basic/
├── build/              # Output directory (created after build)
├── src/
│   ├── index.js       # Entry point
│   └── App.js         # App module
├── webpack.config.js  # Webpack configuration
└── package.json
```

## Key Concepts

1. **Entry Point**: `./src/index.js` - where bundling starts
2. **Output**: `build/main.js` - bundled file
3. **Bundling**: Combines all modules into one file
