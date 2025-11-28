import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 🟢 Hook for navigation
import { useAuth } from '../context/AuthContext.jsx';
import { apiCall, endpoints } from '../api/client.js';
import { ArrowDownLeft, ArrowUpRight, ChevronRight } from 'lucide-react';

const DebtLoansMaster = () => { // Removed unused prop 'navigate' since we use hook
  const navigate = useNavigate(); // 🟢 Using the hook directly
  const { user } = useAuth();
  const [summary, setSummary] = useState({ borrowed: 0, lent: 0, countBorrowed: 0, countLent: 0 });

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await apiCall(endpoints.debts, 'GET', null, user, 'DEBT');
        const data = await res.json();
        
        const borrowed = data.filter(d => d.given === false);
        const lent = data.filter(d => d.given === true);

        setSummary({
          borrowed: borrowed.reduce((sum, d) => sum + d.amount, 0),
          lent: lent.reduce((sum, d) => sum + d.amount, 0),
          countBorrowed: borrowed.length,
          countLent: lent.length
        });
      } catch (e) { console.error(e); }
    };
    if (user) loadData();
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Debts & Loans Overview</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage what you owe and what is owed to you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Borrowed Section Card - CLICKABLE */}
        <div 
          onClick={() => navigate('/debts/borrowed')} // 🟢 Redirects to Borrowed page
          className="group cursor-pointer bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-red-100 dark:hover:border-red-900/30 transition-all"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl">
              <ArrowDownLeft size={32} />
            </div>
            <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-full text-gray-400 group-hover:text-red-500 transition-colors">
              <ChevronRight size={24} />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Borrowed</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Money you owe to others</p>
          
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-red-600">₹{summary.borrowed.toLocaleString('en-IN')}</span>
            <span className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">across {summary.countBorrowed} people</span>
          </div>
        </div>

        {/* Lent Section Card - CLICKABLE */}
        <div 
          onClick={() => navigate('/debts/lent')} // 🟢 Redirects to Lent page
          className="group cursor-pointer bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-green-100 dark:hover:border-green-900/30 transition-all"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-2xl">
              <ArrowUpRight size={32} />
            </div>
            <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-full text-gray-400 group-hover:text-green-500 transition-colors">
              <ChevronRight size={24} />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Lent</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Money owed to you</p>
          
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-green-600">₹{summary.lent.toLocaleString('en-IN')}</span>
            <span className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">to {summary.countLent} people</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DebtLoansMaster;