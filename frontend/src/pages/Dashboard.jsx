import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { apiCall, endpoints } from '../api/client.js';
import Card from '../components/Card.jsx';
import { Wallet, PieChart, TrendingUp, CreditCard, Activity, HandCoins } from 'lucide-react';
import { 
  PieChart as RePieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const Dashboard = ({ navigate }) => { 
  const { user } = useAuth();
  const { isDark } = useTheme();
  
  const [stats, setStats] = useState({ 
    balance: 0, 
    budgetTotal: 0, 
    investments: 0, 
    debt: 0,
    lent: 0 
  });
  const [chartData, setChartData] = useState({ assets: [], allocation: [] });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const [accRes, budRes, invRes, debtRes] = await Promise.all([
          apiCall(endpoints.accounts, 'GET', null, user, 'ACCOUNT'),
          apiCall(endpoints.budgets, 'GET', null, user, 'BUDGET'),
          apiCall(endpoints.investments, 'GET', null, user, 'INVESTMENT'),
          apiCall(endpoints.debts, 'GET', null, user, 'DEBT')
        ]);

        const accounts = await accRes.json();
        const budgets = await budRes.json();
        const investments = await invRes.json();
        const debts = await debtRes.json();

        const totalBalance = Array.isArray(accounts) ? accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0) : 0;
        const totalBudget = Array.isArray(budgets) ? budgets.reduce((sum, b) => sum + (b.amount || 0), 0) : 0;
        const totalInvestments = Array.isArray(investments) ? investments.reduce((sum, i) => sum + (i.value || 0), 0) : 0;
        
        const totalDebt = Array.isArray(debts) ? debts.filter(d => d.given === false).reduce((sum, d) => sum + (d.amount || 0), 0) : 0;
        const totalLent = Array.isArray(debts) ? debts.filter(d => d.given === true).reduce((sum, d) => sum + (d.amount || 0), 0) : 0;

        setStats({
          balance: totalBalance,
          budgetTotal: totalBudget,
          investments: totalInvestments,
          debt: totalDebt,
          lent: totalLent
        });

        // --- Prepare Chart Data ---
        const allocationMap = {};
        accounts.forEach(acc => {
            const type = acc.type || 'Other';
            allocationMap[type] = (allocationMap[type] || 0) + acc.balance;
        });
        if (totalInvestments > 0) {
            allocationMap['Investments'] = totalInvestments;
        }

        const allocationData = Object.keys(allocationMap).map(key => ({
            name: key.replace('_', ' '),
            value: allocationMap[key]
        }));
        
        const worthData = [
            { name: 'Cash', amount: totalBalance },
            { name: 'Invested', amount: totalInvestments },
            { name: 'Lent', amount: totalLent },
            { name: 'Debt', amount: totalDebt }
        ];

        setChartData({ allocation: allocationData, assets: worthData });

      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };

    fetchData();
  }, [user]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const tooltipStyle = isDark 
    ? { backgroundColor: '#333', border: 'none', borderRadius: '8px', color: '#fff' }
    : { backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#1f2937', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Welcome back, <span className="font-bold text-blue-600 dark:text-purple-400">{user?.firstName || 'User'}</span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <Card 
          title="Total Balance" 
          value={`₹${stats.balance.toLocaleString('en-IN')}`} 
          icon={Wallet} 
          color="purple" 
          subtext="Liquid Assets"
          onIconClick={() => navigate('accounts')}
        />
        <Card 
          title="Investments" 
          value={`₹${stats.investments.toLocaleString('en-IN')}`} 
          icon={TrendingUp} 
          color="green" 
          subtext="Total Asset Value"
          onIconClick={() => navigate('investments')}
        />
        <Card 
          title="Total Budgets" 
          value={`₹${stats.budgetTotal.toLocaleString('en-IN')}`} 
          icon={PieChart} 
          color="blue" 
          subtext="Planned Spending"
          onIconClick={() => navigate('budgets')}
        />
        <Card 
          title="Net Debt" 
          value={`₹${stats.debt.toLocaleString('en-IN')}`} 
          icon={CreditCard} 
          color="pink" 
          subtext="Total You Owe"
          onIconClick={() => navigate('debts-borrowed')} 
        />
        <Card 
          title="Total Lent" 
          value={`₹${stats.lent.toLocaleString('en-IN')}`} 
          icon={HandCoins} 
          color="orange" 
          subtext="Owed to You"
          onIconClick={() => navigate('debts-lent')} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <PieChart size={20} className="text-blue-500" /> Asset Allocation
            </h3>
            <div className="h-64 w-full">
                {chartData.allocation.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                            <Pie
                                data={chartData.allocation}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.allocation.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                                contentStyle={tooltipStyle}
                                itemStyle={{ color: isDark ? '#fff' : '#1f2937' }}
                            />
                            <Legend />
                        </RePieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">No data available</div>
                )}
            </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity size={20} className="text-green-500" /> Financial Overview
            </h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.assets}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis 
                            stroke="#888888" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            tickFormatter={(value) => `₹${value >= 1000 ? value/1000 + 'k' : value}`} 
                        />
                        <Tooltip 
                            cursor={{fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}}
                            formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                            contentStyle={tooltipStyle}
                            itemStyle={{ color: isDark ? '#fff' : '#1f2937' }}
                        />
                        <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                            {chartData.assets.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.name === 'Debt' ? '#ef4444' : (entry.name === 'Lent' ? '#f97316' : '#10b981')} 
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-100 dark:border-zinc-800 text-center">
        <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Net Worth</h3>
        <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
            ₹{(stats.balance + stats.investments + stats.lent - stats.debt).toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-gray-400 mt-2">(Cash + Investments + Money Lent) - Debt</p>
      </div>
    </div>
  );
};

export default Dashboard;