import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navigation from './components/Navigation';
import TrainingSection from './components/TrainingSection';
import ExercisesSection from './components/ExercisesSection';
import HealthMetricsSection from './components/HealthMetricsSection';
import DiarySection from './components/DiarySection';
import TrainersAndClients from './pages/TrainersAndClients';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const ProtectedLayout = ({ children }) => (
  <Box>
    <Navigation />
    <Box sx={{ p: 3 }}>
      {children}
    </Box>
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />

            {/* Root route - redirect to trainers-clients if authenticated, otherwise to login */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/trainers-clients" replace />
                </ProtectedRoute>
              }
            />

            {/* Protected routes */}
            <Route
              path="/trainers-clients"
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <TrainersAndClients />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/training"
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <TrainingSection />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/exercises"
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <ExercisesSection />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/health"
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <HealthMetricsSection />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/diary"
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <DiarySection />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            {/* Redirect to login if no route matches */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
