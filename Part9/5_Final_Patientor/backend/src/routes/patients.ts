import express, { Request, Response } from 'express';
import patientService from '../services/patientService';
import { toNewEntry } from '../utils';
import { z } from 'zod';

const router = express.Router();

router.get('/', (_req, res: Response) => {
  res.send(patientService.getPublicPatients());
});

router.get('/:id', (req: Request, res: Response) => {
  const patient = patientService.findById(req.params.id);

  if (patient) {
    res.json(patient);
  } else {
    res.sendStatus(404);
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const newPatient = patientService.addPatient(req.body);
    res.json(newPatient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      res.status(400).json({ error: 'Unknown error' });
    }
  }
});

router.post('/:id/entries', (req: Request, res: Response) => {
  try {
    const newEntry = toNewEntry(req.body);
    const patient = patientService.addEntry(req.params.id, newEntry);
    
    if (patient) {
      res.json(patient);
    } else {
      res.sendStatus(404);
    }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'Unknown error' });
    }
  }
});

export default router;
