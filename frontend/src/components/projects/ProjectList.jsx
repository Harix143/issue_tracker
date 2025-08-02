// src/components/projects/ProjectList.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';

export default function ProjectList() {
  const [projects, setProjects]       = useState([]);
  const [name, setName]               = useState('');
  const [description, setDescription] = useState('');
  const [err, setErr]                 = useState('');
  const nav                           = useNavigate();

  useEffect(() => {
    api.get('projects/')
       .then(res => setProjects(res.data))
       .catch(() => { localStorage.clear(); nav('/login'); });
  }, [nav]);

  const handleCreate = async e => {
    e.preventDefault();
    setErr('');
    try {
      await api.post('projects/', { name, description });
      setName(''); setDescription('');
      const { data } = await api.get('projects/');
      setProjects(data);
    } catch {
      setErr('Failed to create project');
    }
  };

  return (
    <div className="container">
      <h2>Your Projects</h2>

      <div className="card">
        <h3>Create a New Project</h3>
        {err && <div className="error">{err}</div>}

        <form onSubmit={handleCreate}>
          <input
            className=""
            placeholder="Project Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <button className="btn" type="submit">Create Project</button>
        </form>
      </div>

      <div className="card">
        {projects.length === 0 ? (
          <p>No projects yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {projects.map(p => (
              <li key={p.id} style={{ marginBottom: '1rem' }}>
                <h3>
                  <Link className="link" to={`/projects/${p.id}/issues`}>
                    {p.name}
                  </Link>
                </h3>
                <p>{p.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
