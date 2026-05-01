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

const placeholders = getPlaceholders();
processHTML(placeholders);
