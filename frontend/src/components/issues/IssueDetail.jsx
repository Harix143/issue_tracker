// src/components/issues/IssueDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api';

const STATUS_OPTIONS = [
  { value: 'open',        label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed',      label: 'Closed' },
];

export default function IssueDetail() {
  const { projectId, issueId } = useParams();
  const nav                     = useNavigate();

  const [issue, setIssue]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [err, setErr]           = useState('');

  // Edit Issue state
  const [isEditing, setIsEditing]           = useState(false);
  const [editTitle, setEditTitle]           = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus]         = useState('open');

  // New Comment state
  const [newComment, setNewComment] = useState('');
  const [commentErr, setCommentErr] = useState('');

  // Load the issue and its comments
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`issues/${issueId}/`);
        setIssue(data);
        setEditTitle(data.title);
        setEditDescription(data.description);
        setEditStatus(data.status);
      } catch {
        nav('/login');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [issueId, nav]);

  // Save edited issue
  const handleSave = async e => {
    e.preventDefault();
    setErr('');
    try {
      await api.patch(`issues/${issueId}/`, {
        title: editTitle,
        description: editDescription,
        status: editStatus,
      });
      setIsEditing(false);
      const { data } = await api.get(`issues/${issueId}/`);
      setIssue(data);
    } catch {
      setErr('Failed to update issue');
    }
  };

  // Delete issue
  const handleDelete = async () => {
    if (!window.confirm('Delete this issue?')) return;
    try {
      await api.delete(`issues/${issueId}/`);
      nav(`/projects/${projectId}/issues`);
    } catch {
      alert('Failed to delete issue');
    }
  };

  // Post a new comment
  const handleComment = async e => {
    e.preventDefault();
    setCommentErr('');
    try {
      await api.post('comments/', { issue: issueId, content: newComment });
      setNewComment('');
      const { data } = await api.get(`issues/${issueId}/`);
      setIssue(data);
    } catch {
      setCommentErr('Failed to post comment');
    }
  };

  // Edit/Delete comment handlers
  const handleCommentEdit = async (id, content) => {
    const updated = window.prompt('Edit comment:', content);
    if (updated == null) return;
    try {
      await api.patch(`comments/${id}/`, { content: updated });
      const { data } = await api.get(`issues/${issueId}/`);
      setIssue(data);
    } catch {
      alert('Failed to update comment');
    }
  };

  const handleCommentDelete = async id => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`comments/${id}/`);
      const { data } = await api.get(`issues/${issueId}/`);
      setIssue(data);
    } catch {
      alert('Failed to delete comment');
    }
  };

  if (loading || !issue) {
    return <p className="container">Loading issue…</p>;
  }

  return (
    <div className="container">
      <div className="card">
        <p>
          ← <Link className="link" to={`/projects/${projectId}/issues`}>Back to Issues</Link>
        </p>

        {isEditing ? (
          <form onSubmit={handleSave}>
            <h3>Edit Issue</h3>
            {err && <div className="error">{err}</div>}
            <input
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              required
            />
            <textarea
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
            />
            <select
              value={editStatus}
              onChange={e => setEditStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button className="btn" type="submit" style={{ marginRight: '0.5rem' }}>
              Save
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <h2>
              {issue.title} <small>({issue.status})</small>
            </h2>
            <p>{issue.description}</p>
            <button className="btn" onClick={() => setIsEditing(true)}>
              Edit Issue
            </button>
            <button
              className="btn"
              style={{ backgroundColor: 'var(--error)', marginLeft: '0.5rem' }}
              onClick={handleDelete}
            >
              Delete Issue
            </button>
          </>
        )}
      </div>

      <div className="card">
        <h3>Comments</h3>
        {issue.comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {issue.comments.map(c => (
              <li key={c.id} style={{ marginBottom: '1rem' }}>
                <strong>{c.created_by.username}</strong>
                <p>{c.content}</p>
                <small>{new Date(c.created_at).toLocaleString()}</small>
                <br />
                <button
                  className="btn"
                  style={{ fontSize: '0.8rem', marginRight: '0.5rem' }}
                  onClick={() => handleCommentEdit(c.id, c.content)}
                >
                  Edit
                </button>
                <button
                  className="btn"
                  style={{
                    backgroundColor: 'var(--error)',
                    fontSize: '0.8rem',
                  }}
                  onClick={() => handleCommentDelete(c.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleComment}>
          {commentErr && <div className="error">{commentErr}</div>}
          <textarea
            placeholder="Write your comment…"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            required
          />
          <button className="btn" type="submit">
            Add Comment
          </button>
        </form>
      </div>
    </div>
  );
}
