const fs = require('node:fs');
const path = require('node:path');

fs.mkdirSync(path.join(process.cwd(), '.test-dist'), { recursive: true });
fs.writeFileSync(
  path.join(process.cwd(), '.test-dist', 'package.json'),
  JSON.stringify({ type: 'commonjs' }, null, 2),
);
