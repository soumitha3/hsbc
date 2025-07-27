const bcrypt = require('bcrypt');

const users = [
  {
    username: 'C1760492708',
    role: 'user',
    // password: pass123
    passwordHash: bcrypt.hashSync('pass123', 10)
  },
   {
    username: 'C671449181',
    role: 'user',
    // password: pass123
    passwordHash: bcrypt.hashSync('pass123', 10)
  },
  {
    username: 'es_transportation',
    role: 'client',
    // password: client123
    passwordHash: bcrypt.hashSync('client123', 10)
  },
  {
    username: 'es_health',
    role: 'client',
    // password: client123
    passwordHash: bcrypt.hashSync('client123', 10)
  },
  {
    username: 'admin',
    role: 'admin',
    // password: admin123
    passwordHash: bcrypt.hashSync('admin123', 10)
  }
];

module.exports = users;
