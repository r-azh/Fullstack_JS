import { Entry } from '../types';

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

export default EntryDetails;
