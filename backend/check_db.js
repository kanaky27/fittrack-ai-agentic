const Database = require('better-sqlite3');
const db = new Database('.tmp/data.db');
console.log(db.prepare('SELECT * FROM chat_messages').all());
db.close();
