/**
 * Utility calculations for SpendSmart
 */

/**
 * Calculate total expenses for a given month/year
 */
export function getMonthlyTotal(transactions, type = 'expense', month, year) {
  const now = new Date();
  const m = month ?? now.getMonth();
  const y = year ?? now.getFullYear();

  return transactions
    .filter((t) => {
      const d = new Date(t.date);
      return t.type === type && d.getMonth() === m && d.getFullYear() === y;
    })
    .reduce((sum, t) => sum + Number(t.amount), 0);
}

/**
 * Get totals by category
 */
export function getCategoryTotals(transactions) {
  const totals = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const cat = t.category || 'Other';
      totals[cat] = (totals[cat] || 0) + Number(t.amount);
    });
  return totals;
}

/**
 * Get weekly spending data for charts
 */
export function getWeeklyData(transactions) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekData = days.map((day) => ({ day, amount: 0 }));

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  transactions
    .filter((t) => {
      const d = new Date(t.date);
      return t.type === 'expense' && d >= weekStart;
    })
    .forEach((t) => {
      const d = new Date(t.date);
      weekData[d.getDay()].amount += Number(t.amount);
    });

  return weekData;
}

/**
 * Get monthly spending data for the past 6 months
 */
export function getMonthlyTrend(transactions) {
  const months = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = d.toLocaleString('default', { month: 'short' });
    const total = getMonthlyTotal(transactions, 'expense', d.getMonth(), d.getFullYear());
    const income = getMonthlyTotal(transactions, 'income', d.getMonth(), d.getFullYear());
    months.push({ month: monthName, expenses: total, income });
  }

  return months;
}

/**
 * Calculate average daily spend for current month
 */
export function getAverageDailySpend(transactions) {
  const now = new Date();
  const dayOfMonth = now.getDate();
  const monthTotal = getMonthlyTotal(transactions, 'expense');
  return dayOfMonth > 0 ? Math.round(monthTotal / dayOfMonth) : 0;
}

/**
 * Get highest spending category
 */
export function getHighestCategory(transactions) {
  const totals = getCategoryTotals(transactions);
  let maxCat = 'None';
  let maxAmt = 0;

  Object.entries(totals).forEach(([cat, amt]) => {
    if (amt > maxAmt) {
      maxCat = cat;
      maxAmt = amt;
    }
  });

  return { category: maxCat, amount: maxAmt };
}
