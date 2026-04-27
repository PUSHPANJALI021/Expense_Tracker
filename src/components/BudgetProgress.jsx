import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/helpers';

export default function BudgetProgress({ spent, budget, currency = '₹' }) {
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  const getColor = () => {
    if (percentage >= 90) return 'var(--danger)';
    if (percentage >= 70) return 'var(--warning)';
    return 'var(--success)';
  };

  const getStatus = () => {
    if (percentage >= 90) return 'Over Budget!';
    if (percentage >= 70) return 'Getting Close';
    return 'On Track';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Budget Health
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            This month's spending progress
          </p>
        </div>
        <span
          className="badge text-xs font-semibold px-3 py-1 rounded-full"
          style={{
            background: percentage >= 90 ? 'var(--danger-bg)' : percentage >= 70 ? 'var(--warning-bg)' : 'var(--success-bg)',
            color: getColor(),
          }}
        >
          {getStatus()}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="progress-track mb-3" style={{ height: '12px' }}>
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          style={{
            background: `linear-gradient(90deg, ${getColor()}, ${percentage >= 70 ? '#f97316' : '#06b6d4'})`,
          }}
        />
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between text-xs">
        <span style={{ color: 'var(--text-muted)' }}>
          {formatCurrency(spent, currency)} spent
        </span>
        <span className="font-semibold" style={{ color: getColor() }}>
          {Math.round(percentage)}%
        </span>
        <span style={{ color: 'var(--text-muted)' }}>
          {formatCurrency(budget, currency)} budget
        </span>
      </div>
    </motion.div>
  );
}
