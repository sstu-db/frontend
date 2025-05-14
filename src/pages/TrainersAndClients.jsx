import React, { useState, useEffect } from 'react';
import { 
  getMyTrainers, 
  getMyClients, 
  addTrainerToClient, 
  removeTrainerFromClient, 
  getAllTrainers,
  getAllClients,
  addClientToTrainer,
  removeClientFromTrainer
} from '../services/api';
import { authService } from '../services/authService';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Container, 
  Tabs, 
  Tab, 
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

const TrainersAndClients = () => {
  const [trainers, setTrainers] = useState([]);
  const [clients, setClients] = useState([]);
  const [allTrainers, setAllTrainers] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogError, setDialogError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isTrainer, setIsTrainer] = useState(false);

  useEffect(() => {
    const user = authService.getStoredUser();
    if (user?.id) {
      setCurrentUserId(user.id);
      setIsTrainer(user.trainer_id !== undefined);
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [trainersData, clientsData, allTrainersData, allClientsData] = await Promise.all([
        getMyTrainers(),
        getMyClients(),
        getAllTrainers(),
        getAllClients()
      ]);
      setTrainers(trainersData.data || []);
      setClients(clientsData.data || []);
      setAllTrainers(allTrainersData || []);
      setAllClients(allClientsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      if (err.message === 'Network Error') {
        setError('Ошибка сети. Проверьте подключение к интернету.');
      } else if (err.response?.status === 401) {
        setError('Сессия истекла. Пожалуйста, войдите в систему заново.');
      } else {
        setError('Не удалось загрузить данные.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = () => {
    if (!currentUserId) {
      setDialogError('Не удалось определить ID пользователя. Пожалуйста, войдите в систему заново.');
      return;
    }
    setOpenDialog(true);
    setDialogError(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogError(null);
  };

  const handleAddTrainer = async (trainerId) => {
    try {
      if (!currentUserId) {
        throw new Error('User ID not found');
      }
      setDialogError(null);
      await addTrainerToClient(currentUserId, trainerId);
      handleCloseDialog();
      fetchData();
    } catch (err) {
      console.error('Error in handleAddTrainer:', err);
      if (err.message === 'Network Error') {
        setDialogError('Ошибка сети. Проверьте подключение к интернету и попробуйте снова.');
      } else {
        setDialogError('Не удалось добавить тренера. Пожалуйста, попробуйте позже.');
      }
    }
  };

  const handleRemoveTrainer = async (trainerId) => {
    try {
      if (!currentUserId) {
        throw new Error('User ID not found');
      }
      await removeTrainerFromClient(currentUserId, trainerId);
      fetchData();
    } catch (err) {
      console.error('Error in handleRemoveTrainer:', err);
      if (err.message === 'Network Error') {
        setError('Ошибка сети. Проверьте подключение к интернету и попробуйте снова.');
      } else {
        setError('Не удалось удалить тренера. Пожалуйста, попробуйте позже.');
      }
    }
  };

  const handleAddClient = async (clientId) => {
    try {
      if (!currentUserId) {
        throw new Error('User ID not found');
      }
      setDialogError(null);
      await addClientToTrainer(clientId, currentUserId);
      handleCloseDialog();
      fetchData();
    } catch (err) {
      console.error('Error in handleAddClient:', err);
      if (err.message === 'Network Error') {
        setDialogError('Ошибка сети. Проверьте подключение к интернету и попробуйте снова.');
      } else {
        setDialogError('Не удалось добавить клиента. Пожалуйста, попробуйте позже.');
      }
    }
  };

  const handleRemoveClient = async (clientId) => {
    try {
      if (!currentUserId) {
        throw new Error('User ID not found');
      }
      await removeClientFromTrainer(clientId, currentUserId);
      fetchData();
    } catch (err) {
      console.error('Error in handleRemoveClient:', err);
      if (err.message === 'Network Error') {
        setError('Ошибка сети. Проверьте подключение к интернету и попробуйте снова.');
      } else {
        setError('Не удалось удалить клиента. Пожалуйста, попробуйте позже.');
      }
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Загрузка данных...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Тренеры и клиенты
      </Typography>

      {error && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center" 
          sx={{ mb: 2 }}
        >
          {error}
        </Typography>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Мои тренеры" />
          <Tab label="Мои клиенты" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
            >
              Добавить тренера
            </Button>
          </Box>
          <Grid container spacing={3}>
            {trainers.map((trainer) => (
              <Grid item xs={12} sm={6} md={4} key={trainer.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="h6" gutterBottom>
                        {trainer.user?.фамилия} {trainer.user?.имя} {trainer.user?.отчество}
                      </Typography>
                      <IconButton 
                        color="error" 
                        onClick={() => handleRemoveTrainer(trainer.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Typography color="textSecondary" gutterBottom>
                      Дата рождения: {trainer.user?.дата_рождения}
                    </Typography>
                    <Typography variant="body2">
                      Специальности: {trainer.specialties?.map(s => s.название).join(', ')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {trainers.length === 0 && (
              <Grid item xs={12}>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  align="center"
                  sx={{ py: 4 }}
                >
                  У вас пока нет тренеров
                </Typography>
              </Grid>
            )}
          </Grid>
        </>
      )}

      {activeTab === 1 && (
        <>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
            >
              Добавить клиента
            </Button>
          </Box>
          <Grid container spacing={3}>
            {clients.map((client) => (
              <Grid item xs={12} sm={6} md={4} key={client.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="h6" gutterBottom>
                        {client.user?.фамилия} {client.user?.имя} {client.user?.отчество}
                      </Typography>
                      <IconButton 
                        color="error" 
                        onClick={() => handleRemoveClient(client.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Typography color="textSecondary" gutterBottom>
                      Дата рождения: {client.user?.дата_рождения}
                    </Typography>
                    <Typography variant="body2">
                      Уровень подготовки: {client.preparation_level?.название}
                    </Typography>
                    <Typography variant="body2">
                      Цели тренировок: {client.training_goals?.map(g => g.название).join(', ')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {clients.length === 0 && (
              <Grid item xs={12}>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  align="center"
                  sx={{ py: 4 }}
                >
                  У вас пока нет клиентов
                </Typography>
              </Grid>
            )}
          </Grid>
        </>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {activeTab === 0 ? 'Добавить тренера' : 'Добавить клиента'}
        </DialogTitle>
        <DialogContent>
          {dialogError && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mb: 2 }}
            >
              {dialogError}
            </Typography>
          )}
          <List>
            {(activeTab === 0 ? allTrainers : allClients).map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => activeTab === 0 ? handleAddTrainer(item.id) : handleAddClient(item.id)}>
                    <ListItemText
                      primary={`${item.user?.фамилия} ${item.user?.имя} ${item.user?.отчество}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            Дата рождения: {item.user?.дата_рождения}
                          </Typography>
                          {activeTab === 0 ? (
                            <>
                              <br />
                              <Typography component="span" variant="body2">
                                Специальности: {item.specialties?.map(s => s.название).join(', ')}
                              </Typography>
                            </>
                          ) : (
                            <>
                              <br />
                              <Typography component="span" variant="body2">
                                Уровень подготовки: {item.preparation_level?.название}
                              </Typography>
                              <br />
                              <Typography component="span" variant="body2">
                                Цели тренировок: {item.training_goals?.map(g => g.название).join(', ')}
                              </Typography>
                            </>
                          )}
                        </>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {index < (activeTab === 0 ? allTrainers : allClients).length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TrainersAndClients; 