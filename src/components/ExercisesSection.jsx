import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { trainingService } from '../services/trainingService';
import ExerciseCard from './ExerciseCard';

const ExercisesSection = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [exerciseTypes, setExerciseTypes] = useState([]);
  const [difficultyLevels, setDifficultyLevels] = useState([]);
  const [newExercise, setNewExercise] = useState({
    название: '',
    описание: '',
    тип_упражнения_id: '',
    сложность_упражнения_id: '',
  });

  useEffect(() => {
    fetchExercises();
    fetchExerciseTypes();
    fetchDifficultyLevels();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainingService.getMyExercises();
      setExercises(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setError('Ошибка при загрузке упражнений');
    } finally {
      setLoading(false);
    }
  };

  const fetchExerciseTypes = async () => {
    try {
      const data = await trainingService.getExerciseTypes();
      setExerciseTypes(data);
    } catch (error) {
      console.error('Error fetching exercise types:', error);
      setError('Ошибка при загрузке типов упражнений');
    }
  };

  const fetchDifficultyLevels = async () => {
    try {
      const data = await trainingService.getExerciseDifficultyLevels();
      setDifficultyLevels(data);
    } catch (error) {
      console.error('Error fetching difficulty levels:', error);
      setError('Ошибка при загрузке уровней сложности');
    }
  };

  const handleOpenDialog = () => {
    setNewExercise({
      название: '',
      описание: '',
      тип_упражнения_id: '',
      сложность_упражнения_id: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError(null);
  };

  const handleCreateExercise = async () => {
    try {
      setError(null);
      await trainingService.createExercise(newExercise);
      handleCloseDialog();
      fetchExercises();
    } catch (error) {
      console.error('Error creating exercise:', error);
      setError('Ошибка при создании упражнения');
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    try {
      await trainingService.deleteExercise(exerciseId);
      fetchExercises();
    } catch (error) {
      console.error('Error deleting exercise:', error);
      setError('Ошибка при удалении упражнения');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Упражнения
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
            >
              Добавить упражнение
            </Button>
          </Box>

          {loading ? (
            <Typography>Загрузка...</Typography>
          ) : exercises && exercises.length > 0 ? (
            <Grid container spacing={2}>
              {exercises.map((exercise) => (
                <Grid item xs={12} sm={6} md={4} key={exercise.id}>
                  <Box sx={{ position: 'relative' }}>
                    <ExerciseCard exercise={exercise} />
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteExercise(exercise.id)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'background.paper',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary">
              Нет доступных упражнений
            </Typography>
          )}
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Добавить упражнение</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Название"
              value={newExercise.название}
              onChange={(e) => setNewExercise({ ...newExercise, название: e.target.value })}
              fullWidth
            />
            <TextField
              label="Описание"
              value={newExercise.описание}
              onChange={(e) => setNewExercise({ ...newExercise, описание: e.target.value })}
              multiline
              rows={4}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Тип упражнения</InputLabel>
              <Select
                value={newExercise.тип_упражнения_id}
                onChange={(e) => setNewExercise({ ...newExercise, тип_упражнения_id: e.target.value })}
                label="Тип упражнения"
              >
                {exerciseTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.название}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Уровень сложности</InputLabel>
              <Select
                value={newExercise.сложность_упражнения_id}
                onChange={(e) => setNewExercise({ ...newExercise, сложность_упражнения_id: e.target.value })}
                label="Уровень сложности"
              >
                {difficultyLevels.map((level) => (
                  <MenuItem key={level.id} value={level.id}>
                    {level.название}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleCreateExercise} variant="contained">
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExercisesSection; 