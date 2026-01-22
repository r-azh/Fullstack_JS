import axios from 'axios';
import { Diagnosis } from '../types';

const baseUrl = 'http://localhost:3000/api';

export const getAllDiagnoses = () => {
  return axios
    .get<Diagnosis[]>(`${baseUrl}/diagnoses`)
    .then(response => response.data);
};
