import { motion } from 'framer-motion';
import { Target, Calendar, TrendingUp, Trash2 } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export default function GoalCard({ goal, onUpdate, onDelete, index = 0 }) {
  const percentage = goal.targetAmount > 0
    ? Math.min(Math.round((goal.savedAmount / goal.targetAmount) * 100), 100)
    : 0;

  const remaining = Math.max(goal.targetAmount - goal.savedAmount, 0);
  const daysLeft = Math.max(Math.ceil((new Date(goal.deadline) - new Date()) / 86400000), 0);
  const monthlySuggestion = daysLeft > 0 ? Math.round(remaining / Math.max(daysLeft / 30, 1)) : remaining;

  const getProgressColor = () => {
    if (percentage >= 80) return '#16a34a';
    if (percentage >= 50) return '#2563eb';
    return '#f59e0b';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -3 }}
      className="card p-6 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ background: `${getProgressColor()}15` }}
          >
            <Target size={20} style={{ color: getProgressColor() }} />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {goal.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Calendar size={12} style={{ color: 'var(--text-muted)' }} />
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                {daysLeft} days left
              </span>
            </div>
          </div>
        </div>
        {onDelete && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(goal.id)}
            className="flex items-center justify-center w-7 h-7 rounded-lg cursor-pointer border-0"
            style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}
          >
            <Trash2 size={13} />
          </motion.button>
        )}
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            {formatCurrency(goal.savedAmount)} saved
          </span>
          <span className="text-xs font-bold" style={{ color: getProgressColor() }}>
            {percentage}%
          </span>
        </div>
        <div className="progress-track" style={{ height: '10px' }}>
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            style={{ background: getProgressColor() }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            Target: {formatCurrency(goal.targetAmount)}
          </span>
        </div>
      </div>

      {/* Monthly Suggestion */}
      <div
        className="flex items-center gap-2 p-3 rounded-xl"
        style={{ background: 'var(--bg-input)' }}
      >
        <TrendingUp size={14} style={{ color: 'var(--accent-primary)' }} />
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Save <strong style={{ color: 'var(--accent-primary)' }}>{formatCurrency(monthlySuggestion)}/month</strong> to reach your goal
        </span>
      </div>

      {/* Quick Add */}
      {onUpdate && (
        <div className="flex gap-2">
          {[100, 500, 1000].map((amt) => (
            <motion.button
              key={amt}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onUpdate(goal.id, { savedAmount: Math.min(goal.savedAmount + amt, goal.targetAmount) })}
              className="flex-1 py-2 rounded-lg text-xs font-semibold cursor-pointer border-0 transition-all"
              style={{ background: 'var(--bg-input)', color: 'var(--accent-primary)' }}
            >
              +₹{amt}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
