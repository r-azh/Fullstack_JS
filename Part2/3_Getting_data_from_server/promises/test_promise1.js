function doSomething() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Other things to do before completion of the promise
        console.log("Did something");
        // The fulfillment value of the promise
        resolve("https://example.com/");
      }, 200);
    });
  }

function successCallback(result) {
    console.log(`The promise was resolved with: ${result}`);
}

function failureCallback(error) {
    console.error(`The promise was rejected with: ${error}`);
}


function doSomethingElse(result) {
    console.log(`Doing something else with: ${result}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("https://google.com/");
      }, 200);
    });
  }

function doThirdThing(result) {
    console.log(`Doing third thing with: ${result}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("https://yahoo.com/");
      }, 200);
    });
  }

console.log('running doSomething chain:');
doSomething()
  .then(function (result) {
    return doSomethingElse(result);
  })
  .then(function (newResult) {
    return doThirdThing(newResult);
  })
  .then(function (finalResult) {
    console.log(`Got the final result: ${finalResult}`);
  })
  .catch(failureCallback);


// console.log('calling promise chain:');
// const promise1 = doSomething();
// const promise2 = promise1.then(successCallback, failureCallback);

// console.log('running promise1:');
// promise1

// console.log('running promise2:');
// promise2
