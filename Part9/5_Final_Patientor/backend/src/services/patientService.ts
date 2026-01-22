import { Patient, PublicPatient, NewPatient, EntryWithoutId, Entry, Gender } from '../types';
import { v1 as uuid } from 'uuid';

let patients: Patient[] = [
  {
    id: 'd2773336-f723-11e9-8f0b-362b9e155667',
    name: 'John McClane',
    dateOfBirth: '1986-07-09',
    ssn: '090786-122X',
    gender: Gender.Male,
    occupation: 'New york city cop',
    entries: []
  },
  // ... more patients
];

const getPublicPatients = (): PublicPatient[] => {
  return patients.map(({ ssn, ...patient }) => patient);
};

const findById = (id: string): Patient | undefined => {
  const patient = patients.find(p => p.id === id);
  return patient;
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (id: string, entry: EntryWithoutId): Patient | undefined => {
  const patient = patients.find(p => p.id === id);
  
  if (!patient) {
    return undefined;
  }

  const newEntry: Entry = {
    ...entry,
    id: uuid()
  };

  patient.entries.push(newEntry);
  return patient;
};

export default {
  getPublicPatients,
  findById,
  addPatient,
  addEntry
};
