# MarkSprint FAQ & Troubleshooting Guide

## Frequently Asked Questions

### Q1: Where do the questions come from?

**A:** Questions are stored in `/public/questions.csv` file. This CSV file contains all the questions, options, and answers for all subjects. The app reads this file when you select a subject and filters questions by subject name.

**How it works:**
1. When you click "GO" on the index page, the app navigates to `/quiz/physics` (or other subject)
2. The quiz page fetches `/public/questions.csv`
3. It filters questions where `subject` column matches "physics"
4. Only those questions appear in the quiz

### Q2: Does the CSV follow the correct structure?

**A:** Yes, the CSV structure is:

```
sno,subject,vol,lesson,qno,question,question_image,option_1,option_1_image,option_2,option_2_image,option_3,option_3_image,option_4,option_4_image,answer,answer_image
```

**Important:**
- **Exact column order** - Don't rearrange columns
- **Subject lowercase** - Use `physics`, not `Physics`
- **Answer matches option** - The `answer` must be exactly one of the four options
- **17 columns total** - No more, no less

**Example row:**
```
1,physics,Vol1,1,1,What is H2O?,,Water,,Oxygen,,Hydrogen,,Helium,,Water,
```

### Q3: Does subject selection work?

**A:** Yes! The subject selection works as follows:

1. **Index page** shows 5 subjects: Physics, Chemistry, Maths, CS, Biology
2. Click arrows to browse subjects
3. Click "SELECT" to choose a subject
4. Click "GO" to navigate to quiz page
5. Quiz page URL becomes `/quiz/physics` (lowercase)
6. App filters CSV by `subject=physics`
7. Only physics questions appear

**If it's not working:**
- Check CSV has `subject` column with lowercase names
- Verify subject names match: `physics`, `chemistry`, `maths`, `cs`, `biology`
- Check browser console for errors
- Clear browser cache

### Q4: How do I deploy the app?

**A:** There are 3 main ways:

**Option 1: Web Browser (Recommended)**
- Build: `npm run build`
- Deploy `dist/` folder to Vercel, Netlify, or GitHub Pages
- App runs in any browser

**Option 2: Desktop App**
- Use Electron to wrap the web app
- Runs as standalone desktop application
- Works on Windows, Mac, Linux

**Option 3: Mobile App**
- Use React Native or Expo
- Runs on iOS and Android

See `DEPLOYMENT_GUIDE.md` for detailed steps.

**For deployment, you need:**
- Only the `dist/` folder (after building)
- The `public/questions.csv` file (included in dist)
- No backend server required

### Q5: What files do I need to deploy?

**A:** Only the `dist/` folder after running `npm run build`. This includes:
- `index.html` - Main HTML file
- `assets/` - JavaScript and CSS bundles
- `questions.csv` - Question database

**You DON'T need:**
- `src/` folder
- `node_modules/` folder
- `package.json` (only for development)

### Q6: How do I add more questions?

**A:** Edit `/public/questions.csv`:

1. Open the file in Excel or Google Sheets
2. Add new rows with the correct structure
3. Save as CSV
4. Restart dev server or redeploy

**CSV structure reminder:**
```
sno,subject,vol,lesson,qno,question,question_image,option_1,option_1_image,option_2,option_2_image,option_3,option_3_image,option_4,option_4_image,answer,answer_image
```

### Q7: How do I convert a PDF to CSV?

**A:** Use the AI prompt in `AI_PROMPT_PDF_TO_CSV.md`. Steps:

1. Copy the prompt from `AI_PROMPT_PDF_TO_CSV.md`
2. Paste into ChatGPT, Claude, or Gemini
3. Replace placeholder with your PDF content
4. AI generates CSV
5. Copy CSV and paste into `public/questions.csv`

See `AI_PROMPT_PDF_TO_CSV.md` for detailed instructions.

### Q8: Why doesn't LaTeX/MathJax work?

**A:** LaTeX rendering requires:

1. **Correct syntax:**
   - Inline: `$expression$` (e.g., `$\alpha + \beta$`)
   - Display: `$$expression$$` (e.g., `$$\frac{1}{2}$$`)

2. **MathJax CDN accessible** - Requires internet connection

3. **Proper escaping** - In CSV:
   - Use `$$` for display math
   - Use `$` for inline math
   - Don't escape the `$` signs

**Example in CSV:**
```
What is $$\frac{1}{2}$$?,
What is $\alpha + \beta$?,
```

**If not rendering:**
- Check browser console for MathJax errors
- Verify internet connection
- Test syntax at https://www.mathjax.org/
- Restart dev server

### Q9: How do I enable/disable features?

**A:** On the quiz setup page:

| Feature | Default | Purpose |
|---------|---------|---------|
| Repeat Wrong | ON | Re-quiz wrong answers at end |
| Shuffle Questions | ON | Randomize question order |
| Shuffle Options | ON | Randomize answer options |
| Timer | OFF | Time limit per question |
| Question Count | ALL | Limit number of questions |

Toggle these before starting the quiz.

### Q10: Can I use images in questions?

**A:** Yes! Add image URLs to these columns:
- `question_image` - Image for the question
- `option_1_image` to `option_4_image` - Images for options
- `answer_image` - Image for answer explanation

**Image requirements:**
- Must be direct URLs (e.g., `https://example.com/image.png`)
- Supported formats: PNG, JPG, WebP
- Keep file sizes small (<500KB)

**Example:**
```
question_image: https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Benzene-2D-skeletal.png/220px-Benzene-2D-skeletal.png
```

---

## Troubleshooting Guide

### Problem: Questions not loading

**Symptoms:** Quiz setup page shows "Loading questions..." forever

**Solutions:**
1. Check `/public/questions.csv` exists
2. Verify CSV has correct headers
3. Check browser console for errors
4. Ensure subject name in CSV is lowercase
5. Restart dev server: `npm run dev`

**Debug:**
```javascript
// In browser console:
fetch('/questions.csv').then(r => r.text()).then(console.log)
```

### Problem: Subject filter not working

**Symptoms:** Wrong questions appear for selected subject

**Solutions:**
1. Check CSV `subject` column has lowercase names
2. Verify subject names: `physics`, `chemistry`, `maths`, `cs`, `biology`
3. Check URL: should be `/quiz/physics` (lowercase)
4. Clear browser cache: Ctrl+Shift+Delete

**Example CSV:**
```
sno,subject,vol,lesson,qno,question,...
1,physics,Vol1,1,1,What is H2O?,...
2,chemistry,Vol1,1,1,What is pH?,...
```

### Problem: LaTeX/Math not rendering

**Symptoms:** Math shows as `$\alpha$` instead of α

**Solutions:**
1. Check internet connection (MathJax needs CDN)
2. Verify LaTeX syntax:
   - Inline: `$...$`
   - Display: `$$...$$`
3. Check browser console for MathJax errors
4. Restart dev server
5. Clear browser cache

**Test LaTeX:**
```
Question: What is $$x^2 + y^2$$?
Should render as: x² + y²
```

### Problem: Answers not matching

**Symptoms:** Correct answer marked as wrong

**Solutions:**
1. Check `answer` column matches option EXACTLY
2. Case-sensitive: "Water" ≠ "water"
3. No extra spaces: "Water " ≠ "Water"
4. Special characters must match

**Example (WRONG):**
```
option_1: Water
option_2: Oxygen
answer: water  ← WRONG (lowercase)
```

**Example (CORRECT):**
```
option_1: Water
option_2: Oxygen
answer: Water  ← CORRECT (exact match)
```

### Problem: CSV parsing errors

**Symptoms:** App crashes or shows parsing error

**Solutions:**
1. Check for unescaped quotes in text
   - Wrong: `He said "hello"`
   - Right: `He said ""hello""`
2. Check for commas in text
   - Wrong: `Option A, Part 1`
   - Right: `"Option A, Part 1"`
3. Verify 17 columns exactly
4. No extra blank rows at end
5. Use proper CSV format (not Excel format)

**Validate CSV:**
```bash
# Check column count
head -1 questions.csv | tr ',' '\n' | wc -l  # Should be 17
```

### Problem: Timer not working

**Symptoms:** Timer doesn't appear or doesn't count down

**Solutions:**
1. Check timer is not set to "OFF"
2. Verify timer value: 5, 10, or 15 seconds
3. Check browser console for errors
4. Restart dev server

### Problem: Shuffle not working

**Symptoms:** Questions or options always in same order

**Solutions:**
1. Check "Shuffle Questions" toggle is ON
2. Check "Shuffle Options" toggle is ON
3. Refresh page
4. Clear browser cache

### Problem: App not loading on mobile

**Symptoms:** Blank screen or styling broken on phone

**Solutions:**
1. Check responsive CSS in `Quiz.css`
2. Use mobile-friendly viewport
3. Test in Chrome DevTools mobile mode
4. Check console for JavaScript errors

### Problem: Deployment not working

**Symptoms:** App works locally but not after deployment

**Solutions:**
1. Check `questions.csv` is in `public/` folder
2. Verify build succeeded: `npm run build`
3. Check `dist/` folder has all files
4. Verify deployment includes `public/` files
5. Check browser console for 404 errors

**For Vercel/Netlify:**
- Ensure `public/` folder is included
- Set build command: `npm run build`
- Set publish directory: `dist`

### Problem: Performance slow

**Symptoms:** App lags or takes long to load

**Solutions:**
1. Optimize images (use WebP format)
2. Reduce number of questions in CSV
3. Use `npm run build` for production
4. Enable browser caching
5. Reduce image file sizes

---

## Performance Optimization

### CSV Optimization
- Keep questions under 10,000 rows
- Use small image files (<500KB each)
- Remove unused columns

### Browser Optimization
- Clear cache regularly
- Use latest browser version
- Disable browser extensions
- Use incognito mode for testing

### Deployment Optimization
- Use CDN for images
- Enable gzip compression
- Minify CSS/JS (automatic with build)
- Use lazy loading for images

---

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Recommended |
| Firefox | ✅ Full | Works great |
| Safari | ✅ Full | iOS and Mac |
| Edge | ✅ Full | Windows |
| IE 11 | ❌ No | Not supported |

---

## Common Error Messages

### "Error loading questions"
- Check CSV file exists at `/public/questions.csv`
- Verify CSV format is correct
- Check browser console for details

### "Cannot read property 'question' of undefined"
- CSV has empty rows
- Subject filter returned no results
- Check subject name in CSV

### "MathJax is not defined"
- MathJax CDN not loaded
- Check internet connection
- Verify script tag in HTML

### "CORS error"
- CSV not in public folder
- Server not configured for CORS
- Check deployment settings

---

## Getting Help

1. **Check browser console** (F12 → Console tab)
2. **Review error messages** carefully
3. **Check CSV structure** matches specification
4. **Verify subject names** are lowercase
5. **Test locally** before deploying
6. **Clear cache** and restart

---

## Quick Checklist

Before going live:

- [ ] CSV has 17 columns
- [ ] Subject names are lowercase
- [ ] Answers match options exactly
- [ ] LaTeX syntax is correct
- [ ] Images load properly
- [ ] Quiz flow works: Index → Setup → Active → Result
- [ ] All subjects have questions
- [ ] Build succeeds: `npm run build`
- [ ] No errors in browser console
- [ ] Responsive on mobile
