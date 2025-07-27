// GET /api/transactions — role-based access
app.get('/api/transactions', authenticateJWT, (req, res) => {
  const { username, role } = req.user;

  if (role === 'admin') {
    // Admin sees everything
    db.all('SELECT * FROM transactions LIMIT 100', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });

  } else if (role === 'client') {
    // Client sees all customer transactions under their client ID
    const query = `
      SELECT t.* FROM transactions t
      JOIN clients c ON t.customer = c.customer
      WHERE c.client_id = ?
      LIMIT 100
    `;
    db.all(query, [username], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });

  } else if (role === 'user') {
    // User sees only their own transactions
    db.all('SELECT * FROM transactions WHERE customer = ? LIMIT 100', [username], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });

  } else {
    res.status(403).json({ error: 'Unauthorized role' });
  }
});
