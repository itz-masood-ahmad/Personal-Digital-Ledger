import React, { useState, useEffect } from 'react';
// FIX: Removed extensions to rely on Vite's resolution
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; 
import Input from '../components/Input';
import Button from '../components/Button';
import { Moon, Sun, CheckCircle, XCircle } from 'lucide-react';

const Auth = () => {
  const [view, setView] = useState('LOGIN'); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Password Validation State
  const [password, setPassword] = useState('');
  const [validations, setValidations] = useState({
    length: false,
    letter: false,
    number: false
  });
  
  const { login, register, forgotPassword, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme(); 

  // Real-time validation check
  useEffect(() => {
    setValidations({
      length: password.length >= 8 && password.length <= 16,
      letter: /[a-zA-Z]/.test(password),
      number: /[0-9]/.test(password)
    });
  }, [password]);

  const isPasswordValid = validations.length && validations.letter && validations.number;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const fd = new FormData(e.target);

    try {
      if (view === 'LOGIN') {
        const res = await login(fd.get('email'), fd.get('password'));
        if (!res.success) setError(res.message);
      } 
      else if (view === 'REGISTER') {
        const confirmPassword = fd.get('confirmPassword');
        
        if (!isPasswordValid) {
            setError("Password does not meet security requirements.");
            return;
        }
        
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }

        const res = await register({
          firstName: fd.get('firstName'),
          lastName: fd.get('lastName'),
          email: fd.get('email'),
          password,
          confirmPassword
        });

        if (res.success) {
          setSuccess("Registration successful! Logging you in...");
          setTimeout(async () => {
             await login(fd.get('email'), password);
          }, 1500);
        } else {
          setError(res.message);
        }
      }
      else if (view === 'FORGOT') {
        const res = await forgotPassword(fd.get('email'));
        if (res.success) {
          setSuccess(res.message);
          setTimeout(() => setView('LOGIN'), 3000);
        } else {
          setError(res.message);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  const ValidationItem = ({ isValid, text }) => (
    <div className={`flex items-center gap-2 text-xs ${isValid ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
      {isValid ? <CheckCircle size={14} /> : <XCircle size={14} />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black p-4 transition-colors duration-300 relative">
      
      <button onClick={toggleTheme} className="absolute top-6 right-6 p-3 rounded-full bg-white dark:bg-zinc-800 shadow-md text-gray-600 dark:text-purple-400 hover:scale-110 transition-transform" title="Toggle Theme">
        {isDark ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-800 animate-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 dark:bg-purple-600 rounded-xl mx-auto flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg shadow-blue-600/30 dark:shadow-purple-600/30">L</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {view === 'LOGIN' && 'Welcome Back'}
            {view === 'REGISTER' && 'Create Account'}
            {view === 'FORGOT' && 'Reset Password'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your digital ledger</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-lg text-sm text-center border border-red-100 dark:border-red-800">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 rounded-lg text-sm text-center border border-green-100 dark:border-green-800">{success}</div>}

        <form onSubmit={handleSubmit}>
          {view === 'REGISTER' && (
            <div className="grid grid-cols-2 gap-4">
              <Input name="firstName" placeholder="First Name" required />
              <Input name="lastName" placeholder="Last Name" required />
            </div>
          )}

          <Input name="email" type="email" label="Email Address" required />

          {view !== 'FORGOT' && (
            <Input 
                name="password" 
                type="password" 
                label="Password" 
                required 
                onChange={(e) => setPassword(e.target.value)} 
            />
          )}
          
          {view === 'REGISTER' && (
             <div className="mb-4 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-800 space-y-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Password Requirements:</p>
                <ValidationItem isValid={validations.length} text="8-16 characters" />
                <ValidationItem isValid={validations.letter} text="At least one letter (a-z, A-Z)" />
                <ValidationItem isValid={validations.number} text="At least one number (0-9)" />
             </div>
          )}

          {view === 'REGISTER' && <Input name="confirmPassword" type="password" label="Confirm Password" required />}

          <Button type="submit" className="w-full mt-4" disabled={loading || (view === 'REGISTER' && !isPasswordValid)}>
            {loading ? 'Processing...' : (view === 'LOGIN' ? 'Sign In' : view === 'REGISTER' ? 'Register' : 'Send Reset Link')}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-3">
          {view === 'LOGIN' && (
            <>
              <p className="text-sm text-gray-500">Don't have an account? <button onClick={() => { setError(''); setView('REGISTER'); }} className="text-blue-600 dark:text-purple-400 font-bold hover:underline">Sign Up</button></p>
              <button onClick={() => { setError(''); setView('FORGOT'); }} className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">Forgot Password?</button>
            </>
          )}
          
          {(view === 'REGISTER' || view === 'FORGOT') && (
             <button onClick={() => { setError(''); setView('LOGIN'); }} className="text-sm text-blue-600 dark:text-purple-400 font-bold hover:underline">Back to Login</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;