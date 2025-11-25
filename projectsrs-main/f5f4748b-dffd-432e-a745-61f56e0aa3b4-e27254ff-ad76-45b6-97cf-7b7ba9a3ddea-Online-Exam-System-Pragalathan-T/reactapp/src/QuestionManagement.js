import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExamService from '../services/exam.service';
import QuestionService from '../services/question.service';
import { useNotifier } from '../context/NotificationContext';

const QuestionManagement = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const { showNotification } = useNotifier();

  useEffect(() => {
    ExamService.getExamById(examId)
      .then(response => setExam(response.data))
      .catch(() => showNotification('Failed to load exam details', 'error'));

    QuestionService.getQuestionsForExam(examId)
      .then(response => setQuestions(response.data))
      .catch(() => showNotification('Failed to load questions', 'error'));
  }, [examId, showNotification]);

  return (
    <Paper sx={{ p: 3 }}>
      <Button component={RouterLink} to="/admin/exams" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to Exams
      </Button>
      {exam && (
        <Box mb={3}>
          <Typography variant="h4" gutterBottom>{exam.title}</Typography>
          <Typography variant="body1" color="text.secondary">{exam.description}</Typography>
        </Box>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Typography variant="h5">Questions</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Question
        </Button>
      </Box>
      <List>
        {questions.map((question, index) => (
          <React.Fragment key={question.id}>
            <ListItem
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="edit"><EditIcon /></IconButton>
                  <IconButton edge="end" aria-label="delete"><DeleteIcon /></IconButton>
                </>
              }
            >
              <ListItemText primary={`${index + 1}. ${question.questionText}`} secondary={`Correct Answer: ${question.correctAnswer}`} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default QuestionManagement;