
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


