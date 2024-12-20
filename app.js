const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
    const url = req.url
    const method = req.method;

    if (url === '/') {
        res.setHeader("Content-Type", "text/html; charset=utf-8")
        res.write('<html lang="en">')
        res.write('<head><title>Enter Message</title></head>')
        res.write('<body>')
        res.write('<form action="/message" method="post"><input type="text" name="message"><button type="submit">Send</button></form>')
        res.write('</body>')
        res.write('</html>')
        return res.end();
    }

    if (url === '/message' && method === 'POST') {
        const body = []
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString('utf8');
            const message = parsedBody.split("=")[1];
            fs.writeFile('message.txt', message, (err) => {
                res.writeHead(302, {'Location': '/'});
                return res.end();
            });
        });
    }
    // process.exit()
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write('<html lang="en">');
    res.write('<head><title>First NodeJS Page</title></head>');
    res.write('<body>');
    res.write('<h1>Hello from NodeJS Server</h1>');
    res.write('</body>');
    res.write('</html>');
    res.end();
});

server.listen(8080);