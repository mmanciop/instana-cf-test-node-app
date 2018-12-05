/*

Copyright 2018 Instana GmbH

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

const instana = require('instana-nodejs-sensor')({
    serviceName: 'instana-cf-test-app'
  });

const http = require('http');

const hostname = '0.0.0.0';
const port = 8080;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end('{ "greeting" : "Hello World" }');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);

    setInterval(function() {
        http.get(`http://localhost:${port}/instana-cf-test-node-app`, (res) => {
            res.setEncoding('utf8');
            let rawData = '';

            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
              try {
                const parsedData = JSON.parse(rawData);
                console.log(`Outcome of pinging the local HTTP server: ${JSON.stringify(parsedData)}`);
              } catch (e) {
                console.error(`Error while pinging the local HTTP server: ${e.message}`);
              }
            });
        }).on('error', (e) => {
            console.error(`Error while pinging the local HTTP server: ${e.message}`);
        });
    }, 10000)
});