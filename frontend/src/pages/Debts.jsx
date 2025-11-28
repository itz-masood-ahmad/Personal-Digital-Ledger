import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiCall, endpoints, MOCK_MODE } from '../api/client.js';
import Button from '../components/Button.jsx';
import Modal from '../components/Modal.jsx';
import Input from '../components/Input.jsx';
import { Plus, ArrowDownLeft, Trash2, RotateCcw, TrendingUp, AlertCircle } from 'lucide-react';

const Debts = () => {
  const { user } = useAuth();
  const [debts, setDebts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [manageAction, setManageAction] = useState(null);
  const [repayType, setRepayType] = useState('partial');
  const [linkAccount, setLinkAccount] = useState(false);

  const loadData = async () => {
    if (MOCK_MODE) return;
    try {
        const [dRes, aRes] = await Promise.all([
            apiCall(endpoints.debts, 'GET', null, user, 'DEBT'),
            apiCall(endpoints.accounts, 'GET', null, user, 'ACCOUNT')
        ]);
        const allDebts = await dRes.json();
        // FILTER: Show only what I Owe (given = false)
        setDebts(allDebts.filter(d => d.given === false));
        setAccounts(await aRes.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { if(user) loadData(); }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const accountId = fd.get('accountId');
    
    const dto = { 
      person: fd.get('person'), 
      amount: parseFloat(fd.get('amount')), 
      given: false // Hardcoded to Borrowed
    };
    
    let query = accountId ? `?accountId=${accountId}` : '';
    try {
        await apiCall(`${endpoints.debts}${query}`, 'POST', dto, user, 'DEBT');
        loadData();
        setIsCreateOpen(false);
    } catch (e) { alert(e.message); }
  };

  const handleManageSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const accountId = linkAccount ? fd.get('accountId') : null;
    
    try {
        if (manageAction === 'delete') {
             await apiCall(`${endpoints.debts}/${selectedDebt.id}?accountId=${accountId}`, 'DELETE', null, user, 'DEBT');
        } 
        else if (manageAction === 'repay') {
            let newAmount = 0;
            if (repayType === 'partial') {
                const partialAmount = parseFloat(fd.get('amount'));
                newAmount = selectedDebt.amount - partialAmount;
                if (newAmount < 0) { alert("Amount exceeds balance"); return; }
            }
            
            const dto = { ...selectedDebt, amount: newAmount };
            let query = accountId ? `?accountId=${accountId}` : '';
            await apiCall(`${endpoints.debts}/${selectedDebt.id}${query}`, 'PUT', dto, user, 'DEBT');

            if (repayType === 'full' || newAmount === 0) {
                 await apiCall(`${endpoints.debts}/${selectedDebt.id}`, 'DELETE', null, user, 'DEBT');
            }
        } 
        else if (manageAction === 'increase') {
            const increaseAmount = parseFloat(fd.get('amount'));
            const dto = { person: selectedDebt.person, amount: increaseAmount, given: false }; // Borrow More -> Create new row or update? 
            // Requirement was "Create new row". 
            let query = accountId ? `?accountId=${accountId}` : '';
            await apiCall(`${endpoints.debts}${query}`, 'POST', dto, user, 'DEBT');
        }

        loadData();
        setIsManageOpen(false);
    } catch (e) { alert(e.message); }
  };

  const openManage = (d) => { setSelectedDebt(d); setManageAction(null); setIsManageOpen(true); setLinkAccount(false); };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Borrowed</h1>
            <p className="text-sm text-gray-500">Money you owe to others</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2"><Plus size={20} /> Add Borrowing</Button>
      </div>

      <div className="grid gap-4">
        {debts.map(d => (
          <div key={d.id} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-100 text-red-600"><ArrowDownLeft size={24}/></div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{d.person}</h3>
                <p className="text-sm text-gray-500">You Owe</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="text-2xl font-bold text-red-600">₹{d.amount.toLocaleString('en-IN')}</div>
                <Button onClick={() => openManage(d)} variant="secondary" className="text-sm">Manage</Button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Borrow Money">
        <form onSubmit={handleCreate}>
          <Input name="person" label="Borrow From (Person Name)" required />
          <Input name="amount" type="number" label="Amount (₹)" required />
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
            <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" name="linkAccount" onChange={(e) => setLinkAccount(e.target.checked)} />
                <label className="text-sm">Deposit this amount to an account?</label>
            </div>
            {linkAccount && <select name="accountId" className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 dark:text-white">{accounts.map(a => <option key={a.id} value={a.id}>{a.accountName} (₹{a.balance})</option>)}</select>}
          </div>
          <Button type="submit" className="w-full mt-4">Save</Button>
        </form>
      </Modal>

      <Modal isOpen={isManageOpen} onClose={() => setIsManageOpen(false)} title="Manage Borrowing">
        {selectedDebt && (
            <form onSubmit={handleManageSubmit}>
                <div className="mb-6 text-center">
                    <p className="text-sm text-gray-500">Owed to {selectedDebt.person}</p>
                    <p className="text-3xl font-bold text-red-600">₹{selectedDebt.amount.toLocaleString('en-IN')}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-6">
                    <button type="button" onClick={() => setManageAction('repay')} className={`p-3 border-2 rounded-xl ${manageAction === 'repay' ? 'border-blue-500' : 'border-gray-200'}`}>
                        <RotateCcw className="mx-auto text-blue-500"/> <span className="text-xs block text-center mt-1">Repay</span>
                    </button>
                    <button type="button" onClick={() => setManageAction('increase')} className={`p-3 border-2 rounded-xl ${manageAction === 'increase' ? 'border-purple-500' : 'border-gray-200'}`}>
                        <TrendingUp className="mx-auto text-purple-500"/> <span className="text-xs block text-center mt-1">Borrow More</span>
                    </button>
                    <button type="button" onClick={() => selectedDebt.amount === 0 && setManageAction('delete')} disabled={selectedDebt.amount > 0} className={`p-3 border-2 rounded-xl ${manageAction === 'delete' ? 'border-red-500' : 'border-gray-200 opacity-60'}`}>
                        <Trash2 className="mx-auto text-red-500"/> <span className="text-xs block text-center mt-1">Delete</span>
                    </button>
                </div>
                
                {/* Logic for inputs matches previous Debts.jsx but specifically for borrowing flow */}
                {manageAction === 'repay' && (
                    <>
                        <div className="flex gap-4 mb-4">
                            <button type="button" onClick={() => setRepayType('partial')} className={`flex-1 py-2 rounded ${repayType === 'partial' ? 'bg-blue-100' : 'bg-gray-100'}`}>Partial</button>
                            <button type="button" onClick={() => setRepayType('full')} className={`flex-1 py-2 rounded ${repayType === 'full' ? 'bg-blue-100' : 'bg-gray-100'}`}>Full</button>
                        </div>
                        {repayType === 'partial' && <Input name="amount" label="Repay Amount (₹)" type="number" required />}
                    </>
                )}
                
                {manageAction === 'increase' && <Input name="amount" label="Borrow More Amount (₹)" type="number" required />}

                {manageAction && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
                        <div className="flex items-center gap-2 mb-2">
                            <input type="checkbox" checked={linkAccount} onChange={(e) => setLinkAccount(e.target.checked)} />
                            <label className="text-sm">{manageAction === 'repay' ? 'Deduct repayment from account?' : (manageAction === 'increase' ? 'Deposit extra amount to account?' : 'Delete')}</label>
                        </div>
                        {linkAccount && <select name="accountId" className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 dark:text-white">{accounts.map(a => <option key={a.id} value={a.id}>{a.accountName} (₹{a.balance})</option>)}</select>}
                    </div>
                )}

                {manageAction && <Button type="submit" className="w-full mt-4">Confirm</Button>}
            </form>
        )}
      </Modal>
    </div>
  );
};

export default Debts;