import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    userType: 'client', // 'client' or 'trainer'
    // Client specific fields
    preparationLevel: '',
    trainingGoals: [],
    trainingTypes: [],
    // Trainer specific fields
    specialties: [],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (formData.userType === 'client') {
        const clientData = {
          почта: formData.email,
          хэш_пароля: formData.password,
          имя: formData.firstName,
          фамилия: formData.lastName,
          отчество: formData.middleName,
          дата_рождения: formData.birthDate,
          уровень_подготовки_id: parseInt(formData.preparationLevel),
          training_goals: formData.trainingGoals.map(Number),
          training_types: formData.trainingTypes.map(Number),
        };
        await authService.registerClient(clientData);
      } else {
        const trainerData = {
          почта: formData.email,
          хэш_пароля: formData.password,
          имя: formData.firstName,
          фамилия: formData.lastName,
          отчество: formData.middleName,
          дата_рождения: formData.birthDate,
          specialties: formData.specialties.map(Number),
        };
        await authService.registerTrainer(trainerData);
      }
      navigate('/login');
    } catch (error) {
      if (error.response?.data?.detail) {
        // Handle validation errors
        if (Array.isArray(error.response.data.detail)) {
          setError(error.response.data.detail.map(err => err.msg).join(', '));
        } else {
          setError(error.response.data.detail);
        }
      } else {
        setError('Ошибка при регистрации');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 600,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Регистрация
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Тип пользователя</InputLabel>
            <Select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              label="Тип пользователя"
            >
              <MenuItem value="client">Клиент</MenuItem>
              <MenuItem value="trainer">Тренер</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Пароль"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Имя"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Фамилия"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Отчество"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Дата рождения"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />

          {formData.userType === 'client' && (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Уровень подготовки</InputLabel>
                <Select
                  name="preparationLevel"
                  value={formData.preparationLevel}
                  onChange={handleChange}
                  label="Уровень подготовки"
                  required
                >
                  <MenuItem value={1}>Начинающий</MenuItem>
                  <MenuItem value={2}>Средний</MenuItem>
                  <MenuItem value={3}>Продвинутый</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Цели тренировок</InputLabel>
                <Select
                  multiple
                  name="trainingGoals"
                  value={formData.trainingGoals}
                  onChange={handleMultiSelectChange}
                  input={<OutlinedInput label="Цели тренировок" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value={1}>Похудение</MenuItem>
                  <MenuItem value={2}>Набор мышечной массы</MenuItem>
                  <MenuItem value={3}>Выносливость</MenuItem>
                  <MenuItem value={4}>Гибкость</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Типы тренировок</InputLabel>
                <Select
                  multiple
                  name="trainingTypes"
                  value={formData.trainingTypes}
                  onChange={handleMultiSelectChange}
                  input={<OutlinedInput label="Типы тренировок" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value={1}>Силовые</MenuItem>
                  <MenuItem value={2}>Кардио</MenuItem>
                  <MenuItem value={3}>Йога</MenuItem>
                  <MenuItem value={4}>Пилатес</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          {formData.userType === 'trainer' && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Специализации</InputLabel>
              <Select
                multiple
                name="specialties"
                value={formData.specialties}
                onChange={handleMultiSelectChange}
                input={<OutlinedInput label="Специализации" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value={1}>Фитнес-тренер</MenuItem>
                <MenuItem value={2}>Йога-инструктор</MenuItem>
                <MenuItem value={3}>Тренер по плаванию</MenuItem>
                <MenuItem value={4}>Тренер по боевым искусствам</MenuItem>
              </Select>
            </FormControl>
          )}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/login')}
            >
              Уже есть аккаунт? Войти
            </Link>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterForm; 