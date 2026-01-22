# Part 9 Exercises

This file will contain exercises for Part 9: TypeScript as they are covered in the course material.

## Introduction

Part 9 covers TypeScript, a typed superset of JavaScript. The exercises will be added as we progress through the sections.

# [Exercises 9.1-9.7.: First Steps with TypeScript](https://fullstackopen.com/en/part9/first_steps_with_type_script#exercises-9-1-9-3)

## Setup

Exercises 9.1-9.7 will all be made in the same node project. Create the project in an empty directory with `npm init` and install the ts-node and typescript packages. Also, create the file `tsconfig.json` in the directory with the following content:

```json
{
  "compilerOptions": {
    "noImplicitAny": true
  }
}
```

The compiler option `noImplicitAny` makes it mandatory to have types for all variables used. This option is currently a default, but it lets us define it explicitly.

## 9.1: Body mass index

Create the code of this exercise in the file `bmiCalculator.ts`.

Write a function `calculateBmi` that calculates a BMI based on a given height (in centimeters) and weight (in kilograms) and then returns a message that suits the results.

Call the function in the same file with hard-coded parameters and print out the result. The code

```typescript
console.log(calculateBmi(180, 74))
```

should print the following message:

```shell
Normal range
```

Create an npm script for running the program with the command `npm run calculateBmi`.

**Details:**
- Create `bmiCalculator.ts` file
- Implement `calculateBmi` function:
  - Parameters: height (cm), weight (kg)
  - Return type: string
  - Calculate BMI: weight / (height/100)²
  - Return appropriate message based on BMI:
    - Underweight: BMI < 18.5
    - Normal range: 18.5 <= BMI < 25
    - Overweight: 25 <= BMI < 30
    - Obese: BMI >= 30
- Call function with hard-coded values
- Add npm script: `"calculateBmi": "ts-node bmiCalculator.ts"`
- Test with different values

## 9.2: Exercise calculator

Create the code of this exercise in file `exerciseCalculator.ts`.

Write a function `calculateExercises` that calculates the average time of _daily exercise hours_, compares it to the _target amount_ of daily hours and returns an object that includes the following values:

* the number of days
* the number of training days
* the original target value
* the calculated average time
* boolean value describing if the target was reached
* a rating between the numbers 1-3 that tells how well the hours are met. You can decide on the metric on your own.
* a text value explaining the rating, you can come up with the explanations

The daily exercise hours are given to the function as an array that contains the number of exercise hours for each day in the training period. Eg. a week with 3 hours of training on Monday, none on Tuesday, 2 hours on Wednesday, 4.5 hours on Thursday and so on would be represented by the following array:

```typescript
[3, 0, 2, 4.5, 0, 3, 1]
```

For the Result object, you should create an interface.

If you call the function with parameters `[3, 0, 2, 4.5, 0, 3, 1]` and `2`, it should return:

```typescript
{ 
  periodLength: 7,
  trainingDays: 5,
  success: false,
  rating: 2,
  ratingDescription: 'not too bad but could be better',
  target: 2,
  average: 1.9285714285714286
}
```

Create an npm script, `npm run calculateExercises`, to call the function with hard-coded values.

**Details:**
- Create `exerciseCalculator.ts` file
- Create interface for result object:
  - `periodLength: number`
  - `trainingDays: number`
  - `success: boolean`
  - `rating: number` (1-3)
  - `ratingDescription: string`
  - `target: number`
  - `average: number`
- Implement `calculateExercises` function:
  - Parameters: dailyHours (number[]), target (number)
  - Return type: Result interface
  - Calculate periodLength (array length)
  - Calculate trainingDays (days with > 0 hours)
  - Calculate average (sum / length)
  - Determine success (average >= target)
  - Calculate rating (1-3 based on performance)
  - Generate ratingDescription
- Call function with example values
- Add npm script: `"calculateExercises": "ts-node exerciseCalculator.ts"`
- Test with different inputs

## 9.3: Command line

Change the previous exercises so that you can give the parameters of `bmiCalculator` and `exerciseCalculator` as command-line arguments.

Your program could work eg. as follows:

```shell
$ npm run calculateBmi 180 91

Overweight
```

and:

```shell
$ npm run calculateExercises 2 1 0 2 4.5 0 3 1 0 4

{
  periodLength: 9,
  trainingDays: 6,
  success: false,
  rating: 2,
  ratingDescription: 'not too bad but could be better',
  target: 2,
  average: 1.7222222222222223
}
```

In the example, the _first argument_ is the target value.

Handle exceptions and errors appropriately. The `exerciseCalculator` should accept inputs of varied lengths. Determine by yourself how you manage to collect all needed input.

**Details:**
- Add argument parsing functions:
  - `parseBmiArguments` for BMI calculator
  - `parseExerciseArguments` for exercise calculator
- Validate command-line arguments:
  - Check argument count
  - Check argument types (numbers)
  - Throw descriptive errors
- Use `require.main === module` to only parse args when run directly
- Handle errors with try-catch
- Update npm scripts if needed
- Test with valid and invalid arguments

**Important Notes:**
- Use ES module syntax (`import`/`export`)
- Files with `import`/`export` are treated as modules
- Variables in modules don't conflict with other files
- Use `require.main === module` to check if file is run directly

## 9.4: Express

Add Express to your dependencies and create an HTTP GET endpoint `hello` that answers 'Hello Full Stack!'

The web app should be started with the commands `npm start` in production mode and `npm run dev` in development mode. The latter should also use `ts-node-dev` to run the app.

Replace also your existing `tsconfig.json` file with the following content:

```json
{
  "compilerOptions": {
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "strictNullChecks": true,
    "strictPropertyInitialization": true,
    "strictBindCallApply": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "esModuleInterop": true,
    "declaration": true
  }
}
```

Make sure there aren't any errors!

**Details:**
- Install Express and types:
  ```bash
  npm install express
  npm install --save-dev @types/express
  ```
- Install ts-node-dev:
  ```bash
  npm install --save-dev ts-node-dev
  ```
- Create `index.ts` file
- Set up Express app
- Create GET `/hello` endpoint
- Return 'Hello Full Stack!'
- Update `tsconfig.json` with strict options
- Add scripts to `package.json`:
  - `"start": "ts-node index.ts"`
  - `"dev": "ts-node-dev index.ts"`
- Test endpoint works
- Verify no TypeScript errors

## 9.5: WebBMI

Add an endpoint for the BMI calculator that can be used by doing an HTTP GET request to the endpoint `bmi` and specifying the input with query string parameters. For example, to get the BMI of a person with a height of 180 and a weight of 72, the URL is `http://localhost:3003/bmi?height=180&weight=72`.

The response is a JSON of the form:

```typescript
{
  weight: 72,
  height: 180,
  bmi: "Normal range"
}
```

See the Express documentation for info on how to access the query parameters.

If the query parameters of the request are of the wrong type or missing, a response with proper status code and an error message is given:

```typescript
{
  error: "malformatted parameters"
}
```

Do not copy the calculator code to file `index.ts`; instead, make it a TypeScript module that can be imported into `index.ts`.

For `calculateBmi` to work correctly from both the command line and the endpoint, consider adding a check `require.main === module` to the file `bmiCalculator.ts`. It tests whether the module is main, i.e. it is run directly from the command line (in our case, `npm run calculateBmi`), or it is used by other modules that import functions from it (e.g. `index.ts`). Parsing command-line arguments makes sense only if the module is main. Without this condition, you might see argument validation errors when starting the application via `npm start` or `npm run dev`.

**Details:**
- Export `calculateBmi` from `bmiCalculator.ts`
- Add `require.main === module` check:
  - Only parse command-line args if run directly
  - Import/export statements make file a module
- Create GET `/bmi` endpoint in `index.ts`
- Access query parameters: `req.query.height`, `req.query.weight`
- Validate parameters:
  - Check if present
  - Check if numbers
  - Return 400 with error if invalid
- Call `calculateBmi` with validated parameters
- Return JSON response with weight, height, bmi
- Test with valid and invalid parameters

## 9.6: Eslint

Configure your project to use the above ESlint settings and fix all the warnings.

**Details:**
- Install ESLint and TypeScript ESLint:
  ```bash
  npm install --save-dev eslint @eslint/js @types/eslint__js typescript typescript-eslint
  npm install --save-dev @stylistic/eslint-plugin
  ```
- Create `eslint.config.mjs` with configuration:
  - Recommended ESLint rules
  - TypeScript ESLint rules
  - Stylistic plugin for semicolons
  - Rules to prevent `any` usage
  - Rules for unsafe assignments
- Add lint script to `package.json`:
  - `"lint": "eslint ."`
- Run `npm run lint` and fix all warnings
- Add semicolons where needed
- Fix any type issues
- Ensure code follows style guide

## 9.7: WebExercises

Add an endpoint to your app for the exercise calculator. It should be used by doing a HTTP POST request to the endpoint `http://localhost:3003/exercises` with the following input in the request body:

```typescript
{
  "daily_exercises": [1, 0, 2, 0, 3, 0, 2.5],
  "target": 2.5
}
```

The response is a JSON of the following form:

```typescript
{
  "periodLength": 7,
  "trainingDays": 4,
  "success": false,
  "rating": 1,
  "ratingDescription": "bad",
  "target": 2.5,
  "average": 1.2142857142857142
}
```

If the body of the request is not in the right form, a response with the proper status code and an error message are given. The error message is either

```typescript
{
  error: "parameters missing"
}
```

or

```typescript
{
  error: "malformatted parameters"
}
```

depending on the error. The latter happens if the input values do not have the right type, i.e. they are not numbers or convertible to numbers.

In this exercise, you might find it beneficial to use the _explicit any_ type when handling the data in the request body. Our ESlint configuration is preventing this but you may unset this rule for a particular line by inserting the following comment as the previous line:

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
```

You might also get in trouble with rules `no-unsafe-member-access` and `no-unsafe-assignment`. These rules may be ignored in this exercise.

Note that you need to have a correct setup to get the request body; see part 3.

**Details:**
- Export `calculateExercises` from `exerciseCalculator.ts`
- Add `require.main === module` check to `exerciseCalculator.ts`
- Create POST `/exercises` endpoint in `index.ts`
- Access request body: `req.body.daily_exercises`, `req.body.target`
- Validate request body:
  - Check if `daily_exercises` exists and is array
  - Check if `target` exists and is number
  - Check if all array elements are numbers
  - Return 400 with "parameters missing" if missing
  - Return 400 with "malformatted parameters" if wrong types
- Call `calculateExercises` with validated data
- Return JSON response with result
- Use ESLint disable comments where needed:
  - `// eslint-disable-next-line @typescript-eslint/no-explicit-any`
  - `// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment`
  - `// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access`
- Test with valid and invalid request bodies

# [Exercises 9.15-9.20.: React with Types](https://fullstackopen.com/en/part9/react_with_types#exercises-9-17-9-20)

## 9.15: React with TypeScript

Create a new Vite app with TypeScript.

This exercise is similar to the one you have already done in Part 1 of the course, but with TypeScript and some extra tweaks. Start off by modifying the contents of `main.tsx` to the following:

```tsx
import ReactDOM from 'react-dom/client'
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
```

and `App.tsx`:

```tsx
const App = () => {
  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14
    }
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <h1>{courseName}</h1>
      <p>
        {courseParts[0].name} {courseParts[0].exerciseCount}
      </p>
      <p>
        {courseParts[1].name} {courseParts[1].exerciseCount}
      </p>
      <p>
        {courseParts[2].name} {courseParts[2].exerciseCount}
      </p>
      <p>
        Number of exercises {totalExercises}
      </p>
    </div>
  );
};

export default App;
```

and remove the unnecessary files.

The whole app is now in one component. That is not what we want, so refactor the code so that it consists of three components: `Header`, `Content` and `Total`. All data is still kept in the `App` component, which passes all necessary data to each component as props. **Be sure to add type declarations for each component's props!**

The `Header` component should take care of rendering the name of the course. `Content` should render the names of the different parts and the number of exercises in each part, and `Total` should render the total sum of exercises in all parts.

**Details:**
- Create Vite TypeScript app:
  ```bash
  npm create vite@latest course-app -- --template react-ts
  ```
- Modify `main.tsx` as shown
- Modify `App.tsx` as shown
- Remove unnecessary files (App.css, etc.)
- Create `Header` component:
  - Props: `name: string`
  - Renders course name
- Create `Content` component:
  - Props: `parts: CoursePart[]`
  - Renders each part with name and exercise count
- Create `Total` component:
  - Props: `parts: CoursePart[]`
  - Calculates and renders total exercises
- Define `CoursePart` interface:
  ```tsx
  interface CoursePart {
    name: string;
    exerciseCount: number;
  }
  ```
- Type all component props
- Update `App.tsx` to use new components
- Ensure no TypeScript errors
- Test that app renders correctly

## 9.16: Deeper Type Usage

Let us now continue extending the app created in exercise 9.15. First, add the type information and replace the variable `courseParts` with the one from the example below.

```tsx
interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartBasic extends CoursePartBase {
  description: string;
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartBase {
  description: string;
  backgroundMaterial: string;
  kind: "background"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground;

const courseParts: CoursePart[] = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part",
    kind: "basic"
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3,
    kind: "group"
  },
  {
    name: "Basics of type Narrowing",
    exerciseCount: 7,
    description: "How to go from unknown to string",
    kind: "basic"
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
    kind: "background"
  },
  {
    name: "TypeScript in frontend",
    exerciseCount: 10,
    description: "a hard part",
    kind: "basic",
  },
];
```

Now we know that both interfaces `CoursePartBasic` and `CoursePartBackground` share not only the base attributes but also an attribute called `description`, which is a string in both interfaces.

Your first task is to declare a new interface that includes the `description` attribute and extends the `CoursePartBase` interface. Then modify the code so that you can remove the `description` attribute from both `CoursePartBasic` and `CoursePartBackground` without getting any errors.

Then create a component `Part` that renders all attributes of each type of course part. Use a switch case-based exhaustive type checking! Use the new component in component `Content`.

Lastly, add another course part interface with the following attributes: `name`, `exerciseCount`, `description` and `requirements`, the latter being a string array. The objects of this type look like the following:

```tsx
{
  name: "Backend development",
  exerciseCount: 21,
  description: "Typing the backend",
  requirements: ["nodejs", "jest"],
  kind: "special"
}
```

Then add that interface to the type union `CoursePart` and add the corresponding data to the `courseParts` variable. Now, if you have not modified your `Content` component correctly, you should get an error, because you have not yet added support for the fourth course part type. Do the necessary changes to `Content`, so that all attributes for the new course part also get rendered and that the compiler doesn't produce any errors.

**Details:**
- Create `CoursePartWithDescription` interface:
  ```tsx
  interface CoursePartWithDescription extends CoursePartBase {
    description: string;
  }
  ```
- Update `CoursePartBasic` and `CoursePartBackground`:
  - Extend `CoursePartWithDescription` instead of `CoursePartBase`
  - Remove `description` from individual interfaces
- Create `Part` component:
  - Props: `part: CoursePart`
  - Use switch case on `part.kind`
  - Render all attributes for each type
  - Use `assertNever` in default case:
    ```tsx
    const assertNever = (value: never): never => {
      throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
      );
    };
    ```
- Update `Content` component:
  - Use `Part` component for each part
- Create `CoursePartSpecial` interface:
  ```tsx
  interface CoursePartSpecial extends CoursePartWithDescription {
    requirements: string[];
    kind: "special";
  }
  ```
- Add to union type:
  ```tsx
  type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;
  ```
- Add special course part to `courseParts` array
- Update `Part` component to handle "special" case
- Verify TypeScript error appears if case missing
- Test exhaustive type checking works

## 9.17: Flight Diary Frontend, step1

Create a TypeScript React app with similar configurations as the apps of this section. Fetch the diaries from the backend and render those to screen. Do all the required typing and ensure that there are no Eslint errors.

Remember to keep the network tab open. It might give you a valuable hint...

You can decide how the diary entries are rendered. If you wish, you may take inspiration from the figure below. Note that the backend API does not return the diary comments, you may modify it to return also those on a GET request.

**Details:**
- Create Vite TypeScript React app:
  ```bash
  npm create vite@latest flight-diary-frontend -- --template react-ts
  ```
- Install axios:
  ```bash
  npm install axios
  ```
- Create types file:
  ```tsx
  // src/types.ts
  export interface DiaryEntry {
    id: number;
    date: string;
    weather: string;
    visibility: string;
    comment?: string;
  }
  ```
- Create service file:
  ```tsx
  // src/services/diaryService.ts
  import axios from 'axios';
  import { DiaryEntry } from '../types';

  const baseUrl = 'http://localhost:3000/api/diaries';

  export const getAllDiaries = () => {
    return axios
      .get<DiaryEntry[]>(baseUrl)
      .then(response => response.data);
  };
  ```
- Update backend to return comments (if needed)
- Create `App` component:
  - Use `useState<DiaryEntry[]>([])` for diaries
  - Use `useEffect` to fetch diaries
  - Render diary entries
- Style diary entries appropriately
- Check network tab for API calls
- Ensure no TypeScript errors
- Ensure no ESLint errors

## 9.18: Flight Diary Frontend, step2

Make it possible to add new diary entries from the frontend. In this exercise you may skip all validations and assume that the user just enters the data in a correct form.

**Details:**
- Create `NewDiaryEntry` type:
  ```tsx
  export type NewDiaryEntry = Omit<DiaryEntry, 'id'>;
  ```
- Add `createDiary` function to service:
  ```tsx
  export const createDiary = (object: NewDiaryEntry) => {
    return axios
      .post<DiaryEntry>(baseUrl, object)
      .then(response => response.data);
  };
  ```
- Create form in `App` component:
  - Input fields for: date, weather, visibility, comment
  - State for each field
  - Submit handler
- Handle form submission:
  - Call `createDiary` with form data
  - Add new diary to state
  - Clear form
- Test adding new entries
- Verify entries appear in list

## 9.19: Flight Diary Frontend, step3

Notify the user if the creation of a diary entry fails in the backend, show also the reason for the failure.

See eg. this to see how you can narrow the Axios error so that you can get hold of the error message.

**Details:**
- Add error state:
  ```tsx
  const [error, setError] = useState<string | null>(null);
  ```
- Handle errors in form submission:
  ```tsx
  createDiary(newEntry)
    .then(data => {
      setDiaries(diaries.concat(data));
      setError(null);
    })
    .catch(error => {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || 'An error occurred');
      } else {
        setError('An unexpected error occurred');
      }
    });
  ```
- Display error message:
  - Show error if present
  - Style error message (red, visible)
  - Clear error after some time or on new submission
- Test with invalid data:
  - Missing fields
  - Invalid weather/visibility values
  - Verify error message shows
- Test error message format matches backend response

## 9.20: Flight Diary Frontend, step4

Addition of a diary entry is now very error prone since user can type anything to the input fields. The situation must be improved.

Modify the input form so that the date is set with a HTML date input element, and the weather and visibility are set with HTML radio buttons. We have already used radio buttons in part 6, that material may or may not be useful...

Your app should all the time stay well typed and there should not be any Eslint errors and no Eslint rules should be ignored.

**Details:**
- Update types to use enums:
  ```tsx
  export enum Weather {
    Sunny = 'sunny',
    Rainy = 'rainy',
    Cloudy = 'cloudy',
    Stormy = 'stormy',
    Windy = 'windy',
  }

  export enum Visibility {
    Great = 'great',
    Good = 'good',
    Ok = 'ok',
    Poor = 'poor',
  }
  ```
- Update `DiaryEntry` interface to use enums
- Create date input:
  ```tsx
  <input
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
  />
  ```
- Create weather radio buttons:
  ```tsx
  {Object.values(Weather).map(weather => (
    <label key={weather}>
      <input
        type="radio"
        name="weather"
        value={weather}
        checked={selectedWeather === weather}
        onChange={() => setSelectedWeather(weather)}
      />
      {weather}
    </label>
  ))}
  ```
- Create visibility radio buttons (similar pattern)
- Update form state:
  - `date: string`
  - `weather: Weather`
  - `visibility: Visibility`
  - `comment: string`
- Type all event handlers:
  ```tsx
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };
  ```
- Ensure all types are correct
- Test form submission
- Verify no ESLint errors
- Verify no TypeScript errors

# [Exercises 9.8-9.14.: Typing an Express App](https://fullstackopen.com/en/part9/typing_an_express_app#exercises-9-8-9-9)

## Before you start the exercises

For this set of exercises, you will be developing a backend for an existing project called **Patientor**, which is a simple medical record application for doctors who handle diagnoses and basic health information of their patients.

The frontend has already been built by outsider experts and your task is to create a backend to support the existing code.

## WARNING

Quite often VS code loses track of what is really happening in the code and it shows type or style related warnings despite the code having been fixed. If this happens (to me it has happened quite often), close and open the file that is giving you trouble or just restart the editor. It is also good to doublecheck that everything really works by running the compiler and the ESlint from the command line with commands:

```bash
npm run tsc
npm run lint
```

When run in command line you get the "real result" for sure. So, never trust the editor too much!

## 9.8: Patientor backend, step1

Initialize a new backend project that will work with the frontend. Configure ESlint and tsconfig with the same configurations as proposed in the material. Define an endpoint that answers HTTP GET requests for route `/api/ping`.

The project should be runnable with npm scripts, both in development mode and, as compiled code, in production mode.

**Details:**
- Create new project directory
- Run `npm init`
- Install dependencies:
  - `express`
  - `typescript` (dev)
  - `@types/express` (dev)
  - `@types/node` (dev)
  - ESLint packages (dev)
  - `ts-node-dev` (dev)
- Initialize tsconfig.json:
  ```bash
  npm run tsc -- --init
  ```
- Configure tsconfig.json:
  ```json
  {
    "compilerOptions": {
      "target": "ES6",
      "outDir": "./build/",
      "module": "commonjs",
      "strict": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noImplicitReturns": true,
      "noFallthroughCasesInSwitch": true,
      "esModuleInterop": true,
      "resolveJsonModule": true
    }
  }
  ```
- Create eslint.config.mjs with TypeScript ESLint configuration
- Create `src/index.ts` with Express app
- Create GET `/api/ping` endpoint
- Add scripts to package.json:
  - `"tsc": "tsc"`
  - `"dev": "ts-node-dev src/index.ts"`
  - `"lint": "eslint ."`
  - `"start": "node build/index.js"`
- Test development mode: `npm run dev`
- Test production build: `npm run tsc && npm start`
- Verify `/api/ping` endpoint works

## 9.9: Patientor backend, step2

Fork and clone the project patientor. Start the project with the help of the README file.

You should be able to use the frontend without a functioning backend.

Ensure that the backend answers the ping request that the _frontend_ has made on startup. Check the developer tools to make sure it works.

You might also want to have a look at the _console_ tab. If something fails, part 3 of the course shows how the problem can be solved.

**Details:**
- Fork and clone patientor repository
- Follow README instructions to start frontend
- Ensure backend `/api/ping` endpoint responds correctly
- Check browser developer tools:
  - Network tab for ping request
  - Console tab for errors
- Fix any CORS issues if needed
- Verify frontend can communicate with backend

## 9.10: Patientor backend, step3

Create a type `Diagnosis` and use it to create endpoint `/api/diagnoses` for fetching all diagnoses with HTTP GET.

Structure your code properly by using meaningfully-named directories and files.

**Note** that `diagnoses` may or may not contain the field `latin`. You might want to use optional properties in the type definition.

**Details:**
- Get `diagnoses.ts` file from course material
- Store in `data/` directory
- Create `Diagnosis` type/interface:
  - Required fields: `code`, `name`
  - Optional field: `latin?`
- Create `src/types.ts` for type definitions
- Create `src/services/diagnosisService.ts`:
  - `getAll()` function to return diagnoses
- Create `src/routes/diagnoses.ts`:
  - GET endpoint to return all diagnoses
- Add route to `src/index.ts`:
  - `app.use('/api/diagnoses', diagnosisRouter)`
- Test endpoint returns all diagnoses
- Verify optional `latin` field works correctly

## 9.11: Patientor backend, step4

Create data type `Patient` and set up the GET endpoint `/api/patients` which returns all the patients to the frontend, excluding field `ssn`. Use a utility type to make sure you are selecting and returning only the wanted fields.

In this exercise, you may assume that field `gender` has type `string`.

Try the endpoint with your browser and ensure that `ssn` is not included in the response.

After creating the endpoint, ensure that the _frontend_ shows the list of patients.

**Details:**
- Get `patients.ts` file from course material
- Store in `data/` directory
- Create `Patient` interface:
  - `id`, `name`, `dateOfBirth`, `gender`, `occupation`
  - `ssn` field (will be excluded)
- Create `PublicPatient` type using `Omit`:
  ```typescript
  export type PublicPatient = Omit<Patient, 'ssn'>;
  ```
- Create `src/services/patientService.ts`:
  - `getAll()` function returning `PublicPatient[]`
  - Map patients to exclude `ssn` field
- Create `src/routes/patients.ts`:
  - GET endpoint returning public patients
- Add route to `src/index.ts`:
  - `app.use('/api/patients', patientRouter)`
- Test endpoint in browser
- Verify `ssn` is not in response
- Verify frontend displays patient list

## 9.12: Patientor backend, step5

Create a POST endpoint `/api/patients` for adding patients. Ensure that you can add patients also from the frontend. You can create unique ids of type `string` using the uuid library:

```typescript
import { v1 as uuid } from 'uuid'
const id = uuid()
```

**Details:**
- Install uuid:
  ```bash
  npm install uuid
  npm install --save-dev @types/uuid
  ```
- Create `NewPatient` type:
  ```typescript
  export type NewPatient = Omit<Patient, 'id'>;
  ```
- Update `patientService.ts`:
  - Add `addPatient(entry: NewPatient): Patient` function
  - Generate id using `uuid()`
  - Add patient to array
  - Return created patient
- Update `src/routes/patients.ts`:
  - Add POST endpoint
  - Accept request body
  - Call `addPatient` service
  - Return created patient
- Test with frontend:
  - Add patient from frontend
  - Verify patient appears in list
  - Verify id is generated correctly

## 9.13: Patientor backend, step6

Set up safe parsing, validation and type predicate to the POST `/api/patients` request.

Refactor the `gender` field to use an enum type.

**Details:**
- Create `Gender` enum:
  ```typescript
  export enum Gender {
    Male = 'male',
    Female = 'female',
    Other = 'other'
  }
  ```
- Update `Patient` interface:
  - Change `gender: string` to `gender: Gender`
- Create validation functions in `src/utils.ts`:
  - `isString`, `isDate`, `isGender` type guards
  - `parseString`, `parseDate`, `parseGender` parsers
- Create `toNewPatient` function:
  - Validate all required fields
  - Return `NewPatient` type
- Update POST endpoint:
  - Use `toNewPatient` to validate request body
  - Handle validation errors
  - Return appropriate error messages
- Test with valid and invalid data
- Verify enum validation works

## 9.14: Patientor backend, step7

Use Zod to validate the requests to the POST endpoint `/api/patients`.

**Details:**
- Install Zod:
  ```bash
  npm install zod
  ```
- Create Zod schema for new patient:
  ```typescript
  const NewPatientSchema = z.object({
    name: z.string(),
    dateOfBirth: z.string().date(),
    gender: z.nativeEnum(Gender),
    occupation: z.string()
  });
  ```
- Update `toNewPatient` to use Zod:
  ```typescript
  export const toNewPatient = (object: unknown): NewPatient => {
    return NewPatientSchema.parse(object);
  };
  ```
- Update POST endpoint error handling:
  - Check for `z.ZodError` instances
  - Return validation errors in response
- Optionally create validation middleware:
  - Middleware to validate request body
  - Type request body after validation
- Test with valid and invalid data
- Verify error messages are helpful
- Compare Zod approach with manual validation

# [Exercises 9.21-9.30.: Grande Finale: Patientor](https://fullstackopen.com/en/part9/grande_finale_patientor#exercises-9-21-9-22)

## 9.21: Patientor, step1

Create an endpoint `/api/patients/:id` to the backend that returns all of the patient information for one patient, including the array of patient entries that is still empty for all the patients. For the time being, expand the backend types as follows:

```typescript
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Entry {
}

export interface Patient {
  id: string;
  name: string;
  ssn: string;
  occupation: string;
  gender: Gender;
  dateOfBirth: string;
  entries: Entry[]
}

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;
```

The response should look as follows when accessing a patient.

**Details:**
- Update `Patient` interface:
  - Add `entries: Entry[]` field
  - Keep empty `Entry` interface for now
- Update `NonSensitivePatient` type:
  - Exclude both `ssn` and `entries`
- Create GET `/api/patients/:id` endpoint:
  - Get patient ID from route params
  - Find patient by ID
  - Return full patient (including entries)
  - Return 404 if not found
- Update patient service:
  - Add `findById(id: string): Patient | undefined` function
- Test endpoint:
  - Access `/api/patients/:id` in browser
  - Verify patient data returned
  - Verify `entries` is empty array

## 9.22: Patientor, step2

Create a page for showing a patient's full information in the frontend.

The user should be able to access a patient's information by clicking the patient's name.

Fetch the data from the endpoint created in the previous exercise.

You may use MaterialUI for the new components but that is up to you since our main focus now is TypeScript.

You might want to have a look at part 7 if you don't yet have a grasp on how the React Router works.

**Details:**
- Create `PatientPage` component:
  - Use `useParams` to get patient ID
  - Use `useState<Patient | null>(null)` for patient state
  - Use `useEffect` to fetch patient data
  - Display patient information
- Create patient service function:
  ```typescript
  export const getPatientById = (id: string) => {
    return axios
      .get<Patient>(`${baseUrl}/patients/${id}`)
      .then(response => response.data);
  };
  ```
- Add route in `App.tsx`:
  ```typescript
  <Route path="/patients/:id" element={<PatientPage />} />
  ```
- Update `PatientListPage`:
  - Make patient names clickable links
  - Use `Link` from react-router-dom
  - Link to `/patients/:id`
- Display patient information:
  - Name, SSN, occupation, gender, date of birth
  - Entries (empty for now)
- Test navigation:
  - Click patient name
  - Verify patient page loads
  - Verify patient data displayed

## 9.23: Patientor, step 3

Define the types `OccupationalHealthcareEntry` and `HospitalEntry` so that those conform with the new example data. Ensure that your backend returns the entries properly when you go to an individual patient's route.

Use types properly in the backend! For now, there is no need to do a proper validation for all the fields of the entries in the backend, it is enough e.g. to check that the field `type` has a correct value.

**Details:**
- Create `BaseEntry` interface:
  ```typescript
  interface BaseEntry {
    id: string;
    description: string;
    date: string;
    specialist: string;
    diagnosisCodes?: Array<Diagnosis['code']>;
  }
  ```
- Create `HealthCheckEntry`:
  ```typescript
  export enum HealthCheckRating {
    "Healthy" = 0,
    "LowRisk" = 1,
    "HighRisk" = 2,
    "CriticalRisk" = 3
  }

  interface HealthCheckEntry extends BaseEntry {
    type: "HealthCheck";
    healthCheckRating: HealthCheckRating;
  }
  ```
- Create `OccupationalHealthcareEntry`:
  ```typescript
  interface OccupationalHealthcareEntry extends BaseEntry {
    type: "OccupationalHealthcare";
    employerName: string;
    sickLeave?: {
      startDate: string;
      endDate: string;
    };
  }
  ```
- Create `HospitalEntry`:
  ```typescript
  interface HospitalEntry extends BaseEntry {
    type: "Hospital";
    discharge: {
      date: string;
      criteria: string;
    };
  }
  ```
- Create union type:
  ```typescript
  export type Entry =
    | HospitalEntry
    | OccupationalHealthcareEntry
    | HealthCheckEntry;
  ```
- Update patient data with entries
- Add basic validation for `type` field
- Test endpoint returns entries correctly

## 9.24: Patientor, step 4

Extend a patient's page in the frontend to list the `date`, `description` and `diagnoseCodes` of the patient's entries.

You can use the same type definition for an `Entry` in the frontend. For these exercises, it is enough to just copy/paste the definitions from the backend to the frontend.

**Details:**
- Copy entry types to frontend `types.ts`
- Create `Entries` component:
  - Props: `entries: Entry[]`
  - Map over entries
  - Display date, description, diagnosisCodes
- Update `PatientPage`:
  - Pass entries to `Entries` component
- Style entries list appropriately
- Test entries display correctly

## 9.25: Patientor, step 5

Fetch and add diagnoses to the application state from the `/api/diagnoses` endpoint. Use the new diagnosis data to show the descriptions for patient's diagnosis codes.

**Details:**
- Create diagnosis service:
  ```typescript
  export const getAllDiagnoses = () => {
    return axios
      .get<Diagnosis[]>(`${baseUrl}/diagnoses`)
      .then(response => response.data);
  };
  ```
- Fetch diagnoses in `PatientPage`:
  - Use `useState<Diagnosis[]>([])` for diagnoses
  - Use `useEffect` to fetch diagnoses
- Update `Entries` component:
  - Accept `diagnoses: Diagnosis[]` as prop
  - Create function to get diagnosis name by code
  - Display diagnosis name next to code
- Pass diagnoses to `Entries` component
- Test diagnosis names display correctly

## 9.26: Patientor, step 6

Extend the entry listing on the patient's page to include the Entry's details, with a new component that shows the rest of the information of the patient's entries, distinguishing different types from each other.

You could use eg. Icons or some other Material UI component to get appropriate visuals for your listing.

You should use a `switch case`-based rendering and `exhaustive type checking` so that no cases can be forgotten.

**Details:**
- Create `EntryDetails` component:
  - Props: `entry: Entry`
  - Use switch case on `entry.type`
  - Render type-specific details:
    - HealthCheck: healthCheckRating
    - OccupationalHealthcare: employerName, sickLeave
    - Hospital: discharge
  - Use `assertNever` in default case:
    ```typescript
    const assertNever = (value: never): never => {
      throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
      );
    };
    ```
- Update `Entries` component:
  - Use `EntryDetails` for each entry
- Add Material UI icons if desired
- Test all entry types render correctly
- Verify TypeScript error if case missing

## 9.27: Patientor, step 7

We have established that patients can have different kinds of entries. We don't yet have any way of adding entries to patients in our app, so, at the moment, it is pretty useless as an electronic medical record.

Your next task is to add endpoint `/api/patients/:id/entries` to your backend, through which you can POST an entry for a patient.

Remember that we have different kinds of entries in our app, so our backend should support all those types and check that at least all required fields are given for each type.

You may assume that the diagnostic codes are sent in the correct form and use eg. the following kind of parser to extract those from the request body:

```typescript
const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> =>  {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};
```

**Details:**
- Create `UnionOmit` utility type:
  ```typescript
  type UnionOmit<T, K extends string | number | symbol> = T extends unknown
    ? Omit<T, K>
    : never;

  export type EntryWithoutId = UnionOmit<Entry, 'id'>;
  ```
- Create `toNewEntry` validation function:
  - Validate based on `type` field
  - Use Zod schemas for each entry type
  - Return `EntryWithoutId`
- Create POST `/api/patients/:id/entries` endpoint:
  - Get patient ID from params
  - Validate entry with `toNewEntry`
  - Add entry to patient
  - Return updated patient
  - Handle errors appropriately
- Update patient service:
  - Add `addEntry(id: string, entry: EntryWithoutId): Patient | undefined`
  - Find patient by ID
  - Generate entry ID
  - Add entry to patient's entries array
  - Return updated patient
- Test endpoint:
  - POST entry to `/api/patients/:id/entries`
  - Verify entry added to patient
  - Test with different entry types
  - Test validation errors

## 9.28: Patientor, step 8

Now that our backend supports adding entries, we want to add the corresponding functionality to the frontend. In this exercise, you should add a form for adding an entry to a patient. An intuitive place for accessing the form would be on a patient's page.

In this exercise, it is enough to **support one entry type**. All the fields in the form can be just plain text inputs, so it is up to the user to enter valid values.

Upon a successful submission the new entry should be added to the correct patient and the patient's entries on the patient page should be updated to contain the new entry.

If a user enters invalid values to the form and backend rejects the addition, show a proper error message to the user.

**Details:**
- Create `AddEntryForm` component:
  - Props: `onSubmit`, `onCancel`
  - Form state for entry fields
  - Handle form submission
  - Call `onSubmit` with entry data
- Create entry service function:
  ```typescript
  export const addEntry = (id: string, entry: EntryWithoutId) => {
    return axios
      .post<Patient>(`${baseUrl}/patients/${id}/entries`, entry)
      .then(response => response.data);
  };
  ```
- Update `PatientPage`:
  - Add state for modal/form visibility
  - Handle entry submission
  - Update patient state after successful submission
  - Handle errors and display error messages
- Add button to open entry form
- Test entry creation:
  - Submit valid entry
  - Verify entry appears in list
  - Test error handling

## 9.29: Patientor, step 9

Extend your solution so that it supports _all the entry types_.

**Details:**
- Add entry type selector:
  - Dropdown or radio buttons
  - Options: HealthCheck, OccupationalHealthcare, Hospital
- Conditionally render fields based on type:
  - HealthCheck: healthCheckRating
  - OccupationalHealthcare: employerName, sickLeave (optional)
  - Hospital: discharge date and criteria
- Update form state:
  - Handle all entry type fields
  - Validate required fields per type
- Update form submission:
  - Create appropriate entry object based on type
  - Use switch case or if statements
  - Ensure all required fields present
- Test all entry types:
  - Create HealthCheck entry
  - Create OccupationalHealthcare entry
  - Create Hospital entry
  - Verify all work correctly

## 9.30: Patientor, step 10

Improve the entry creation forms so that it makes it hard to enter incorrect dates, diagnosis codes and health rating.

Diagnosis codes are now set with Material UI multiple select and dates with Input elements with type date.

**Details:**
- Fetch diagnoses for select:
  - Get diagnoses in form component
  - Use for diagnosis code selection
- Use date inputs:
  ```typescript
  <input
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
  />
  ```
- Use Material UI Select for diagnosis codes:
  ```typescript
  <Select
    multiple
    value={selectedCodes}
    onChange={(e) => setSelectedCodes(e.target.value as string[])}
  >
    {diagnoses.map(d => (
      <MenuItem key={d.code} value={d.code}>
        {d.code} - {d.name}
      </MenuItem>
    ))}
  </Select>
  ```
- Use Select for health check rating:
  - Options: Healthy (0), LowRisk (1), HighRisk (2), CriticalRisk (3)
- Improve form validation:
  - Ensure dates are valid
  - Ensure required fields filled
  - Better error messages
- Test improved form:
  - Verify date picker works
  - Verify diagnosis code selection works
  - Verify health rating selection works
  - Test form validation
