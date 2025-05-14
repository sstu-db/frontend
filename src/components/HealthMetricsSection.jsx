import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { healthService } from '../services/healthService';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const HealthMetricsSection = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [steps, setSteps] = useState([]);
  const [water, setWater] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dialog states
  const [openStepsDialog, setOpenStepsDialog] = useState(false);
  const [openWaterDialog, setOpenWaterDialog] = useState(false);
  const [newSteps, setNewSteps] = useState({
    колво: '',
    целевое_колво: '',
    дата: new Date()
  });
  const [newWater, setNewWater] = useState({
    объем: '',
    целевой_объем: '',
    дата: new Date()
  });

  useEffect(() => {
    fetchHealthData();
  }, [startDate, endDate]);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Format dates as YYYY-MM-DD
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      
      const [stepsData, waterData] = await Promise.all([
        healthService.getMyStepsByDates(formattedStartDate, formattedEndDate),
        healthService.getMyWaterByDates(formattedStartDate, formattedEndDate)
      ]);
      
      // Ensure we have arrays even if the API returns null or undefined
      setSteps(Array.isArray(stepsData) ? stepsData : []);
      setWater(Array.isArray(waterData) ? waterData : []);
    } catch (error) {
      console.error('Error fetching health data:', error);
      setError('Ошибка при загрузке данных о здоровье');
      // Reset data on error
      setSteps([]);
      setWater([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSteps = async (stepsId) => {
    try {
      await healthService.deleteSteps(stepsId);
      fetchHealthData();
    } catch (error) {
      console.error('Error deleting steps:', error);
      setError('Ошибка при удалении записи о шагах');
    }
  };

  const handleDeleteWater = async (waterId) => {
    try {
      await healthService.deleteWater(waterId);
      fetchHealthData();
    } catch (error) {
      console.error('Error deleting water:', error);
      setError('Ошибка при удалении записи о воде');
    }
  };

  const handleCreateSteps = async () => {
    try {
      const stepsData = {
        ...newSteps,
        дата: format(newSteps.дата, 'yyyy-MM-dd')
      };
      await healthService.createSteps(stepsData);
      setOpenStepsDialog(false);
      setNewSteps({
        колво: '',
        целевое_колво: '',
        дата: new Date()
      });
      fetchHealthData();
    } catch (error) {
      console.error('Error creating steps:', error);
      setError('Ошибка при создании записи о шагах');
    }
  };

  const handleCreateWater = async () => {
    try {
      const waterData = {
        ...newWater,
        дата: format(newWater.дата, 'yyyy-MM-dd')
      };
      await healthService.createWater(waterData);
      setOpenWaterDialog(false);
      setNewWater({
        объем: '',
        целевой_объем: '',
        дата: new Date()
      });
      fetchHealthData();
    } catch (error) {
      console.error('Error creating water:', error);
      setError('Ошибка при создании записи о воде');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <DatePicker
                  label="Начальная дата"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  format="dd.MM.yyyy"
                  slotProps={{ textField: { fullWidth: true } }}
                />
                <DatePicker
                  label="Конечная дата"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  format="dd.MM.yyyy"
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Шаги
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenStepsDialog(true)}
                    >
                      Добавить
                    </Button>
                  </Box>
                  {loading ? (
                    <Typography>Загрузка...</Typography>
                  ) : steps.length > 0 ? (
                    steps.map((step) => (
                      <Paper key={step.id} sx={{ p: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="subtitle1">
                              {format(new Date(step.дата), 'd MMMM yyyy', { locale: ru })}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Шагов: {step.колво}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Цель: {step.целевое_колво}
                            </Typography>
                          </Box>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteSteps(step.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))
                  ) : (
                    <Typography color="text.secondary">
                      Нет записей о шагах
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Вода
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenWaterDialog(true)}
                    >
                      Добавить
                    </Button>
                  </Box>
                  {loading ? (
                    <Typography>Загрузка...</Typography>
                  ) : water.length > 0 ? (
                    water.map((waterRecord) => (
                      <Paper key={waterRecord.id} sx={{ p: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="subtitle1">
                              {format(new Date(waterRecord.дата), 'd MMMM yyyy', { locale: ru })}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Объем: {waterRecord.объем} мл
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Цель: {waterRecord.целевой_объем} мл
                            </Typography>
                          </Box>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteWater(waterRecord.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))
                  ) : (
                    <Typography color="text.secondary">
                      Нет записей о воде
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog for adding new steps */}
      <Dialog open={openStepsDialog} onClose={() => setOpenStepsDialog(false)}>
        <DialogTitle>Добавить шаги</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <DatePicker
              label="Дата"
              value={newSteps.дата}
              onChange={(newValue) => setNewSteps({ ...newSteps, дата: newValue })}
              format="dd.MM.yyyy"
              slotProps={{ textField: { fullWidth: true } }}
            />
            <FormControl fullWidth>
              <InputLabel>Количество шагов</InputLabel>
              <Input
                type="number"
                value={newSteps.колво}
                onChange={(e) => setNewSteps({ ...newSteps, колво: e.target.value })}
                endAdornment={<InputAdornment position="end">шагов</InputAdornment>}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Целевое количество шагов</InputLabel>
              <Input
                type="number"
                value={newSteps.целевое_колво}
                onChange={(e) => setNewSteps({ ...newSteps, целевое_колво: e.target.value })}
                endAdornment={<InputAdornment position="end">шагов</InputAdornment>}
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStepsDialog(false)}>Отмена</Button>
          <Button onClick={handleCreateSteps} variant="contained">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for adding new water */}
      <Dialog open={openWaterDialog} onClose={() => setOpenWaterDialog(false)}>
        <DialogTitle>Добавить воду</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <DatePicker
              label="Дата"
              value={newWater.дата}
              onChange={(newValue) => setNewWater({ ...newWater, дата: newValue })}
              format="dd.MM.yyyy"
              slotProps={{ textField: { fullWidth: true } }}
            />
            <FormControl fullWidth>
              <InputLabel>Объем воды</InputLabel>
              <Input
                type="number"
                value={newWater.объем}
                onChange={(e) => setNewWater({ ...newWater, объем: e.target.value })}
                endAdornment={<InputAdornment position="end">мл</InputAdornment>}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Целевой объем воды</InputLabel>
              <Input
                type="number"
                value={newWater.целевой_объем}
                onChange={(e) => setNewWater({ ...newWater, целевой_объем: e.target.value })}
                endAdornment={<InputAdornment position="end">мл</InputAdornment>}
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenWaterDialog(false)}>Отмена</Button>
          <Button onClick={handleCreateWater} variant="contained">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HealthMetricsSection; 