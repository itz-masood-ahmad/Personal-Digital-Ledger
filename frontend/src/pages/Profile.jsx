import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiCall } from '../api/client.js';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { User, Lock, CheckCircle, XCircle } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [msg, setMsg] = useState({ text: '', type: '' });
  
  // Password Validation State
  const [newPassword, setNewPassword] = useState('');
  const [validations, setValidations] = useState({
    length: false,
    letter: false,
    number: false
  });

  useEffect(() => {
    setValidations({
      length: newPassword.length >= 8 && newPassword.length <= 16,
      letter: /[a-zA-Z]/.test(newPassword),
      number: /[0-9]/.test(newPassword)
    });
  }, [newPassword]);

  const isPasswordValid = validations.length && validations.letter && validations.number;

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    const fd = new FormData(e.target);
    
    if (!isPasswordValid) {
        setMsg({ text: "New password does not meet security requirements", type: 'error' });
        return;
    }

    const payload = { 
        oldPassword: fd.get('oldPassword'), 
        newPassword: newPassword, 
        confirmNewPassword: fd.get('confirmNewPassword') 
    };
    
    if (payload.newPassword !== payload.confirmNewPassword) { 
        setMsg({ text: "New passwords do not match", type: 'error' }); 
        return; 
    }
    
    try {
      const res = await apiCall('/auth/change-password', 'POST', payload, user, 'ACCOUNT');
      const text = await res.text();
      setMsg({ text: text || "Success", type: 'success' });
      e.target.reset();
      setNewPassword('');
    } catch (err) { setMsg({ text: err.message, type: 'error' }); }
  };

  const ValidationItem = ({ isValid, text }) => (
    <div className={`flex items-center gap-2 text-xs ${isValid ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
      {isValid ? <CheckCircle size={14} /> : <XCircle size={14} />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
      
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><User size={40} /></div>
        <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</h2><p className="text-gray-500">{user?.email}</p></div>
      </div>
      
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3 mb-6"><Lock className="text-blue-600" size={24} /><h3 className="text-xl font-bold text-gray-900 dark:text-white">Security</h3></div>
        
        {msg.text && <div className={`mb-4 p-3 rounded-lg ${msg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{msg.text}</div>}
        
        <form onSubmit={handleChangePassword}>
          <Input name="oldPassword" type="password" label="Current Password" required />
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
                name="newPassword" 
                type="password" 
                label="New Password" 
                required 
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input name="confirmNewPassword" type="password" label="Confirm New" required />
          </div>

          {/* Validation UI */}
          <div className="my-4 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-800 space-y-2">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">New Password Requirements:</p>
            <ValidationItem isValid={validations.length} text="8-16 characters" />
            <ValidationItem isValid={validations.letter} text="At least one letter (a-z, A-Z)" />
            <ValidationItem isValid={validations.number} text="At least one number (0-9)" />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={!isPasswordValid}>Update Password</Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;