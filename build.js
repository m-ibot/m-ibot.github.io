/**
 * build.js
 * 
 * Custom Static Site Generator Pipeline
 * 
 * This script serves as the entire build pipeline for the project, avoiding the need 
 * for heavy bundlers like Webpack. It performs the following sequential phases:
 * 
 * 1. Clean & Initialize: Wipes the `dist/` directory to ensure a fresh build.
 * 2. Asset Management: Recursively copies `src/` to `dist/`. Minifies `style.css` 
 *    and appends an MD5 hash to its filename for cache-busting.
 * 3. Data Fetching: Queries DatoCMS via a GraphQL request using the native `https` module.
 *    - Strict CI Mode: If `CI=true`, any missing data or failed requests will abort the build.
 *    - Local Fallback: If run locally without an API key, it warns and falls back to `placeholders.local.json`.
 * 4. Asset Download: Downloads the profile image from DatoCMS to be served locally.
 * 5. HTML Processing: Injects the fetched CMS data (or mock data) and the hashed CSS 
 *    filename into `dist/index.html`.
 */

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

function getPlaceholders(dato) {
    let localData = {};
    if (fs.existsSync(LOCAL_CONFIG)) {
        localData = JSON.parse(fs.readFileSync(LOCAL_CONFIG, 'utf8'));
    }

    dato = dato || {};
    const profile = dato.profile || {};
    const tech = dato.technicaldataModel || {};

    const firstName = profile.firstName || localData.REPLACE_FIRST_NAME || '##FIRST_NAME##';
    const lastName = profile.lastName || localData.REPLACE_LAST_NAME || '##LAST_NAME##';
    const fullName = (profile.firstName && profile.lastName) ? `${profile.firstName} ${profile.lastName}` : (localData.REPLACE_FULL_NAME || `${firstName} ${lastName}`);
    const title = profile.title || localData.REPLACE_TITLE || '##TITLE##';
    
    let aboutMeHtml = profile.aboutme || localData.REPLACE_ABOUT_ME || '##ABOUT_ME##';

    // Split the HTML into individual <p> blocks (field now outputs HTML directly)
    const paragraphs = aboutMeHtml.split(/\n+/).map(p => p.trim()).filter(p => p.startsWith('<p>'));

    let aboutMeText = '';
    if (paragraphs.length <= 1) {
        aboutMeText = paragraphs.join('');
    } else {
        aboutMeText = `<input type="checkbox" id="about-toggle" class="about-toggle sr-only" autocomplete="off">\n<div class="about-container">\n`;
        aboutMeText += `    <div class="about-item">${paragraphs[0]}</div>\n`;
        aboutMeText += `    <div class="about-item item-faded">${paragraphs[1]}</div>\n`;
        for (let i = 2; i < paragraphs.length; i++) {
            aboutMeText += `    <div class="about-item item-hidden">${paragraphs[i]}</div>\n`;
        }
        aboutMeText += `</div>\n<div class="about-toggle-wrapper">\n    <label for="about-toggle" class="btn-show-more" tabindex="0" role="button">Show More</label>\n</div>`;
    }

    const now = new Date();
    return {
        '##FIRST_NAME##': firstName,
        '##LAST_NAME##': lastName,
        '##FULL_NAME##': fullName,
        '##TITLE##': title,
        '##ABOUT_ME##': aboutMeText,
        '##SOCIAL_XING##': profile.xing || localData.REPLACE_SOCIAL_XING || '##SOCIAL_XING##',
        '##SOCIAL_LINKEDIN##': profile.linkedin || localData.REPLACE_SOCIAL_LINKEDIN || '##SOCIAL_LINKEDIN##',
        '##SOCIAL_GITHUB##': profile.github || localData.REPLACE_SOCIAL_GITHUB || '##SOCIAL_GITHUB##',
        '##CONTACT_E_MAIL##': profile.eMail || localData.REPLACE_CONTACT_E_MAIL || '##CONTACT_E_MAIL##',
        '##CONTACT_TEXT##': tech.contacttext || localData.REPLACE_CONTACT_TEXT || '##CONTACT_TEXT##',
        '##SKILLS##': (() => {
            const skills = dato.allSkills || [];
            if (skills.length > 0) {
                let html = `<input type="checkbox" id="skills-toggle" class="skills-toggle" autocomplete="off" hidden>\n`;
                html += `<div class="skills-container">\n`;
                skills.forEach(s => {
                    html += `    <span class="skill-badge">${s.label}</span>\n`;
                });
                html += `</div>\n`;
                html += `<div class="timeline-toggle-wrapper skills-toggle-wrapper">\n`;
                html += `    <label for="skills-toggle" class="btn-show-more" tabindex="0" role="button">Show More</label>\n`;
                html += `</div>\n`;
                return html;
            }
            return localData.REPLACE_SKILLS || '##SKILLS##';
        })(),
        '##SKILLS_JSON_ARRAY##': JSON.stringify((dato.allSkills || []).length ? dato.allSkills.map(s => s.label) : (localData.REPLACE_SKILLS_JSON_ARRAY || [])),
        '##WORKS_FOR_JSON##': (() => {
            if (dato.allExperiences) {
                const current = dato.allExperiences.find(e => !e.end);
                if (current) {
                    return `,\n          "worksFor": {\n            "@type": "Organization",\n            "name": ${JSON.stringify(current.company)}\n          }`;
                }
            }
            return localData.REPLACE_WORKS_FOR_JSON || '';
        })(),
        '##ALUMNI_OF_JSON##': (() => {
            if (dato.allEducations && dato.allEducations.length > 0) {
                const latest = [...dato.allEducations].sort((a, b) => new Date(b.end) - new Date(a.end))[0];
                return `,\n          "alumniOf": {\n            "@type": "CollegeOrUniversity",\n            "name": ${JSON.stringify(latest.educationalInstitution)}\n          }`;
            }
            return localData.REPLACE_ALUMNI_OF_JSON || '';
        })(),
        '##LOCATION_LABEL##': profile.locationlabel || localData.REPLACE_LOCATION_LABEL || '##LOCATION_LABEL##',
        '##LOCATION_MAP_URL##': (() => {
            const lat = profile.location && profile.location.latitude;
            const lon = profile.location && profile.location.longitude;
            if (lat && lon) return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=12`;
            return localData.REPLACE_LOCATION_MAP_URL || '#';
        })(),
        '##SEO_BING##': tech.seoIdBing || localData.REPLACE_SEO_BING || '##SEO_BING##',
        '##DOMAIN##': tech.domain || localData.REPLACE_DOMAIN || '##DOMAIN##',
        '##SEO_GOOGLE##': tech.seoIdGoogle || localData.REPLACE_SEO_GOOGLE || '##SEO_GOOGLE##',
        '##META_DESCRIPTION##': tech.metadescription || localData.REPLACE_META_DESCRIPTION || '##META_DESCRIPTION##',
        '##DATE##': now.toISOString().split('T')[0],
        '##YEAR##': now.getFullYear().toString()
    };
}

function processFile(filePath, placeholders) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [key, value] of Object.entries(placeholders)) {
        content = content.split(key).join(value);
    }
    fs.writeFileSync(filePath, content);
}

function processHTML(placeholders, minCssFilename = 'style.min.css') {
    const htmlPath = path.join(DIST_DIR, 'index.html');
    if (!fs.existsSync(htmlPath)) return;

    let html = fs.readFileSync(htmlPath, 'utf8');
    
    // Update CSS link
    html = html.replace('href="style.css"', `href="${minCssFilename}"`);

    fs.writeFileSync(htmlPath, html);

    processFile(htmlPath, placeholders);
    processFile(path.join(DIST_DIR, 'manifest.json'), placeholders);
    processFile(path.join(DIST_DIR, 'sitemap.xml'), placeholders);
    processFile(path.join(DIST_DIR, 'robots.txt'), placeholders);
    processFile(path.join(DIST_DIR, 'llms.txt'), placeholders);
    
    console.log('HTML, manifest, sitemap, robots.txt and llms.txt processed with placeholders and minified CSS link');
}

async function getDatoCmsData() {
    let token = process.env.DATO_CMS_API_KEY;
    
    const envPath = path.join(__dirname, 'build.env');
    if (!token && fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/DATO_CMS_API_KEY\s*=\s*(.*)/);
        if (match) token = match[1].trim();
    }
    
    const isCI = process.env.CI === 'true';
    if (!token) {
        if (isCI) {
            throw new Error("CRITICAL: DATO_CMS_API_KEY is required in CI environment. Deployment aborted.");
        }
        console.warn("Warning: No DatoCMS token provided. Falling back to local mock data.");
        return { html: null, datoPlaceholders: {} };
    }

    const query = `
      query {
        profile {
          firstName
          lastName
          title
          eMail
          github
          linkedin
          xing
          locationlabel
          location {
            latitude
            longitude
          }
          aboutme
          profileimage {
            url
          }
        }
        technicaldataModel {
          domain
          seoIdBing
          seoIdGoogle
          metadescription
          contacttext
        }
        allSkills(orderBy: position_ASC) {
          label
          position
        }
        allExperiences {
          title
          company
          start
          end
        }
        allEducations {
          id
          title
          educationalInstitution
          start
          end
        }
        allCareerBreaks {
          id
          reason
          start
          end
        }
      }
    `;

    try {
        const response = await fetch('https://graphql.datocms.com/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query }),
        });

        const data = await response.json();
        if (data.errors) {
            console.error('DatoCMS Error:', data.errors);
            if (isCI) {
                throw new Error("CRITICAL: Failed to load data from DatoCMS in CI environment. Deployment aborted.");
            }
            console.warn("Warning: Failed to fetch DatoCMS data. Falling back to local mock data.");
            return { html: null, datoPlaceholders: {} };
        }

        const datoPlaceholders = {
            profile: data.data.profile,
            technicaldataModel: data.data.technicaldataModel,
            allSkills: data.data.allSkills,
            allExperiences: data.data.allExperiences,
            allEducations: data.data.allEducations
        };

        const items = [];
        
        for (const exp of (data.data.allExperiences || [])) {
            items.push({
                type: 'experience',
                title: exp.title,
                subtitle: exp.company,
                start: new Date(exp.start),
                end: exp.end ? new Date(exp.end) : null
            });
        }
        
        for (const edu of (data.data.allEducations || [])) {
            items.push({
                type: 'education',
                title: edu.title,
                subtitle: edu.educationalInstitution,
                start: new Date(edu.start),
                end: edu.end ? new Date(edu.end) : null
            });
        }
        
        for (const brk of (data.data.allCareerBreaks || [])) {
            items.push({
                type: 'break',
                title: 'Career Break',
                subtitle: brk.reason,
                start: new Date(brk.start),
                end: brk.end ? new Date(brk.end) : null
            });
        }
        
        items.sort((a, b) => b.start - a.start);
        
        const formatDate = (date) => {
            if (!date) return 'Present';
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        };
        
        let html = '<input type="checkbox" id="experience-toggle" class="experience-toggle" autocomplete="off" hidden>\n';
        html += '<div class="timeline">\n';
        
        const icons = {
            experience: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>',
            education: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2.12-1.15L23 9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>',
            break: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM6.5 17.5l3.49-7.51L17.5 6.5l-3.49 7.51zM12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1z"/></svg>'
        };

        items.forEach((item, index) => {
            let itemClass = "timeline-item";
            if (index === 1) {
                itemClass += " item-faded";
            } else if (index > 1) {
                itemClass += " item-hidden";
            }
            
            html += `            <div class="${itemClass}">
                <div class="timeline-icon timeline-icon-${item.type}">
                    ${icons[item.type]}
                </div>
                <div class="timeline-content">
                    <h3 class="timeline-title">${item.title}</h3>
                    <div class="timeline-subtitle">${item.subtitle}</div>
                    <div class="timeline-date">${formatDate(item.start)} &ndash; ${formatDate(item.end)}</div>
                </div>
            </div>\n`;
        });
        
        html += '        </div>\n';
        if (items.length > 1) {
            html += '        <div class="timeline-toggle-wrapper">\n';
            html += '            <label for="experience-toggle" class="btn-show-more" tabindex="0" role="button">Show More</label>\n';
            html += '        </div>';
        }
        return { html, datoPlaceholders };
        
    } catch (err) {
        console.error('Error fetching DatoCMS data:', err);
        const isCI = process.env.CI === 'true';
        if (isCI) {
            throw new Error("CRITICAL: Error fetching DatoCMS data in CI environment. Deployment aborted.");
        }
        console.warn("Warning: Error fetching DatoCMS data. Falling back to local mock data.");
        return { html: null, datoPlaceholders: {} };
    }
}

async function downloadImage(url, dest) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(dest, Buffer.from(buffer));
        console.log('Profile image successfully downloaded from DatoCMS.');
    } catch (err) {
        const isCI = process.env.CI === 'true';
        if (isCI) {
            throw new Error(`CRITICAL: Failed to download profile image in CI environment. ${err.message}`);
        }
        console.warn(`Warning: Failed to download profile image. Falling back to local placeholder. Error: ${err.message}`);
    }
}

async function main() {
    console.log('Starting build...');
    cleanDist();
    copyRecursiveSync(SRC_DIR, DIST_DIR);

    const cssPath = path.join(DIST_DIR, 'style.css');
    let minCssFilename = 'style.min.css';
    if (fs.existsSync(cssPath)) {
        const css = fs.readFileSync(cssPath, 'utf8');
        const minCss = minifyCSS(css);
        const crypto = require('crypto');
        const hash = crypto.createHash('md5').update(minCss).digest('hex').slice(0, 8);
        minCssFilename = `style.${hash}.min.css`;
        const minCssPath = path.join(DIST_DIR, minCssFilename);
        fs.writeFileSync(minCssPath, minCss);
        fs.unlinkSync(cssPath);
        console.log(`CSS minified to ${minCssFilename}`);
    }

    const datoData = await getDatoCmsData();
    
    const isCI = process.env.CI === 'true';
    const profileObj = datoData.datoPlaceholders && datoData.datoPlaceholders.profile;
    const profileImageUrl = profileObj && profileObj.profileimage && profileObj.profileimage.url;
    
    if (profileImageUrl) {
        await downloadImage(profileImageUrl, path.join(DIST_DIR, 'assets', 'images', 'profile.jpeg'));
    } else {
        if (isCI) {
            throw new Error("CRITICAL: profileimage field missing in DatoCMS response in CI environment.");
        } else {
            console.warn("Warning: profileimage field missing in DatoCMS response. Using local placeholder.");
        }
    }

    const placeholders = getPlaceholders(datoData.datoPlaceholders);
    
    let localData = {};
    if (fs.existsSync(LOCAL_CONFIG)) {
        localData = JSON.parse(fs.readFileSync(LOCAL_CONFIG, 'utf8'));
    }

    if (!datoData.html) {
        placeholders['##EXPERIENCE_AND_EDUCATION##'] = localData.REPLACE_EXPERIENCE_AND_EDUCATION || '<!-- Local mock data missing -->';
    } else {
        placeholders['##EXPERIENCE_AND_EDUCATION##'] = datoData.html;
    }
    
    processHTML(placeholders, minCssFilename);
}

main();
