const http = require('http');
const fs = require('fs');

const PORT = 3000;
const PATH = './requests.json';

http.createServer((request, response) => {
    response.writeHead(200, {'Content-type': 'application/json'});
    response.write(JSON.stringify({status: 'ok'}));

    let fileData;
    let log = {
        method: request.method,
        url: request.url,
        time: Date.now(),
    };

    fs.readFile(PATH, (error, data) => {
        if (!error) fileData = JSON.parse(data);
        else if (error.code === 'ENOENT') fileData = { logs: [] };
        else throw error;

        fileData.logs.push(log);
        fs.writeFile(PATH, JSON.stringify(fileData, null, 2), (error) => {
            if (error) throw error;
            console.log('File has changed');
        })

        if(request.url === '/logs') {
            response.write(JSON.stringify(fileData, null, 2));
        }
    });

}).listen(PORT);