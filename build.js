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

    const now = new Date();
    return {
        '##FIRST_NAME##': firstName,
        '##LAST_NAME##': lastName,
        '##FULL_NAME##': fullName,
        '##TITLE##': title,
        '##SOCIAL_XING##': profile.xing || localData.REPLACE_SOCIAL_XING || '##SOCIAL_XING##',
        '##SOCIAL_LINKEDIN##': profile.linkedin || localData.REPLACE_SOCIAL_LINKEDIN || '##SOCIAL_LINKEDIN##',
        '##SOCIAL_GITHUB##': profile.github || localData.REPLACE_SOCIAL_GITHUB || '##SOCIAL_GITHUB##',
        '##CONTACT_E_MAIL##': profile.eMail || localData.REPLACE_CONTACT_E_MAIL || '##CONTACT_E_MAIL##',
        '##SEO_BING##': tech.seoIdBing || localData.REPLACE_SEO_BING || '##SEO_BING##',
        '##DOMAIN##': tech.domain || localData.REPLACE_DOMAIN || '##DOMAIN##',
        '##SEO_GOOGLE##': tech.seoIdGoogle || localData.REPLACE_SEO_GOOGLE || '##SEO_GOOGLE##',
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
        }
        technicaldataModel {
          domain
          seoIdBing
          seoIdGoogle
        }
        allExperiences {
          id
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
            technicaldataModel: data.data.technicaldataModel
        };

        const items = [];
        
        for (const exp of data.data.allExperiences) {
            items.push({
                type: 'experience',
                title: exp.title,
                subtitle: exp.company,
                start: new Date(exp.start),
                end: exp.end ? new Date(exp.end) : null
            });
        }
        
        for (const edu of data.data.allEducations) {
            items.push({
                type: 'education',
                title: edu.title,
                subtitle: edu.educationalInstitution,
                start: new Date(edu.start),
                end: edu.end ? new Date(edu.end) : null
            });
        }
        
        for (const brk of data.data.allCareerBreaks) {
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
        
        let html = '<input type="checkbox" id="experience-toggle" class="experience-toggle" hidden autocomplete="off">\n';
        html += '<div class="timeline">\n';
        
        const icons = {
            experience: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M14 6V4h-4v2h4zM4 8v11h16V8H4zm16-2c1.11 0 2 .89 2 2v11c0 1.11-.89 2-2 2H4c-1.11 0-2-.89-2-2V8c0-1.11.89-2 2-2h4V4c0-1.11.89-2 2-2h8c1.11 0 2 .89 2 2v2h4z"/></svg>',
            education: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2.12-1.15L23 9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>',
            break: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M11 8v5l4.25 2.52.75-1.23-3.5-2.07V8H11zM12 2A10 10 0 1 0 22 12 10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/></svg>'
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

async function main() {
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

    const datoData = await getDatoCmsData();
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
    
    processHTML(placeholders);
}

main();
