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
