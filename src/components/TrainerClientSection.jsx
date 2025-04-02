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
  Divider,
  Chip,
} from '@mui/material';

const TrainerClientSection = () => {
  const [clientId, setClientId] = useState('');
  const [trainerId, setTrainerId] = useState('');
  const [clientTrainers, setClientTrainers] = useState([]);
  const [trainerClients, setTrainerClients] = useState([]);

  const fetchClientTrainers = async () => {
    try {
      console.log('Fetching trainers for client:', clientId);
      const response = await fetch(`http://localhost:8000/clients/${clientId}/trainers`);
      const data = await response.json();
      console.log('API Response:', data);
      
      // Извлекаем массив тренеров из объекта ответа
      const trainers = data.trainers || [];
      console.log('Processed trainers:', trainers);
      setClientTrainers(trainers);
    } catch (error) {
      console.error('Error fetching client trainers:', error);
      setClientTrainers([]);
    }
  };

  const fetchTrainerClients = async () => {
    try {
      console.log('Fetching clients for trainer:', trainerId);
      const response = await fetch(`http://localhost:8000/trainers/${trainerId}/clients`);
      const data = await response.json();
      console.log('API Response for clients:', data);
      
      // Извлекаем массив клиентов из объекта ответа
      const clients = data.clients || [];
      console.log('Processed clients:', clients);
      setTrainerClients(clients);
    } catch (error) {
      console.error('Error fetching trainer clients:', error);
      setTrainerClients([]);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Тренеры клиента
              </Typography>
              <Box sx={{ mb: 2 }}>
                <TextField
                  label="ID клиента"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  type="number"
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" onClick={fetchClientTrainers}>
                  Найти тренеров
                </Button>
              </Box>
              <List>
                {clientTrainers && clientTrainers.length > 0 ? (
                  clientTrainers.map((trainer, index) => (
                    <div key={index}>
                      <ListItem>
                        <ListItemText
                          primary={`${trainer.фамилия} ${trainer.имя} ${trainer.отчество}`}
                          secondary={
                            <>
                              <Typography component="span" variant="body2">
                                Дата рождения: {new Date(trainer.дата_рождения).toLocaleDateString('ru-RU')}
                              </Typography>
                              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {(trainer.специальности || []).map((specialty, sIndex) => (
                                  <Chip
                                    key={sIndex}
                                    label={specialty}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                            </>
                          }
                        />
                      </ListItem>
                      {index < clientTrainers.length - 1 && <Divider />}
                    </div>
                  ))
                ) : (
                  <Typography color="text.secondary">
                    Нет доступных тренеров
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
                Клиенты тренера
              </Typography>
              <Box sx={{ mb: 2 }}>
                <TextField
                  label="ID тренера"
                  value={trainerId}
                  onChange={(e) => setTrainerId(e.target.value)}
                  type="number"
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" onClick={fetchTrainerClients}>
                  Найти клиентов
                </Button>
              </Box>
              <List>
                {trainerClients && trainerClients.length > 0 ? (
                  trainerClients.map((client, index) => (
                    <div key={index}>
                      <ListItem>
                        <ListItemText
                          primary={`${client.фамилия} ${client.имя} ${client.отчество}`}
                          secondary={
                            <>
                              <Typography component="span" variant="body2">
                                Дата рождения: {new Date(client.дата_рождения).toLocaleDateString('ru-RU')}
                                <br />
                                Уровень: {client.уровень_подготовки}
                              </Typography>
                              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {(client.цели_тренировок || []).map((goal, gIndex) => (
                                  <Chip
                                    key={gIndex}
                                    label={goal}
                                    size="small"
                                    color="secondary"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                            </>
                          }
                        />
                      </ListItem>
                      {index < trainerClients.length - 1 && <Divider />}
                    </div>
                  ))
                ) : (
                  <Typography color="text.secondary">
                    Нет доступных клиентов
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

export default TrainerClientSection; 