

  var animResult = []
  var animCount = 0
  function calcPart(start, n) {
    //console.log('calc part', start, n)
    for (var i=start; i<n+start; i+=2) {
      var sq = Math.sqrt(i)+2;
      var isPrime = true;
      //console.log(i, sq)
      for (var j=3; j<sq; j+=2) {
        if (i % j == 0) {
          isPrime = false
          break;
        }
      }
      if (i - i.toFixed(0)) {
      //  debugger
      }
      if (isPrime) animResult.push(i)
    }
  }

  function calcClassicAnimBlock(startNumber, nn, onUpdate, onFinish) { //                  CLASSIC ANIM FRAME
    var step = Math.floor(nn / 10)
    step += (step % 2) ? 0 : 1
    console.log('start anim2', nn, step)
    var tt0 = Date.now()
    var count = 0;
    var localStart = 0
    function testStep() {
      if (localStart >= nn) {
        var tt1 = Date.now()
      //  debugger
        onFinish((tt1-tt0)/1000, animResult)
        return
      }
      var cand = startNumber + localStart; //index*2
      if (cand % 2 == 0) cand++
      calcPart(cand, step);
      console.log('llll aa ', animResult.length)
      
      onUpdate(localStart, nn)
      localStart += step
      var testFunction = testStep.bind(this)
      window.requestAnimationFrame(testFunction)
    } // test
    animCount++

    var testFunction = testStep.bind(this, 3)
    window.requestAnimationFrame(testFunction)
  }

  //calcClassicAnimationFrameStep(nn, 5000)


