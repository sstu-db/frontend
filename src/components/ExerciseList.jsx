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
                      label={`Тип: ${exercise.тип_упражнения?.название || 'Не указан'}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={`Уровень: ${exercise.сложность_упражнения?.название || 'Не указан'}`}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                  {exercise.мышцы && exercise.мышцы.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Мышцы:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {exercise.мышцы.map((muscle, mIndex) => (
                          <Chip
                            key={mIndex}
                            label={`${muscle.название || muscle.название_мышцы} (${muscle.приоритет})`}
                            size="small"
                            color="info"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  {exercise.снаряжение && exercise.снаряжение.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Снаряжение:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {exercise.снаряжение.map((equipment, eIndex) => (
                          <Chip
                            key={eIndex}
                            label={equipment}
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