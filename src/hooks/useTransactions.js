import { useState, useCallback, useEffect } from 'react';
import { generateId } from '../utils/helpers';
import { getMonthlyTotal, getCategoryTotals } from '../utils/calculations';

// Realistic demo data for students
const DEMO_TRANSACTIONS = [
  { id: generateId(), title: 'Zomato Order', amount: 320, category: 'Food', date: new Date().toISOString().slice(0, 10), type: 'expense', paymentMode: 'UPI', note: 'Biryani night' },
  { id: generateId(), title: 'Auto Rickshaw', amount: 80, category: 'Transport', date: new Date().toISOString().slice(0, 10), type: 'expense', paymentMode: 'Cash', note: 'College to hostel' },
  { id: generateId(), title: 'Netflix Subscription', amount: 199, category: 'Subscriptions', date: new Date(Date.now() - 86400000).toISOString().slice(0, 10), type: 'expense', paymentMode: 'Card', note: 'Monthly plan' },
  { id: generateId(), title: 'Freelance Payment', amount: 5000, category: 'Other', date: new Date(Date.now() - 86400000).toISOString().slice(0, 10), type: 'income', paymentMode: 'UPI', note: 'Logo design project' },
  { id: generateId(), title: 'Grocery Shopping', amount: 850, category: 'Food', date: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10), type: 'expense', paymentMode: 'UPI', note: 'Weekly groceries' },
  { id: generateId(), title: 'Books - DSA', amount: 450, category: 'Education', date: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10), type: 'expense', paymentMode: 'Card', note: 'Data Structures textbook' },
  { id: generateId(), title: 'Movie Night', amount: 350, category: 'Entertainment', date: new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10), type: 'expense', paymentMode: 'UPI', note: 'Marvel movie + popcorn' },
  { id: generateId(), title: 'Monthly Allowance', amount: 15000, category: 'Other', date: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10), type: 'income', paymentMode: 'Net Banking', note: 'From parents' },
  { id: generateId(), title: 'Gym Membership', amount: 500, category: 'Health', date: new Date(Date.now() - 4 * 86400000).toISOString().slice(0, 10), type: 'expense', paymentMode: 'UPI', note: 'Monthly gym fee' },
  { id: generateId(), title: 'Bus Pass', amount: 300, category: 'Transport', date: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10), type: 'expense', paymentMode: 'Cash', note: 'Monthly bus pass' },
  { id: generateId(), title: 'Chai & Snacks', amount: 120, category: 'Food', date: new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10), type: 'expense', paymentMode: 'Cash', note: 'Canteen hangout' },
  { id: generateId(), title: 'Phone Recharge', amount: 299, category: 'Bills', date: new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10), type: 'expense', paymentMode: 'UPI', note: 'Jio 28-day plan' },
  { id: generateId(), title: 'T-Shirt Online', amount: 699, category: 'Shopping', date: new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10), type: 'expense', paymentMode: 'Card', note: 'Myntra sale' },
  { id: generateId(), title: 'Electricity Bill', amount: 400, category: 'Bills', date: new Date(Date.now() - 8 * 86400000).toISOString().slice(0, 10), type: 'expense', paymentMode: 'UPI', note: 'Shared with roommate' },
  { id: generateId(), title: 'Udemy Course', amount: 449, category: 'Education', date: new Date(Date.now() - 10 * 86400000).toISOString().slice(0, 10), type: 'expense', paymentMode: 'Card', note: 'React Advanced' },
  { id: generateId(), title: 'Coffee Date', amount: 280, category: 'Food', date: new Date(Date.now() - 9 * 86400000).toISOString().slice(0, 10), type: 'expense', paymentMode: 'UPI', note: 'Starbucks' },
  { id: generateId(), title: 'Tutoring Income', amount: 3000, category: 'Other', date: new Date(Date.now() - 12 * 86400000).toISOString().slice(0, 10), type: 'income', paymentMode: 'Cash', note: 'Math tutoring' },
  { id: generateId(), title: 'Medicines', amount: 230, category: 'Health', date: new Date(Date.now() - 11 * 86400000).toISOString().slice(0, 10), type: 'expense', paymentMode: 'Cash', note: 'Cold & cough' },
  { id: generateId(), title: 'Spotify Premium', amount: 59, category: 'Subscriptions', date: new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10), type: 'expense', paymentMode: 'Card', note: 'Student plan' },
  { id: generateId(), title: 'Stationery', amount: 180, category: 'Education', date: new Date(Date.now() - 15 * 86400000).toISOString().slice(0, 10), type: 'expense', paymentMode: 'Cash', note: 'Pens, notebooks' },
];

const STORAGE_KEY = 'spendsmart-transactions';
const SETTINGS_KEY = 'spendsmart-settings';
const GOALS_KEY = 'spendsmart-goals';

/**
 * Main hook for managing all transaction data, settings, and goals.
 * Uses localStorage for persistence (Supabase integration ready).
 */
export function useTransactions() {
  // Transactions
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEMO_TRANSACTIONS;
  });

  // Settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : { monthlyBudget: 10000, currency: '₹', userName: 'Student' };
  });

  // Goals
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem(GOALS_KEY);
    return saved ? JSON.parse(saved) : [
      { id: generateId(), title: 'New Laptop', targetAmount: 50000, savedAmount: 12000, deadline: '2026-08-01' },
      { id: generateId(), title: 'Goa Trip', targetAmount: 8000, savedAmount: 3500, deadline: '2026-06-15' },
      { id: generateId(), title: 'Emergency Fund', targetAmount: 20000, savedAmount: 5500, deadline: '2026-12-31' },
    ];
  });

  // Persist to localStorage
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem(GOALS_KEY, JSON.stringify(goals)); }, [goals]);

  // Transaction CRUD
  const addTransaction = useCallback((txn) => {
    const newTxn = { ...txn, id: generateId() };
    setTransactions((prev) => [newTxn, ...prev]);
    return newTxn;
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateTransaction = useCallback((id, updates) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  // Summary calculations
  const getMonthlySummary = useCallback(() => {
    const totalExpense = getMonthlyTotal(transactions, 'expense');
    const totalIncome = getMonthlyTotal(transactions, 'income');
    const budget = settings.monthlyBudget || 0;
    const saved = budget - totalExpense;
    const budgetUsed = budget > 0 ? Math.min((totalExpense / budget) * 100, 100) : 0;

    return { totalExpense, totalIncome, budget, saved, budgetUsed };
  }, [transactions, settings.monthlyBudget]);

  const getCategoryBreakdown = useCallback(() => {
    return getCategoryTotals(transactions);
  }, [transactions]);

  // Goal CRUD
  const addGoal = useCallback((goal) => {
    const newGoal = { ...goal, id: generateId(), savedAmount: 0 };
    setGoals((prev) => [...prev, newGoal]);
  }, []);

  const updateGoal = useCallback((id, updates) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  }, []);

  const deleteGoal = useCallback((id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  // Settings update
  const updateSettings = useCallback((updates) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  // Reset all data
  const resetAllData = useCallback(() => {
    setTransactions(DEMO_TRANSACTIONS);
    setSettings({ monthlyBudget: 10000, currency: '₹', userName: 'Student' });
    setGoals([]);
  }, []);

  return {
    transactions,
    settings,
    goals,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    getMonthlySummary,
    getCategoryBreakdown,
    addGoal,
    updateGoal,
    deleteGoal,
    updateSettings,
    resetAllData,
  };
}
