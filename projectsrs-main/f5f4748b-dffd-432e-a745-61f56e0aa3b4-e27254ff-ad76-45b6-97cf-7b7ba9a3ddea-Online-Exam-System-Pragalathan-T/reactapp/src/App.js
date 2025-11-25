import React, { useState, useEffect, useMemo, createContext, useContext, Suspense } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Button, Box, IconButton } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import getTheme from './theme';
import ConfirmationDialog from './components/ConfirmationDialog';
import AuthService from './services/auth.service';
import { NotificationProvider, useNotifier } from './context/NotificationContext';
import FullScreenLoader from './components/FullScreenLoader';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components for better performance
const Login = React.lazy(() => import('./components/Login'));
const Signup = React.lazy(() => import('./components/Signup'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const ProtectedRoute = React.lazy(() => import('./components/ProtectedRoute'));
const AdminRoute = React.lazy(() => import('./components/AdminRoute'));
const AdminBoard = React.lazy(() => import('./components/AdminBoard'));
const ExamManagement = React.lazy(() => import('./components/ExamManagement'));
const QuestionManagement = React.lazy(() => import('./components/QuestionManagement'));
const ForgotPassword = React.lazy(() => import('./components/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./components/ResetPassword'));

const ColorModeContext = createContext({ toggleColorMode: () => {} });

const useColorMode = () => useContext(ColorModeContext);

const AppContent = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showNotification } = useNotifier();
  const colorMode = useColorMode();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    navigate('/login');
    setLogoutDialogOpen(false);
    showNotification('Logged out successfully', 'info');
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Online Exam System
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
            {localStorage.getItem('themeMode') === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          {currentUser ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 2 }}>
                {currentUser.username}
              </Typography>
              {currentUser.roles.includes("ROLE_ADMIN") && (
                <Button color="inherit" component={Link} to="/admin">
                  Admin Board
                </Button>
                <Button color="inherit" component={Link} to="/admin/exams">
                  Manage Exams
                </Button>
              )}
              <Button color="inherit" onClick={() => setLogoutDialogOpen(true)}>
                Logout
              </Button>
            </Box>
          ) : (
            <Box>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Suspense fallback={<FullScreenLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
            </Route>
            <Route path="/admin" element={<AdminRoute />}>
              <Route path="/admin" element={<AdminBoard />} />
              <Route path="/admin/exams" element={<ExamManagement />} />
              <Route path="/admin/exams/:examId/questions" element={<QuestionManagement />} />
            </Route>
          </Routes>
        </Suspense>
      </Container>
      <ConfirmationDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={logOut}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
      />
    </Box>
  );
}

function App() {
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('themeMode', newMode);
          return newMode;
        });
      },
    }),
    [],
  );

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <NotificationProvider>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
          </NotificationProvider>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
export default App;