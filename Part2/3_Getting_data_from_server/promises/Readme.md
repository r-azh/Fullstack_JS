To run js files in an empty folder

```sh
npm init
```
It will create package.json

If there is any package to install
```sh
npm install moment --save
```

To run the file:
```shell
node test_promise1.js
```

# Promises
A Promise is an object representing the eventual completion or failure of an asynchronous operation. 
 
 ## [Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)

Essentially, a promise is a returned object to which you attach callbacks, instead of passing callbacks into a function. Imagine a function, createAudioFileAsync(), which asynchronously generates a sound file given a configuration record and two callback functions: one called if the audio file is successfully created, and the other called if an error occurs.

If createAudioFileAsync() were written to return a promise, you would attach your callbacks to it like this:
```js
createAudioFileAsync(audioSettings).then(successCallback, failureCallback);
```
### Chaining

A common need is to execute two or more asynchronous operations back to back, where each subsequent operation starts when the previous operation succeeds, with the result from the previous step.

With promises, we accomplish this by creating a promise chain. The API design of promises makes this great, because callbacks are attached to the returned promise object, instead of being passed into a function.

Here's the magic: the then() function returns a new promise, different from the original:
```js
const promise = doSomething();
const promise2 = promise.then(successCallback, failureCallback);
```

## [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

A Promise is a proxy for a value not necessarily known when the promise is created. It allows you to associate handlers with an asynchronous action's eventual success value or failure reason. This lets asynchronous methods return values like synchronous methods: instead of immediately returning the final value, the asynchronous method returns a promise to supply the value at some point in the future.

A Promise is in one of these states:

    pending: initial state, neither fulfilled nor rejected.
    fulfilled: meaning that the operation was completed successfully.
    rejected: meaning that the operation failed.

The eventual state of a pending promise can either be fulfilled with a value or rejected with a reason (error). When either of these options occur, the associated handlers queued up by a promise's then method are called. If the promise has already been fulfilled or rejected when a corresponding handler is attached, the handler will be called, so there is no race condition between an asynchronous operation completing and its handlers being attached.

A promise is said to be settled if it is either fulfilled or rejected, but not pending.
[image](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/promises.png)

You will also hear the term resolved used with promises — this means that the promise is settled or "locked-in" to match the eventual state of another promise, and further resolving or rejecting it has no effect. 

The promise methods then(), catch(), and finally() are used to associate further action with a promise that becomes settled. 

### then()
The then() method takes up to two arguments; the first argument is a callback function for the fulfilled case of the promise, and the second argument is a callback function for the rejected case.

### catch(), finally()
 The catch() and finally() methods call then() internally and make error handling less verbose. For example, a catch() is really just a then() without passing the fulfillment handler. As these methods return promises, they can be chained. For example:
 ```js
 const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("foo");
  }, 300);
});

myPromise
  .then(handleFulfilledA, handleRejectedA)
  .then(handleFulfilledB, handleRejectedB)
  .then(handleFulfilledC, handleRejectedC);
```

Using arrow functions for the callback functions, implementation of the promise chain might look something like this:
```js
myPromise
  .then((value) => `${value} and bar`)
  .then((value) => `${value} and bar again`)
  .then((value) => `${value} and again`)
  .then((value) => `${value} and again`)
  .then((value) => {
    console.log(value);
  })
  .catch((err) => {
    console.error(err);
  });
  ```
