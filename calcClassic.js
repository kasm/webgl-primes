function calcClassic(startNumber, toWork,  onUpdate,onFinish) {  
  onUpdate();
  console.log('classic ', startNumber, toWork)  
    var rez = []
    var t0 = Date.now()
    for (var i=startNumber; i<=startNumber+toWork; i+=2) {
        var sq = Math.sqrt(i) +2
        var isPrime = true
        for (var j=3; j<sq; j+=2) {
            if (i%j == 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) rez.push(i)
    }
    var t1 = Date.now()
    var time = (t1-t0)/1000
    debugger
    onUpdate()
    console.log('time classic', time)
    console.log('time rez', rez)

    onFinish(time, rez)
    onUpdate()

}




function calcClassicObj(startNumber, toWork, cb) {

  function calc() {
    var rez = []
    var t0 = Date.now()
    for (var i=startNumber; i<=startNumber+toWork; i+=2) {
        var sq = Math.sqrt(i) +2
        var isPrime = true
        for (var j=3; j<sq; j+=2) {
            if (i%j == 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) rez.push(i)
    }
    var t1 = Date.now()
    var time = (t1-t0)/1000
    console.log('time classic', time)
    console.log('time rez', rez)
    cb.onFinish(time,rez)
  }

  window.requestAnimationFrame(() => {
    cb.onStart();
    window.requestAnimationFrame(calc);  
  })
}


 








function calcClassic222(nn) {      //              CLASSIC
    console.log('start classic ', nn)
    t0 = Date.now()
    var n0 = startNumber + 1;

    function check(n) {
      var tooo = Math.sqrt(n) + 2;
      for (var i = 3; i < tooo; i += 2) {
        if (n % i === 0) return i
      }
      return 0;
    }
    var i;

    function updatePercent() {
      var t = i / nn
      var s = (t * 100).toFixed(2) + '%'
      document.getElementById('percent').innerHTML = s
      console.log(s)
      requestAnimationFrame(updatePercent)
    }
    //var nn = size*2;
    var crez = []
    var cdel = []
    updatePercent()
    for (var i = 0; i < nn; i += 2) {
      var cn = n0 + i
      if (!check(cn)) crez.push(cn)
      //cdel.push([cn, check(cn)])

      //if ( i%10000 ==0) updatePercent(i/nn)

    }
    t1 = Date.now()
    var time = ((t1-t0)/1000)
    var stime = time.toFixed(3)
    console.log('CLASSIC checked ', nn)
    console.log('classic time', stime, ' found numbers: ', crez.length)
    console.log('number per second: ', nn / time)
    document.getElementById('classicTime').innerHTML = t1 - t0
  } // calc classic

  //calcClassic(nn)


  
function calcTyped() {    //                CLASSIC TYPED
    var a = new Uint32Array(size)
    var i = new Uint32Array(16)
    var nn = size*2;
    var n0 = startNumber + 1;

    function check(n) {
        let i = new Uint32Array(16)
        i[1] = Math.sqrt(n) + 2;
        i[0] = 3
        i[2] = n
        while(i[0] < i[1]) {
            if (i[2] % i[0] == 0) return i[0]
            i[0] += 2
        }
        return 0
    }
    var t0 = Date.now()
    for (var i=0 ; i<nn; i++) {var cn = n0+i
        if (!check(cn)) a[i] = cn
    }
    var t1 = Date.now()
    console.log('typed ', t1 - t0)
    console.log(a)
}
//calcTyped()