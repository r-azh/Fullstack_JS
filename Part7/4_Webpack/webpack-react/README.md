# React App with Webpack

A React application demonstrating Webpack configuration with loaders, dev server, and environment variables.

## Features

- React with JSX
- Babel transpilation
- CSS loading
- Webpack Dev Server
- Source maps
- Environment-based configuration
- Production minification

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Build for production:
```bash
npm run build
```

4. Start json-server (for development):
```bash
npm run server
```

## Key Concepts

1. **Babel Loader**: Transpiles JSX and modern JavaScript
2. **CSS Loaders**: Processes and injects CSS
3. **Dev Server**: Hot reloading during development
4. **Source Maps**: Debugging with original source code
5. **DefinePlugin**: Environment-based constants
6. **Production Mode**: Automatic minification

## Configuration

- **Development**: Uses `http://localhost:3001/notes` for backend
- **Production**: Uses `https://notes2023.fly.dev/api/notes` for backend
- **Source Maps**: Enabled for debugging
- **Port**: 3000 (dev server)

## Project Structure

```
webpack-react/
├── build/                 # Output directory
│   ├── index.html        # HTML file
│   └── main.js           # Bundled JavaScript
├── src/
│   ├── index.js          # Entry point
│   ├── App.js            # App component
│   └── index.css         # Styles
├── webpack.config.js     # Webpack configuration
└── package.json
```
