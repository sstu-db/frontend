import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import ExerciseList from './ExerciseList';

const formatDateTime = (dateStr) => {
  if (!dateStr) return 'Не указано';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateStr;
  }
};

const getWorkoutFormat = (isOnline) => {
  return isOnline ? 'Онлайн' : 'Оффлайн';
};

const WorkoutList = ({ workouts }) => {
  if (!workouts || workouts.length === 0) {
    return (
      <Typography color="text.secondary">
        Нет доступных тренировок
      </Typography>
    );
  }

  return (
    <List>
      {workouts.map((workout, index) => (
        <ListItem key={index}>
          <Paper sx={{ width: '100%', p: 2 }}>
            <ListItemText
              primary={workout.название || 'Без названия'}
              secondary={
                <>
                  <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={`Формат: ${getWorkoutFormat(workout.является_онлайн)}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={`Время: ${formatDateTime(workout.время_начала)}`}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                  {workout.exercises && workout.exercises.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Упражнения:
                      </Typography>
                      <ExerciseList exercises={workout.exercises} />
                    </Box>
                  )}
                </>
              }
            />
          </Paper>
        </ListItem>
      ))}
    </List>
  );
};

export default WorkoutList; 