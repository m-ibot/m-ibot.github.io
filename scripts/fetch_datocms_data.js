const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const ENV_PATH = path.join(__dirname, '..', 'build.env');
const BUILD_JS_PATH = path.join(__dirname, '..', 'build.js');

async function main() {
    let token = process.env.DATO_CMS_API_KEY;
    if (!token && fs.existsSync(ENV_PATH)) {
        const envContent = fs.readFileSync(ENV_PATH, 'utf8');
        const match = envContent.match(/DATO_CMS_API_KEY\s*=\s*(.*)/);
        if (match) token = match[1].trim();
    }
    if (!token) {
        console.error("Error: DATO_CMS_API_KEY is not set.");
        process.exit(1);
    }

    if (!fs.existsSync(BUILD_JS_PATH)) {
        console.error(`Error: build.js not found at ${BUILD_JS_PATH}`);
        process.exit(1);
    }
    
    // Dynamically extract the query from build.js to avoid duplicating it
    const buildJsContent = fs.readFileSync(BUILD_JS_PATH, 'utf8');
    const queryMatch = buildJsContent.match(/const query = `([\s\S]*?)`;/);
    if (!queryMatch) {
        console.error("Error: Could not find the GraphQL query in build.js");
        process.exit(1);
    }
    const dataQuery = queryMatch[1];

    if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });

    console.log("Fetching DatoCMS Data...");
    try {
        const response = await fetch('https://graphql.datocms.com/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query: dataQuery }),
        });

        const data = await response.json();
        if (data.errors) {
            console.error("Error fetching data:", data.errors);
            process.exit(1);
        }
        
        const dataPath = path.join(DOCS_DIR, 'datocms_data.json');
        fs.writeFileSync(dataPath, JSON.stringify(data.data, null, 2));
        console.log(`Saved data to ${dataPath}`);
    } catch (err) {
        console.error("Failed to fetch data:", err);
    }
}

main();
