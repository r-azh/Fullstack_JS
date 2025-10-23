const resolvePromise = new Promise((resolve, reject) => {
    console.log("Inside resolve promise");
    setTimeout(() => {
      resolve("resolve promise success");
    }, 300);
  });

const rejectPromise = new Promise((resolve, reject) => {
    console.log("Inside reject promise");
    setTimeout(() => {
      reject("reject promise error");
    }, 300);
  });

// Add a catch handler to prevent unhandled rejection error for above function.
rejectPromise.catch((error) => {
  console.log("Caught rejection:", error);
});

const handleFulfilledA = (result) => {
    console.log("Fulfilled: A", " recieved: ", result);
    return new Promise((resolve) => {
        resolve("From A resolve");
      });
}

const handleRejectedA = (error) => {
    console.log("Rejected: A", " recieved: ", error);
    return new Promise((reject) => {
        reject("From A reject");
      });
}

const handleFulfilledB = (result) => {
    console.log("Fulfilled: B", " recieved: ", result);
    return new Promise((resolve) => {
        resolve("From B resolve");
      });
}

const handleRejectedB = (error) => {
    console.log("Rejected: B", " recieved: ", error);
    return new Promise((reject) => {
        reject("From B reject");
      });
}

const handleFulfilledC = (result) => {
    console.log("Fulfilled: C", " recieved: ", result);
}

const handleRejectedC = (error) => {
    console.log("Rejected: C", " recieved: ", error);
}

  
// resolvePromise
// .then(handleFulfilledA, handleRejectedA)
// .then(handleFulfilledB, handleRejectedB)
// .then(handleFulfilledC, handleRejectedC);

// rejectPromise
// .then(handleFulfilledA, handleRejectedA)
// .then(handleFulfilledB, handleRejectedB)
// .then(handleFulfilledC, handleRejectedC);

//using arrow functions
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("foo");
    }, 300);
  });

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
