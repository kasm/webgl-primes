# webgl-primes
Experiment on using a WebGL API to calculate prime numbers

Archtecture

Dashboard
Contains mini benchmark, buttons to start each task, results for different bechmarks, comparation chart

Calculators
Functions which perform calculations.
API:
function calc(startNumber, toCalc, updateFunc, onFinish) {    
    return {
        timeSpent,
        results
    }
}

updateFunc = (numberProcessed, NumberTotal) => {
    document.getElementById('bla').innerHTML = (numberProcessed/numberTotal*100).toFixed
}

onFinish = (time, result)