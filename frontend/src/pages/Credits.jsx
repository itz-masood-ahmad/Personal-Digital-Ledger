import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiCall, endpoints } from '../api/client.js';
import Button from '../components/Button.jsx';
import Modal from '../components/Modal.jsx';
import Input from '../components/Input.jsx';
import { ArrowDownLeft, Plus } from 'lucide-react';

const Credits = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [cRes, aRes] = await Promise.all([
        apiCall(endpoints.credits, 'GET', null, user, 'CREDIT'),
        apiCall(endpoints.accounts, 'GET', null, user, 'ACCOUNT')
      ]);
      setCredits(await cRes.json());
      setAccounts(await aRes.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { if(user) fetchData(); }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const accountId = fd.get('accountId');
    const dto = { 
      source: fd.get('source'), 
      amount: parseFloat(fd.get('amount')), 
      note: fd.get('note'), 
      repayDebt: fd.get('repayDebt') === 'on' 
    };
    
    try {
      await apiCall(`${endpoints.credits}/${accountId}`, 'POST', dto, user, 'CREDIT');
      fetchData();
      setIsOpen(false);
    } catch (e) { alert(e.message); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Credits</h1>
        <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
          <Plus size={20} /> Add Credit
        </Button>
      </div>
      <div className="grid gap-4">
        {credits.map(c => (
          <div key={c.id} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <ArrowDownLeft size={24}/>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{c.source}</h3>
                <p className="text-sm text-gray-500">{c.note}</p>
              </div>
            </div>
            <div className="text-xl font-bold text-green-600">+₹{c.amount.toLocaleString('en-IN')}</div>
          </div>
        ))}
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Credit">
        <form onSubmit={handleCreate}>
          <Input name="source" label="Source" required />
          <Input name="amount" type="number" label="Amount (₹)" required />
          <Input name="note" label="Note" />
          <select name="accountId" required className="w-full px-4 py-2.5 mb-4 rounded-xl bg-gray-50 dark:bg-zinc-800 dark:text-white">
            {accounts.map(a => <option key={a.id} value={a.id}>{a.accountName}</option>)}
          </select>
          <div className="mb-4 flex gap-2">
            <input type="checkbox" name="repayDebt" id="repay" />
            <label htmlFor="repay" className="text-gray-700 dark:text-gray-300">Repay Debt?</label>
          </div>
          <Button type="submit" className="w-full">Add</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Credits;