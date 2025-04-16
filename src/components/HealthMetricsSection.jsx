import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@mui/material';

const HealthMetricsSection = () => {
  const [userId, setUserId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [steps, setSteps] = useState([]);
  const [water, setWater] = useState([]);

  const fetchHealthMetrics = async () => {
    try {
      console.log('Fetching health metrics for user:', userId);
      
      // Form URLs with date parameters
      let stepsUrl = `http://localhost:8000/steps?user_id=${userId}`;
      let waterUrl = `http://localhost:8000/water?user_id=${userId}`;
      
      if (startDate) {
        stepsUrl += `&start_date=${startDate}`;
        waterUrl += `&start_date=${startDate}`;
      }
      if (endDate) {
        stepsUrl += `&end_date=${endDate}`;
        waterUrl += `&end_date=${endDate}`;
      }
      
      // Get steps data
      const stepsResponse = await fetch(stepsUrl);
      const stepsData = await stepsResponse.json();
      console.log('Steps API Response:', stepsData);
      
      // Get water consumption data
      const waterResponse = await fetch(waterUrl);
      const waterData = await waterResponse.json();
      console.log('Water API Response:', waterData);
      
      setSteps(stepsData.data || []);
      setWater(waterData.data || []);
    } catch (error) {
      console.error('Error fetching health metrics:', error);
      setSteps([]);
      setWater([]);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Не указана';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Поиск метрик здоровья
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="ID пользователя"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    type="number"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Начальная дата"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Конечная дата"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              <Button variant="contained" onClick={fetchHealthMetrics}>
                Найти метрики
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Шаги
              </Typography>
              <List>
                {steps && steps.length > 0 ? (
                  steps.map((step, index) => (
                    <ListItem key={index}>
                      <Box sx={{ width: '100%' }}>
                        <ListItemText 
                          primary={formatDate(step.дата)}
                          secondary={
                            <>
                              <Typography component="span" variant="body2">
                                Пройдено: {step.колво} / {step.целевое_колво} шагов
                              </Typography>
                              <Box sx={{ mt: 1 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={(step.колво / step.целевое_колво) * 100}
                                  sx={{ height: 8, borderRadius: 4 }}
                                />
                              </Box>
                            </>
                          }
                        />
                      </Box>
                    </ListItem>
                  ))
                ) : (
                  <Typography color="text.secondary">
                    Нет данных о шагах
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Потребление воды
              </Typography>
              <List>
                {water && water.length > 0 ? (
                  water.map((waterEntry, index) => (
                    <ListItem key={index}>
                      <Box sx={{ width: '100%' }}>
                        <ListItemText 
                          primary={formatDate(waterEntry.дата)}
                          secondary={
                            <>
                              <Typography component="span" variant="body2">
                                Выпито: {waterEntry.объем} / {waterEntry.целевой_объем} мл
                              </Typography>
                              <Box sx={{ mt: 1 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={(waterEntry.объем / waterEntry.целевой_объем) * 100}
                                  sx={{ height: 8, borderRadius: 4 }}
                                />
                              </Box>
                            </>
                          }
                        />
                      </Box>
                    </ListItem>
                  ))
                ) : (
                  <Typography color="text.secondary">
                    Нет данных о потреблении воды
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HealthMetricsSection; 