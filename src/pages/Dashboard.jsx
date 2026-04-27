import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import SummaryCard from '../components/SummaryCard';
import BudgetProgress from '../components/BudgetProgress';
import InsightChip from '../components/InsightChip';
import CategoryGrid from '../components/CategoryGrid';
import TransactionList from '../components/TransactionList';
import GoalCard from '../components/GoalCard';
import BadgeCard from '../components/BadgeCard';
import ExpenseForm from '../components/ExpenseForm';
import { BADGES, getEarnedBadges } from '../utils/helpers';

export default function Dashboard({
  transactions, settings, goals, isDark, toggleTheme,
  addTransaction, deleteTransaction, updateGoal,
}) {
  const [showForm, setShowForm] = useState(false);

  // Summary calculations
  const now = new Date();
  const monthTxns = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const totalExpense = monthTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
  const totalIncome = monthTxns.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const budget = settings.monthlyBudget || 0;
  const saved = Math.max(budget - totalExpense, 0);

  // Category breakdown
  const categoryTotals = {};
  monthTxns.filter((t) => t.type === 'expense').forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
  });

  // Badges
  const earnedBadges = getEarnedBadges(transactions, settings, goals);

  return (
    <div>
      <Navbar userName={settings.userName} isDark={isDark} toggleTheme={toggleTheme} />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard type="budget" amount={budget} currency={settings.currency} index={0} />
        <SummaryCard type="spent" amount={totalExpense} currency={settings.currency} index={1} />
        <SummaryCard type="saved" amount={saved} currency={settings.currency} index={2} />
        <SummaryCard type="income" amount={totalIncome} currency={settings.currency} index={3} />
      </div>

      {/* Budget Progress + AI Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <BudgetProgress spent={totalExpense} budget={budget} currency={settings.currency} />
        <InsightChip transactions={transactions} />
      </div>

      {/* Category Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          Spending by Category
        </h2>
        <CategoryGrid categoryTotals={categoryTotals} />
      </motion.div>

      {/* Transactions + Goals/Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Recent Transactions
            </h2>
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              {transactions.length} total
            </span>
          </div>
          <TransactionList transactions={transactions} onDelete={deleteTransaction} limit={8} />
        </div>

        {/* Right Column — Goals + Badges */}
        <div className="flex flex-col gap-6">
          {/* Goals Preview */}
          <div>
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              Savings Goals
            </h2>
            <div className="flex flex-col gap-3">
              {goals.slice(0, 2).map((goal, i) => (
                <GoalCard key={goal.id} goal={goal} onUpdate={updateGoal} index={i} />
              ))}
              {goals.length === 0 && (
                <div className="card p-6 text-center">
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No goals yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Badges */}
          <div>
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              Achievements
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {BADGES.map((badge, i) => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  earned={earnedBadges.some((b) => b.id === badge.id)}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <motion.button
        className="fab"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowForm(true)}
        aria-label="Add transaction"
      >
        <Plus size={24} />
      </motion.button>

      {/* Expense Form Modal */}
      {showForm && (
        <ExpenseForm onSubmit={addTransaction} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
