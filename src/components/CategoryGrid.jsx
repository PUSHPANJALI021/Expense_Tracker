import { motion } from 'framer-motion';
import { getCategoryConfig, formatCurrency } from '../utils/helpers';

export default function CategoryGrid({ categoryTotals }) {
  const entries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const maxAmount = entries.length > 0 ? entries[0][1] : 1;

  if (entries.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No category data yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {entries.map(([category, amount], i) => {
        const config = getCategoryConfig(category);
        const percentage = Math.round((amount / maxAmount) * 100);

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4, boxShadow: 'var(--shadow-md)' }}
            className="card p-4 flex flex-col items-center text-center cursor-default"
          >
            <div
              className="flex items-center justify-center w-11 h-11 rounded-2xl text-xl mb-2.5"
              style={{ background: `${config.color}15` }}
            >
              {config.icon}
            </div>
            <p className="text-xs font-semibold mb-1 truncate w-full" style={{ color: 'var(--text-primary)' }}>
              {category}
            </p>
            <p className="text-sm font-bold" style={{ color: config.color }}>
              {formatCurrency(amount)}
            </p>
            {/* Mini bar */}
            <div className="w-full mt-2.5 rounded-full overflow-hidden" style={{ height: '4px', background: 'var(--bg-input)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="h-full rounded-full"
                style={{ background: config.color }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
