import { z } from 'zod';
import { EntryWithoutId, HealthCheckRating } from './types';

const parseDiagnosisCodes = (object: unknown): Array<string> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    return [] as Array<string>;
  }

  return object.diagnosisCodes as Array<string>;
};

const HealthCheckEntrySchema = z.object({
  type: z.literal('HealthCheck'),
  description: z.string(),
  date: z.string().date(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
});

const OccupationalHealthcareEntrySchema = z.object({
  type: z.literal('OccupationalHealthcare'),
  description: z.string(),
  date: z.string().date(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
  employerName: z.string(),
  sickLeave: z.object({
    startDate: z.string().date(),
    endDate: z.string().date(),
  }).optional(),
});

const HospitalEntrySchema = z.object({
  type: z.literal('Hospital'),
  description: z.string(),
  date: z.string().date(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
  discharge: z.object({
    date: z.string().date(),
    criteria: z.string(),
  }),
});

const EntrySchema = z.discriminatedUnion('type', [
  HealthCheckEntrySchema,
  OccupationalHealthcareEntrySchema,
  HospitalEntrySchema,
]);

export const toNewEntry = (object: unknown): EntryWithoutId => {
  const parsed = EntrySchema.parse(object);
  
  // Remove id if present (shouldn't be, but just in case)
  const { id, ...entryWithoutId } = parsed as any;
  
  return entryWithoutId as EntryWithoutId;
};
