import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { trainingService } from '../services/trainingService';

const CreateWorkoutDialog = ({ open, onClose, onSuccess }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [exerciseStages, setExerciseStages] = useState([]);
  const [newWorkout, setNewWorkout] = useState({
    название: '',
    является_онлайн: false,
    время_начала: new Date(),
    exercises: [],
  });

  const [selectedExercise, setSelectedExercise] = useState({
    упражнение_id: '',
    этап_упражнения_id: '',
    номер_в_очереди: 1,
    колво_подходов: 3,
    колво_подходов_выполнено: 0,
    колво_повторений: 10,
    колво_повторений_выполнено: 0,
  });

  useEffect(() => {
    if (open) {
      fetchExercises();
      fetchExerciseStages();
    }
  }, [open]);

  const fetchExercises = async () => {
    try {
      const data = await trainingService.getMyExercises();
      setExercises(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setError('Ошибка при загрузке упражнений');
    }
  };

  const fetchExerciseStages = async () => {
    try {
      const data = await trainingService.getExerciseStages();
      setExerciseStages(data);
    } catch (error) {
      console.error('Error fetching exercise stages:', error);
      setError('Ошибка при загрузке этапов упражнений');
    }
  };

  const handleAddExercise = () => {
    if (!selectedExercise.упражнение_id || !selectedExercise.этап_упражнения_id) {
      setError('Выберите упражнение и этап');
      return;
    }

    setNewWorkout((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          ...selectedExercise,
          номер_в_очереди: prev.exercises.length + 1,
        },
      ],
    }));

    setSelectedExercise({
      упражнение_id: '',
      этап_упражнения_id: '',
      номер_в_очереди: 1,
      колво_подходов: 3,
      колво_подходов_выполнено: 0,
      колво_повторений: 10,
      колво_повторений_выполнено: 0,
    });
  };

  const handleRemoveExercise = (index) => {
    setNewWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index).map((ex, i) => ({
        ...ex,
        номер_в_очереди: i + 1,
      })),
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate all exercises before submitting
      const hasInvalidExercises = newWorkout.exercises.some(ex => 
        ex.колво_подходов_выполнено > ex.колво_подходов || 
        ex.колво_повторений_выполнено > ex.колво_повторений
      );
      
      if (hasInvalidExercises) {
        setError('Проверьте количество выполненных подходов и повторений во всех упражнениях');
        return;
      }

      await trainingService.createWorkout(newWorkout);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating workout:', error);
      setError('Ошибка при создании тренировки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Создать тренировку</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Название тренировки"
            value={newWorkout.название}
            onChange={(e) =>
              setNewWorkout((prev) => ({ ...prev, название: e.target.value }))
            }
            required
          />

          <FormControlLabel
            control={
              <Switch
                checked={newWorkout.является_онлайн}
                onChange={(e) =>
                  setNewWorkout((prev) => ({
                    ...prev,
                    является_онлайн: e.target.checked,
                  }))
                }
              />
            }
            label="Онлайн тренировка"
          />

          <DateTimePicker
            label="Время начала"
            value={newWorkout.время_начала}
            onChange={(newValue) =>
              setNewWorkout((prev) => ({ ...prev, время_начала: newValue }))
            }
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Добавить упражнение
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Упражнение</InputLabel>
                <Select
                  value={selectedExercise.упражнение_id}
                  onChange={(e) =>
                    setSelectedExercise((prev) => ({
                      ...prev,
                      упражнение_id: e.target.value,
                    }))
                  }
                  label="Упражнение"
                >
                  {exercises.map((exercise) => (
                    <MenuItem key={exercise.id} value={exercise.id}>
                      {exercise.название}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Этап упражнения</InputLabel>
                <Select
                  value={selectedExercise.этап_упражнения_id}
                  onChange={(e) =>
                    setSelectedExercise((prev) => ({
                      ...prev,
                      этап_упражнения_id: e.target.value,
                    }))
                  }
                  label="Этап упражнения"
                >
                  {exerciseStages.map((stage) => (
                    <MenuItem key={stage.id} value={stage.id}>
                      {stage.название}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Количество подходов"
                type="number"
                value={selectedExercise.колво_подходов}
                onChange={(e) =>
                  setSelectedExercise((prev) => ({
                    ...prev,
                    колво_подходов: parseInt(e.target.value) || 0,
                  }))
                }
                fullWidth
              />
              <TextField
                label="Выполнено подходов"
                type="number"
                value={selectedExercise.колво_подходов_выполнено}
                onChange={(e) =>
                  setSelectedExercise((prev) => ({
                    ...prev,
                    колво_подходов_выполнено: parseInt(e.target.value) || 0,
                  }))
                }
                fullWidth
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Количество повторений"
                type="number"
                value={selectedExercise.колво_повторений}
                onChange={(e) =>
                  setSelectedExercise((prev) => ({
                    ...prev,
                    колво_повторений: parseInt(e.target.value) || 0,
                  }))
                }
                fullWidth
              />
              <TextField
                label="Выполнено повторений"
                type="number"
                value={selectedExercise.колво_повторений_выполнено}
                onChange={(e) =>
                  setSelectedExercise((prev) => ({
                    ...prev,
                    колво_повторений_выполнено: parseInt(e.target.value) || 0,
                  }))
                }
                fullWidth
              />
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddExercise}
              disabled={!selectedExercise.упражнение_id || !selectedExercise.этап_упражнения_id}
            >
              Добавить упражнение
            </Button>

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Упражнения в тренировке
            </Typography>
            <List>
              {newWorkout.exercises.map((exercise, index) => {
                const exerciseData = exercises.find(
                  (e) => e.id === exercise.упражнение_id
                );
                const stageData = exerciseStages.find(
                  (s) => s.id === exercise.этап_упражнения_id
                );
                return (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`${index + 1}. ${exerciseData?.название || ''} (${stageData?.название || ''})`}
                      secondary={`${exercise.колво_подходов_выполнено}/${exercise.колво_подходов} подходов по ${exercise.колво_повторений_выполнено}/${exercise.колво_повторений} повторений`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveExercise(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !newWorkout.название || newWorkout.exercises.length === 0}
        >
          {loading ? 'Создание...' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateWorkoutDialog; 