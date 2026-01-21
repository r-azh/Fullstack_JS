# [Exercises 3.1.-3.6.](https://fullstackopen.com/en/part3/node_js_and_express#exercises-3-1-3-6)

NB: Because this is not a frontend project and we are not working with React, the application is not created with create vite@latest -- --template react. You initialize this project with the npm init command that was demonstrated earlier in this part of the material.

NB: Because the "node_modules" is created using "npm init", it will not be excluded when you are trying to add your code to git using "git add .", therefore please create a file called ".gitignore" and write "node_modules" so that git ignores it everytime you try to add, commit or push to a remote repo.

Strong recommendation: When you are working on backend code, always keep an eye on what's going on in the terminal that is running your application.

```shell
npm init
```

## 3.1: Phonebook backend step 1
Implement a Node application that returns a hardcoded list of phonebook entries from the address http://localhost:3001/api/persons.

```shell
mkdir phonebook
cd phonebook
npm init
npm install express
```

## 3.2: Phonebook backend step 2

Implement a page at the address http://localhost:3001/info that looks roughly like the picture

The page has to show the time that the request was received and how many entries are in the phonebook at the time of processing the request.


## 3.3: Phonebook backend step 3

Implement the functionality for displaying the information for a single phonebook entry. The url for getting the data for a person with the id 5 should be http://localhost:3001/api/persons/5

If an entry for the given id is not found, the server has to respond with the appropriate status code.

## 3.4: Phonebook backend step 4
Implement functionality that makes it possible to delete a single phonebook entry by making an HTTP DELETE request to the unique URL of that phonebook entry.

Test that your functionality works with either Postman or the Visual Studio Code REST client.

## 3.5: Phonebook backend step 5


Expand the backend so that new phonebook entries can be added by making HTTP POST requests to the address http://localhost:3001/api/persons.

Generate a new id for the phonebook entry with the Math.random function. Use a big enough range for your random values so that the likelihood of creating duplicate ids is small.

## 3.6: Phonebook backend step 6
Implement error handling for creating new entries. The request is not allowed to succeed, if:

    The name or number is missing
    The name already exists in the phonebook

Respond to requests like these with the appropriate status code, and also send back information that explains the reason for the error, e.g.:

# [Exercises 3.7.-3.8 ](https://fullstackopen.com/en/part3/node_js_and_express#exercises-3-7-3-8)

## 3.7: Phonebook backend step 7


Add the [morgan](https://github.com/expressjs/morgan) middleware to your application for logging. Configure it to log messages to your console based on the tiny configuration.

The documentation for Morgan is not the best, and you may have to spend some time figuring out how to configure it correctly. However, most documentation in the world falls under the same category, so it's good to learn to decipher and interpret cryptic documentation in any case.

Morgan is installed just like all other libraries with the npm install command. Taking morgan into use happens the same way as configuring any other middleware by using the app.use command.

```shell
npm install morgan
```

## 3.8*: Phonebook backend step 8
Configure morgan so that it also shows the data sent in HTTP POST requests:
terminal showing post data being sent

Note that logging data even in the console can be dangerous since it can contain sensitive data and may violate local privacy law (e.g. GDPR in EU) or business-standard. In this exercise, you don't have to worry about privacy issues, but in practice, try not to log any sensitive data.

This exercise can be quite challenging, even though the solution does not require a lot of code.

This exercise can be completed in a few different ways. One of the possible solutions utilizes these two techniques:

    [creating new tokens](https://github.com/expressjs/morgan#creating-new-tokens)
    [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)



# [Exercises 3.9.-3.11](https://fullstackopen.com/en/part3/deploying_app_to_internet#exercises-3-9-3-11)

The following exercises don't require many lines of code. They can however be challenging, because you must understand exactly what is happening and where, and the configurations must be just right.

## 3.9 Phonebook backend step 9

Make the backend work with the phonebook frontend from the exercises of the previous part. Do not implement the functionality for making changes to the phone numbers yet, that will be implemented in exercise 3.17.

You will probably have to do some small changes to the frontend, at least to the URLs for the backend. Remember to keep the developer console open in your browser. If some HTTP requests fail, you should check from the Network-tab what is going on. Keep an eye on the backend's console as well. If you did not do the previous exercise, it is worth it to print the request data or request.body to the console in the event handler responsible for POST requests.

## 3.10 Phonebook backend step 10

Deploy the backend to the internet, for example to Fly.io or Render. If you are using Fly.io the commands should be run in the root directory of the backend (that is, in the same directory where the backend package.json is).

PRO TIP: When you deploy your application to Internet, it is worth it to at least in the beginning keep an eye on the logs of the application AT ALL TIMES.

Test the deployed backend with a browser and Postman or VS Code REST client to ensure it works.

Create a README.md at the root of your repository, and add a link to your online application to it.


## 3.11 Full Stack Phonebook

Generate a production build of your frontend, and add it to the Internet application using the method introduced in this part.

Also, make sure that the frontend still works locally (in development mode when started with command npm run dev).

If you use Render, make sure the directory dist is not ignored by git on the backend.

NOTE: You shall NOT be deploying the frontend directly at any stage of this part. Only the backend repository is deployed throughout the whole part. The frontend production build is added to the backend repository, and the backend serves it as described in the section Serving static files from the backend.


# [Exercise 3.12.](https://fullstackopen.com/en/part3/saving_data_to_mongo_db#exercise-3-12)

## 3.12: Command-line database

Create a cloud-based MongoDB database for the phonebook application with MongoDB Atlas.

Create a mongo.js file in the project directory, that can be used for adding entries to the phonebook, and for listing all of the existing entries in the phonebook.

NB: Do not include the password in the file that you commit and push to GitHub!

The application should work as follows. You use the program by passing three command-line arguments (the first is the password), e.g.:
```sh
node mongo.js yourpassword Anna 040-1234556
```

As a result, the application will print:
```sh
added Anna number 040-1234556 to phonebook
```
The new entry to the phonebook will be saved to the database. Notice that if the name contains whitespace characters, it must be enclosed in quotes:
```sh
node mongo.js yourpassword "Arto Vihavainen" 045-1232456
```
If the password is the only parameter given to the program, meaning that it is invoked like this:
```sh
node mongo.js yourpassword
```
Then the program should display all of the entries in the phonebook:
```sh
phonebook:
Anna 040-1234556
Arto Vihavainen 045-1232456
Ada Lovelace 040-1231236
```
You can get the command-line parameters from the process.argv variable.

NB: do not close the connection in the wrong place. E.g. the following code will not work:
```js
Person
  .find({})
  .then(persons=> {
    // ...
  })

mongoose.connection.close()
```
In the code above the mongoose.connection.close() command will get executed immediately after the Person.find operation is started. This means that the database connection will be closed immediately, and the execution will never get to the point where Person.find operation finishes and the callback function gets called.

The correct place for closing the database connection is at the end of the callback function:
```js
Person
  .find({})
  .then(persons=> {
    // ...
    mongoose.connection.close()
  })
```

NB: If you define a model with the name Person, mongoose will automatically name the associated collection as people.

# ## [Exercises 3.13.-3.14.](https://fullstackopen.com/en/part3/saving_data_to_mongo_db#exercises-3-13-3-14)

3.13: Phonebook database, step 1

3.14: Phonebook database, step 2


# [Exercises 3.15.-3.18.](https://fullstackopen.com/en/part3/saving_data_to_mongo_db#exercises-3-15-3-18)

# 3.15: Phonebook database, step 3

# 3.16: Phonebook database, step 4

# 3.17*: Phonebook database, step 5

# 3.18*: Phonebook database step 6

# [Exercises 3.19.-3.22.](https://fullstackopen.com/en/part3/validation_and_es_lint#exercises-3-19-3-22)

## 3.19*: Phonebook database, step 7

Expand the validation so that the name stored in the database has to be at least three characters long.

Expand the frontend so that it displays some form of error message when a validation error occurs. Error handling can be implemented by adding a _catch_ block as shown below:

```js
personService
    .create({ ... })
    .then(createdPerson => {
      // ...
    })
    .catch(error => {
      // this is the way to access the error message
      console.log(error.response.data.error)
    })
```

You can display the default error message returned by Mongoose, even though they are not as readable as they could be.

**NB:** On update operations, mongoose validators are off by default. Read the documentation to determine how to enable them.

## 3.20*: Phonebook database, step 8

Add validation to your phonebook application, which will make sure that phone numbers are of the correct form. A phone number must:

* have length of 8 or more
* be formed of two parts that are separated by -, the first part has two or three numbers and the second part also consists of numbers  
   * eg. 09-1234556 and 040-22334455 are valid phone numbers  
   * eg. 1234556, 1-22334455 and 10-22-334455 are invalid

Use a Custom validator to implement the second part of the validation.

If an HTTP POST request tries to add a person with an invalid phone number, the server should respond with an appropriate status code and error message.

## 3.21: Deploying the database backend to production

Generate a new "full stack" version of the application by creating a new production build of the frontend, and copying it to the backend directory. Verify that everything works locally by using the entire application from the address http://localhost:3001/.

Push the latest version to Fly.io/Render and verify that everything works there as well.

**NOTE:** You shall NOT be deploying the frontend directly at any stage of this part. Only the backend repository is deployed throughout the whole part. The frontend production build is added to the backend repository, and the backend serves it as described in the section Serving static files from the backend.

## 3.22: Lint configuration

Add ESlint to your application and fix all the warnings.

This was the last exercise of this part of the course. It's time to push your code to GitHub and mark all of your finished exercises to the exercise submission system.
