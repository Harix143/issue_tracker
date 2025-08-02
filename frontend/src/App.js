import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login        from './components/auth/Login';
import Signup       from './components/auth/Signup';
import ProjectList  from './components/projects/ProjectList';
import IssueList    from './components/issues/IssueList';
import IssueDetail  from './components/issues/IssueDetail';

function App() {
  const isAuth = !!localStorage.getItem('accessToken');

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuth ? <Navigate to="/projects" /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuth ? <Navigate to="/projects" /> : <Signup />}
      />
      <Route
        path="/projects"
        element={isAuth ? <ProjectList /> : <Navigate to="/login" />}
      />

      {/* Issue Detail must come before Issue List */}
      <Route
        path="/projects/:projectId/issues/:issueId"
        element={isAuth ? <IssueDetail /> : <Navigate to="/login" />}
      />
      <Route
        path="/projects/:projectId/issues"
        element={isAuth ? <IssueList /> : <Navigate to="/login" />}
      />

      <Route
        path="*"
        element={<Navigate to={isAuth ? "/projects" : "/login"} />}
      />
    </Routes>
  );
}

export default App;
