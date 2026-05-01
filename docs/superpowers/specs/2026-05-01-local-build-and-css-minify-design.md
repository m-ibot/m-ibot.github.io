# Design Spec: Local Build Script & CSS Minification

## 1. Problem Statement
The project currently relies on a `sed`-based search-and-replace in GitHub Actions for placeholder replacement. There is no easy way to test this locally, and the CSS is served unminified. The goal is to create a simple, dependency-free local build script that handles both minification and placeholder replacement, while keeping the `src/` directory clean and readable.

## 2. Proposed Solution
Implement a Node.js-based build script (`build.js`) that creates a processed version of the website in a `dist/` directory.

### 2.1 Build Workflow
1.  **Preparation**:
    *   Clean existing `dist/` directory.
    *   Create `dist/` and copy all files from `src/`.
2.  **CSS Processing**:
    *   Read `src/style.css`.
    *   Apply regex-based minification (remove comments, collapse whitespace, optimize punctuation).
    *   Save to `dist/style.min.css`.
    *   Remove `dist/style.css`.
3.  **HTML/Asset Processing**:
    *   Read `dist/index.html`.
    *   Update `<link>` tag to point to `style.min.css`.
    *   Replace `##PLACEHOLDERS##` using values from `placeholders.local.json` (local) or Environment Variables (CI/CD).
4.  **Finalization**:
    *   The `dist/` directory is ready for local preview or deployment.

### 2.2 Placeholder Mapping
The script will use the following environment variable names (matching existing GitHub Secrets):
- `##NAME##` -> `REPLACE_NAME`
- `##SOCIAL_XING##` -> `REPLACE_SOCIAL_XING`
- `##SOCIAL_LINKEDIN##` -> `REPLACE_SOCIAL_LINKEDIN`
- `##SOCIAL_GITHUB##` -> `REPLACE_SOCIAL_GITHUB`
- `##CONTACT_E_MAIL##` -> `REPLACE_CONTACT_E_MAIL`
- `##SEO_BING##` -> `REPLACE_SEO_BING`
- `##DOMAIN##` -> `REPLACE_DOMAIN`
- `##SEO_GOOGLE##` -> `REPLACE_SEO_GOOGLE`
- `##DATE##` -> Computed `YYYY-MM-DD`
- `##YEAR##` -> Computed `YYYY`

## 3. Implementation Details

### 3.1 `build.js`
A standalone Node.js script using only built-in modules (`fs`, `path`, `crypto`).
- **Minification Regex**:
  - `/\/\*[\s\S]*?\*\//g` (Comments)
  - `/\s+/g` (Whitespace collapse)
  - `/\s*([{}:;,])\s*/g` (Punctuation spacing)
  - `/;\s*}/g` (Trailing semicolon)

### 3.2 File Changes
- `.gitignore`: Add `dist/` and `placeholders.local.json`.
- `build.js`: New file in project root.
- `placeholders.local.json.example`: New file with dummy data.
- `.github/workflows/deploy.yml`: 
  - Replace `sed` step with `node build.js`.
  - Update artifact path to `dist`.

## 4. Success Criteria
- Running `node build.js` creates a functional site in `dist/`.
- `dist/style.min.css` is minified.
- `dist/index.html` contains replaced values and references the minified CSS.
- GitHub deployment continues to work using the new script.
