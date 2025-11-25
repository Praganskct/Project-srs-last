import axios from "axios";

const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:8080") + "/api/auth/";

const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

const login = (username, password, rememberMe) => {
  return axios
    .post(API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
  sessionStorage.removeItem("user");
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

const forgotPassword = (email) => {
  return axios.post(API_URL + "forgot-password", null, { params: { email } });
};

const resetPassword = (token, password) => {
  return axios.post(API_URL + "reset-password", null, { params: { token, password } });
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
};

export default AuthService;