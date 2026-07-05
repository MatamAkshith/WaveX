import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import CompanyProfile from './pages/CompanyProfile';
import FounderProfile from './pages/FounderProfile';
import Documents from './pages/Documents';
import AskDecision from './pages/AskDecision';
import DecisionHistory from './pages/DecisionHistory';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Dashboard layout wrapping all workspace paths */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/company" element={<CompanyProfile />} />
          <Route path="/founder" element={<FounderProfile />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/decision" element={<AskDecision />} />
          <Route path="/history" element={<DecisionHistory />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
