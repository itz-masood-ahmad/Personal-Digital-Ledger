import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import Auth from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Accounts from './pages/Accounts.jsx';
import Budgets from './pages/Budgets.jsx';
import Investments from './pages/Investments.jsx';
import Debts from './pages/Debts.jsx';
import Credits from './pages/Credits.jsx';
import Profile from './pages/Profile.jsx';
import Home from './pages/Home.jsx'; 
import ResetPassword from './pages/ResetPassword.jsx';
import DebtLoansMaster from './pages/DebtLoansMaster.jsx';
import Lent from './pages/Lent.jsx';

const ProtectedLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-300 flex">
      <Sidebar isOpen={sidebarOpen} />
      <main className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/investments" element={<Investments />} />
            
            {/* Debt Routing */}
            <Route path="/debts" element={<DebtLoansMaster />} />
            <Route path="/debts/borrowed" element={<Debts />} />
            <Route path="/debts/lent" element={<Lent />} />
            
            <Route path="/credits" element={<Credits />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const AuthWrapper = () => {
    const { user } = useAuth();
    return user ? <Navigate to="/dashboard" replace /> : <Auth />;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<AuthWrapper />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/*" element={<ProtectedLayout />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}