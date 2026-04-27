import { motion } from 'framer-motion';
import { Trash2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatCurrency, formatDate, getCategoryConfig } from '../utils/helpers';

export default function TransactionList({ transactions, onDelete, limit }) {
  const displayTxns = limit ? transactions.slice(0, limit) : transactions;

  if (displayTxns.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-4xl mb-3">📝</p>
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          No transactions yet. Start tracking!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {displayTxns.map((txn, i) => {
        const catConfig = getCategoryConfig(txn.category);
        const isExpense = txn.type === 'expense';

        return (
          <motion.div
            key={txn.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card flex items-center gap-3 p-4 group"
          >
            {/* Category Icon */}
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl text-lg shrink-0"
              style={{ background: `${catConfig.color}15` }}
            >
              {catConfig.icon}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                {txn.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  {formatDate(txn.date)}
                </span>
                {txn.paymentMode && (
                  <>
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>•</span>
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      {txn.paymentMode}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Amount */}
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-bold flex items-center gap-1"
                  style={{ color: isExpense ? 'var(--danger)' : 'var(--success)' }}>
                  {isExpense ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                  {isExpense ? '−' : '+'}{formatCurrency(txn.amount)}
                </p>
              </div>

              {/* Delete */}
              {onDelete && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDelete(txn.id)}
                  className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer border-0 transition-opacity"
                  style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}
                >
                  <Trash2 size={14} />
                </motion.button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
