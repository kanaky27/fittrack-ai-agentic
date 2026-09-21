const Database = require('better-sqlite3');
const db = new Database('.tmp/data.db');
const rows = db.prepare(`
  SELECT p.action, rp.role_id 
  FROM up_permissions p
  JOIN up_permissions_role_links rp ON p.id = rp.permission_id
  WHERE p.action LIKE '%destroy%'
`).all();
console.log(rows);
db.close();
