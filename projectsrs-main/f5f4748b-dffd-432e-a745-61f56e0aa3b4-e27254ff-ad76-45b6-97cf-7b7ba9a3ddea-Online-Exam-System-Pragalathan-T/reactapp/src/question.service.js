import axios from 'axios';
import AuthService from './auth.service';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8080') + '/api/exams/';

const getAuthHeader = () => {
  const user = AuthService.getCurrentUser();
  if (user && user.accessToken) {
    return { Authorization: 'Bearer ' + user.accessToken };
  } else {
    return {};
  }
};

const getQuestionsForExam = (examId) => {
  return axios.get(API_URL + `${examId}/questions`, { headers: getAuthHeader() });
};

const QuestionService = {
  getQuestionsForExam,
};

export default QuestionService;