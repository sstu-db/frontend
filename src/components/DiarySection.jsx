import { useState, useEffect } from 'react';
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
  Chip,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  OutlinedInput,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { API_URL } from '../config';
import { diaryService } from '../services/diaryService';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const DiarySection = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [diaries, setDiaries] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [newDiary, setNewDiary] = useState({
    дата: new Date(),
    запись: '',
    feelings: [],
    feeling_reasons: [],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [feelings, setFeelings] = useState([]);
  const [feelingReasons, setFeelingReasons] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDiaryData();
    fetchFeelingsAndReasons();
  }, [startDate, endDate]);

  const fetchDiaryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      const data = await diaryService.getMyDiariesByDates(formattedStartDate, formattedEndDate);
      setDiaries(data);
    } catch (error) {
      console.error('Error fetching diary data:', error);
      setError('Ошибка при загрузке дневника');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeelingsAndReasons = async () => {
    try {
      const [feelingsData, reasonsData] = await Promise.all([
        diaryService.getFeelings(),
        diaryService.getFeelingReasons()
      ]);
      setFeelings(feelingsData);
      setFeelingReasons(reasonsData);
    } catch (error) {
      console.error('Error fetching feelings and reasons:', error);
      setError('Ошибка при загрузке чувств и причин');
    }
  };

  const handleOpenDialog = (diary = null) => {
    if (diary) {
      setSelectedDiary(diary);
      setNewDiary({
        дата: new Date(diary.дата),
        запись: diary.запись || '',
        feelings: diary.feelings?.map(f => f.id) || [],
        feeling_reasons: diary.feeling_reasons?.map(r => r.id) || [],
      });
    } else {
      setSelectedDiary(null);
      setNewDiary({
        дата: new Date(),
        запись: '',
        feelings: [],
        feeling_reasons: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDiary(null);
    setNewDiary({
      дата: new Date(),
      запись: '',
      feelings: [],
      feeling_reasons: [],
    });
    setError('');
  };

  const handleSubmit = async () => {
    try {
      setError('');
      const diaryData = {
        ...newDiary,
        дата: format(newDiary.дата, 'yyyy-MM-dd')
      };
      
      if (selectedDiary) {
        await diaryService.updateDiary(selectedDiary.id, diaryData);
      } else {
        await diaryService.createDiary(diaryData);
      }

      setSuccess(selectedDiary ? 'Дневник обновлен' : 'Дневник создан');
      handleCloseDialog();
      fetchDiaryData();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (diaryId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот дневник?')) {
      return;
    }

    try {
      await diaryService.deleteDiary(diaryId);
      setSuccess('Дневник удален');
      fetchDiaryData();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Поиск дневников
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  Новый дневник
                </Button>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Начальная дата"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    format="dd.MM.yyyy"
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Конечная дата"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    format="dd.MM.yyyy"
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              </Grid>
              <Button variant="contained" onClick={fetchDiaryData} sx={{ mt: 2 }}>
                Найти дневники
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Дневники
              </Typography>
              <List>
                {loading ? (
                  <Typography>Загрузка...</Typography>
                ) : diaries && diaries.length > 0 ? (
                  diaries.map((diary, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <Box>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => handleOpenDialog(diary)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDelete(diary.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      }
                    >
                      <Box sx={{ width: '100%' }}>
                        <ListItemText 
                          primary={format(new Date(diary.дата), 'd MMMM yyyy', { locale: ru })}
                          secondary={
                            <>
                              <Typography component="span" variant="body2">
                                {diary.запись || ''}
                              </Typography>
                              {diary.file && (
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="body2" color="primary">
                                    <Link 
                                      href={`${API_URL}/files/${diary.file.id}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {diary.file.имя_файла}
                                    </Link>
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                                    {(diary.file.file_types || []).map((type, tIndex) => (
                                      <Chip
                                        key={tIndex}
                                        label={type.название}
                                        size="small"
                                        color="info"
                                        variant="outlined"
                                      />
                                    ))}
                                  </Box>
                                </Box>
                              )}
                              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {(diary.feelings || []).map((feeling, fIndex) => (
                                  <Chip
                                    key={fIndex}
                                    label={feeling.название}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Причины:
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                  {(diary.feeling_reasons || []).map((reason, rIndex) => (
                                    <Chip
                                      key={rIndex}
                                      label={reason.название}
                                      size="small"
                                      color="secondary"
                                      variant="outlined"
                                    />
                                  ))}
                                </Box>
                              </Box>
                            </>
                          }
                        />
                      </Box>
                    </ListItem>
                  ))
                ) : (
                  <Typography color="text.secondary">
                    Нет доступных дневников
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedDiary ? 'Редактировать дневник' : 'Новый дневник'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <DatePicker
              label="Дата"
              value={newDiary.дата}
              onChange={(newValue) => setNewDiary({ ...newDiary, дата: newValue })}
              format="dd.MM.yyyy"
              slotProps={{ textField: { fullWidth: true } }}
            />
            <TextField
              label="Текст записи"
              multiline
              rows={4}
              value={newDiary.запись}
              onChange={(e) => setNewDiary({ ...newDiary, запись: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Чувства</InputLabel>
              <Select
                multiple
                value={newDiary.feelings}
                onChange={(e) => setNewDiary({ ...newDiary, feelings: e.target.value })}
                input={<OutlinedInput label="Чувства" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={feelings.find(f => f.id === value)?.название}
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              >
                {feelings.map((feeling) => (
                  <MenuItem key={feeling.id} value={feeling.id}>
                    {feeling.название}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Причины чувств</InputLabel>
              <Select
                multiple
                value={newDiary.feeling_reasons}
                onChange={(e) => setNewDiary({ ...newDiary, feeling_reasons: e.target.value })}
                input={<OutlinedInput label="Причины чувств" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={feelingReasons.find(r => r.id === value)?.название}
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              >
                {feelingReasons.map((reason) => (
                  <MenuItem key={reason.id} value={reason.id}>
                    {reason.название}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading}
          >
            {selectedDiary ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DiarySection; 