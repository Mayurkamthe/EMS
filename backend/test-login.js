const http = require('http');

const token = process.argv[2];
if (!token) {
    console.log('First getting token...');
    const loginData = JSON.stringify({ email: 'admin@college.edu', password: 'password' });
    const loginOpts = {
        hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': loginData.length }
    };
    const loginReq = http.request(loginOpts, res => {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => {
            const data = JSON.parse(body);
            console.log('Login:', res.statusCode);
            if (data.token) {
                // Now test stats endpoint
                testEndpoint('/api/reports/stats', data.token);
                testEndpoint('/api/events', data.token);
            }
        });
    });
    loginReq.write(loginData);
    loginReq.end();
}

function testEndpoint(path, token) {
    const opts = {
        hostname: 'localhost', port: 5000, path, method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    };
    const req = http.request(opts, res => {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => console.log(`${path}: ${res.statusCode} ${body.substring(0, 200)}`));
    });
    req.on('error', e => console.error(`${path} error:`, e.message));
    req.end();
}
