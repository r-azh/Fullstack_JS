import axios from 'axios';
import { Patient, PublicPatient, EntryWithoutId } from '../types';

const baseUrl = 'http://localhost:3000/api';

export const getAllPatients = () => {
  return axios
    .get<PublicPatient[]>(`${baseUrl}/patients`)
    .then(response => response.data);
};

export const getPatientById = (id: string) => {
  return axios
    .get<Patient>(`${baseUrl}/patients/${id}`)
    .then(response => response.data);
};

export const addEntry = (id: string, entry: EntryWithoutId) => {
  return axios
    .post<Patient>(`${baseUrl}/patients/${id}/entries`, entry)
    .then(response => response.data);
};
