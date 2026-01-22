import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Patient, Diagnosis } from '../types';
import { getPatientById } from '../services/patientService';
import { getAllDiagnoses } from '../services/diagnosisService';
import Entries from './Entries';

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    if (id) {
      getPatientById(id).then(data => {
        setPatient(data);
      });
    }
  }, [id]);

  useEffect(() => {
    getAllDiagnoses().then(data => {
      setDiagnoses(data);
    });
  }, []);

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{patient.name}</h2>
      <p>SSN: {patient.ssn}</p>
      <p>Occupation: {patient.occupation}</p>
      <p>Gender: {patient.gender}</p>
      <p>Date of Birth: {patient.dateOfBirth}</p>
      <h3>Entries</h3>
      <Entries entries={patient.entries} diagnoses={diagnoses} />
    </div>
  );
};

export default PatientPage;
