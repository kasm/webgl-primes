
  function calcClassicAnim(startNumber, nn, onUpdate, onFinish) {
    console.log('start anim')
    var tt0 = Date.now()
    var rez = []
    var count = 0;
    function test(index) {
     // console.log('test anim' , index, nn)
      if (index >= nn) {
        var tt1 = Date.now()
        var secs = (tt1-tt0)/1000
        onFinish(secs, rez)
        return
      }
      var cand = startNumber + index
      var isPrime = true
      var n = Math.sqrt(cand) + 2;
      for (var i=3; i<n; i++) {
        if (cand % i === 0) {
          isPrime = false;
          break;
        }
      }
      if (isPrime) rez.push(cand)
      onUpdate(index, nn)

      var testFunction = test.bind(this, index+2)
      window.requestAnimationFrame(testFunction)
    } // test

    var testFunction = test.bind(this, 0)
    window.requestAnimationFrame(testFunction)
  }