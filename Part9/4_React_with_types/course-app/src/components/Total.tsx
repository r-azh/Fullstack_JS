import { CoursePart } from '../types';

interface TotalProps {
  parts: CoursePart[];
}

const Total = ({ parts }: TotalProps) => {
  const totalExercises = parts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <p>
      Number of exercises {totalExercises}
    </p>
  );
};

export default Total;
