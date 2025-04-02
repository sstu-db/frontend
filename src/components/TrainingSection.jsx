import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import WorkoutList from './WorkoutList';

// Функция для форматирования даты и времени
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return 'Не указано';
  try {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateTimeStr;
  }
};

// Функция для определения формата тренировки
const getWorkoutFormat = (isOnline) => {
  return isOnline ? 'Онлайн' : 'Оффлайн';
};

const TrainingSection = () => {
  const [clientId, setClientId] = useState('');
  const [trainerId, setTrainerId] = useState('');
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  const fetchTrainingPlans = async () => {
    try {
      console.log('Fetching training plans for client:', clientId, 'trainer:', trainerId);
      let url = 'http://localhost:8000/training-plans?';
      
      if (clientId) {
        url += `client_id=${clientId}&`;
      }
      if (trainerId) {
        url += `trainer_id=${trainerId}&`;
      }

      const response = await fetch(url);
      const data = await response.json();
      console.log('Training Plans API Response:', data);
      
      if (data.training_plans && Array.isArray(data.training_plans)) {
        setTrainingPlans(data.training_plans);
      } else {
        setTrainingPlans([]);
      }
    } catch (error) {
      console.error('Error fetching training plans:', error);
      setTrainingPlans([]);
    }
  };

  const fetchWorkouts = async () => {
    try {
      console.log('Fetching workouts for client:', clientId, 'trainer:', trainerId);
      let url = 'http://localhost:8000/workouts?';
      
      if (clientId) {
        url += `client_id=${clientId}&`;
      }
      if (trainerId) {
        url += `trainer_id=${trainerId}&`;
      }

      const response = await fetch(url);
      const data = await response.json();
      console.log('Workouts API Response:', data);
      
      if (data.workouts && Array.isArray(data.workouts)) {
        setWorkouts(data.workouts);
      } else {
        setWorkouts([]);
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setWorkouts([]);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Поиск тренировок
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ID клиента"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    type="number"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ID тренера"
                    value={trainerId}
                    onChange={(e) => setTrainerId(e.target.value)}
                    type="number"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" onClick={fetchTrainingPlans}>
                  Найти планы тренировок
                </Button>
                <Button variant="contained" onClick={fetchWorkouts}>
                  Найти тренировки
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Планы тренировок
              </Typography>
              {trainingPlans && trainingPlans.length > 0 ? (
                trainingPlans.map((plan, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {plan.название || 'Без названия'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {plan.описание || ''}
                    </Typography>
                    {plan.тренировки && plan.тренировки.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Тренировки:
                        </Typography>
                        <WorkoutList workouts={plan.тренировки} />
                      </Box>
                    )}
                  </Paper>
                ))
              ) : (
                <Typography color="text.secondary">
                  Нет доступных планов тренировок
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Тренировки
              </Typography>
              <WorkoutList workouts={workouts} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TrainingSection; 