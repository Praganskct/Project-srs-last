import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Login.css';

export default function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const onSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		try {
			const res = await api.login({ username, password });
			localStorage.setItem('token', res.data.token || 'dummy-token');
			localStorage.setItem('username', res.data.username || username);
			const role = res.data.role || 'STUDENT';
			localStorage.setItem('role', role);
			const dest = role === 'ADMIN' ? '/admin/exam-management' : role === 'TEACHER' ? '/teacher-dashboard' : '/student-exams';
			navigate(dest);
		} catch (err) {
			setError('Invalid credentials');
		}
	};

	return (
		<div className="auth">
			<h2>Login</h2>
			<form onSubmit={onSubmit} className="auth__form">
				<input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
				<input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<button type="submit">Login</button>
			</form>
			{error && <p className="auth__error">{error}</p>}
		</div>
	);
}
