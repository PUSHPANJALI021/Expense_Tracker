import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Target } from 'lucide-react';
import GoalCard from '../components/GoalCard';

export default function Goals({ goals, addGoal, updateGoal, deleteGoal }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', targetAmount: '', deadline: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.targetAmount) return;
    addGoal({ ...form, targetAmount: Number(form.targetAmount) });
    setForm({ title: '', targetAmount: '', deadline: '' });
    setShowForm(false);
  };

  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSaved = goals.reduce((s, g) => s + g.savedAmount, 0);
  const overallPercent = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Savings Goals
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Track your financial milestones
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <Plus size={16} />
          New Goal
        </motion.button>
      </motion.div>

      {/* Overall Progress */}
      <motion.div variants={itemVariants} className="card p-6 mb-8"
        style={{
          background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.08))',
          border: '1px solid rgba(37,99,235,0.15)',
        }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl"
            style={{ background: 'var(--accent-gradient)' }}>
            <Target size={22} color="white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Overall Progress
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {goals.length} active goal{goals.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold gradient-text">{overallPercent}%</p>
          </div>
        </div>
        <div className="progress-track" style={{ height: '10px' }}>
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${overallPercent}%` }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            style={{ background: 'var(--accent-gradient)' }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>₹{totalSaved.toLocaleString()} saved</span>
          <span>₹{totalTarget.toLocaleString()} target</span>
        </div>
      </motion.div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal, i) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onUpdate={updateGoal}
            onDelete={deleteGoal}
            index={i}
          />
        ))}
      </div>

      {goals.length === 0 && (
        <motion.div variants={itemVariants} className="card p-12 text-center mt-4">
          <p className="text-4xl mb-3">🎯</p>
          <p className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            No goals yet
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Create your first savings goal to start tracking!
          </p>
        </motion.div>
      )}

      {/* New Goal Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  New Savings Goal
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowForm(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer border-0"
                  style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}
                >
                  <X size={16} />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                    Goal Title
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="e.g., New Laptop"
                    className="input"
                    required
                  />
                </div>

                {/* Quick Templates */}
                <div className="flex gap-2 flex-wrap">
                  {['New Laptop', 'Trip Fund', 'Emergency Fund', 'Course Fee', 'Gadget'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, title: t }))}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border-0 transition-all"
                      style={{
                        background: form.title === t ? 'var(--accent-primary)' : 'var(--bg-input)',
                        color: form.title === t ? 'white' : 'var(--text-secondary)',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                    Target Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={form.targetAmount}
                    onChange={(e) => setForm((p) => ({ ...p, targetAmount: e.target.value }))}
                    placeholder="50000"
                    className="input"
                    min="100"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm((p) => ({ ...p, deadline: e.target.value }))}
                    className="input"
                    min={new Date().toISOString().slice(0, 10)}
                  />
                </div>

                <motion.button
                  type="submit"
                  className="btn-primary w-full py-3 mt-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Target size={16} />
                  Create Goal
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
