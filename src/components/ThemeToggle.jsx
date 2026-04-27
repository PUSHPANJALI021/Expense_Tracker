import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ isDark, toggleTheme }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative flex items-center w-14 h-7 rounded-full cursor-pointer border-0 p-0.5 transition-colors duration-300"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #1e293b, #334155)'
          : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
        border: '1px solid var(--border)',
      }}
      aria-label="Toggle dark mode"
    >
      <motion.div
        className="flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-md"
        animate={{ x: isDark ? 26 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isDark ? <Moon size={12} color="#334155" /> : <Sun size={12} color="#f59e0b" />}
      </motion.div>
    </motion.button>
  );
}
