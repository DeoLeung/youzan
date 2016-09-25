'use strict';
var server = require('./server');

const appid = process.argv[2];
const appsecret = process.argv[3];
const port = parseInt(process.argv[4]) || 3000;
let kdt = {};
kdt[appid] = appsecret;

const app = server(kdt);
app.listen(port);
console.log(`Started hook for ${appid} on port ${port}`);

