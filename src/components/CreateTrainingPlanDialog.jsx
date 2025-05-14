import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { trainingService } from '../services/trainingService';

const CreateTrainingPlanDialog = ({ open, onClose, onSuccess }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [newPlan, setNewPlan] = useState({
    название: '',
    описание: '',
    workouts: [],
  });

  useEffect(() => {
    if (open) {
      fetchWorkouts();
    }
  }, [open]);

  const fetchWorkouts = async () => {
    try {
      const data = await trainingService.getMyWorkouts();
      setWorkouts(data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError('Ошибка при загрузке тренировок');
    }
  };

  const handleCreatePlan = async () => {
    try {
      setLoading(true);
      setError(null);
      const planData = {
        ...newPlan,
        workouts: newPlan.workouts.map(id => parseInt(id)),
      };
      await trainingService.createTrainingPlan(planData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating training plan:', error);
      setError('Ошибка при создании плана тренировок');
    } finally {
      setLoading(false);
    }
  };

  const handleWorkoutSelect = (event) => {
    const selectedWorkouts = event.target.value;
    setNewPlan({ ...newPlan, workouts: selectedWorkouts });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Создать план тренировок</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Название"
            value={newPlan.название}
            onChange={(e) => setNewPlan({ ...newPlan, название: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label="Описание"
            value={newPlan.описание}
            onChange={(e) => setNewPlan({ ...newPlan, описание: e.target.value })}
            multiline
            rows={4}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Тренировки</InputLabel>
            <Select
              multiple
              value={newPlan.workouts}
              onChange={handleWorkoutSelect}
              label="Тренировки"
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((workoutId) => {
                    const workout = workouts.find(w => w.id === workoutId);
                    return (
                      <Chip
                        key={workoutId}
                        label={workout ? workout.название : workoutId}
                        size="small"
                      />
                    );
                  })}
                </Box>
              )}
            >
              {workouts.map((workout) => (
                <MenuItem key={workout.id} value={workout.id}>
                  {workout.название}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleCreatePlan}
          variant="contained"
          disabled={loading || !newPlan.название}
        >
          {loading ? 'Создание...' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTrainingPlanDialog; 