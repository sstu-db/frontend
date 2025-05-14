import {
  Box,
  Typography,
  IconButton,
  Divider,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkoutExerciseList from './WorkoutExerciseList';
import WorkoutList from './WorkoutList';

const TrainingCard = ({ item, onDelete, showWorkouts = true }) => {
  const isPlan = 'workouts' in item;
  const title = item.название;
  const description = item.описание;
  const workouts = isPlan ? item.workouts : null;
  const workoutExercises = !isPlan ? item.workout_exercises : null;

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" paragraph>
              {description}
            </Typography>
          )}
          {!isPlan && (
            <Typography variant="body2" color="text.secondary">
              {item.является_онлайн ? 'Онлайн' : 'Оффлайн'} • {new Date(item.время_начала).toLocaleString()}
            </Typography>
          )}
        </Box>
        {onDelete && (
          <IconButton
            color="error"
            onClick={() => onDelete(item.id)}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
      
      {showWorkouts && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            {isPlan ? 'Тренировки в плане:' : 'Упражнения:'}
          </Typography>
          {isPlan ? (
            <WorkoutList workouts={workouts} />
          ) : (
            <WorkoutExerciseList exercises={workoutExercises} />
          )}
        </>
      )}
    </Paper>
  );
};

export default TrainingCard; 