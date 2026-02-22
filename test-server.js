const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Test Server</title>
    </head>
    <body>
      <h1>✅ Node.js сервер работает!</h1>
      <p>Это тестовый сервер. Next.js будет запущен после проверки.</p>
    </body>
    </html>
  `);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ Тестовый сервер запущен на http://localhost:${PORT}`);
});
