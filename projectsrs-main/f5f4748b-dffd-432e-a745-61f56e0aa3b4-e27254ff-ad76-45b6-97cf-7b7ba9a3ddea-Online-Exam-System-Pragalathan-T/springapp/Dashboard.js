import React, { useState, useEffect } from 'react';
import { Typography, Paper, Grid, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AuthService from '../services/auth.service';

// Mock Data for Charts
const monthlySignups = [
  { name: 'Jan', users: 40 },
  { name: 'Feb', users: 30 },
  { name: 'Mar', users: 50 },
  { name: 'Apr', users: 45 },
  { name: 'May', users: 60 },
  { name: 'Jun', users: 75 },
];

const roleDistribution = [
  { name: 'Users', value: 400 },
  { name: 'Admins', value: 35 },
];

const COLORS = ['#0088FE', '#FF8042'];

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {currentUser ? currentUser.username : 'User'}!
      </Typography>
      <Grid container spacing={3}>
        {/* Stat Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Total Users
            </Typography>
            <Typography component="p" variant="h4">
              435
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              +20% from last month
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Active Exams
            </Typography>
            <Typography component="p" variant="h4">
              24
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              Live and available
            </Typography>
          </Paper>
        </Grid>
        {/* Add more stat cards as needed */}

        {/* User Signups Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Monthly Sign-ups
            </Typography>
            <ResponsiveContainer>
              <LineChart data={monthlySignups}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Role Distribution Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              User Roles
            </Typography>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;