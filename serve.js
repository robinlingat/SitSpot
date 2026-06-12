const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'sitspot/project');
const PORT = 3000;

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.jsx':  'application/javascript',
};

http.createServer((req, res) => {
  let filePath = path.join(ROOT, req.url === '/' ? '/SitSpot Prototype.html' : req.url);
  const ext = path.extname(filePath);
  const ct  = MIME[ext] || 'text/plain';
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': ct });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Serving on http://localhost:${PORT}`));
