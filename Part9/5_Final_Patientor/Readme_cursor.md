# Grande Finale: Patientor - Summary

This section covers building a complete TypeScript application (Patientor) combining backend and frontend, working with existing codebases, and advanced TypeScript patterns.

## Working with Existing Codebase

### Getting Started

**1. Read the README.md**
- Brief description of application
- Requirements for using it
- How to start for development

**2. Check package.json**
- Dependencies and scripts
- Project structure hints
- Development commands

**3. Browse Folder Structure**
- Understand application functionality
- Identify architecture patterns
- Find feature organization

**4. Look for Types**
- Search for `types.ts` or similar
- Use VSCode to hover over variables
- Understand data structures

**5. Read Tests**
- Unit, integration, or E2E tests
- Understand expected behavior
- Guide for refactoring

**6. Start the Application**
- Verify development environment
- Click around to understand features
- Check console for errors

### Understanding Code

**Key Points:**
- Reading code is a skill
- Don't worry if not understood immediately
- Code has growth rings (history)
- More reading = better understanding
- You'll read more code than you write

## Patientor Frontend Structure

### Folder Organization

```
src/
├── components/
│   ├── AddPatientModal/
│   │   ├── index.tsx
│   │   └── AddPatientForm.tsx
│   ├── PatientListPage/
│   └── HealthRatingBar.tsx
├── services/
├── types.ts
└── App.tsx
```

**Pattern:**
- Components in directories if they have subcomponents
- Subcomponents in same directory
- Services for API calls
- Types in separate file

### Key Technologies

- **React Router**: Navigation
- **Material UI**: Styling
- **Axios**: API communication
- **TypeScript**: Type safety

## Typing Function Props

### setState Function

**Problem:**
```tsx
const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  
  return (
    <PatientListPage
      patients={patients}
      setPatients={setPatients} // What type is this?
    />
  );
};
```

**Solution:**
```tsx
interface Props {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
}

const PatientListPage = ({ patients, setPatients }: Props) => {
  // ...
};
```

**Type Breakdown:**
- `React.Dispatch<React.SetStateAction<Patient[]>>`
- `Dispatch`: Function that dispatches actions
- `SetStateAction<T>`: Can be value or function `(prev: T) => T`
- Hover in editor to see exact type

### Simple Function Props

**Void Function:**
```tsx
interface Props {
  onClose: () => void;
}

const closeModal = (): void => {
  setModalOpen(false);
  setError(undefined);
};
```

**Type:** `() => void`
- No parameters
- Returns nothing

### Async Function Props

**Async Function:**
```tsx
interface Props {
  onSubmit: (values: PatientFormValues) => Promise<void>;
}

const submitNewPatient = async (values: PatientFormValues) => {
  // ...
};
```

**Type:** `(values: PatientFormValues) => Promise<void>`
- One parameter: `PatientFormValues`
- Returns: `Promise<void>` (async function)
- Promise because function is `async`

**Key Points:**
- Async functions always return Promise
- `Promise<void>` if nothing returned
- `Promise<Type>` if value returned

## Entry Types

### Problem: Different Entry Types

Entries have different structures:

**Hospital Entry:**
```tsx
{
  id: 'd811e46d-70b3-4d90-b090-4535c7cf8fb1',
  date: '2015-01-02',
  type: 'Hospital',
  specialist: 'MD House',
  diagnosisCodes: ['S62.5'],
  description: 'Healing time appr. 2 weeks...',
  discharge: {
    date: '2015-01-16',
    criteria: 'Thumb has healed.',
  }
}
```

**OccupationalHealthcare Entry:**
```tsx
{
  id: 'fcd59fa6-c4b4-4fec-ac4d-df4fe1f85f62',
  date: '2019-08-05',
  type: 'OccupationalHealthcare',
  specialist: 'MD House',
  employerName: 'HyPD',
  diagnosisCodes: ['Z57.1', 'Z74.3', 'M51.2'],
  description: 'Patient mistakenly found...',
  sickLeave: {
    startDate: '2019-08-05',
    endDate: '2019-08-28'
  }
}
```

**HealthCheck Entry:**
```tsx
{
  id: 'b4f1cca0-2a7c-4ac3-90f9-105360e90747',
  date: '2019-10-20',
  type: 'HealthCheck',
  specialist: 'MD House',
  description: 'Yearly control visit.',
  healthCheckRating: 0
}
```

**Three Types:**
- `OccupationalHealthcare`
- `Hospital`
- `HealthCheck`

### Solution: BaseEntry Interface

**Common Fields:**
- `id`: string
- `description`: string
- `date`: string
- `specialist`: string
- `diagnosisCodes?`: optional array

**BaseEntry Definition:**
```tsx
interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}
```

**Key Points:**
- `Diagnosis['code']` - indexed access type
- `Array<Type>` - alternative to `Type[]`
- Optional `diagnosisCodes` with `?`

### Extended Entry Types

**HealthCheckEntry:**
```tsx
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

**OccupationalHealthcareEntry:**
```tsx
interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}
```

**HospitalEntry:**
```tsx
interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: {
    date: string;
    criteria: string;
  };
}
```

**Union Type:**
```tsx
export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;
```

## Omit with Unions

### The Problem

**Normal Omit:**
```tsx
type EntryWithoutId = Omit<Entry, 'id'>;
```

**Problem:**
- Only keeps common properties
- Loses type-specific properties
- Not what we want!

### Solution: UnionOmit

**Custom Utility Type:**
```tsx
type UnionOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;

type EntryWithoutId = UnionOmit<Entry, 'id'>;
```

**How It Works:**
- `T extends unknown` - distributes over union
- `Omit<T, K>` - applied to each union member
- Result: Union of omitted types

**Example:**
```tsx
// Before
type Entry = HospitalEntry | HealthCheckEntry;

// After UnionOmit<Entry, 'id'>
type EntryWithoutId = 
  | Omit<HospitalEntry, 'id'>
  | Omit<HealthCheckEntry, 'id'>;
```

**Benefits:**
- Preserves all type-specific properties
- Works correctly with discriminated unions
- Type-safe entry creation

## Patient Type Updates

### Adding Entries

**Updated Patient Interface:**
```tsx
export interface Patient {
  id: string;
  name: string;
  ssn: string;
  occupation: string;
  gender: Gender;
  dateOfBirth: string;
  entries: Entry[]; // New field
}

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;
```

**Key Points:**
- `entries` array added
- `NonSensitivePatient` excludes both `ssn` and `entries`
- Backend returns entries with patient

## Backend Implementation

### Get Single Patient Endpoint

**Route:**
```tsx
// src/routes/patients.ts
router.get('/:id', (req, res) => {
  const patient = patientService.findById(req.params.id);
  
  if (patient) {
    res.json(patient);
  } else {
    res.sendStatus(404);
  }
});
```

**Service:**
```tsx
// src/services/patientService.ts
const findById = (id: string): Patient | undefined => {
  const patient = patients.find(p => p.id === id);
  return patient;
};
```

### Add Entry Endpoint

**Route:**
```tsx
// src/routes/patients.ts
router.post('/:id/entries', (req, res) => {
  try {
    const newEntry = toNewEntry(req.body);
    const patient = patientService.addEntry(req.params.id, newEntry);
    res.json(patient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      res.status(400).json({ error: 'Unknown error' });
    }
  }
});
```

**Validation:**
```tsx
// src/utils.ts
const toNewEntry = (object: unknown): EntryWithoutId => {
  // Validate based on type field
  // Return appropriate entry type
};
```

## Frontend Implementation

### Patient Page Component

**Fetching Patient:**
```tsx
// src/components/PatientPage.tsx
const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (id) {
      patientService.getById(id).then(data => {
        setPatient(data);
      });
    }
  }, [id]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{patient.name}</h2>
      <p>SSN: {patient.ssn}</p>
      <p>Occupation: {patient.occupation}</p>
      <Entries entries={patient.entries} />
    </div>
  );
};
```

### Entry Listing Component

**Basic Listing:**
```tsx
// src/components/Entries.tsx
interface Props {
  entries: Entry[];
}

const Entries = ({ entries }: Props) => {
  return (
    <div>
      <h3>Entries</h3>
      {entries.map(entry => (
        <div key={entry.id}>
          <p>{entry.date} - {entry.description}</p>
          {entry.diagnosisCodes && (
            <p>Diagnosis: {entry.diagnosisCodes.join(', ')}</p>
          )}
        </div>
      ))}
    </div>
  );
};
```

### Entry Details Component

**Type-Specific Rendering:**
```tsx
// src/components/EntryDetails.tsx
interface Props {
  entry: Entry;
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails = ({ entry }: Props) => {
  switch (entry.type) {
    case "HealthCheck":
      return (
        <div>
          <p>Health Check Rating: {entry.healthCheckRating}</p>
        </div>
      );
    case "OccupationalHealthcare":
      return (
        <div>
          <p>Employer: {entry.employerName}</p>
          {entry.sickLeave && (
            <p>
              Sick Leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
            </p>
          )}
        </div>
      );
    case "Hospital":
      return (
        <div>
          <p>
            Discharge: {entry.discharge.date} - {entry.discharge.criteria}
          </p>
        </div>
      );
    default:
      return assertNever(entry);
  }
};
```

### Diagnosis Integration

**Fetching Diagnoses:**
```tsx
// src/services/diagnosisService.ts
export const getAllDiagnoses = () => {
  return axios
    .get<Diagnosis[]>(`${baseUrl}/diagnoses`)
    .then(response => response.data);
};
```

**Using in Component:**
```tsx
// src/components/EntryDetails.tsx
const EntryDetails = ({ entry, diagnoses }: Props) => {
  const getDiagnosisName = (code: string): string => {
    const diagnosis = diagnoses.find(d => d.code === code);
    return diagnosis ? diagnosis.name : code;
  };

  return (
    <div>
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map(code => (
            <li key={code}>
              {code} - {getDiagnosisName(code)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### Add Entry Form

**Form Component:**
```tsx
// src/components/AddEntryForm.tsx
interface Props {
  onSubmit: (values: EntryWithoutId) => Promise<void>;
  onCancel: () => void;
}

const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [type, setType] = useState<Entry['type']>('HealthCheck');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  // ... more state

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const baseEntry = {
      description,
      date,
      specialist,
      diagnosisCodes: selectedCodes,
    };

    let entry: EntryWithoutId;
    
    switch (type) {
      case 'HealthCheck':
        entry = {
          ...baseEntry,
          type: 'HealthCheck',
          healthCheckRating: Number(healthCheckRating),
        };
        break;
      case 'OccupationalHealthcare':
        entry = {
          ...baseEntry,
          type: 'OccupationalHealthcare',
          employerName,
          sickLeave: sickLeaveStart && sickLeaveEnd ? {
            startDate: sickLeaveStart,
            endDate: sickLeaveEnd,
          } : undefined,
        };
        break;
      case 'Hospital':
        entry = {
          ...baseEntry,
          type: 'Hospital',
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
        };
        break;
      default:
        return assertNever(type);
    }

    onSubmit(entry).catch(error => {
      console.error(error);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

## Best Practices

### 1. Use Discriminated Unions

```tsx
// ✅ Good: Discriminated union
type Entry = HospitalEntry | HealthCheckEntry | OccupationalHealthcareEntry;

// ❌ Bad: Single type with optional fields
interface Entry {
  type: string;
  discharge?: {...};
  employerName?: string;
  healthCheckRating?: number;
}
```

### 2. Use Exhaustive Type Checking

```tsx
// ✅ Good: assertNever in default
switch (entry.type) {
  case "Hospital":
    // ...
    break;
  case "HealthCheck":
    // ...
    break;
  default:
    return assertNever(entry);
}

// ❌ Bad: No default case
switch (entry.type) {
  case "Hospital":
    // ...
    break;
}
```

### 3. Type Function Props Correctly

```tsx
// ✅ Good: Specific types
interface Props {
  onSubmit: (values: EntryWithoutId) => Promise<void>;
  onClose: () => void;
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
}

// ❌ Bad: Any or Function
interface Props {
  onSubmit: any;
  onClose: Function;
}
```

### 4. Use UnionOmit for Unions

```tsx
// ✅ Good: UnionOmit
type EntryWithoutId = UnionOmit<Entry, 'id'>;

// ❌ Bad: Regular Omit (loses type-specific properties)
type EntryWithoutId = Omit<Entry, 'id'>;
```

### 5. Indexed Access Types

```tsx
// ✅ Good: Indexed access
diagnosisCodes?: Array<Diagnosis['code']>;

// ⚠️ OK: Direct type
diagnosisCodes?: string[];
```

### 6. Enum for Fixed Values

```tsx
// ✅ Good: Enum
export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

// ⚠️ OK: Union type
type HealthCheckRating = 0 | 1 | 2 | 3;
```

## Common Patterns

### Patient with Entries

```tsx
interface Patient {
  id: string;
  name: string;
  ssn: string;
  occupation: string;
  gender: Gender;
  dateOfBirth: string;
  entries: Entry[];
}
```

### Entry Creation

```tsx
type EntryWithoutId = UnionOmit<Entry, 'id'>;

const createEntry = (entry: EntryWithoutId): Entry => {
  return {
    ...entry,
    id: uuid(),
  };
};
```

### Type-Specific Rendering

```tsx
const renderEntry = (entry: Entry) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheckDetails entry={entry} />;
    case "Hospital":
      return <HospitalDetails entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalDetails entry={entry} />;
    default:
      return assertNever(entry);
  }
};
```

### Form Handling with Types

```tsx
const [entryType, setEntryType] = useState<Entry['type']>('HealthCheck');

const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  setEntryType(event.target.value as Entry['type']);
};
```

## Exercises

The exercises (9.21-9.30) involve:
- Creating patient detail endpoint
- Building patient page in frontend
- Defining entry types
- Rendering entries with type-specific details
- Integrating diagnoses
- Adding entry creation endpoint
- Building entry creation form
- Supporting all entry types
- Improving form with proper inputs
