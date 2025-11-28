import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import Button from '../components/Button.jsx';
import { ShieldCheck, TrendingUp, PieChart, Wallet, LogOut, LayoutDashboard, Moon, Sun } from 'lucide-react'; // 2. Import Icons

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Automatic Logout Logic
  useEffect(() => {
    if (user) {
      logout();
    }
  }, [user, logout]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">L</div>
          <span className="text-2xl font-bold tracking-tight">Ledger</span>
        </div>
        
        <div className="flex gap-4 items-center">
          <button 
            onClick={toggleTheme} 
            className="p-2 mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300 transition-colors"
            title="Toggle Theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <>
                <div className="hidden md:block text-sm font-medium text-gray-600 dark:text-gray-300">
                    Hello, {user.firstName}
                </div>
                <button 
                    onClick={logout} 
                    className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors flex items-center gap-2"
                >
                    <LogOut size={16} />
                    Sign Out
                </button>
                <Button onClick={() => navigate('/dashboard')}>
                    Dashboard
                </Button>
            </>
          ) : (
            // --- GUEST VIEW ---
            <>
                <button 
                    onClick={() => navigate('/sign-in')} 
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    Sign In
                </button>
                <Button onClick={() => navigate('/sign-in')}>Get Started</Button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-2">
          Master Your Money.
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Track expenses, manage debts, and watch your investments grow with a personal finance tool designed for clarity and control.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Button onClick={() => navigate('/sign-in')} className="px-8 py-4 text-lg shadow-xl shadow-blue-600/20">Create Free Account</Button>
          <button onClick={() => navigate('/sign-in')} className="px-8 py-4 text-lg font-medium rounded-lg border border-gray-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900 transition-all text-gray-900 dark:text-white">
            Log In Existing
          </button>
        </div>

        {/* Mock Dashboard Preview */}
        <div className="relative mx-auto max-w-4xl p-4 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 pointer-events-none"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 opacity-90 pointer-events-none select-none">
            {/* Fake Card 1 */}
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm text-left">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 w-fit rounded-xl text-blue-600 mb-4"><Wallet /></div>
              <p className="text-sm text-gray-500">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹1,45,000</p>
            </div>
            {/* Fake Card 2 */}
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm text-left">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 w-fit rounded-xl text-green-600 mb-4"><TrendingUp /></div>
              <p className="text-sm text-gray-500">Investments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹8,20,500</p>
            </div>
            {/* Fake Card 3 */}
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm text-left">
              <div className="p-3 bg-pink-100 dark:bg-pink-900/30 w-fit rounded-xl text-pink-600 mb-4"><PieChart /></div>
              <p className="text-sm text-gray-500">Monthly Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹45,000</p>
            </div>
          </div>
          <div className="mt-6 h-48 bg-gray-50 dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-gray-400 text-sm uppercase tracking-widest">
            Interactive Charts & Reports
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-100 dark:border-zinc-900">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Secure & Private</h3>
            <p className="text-gray-500">Your financial data is encrypted and stored securely. We prioritize your privacy above all else.</p>
          </div>
          <div>
            <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Wealth Tracking</h3>
            <p className="text-gray-500">Monitor your net worth, track investment growth, and visualize your financial health over time.</p>
          </div>
          <div>
            <div className="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
              <PieChart size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Smart Budgeting</h3>
            <p className="text-gray-500">Set limits on spending categories and get insights to help you save more effectively.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-900 py-12 text-center">
        <p className="text-gray-400 text-sm">© 2024 Ledger Personal Finance. Built for security and simplicity.</p>
      </footer>
    </div>
  );
};

export default Home;