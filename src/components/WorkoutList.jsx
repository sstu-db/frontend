import {
  Box,
  Typography,
} from '@mui/material';
import TrainingCard from './TrainingCard';

const WorkoutList = ({ workouts, onDelete, showExercises = true }) => {
  if (!workouts || workouts.length === 0) {
    return (
      <Typography color="text.secondary">
        Нет доступных тренировок
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {workouts.map((workout) => (
        <TrainingCard
          key={workout.id}
          item={workout}
          onDelete={onDelete}
          showWorkouts={showExercises}
        />
      ))}
    </Box>
  );
};

export default WorkoutList; 