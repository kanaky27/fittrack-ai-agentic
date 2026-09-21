const Database = require('better-sqlite3');
const db = new Database('.tmp/data.db');
const rows = db.prepare("SELECT action FROM up_permissions WHERE action LIKE '%meal%' OR action LIKE '%activity%'").all();
console.log(rows);
db.close();
