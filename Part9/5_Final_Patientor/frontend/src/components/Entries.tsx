import { Entry, Diagnosis } from '../types';
import EntryDetails from './EntryDetails';

interface Props {
  entries: Entry[];
  diagnoses: Diagnosis[];
}

const Entries = ({ entries, diagnoses }: Props) => {
  if (entries.length === 0) {
    return <p>No entries</p>;
  }

  return (
    <div>
      {entries.map(entry => (
        <div key={entry.id}>
          <h4>{entry.date}</h4>
          <p><em>{entry.description}</em></p>
          {entry.diagnosisCodes && (
            <div>
              <strong>Diagnosis codes:</strong>
              <ul>
                {entry.diagnosisCodes.map(code => {
                  const diagnosis = diagnoses.find(d => d.code === code);
                  return (
                    <li key={code}>
                      {code} {diagnosis ? diagnosis.name : ''}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          <EntryDetails entry={entry} />
        </div>
      ))}
    </div>
  );
};

export default Entries;
