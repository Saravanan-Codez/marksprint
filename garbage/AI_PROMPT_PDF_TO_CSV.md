# AI Prompt for Converting PDF Questions to CSV

Use this prompt with any AI chatbot (ChatGPT, Claude, Gemini, etc.) to convert your PDF question papers into the required CSV format.

---

## Prompt Template

```
I have a PDF file with exam questions that I need to convert into a CSV file for my MarkSprint quiz application.

IMPORTANT REQUIREMENTS:
1. The CSV must have EXACTLY these columns in this order:
   sno,subject,vol,lesson,qno,question,question_image,option_1,option_1_image,option_2,option_2_image,option_3,option_3_image,option_4,option_4_image,answer,answer_image

2. Column specifications:
   - sno: Sequential number (1, 2, 3...)
   - subject: Subject name in LOWERCASE (physics, chemistry, maths, cs, biology)
   - vol: Volume (Vol1 or Vol2)
   - lesson: Lesson number (1, 2, 3, 4...)
   - qno: Question number within lesson (1, 2, 3...)
   - question: The question text
   - question_image: URL to question image (or leave empty)
   - option_1 to option_4: The four answer options
   - option_1_image to option_4_image: URLs for option images (or leave empty)
   - answer: The correct answer (MUST match one of the options EXACTLY)
   - answer_image: URL for answer explanation image (or leave empty)

3. LaTeX/Math Support:
   - For mathematical expressions, use LaTeX format:
     - Inline math: $expression$ (e.g., $\alpha + \beta$)
     - Display math: $$expression$$ (e.g., $$\frac{1}{2}$$)
   - Examples:
     - Subscripts: $H_2O$
     - Fractions: $$\frac{numerator}{denominator}$$
     - Greek letters: $\alpha, \beta, \gamma$
     - Matrices: $$\begin{vmatrix}a & b \\ c & d\end{vmatrix}$$

4. CSV Formatting Rules:
   - Escape quotes in text with double quotes: "He said ""hello"""
   - If a cell contains commas, wrap it in quotes: "Option A, Part 1"
   - Leave image URL columns empty if not applicable
   - Do NOT include row numbers or extra columns
   - First row must be the header

5. Subject Names (use EXACTLY):
   - physics
   - chemistry
   - maths
   - cs
   - biology

TASK: Convert the following PDF content into the CSV format:

[PASTE YOUR PDF CONTENT HERE]

OUTPUT: Provide the complete CSV with all rows. Format it as a code block with triple backticks (```csv ... ```).
```

---

## Step-by-Step Instructions

### For ChatGPT/Claude/Gemini:

1. **Copy the prompt above** and paste it into the AI chatbot

2. **Replace the placeholder** `[PASTE YOUR PDF CONTENT HERE]` with:
   - Copy-paste text from your PDF
   - Or describe the questions if PDF text extraction doesn't work

3. **Specify the subject** in the prompt:
   ```
   Subject: Physics
   Volume: Vol1
   Lessons: 1-4
   ```

4. **Provide sample questions** in this format:
   ```
   Question 1: What is H2O?
   A) Water
   B) Oxygen
   C) Hydrogen
   D) Helium
   Answer: A) Water
   
   Question 2: What is α + β?
   A) γ
   B) α+β
   C) δ
   D) θ
   Answer: B) α+β
   ```

5. **Review the output** and copy the CSV

6. **Paste into `public/questions.csv`** in your MarkSprint project

---

## Example Conversion

### Input (from PDF):
```
PHYSICS - VOLUME 1 - LESSON 1

1. What is H2O?
   A) Water
   B) Oxygen
   C) Hydrogen
   D) Helium
   Answer: Water

2. What is α + β?
   A) γ
   B) α+β
   C) δ
   D) θ
   Answer: α+β
```

### Output (CSV):
```csv
sno,subject,vol,lesson,qno,question,question_image,option_1,option_1_image,option_2,option_2_image,option_3,option_3_image,option_4,option_4_image,answer,answer_image
1,physics,Vol1,1,1,What is H2O?,,Water,,Oxygen,,Hydrogen,,Helium,,Water,
2,physics,Vol1,1,2,What is $\alpha + \beta$?,,γ,,α+β,,δ,,θ,,α+β,
```

---

## Advanced Prompt (For Complex PDFs)

If your PDF has images or complex formatting, use this enhanced prompt:

```
I need to convert a complex PDF exam paper into CSV format for MarkSprint quiz app.

The PDF contains:
- Text questions
- Mathematical equations (convert to LaTeX)
- Embedded images (provide image URLs or I'll upload them)
- Multiple choice options

CSV Structure Required:
sno,subject,vol,lesson,qno,question,question_image,option_1,option_1_image,option_2,option_2_image,option_3,option_3_image,option_4,option_4_image,answer,answer_image

Subject: [SPECIFY]
Volume: [Vol1/Vol2]
Lessons: [SPECIFY]

For images in the PDF:
1. I will provide image URLs
2. Or describe the images and I'll suggest placeholder URLs
3. Or I can upload images separately

PDF Content:
[PASTE HERE]

Image URLs (if any):
[LIST HERE]

Please convert to CSV format with:
- All math in LaTeX format
- Proper escaping for special characters
- Correct answer matching one option exactly
```

---

## Tips for Best Results

### 1. **Math Equations**
- Always use LaTeX format for math
- Test with MathJax: https://www.mathjax.org/
- Common patterns:
  ```
  Fractions: $$\frac{a}{b}$$
  Powers: $$x^2$$
  Roots: $$\sqrt{x}$$
  Summation: $$\sum_{i=1}^{n}$$
  ```

### 2. **Answer Matching**
- The `answer` column MUST match one of the four options EXACTLY
- Case-sensitive matching
- Include special characters if present

### 3. **Image URLs**
- Use direct image URLs (ends with .png, .jpg, etc.)
- Test URLs before adding to CSV
- For local images, upload to cloud service (Imgur, Cloudinary, etc.)

### 4. **Special Characters**
- Commas in text: Wrap in quotes `"Option A, Part 1"`
- Quotes in text: Escape with double quotes `"He said ""hello"""`
- Newlines: Use `\n` or keep on single line

### 5. **Validation**
After conversion, verify:
- All 17 columns present
- Subject names are lowercase
- Answers match options exactly
- No extra commas breaking CSV structure
- LaTeX syntax is correct

---

## Troubleshooting AI Conversion

### Issue: AI adds extra columns
**Solution**: Specify "EXACTLY 17 columns" in the prompt

### Issue: Math not in LaTeX
**Solution**: Ask AI to "Convert all mathematical expressions to LaTeX format"

### Issue: Answer doesn't match options
**Solution**: Ask AI to "Ensure the answer column matches one of the four options exactly"

### Issue: CSV formatting errors
**Solution**: Ask AI to "Format as valid CSV with proper escaping"

---

## Batch Processing Multiple PDFs

To convert multiple PDF files:

```
I have 5 PDF files with exam questions for different subjects:
1. Physics_Vol1.pdf
2. Chemistry_Vol1.pdf
3. Maths_Vol2.pdf
4. CS_Vol1.pdf
5. Biology_Vol2.pdf

Please convert each to CSV format with the structure:
sno,subject,vol,lesson,qno,question,question_image,option_1,option_1_image,option_2,option_2_image,option_3,option_3_image,option_4,option_4_image,answer,answer_image

Then combine all into a single CSV file with:
- Unique sno across all subjects
- Correct subject names (lowercase)
- Correct volume assignments

[PASTE ALL PDF CONTENTS]
```

---

## Final Validation Checklist

Before using the CSV in MarkSprint:

- [ ] 17 columns exactly
- [ ] Header row present
- [ ] All subjects lowercase
- [ ] Volumes are Vol1 or Vol2
- [ ] Lesson numbers are sequential
- [ ] Questions have LaTeX for math
- [ ] All answers match options exactly
- [ ] No extra commas in data
- [ ] CSV opens correctly in Excel/Google Sheets
- [ ] No empty required fields (except image URLs)

---

## Quick Reference: LaTeX Examples

| Math | LaTeX | Rendered |
|------|-------|----------|
| Fraction | `$$\frac{1}{2}$$` | 1/2 |
| Power | `$$x^2$$` | x² |
| Square root | `$$\sqrt{x}$$` | √x |
| Greek alpha | `$$\alpha$$` | α |
| Greek beta | `$$\beta$$` | β |
| Subscript | `$$H_2O$$` | H₂O |
| Matrix | `$$\begin{vmatrix}1&2\\3&4\end{vmatrix}$$` | 2x2 matrix |
| Integral | `$$\int x \, dx$$` | ∫x dx |
| Summation | `$$\sum_{i=1}^{n}$$` | Σ from i=1 to n |

---

## Support

If the AI output doesn't work:
1. Check the CSV in a text editor (not Excel)
2. Verify column count: `wc -F, filename.csv`
3. Test with sample data first
4. Provide feedback to AI for refinement
