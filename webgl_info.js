let precFloat = [
  {precision: 'lowp', isFloat: 'float' },
  {precision: 'mediump', isFloat: 'float'}, 
  {precision: 'highp', isFloat: 'float'}, 
  {precision: 'lowp', isFloat: 'int'}, 
  {precision: 'mediump', isFloat: 'int'}, 
  {precision: 'highp', isFloat: 'int'}, 
]


  const vs_info = `
  attribute vec4 position;
  void main() {
    gl_Position = position;
  }
  `;

  function getWebGLInfo(gl) {
    var r = {}
    var vfprec = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT)
    var viprec = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT)
    var ffprec = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT)
    var fiprec = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT)
    function precParse(prec) {
      return {
        rangeMin: prec.rangeMin,
        rangeMax: prec.rangeMax,
        precision: prec.precision
      }
    }
    r['vertex float precision'] = JSON.stringify(precParse(vfprec))
    r['vertex integer precision'] = JSON.stringify(precParse(viprec))
    r['fragment float precision'] = JSON.stringify(precParse(ffprec))
    r['fragment integer precision'] = JSON.stringify(precParse(fiprec))
    var debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    var vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
    var renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    if (renderer.includes('SwiftShader')) renderer += ' (NO GPU)'
    console.log('viprec ', JSON.stringify(precParse(viprec)))
    console.log('vfprec ', precParse(vfprec))
    r['GPU'] = renderer;
    r['vendor'] = vendor
    r['Real integer precision'] = findPrecisionMulty(gl) + 'M'
    console.log('rrrrrrrrrrrrrrrr21', r)
    return r;
  } // getWebGLInfo
 
  function printInfo(el, info) {
  //  debugger
    Object.keys(info).map(e => el.innerHTML += '<br>' + e + ': ' + info[e])
    //Object.keys(info).map(e => el.innerHTML += '<tr><td>' + e + '</td><td> ' + info[e] + '</td></tr>')
  }

  function mainGetInfo() {
    const canvas2 = document.createElement('canvas');
console.log('main get info')
    const gl = canvas2.getContext('webgl2');
    mainWebglInfo(gl)

  }
  //mainWebglInfo()
  mainGetInfo()

  function mainWebglInfo(gl) {
    var infoElem2 = document.getElementById('webgl-params2')
    var glInfo = getWebGLInfo(gl)
  //  printInfo(infoElem2, glInfo)

    var infoElem = document.getElementById('webgl-params')
    //var infoElem = document.getElementById('webglTable')
    var trs = infoElem.querySelectorAll('tr')
    var tds = Array.from(trs).map(e => e.querySelectorAll('td'))
    tds[0][1].innerHTML = glInfo['vendor']
    tds[1][1].innerHTML =platform.name +
    " v" + platform.version +
    " on " + platform.os;
    tds[2][1].innerHTML = glInfo['GPU']

    var precisionStart = 3
    var vertexFloatPrec = JSON.parse(glInfo['vertex float precision'])
    tds[precisionStart + 1][1].innerHTML = vertexFloatPrec['precision']
    tds[precisionStart + 1][2].innerHTML = vertexFloatPrec['rangeMin']
    tds[precisionStart + 1][3].innerHTML = vertexFloatPrec['rangeMax']
    var vertexIntPrec = JSON.parse(glInfo['vertex integer precision'])
    tds[precisionStart + 2][1].innerHTML = vertexIntPrec['precision']
    tds[precisionStart + 2][2].innerHTML = vertexIntPrec['rangeMin']
    tds[precisionStart + 2][3].innerHTML = vertexIntPrec['rangeMax']
    var fragmetFloatPrec = JSON.parse(glInfo['fragment float precision'])
    tds[precisionStart + 3][1].innerHTML = fragmetFloatPrec['precision']
    tds[precisionStart + 3][2].innerHTML = fragmetFloatPrec['rangeMin']
    tds[precisionStart + 3][3].innerHTML = fragmetFloatPrec['rangeMax']
    var fragmentIntPrec = JSON.parse(glInfo['fragment integer precision'])
    tds[precisionStart + 4][1].innerHTML = fragmentIntPrec['precision']
    tds[precisionStart + 4][2].innerHTML = fragmentIntPrec['rangeMin']
    tds[precisionStart + 4][3].innerHTML = fragmentIntPrec['rangeMax']

    tds[precisionStart + 5][1].innerHTML = glInfo['Real integer precision']
  }










function getCheckPresisionShader(testNumber, precision, isFloat) {
  let fprec = 'precision highp float;'
  if (isFloat == 'float') fprec = 'precision '  + precision + ' float;' 
  // let fprec = 'precision ' + precision + 'float;' // ' + isFloat + ';'
  let iprec = 'precision highp int;'
  if (isFloat == 'int') iprec = 'precision ' + precision + ' int;'



  let calcPart = `
  int test = ` + testNumber.toString() + `;
    // float test = ` + testNumber.toString() + `.;
    test = test + 1;
    gl_FragColor = EncodeI(test);
    
  `
  if (isFloat == 'float') calcPart = `
    float test = ` + testNumber.toString() + `.;
    test = test + 1.;
    gl_FragColor = EncodeF(test);
  
  
  `


  var checkPresisionShader = `

  ` + fprec + `
  
  ` + iprec + `
  
  
// precision lowp float;
// precision highp int;

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

  vec4 EncodeF(float v1) {
  int v = int(v1 + .0);
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

  vec3 enc3(float v1) {
    int v = int(v1 );
    int d0, d1, d2, d3, t, vt;
    t = v / 256;
    d0 = v - t*256;
    vt = t / 256;
    d1 = t - vt*256;
    t = vt / 256;
    d2 = vt - t * 256;
    d3 = (v / 256) / 256 / 256;
    return vec3(
      float(d0) / 255.,
      float(d1) / 255.,
      float(d2) / 255.
     // float(d3) / 255.
    );
  }
  vec4 EncodeF2(float f) { //                     FLOAT32 ENCODE TO RGBA
    float order = floor(log2(f)); 
    float base = pow(2., order);
    
    // convert to the standard form and remove 
    // highest bit (186 => 1.86 => .86)
    float m = f / base - 1.; 
  
    // 8388608 == 256. * 256. * 256. / 2.
    vec3 e3 = enc3(m * 8388608.); // convert to integer (1 bit in b2 left to order bit)
  
    float t1 = order - floor(order/2.) * 2.;
    return vec4(e3[0] , e3[1] , e3[2] + (1.-t1) * 128./255.,
    ( floor((order-1.) / 2.)  + 64.)/ 256.);
  }


void main() {

` + calcPart + `


  // // int test = ` + testNumber.toString() + `;
  // float test = ` + testNumber.toString() + `.;
  // test = test + 1.;
  // gl_FragColor = EncodeF(test);
  // gl_FragColor =vec4(.222,.5,.44,.22); // 946 896 697

  
}
`

console.log(checkPrecision)
  return checkPresisionShader
}



  function checkPrecision(gl, testNumber, prec, flo) {         //                CHECK PRECISION
    const program = webglUtils.createProgramFromSources(gl, [vs_info, getCheckPresisionShader(testNumber, prec, flo)]);
    gl.useProgram(program); // use program before work with locations


    const positionLoc = gl.getAttribLocation(program, 'position');
    const srcDimensionsLoc = gl.getUniformLocation(program, 'srcDimensions');

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

    gl.drawArrays(gl.TRIANGLES, 0, 6);  // draw 2 triangles (6 vertices)

    // get the result
    var dstHeight = 200; var dstWidth = 200;
    var results = new Uint8Array(dstWidth * dstHeight * 4);

    gl.readPixels(0, 0, dstWidth, dstHeight, gl.RGBA, gl.UNSIGNED_BYTE, results);

    // print the results
    var rrez = []; results.map((e, i) => {
      var k = i % 4; var ii = Math.trunc(i / 4);
      (k) ? rrez[ii].push(e) : rrez[ii] = [e]
    })
    InOut = []; InOut = rrez.map((e, i) => [testNumber, e.reduce((a, e, i) => a + e * Math.pow(256, i), 0)])
    console.log('JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ', testNumber, InOut[0])
    return InOut[0][1]
  } // checkPrecision


  //const canvas = document.createElement('canvas');



  function findPrecision1(gl) {
    var testArray2 = [1, 2, 3, 4, 5, 6, 7, 8, 8.3, 8.4, 9,
      10, 11, 12, 13, 14, 15, 16, 16.7, 16.8, 17, 18, 19, 20,
      100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2001, 2100, 2200, 3000, 4000, 4100, 4200, 4300, 4400,
      5000, 6000, 7000, 8000, 9000, 10000
    ]
    var testArray = [ 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 16.7, 16.8, 20, 1100, 2200, 4100, 4200, 4300, 4400    ]
  
    var maxVal = 0;
    for (var i = 0; i < testArray.length; i++) {
      console.warn(i, testArray[i])
      var ta = testArray[i] * 1000 * 1000;

      var cp = checkPrecision(gl, ta)
      var diff = cp - ta
      console.log('test2 : ', ta / 1000 / 1000, cp - ta)
      if (diff === 1) maxVal = testArray[i]
    }
    return maxVal  
  }

  // let precFloat = [
  //   {precision: 'lowp', isFloat: 'float' },
  //   {precision: 'mediump', isFloat: 'float'}, 
  //   {precision: 'highp', isFloat: 'float'}, 
  //   {precision: 'lowp', isFloat: 'int'}, 
  //   {precision: 'mediump', isFloat: 'int'}, 
  //   {precision: 'highp', isFloat: 'int'}, 
  // ]
  

  function findPrecisionMulty(gl) {
    var testArray2 = [1, 2, 3, 4, 5, 6, 7, 8, 8.3, 8.4, 9,
      10, 11, 12, 13, 14, 15, 16, 16.7, 16.8, 17, 18, 19, 20,
      100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2001, 2100, 2200, 3000, 4000, 4100, 4200, 4300, 4400,
      5000, 6000, 7000, 8000, 9000, 10000
    ]
    var testArray = [ 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 16.7, 16.8, 20, 1100, 2100, 2200, 4100, 4200, 4300, 4400    ]
  
    var maxVal = 0;
    for (let ii=0; ii<precFloat.length; ii++) {
      maxVal=0
      let prec = precFloat[ii].precision
      let flo = precFloat[ii].isFloat
    for (var i = 0; i < testArray.length; i++) {
      console.warn(i, testArray[i], prec, flo)
      var ta = testArray[i] * 1000 * 1000;

      var cp = checkPrecision(gl, ta, prec, flo)
      var diff = cp - ta
      console.log('test2 : ', ta / 1000 / 1000, cp - ta)
      if (diff === 1) maxVal = testArray[i]
    }
    precFloat[ii].maxVal = maxVal
  }

  fillPrecHtml(precFloat)
  console.warn('_____________________________ ', precFloat)
    return maxVal  
  }

  function fillPrecHtml(data) {
    let cont = document.createElement('div')
    cont = document.getElementById('precs')
    for (let i=0; i<data.length; i++) {
      let e = data[i]
      cont.innerHTML += e.maxVal + '; '
      let el = document.createElement('div')

    }
  }





