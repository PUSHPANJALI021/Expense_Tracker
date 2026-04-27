/**
 * Helper utilities for SpendSmart
 */

/**
 * Format currency with Indian Rupee symbol
 */
export function formatCurrency(amount, currency = '₹') {
  const num = Number(amount) || 0;
  return `${currency}${num.toLocaleString('en-IN')}`;
}

/**
 * Format date to readable string
 */
export function formatDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  const dayMs = 86400000;

  if (diff < dayMs) return 'Today';
  if (diff < dayMs * 2) return 'Yesterday';
  if (diff < dayMs * 7) return `${Math.floor(diff / dayMs)} days ago`;

  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * Category config with colors and icons
 */
export const CATEGORIES = [
  { name: 'Food', icon: '🍔', color: '#f97316' },
  { name: 'Transport', icon: '🚌', color: '#06b6d4' },
  { name: 'Entertainment', icon: '🎮', color: '#8b5cf6' },
  { name: 'Shopping', icon: '🛍️', color: '#ec4899' },
  { name: 'Education', icon: '📚', color: '#2563eb' },
  { name: 'Health', icon: '💊', color: '#16a34a' },
  { name: 'Bills', icon: '📱', color: '#eab308' },
  { name: 'Rent', icon: '🏠', color: '#64748b' },
  { name: 'Subscriptions', icon: '📺', color: '#d946ef' },
  { name: 'Other', icon: '📦', color: '#78716c' },
];

/**
 * Get category config by name
 */
export function getCategoryConfig(name) {
  return CATEGORIES.find((c) => c.name.toLowerCase() === (name || '').toLowerCase()) || CATEGORIES[CATEGORIES.length - 1];
}

/**
 * Payment modes
 */
export const PAYMENT_MODES = ['UPI', 'Cash', 'Card', 'Net Banking', 'Wallet'];

/**
 * Generate unique ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

/**
 * Export data as CSV
 */
export function exportCSV(transactions) {
  const headers = ['Date', 'Title', 'Amount', 'Category', 'Type', 'Payment Mode', 'Note'];
  const rows = transactions.map((t) => [
    new Date(t.date).toLocaleDateString(),
    t.title,
    t.amount,
    t.category,
    t.type,
    t.paymentMode || '',
    t.note || '',
  ]);

  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `spendsmart_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Gamification badges
 */
export const BADGES = [
  { id: 'first_expense', title: 'First Step', desc: 'Added your first expense', icon: '🎯', condition: (txns) => txns.length >= 1 },
  { id: 'five_expenses', title: 'Tracking Pro', desc: 'Logged 5 expenses', icon: '📊', condition: (txns) => txns.filter((t) => t.type === 'expense').length >= 5 },
  { id: 'budget_setter', title: 'Budget Boss', desc: 'Set a monthly budget', icon: '💰', condition: (_, settings) => settings?.monthlyBudget > 0 },
  { id: 'saver', title: 'Smart Saver', desc: 'Saved 20%+ of budget', icon: '🏆', condition: (txns, settings) => {
    if (!settings?.monthlyBudget) return false;
    const spent = txns.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    return spent <= settings.monthlyBudget * 0.8;
  }},
  { id: 'goal_creator', title: 'Dream Chaser', desc: 'Created a savings goal', icon: '🚀', condition: (_, __, goals) => goals?.length >= 1 },
  { id: 'week_streak', title: 'Consistency King', desc: 'Logged expenses for 7 days', icon: '🔥', condition: (txns) => {
    const dates = new Set(txns.map((t) => new Date(t.date).toDateString()));
    return dates.size >= 7;
  }},
];

/**
 * Get earned badges
 */
export function getEarnedBadges(transactions, settings, goals) {
  return BADGES.filter((b) => b.condition(transactions, settings, goals));
}
