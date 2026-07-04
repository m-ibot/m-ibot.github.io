# m-ibot.github.io

This project is a personal website for **m-ibot.eu**, built as a high-performance, accessible, and static one-pager. It uses HTML5, vanilla CSS3, and features a CSS-only light/dark theme toggle.

## Architecture

The source code resides in the `src/` directory. The project utilizes a local build script (`build.js`) to:
1. Combine and minify assets (like CSS).
2. Fetch dynamic content (like Professional Experience and Education) from DatoCMS.
3. Replace template placeholders with real data or local dummy data.
4. Output the final, production-ready website to the `dist/` folder.

## Local Development & Building

To view the website with placeholders intact, you can open `src/index.html` directly in your browser. However, to see the fully processed site (including data fetched from DatoCMS and your local placeholders), you should run the local build.

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

## Deployment
The site is automatically deployed to GitHub Pages via a GitHub Actions workflow whenever changes are pushed to the `main` branch. Ensure that your `DATO_CMS_API_KEY` and other placeholders are set in your repository's secrets.
