# SOSprépa Frontend

Vue.js 3 frontend application for the SOSprépa QCM platform.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)

## ✨ Features

- **Vue 3**: Modern Vue.js framework with Composition API
- **Vue Router**: Client-side routing with navigation guards
- **Pinia**: State management for authentication and notifications
- **Axios**: HTTP client with interceptors for API calls
- **Responsive Design**: Mobile-friendly interface
- **Role-Based UI**: Different interfaces for teachers and students

## 🔧 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Backend server running (see `../server/README.md`)

## 📦 Installation

```bash
# Install dependencies
npm install
```

## ⚙️ Configuration

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Edit `.env` with your configuration:

```env
# API Configuration
VUE_APP_API_URL=http://localhost:3000

# Application Configuration
VUE_APP_NAME=SOSprépa
```

**Important**: Make sure `VUE_APP_API_URL` matches your backend server URL.

## 🏃 Development

### Start Development Server

```bash
npm run serve
```

The application will be available at `http://localhost:8080`.

### Hot Reload

The development server supports hot module replacement (HMR). Changes to Vue components, JavaScript, and CSS will be reflected immediately without full page reload.

### Development Tips

- Use Vue DevTools browser extension for debugging
- Check browser console for errors and warnings
- API calls are logged in the network tab

## 🏗️ Building for Production

### Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Build Features

- Minified JavaScript and CSS
- Optimized assets
- Source maps for debugging
- Cache-busting file names

### Preview Production Build

You can preview the production build locally:

```bash
# Install a simple HTTP server
npm install -g serve

# Serve the dist folder
serve -s dist
```

## 📁 Project Structure

```
client/
├── public/              # Static assets
│   ├── favicon.ico
│   └── index.html       # HTML template
│
├── src/
│   ├── assets/          # CSS and images
│   │   ├── answer.css
│   │   ├── correct.css
│   │   ├── create-qcm.css
│   │   ├── lessons.css
│   │   ├── login.css
│   │   ├── select-qcm.css
│   │   ├── styles.css
│   │   └── logo.png
│   │
│   ├── components/      # Reusable components
│   │   ├── Header.vue
│   │   ├── HelloWorld.vue
│   │   └── NotificationToast.vue
│   │
│   ├── router/          # Vue Router configuration
│   │   └── index.js
│   │
│   ├── services/        # API service layer
│   │   ├── api.js       # Axios instance and interceptors
│   │   └── README.md
│   │
│   ├── stores/          # Pinia stores
│   │   ├── auth.js      # Authentication state
│   │   ├── notification.js  # Notification messages
│   │   └── README.md
│   │
│   ├── views/           # Page components
│   │   ├── AnswerQcmView.vue
│   │   ├── CorrectionView.vue
│   │   ├── CreateQcmView.vue
│   │   ├── HomeView.vue
│   │   ├── LessonsView.vue
│   │   ├── LoginView.vue
│   │   ├── RegisterView.vue
│   │   └── SelectQcmView.vue
│   │
│   ├── App.vue          # Root component
│   └── main.js          # Application entry point
│
├── .env                 # Environment variables (not in git)
├── .env.example         # Example environment variables
├── babel.config.js      # Babel configuration
├── jsconfig.json        # JavaScript configuration
├── package.json         # Dependencies and scripts
└── vue.config.js        # Vue CLI configuration
```

## 📜 Available Scripts

### `npm run serve`

Starts the development server with hot reload.

- **URL**: http://localhost:8080
- **Hot Reload**: Enabled
- **Source Maps**: Enabled

### `npm run build`

Builds the app for production to the `dist` folder.

- **Minification**: Enabled
- **Optimization**: Enabled
- **Source Maps**: Enabled (can be disabled in vue.config.js)

### `npm run lint`

Lints and fixes JavaScript and Vue files.

- **ESLint**: Checks code quality
- **Auto-fix**: Fixes common issues automatically

## 🚀 Deployment

### Static Hosting

The built application is a static SPA (Single Page Application) that can be hosted on any static file server.

#### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to Netlify
3. Configure redirects for SPA routing:

Create `public/_redirects`:
```
/*    /index.html   200
```

#### Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Configure:
   - Build Command: `npm run build`
   - Output Directory: `dist`

#### GitHub Pages

1. Install gh-pages: `npm install -D gh-pages`
2. Add to package.json:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```
3. Run: `npm run deploy`

### Web Server

#### Nginx

```nginx
server {
    listen 80;
    server_name sosprepa.example.com;
    root /var/www/sosprepa/dist;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Apache

Create `.htaccess` in the `dist/` folder:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Environment Variables for Production

Create `.env.production`:

```env
VUE_APP_API_URL=https://api.sosprepa.example.com
VUE_APP_NAME=SOSprépa
```

Build with production environment:

```bash
npm run build
```

## 🔧 Customization

### Vue CLI Configuration

Edit `vue.config.js` to customize the build:

```javascript
module.exports = {
  // Change output directory
  outputDir: 'build',
  
  // Disable source maps in production
  productionSourceMap: false,
  
  // Configure dev server
  devServer: {
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
};
```

### Styling

- Global styles: `src/assets/styles.css`
- Component-specific styles: Use `<style scoped>` in Vue components
- CSS imports: Import in components or main.js

### Adding Dependencies

```bash
# Add a dependency
npm install package-name

# Add a dev dependency
npm install -D package-name
```

## 🐛 Troubleshooting

### "Network Error" when calling API

**Check**:
- Backend server is running
- `VUE_APP_API_URL` is correct in `.env`
- CORS is configured correctly on backend
- No firewall blocking the connection

### "Cannot find module" errors

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build fails

**Check**:
- Node.js version (should be v14+)
- Disk space available
- No syntax errors in code
- Run `npm run lint` to check for issues

### Hot reload not working

**Solution**:
- Restart dev server
- Clear browser cache
- Check file watcher limits (Linux):
  ```bash
  echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
  sudo sysctl -p
  ```

## 📚 Additional Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Axios Documentation](https://axios-http.com/)
- [Vue CLI Configuration Reference](https://cli.vuejs.org/config/)

## 🤝 Contributing

See the main [README.md](../README.md) for contribution guidelines.

## 📝 License

ISC License
