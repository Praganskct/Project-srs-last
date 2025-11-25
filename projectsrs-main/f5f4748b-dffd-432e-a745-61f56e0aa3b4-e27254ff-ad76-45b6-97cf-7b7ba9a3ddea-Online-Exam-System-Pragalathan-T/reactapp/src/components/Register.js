import React, { useState } from 'react';
import api from '../utils/api';
import './Register.css';

export default function Register() {
	const [form, setForm] = useState({ name: '', email: '', username: '', password: '', role: 'STUDENT' });
	const [msg, setMsg] = useState(null);
	const [err, setErr] = useState(null);

	const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
	const onSubmit = async (e) => {
		e.preventDefault();
		setErr(null); setMsg(null);
		try {
			await api.register(form);
			setMsg('Registered successfully');
		} catch (e2) {
			setErr('Registration failed');
		}
	};

	return (
		<div className="auth">
			<h2>Register</h2>
			<form onSubmit={onSubmit} className="auth__form">
				<input name="name" placeholder="Name" value={form.name} onChange={onChange} />
				<input name="email" placeholder="Email" value={form.email} onChange={onChange} />
				<input name="username" placeholder="Username" value={form.username} onChange={onChange} />
				<input name="password" placeholder="Password" type="password" value={form.password} onChange={onChange} />
				<select name="role" value={form.role} onChange={onChange}>
					<option>STUDENT</option>
					<option>TEACHER</option>
					<option>ADMIN</option>
				</select>
				<button type="submit">Register</button>
			</form>
			{msg && <p className="auth__success">{msg}</p>}
			{err && <p className="auth__error">{err}</p>}
		</div>
	);
}
