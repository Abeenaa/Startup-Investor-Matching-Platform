import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import LoginPage               from './pages/LoginPage'
import RegisterPage            from './pages/RegisterPage'

// Startup
import CompleteStartupProfile  from './pages/startup/CompleteStartupProfile'
import StartupDashboard        from './pages/startup/StartupDashboard'
import StartupProfile          from './pages/startup/StartupProfile'
import StartupPrograms         from './pages/startup/StartupPrograms'
import StartupApplications     from './pages/startup/StartupApplications'
import StartupInvestors        from './pages/startup/StartupInvestors'
import StartupResources        from './pages/startup/StartupResources'

// Investor
import InvestorDashboard       from './pages/investor/InvestorDashboard'
import CompleteInvestorProfile from './pages/investor/CompleteInvestorProfile'
import InvestorProfile         from './pages/investor/InvestorProfile'
import StartupDirectory        from './pages/investor/StartupDirectory'
import SavedStartups           from './pages/investor/SavedStartups'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Startup — profile completion (needs token but no full auth check) */}
        <Route path="/startup/complete-profile"  element={<CompleteStartupProfile />} />

        {/* Startup — protected */}
        <Route path="/startup/dashboard"     element={<ProtectedRoute role="STARTUP"><StartupDashboard /></ProtectedRoute>} />
        <Route path="/startup/profile"       element={<ProtectedRoute role="STARTUP"><StartupProfile /></ProtectedRoute>} />
        <Route path="/startup/programs"      element={<ProtectedRoute role="STARTUP"><StartupPrograms /></ProtectedRoute>} />
        <Route path="/startup/applications"  element={<ProtectedRoute role="STARTUP"><StartupApplications /></ProtectedRoute>} />
        <Route path="/startup/investors"     element={<ProtectedRoute role="STARTUP"><StartupInvestors /></ProtectedRoute>} />
        <Route path="/startup/resources"     element={<ProtectedRoute role="STARTUP"><StartupResources /></ProtectedRoute>} />

        {/* Investor — profile completion */}
        <Route path="/investor/complete-profile" element={<CompleteInvestorProfile />} />

        {/* Investor — protected */}
        <Route path="/investor/dashboard"  element={<ProtectedRoute role="INVESTOR"><InvestorDashboard /></ProtectedRoute>} />
        <Route path="/investor/profile"    element={<ProtectedRoute role="INVESTOR"><InvestorProfile /></ProtectedRoute>} />
        <Route path="/investor/directory"  element={<ProtectedRoute role="INVESTOR"><StartupDirectory /></ProtectedRoute>} />
        <Route path="/investor/saved"      element={<ProtectedRoute role="INVESTOR"><SavedStartups /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}
