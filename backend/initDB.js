const db = require('./models/db');

db.serialize(() => {
  // Create transactions table
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      step INTEGER,
      customer TEXT,
      age INTEGER,
      gender TEXT,
      merchant TEXT,
      category TEXT,
      amount REAL,
      fraud INTEGER
    )
  `, (err) => {
    if (err) console.error('Error creating transactions table:', err);
    else console.log("✅ Table 'transactions' created.");
  });

  // Create clients table
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      customer TEXT,
      client_id TEXT
    )
  `, (err) => {
    if (err) console.error('Error creating clients table:', err);
    else console.log("✅ Table 'clients' created.");
  });
});
