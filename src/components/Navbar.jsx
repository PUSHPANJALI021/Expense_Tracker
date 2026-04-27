import { motion } from 'framer-motion';
import { Search, Bell, Moon, Sun } from 'lucide-react';

export default function Navbar({ userName, isDark, toggleTheme }) {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between mb-8 flex-wrap gap-4"
    >
      {/* Greeting */}
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          {greeting()}, 
        </p>
        <h1 className="text-2xl font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
          {userName || 'Student'} 👋
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search transactions..."
            className="bg-transparent outline-none text-sm w-40"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>

        {/* Notification */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer border-0"
          style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}
        >
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
            style={{ background: 'var(--danger)' }}>
            2
          </span>
        </motion.button>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer border-0"
          style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>
      </div>
    </motion.header>
  );
}
