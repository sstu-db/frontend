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
  Chip,
  Link,
} from '@mui/material';

const DiarySection = () => {
  const [userId, setUserId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [diaries, setDiaries] = useState([]);

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
      
      if (data.diaries && Array.isArray(data.diaries)) {
        setDiaries(data.diaries);
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

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Поиск дневников
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
              <Button variant="contained" onClick={fetchDiaries}>
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
                    <ListItem key={index}>
                      <Box sx={{ width: '100%' }}>
                        <ListItemText 
                          primary={formatDate(diary.дата)}
                          secondary={
                            <>
                              <Typography component="span" variant="body2">
                                {diary.запись || ''}
                              </Typography>
                              {diary.файл && (
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="body2" color="primary">
                                    <Link 
                                      href={`http://localhost:8000/files/${diary.файл.id}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {diary.файл.имя_файла}
                                    </Link>
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                                    {(diary.файл.типы_файлов || []).map((type, tIndex) => (
                                      <Chip
                                        key={tIndex}
                                        label={type}
                                        size="small"
                                        color="info"
                                        variant="outlined"
                                      />
                                    ))}
                                  </Box>
                                </Box>
                              )}
                              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {(diary.чувства || []).map((feeling, fIndex) => (
                                  <Chip
                                    key={fIndex}
                                    label={feeling}
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
                                  {(diary.причины_чувств || []).map((reason, rIndex) => (
                                    <Chip
                                      key={rIndex}
                                      label={reason}
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
    </Box>
  );
};

export default DiarySection; 