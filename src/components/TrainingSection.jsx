import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { trainingService } from '../services/trainingService';
import CreateWorkoutDialog from './CreateWorkoutDialog';
import CreateTrainingPlanDialog from './CreateTrainingPlanDialog';
import WorkoutList from './WorkoutList';

const TrainingSection = () => {
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createWorkoutOpen, setCreateWorkoutOpen] = useState(false);
  const [createPlanOpen, setCreatePlanOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [plansData, workoutsData] = await Promise.all([
        trainingService.getMyTrainingPlans(),
        trainingService.getMyWorkouts(),
      ]);
      setTrainingPlans(plansData);
      setWorkouts(workoutsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    try {
      await trainingService.deleteTrainingPlan(planId);
      fetchData();
    } catch (error) {
      console.error('Error deleting training plan:', error);
      setError('Ошибка при удалении плана тренировок');
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    try {
      await trainingService.deleteWorkout(workoutId);
      fetchData();
    } catch (error) {
      console.error('Error deleting workout:', error);
      setError('Ошибка при удалении тренировки');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateWorkoutOpen(true)}
        >
          Добавить тренировку
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreatePlanOpen(true)}
        >
          Добавить план тренировок
        </Button>
      </Stack>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Мои тренировки
      </Typography>
      <WorkoutList workouts={workouts} onDelete={handleDeleteWorkout} showExercises={true} />

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Мои планы тренировок
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {trainingPlans.length > 0 ? (
          trainingPlans.map((plan) => (
            <Box key={plan.id} sx={{ mb: 2 }}>
              <Typography variant="h6">{plan.название}</Typography>
              <Typography variant="body2" color="text.secondary">
                {plan.описание}
              </Typography>
              {plan.workouts && plan.workouts.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Тренировки в плане:
                  </Typography>
                  <WorkoutList workouts={plan.workouts} showExercises={true} />
                </Box>
              )}
            </Box>
          ))
        ) : (
          <Typography color="text.secondary">
            У вас пока нет планов тренировок
          </Typography>
        )}
      </Box>

      <CreateWorkoutDialog
        open={createWorkoutOpen}
        onClose={() => setCreateWorkoutOpen(false)}
        onSuccess={fetchData}
      />

      <CreateTrainingPlanDialog
        open={createPlanOpen}
        onClose={() => setCreatePlanOpen(false)}
        onSuccess={fetchData}
      />
    </Box>
  );
};

export default TrainingSection; 