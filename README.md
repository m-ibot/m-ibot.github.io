# m-ibot.github.io

This project is a personal website for **m-ibot.eu**, built as a high-performance, accessible, and static one-pager. It is designed to be lightweight and fast, featuring a CSS-only light/dark theme toggle without relying on client-side JavaScript.

## Tech Stack

* **Frontend**: Pure HTML5 and Vanilla CSS3 (No Client-Side JavaScript).
* **Build System**: Custom Node.js script (`build.js`) for minification, data fetching, and template rendering.
* **Content Management**: DatoCMS (Headless CMS) accessed via GraphQL.
* **Hosting & CI/CD**: GitHub Actions for automated building and GitHub Pages for hosting.

## Architecture

The source code resides in the `src/` directory. The project utilizes a local build script (`build.js`) that acts as a custom static site generator. The build pipeline performs the following:
1. **Clean & Initialize**: Wipes and recreates the `dist/` output folder.
2. **Asset Management**: Copies static files from `src/` to `dist/`, minifies the CSS, and applies a content hash for cache-busting.
3. **Data Fetching**: Executes a GraphQL query against DatoCMS to fetch profile information, SEO metadata, and the Experience & Education timeline.
4. **Asset Downloading**: Downloads dynamic assets (like the profile image) from the CMS locally into `dist/`.
5. **HTML Processing**: Replaces template placeholders (e.g., `##ABOUT_ME##`, `##EXPERIENCE_AND_EDUCATION##`) in `dist/index.html` with real data or local mock data.

## Local Development & Building

To view the raw website with placeholders intact, you can open `src/index.html` directly in your browser. However, to see the fully processed site, you should run the local build.

### Prerequisites
1. Ensure you have Node.js installed.
2. (Optional) Create a `build.env` file in the root directory to provide the DatoCMS API Token:
   ```env
   DATO_CMS_API_KEY=your_api_token_here
   ```
3. (Optional) Customize local placeholders by editing `placeholders.local.json`.

### Building the Project

Run the build script from the project root:

```bash
node build.js
```

This script will process all files and generate a complete static site in the `dist/` directory. 

### Viewing the Output

You can simply open `dist/index.html` in your web browser:
- **macOS**: `open dist/index.html`
- **Linux**: `xdg-open dist/index.html`
- **Windows**: `start dist/index.html`

Alternatively, you can serve the `dist/` directory using any local web server, for example:
```bash
npx serve dist
# or
python3 -m http.server --directory dist
```

## DatoCMS Data & Fallback Behavior

The build script relies on DatoCMS to populate the site's content. However, it is designed with a robust dual-behavior fallback mechanism:

- **Local Development**: If you run the build script locally without setting a `DATO_CMS_API_KEY`, or if the API request fails (e.g., working offline), the build will *not* fail. Instead, it logs a warning and gracefully falls back to the mock data provided in `placeholders.local.json`. This allows for seamless offline development.
- **CI / Deployment**: When running in a Continuous Integration environment (detected via `CI=true`), the build script strictly requires the DatoCMS data. If the `DATO_CMS_API_KEY` is missing, or an asset (like the profile image) fails to download, the build will explicitly throw an error and abort. This ensures that the site is never accidentally deployed to production with missing or mocked data.

## Deployment

The site is automatically deployed to GitHub Pages via a GitHub Actions workflow (`.github/workflows/deploy.yml`) whenever changes are pushed to the `main` branch. 

**How the deployment works:**
1. The workflow checks out the repository.
2. It sets the `DATO_CMS_API_KEY` environment variable from the repository's secure secrets.
3. It runs `node build.js` to fetch the latest data and compile the static assets into the `dist/` directory.
4. It uses the `actions/upload-pages-artifact` action to bundle the `dist/` directory.
5. Finally, it uses `actions/deploy-pages` to publish the artifact live to GitHub Pages.

## Acknowledgements

This project was built and evolved with the assistance of **Google Gemini / Antigravity** agentic coding framework, exploring the capabilities of AI-assisted software engineering and architecture design.

The **Inter** typeface is served via [Bunny Fonts](https://fonts.bunny.net/) — a privacy-friendly, GDPR-compliant font CDN that does not track or log end users. Inter itself is designed by Rasmus Andersson and licensed under the [SIL Open Font License 1.1](https://scripts.sil.org/OFL).
