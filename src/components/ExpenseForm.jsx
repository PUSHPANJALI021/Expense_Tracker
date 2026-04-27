import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Users, Plus } from 'lucide-react';
import { CATEGORIES, PAYMENT_MODES } from '../utils/helpers';

export default function ExpenseForm({ onSubmit, onClose }) {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().slice(0, 10),
    note: '',
    type: 'expense',
    paymentMode: 'UPI',
    splitWith: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;
    onSubmit({ ...form, amount: Number(form.amount) });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Add Transaction
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer border-0"
              style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}
            >
              <X size={16} />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Type Toggle */}
            <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {['expense', 'income'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, type: t }))}
                  className="flex-1 py-2.5 text-sm font-semibold cursor-pointer border-0 transition-all duration-200"
                  style={{
                    background: form.type === t
                      ? (t === 'expense' ? 'var(--danger)' : 'var(--success)')
                      : 'transparent',
                    color: form.type === t ? 'white' : 'var(--text-secondary)',
                  }}
                >
                  {t === 'expense' ? '− Expense' : '+ Income'}
                </button>
              ))}
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Zomato Order"
                className="input"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                Amount (₹)
              </label>
              <input
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                placeholder="0"
                className="input"
                style={{ fontSize: '1.25rem', fontWeight: 700 }}
                min="1"
                required
              />
            </div>

            {/* Category & Date Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Category
                </label>
                <select name="category" value={form.category} onChange={handleChange} className="input">
                  {CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Date
                </label>
                <input name="date" type="date" value={form.date} onChange={handleChange} className="input" />
              </div>
            </div>

            {/* Payment Mode */}
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                Payment Mode
              </label>
              <div className="flex gap-2 flex-wrap">
                {PAYMENT_MODES.map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, paymentMode: mode }))}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border-0 transition-all"
                    style={{
                      background: form.paymentMode === mode ? 'var(--accent-primary)' : 'var(--bg-input)',
                      color: form.paymentMode === mode ? 'white' : 'var(--text-secondary)',
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                Note (optional)
              </label>
              <input
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Add a note..."
                className="input"
              />
            </div>

            {/* Receipt Upload */}
            <div className="flex items-center gap-3">
              <label
                className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer text-xs font-medium transition-all"
                style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px dashed var(--border)' }}
              >
                <Upload size={14} />
                Upload Receipt
                <input type="file" accept="image/*" className="hidden" />
              </label>

              {/* Split Toggle */}
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium"
                style={{ color: 'var(--text-secondary)' }}>
                <input
                  name="splitWith"
                  type="checkbox"
                  checked={form.splitWith}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-blue-600"
                />
                <Users size={14} />
                Split
              </label>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              className="btn-primary w-full py-3 mt-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={16} />
              Add {form.type === 'expense' ? 'Expense' : 'Income'}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
