# PixelForge — Image Toolkit

A fully client-side image toolkit built with React + Vite. No backend. No uploads. 100% private.

## Features

| Tool | What it does |
|---|---|
| 🔄 Convert | PNG, JPEG, WebP, BMP, GIF |
| 📐 Resize | Custom px, presets (1080p, Instagram, OG…), aspect lock, 3 methods |
| 💾 Compress | Quality slider, format picker, max-dimension cap |
| ✂️ Crop | Manual offsets or 8 aspect ratio presets |
| 🎨 Filters | Brightness, contrast, saturation, hue, blur + 10 presets |
| 🔏 Watermark | Text, color, opacity, size, 6 positions, tile mode, angle |
| ↺ Rotate | 0 / 90 / 180 / 270° + horizontal & vertical flip |

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
# output is in /dist
```

## Deploy

### Vercel (recommended — free)
```bash
npm i -g vercel
vercel
```

### Netlify drag-and-drop
1. Run `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist/` folder onto the page

### GitHub Pages
1. Push repo to GitHub
2. Add `base: '/your-repo-name/'` in vite.config.js
3. Run `npm run build` then deploy `dist/` to gh-pages branch

## Tech stack
- React 18, Vite 6, react-dropzone, HTML5 Canvas API
