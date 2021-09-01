

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
    r['Real integer precision'] = findPrecision(gl) + 'M'
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
    tds[0][1].innerHTML = glInfo['GPU']
    tds[1][1].innerHTML = glInfo['vendor']
    var precisionStart = 2
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
    tds[precisionStart + 6][1].innerHTML =platform.name +
    " v" + platform.version +
    " on " + platform.os;


    
    
  
  }


  function getCheckPresisionShader(testNumber) {
    var checkPresisionShader = `
precision highp float;
precision highp int;

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
void main() {
  int test = ` + testNumber.toString() + `;
  test = test + 1;
  gl_FragColor = EncodeI(test);
  //gl_FragColor =vec4(.222,.5,.44,.22);

  
}
`
    return checkPresisionShader
  }



  function checkPrecision(gl, testNumber) {         //                CHECK PRECISION
    const program = webglUtils.createProgramFromSources(gl, [vs_info, getCheckPresisionShader(testNumber)]);
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
    console.log('JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ', InOut)
    return InOut[0][1]
  } // checkPrecision


  //const canvas = document.createElement('canvas');



  function findPrecision(gl) {
    var testArray2 = [1, 2, 3, 4, 5, 6, 7, 8, 8.3, 8.4, 9,
      10, 11, 12, 13, 14, 15, 16, 16.7, 16.8, 17, 18, 19, 20,
      100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 2100, 2200, 3000, 4000, 4100, 4200, 4300, 4400,
      5000, 6000, 7000, 8000, 9000, 10000
    ]
    var testArray = [ 16.7, 16.8,  2100, 2200, 4100, 4200, 4300, 4400    ]
  
    var maxVal = 0;
    for (var i = 0; i < testArray.length; i++) {
      var ta = testArray[i] * 1000 * 1000;
      var cp = checkPrecision(gl, ta)
      var diff = cp - ta
      //console.log('test2 : ', ta / 1000 / 1000, cp - ta)
      if (diff === 1) maxVal = testArray[i]
    }
    return maxVal  
  }





