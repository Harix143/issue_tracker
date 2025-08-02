// src/components/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr]           = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setErr('');
    try {
      const { data } = await api.post('auth/login/', { username, password });
      // store tokens
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);

      // This will flip isAuth → true and push to /projects
      navigate('/projects', { replace: true });
    } catch {
      setErr('Invalid credentials');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 400, margin: 'auto' }}>
        <h2>Login</h2>
        {err && <div className="error">{err}</div>}

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button className="btn" type="submit" style={{ marginTop: '1rem' }}>
            Login
          </button>
        </form>

        <p style={{ marginTop: '1rem' }}>
          Don’t have an account?{' '}
          <Link className="link" to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
