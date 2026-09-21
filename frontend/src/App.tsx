import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext, AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FoodLogs from './pages/FoodLogs';
import ActivityLogs from './pages/ActivityLogs';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import AICoach from './pages/AICoach';

function AppRoutes() {
  const { user, isUserFetched, onboardingCompleted } = useContext(AppContext);

  if (!isUserFetched) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      ) : !onboardingCompleted ? (
        <>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="*" element={<Navigate to="/onboarding" />} />
        </>
      ) : (
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/coach" element={<AICoach />} />
          <Route path="/food" element={<FoodLogs />} />
          <Route path="/activity" element={<ActivityLogs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      )}
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
