import {
  List,
  ListItem,
  Typography,
  Box,
  Chip,
  LinearProgress,
} from '@mui/material';

const WorkoutExerciseList = ({ exercises }) => {
  return (
    <List>
      {exercises.map((workoutExercise, index) => {
        const setsProgress = (workoutExercise.колво_подходов_выполнено / workoutExercise.колво_подходов) * 100;
        const repsProgress = (workoutExercise.колво_повторений_выполнено / workoutExercise.колво_повторений) * 100;
        
        return (
          <ListItem key={index} sx={{ display: 'block', py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography component="span" variant="body1">
                {index + 1}. {workoutExercise.exercise?.название || 'Упражнение'}
              </Typography>
              {workoutExercise.exercise?.exercise_stage && (
                <Chip
                  label={workoutExercise.exercise.exercise_stage.название}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
            <Box sx={{ pl: 2 }}>
              <Box sx={{ mb: 1 }}>
                <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                  Подходы: {workoutExercise.колво_подходов_выполнено}/{workoutExercise.колво_подходов}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={setsProgress} 
                  sx={{ mt: 0.5, height: 6, borderRadius: 1 }}
                />
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                  Повторения: {workoutExercise.колво_повторений_выполнено}/{workoutExercise.колво_повторений}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={repsProgress} 
                  sx={{ mt: 0.5, height: 6, borderRadius: 1 }}
                />
              </Box>
              {workoutExercise.exercise?.exercise_type && (
                <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                  Тип: {workoutExercise.exercise.exercise_type.название}
                </Typography>
              )}
              {workoutExercise.exercise?.difficulty_level && (
                <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                  Сложность: {workoutExercise.exercise.difficulty_level.название}
                </Typography>
              )}
              {workoutExercise.exercise?.equipment && workoutExercise.exercise.equipment.length > 0 && (
                <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                  Оборудование: {workoutExercise.exercise.equipment.map(e => e.название).join(', ')}
                </Typography>
              )}
            </Box>
          </ListItem>
        );
      })}
    </List>
  );
};

export default WorkoutExerciseList; 