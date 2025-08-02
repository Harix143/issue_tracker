// src/components/issues/IssueList.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../api';

export default function IssueList() {
  const { projectId } = useParams();
  const nav           = useNavigate();

  const [issues, setIssues]           = useState([]);
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [err, setErr]                 = useState('');

  useEffect(() => {
    api.get(`issues/?project=${projectId}`)
       .then(res => setIssues(res.data))
       .catch(() => nav('/login'));
  }, [projectId, nav]);

  const handleCreate = async e => {
    e.preventDefault(); setErr('');
    try {
      await api.post('issues/', { title, description, project: projectId });
      setTitle(''); setDescription('');
      const { data } = await api.get(`issues/?project=${projectId}`);
      setIssues(data);
    } catch {
      setErr('Failed to create issue');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <p>
          ← <Link className="link" to="/projects">Back to Projects</Link>
        </p>
        <h2>Issues for Project #{projectId}</h2>

        <h3>Create New Issue</h3>
        {err && <div className="error">{err}</div>}
        <form onSubmit={handleCreate}>
          <input
            placeholder="Issue Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <button className="btn" type="submit">Create Issue</button>
        </form>
      </div>

      <div className="card">
        {issues.length === 0 ? (
          <p>No issues yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {issues.map(i => (
              <li key={i.id} style={{ marginBottom: '1rem' }}>
                <h3>
                  <Link
                    className="link"
                    to={`/projects/${projectId}/issues/${i.id}`}
                  >
                    {i.title}
                  </Link> — {i.status}
                </h3>
                <p>{i.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
