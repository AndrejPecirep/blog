import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../apiClient';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const { data } = await apiClient.post('/auth/register', form);
      login(data.user, data.token);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <span className="eyebrow">Launch Your Blog</span>
        <h1>Create an account</h1>
        <p>Professional onboarding with automatic sign-in after registration.</p>
        {error && <div className="alert-error">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button className="button button-primary" type="submit">Register</button>
        </form>
        <p>Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </section>
  );
}
