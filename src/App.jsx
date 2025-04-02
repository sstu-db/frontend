import { useState } from "react";
import {
  Container,
  Box,
  Tabs,
  Tab,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";
import TrainerClientSection from "./components/TrainerClientSection";
import TrainingSection from "./components/TrainingSection";
import ExercisesSection from "./components/ExercisesSection";
import HealthMetricsSection from "./components/HealthMetricsSection";
import DiarySection from "./components/DiarySection";

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ width: "100%" }}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Фитнес-приложение
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl">
        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Тренеры и клиенты" />
            <Tab label="Тренировки" />
            <Tab label="Упражнения" />
            <Tab label="Метрики здоровья" />
            <Tab label="Дневники" />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <TrainerClientSection />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <TrainingSection />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <ExercisesSection />
        </TabPanel>
        <TabPanel value={activeTab} index={3}>
          <HealthMetricsSection />
        </TabPanel>
        <TabPanel value={activeTab} index={4}>
          <DiarySection />
        </TabPanel>
      </Container>
    </Box>
  );
}

export default App;
