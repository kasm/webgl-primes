const http = require('http');
const fs = require('fs')

const requestListener = function (req, res) {
var request = req
var response = res
//console.log('url: ', req.url)
function getFromBase64(b64) {
  var buff = Buffer.from(b64, 'base64')
  var str = buff.toString('utf-8')
  return str
}

if (request.method == 'POST') {
    console.log('POST')
    var body = ''
    request.on('data', function(data) {
      body += data
      console.log('Partial body: ' + body.length)
    })
    request.on('end', function() {
     body = JSON.parse(body)
      var fname = body.name;
	var fdata = getFromBase64(body.data);
      console.log('Body: ' + body.name + ' len: ' + fdata.length + ' ' +fdata.substr(0, 5))

  fs.writeFile(fname, fdata, (e) => console.log('written ', e));


console.log('body length: ', body.length)
      response.writeHead(200, {'Content-Type': 'text/html'})
      response.end('post received')
    })
  } else {
//    console.log('GET', req.url)
var fname = req.url.substring(1)
//console.log('fname ', fname)
var lastTime = 'aaaaaaa'
if (fname != 'favicon.ico') lastTime = fs.statSync(fname).mtime.toString()
console.log('last time ', lastTime)
    response.writeHead(200, {'Content-Type': 'text/html',
    'Last-Modified': lastTime})
//    response.writeHead(200, {'Content-Type': 'text/html'})
  //  response.writeHead(200, {'Content-Type': 'text/html'})
var data = fs.readFile(fname, (e, d) => response.end(d))

//    response.end(data)
  }
//})

// console.log('req ', req);
//console.log('json ', JSON.stringify(req))
 // res.writeHead(200);
  //res.end('Hello, World!');
}

const server = http.createServer(requestListener);
server.listen(5328);
