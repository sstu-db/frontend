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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const API_URL = 'http://localhost:8000';

const DiarySection = () => {
  const [userId, setUserId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [diaries, setDiaries] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [diaryForm, setDiaryForm] = useState({
    запись: '',
    дата: new Date().toISOString().split('T')[0],
    feelings: [],
    feeling_reasons: [],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [feelings, setFeelings] = useState([]);
  const [feelingReasons, setFeelingReasons] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDiaries = async () => {
    try {
      console.log('Fetching diaries for user:', userId);
      let url = `http://localhost:8000/diaries?user_id=${userId}`;
      
      if (startDate) {
        url += `&start_date=${startDate}`;
      }
      if (endDate) {
        url += `&end_date=${endDate}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      console.log('Diaries API Response:', data);
      
      if (data.data && Array.isArray(data.data)) {
        setDiaries(data.data);
      } else {
        setDiaries([]);
      }
    } catch (error) {
      console.error('Error fetching diaries:', error);
      setDiaries([]);
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

  const handleOpenDialog = (diary = null) => {
    if (diary) {
      setSelectedDiary(diary);
      setDiaryForm({
        запись: diary.запись || '',
        дата: diary.дата || new Date().toISOString().split('T')[0],
        feelings: diary.feelings?.map(f => f.id) || [],
        feeling_reasons: diary.feeling_reasons?.map(r => r.id) || [],
      });
    } else {
      setSelectedDiary(null);
      setDiaryForm({
        запись: '',
        дата: new Date().toISOString().split('T')[0],
        feelings: [],
        feeling_reasons: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDiary(null);
    setDiaryForm({
      запись: '',
      дата: new Date().toISOString().split('T')[0],
      feelings: [],
      feeling_reasons: [],
    });
    setError('');
  };

  const handleSubmit = async () => {
    try {
      setError('');
      const url = selectedDiary 
        ? `${API_URL}/diaries/${selectedDiary.id}`
        : `${API_URL}/diaries`;
      
      const method = selectedDiary ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...diaryForm,
          пользователь_id: parseInt(userId),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save diary');
      }

      setSuccess(selectedDiary ? 'Дневник обновлен' : 'Дневник создан');
      handleCloseDialog();
      fetchDiaries();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (diaryId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот дневник?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/diaries/${diaryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete diary');
      }

      setSuccess('Дневник удален');
      fetchDiaries();
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchFeelingsAndReasons = async () => {
      try {
        setLoading(true);
        const [feelingsResponse, reasonsResponse] = await Promise.all([
          fetch(`${API_URL}/feelings`),
          fetch(`${API_URL}/feeling-reasons`)
        ]);

        if (!feelingsResponse.ok || !reasonsResponse.ok) {
          throw new Error('Failed to fetch feelings or reasons');
        }

        const feelingsData = await feelingsResponse.json();
        const reasonsData = await reasonsResponse.json();

        setFeelings(feelingsData);
        setFeelingReasons(reasonsData);
      } catch (error) {
        console.error('Error fetching feelings and reasons:', error);
        setError('Не удалось загрузить список чувств и причин');
      } finally {
        setLoading(false);
      }
    };

    fetchFeelingsAndReasons();
  }, []);

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
                  disabled={!userId}
                >
                  Новый дневник
                </Button>
              </Box>
              <Grid container spacing={2}>
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
              <Button variant="contained" onClick={fetchDiaries} sx={{ mt: 2 }}>
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
                {diaries && diaries.length > 0 ? (
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
                          primary={formatDate(diary.дата)}
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedDiary ? 'Редактировать дневник' : 'Новый дневник'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              label="Дата"
              type="date"
              value={diaryForm.дата}
              onChange={(e) => setDiaryForm({ ...diaryForm, дата: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Запись"
              multiline
              rows={4}
              value={diaryForm.запись}
              onChange={(e) => setDiaryForm({ ...diaryForm, запись: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Чувства</InputLabel>
              <Select
                multiple
                value={diaryForm.feelings}
                onChange={(e) => setDiaryForm({ ...diaryForm, feelings: e.target.value })}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const feeling = feelings.find(f => f.id === value);
                      return <Chip key={value} label={feeling?.название || value} />;
                    })}
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
                value={diaryForm.feeling_reasons}
                onChange={(e) => setDiaryForm({ ...diaryForm, feeling_reasons: e.target.value })}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const reason = feelingReasons.find(r => r.id === value);
                      return <Chip key={value} label={reason?.название || value} />;
                    })}
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