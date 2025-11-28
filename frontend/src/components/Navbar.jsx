import React from 'react';
import { Menu, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user } = useAuth();

  return (
    <header className="flex justify-between items-center mb-8">
      <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-gray-400">
        <Menu size={24} />
      </button>
      
      <div className="flex items-center gap-4">
        <div className="text-right hidden md:block">
          <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-purple-900/50 flex items-center justify-center text-blue-700 dark:text-purple-300">
          <User size={20} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;