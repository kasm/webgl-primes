/*
IDE - phone pipeline

IDE
node file change listener
then
request to nginx web server and pass changed files
then
nginx configured to pass request to node app which recieves file and place it to dest location



https://stackoverflow.com/questions/44371643/nginx-php-failing-with-large-file-uploads-over-6-gb/44751210#44751210

*/


function sendPost(options, data) {
  var vopt = options

  // An object of options to indicate where to post to
  vopt = {
    host: '109.104.166.123',
    port: '5328',
    path: '/upload2/',
    method: 'POST',
    headers: {
        //'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/json',
        'Content-Length': data.length // Buffer.byteLength(data)
    }
};

// Set up the request
var post_req = http.request(vopt, function(res) {
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
      console.log('Response: ' + chunk);
  });
}) 
console.log('ddddddddddddd', data.substr(0, 22))     

post_req.write(data)
post_req.end()
} // send

const chokidar = require('chokidar')
const fs = require('fs')
chokidar.watch(['*'], {
  ignored:  ['**/node_modules/**/*', '**/.git/**/*'],
  ignoreInitial: true
}).on('all', (e, path) => {
  console.log(e, path)
  fs.readFile(path, 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    console.log('fileeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', data)
    var b64 = getBase64(data)
    toSend = JSON.stringify({name: path, data: b64})
    console.log('to Send: ', toSend)
    var orig = getFromBase64(b64)
    console.log('orig : ', orig)
    

    sendPost({}, toSend)

  })

}) 

console.log('ttteee')
var http = require('http');

/*
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Hello World!aaa');
  res.end();
}).listen(8080);
*/

var post_data = 'aaa'
var fname = 'fname'

function getBase64(str) {
  var buff = Buffer.from(str)
  var str64 = buff.toString('base64')
  return str64
}

function getFromBase64(b64) {
  var buff = Buffer.from(b64, 'base64')
  var str = buff.toString('utf-8')
  return str
}
/*
var buff = Buffer.from(post_data)
console.log('buff ', buff)
var tostr = buff.toString('base64')
console.log('to str', tostr)
var toSend = {fname: fname, data: tostr}
toSend = toSend
var ttt = JSON.stringify(toSend)
console.log(toSend)
console.log('ttt', ttt)

  // An object of options to indicate where to post to
  var post_options = {
    host: '109.104.166.123',
    port: '5328',
    path: '/upload2/',
    method: 'POST',
    headers: {
        //'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(ttt)
    }
};

// Set up the request
var post_req = http.request(post_options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('Response: ' + chunk);
    });
}) //.end();
*/

//post_req.write(ttt)
//post_req.end()
/* 
//                                WORKING GET
callback = function(response) {
  var str = '';

  //another chunk of data has been received, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been received, so we just print it out here
  response.on('end', function () {
    console.log(str);
  });
}

// post the data
//post_req.write(post_data);
//post_req.end();
console.log('before')
http.request({
  host: '109.104.166.123',
  port: '5328',
  //host: 'ixbt.com',
  //path: '/'
  path: '/upload2/bb.txt'
},
callback
).end()

*/