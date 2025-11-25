import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './NavBar.css';

export default function NavBar({ role = 'STUDENT' }) {
  const navigate = useNavigate();
  const logout = async () => {
    try { await api.logout(); } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <nav className="nav">
      <div className="nav__brand">Online Exam</div>
      <ul className="nav__links">
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/help">Help/FAQ</Link></li>
        {role === 'TEACHER' && (
          <>
            <li><Link to="/teacher-dashboard">Dashboard</Link></li>
            <li><Link to="/create-exam">Create Exam</Link></li>
          </>
        )}
        {role === 'STUDENT' && (
          <>
            <li><Link to="/student-exams">Exams</Link></li>
            <li><Link to="/history">History</Link></li>
          </>
        )}
        {role === 'ADMIN' && (
          <>
            <li><Link to="/admin/users">Users</Link></li>
            <li><Link to="/admin/questions">Questions</Link></li>
            <li><Link to="/admin/exam-management">Exam Management</Link></li>
          </>
        )}
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><button className="nav__logout" onClick={logout}>Logout</button></li>
      </ul>
    </nav>
  );
}