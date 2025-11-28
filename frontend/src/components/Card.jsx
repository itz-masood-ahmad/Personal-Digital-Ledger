import React from 'react';

const Card = ({ title, value, icon: Icon, subtext, color = "purple", onIconClick }) => {
  const colors = {
    purple: "from-purple-500 to-indigo-600",
    blue: "from-blue-500 to-cyan-500",
    green: "from-emerald-500 to-teal-500",
    pink: "from-pink-500 to-rose-500",
    orange: "from-orange-500 to-amber-500" // Added for Lent
  };

  return (
    <div className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 group hover:border-gray-200 dark:hover:border-zinc-700 transition-all">
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</h3>
        </div>
        
        {/* Icon Container - Clickable */}
        <div 
            onClick={onIconClick}
            className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} text-white shadow-lg group-hover:scale-110 transition-transform ${onIconClick ? 'cursor-pointer hover:opacity-90 active:scale-95' : ''}`}
            title={onIconClick ? "Go to page" : ""}
        >
          {Icon && <Icon size={24} />}
        </div>
      </div>
      {subtext && <p className="mt-4 text-sm text-gray-400 z-10 relative">{subtext}</p>}
    </div>
  );
};

export default Card;