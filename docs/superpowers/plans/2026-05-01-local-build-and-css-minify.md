# Local Build Script & CSS Minification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a dependency-free Node.js build script that minifies CSS, replaces placeholders, and prepares a `dist/` directory for deployment.

**Architecture:** A standalone `build.js` script using Node.js built-in `fs` and `path` modules to process files from `src/` into `dist/`. Local testing is supported via `placeholders.local.json`.

**Tech Stack:** Node.js (Built-in modules: fs, path, crypto)

---

### Task 1: Project Setup & Git Configuration

**Files:**
- Modify: `.gitignore`
- Create: `placeholders.local.json.example`

- [ ] **Step 1: Update .gitignore**
Add `dist/` and `placeholders.local.json` to `.gitignore`.

```text
# ... existing content ...
dist/
placeholders.local.json
```

- [ ] **Step 2: Create placeholders.local.json.example**
Provide a template for local development.

```json
{
  "REPLACE_NAME": "John Doe",
  "REPLACE_DOMAIN": "localhost",
  "REPLACE_SOCIAL_LINKEDIN": "https://linkedin.com/in/johndoe",
  "REPLACE_SOCIAL_XING": "https://xing.com/profile/John_Doe",
  "REPLACE_SOCIAL_GITHUB": "https://github.com/johndoe",
  "REPLACE_CONTACT_E_MAIL": "john@example.com",
  "REPLACE_SEO_GOOGLE": "google-site-verification-dummy",
  "REPLACE_SEO_BING": "msvalidate-dummy"
}
```

- [ ] **Step 3: Commit setup**
```bash
git add .gitignore placeholders.local.json.example
git commit -m "chore: setup build script git ignores and example config"
```

---

### Task 2: Implement Build Script (Base Logic)

**Files:**
- Create: `build.js`

- [ ] **Step 1: Write build.js with core file operations**
Implement directory cleaning, copying, and the CSS minification regex.

```javascript
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');
const LOCAL_CONFIG = path.join(__dirname, 'placeholders.local.json');

function cleanDist() {
    if (fs.existsSync(DIST_DIR)) {
        fs.rmSync(DIST_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(DIST_DIR);
}

function copyRecursiveSync(src, dest) {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(childItem => {
            copyRecursiveSync(path.join(src, childItem), path.join(dest, childItem));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

function minifyCSS(content) {
    return content
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ')           // Collapse whitespace
        .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around punctuation
        .replace(/;\s*}/g, '}');        // Remove trailing semicolon
}

// Initial execution
console.log('Starting build...');
cleanDist();
copyRecursiveSync(SRC_DIR, DIST_DIR);

const cssPath = path.join(DIST_DIR, 'style.css');
const minCssPath = path.join(DIST_DIR, 'style.min.css');
if (fs.existsSync(cssPath)) {
    const css = fs.readFileSync(cssPath, 'utf8');
    fs.writeFileSync(minCssPath, minifyCSS(css));
    fs.unlinkSync(cssPath);
    console.log('CSS minified to style.min.css');
}
```

- [ ] **Step 2: Verify base build**
Run: `node build.js`
Check: `dist/style.min.css` exists and is minified. `dist/style.css` should be gone.

- [ ] **Step 3: Commit base script**
```bash
git add build.js
git commit -m "feat: implement base build script with CSS minification"
```

---

### Task 3: Implement Placeholder Replacement

**Files:**
- Modify: `build.js`

- [ ] **Step 1: Add placeholder replacement logic to build.js**

```javascript
// ... existing imports ...

function getPlaceholders() {
    let localData = {};
    if (fs.existsSync(LOCAL_CONFIG)) {
        localData = JSON.parse(fs.readFileSync(LOCAL_CONFIG, 'utf8'));
    }

    const now = new Date();
    return {
        '##NAME##': process.env.REPLACE_NAME || localData.REPLACE_NAME || '##NAME##',
        '##SOCIAL_XING##': process.env.REPLACE_SOCIAL_XING || localData.REPLACE_SOCIAL_XING || '##SOCIAL_XING##',
        '##SOCIAL_LINKEDIN##': process.env.REPLACE_SOCIAL_LINKEDIN || localData.REPLACE_SOCIAL_LINKEDIN || '##SOCIAL_LINKEDIN##',
        '##SOCIAL_GITHUB##': process.env.REPLACE_SOCIAL_GITHUB || localData.REPLACE_SOCIAL_GITHUB || '##SOCIAL_GITHUB##',
        '##CONTACT_E_MAIL##': process.env.REPLACE_CONTACT_E_MAIL || localData.REPLACE_CONTACT_E_MAIL || '##CONTACT_E_MAIL##',
        '##SEO_BING##': process.env.REPLACE_SEO_BING || localData.REPLACE_SEO_BING || '##SEO_BING##',
        '##DOMAIN##': process.env.REPLACE_DOMAIN || localData.REPLACE_DOMAIN || '##DOMAIN##',
        '##SEO_GOOGLE##': process.env.REPLACE_SEO_GOOGLE || localData.REPLACE_SEO_GOOGLE || '##SEO_GOOGLE##',
        '##DATE##': now.toISOString().split('T')[0],
        '##YEAR##': now.getFullYear().toString()
    };
}

function processHTML(placeholders) {
    const htmlPath = path.join(DIST_DIR, 'index.html');
    if (!fs.existsSync(htmlPath)) return;

    let html = fs.readFileSync(htmlPath, 'utf8');
    
    // Update CSS link
    html = html.replace('href="style.css"', 'href="style.min.css"');

    // Replace placeholders
    for (const [key, value] of Object.entries(placeholders)) {
        html = html.split(key).join(value);
    }

    fs.writeFileSync(htmlPath, html);
    console.log('HTML processed with placeholders and minified CSS link');
}

// Update main execution block in build.js
const placeholders = getPlaceholders();
processHTML(placeholders);
```

- [ ] **Step 2: Verify local placeholder replacement**
1. Create `placeholders.local.json` with dummy data.
2. Run: `node build.js`
3. Check: `dist/index.html` has replaced values and points to `style.min.css`.

- [ ] **Step 3: Commit placeholder logic**
```bash
git add build.js
git commit -m "feat: add placeholder replacement and HTML processing to build script"
```

---

### Task 4: Update GitHub Actions Workflow

**Files:**
- Modify: `.github/workflows/deploy.yml`

- [ ] **Step 1: Update deploy.yml to use build.js**

```yaml
# ...
    steps:
      - uses: actions/checkout@v4
      - name: Build Website
        shell: bash
        env:
          REPLACE_NAME: ${{ secrets.REPLACE_NAME }}
          REPLACE_SOCIAL_XING: ${{ secrets.REPLACE_SOCIAL_XING }}
          REPLACE_SOCIAL_LINKEDIN: ${{ secrets.REPLACE_SOCIAL_LINKEDIN }}
          REPLACE_SOCIAL_GITHUB: ${{ secrets.REPLACE_SOCIAL_GITHUB }}
          REPLACE_CONTACT_E_MAIL: ${{ secrets.REPLACE_CONTACT_E_MAIL }}
          REPLACE_SEO_BING: ${{ secrets.REPLACE_SEO_BING }}
          REPLACE_DOMAIN: ${{ secrets.REPLACE_DOMAIN }}
          REPLACE_SEO_GOOGLE: ${{ secrets.REPLACE_SEO_GOOGLE }}
        run: node build.js
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: 'dist'
# ...
```

- [ ] **Step 2: Commit workflow changes**
```bash
git add .github/workflows/deploy.yml
git commit -m "ci: switch to node build script and update artifact path"
```

---

### Task 5: Final Verification & Cleanup

- [ ] **Step 1: Final local build test**
Run: `node build.js`
Verify all assets are in `dist/` and correctly processed.

- [ ] **Step 2: Verify .gitignore is working**
Run: `git status`
Ensure `dist/` and `placeholders.local.json` are NOT tracked.
