import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../apiClient';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const { data } = await apiClient.post('/auth/login', form);
      login(data.user, data.token);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <span className="eyebrow">Welcome Back</span>
        <h1>Sign in to your account</h1>
        <p>Managing your blog is now simple, clear, and professional.</p>
        {error && <div className="alert-error">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button className="button button-primary" type="submit">Sign In</button>
        </form>
        <p>Don't have an account? <Link to="/register">Create a profile</Link></p>
      </div>
    </section>
  );
}
