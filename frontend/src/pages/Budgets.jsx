import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiCall, endpoints, MOCK_MODE } from '../api/client.js';
import Button from '../components/Button.jsx';
import Modal from '../components/Modal.jsx';
import Input from '../components/Input.jsx';
import { PieChart, Plus } from 'lucide-react';

const Budgets = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [createModal, setCreateModal] = useState(false);
  const [closeModal, setCloseModal] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (MOCK_MODE) return;
      const bRes = await apiCall(endpoints.budgets, 'GET', null, user, 'BUDGET');
      setBudgets(await bRes.json());
      const aRes = await apiCall(endpoints.accounts, 'GET', null, user, 'ACCOUNT');
      setAccounts(await aRes.json());
    };
    load();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const dto = { name: fd.get('name'), amount: parseFloat(fd.get('amount')) };
    if (!MOCK_MODE) await apiCall(endpoints.budgets, 'POST', dto, user, 'BUDGET');
    const bRes = await apiCall(endpoints.budgets, 'GET', null, user, 'BUDGET');
    setBudgets(await bRes.json());
    setCreateModal(false);
  };

  const handleClose = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const accountId = fd.get('accountId');
    if (!MOCK_MODE) {
      let url = `/budgets/close/${closeModal}?addRemainingToAccount=${!!accountId}`;
      if (accountId) url += `&accountId=${accountId}`;
      await apiCall(url, 'POST', null, user, 'BUDGET');
    }
    setBudgets(budgets.filter(b => b.id !== closeModal));
    setCloseModal(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Budgets</h1>
        <Button onClick={() => setCreateModal(true)} className="flex items-center gap-2"><Plus size={20} /> New Budget</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {budgets.map(b => (
          <div key={b.id} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{b.name}</h3>
              <span className="text-lg font-bold text-blue-600">₹{b.amount.toLocaleString('en-IN')}</span>
            </div>
            <Button variant="danger" onClick={() => setCloseModal(b.id)} className="w-full">Close Budget</Button>
          </div>
        ))}
      </div>

      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="New Budget">
        <form onSubmit={handleCreate}>
          <Input name="name" label="Name" required />
          <Input name="amount" type="number" label="Limit (₹)" required />
          <Button type="submit" className="w-full">Create</Button>
        </form>
      </Modal>

      <Modal isOpen={!!closeModal} onClose={() => setCloseModal(null)} title="Close Budget">
        <form onSubmit={handleClose}>
          <p className="mb-4 text-gray-600 dark:text-gray-400">Transfer remaining funds?</p>
          <select name="accountId" className="w-full px-4 py-2.5 mb-4 rounded-xl bg-gray-50 dark:bg-zinc-800 dark:text-white">
            <option value="">No transfer</option>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.accountName}</option>)}
          </select>
          <Button type="submit" variant="danger" className="w-full">Confirm</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Budgets;