# MarkSprint CSV Structure Guide

## Overview

MarkSprint now uses **subject-specific CSV files** instead of a single large file. This approach is more efficient for handling thousands of questions per subject.

## File Organization

Each subject has its own CSV file in the `/public` folder:

```
public/
├── physics.csv
├── chemistry.csv
├── maths.csv
├── cs.csv
└── biology.csv
```

When a user selects a subject, the app loads only that subject's CSV file.

## CSV Column Structure

Each CSV file must have exactly **16 columns** in this order:

```
sno,vol,lesson,qno,question,question_image,option_1,option_1_image,option_2,option_2_image,option_3,option_3_image,option_4,option_4_image,answer,answer_image
```

### Column Descriptions

| Column | Description | Example | Required |
|--------|-------------|---------|----------|
| `sno` | Serial number (unique per subject) | 1, 2, 3... | ✅ Yes |
| `vol` | Volume (Vol1 or Vol2) | Vol1, Vol2 | ✅ Yes |
| `lesson` | Lesson number | 1, 2, 3, 4... | ✅ Yes |
| `qno` | Question number within lesson | 1, 2, 3... | ✅ Yes |
| `question` | Question text (supports LaTeX & HTML) | What is H₂O? | ✅ Yes |
| `question_image` | URL to question image | https://example.com/img.png | ❌ Optional |
| `option_1` | First option (supports LaTeX & HTML) | Water | ✅ Yes |
| `option_1_image` | Image for option 1 | https://example.com/opt1.png | ❌ Optional |
| `option_2` | Second option | Oxygen | ✅ Yes |
| `option_2_image` | Image for option 2 | (leave empty) | ❌ Optional |
| `option_3` | Third option | Hydrogen | ✅ Yes |
| `option_3_image` | Image for option 3 | (leave empty) | ❌ Optional |
| `option_4` | Fourth option | Helium | ✅ Yes |
| `option_4_image` | Image for option 4 | (leave empty) | ❌ Optional |
| `answer` | Correct answer (MUST match one option exactly) | Water | ✅ Yes |
| `answer_image` | Image for answer explanation | (optional) | ❌ Optional |

## LaTeX/MathJax Support

### For Math Questions (Physics, Maths, CS)

Use LaTeX notation for mathematical expressions:

**Inline math** (within text):
```
$expression$
```

**Display math** (on separate line):
```
$$expression$$
```

### Examples

| Math | LaTeX | CSV Example |
|------|-------|-------------|
| Fraction | `$$\frac{1}{2}$$` | `What is $$\frac{1}{2}$$ + $$\frac{1}{3}$$?` |
| Power | `$$x^2$$` | `Solve $$x^2 = 4$$` |
| Square root | `$$\sqrt{x}$$` | `What is $$\sqrt{16}$$?` |
| Greek letter | `$$\alpha$$` | `What is $$\alpha + \beta$$?` |
| Subscript | `$$H_2O$$` | `What is $$H_2O$$?` |
| Matrix | `$$\begin{vmatrix}1&2\\3&4\end{vmatrix}$$` | `Determinant of $$\begin{vmatrix}1&2\\3&4\end{vmatrix}$$?` |
| Integral | `$$\int x \, dx$$` | `What is $$\int x \, dx$$?` |
| Summation | `$$\sum_{i=1}^{n}$$` | `What is $$\sum_{i=1}^{n} i$$?` |

### For Chemistry Questions

Use HTML subscripts and superscripts:

**Subscripts** (for chemical formulas):
```
H<sub>2</sub>O
H<sub>2</sub>SO<sub>4</sub>
CH<sub>4</sub>
```

**Superscripts** (for charges):
```
Ca<sup>2+</sup>
Cl<sup>-</sup>
```

**Combined**:
```
H<sub>2</sub>SO<sub>4</sub> (Sulfuric acid)
CaCO<sub>3</sub> (Calcium carbonate)
```

### For Complex Chemistry with Math

Combine HTML and LaTeX:
```
The oxidation state of Oxygen in H<sub>2</sub>O is $$-2$$
```

## Example CSV Rows

### Physics Question (with LaTeX)
```
1,Vol1,1,1,What is the determinant of $$\begin{vmatrix}1 & 2 \\ 3 & 4\end{vmatrix}$$?,,$$-2$$,,$$2$$,,$$1$$,,$$0$$,,$$-2$$,
```

### Chemistry Question (with HTML subscripts)
```
3,Vol1,2,3,What is H<sub>2</sub>SO<sub>4</sub>?,,Hydrochloric acid,,Sulfuric acid,,Nitric acid,,Phosphoric acid,,Sulfuric acid,
```

### Maths Question (with LaTeX matrix)
```
10,Vol2,1,10,What is the determinant of $$\begin{vmatrix}2 & 1 \\ 3 & 4\end{vmatrix}$$?,,$$5$$,,$$8$$,,$$11$$,,$$14$$,,$$5$$,
```

### Biology Question (with LaTeX formula)
```
9,Vol2,1,9,What is the formula for photosynthesis?,,$$6CO_2 + 6H_2O \rightarrow C_6H_{12}O_6 + 6O_2$$,,$$C_6H_{12}O_6 + O_2 \rightarrow CO_2 + H_2O$$,,$$6CO_2 + O_2 \rightarrow C_6H_{12}O_6$$,,$$H_2O + CO_2 \rightarrow O_2$$,,$$6CO_2 + 6H_2O \rightarrow C_6H_{12}O_6 + 6O_2$$,
```

## Important Rules

### 1. Answer Matching
- The `answer` column MUST match one of the four options EXACTLY
- Case-sensitive: "Water" ≠ "water"
- No extra spaces: "Water " ≠ "Water"
- Must include LaTeX/HTML if option has it

**Example (CORRECT):**
```
option_1: $$-2$$
option_2: $$2$$
answer: $$-2$$
```

**Example (WRONG):**
```
option_1: $$-2$$
option_2: $$2$$
answer: -2  ← WRONG (missing $$)
```

### 2. CSV Formatting
- Commas in text: Wrap in quotes `"Option A, Part 1"`
- Quotes in text: Escape with double quotes `"He said ""hello"""`
- No extra blank rows at end
- 16 columns exactly

### 3. LaTeX Syntax
- Use `$$` for display math (on separate line)
- Use `$` for inline math (within text)
- Escape backslashes if needed: `\\` becomes `\`
- Test at https://www.mathjax.org/

### 4. HTML Syntax
- Use `<sub>` for subscripts: `H<sub>2</sub>O`
- Use `<sup>` for superscripts: `Ca<sup>2+</sup>`
- Close tags properly: `</sub>`, `</sup>`
- Don't mix with LaTeX in same element

### 5. Image URLs
- Must be direct URLs (end with .png, .jpg, etc.)
- Should be accessible from browser
- Keep file sizes small (<500KB)
- Test URLs before adding

## CSV Validation Checklist

Before using a CSV file:

- [ ] File named correctly: `physics.csv`, `chemistry.csv`, etc.
- [ ] 16 columns exactly
- [ ] Header row present and correct
- [ ] All required columns filled
- [ ] Answers match options exactly
- [ ] LaTeX syntax correct (test at mathjax.org)
- [ ] HTML tags properly closed
- [ ] No extra blank rows
- [ ] CSV opens correctly in Excel/Google Sheets
- [ ] No unescaped commas or quotes

## Creating CSV Files

### Option 1: Excel/Google Sheets
1. Create spreadsheet with 16 columns
2. Add header row
3. Fill in data
4. Export as CSV
5. Save to `/public/{subject}.csv`

### Option 2: Text Editor
1. Create file: `physics.csv`
2. Add header: `sno,vol,lesson,qno,question,question_image,option_1,option_1_image,option_2,option_2_image,option_3,option_3_image,option_4,option_4_image,answer,answer_image`
3. Add rows (one per line)
4. Save to `/public/physics.csv`

### Option 3: AI Conversion
Use the AI prompt in `AI_PROMPT_PDF_TO_CSV.md` to convert PDF questions to CSV format.

## Troubleshooting

### Questions not loading
- Check CSV file exists in `/public/` folder
- Verify filename matches subject: `physics.csv`, not `Physics.csv`
- Check browser console for errors
- Verify CSV has header row

### LaTeX not rendering
- Check syntax: `$$...$$` for display, `$...$` for inline
- Test at https://www.mathjax.org/
- Ensure internet connection (MathJax uses CDN)
- Check browser console for MathJax errors

### Chemical formulas showing weird symbols
- Use HTML subscripts: `H<sub>2</sub>O`
- Don't use LaTeX for subscripts: `H_2O` won't work for chemistry
- Close tags properly: `</sub>`
- Test in browser before deploying

### Answer not matching
- Verify `answer` matches option exactly
- Check for extra spaces
- Include LaTeX/HTML if option has it
- Case-sensitive matching

### CSV parsing errors
- Check for unescaped commas: `"Option A, Part 1"`
- Check for unescaped quotes: `"He said ""hello"""`
- Verify 16 columns exactly
- No extra blank rows

## Performance Tips

1. **Limit questions per CSV**: 1000-5000 questions per subject is optimal
2. **Optimize images**: Use WebP or compressed JPG
3. **Use CDN for images**: Faster loading
4. **Batch load**: App loads only selected questions

## Example: Complete Physics CSV

```csv
sno,vol,lesson,qno,question,question_image,option_1,option_1_image,option_2,option_2_image,option_3,option_3_image,option_4,option_4_image,answer,answer_image
1,Vol1,1,1,What is $$F = ma$$?,,Force equals mass times acceleration,,Force equals mass plus acceleration,,Force equals mass divided by acceleration,,Force equals mass times velocity,,Force equals mass times acceleration,
2,Vol1,1,2,What is the SI unit of force?,,Newton,,Joule,,Watt,,Pascal,,Newton,
3,Vol1,2,3,What is the determinant of $$\begin{vmatrix}1 & 2 \\ 3 & 4\end{vmatrix}$$?,,$$-2$$,,$$2$$,,$$1$$,,$$0$$,,$$-2$$,
```

## Support

For issues with CSV structure:
1. Check this guide
2. Review example CSVs in `/public/`
3. Test LaTeX at https://www.mathjax.org/
4. Check browser console for errors
5. Validate CSV format at https://csvlint.io/
