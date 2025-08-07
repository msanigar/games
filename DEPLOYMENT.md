# Deployment Guide

This guide covers how to deploy the Game Suite to various platforms.

## 🚀 Quick Deploy Options

### Netlify (Recommended)

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Drag and drop the `dist` folder to [netlify.com](https://netlify.com)
   - Or connect your GitHub repository for automatic deployments

### Vercel

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect it's a Vite project

2. **Automatic deployment**:
   - Every push to main branch triggers a new deployment
   - Preview deployments for pull requests

### GitHub Pages

1. **Add GitHub Pages workflow**:
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: 18
         - run: npm ci
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select "Deploy from a branch"
   - Choose `gh-pages` branch

## 🔧 Build Configuration

### Environment Variables

Create `.env` file for production:
```env
VITE_APP_TITLE=Game Suite
VITE_APP_VERSION=1.0.0
```

### Build Optimization

The project is already optimized with:
- ✅ Tree shaking
- ✅ Code splitting
- ✅ Minification
- ✅ Gzip compression (on most platforms)

## 📱 PWA Support (Optional)

To add Progressive Web App features:

1. **Install PWA plugin**:
   ```bash
   npm install -D vite-plugin-pwa
   ```

2. **Update vite.config.ts**:
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import { VitePWA } from 'vite-plugin-pwa'

   export default defineConfig({
     plugins: [
       react(),
       VitePWA({
         registerType: 'autoUpdate',
         workbox: {
           globPatterns: ['**/*.{js,css,html,ico,png,svg}']
         }
       })
     ]
   })
   ```

## 🌐 Custom Domain

### Netlify
1. Go to Site settings → Domain management
2. Add custom domain
3. Update DNS records as instructed

### Vercel
1. Go to Project settings → Domains
2. Add your domain
3. Update DNS records

## 📊 Performance Monitoring

### Vercel Analytics
```bash
npm install @vercel/analytics
```

### Google Analytics
Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

## 🔒 Security Headers

### Netlify
Create `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Vercel
Create `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## 🎯 Recommended Setup

For the Game Suite, I recommend:

1. **Netlify** for simplicity and free tier
2. **Custom domain** for branding
3. **Automatic deployments** from GitHub
4. **Performance monitoring** with built-in analytics

## 🚨 Troubleshooting

### Build Errors
- Check Node.js version (18+ required)
- Clear `node_modules` and reinstall
- Check for TypeScript errors

### Deployment Issues
- Verify build output in `dist/` folder
- Check platform-specific requirements
- Review deployment logs

### Performance Issues
- Enable gzip compression
- Optimize images
- Use CDN for static assets

## 📈 Analytics Setup

### Simple Analytics
Add to `index.html`:
```html
<script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
<noscript><img src="https://queue.simpleanalyticscdn.com/noscript.gif" alt="" referrerpolicy="no-referrer-when-downgrade" /></noscript>
```

### Google Analytics 4
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

The Game Suite is ready for production deployment! 🎮 