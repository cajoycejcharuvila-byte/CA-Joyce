const fs = require('fs');
const { Pool } = require('pg');

// Manually parse .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
let dbUrl = '';
envFile.split('\n').forEach(line => {
  if (line.startsWith('DATABASE_URL=')) {
    dbUrl = line.split('=')[1].replace(/"/g, '').replace(/'/g, '').trim();
  }
});

async function main() {
  if (!dbUrl) {
    console.error("No DATABASE_URL in .env.local");
    return;
  }
  const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  const uaeData = JSON.parse(fs.readFileSync('data/services-uae.json', 'utf8'));
  const indiaData = JSON.parse(fs.readFileSync('data/services-india.json', 'utf8'));

  for (const s of uaeData) {
    await pool.query(
      "INSERT INTO services (region, title, description, price, features, image_url) VALUES ($1, $2, $3, $4, $5, $6)",
      ['uae', s.title, s.overview, 'Contact for Quote', JSON.stringify(s.scope_of_work), s.image]
    );
    console.log(`Inserted UAE service: ${s.title}`);
  }

  for (const s of indiaData) {
    await pool.query(
      "INSERT INTO services (region, title, description, price, features, image_url) VALUES ($1, $2, $3, $4, $5, $6)",
      ['india', s.title, s.overview, 'Contact for Quote', JSON.stringify(s.scope_of_work), s.image]
    );
    console.log(`Inserted India service: ${s.title}`);
  }

  console.log("Migration complete!");
  pool.end();
}

main().catch(console.error);
