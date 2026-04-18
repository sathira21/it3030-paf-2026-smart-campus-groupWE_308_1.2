import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AuthSuccess from './pages/AuthSuccess';

// Optional: You can still keep these if you want to use them as sub-pages later
import TicketDashboard from './components/TicketDashboard';
import IncidentTicketForm from './components/IncidentTicketForm';
import TicketDetailView from './components/TicketDetailView';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-transparent">
        <Routes>
          {/* Main Auth & Dashboards */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<StudentDashboard />} />

          {/* Legacy/Component Routes - currently keeping for backward compatibility if needed */}
          <Route path="/tickets-legacy" element={<TicketDashboard />} />
          <Route path="/submit" element={<IncidentTicketForm />} />
          <Route path="/ticket/:id" element={<TicketDetailView />} />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
