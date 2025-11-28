import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Wallet, PieChart, TrendingUp, CreditCard, LogOut, Moon, Sun, User, ArrowDownLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const Sidebar = ({ isOpen }) => {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [debtMenuOpen, setDebtMenuOpen] = useState(true);

  // Helper to check active path
  const isActive = (path) => location.pathname === path;
  const isDebtActive = location.pathname.startsWith('/debts');

  // FIX: Handle Logout and Redirect
  const handleLogout = () => {
    logout();      // 1. Clear the user session
    navigate('/'); // 2. Force redirect to Home Page
  };

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} fixed h-screen bg-white dark:bg-zinc-950 border-r border-gray-100 dark:border-zinc-800 transition-all duration-300 flex flex-col z-20 shadow-lg overflow-y-auto custom-scrollbar`}>
      <div className="p-6 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-purple-600 flex items-center justify-center text-white font-bold text-xl">L</div>
        {isOpen && <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">Ledger</span>}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        <NavItem icon={Home} label="Dashboard" active={isActive('/') || isActive('/dashboard')} onClick={() => navigate('/')} isOpen={isOpen} />
        <NavItem icon={Wallet} label="Accounts" active={isActive('/accounts')} onClick={() => navigate('/accounts')} isOpen={isOpen} />
        <NavItem icon={ArrowDownLeft} label="Credits/Income" active={isActive('/credits')} onClick={() => navigate('/credits')} isOpen={isOpen} />
        <NavItem icon={PieChart} label="Budgets" active={isActive('/budgets')} onClick={() => navigate('/budgets')} isOpen={isOpen} />
        <NavItem icon={TrendingUp} label="Investments" active={isActive('/investments')} onClick={() => navigate('/investments')} isOpen={isOpen} />

        {/* Debts & Loans Section */}
        <div>
          <button
            onClick={() => isOpen ? setDebtMenuOpen(!debtMenuOpen) : navigate('/debts')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900 ${isDebtActive ? 'text-blue-600 dark:text-purple-400 font-medium bg-blue-50 dark:bg-zinc-900' : ''}`}
          >
            <div className="flex items-center gap-3">
              <CreditCard size={20} />
              {isOpen && <span>Debts & Loans</span>}
            </div>
            {isOpen && (debtMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
          </button>
          
          {isOpen && debtMenuOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 dark:border-zinc-800 pl-2">
              <button 
                onClick={() => navigate('/debts')}
                className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${isActive('/debts') ? 'text-blue-600 dark:text-purple-400 bg-blue-50/50 dark:bg-zinc-800/50' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => navigate('/debts/borrowed')}
                className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${isActive('/debts/borrowed') ? 'text-red-600 bg-red-50/50 dark:bg-red-900/10' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
              >
                Borrowed (Owe)
              </button>
              <button 
                onClick={() => navigate('/debts/lent')}
                className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${isActive('/debts/lent') ? 'text-green-600 bg-green-50/50 dark:bg-green-900/10' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
              >
                Lent (Given)
              </button>
            </div>
          )}
        </div>

        <NavItem icon={User} label="Profile" active={isActive('/profile')} onClick={() => navigate('/profile')} isOpen={isOpen} />
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-zinc-800 space-y-2 shrink-0">
        <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          {isOpen && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        
        {/* FIX: Call handleLogout instead of just logout */}
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
          <LogOut size={20} />
          {isOpen && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

const NavItem = ({ icon: Icon, label, active, onClick, isOpen }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-blue-50 dark:bg-purple-900/20 text-blue-600 dark:text-purple-400 font-bold' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900'}`}>
    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    {isOpen && <span>{label}</span>}
  </button>
);

export default Sidebar;