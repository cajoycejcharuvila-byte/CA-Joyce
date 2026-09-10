const fs = require('fs');
const { Pool } = require('pg');

const envFile = fs.readFileSync('.env.local', 'utf8');
let dbUrl = '';
envFile.split('\n').forEach(line => {
  if (line.startsWith('DATABASE_URL=')) {
    dbUrl = line.split('=')[1].replace(/"/g, '').replace(/'/g, '').trim();
  }
});

async function main() {
  const pool = new Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  const data = JSON.parse(fs.readFileSync('data/insights.json', 'utf8'));

  for (const item of data) {
    try {
      await pool.query(
        "INSERT INTO insights (slug, title, category, excerpt, content, author, date_published, read_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (slug) DO NOTHING",
        [item.slug, item.title, item.category, item.excerpt, JSON.stringify(item.content), item.author, new Date(item.date).toISOString(), item.readTime]
      );
      console.log(`Inserted insight: ${item.title}`);
    } catch(e) {
      console.error(e);
    }
  }

  console.log("Insights migration complete!");
  pool.end();
}

main().catch(console.error);
