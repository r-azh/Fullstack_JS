
# [Exercises 2.1.-2.5](https://fullstackopen.com/en/part2/rendering_a_collection_modules#exercises-2-1-2-5)


Note that if you copy a project from one place to another, you might have to delete the node_modules directory and install the dependencies again with the command npm install before you can start the application.

```shell
npm install
npm run dev
```
Generally, it's not recommended that you copy a project's whole contents and/or add the node_modules directory to the version control system.

## 2.1: Course information step 6


Let's finish the code for rendering course contents from exercises 1.1 - 1.5. You can start with the code from the model answers. The model answers for part 1 can be found by going to the submission system, clicking on my submissions at the top, and in the row corresponding to part 1 under the solutions column clicking on show. To see the solution to the course info exercise, click on App.jsx under courseinfo.

Note that if you copy a project from one place to another, you might have to delete the node_modules directory and install the dependencies again with the command npm install before you can start the application.

Generally, it's not recommended that you copy a project's whole contents and/or add the node_modules directory to the version control system.

Let's change the App component like so:
```js
const App = () => {
  const course = {
    id: 1,
    ...
  }

  return <Course course={course} />
}
```

## 2.2: Course information step 7
Show also the sum of the exercises of the course.

## 2.3*: Course information step 8

If you haven't done so already, calculate the sum of exercises with the array method reduce.

## 2.4: Course information step 9

Let's extend our application to allow for an arbitrary number of courses

## 2.5: Separate module step 10
Declare the Course component as a separate module, which is imported by the App component. You can include all subcomponents of the course in the same module.


# [Exercises 2.6.-2.10](https://fullstackopen.com/en/part2/forms#exercises-2-6-2-10)

## 2.6: The Phonebook Step 1

Let's create a simple phonebook. In this part, we will only be adding names to the phonebook.

Let us start by implementing the addition of a person to the phonebook.

Sometimes it can be useful to render state and other variables as text for debugging purposes. You can temporarily add the following element to the rendered component:
```js
<div>debug: {newName}</div> 
```
NB:

    you can use the person's name as a value of the key property
    remember to prevent the default action of submitting HTML forms!

## 2.7: The Phonebook Step 2

Prevent the user from being able to add names that already exist in the phonebook. JavaScript arrays have numerous [suitable methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) for accomplishing this task. Keep in mind how [object equality](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness) works in Javascript.

Issue a warning with the [alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) command when such an action is attempted

Hint: when you are forming strings that contain values from variables, it is recommended to use a [template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals):
```js
`${newName} is already added to phonebook`
```
The same could be done in a more Java-like fashion by using the plus operator:
```js
newName + ' is already added to phonebook'
```
Using template strings is the more idiomatic option and the sign of a true JavaScript professional.


## 2.8: The Phonebook Step 3

Expand your application by allowing users to add phone numbers to the phone book. You will need to add a second input element to the form (along with its own event handler)

## 2.9*: The Phonebook Step 4

Implement a search field that can be used to filter the list of people by name

You can implement the search field as an input element that is placed outside the HTML form. The filtering logic shown in the image is case insensitive, meaning that the search term arto also returns results that contain Arto with an uppercase A.

NB: When you are working on new functionality, it's often useful to "hardcode" some dummy data into your application, e.g.
This saves you from having to manually input data into your application for testing out your new functionality.

## 2.10: The Phonebook Step 5

If you have implemented your application in a single component, refactor it by extracting suitable parts into new components. Maintain the application's state and all event handlers in the App root component.

It is sufficient to extract three components from the application. Good candidates for separate components are, for example, the search filter, the form for adding new people to the phonebook, a component that renders all people from the phonebook, and a component that renders a single person's details.

The application's root component could look similar to this after the refactoring. The refactored root component below only renders titles and lets the extracted components take care of the rest.

NB: You might run into problems in this exercise if you define your components "in the wrong place". Now would be a good time to rehearse the chapter do not define a component in another component from the last part.


# [Excercise 2.11] (https://fullstackopen.com/en/part2/getting_data_from_server#exercise-2-11)

## 2.11: The Phonebook Step 6

We continue with developing the phonebook. Store the initial state of the application in the file db.json, which should be placed in the root of the project.

Start json-server on port 3001 and make sure that the server returns the list of people by going to the address http://localhost:3001/persons in the browser.

Modify the application such that the initial state of the data is fetched from the server using the axios-library. Complete the fetching with an Effect hook.

```shell
npm install json-server --save-dev
npm install axios
```

add this to package.json
```json
{
  // ... 
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "server": "json-server -p 3001 db.json"  },
}
```

run frontend with
```shell
npm run dev
```

run backend with
```shell
npm run server
```

# [Exercises 2.12.-2.15](https://fullstackopen.com/en/part2/altering_data_in_server#exercises-2-12-2-15)

## 2.12: The Phonebook step 7

Currently, the numbers that are added to the phonebook are not saved to a backend server. Fix this situation.


## 2.13: The Phonebook step 8

Extract the code that handles the communication with the backend into its own module by following the example shown earlier in this part of the course material.

## 2.14: The Phonebook step 9
Make it possible for users to delete entries from the phonebook. The deletion can be done through a dedicated button for each person in the phonebook list. You can confirm the action from the user by using the [window.confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm) method.

The associated resource for a person in the backend can be deleted by making an HTTP DELETE request to the resource's URL. If we are deleting e.g. a person who has the id 2, we would have to make an HTTP DELETE request to the URL localhost:3001/persons/2. No data is sent with the request.

You can make an HTTP DELETE request with the axios library in the same way that we make all of the other requests.

NB: You can't use the name delete for a variable because it's a reserved word in JavaScript.

## 2.15*: The Phonebook step 10
Change the functionality so that if a number is added to an already existing user, the new number will replace the old number. It's recommended to use the HTTP PUT method for updating the phone number.

If the person's information is already in the phonebook, the application can ask the user to confirm the action


# [Exercises 2.16.-2.17](https://fullstackopen.com/en/part2/adding_styles_to_react_app#exercises-2-16-2-17)

## 2.16: Phonebook step 11
Use the [improved error message](https://fullstackopen.com/en/part2/adding_styles_to_react_app#improved-error-message) example from part 2 as a guide to show a notification that lasts for a few seconds after a successful operation is executed (a person is added or a number is changed)
