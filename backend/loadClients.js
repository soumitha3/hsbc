const fs = require('fs');
const csv = require('csv-parser');
const db = require('./models/db');

const assignedClients = ['ACME1', 'FINCORP', 'DELTA', 'ZENBANK'];
const seenCustomers = new Set();

fs.createReadStream('Dataset.csv')
  .pipe(csv())
  .on('data', (row) => {
    const customer = row.customer;

    if (!seenCustomers.has(customer)) {
      seenCustomers.add(customer);

      const client = assignedClients[Math.floor(Math.random() * assignedClients.length)];

      db.run(
        'INSERT INTO clients (customer, client_id) VALUES (?, ?)',
        [customer, client],
        (err) => {
          if (err) console.error('Insert error:', err.message);
        }
      );
    }
  })
  .on('end', () => {
    console.log('✅ Clients loaded into DB.');
  });
