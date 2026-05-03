# MarkSprint Deployment Guide

## Project Structure

```
marksprint/
├── src/
│   ├── components/
│   │   ├── Galaxy.jsx          # Starfield background effect
│   │   ├── ClickSpark.jsx      # Click particle effect
│   │   └── MagicRings.jsx      # Ring animation effect
│   ├── styles/
│   │   ├── Quiz.css            # Quiz and result page styles
│   │   └── Galaxy.css          # Galaxy background styles
│   ├── App.jsx                 # Index/Home page
│   ├── quiz.jsx                # Quiz page (setup, active, result)
│   ├── App.css                 # Global and index page styles
│   ├── index.css               # Base CSS reset
│   └── main.jsx                # React entry point
├── public/
│   └── questions.csv           # Question database (CSV format)
├── index.html                  # HTML entry point
├── package.json                # Dependencies
└── vite.config.js              # Vite configuration
```

## CSV Structure

The `questions.csv` file must follow this exact column order:

```
sno,subject,vol,lesson,qno,question,question_image,option_1,option_1_image,option_2,option_2_image,option_3,option_3_image,option_4,option_4_image,answer,answer_image
```

### Column Descriptions

| Column | Description | Example |
|--------|-------------|---------|
| `sno` | Serial number | 1, 2, 3... |
| `subject` | Subject name (lowercase) | physics, chemistry, maths, cs, biology |
| `vol` | Volume (Vol1 or Vol2) | Vol1, Vol2 |
| `lesson` | Lesson number | 1, 2, 3, 4... |
| `qno` | Question number within lesson | 1, 2, 3... |
| `question` | Question text (supports LaTeX) | What is $$H_2O$$? |
| `question_image` | URL to question image | https://example.com/image.png |
| `option_1` | First option (supports LaTeX) | Water |
| `option_1_image` | Image for option 1 | https://example.com/opt1.png |
| `option_2` | Second option | Oxygen |
| `option_2_image` | Image for option 2 | (leave empty if not needed) |
| `option_3` | Third option | Hydrogen |
| `option_3_image` | Image for option 3 | (leave empty if not needed) |
| `option_4` | Fourth option | Helium |
| `option_4_image` | Image for option 4 | (leave empty if not needed) |
| `answer` | Correct answer (must match one option exactly) | Water |
| `answer_image` | Image for answer explanation | (optional) |

### LaTeX/MathJax Support

Questions and options support LaTeX math notation:

- **Inline math**: Use `$...$` (e.g., `What is $\alpha + \beta$?`)
- **Display math**: Use `$$...$$` (e.g., `$$\begin{vmatrix}1 & 2 \\ 3 & 4\end{vmatrix}$$`)

Common LaTeX examples:
- Fractions: `$$\frac{1}{2}$$`
- Greek letters: `$$\alpha, \beta, \gamma$$`
- Subscripts: `$$H_2O$$`
- Superscripts: `$$x^2$$`
- Integrals: `$$\int x \, dx$$`
- Matrices: `$$\begin{vmatrix}a & b \\ c & d\end{vmatrix}$$`

## Deployment Options

### Option 1: Deploy to Browser (Vercel, Netlify, GitHub Pages)

#### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- Git account

#### Steps

1. **Build the project**:
   ```bash
   npm run build
   ```
   This creates a `dist/` folder with optimized files.

2. **Deploy to Vercel** (Recommended):
   ```bash
   npm install -g vercel
   vercel
   ```
   Follow the prompts. Vercel will automatically detect it's a Vite project.

3. **Deploy to Netlify**:
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`

4. **Deploy to GitHub Pages**:
   ```bash
   npm run build
   git add dist/
   git commit -m "Deploy"
   git push origin main
   ```

#### Files to Deploy
Only the `dist/` folder contents need to be deployed. This includes:
- Bundled JavaScript
- CSS files
- `questions.csv` (from public folder)
- `index.html`

### Option 2: Deploy as a Desktop/Mobile App

#### Using Electron (Desktop)

1. **Install Electron**:
   ```bash
   npm install --save-dev electron electron-builder
   ```

2. **Create `electron-main.js`** in project root:
   ```javascript
   const { app, BrowserWindow } = require('electron');
   const path = require('path');

   function createWindow() {
     const win = new BrowserWindow({
       width: 1200,
       height: 800,
       webPreferences: {
         preload: path.join(__dirname, 'preload.js')
       }
     });
     win.loadFile('dist/index.html');
   }

   app.on('ready', createWindow);
   ```

3. **Update `package.json`**:
   ```json
   {
     "main": "electron-main.js",
     "homepage": "./",
     "scripts": {
       "electron": "electron .",
       "electron-dev": "npm start & electron .",
       "electron-build": "npm run build && electron-builder"
     }
   }
   ```

#### Using React Native (Mobile)

Use Expo or React Native CLI to wrap the web app for iOS/Android.

### Option 3: Deploy as a Progressive Web App (PWA)

1. **Create `public/manifest.json`**:
   ```json
   {
     "name": "MarkSprint",
     "short_name": "MarkSprint",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#ffffff",
     "theme_color": "#0b1f2a",
     "icons": [
       {
         "src": "/icon-192.png",
         "sizes": "192x192",
         "type": "image/png"
       }
     ]
   }
   ```

2. **Create `public/service-worker.js`** for offline support.

3. **Update `index.html`**:
   ```html
   <link rel="manifest" href="/manifest.json">
   ```

## Local Development

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   Server runs at `http://localhost:5173`

3. **Build for production**:
   ```bash
   npm run build
   ```

### Adding Questions

1. Edit `public/questions.csv` with the exact structure above
2. Ensure all subjects match: `physics`, `chemistry`, `maths`, `cs`, `biology`
3. Restart the dev server to see changes

## Subject Selection Flow

The app follows this flow:

1. **Index Page** (`/`) - Select subject from Physics, Chemistry, Maths, CS, Biology
2. **Quiz Setup** (`/quiz/:subject`) - Customize quiz settings:
   - Quiz type: Full, Volume-wise, or Lesson-wise
   - Repeat wrong answers toggle
   - Shuffle questions/options toggle
   - Timer per question (OFF, 5s, 10s, 15s)
   - Number of questions (ALL, 10, 20, 30)
3. **Quiz Active** - Answer questions with instant feedback
4. **Result** - View accuracy, score, and time taken

## Troubleshooting

### Questions not loading
- Check `public/questions.csv` exists
- Verify CSV has correct column headers
- Check browser console for parsing errors

### LaTeX not rendering
- Ensure MathJax CDN is accessible
- Use correct LaTeX syntax: `$...$` for inline, `$$...$$` for display
- Check browser console for MathJax errors

### Subject not filtering correctly
- Verify `subject` column in CSV matches lowercase subject names
- Check URL parameter: `/quiz/physics` should have `subject=physics` in CSV

### Styling issues
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server
- Check for CSS conflicts in browser DevTools

## Performance Tips

1. **Optimize images**: Use WebP format for question images
2. **Lazy load**: Questions load only when needed
3. **Cache**: Browser caches CSV after first load
4. **Compress**: Build process automatically minifies code

## Security Notes

- CSV is served from public folder (no sensitive data)
- No backend API calls (fully client-side)
- User data stored in browser localStorage only
- No external API keys required

## Support

For issues or questions, check:
- Browser console for errors
- Network tab for failed requests
- CSV structure matches specification
