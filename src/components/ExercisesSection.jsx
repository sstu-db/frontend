import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import ExerciseList from './ExerciseList';

const ExercisesSection = () => {
  const [clientId, setClientId] = useState('');
  const [trainerId, setTrainerId] = useState('');
  const [exercises, setExercises] = useState([]);

  const fetchExercises = async () => {
    try {
      console.log('Fetching exercises for client:', clientId, 'trainer:', trainerId);
      let url = 'http://localhost:8000/exercises?';
      
      if (clientId) {
        url += `client_id=${clientId}&`;
      }
      if (trainerId) {
        url += `trainer_id=${trainerId}&`;
      }

      const response = await fetch(url);
      const data = await response.json();
      console.log('Exercises API Response:', data);
      
      if (data.exercises && Array.isArray(data.exercises)) {
        setExercises(data.exercises);
      } else {
        setExercises([]);
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setExercises([]);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Поиск упражнений
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
              <Button variant="contained" onClick={fetchExercises}>
                Найти упражнения
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Упражнения
              </Typography>
              <ExerciseList exercises={exercises} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExercisesSection; 