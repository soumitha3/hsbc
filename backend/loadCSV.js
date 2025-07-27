const fs = require("fs");
const csv = require("csv-parser");
const db = require("./models/db");

let rowCount = 0;
const MAX_ROWS = 10000;

// Utility function to strip quotes from strings
const stripQuotes = (value) =>
  typeof value === "string" ? value.replace(/^['"]+|['"]+$/g, "").trim() : value;

db.serialize(() => {
  db.run("BEGIN TRANSACTION");

  fs.createReadStream("Dataset.csv")
    .pipe(csv())
    .on("data", (row) => {
      if (rowCount >= MAX_ROWS) return;

      const step = parseInt(row.step);
      const customer = stripQuotes(row.customer);
      const age = parseInt(row.age); // optional if you're using age
      const gender = stripQuotes(row.gender);
      const merchant = stripQuotes(row.merchant);
      const category = stripQuotes(row.category);
      const amount = parseFloat(row.amount);
      const fraud = parseInt(row.fraud);

      if (!customer || isNaN(step) || isNaN(amount)) return;

      const stmt = db.prepare(`
        INSERT INTO transactions (step, customer, age, gender, merchant, category, amount, fraud)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(step, customer, age, gender, merchant, category, amount, fraud);
      stmt.finalize();
      rowCount++;
    })
    .on("end", () => {
      db.run("COMMIT");
      console.log(`✅ Done. Inserted ${rowCount} rows.`);
    });
});
