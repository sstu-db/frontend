import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Chip,
} from '@mui/material';

const ExerciseList = ({ exercises }) => {
  if (!exercises || exercises.length === 0) {
    return (
      <Typography color="text.secondary">
        Нет доступных упражнений
      </Typography>
    );
  }

  return (
    <List>
      {exercises.map((exercise, index) => (
        <ListItem key={index}>
          <Box sx={{ width: '100%' }}>
            <ListItemText
              primary={exercise.название || 'Без названия'}
              secondary={
                <>
                  <Typography component="span" variant="body2">
                    {exercise.описание || ''}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={`Тип: ${exercise.exercise_type?.название || 'Не указан'}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={`Уровень: ${exercise.difficulty_level?.название || 'Не указан'}`}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                  {exercise.muscles && exercise.muscles.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Мышцы:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {exercise.muscles.map((muscle, mIndex) => (
                          <Chip
                            key={mIndex}
                            label={muscle.название}
                            size="small"
                            color="info"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  {exercise.equipment && exercise.equipment.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Снаряжение:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {exercise.equipment.map((equipment, eIndex) => (
                          <Chip
                            key={eIndex}
                            label={equipment.название}
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </>
              }
            />
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default ExerciseList; 