import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import CreateJob from './pages/CreateJob';
import JobDetail from './pages/JobDetail';
import ApplicantDetail from './pages/ApplicantDetail';
import Candidates from './pages/Candidates';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex h-screen bg-slate-50">
          <Sidebar />
          <main className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/create" element={<CreateJob />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/jobs/:jobId/applicants/:applicantId" element={<ApplicantDetail />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;