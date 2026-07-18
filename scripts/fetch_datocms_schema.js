const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const ENV_PATH = path.join(__dirname, '..', 'build.env');

const introspectionQuery = `
  query IntrospectionQuery {
    __schema {
      types {
        name
        kind
        description
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
  }
`;

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

    if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });

    console.log("Fetching DatoCMS Schema...");
    try {
        const response = await fetch('https://graphql.datocms.com/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query: introspectionQuery }),
        });

        const data = await response.json();
        if (data.errors) {
            console.error("Error fetching schema:", data.errors);
            process.exit(1);
        }
        
        const schemaPath = path.join(DOCS_DIR, 'datocms_schema.json');
        fs.writeFileSync(schemaPath, JSON.stringify(data.data, null, 2));
        console.log(`Saved schema to ${schemaPath}`);
    } catch (err) {
        console.error("Failed to fetch schema:", err);
    }
}

main();
