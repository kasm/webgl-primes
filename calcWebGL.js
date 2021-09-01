


const canvas = document.createElement('canvas');


const vs = `
attribute vec4 position;
void main() {
  gl_Position = position;
}
`;






//function calcWebGL(startNumber, nn, onUpdate, onFinish) {
function calcWebGL(startNumber, nn, cb) {
  window.requestAnimationFrame(() => {
    cb.onStart();
    window.requestAnimationFrame(() => calcWebGLInt(startNumber, nn,3 , cb.onFinish))
  })
}
function calcWebGLInt(startNumber, nn, onUpdate, onFinish) {



function getPrimeShader(sq) {
  console.log('sssssssssssssssssssqqqqqqqqqqqqq', sq)
  const fs = `

  precision highp float;
  precision highp int;
  uniform sampler2D mytex0;
  uniform sampler2D mytex1;
  uniform sampler2D mytex2;
  uniform sampler2D mytex3;
  uniform vec2 srcDimensions;
  
  
  vec4 EncodeI(int v) {
    int d0, d1, d2, d3, t, vt;
    t = v / 256;
    d0 = v - t*256;
    vt = t / 256;
    d1 = t - vt*256;
    t = vt / 256;
    d2 = vt - t * 256;
    d3 = (v / 256) / 256 / 256;
    return vec4(
      float(d0) / 255.,
      float(d1) / 255.,
      float(d2) / 255.,
      float(d3) / 255.
    );
  }

  int myint(float v) { return int(v+.5);}
  
  void main() {
    vec2 texcoord = gl_FragCoord.xy / srcDimensions;
    vec4 value0 = texture2D(mytex0, texcoord); // [R / 255, G/255, B/255, A=1]
    vec4 value1 = texture2D(mytex1, texcoord);
    vec4 value2 = texture2D(mytex2, texcoord);
    vec4 value3 = texture2D(mytex3, texcoord);
    
    int vri = (int(value0[0]*255.) + 256*(int(value1[0]*255.) + 
          256*(int(value2[0]*255.) +  256*int(value3[0]*255.))));

     vri = (myint(value0[0]*255.) + 256*(myint(value1[0]*255.) + 
          256*(myint(value2[0]*255.) +  256*myint(value3[0]*255.))));


    int ds = 0; // store successful divider
    int d1;
   // vri = 1267457;
    for (int i=3; i<` + sq.toString() + `; i+=2) {
      d1 = vri / i;
      if (vri == (d1 * i) && ds == 0) ds=i; 
    }  
    int dsout = ds;
   // ds = 21; //*1000*1000; 
    //ds = 256*256*256*257;
     //ds = ds + 23111;
     ds = 1000*1000*1000 + 605;
     //ds = ds+1;
     d1 = ds /5;
     //ds = ds - (d1*5);
     if (ds == (d1 * 5) ) ds = 522;
     ds = vri;
     int ds2 = int(value0[0]*255.);
    // ds = int(gl_FragCoord.xy[1]); 
    gl_FragColor = EncodeI(dsout);
    //gl_FragColor = vec4(.222,.5,.44,.22);
  }
  `;
  return fs;
}
  

  var testNumber = 111200;


  var addParam = (pname, pvalue) => document.getElementById('webgl-params').innerHTML += 
    '<br>' + pname + ': ' + pvalue

  //addParam('mini test: ', tt1-tt0)

  const dstWidth = 512
  const dstHeight = Math.ceil(nn / dstWidth / 2);



  // make a 3x2 canvas for 6 results
  canvas.width = dstWidth;
  canvas.height = dstHeight;
  const gl = canvas.getContext('webgl2');
  /*
  var toCheck = 1003 * 1000 * 1000;
  var cp = checkPrecision(gl, toCheck)
  console.log('CHECK:::::', toCheck, cp)
*/

  var infoElem = document.getElementById('webgl-params')

  //printInfo(infoElem, { maxVal: ' Tanya Lina ' + findPrecision() + '*10^6' })
  //var exts = gl.getSupportedExtensions();  printInfo(infoElem, { extenstions: (JSON.stringify(exts)).replaceAll(',', ', ') })



  /*
  console.log(gl.getSupportedExtensions())
  console.log('version:', gl.VERSION)
  console.log('ppp', gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT))
  console.log('ppp', gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT))
  console.log('ppp', gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT))
  console.log('max tex ', gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
*/

  /*
        console.log('GPU: ', renderer)
        document.getElementById('gpu-info').innerHTML = 'GPU: ' + renderer
  
        addParam('GPU', renderer)
        var fprec = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT)
        fprec = Object.keys(fprec)
        console.log('fprec ', fprec)
        var p1 = {}; Object.assign(p1, fprec)
        addParam('float precision', JSON.stringify(p1))
        addParam('integer precision',gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT))
*/

  var program;

  function init(gl) {
    
    program = webglUtils.createProgramFromSources(gl, [vs, 
      getPrimeShader(Math.trunc(Math.sqrt(startNumber + nn) + 10))]);
    gl.useProgram(program); // use program before work with locations

    const positionLoc = gl.getAttribLocation(program, 'position');
    const srcDimensionsLoc = gl.getUniformLocation(program, 'srcDimensions');

    console.log('mmmmmmmmmmmmmmmmmmmmmmmmm ', dstWidth, dstHeight)
    gl.uniform2f(srcDimensionsLoc, dstWidth, dstHeight);


    //const myUniformLoc = gl.getUniformLocation(program, 'myuni')

    // setup a full canvas clip space quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1,
    ]), gl.STATIC_DRAW);

    // setup our attributes to tell WebGL how to pull
    // the data from the buffer above to the position attribute
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(
      positionLoc,
      2,         // size (num components)
      gl.FLOAT,  // type of data in buffer
      false,     // normalize
      0,         // stride (0 = auto)
      0,         // offset
    );

  } // init


  //var a = new Uint8Array([      1, 2, 3,      4, 5, 6,    ])
  var size = dstHeight * dstWidth;
  //mainWebglInfo(gl)


  init(gl)
  //getWebGLInfo(gl)


  var texNums = [
    gl.TEXTURE0,
    gl.TEXTURE1,
    gl.TEXTURE2,
    gl.TEXTURE3
  ]

  function myarrB(size, cb) {
    var a = new Uint8Array(size);
    for (var i = 0; i < size; i++) a[i] = cb(i)
    return a;
  }

  // add byte texture
  /*
  gl, width, height
  name - uni
  */
  function addByteTex(gl, width, height, name, num, arr) {     // ADD TEX
  //  console.log('ttttttttttttttttttttttt', width, height, arr)
    var texLoc = gl.getUniformLocation(program, name)
    var size = width * height
    var aa = new Uint8Array(size)
    for (var i = 0; i < size; i++) { aa[i] = i * 1; }
    //console.log('arr ' + name + ':',arr)
    var tex = gl.createTexture();
    gl.activeTexture(texNums[num])
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.LUMINANCE,
      width,
      height,
      0,
      gl.LUMINANCE,
      gl.UNSIGNED_BYTE,
      arr
    )

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.uniform1i(texLoc, num)
    return texLoc;
  }                                   // ADD TEX

  //                                           MY TEX
  if (1) {


    var toShader = [];
    for (var i = 0; i < size; i++) toShader[i] = startNumber + i * 2;
    //console.log('to shader', toShader)

    function getBytes(number) {
      var r = [];
      var t = number % 256;
      r.push(t);
      t = Math.trunc(number / 256)
      r.push(t % 256)
      t = Math.trunc(t / 256)
      r.push(t % 256)
      t = Math.trunc(t / 256)
      r.push(t % 256)
      return r
    }

    /*
    var b0 = addByteTex(gl, dstWidth, dstHeight, 'mytex0', 0, myarrB(size, (i) => i*20+1)) 
    var b1 = addByteTex(gl, dstWidth, dstHeight, 'mytex1', 1, myarrB(size, (i) => i*20+2)) 
    var b2 = addByteTex(gl, dstWidth, dstHeight, 'mytex2', 2, myarrB(size, (i) => i*20+5)) 
    var b3 = addByteTex(gl, dstWidth, dstHeight, 'mytex3', 3, myarrB(size, (i) => i*0+0)) 
    */

    var b0 = addByteTex(gl, dstWidth, dstHeight, 'mytex0', 0, 
      myarrB(size, (i) => getBytes(toShader[i])[0]))
    var b1 = addByteTex(gl, dstWidth, dstHeight, 'mytex1', 1, myarrB(size, (i) => getBytes(toShader[i])[1]))
    var b2 = addByteTex(gl, dstWidth, dstHeight, 'mytex2', 2, myarrB(size, (i) => getBytes(toShader[i])[2]))
    var b3 = addByteTex(gl, dstWidth, dstHeight, 'mytex3', 3, myarrB(size, (i) => getBytes(toShader[i])[3]))
    var b3 = addByteTex(gl, dstWidth, dstHeight, 'mytexCount', 3,
      myarrB(size, (i) => getBytes(toShader[i])[3]))
    //gl.uniform1i(b3, 2)

  } // if 1

  var simp;

  function calcWebGL2() {

    console.log('start webgl ...a')
    //gl.finish()
    var t0 = Date.now()
    gl.drawArrays(gl.TRIANGLES, 0, 6);  // draw 2 triangles (6 vertices)
    var t1 = Date.now();
    console.log('draw arrays timeout ', t1 - t0)
    console.log('www hhhh', dstWidth, dstHeight)

    // get the result
    const results = new Uint8Array(dstWidth * dstHeight * 4);
    gl.readPixels(0, 0, dstWidth, dstHeight, gl.RGBA, gl.UNSIGNED_BYTE, results);
    console.log('results', results)
    var t2 = Date.now()
    console.log('read pixels timeout ', t2 - t1)

    // print the results
    var rrez = []; results.map((e, i) => {
      var k = i % 4; var ii = Math.trunc(i / 4);
      (k) ? rrez[ii].push(e) : rrez[ii] = [e]
    })
    console.log('rrez ', rrez)
    InOut = [];
    InOut = rrez.map((e, i) => [toShader[i], e.reduce((a, e, i) => a + e * Math.pow(256, i), 0)])
    //var ttt = [1,0,1,0]
    //rrrez = ttt.reduce((a,e,i) => a+e * Math.pow(256, i), 0)
    //console.log('read pixels results ', results, JSON.stringify(rrez)) 
    //console.log('inOut2', JSON.stringify(rrez)) 
    //console.log('inOut', JSON.stringify(InOut))

    simp = [];
    for (var i = 0; i < size; i++) {
      if (InOut[i][1] === 0) simp.push(toShader[i])
    }
    simp2 = []; simp.map(e => { if (e < startNumber + nn) simp2.push(e) })

    console.log('simp webgl', simp2.length, simp2)
    //console.log('simp webgl', simp)
    console.log('end webgl ...')
    //document.getElementById('webglTime').innerHTML = t2 -t0
    return (t2 - t0) / 1000
  } // calcWebGL2

  var simp2, InOut
  var time = calcWebGL2()
  onFinish(time, simp2)
  var el = document.getElementById('webglElem')
  //el.innerHTML = simp2.length + ' : ' + JSON.stringify(InOut).replaceAll(',', ', ') 

  //document.getElementById('webglButton').addEventListener('click',  () => calcWebGL())

} // calcWebGLInt