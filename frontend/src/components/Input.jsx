import React from 'react';

const Input = ({ label, type = "text", name, required, ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        required={required}
        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-transparent focus:border-blue-500 dark:focus:border-purple-500 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-purple-500/20 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
        {...props}
      />
    </div>
  );
};

export default Input;