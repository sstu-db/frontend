import {
  Box,
  Typography,
  Chip,
} from '@mui/material';

const ExerciseCard = ({ exercise }) => {
  return (
    <Box
      sx={{
        p: 1,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <Typography variant="body2" fontWeight="medium">
        {exercise.название}
      </Typography>
      {exercise.описание && (
        <Typography variant="body2" color="text.secondary">
          {exercise.описание}
        </Typography>
      )}
      <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          label={`Тип: ${exercise.exercise_type.название}`}
          size="small"
          variant="outlined"
        />
        <Chip
          label={`Сложность: ${exercise.difficulty_level.название}`}
          size="small"
          variant="outlined"
        />
        {exercise.equipment && exercise.equipment.length > 0 && (
          <Chip
            label={`Оборудование: ${exercise.equipment.map(e => e.название).join(', ')}`}
            size="small"
            variant="outlined"
          />
        )}
      </Box>
    </Box>
  );
};

export default ExerciseCard; 