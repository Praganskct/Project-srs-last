import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import ExamCreator from './components/ExamCreator';
import ExamResults from './components/ExamResults';
import ExamInterface from './components/ExamInterface';
import StudentExamList from './components/StudentExamList';
import TeacherDashboard from './components/TeacherDashboard';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import AttemptHistory from './components/AttemptHistory';
import AdminUsers from './components/AdminUsers';
import ExamDetails from './components/ExamDetails';
import NotFound from './components/NotFound';
import QuestionsAdmin from './components/QuestionsAdmin';
import ExamManagement from './components/ExamManagement';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <Router>
      <NavBar role={(localStorage.getItem('role') || 'STUDENT')} />
      <nav>
        <ul>
          <li><Link to="/teacher-dashboard">Teacher Dashboard</Link></li>
          <li><Link to="/create-exam">Create Exam</Link></li>
          <li><Link to="/student-exams">Student Exams</Link></li>
          <li><Link to="/admin/questions">Questions Admin</Link></li>
          <li><Link to="/admin/exam-management">Exam Management</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/create-exam" element={<ExamCreator />} />
        <Route path="/exam-results/:studentExamId" element={<ExamResults />} />
        <Route path="/exam/:studentExamId" element={<ExamInterface />} />
        <Route path="/student-exams" element={<StudentExamList />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<AttemptHistory />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/exam-details" element={<ExamDetails />} />
        <Route path="/admin/questions" element={<QuestionsAdmin />} />
        <Route path="/admin/exam-management" element={<ExamManagement />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
export default App;