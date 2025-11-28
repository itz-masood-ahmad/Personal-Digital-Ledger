import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiCall, endpoints, MOCK_MODE } from '../api/client.js';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Modal from '../components/Modal.jsx';
import Input from '../components/Input.jsx';
import { Wallet, Plus, Trash2, Edit2, Eye } from 'lucide-react';

const Accounts = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [createModal, setCreateModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchAccounts = async () => {
    if (MOCK_MODE) return;
    try {
      const res = await apiCall(endpoints.accounts, 'GET', null, user, 'ACCOUNT');
      setAccounts(await res.json());
    } catch (err) {
      console.error("Failed to load accounts", err);
    }
  };

  useEffect(() => { if (user) fetchAccounts(); }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const dto = { 
      accountName: fd.get('accountName'), 
      balance: parseFloat(fd.get('balance')), 
      type: fd.get('type') 
    };
    
    try {
      if (!MOCK_MODE) await apiCall(endpoints.accounts, 'POST', dto, user, 'ACCOUNT');
      fetchAccounts();
      setCreateModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedAccount) return;
    
    const fd = new FormData(e.target);
    const dto = { 
      accountName: fd.get('accountName'), 
      balance: selectedAccount.balance, 
      type: fd.get('type') 
    };

    try {
      if (!MOCK_MODE) {
        await apiCall(`${endpoints.accounts}/${selectedAccount.id}`, 'PUT', dto, user, 'ACCOUNT');
      }
      fetchAccounts();
      setIsDetailsOpen(false);
      setSelectedAccount(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); 
    if (!window.confirm("Are you sure you want to delete this account? This action cannot be undone.")) return;

    try {
      if (!MOCK_MODE) {
        await apiCall(`${endpoints.accounts}/${id}`, 'DELETE', null, user, 'ACCOUNT');
      }
      setAccounts(accounts.filter(acc => acc.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const openDetails = (acc) => {
    setSelectedAccount(acc);
    setIsDetailsOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Accounts</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your balances and account types</p>
        </div>
        <Button onClick={() => setCreateModal(true)} className="flex items-center gap-2">
          <Plus size={20} /> Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.length === 0 && <p className="col-span-full text-center text-gray-500 py-10">No accounts found. Create one to get started.</p>}
        
        {accounts.map(acc => (
          <div 
            key={acc.id} 
            onClick={() => openDetails(acc)}
            className="group relative bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Wallet size={24} />
              </div>
              <button 
                onClick={(e) => handleDelete(acc.id, e)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                title="Delete Account"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{acc.accountName}</h3>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">{acc.type}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{acc.balance?.toLocaleString('en-IN')}</p>
            
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 text-xs font-medium flex items-center gap-1">
              View Details <Eye size={12} />
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create New Account">
        <form onSubmit={handleCreate}>
          <Input name="accountName" label="Account Name" required placeholder="e.g. Chase Checking" />
          <Input name="balance" type="number" label="Initial Balance" required step="0.01" />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Account Type</label>
            <select name="type" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800 dark:text-white border-transparent focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="CHECKING">Checking</option>
              <option value="SAVINGS">Savings</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="CASH">Cash</option>
              <option value="INVESTMENT">Investment</option>
            </select>
          </div>
          <Button type="submit" className="w-full">Create Account</Button>
        </form>
      </Modal>

      <Modal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} title="Account Details">
        {selectedAccount && (
          <form onSubmit={handleUpdate}>
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Balance</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{selectedAccount.balance?.toLocaleString('en-IN')}</p>
              </div>
              <Wallet className="text-blue-300 dark:text-blue-600" size={32} />
            </div>

            <Input 
              name="accountName" 
              label="Account Name" 
              defaultValue={selectedAccount.accountName} 
              required 
            />
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Account Type</label>
              <select 
                name="type" 
                defaultValue={selectedAccount.type}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800 dark:text-white border-transparent focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="CHECKING">Checking</option>
                <option value="SAVINGS">Savings</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="CASH">Cash</option>
                <option value="INVESTMENT">Investment</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setIsDetailsOpen(false)} className="flex-1">Cancel</Button>
              <Button type="submit" className="flex-1 flex items-center justify-center gap-2">
                <Edit2 size={16} /> Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Accounts;