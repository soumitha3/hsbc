require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const users = require('./user');
const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Mock user data (replace with DB later if needed)



// 🔐 Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// 🩺 Health check
app.get('/', (req, res) => {
  res.send('✅ Financial API running');
});

// 🛡️ Role-based transaction access
app.get('/api/transactions', authenticateJWT, (req, res) => {
  let { username, role } = req.user;

  // 👇 Debug log
  console.log('Authenticated User:', { username, role });

  if (role === 'admin') {
    db.all('SELECT * FROM transactions LIMIT 100', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });

  } else if (role === 'client') {
    // ✅ Fix for specific username with/without quotes
    username = username.replace(/['"]/g, '');

    db.all(
      'SELECT * FROM transactions WHERE category = ? LIMIT 100',
      [username],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
      }
    );

  } else if (role === 'user') {
    // ✅ Fix for specific username with/without quotes
    username = username.replace(/['"]/g, '');

    db.all(
      'SELECT * FROM transactions WHERE customer = ? LIMIT 100',
      [username],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
      }
    );

  } else {
    res.status(403).json({ error: 'Unauthorized role' });
  }
});

// 🔐 Login API
// 🔐 Login API with password validation
app.post('/api/login', async (req, res) => {
  const { username, password, role } = req.body;

  const user = users.find(u => u.username === username && u.role === role);

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = jwt.sign({ username, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
