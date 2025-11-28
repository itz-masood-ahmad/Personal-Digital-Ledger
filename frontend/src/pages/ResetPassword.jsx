import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx'; 
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { Lock, CheckCircle, XCircle, Moon, Sun, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const { confirmReset, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme(); 
  
  const [token, setToken] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Toggle Visibility State
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const [validations, setValidations] = useState({
    length: false,
    letter: false,
    number: false
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (t) setToken(t);
    else setMsg({ text: "Invalid or missing reset token.", type: 'error' });
  }, []);

  useEffect(() => {
    setValidations({
      length: newPassword.length >= 8 && newPassword.length <= 16,
      letter: /[a-zA-Z]/.test(newPassword),
      number: /[0-9]/.test(newPassword)
    });
  }, [newPassword]);

  const isPasswordValid = validations.length && validations.letter && validations.number;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    const cleanNewPass = newPassword.trim();
    const cleanConfirmPass = confirmPassword.trim();

    if (!isPasswordValid) {
        setMsg({ text: "Password does not meet requirements", type: 'error' });
        return;
    }

    if (cleanNewPass !== cleanConfirmPass) {
        setMsg({ text: "Passwords do not match", type: 'error' });
        return;
    }

    const res = await confirmReset(token, cleanNewPass, cleanConfirmPass);
    
    if (res.success) {
        setMsg({ text: "Password reset successfully! Redirecting to login...", type: 'success' });
        setTimeout(() => {
            window.location.href = '/sign-in'; 
        }, 3000);
    } else {
        setMsg({ text: res.message, type: 'error' });
    }
  };

  const ValidationItem = ({ isValid, text }) => (
    <div className={`flex items-center gap-2 text-xs ${isValid ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
      {isValid ? <CheckCircle size={14} /> : <XCircle size={14} />}
      <span>{text}</span>
    </div>
  );

  const ToggleButton = ({ isVisible, onToggle }) => (
    <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 bottom-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
    >
        {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  );

  // Input Class String matching Auth.jsx's Input component styles + pr-10 for icon space
  const inputClasses = "w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-transparent focus:border-blue-500 dark:focus:border-purple-500 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-purple-500/20 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 pr-10";

  if (!token) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black transition-colors duration-300">
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-md text-center border dark:border-zinc-800">
                <h2 className="text-red-600 dark:text-red-400 font-bold text-xl mb-2">Invalid Link</h2>
                <p className="text-gray-600 dark:text-gray-300">This password reset link is invalid or missing.</p>
                <a href="/sign-in" className="mt-4 inline-block text-blue-600 dark:text-purple-400 hover:underline">Return to Login</a>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black p-4 transition-colors duration-300 relative">
      
      {/* Theme Toggle - Matched Auth.jsx Style */}
      <button 
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-full bg-white dark:bg-zinc-800 shadow-md text-gray-600 dark:text-purple-400 hover:scale-110 transition-transform"
        title="Toggle Theme"
      >
        {isDark ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-800 animate-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 dark:bg-purple-600 rounded-xl mx-auto flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-600/30 dark:shadow-purple-600/30">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Set New Password</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Enter your new secure password below.</p>
        </div>

        {msg.text && (
            <div className={`mb-4 p-3 rounded-lg text-sm text-center border ${
                msg.type === 'error' 
                ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800' 
                : 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
            }`}>
                {msg.text}
            </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* New Password Field */}
            <div className="relative">
                <Input 
                  name="newPassword" 
                  type={showNewPass ? "text" : "password"}
                  label="New Password" 
                  required 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClasses}
                />
                <ToggleButton isVisible={showNewPass} onToggle={() => setShowNewPass(!showNewPass)} />
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
                <Input 
                  name="confirmPassword" 
                  type={showConfirmPass ? "text" : "password"}
                  label="Confirm Password" 
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClasses}
                />
                <ToggleButton isVisible={showConfirmPass} onToggle={() => setShowConfirmPass(!showConfirmPass)} />
            </div>

          </div>

          <div className="my-4 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-800 space-y-2">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Requirements:</p>
            <ValidationItem isValid={validations.length} text="8-16 characters" />
            <ValidationItem isValid={validations.letter} text="At least one letter" />
            <ValidationItem isValid={validations.number} text="At least one number" />
          </div>

          <Button type="submit" className="w-full" disabled={loading || !isPasswordValid}>
            {loading ? 'Updating...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;