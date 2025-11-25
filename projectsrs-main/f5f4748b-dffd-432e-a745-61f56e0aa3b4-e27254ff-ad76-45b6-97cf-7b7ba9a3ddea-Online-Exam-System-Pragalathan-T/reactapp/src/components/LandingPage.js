import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Online Exam System</h1>
      <p style={{ marginBottom: 16, color: '#6b7280' }}>Manage exams, attempt tests, and track results.</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}