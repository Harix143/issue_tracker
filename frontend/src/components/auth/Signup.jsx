// src/components/auth/Signup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr]           = useState('');
  const nav                    = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setErr('');
    try {
      await api.post('auth/signup/', { username, email, password });
      nav('/login');
    } catch {
      setErr('Failed to register');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 400, margin: 'auto' }}>
        <h2>Sign Up</h2>
        {err && <div className="error">{err}</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn" type="submit" style={{ marginTop: '1rem' }}>
            Sign Up
          </button>
        </form>

        <p style={{ marginTop: '1rem' }}>
          Already have an account?{' '}
          <Link className="link" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
