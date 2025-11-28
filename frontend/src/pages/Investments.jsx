import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiCall, endpoints, MOCK_MODE } from '../api/client.js';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Modal from '../components/Modal.jsx';
import Input from '../components/Input.jsx';
import { TrendingUp, Plus, Trash2, Edit2 } from 'lucide-react';

const Investments = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  
  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isCloseOpen, setIsCloseOpen] = useState(false);
  const [selectedInv, setSelectedInv] = useState(null);

  const loadData = async () => {
    try {
      const [iRes, aRes, bRes] = await Promise.all([
        apiCall(endpoints.investments, 'GET', null, user, 'INVESTMENT'),
        apiCall(endpoints.accounts, 'GET', null, user, 'ACCOUNT'),
        apiCall(endpoints.budgets, 'GET', null, user, 'BUDGET')
      ]);
      
      setInvestments(await iRes.json());
      setAccounts(await aRes.json());
      setBudgets(await bRes.json());
    } catch(e) { console.error("Error loading investment data", e); }
  };

  useEffect(() => { if(user) loadData(); }, [user]);

  // --- CREATE ---
  const handleCreate = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const dto = {
      name: fd.get('name'),
      value: parseFloat(fd.get('value')),
      type: fd.get('type'),
      accountId: fd.get('accountId') || null,
      budgetId: fd.get('budgetId') || null
    };

    if (dto.accountId === "") dto.accountId = null;
    if (dto.budgetId === "") dto.budgetId = null;

    try {
      await apiCall(endpoints.investments, 'POST', dto, user, 'INVESTMENT');
      loadData();
      setIsCreateOpen(false);
    } catch (e) { alert(e.message); }
  };

  // --- UPDATE (Add/Remove Funds ONLY) ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const changeAmount = parseFloat(fd.get('changeAmount'));
    const addToAccount = fd.get('deductFromAccount') === 'on';
    const accountId = fd.get('accountId') || null;
    
    // FIX: Removed userEmail from here. apiCall handles it.
    let query = `?changeAmount=${changeAmount}&addToAccount=${addToAccount}`;
    if (accountId) query += `&accountId=${accountId}`;

    try {
      await apiCall(`${endpoints.investments}/${selectedInv.id}${query}`, 'PUT', null, user, 'INVESTMENT');
      loadData();
      setIsUpdateOpen(false);
      setSelectedInv(null);
    } catch (e) { alert(e.message); }
  };

  // --- CLOSE (Delete) ---
  const handleClose = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const addToAccount = fd.get('returnToAccount') === 'on';
    
    // FIX: Removed userEmail from here. apiCall handles it.
    let query = `?addToAccount=${addToAccount}`;

    try {
      await apiCall(`${endpoints.investments}/${selectedInv.id}${query}`, 'DELETE', null, user, 'INVESTMENT');
      loadData();
      setIsCloseOpen(false);
      setSelectedInv(null);
    } catch (e) { alert(e.message); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Investments</h1>
        <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2"><Plus size={20} /> Add Investment</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investments.length === 0 && <p className="col-span-full text-gray-500">No investments yet. Start building your portfolio!</p>}
        {investments.map(inv => (
          <div key={inv.id} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm relative group">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-xs font-bold text-green-600 uppercase mb-1">{inv.type || 'ASSET'}</p>
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{inv.name}</h3>
                   <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{inv.value.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                   <TrendingUp size={24} />
                </div>
             </div>
             
             <div className="mt-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => { setSelectedInv(inv); setIsUpdateOpen(true); }}
                  className="flex-1 py-2 text-sm bg-gray-100 dark:bg-zinc-800 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 flex items-center justify-center gap-2"
                >
                  <Edit2 size={14}/> Add/Remove Funds
                </button>
                <button 
                  onClick={() => { setSelectedInv(inv); setIsCloseOpen(true); }}
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40"
                >
                  <Trash2 size={18} />
                </button>
             </div>
          </div>
        ))}
      </div>
      
      {/* CREATE MODAL */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="New Investment">
        <form onSubmit={handleCreate}>
          <Input name="name" label="Investment Name" required placeholder="e.g. HDFC Top 100 Fund" />
          <Input name="value" type="number" label="Amount (₹)" required step="0.01" />
          
          <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Investment Type</label>
             <select name="type" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800 dark:text-white border-transparent focus:ring-2 focus:ring-blue-500 outline-none" required>
                <option value="MUTUAL_FUNDS">Mutual Funds (SIP/Lumpsum)</option>
                <option value="STOCKS">Stocks / Equity</option>
                <option value="FD">Fixed Deposit (FD)</option>
                <option value="RD">Recurring Deposit (RD)</option>
                <option value="PPF">Public Provident Fund (PPF)</option>
                <option value="NPS">National Pension System (NPS)</option>
                <option value="GOLD">Gold / Sovereign Gold Bonds</option>
                <option value="REAL_ESTATE">Real Estate</option>
                <option value="CRYPTO">Crypto</option>
                <option value="DEBT_FUNDS">Debt Funds / Bonds</option>
                <option value="OTHER">Other</option>
             </select>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <p className="text-xs text-gray-500 font-bold uppercase">Payment Source (Optional)</p>
            <select name="accountId" className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 dark:text-white border-none">
              <option value="">External Funds (Cash/Cheque)</option>
              {accounts.map(a => <option key={a.id} value={a.id}>Debit Account: {a.accountName} (₹{a.balance})</option>)}
            </select>
            <select name="budgetId" className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 dark:text-white border-none">
              <option value="">No Budget Link</option>
              {budgets.map(b => <option key={b.id} value={b.id}>Deduct from Budget: {b.name}</option>)}
            </select>
          </div>
          
          <Button type="submit" className="w-full">Create Investment</Button>
        </form>
      </Modal>

      {/* UPDATE MODAL */}
      <Modal isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)} title="Update Investment Value">
        {selectedInv && (
          <form onSubmit={handleUpdate}>
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
               <p className="text-sm text-gray-500">Current Value</p>
               <p className="text-2xl font-bold text-green-600">₹{selectedInv.value.toLocaleString('en-IN')}</p>
               <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{selectedInv.type}</p>
            </div>

            <Input name="changeAmount" label="Add/Withdraw Amount (+/-)" type="number" step="0.01" required placeholder="e.g. 5000 or -2000" />
            
            <div className="mb-4 flex items-center gap-2 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
               <input type="checkbox" name="deductFromAccount" id="deduct" className="w-4 h-4 text-blue-600 rounded" />
               <label htmlFor="deduct" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                 Auto-adjust linked Account balance?
               </label>
            </div>

            <div className="mb-6">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Select Linked Account</label>
               <select name="accountId" className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 dark:text-white border-none">
                  <option value="">Select Account (If applicable)</option>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.accountName} (₹{a.balance})</option>)}
               </select>
            </div>

            <Button type="submit" className="w-full">Update Value</Button>
          </form>
        )}
      </Modal>

      {/* CLOSE MODAL */}
      <Modal isOpen={isCloseOpen} onClose={() => setIsCloseOpen(false)} title="Close/Redeem Investment">
         <form onSubmit={handleClose}>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
               Are you sure you want to close/redeem <strong>{selectedInv?.name}</strong>? This action cannot be undone.
            </p>
            
            <div className="mb-6 flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
               <input type="checkbox" name="returnToAccount" id="return" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
               <label htmlFor="return" className="text-sm font-medium text-gray-800 dark:text-white cursor-pointer">
                  Credit redemption value (₹{selectedInv?.value.toLocaleString('en-IN')}) back to linked account?
               </label>
            </div>

            <div className="flex gap-3">
               <Button type="button" variant="outline" onClick={() => setIsCloseOpen(false)} className="flex-1">Cancel</Button>
               <Button type="submit" variant="danger" className="flex-1">Confirm Redemption</Button>
            </div>
         </form>
      </Modal>
    </div>
  );
};

export default Investments;