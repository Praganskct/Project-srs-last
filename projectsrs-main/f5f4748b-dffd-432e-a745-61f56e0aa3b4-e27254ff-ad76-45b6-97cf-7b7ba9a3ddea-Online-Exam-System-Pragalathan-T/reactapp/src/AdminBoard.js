import React, { useState, useEffect } from 'react';
import { Typography, Paper } from '@mui/material';
import axios from 'axios';
import AuthService from '../services/auth.service';

const API_URL = "http://localhost:8080/api/test/";

const AdminBoard = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    const headers = { Authorization: `Bearer ${user.accessToken}` };

    axios.get(API_URL + 'admin', { headers: headers }).then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) || error.message || error.toString();
        setContent(_content);
      }
    );
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4">{content}</Typography>
    </Paper>
  );
};

export default AdminBoard;