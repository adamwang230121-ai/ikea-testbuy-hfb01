// IKEA Test Buy PWA — 本地 HTTPS 服务器
// 用途：在局域网内分享给团队成员安装
// 运行：node server.js
// 访问：https://<你的IP>:8443

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const os    = require('os');

const PORT_HTTPS = 8443;
const PORT_HTTP  = 8080;  // HTTP重定向到HTTPS

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.css':  'text/css',
};

function serveFile(req, res) {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(__dirname, urlPath);
  if (!fs.existsSync(filePath)) {
    // SPA fallback
    const idx = path.join(__dirname, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(idx).pipe(res);
    return;
  }
  const ext  = path.extname(filePath);
  const mime = MIME[ext] || 'application/octet-stream';
  res.writeHead(200, {
    'Content-Type': mime,
    'Cache-Control': 'no-cache',
    'Service-Worker-Allowed': '/'
  });
  fs.createReadStream(filePath).pipe(res);
}

// Get local IP
function getLocalIP() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address;
    }
  }
  return 'localhost';
}

// Try to load real cert, otherwise generate self-signed via selfsigned package
let credentials;
try {
  credentials = {
    key:  fs.readFileSync('cert/key.pem'),
    cert: fs.readFileSync('cert/cert.pem')
  };
  console.log('✅ Using existing certificate');
} catch {
  // Use built-in TLS with self-signed (Node 22+ supports this)
  const { generateKeyPairSync, createCertificate } = require('crypto');
  console.log('⚠️  No cert found — starting HTTP only mode (PWA install requires HTTPS or localhost)');
  console.log('   Run: npm install -g local-ssl-proxy  then:');
  console.log('   local-ssl-proxy --source 8443 --target 8080');
  credentials = null;
}

// HTTP server (always starts for redirect or fallback)
http.createServer((req, res) => {
  const ip = getLocalIP();
  res.writeHead(301, { Location: `https://${ip}:${PORT_HTTPS}${req.url}` });
  res.end();
}).listen(PORT_HTTP);

if (credentials) {
  https.createServer(credentials, serveFile).listen(PORT_HTTPS, () => {
    const ip = getLocalIP();
    console.log('\n🟡 IKEA Test Buy PWA Server');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📱 局域网地址: https://${ip}:${PORT_HTTPS}`);
    console.log(`💻 本机地址:   https://localhost:${PORT_HTTPS}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('用手机Chrome扫描或输入局域网地址，点击「安装到桌面」\n');
  });
} else {
  // Fallback: plain HTTP on 8080 (works for localhost testing)
  http.createServer(serveFile).listen(PORT_HTTP + 1, () => {
    console.log(`\n🔵 HTTP mode: http://localhost:${PORT_HTTP + 1}`);
    console.log('注意：PWA安装需要HTTPS，请参考README.txt\n');
  });
}
