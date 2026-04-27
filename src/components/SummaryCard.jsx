import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const CARD_CONFIG = {
  budget: { icon: Wallet, gradient: 'linear-gradient(135deg, #2563eb, #7c3aed)', label: 'Monthly Budget' },
  spent: { icon: TrendingDown, gradient: 'linear-gradient(135deg, #ef4444, #f97316)', label: 'Total Spent' },
  saved: { icon: PiggyBank, gradient: 'linear-gradient(135deg, #16a34a, #06b6d4)', label: 'Total Saved' },
  income: { icon: TrendingUp, gradient: 'linear-gradient(135deg, #06b6d4, #2563eb)', label: 'Total Income' },
};

export default function SummaryCard({ type, amount, currency = '₹', index = 0 }) {
  const config = CARD_CONFIG[type] || CARD_CONFIG.budget;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="card p-5 flex items-start gap-4 cursor-default"
      whileHover={{ y: -2 }}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center w-12 h-12 rounded-2xl shrink-0"
        style={{ background: config.gradient }}
      >
        <Icon size={22} color="white" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
          {config.label}
        </p>
        <p className="text-xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>
          {formatCurrency(amount, currency)}
        </p>
      </div>
    </motion.div>
  );
}
