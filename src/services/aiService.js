/**
 * AI Insight Service — generates smart spending tips from transaction data.
 */

const TIPS = {
  food: [
    "You're spending a lot on food delivery. Try meal prepping twice a week — you could save ₹800+/month! 🍳",
    "Your food expenses are above average this week. Consider cooking at home more often. 🏠",
    "Eating out less could save you enough for a weekend trip by month end! 🚀",
  ],
  entertainment: [
    "Entertainment spending is high this month. Try free campus events instead! 🎭",
    "Streaming subscriptions adding up? Consider sharing plans with friends. 📺",
    "Your entertainment budget is 30% above last month — time to cut back? 🎮",
  ],
  transport: [
    "Transport costs are rising. Try carpooling or cycling for short distances! 🚲",
    "You've spent a lot on rides this week. Walking more could improve health & savings. 🚶",
  ],
  shopping: [
    "Impulse shopping alert! Wait 24 hours before non-essential purchases. 🛍️",
    "Shopping spree detected — try the 30-day rule for big purchases. 💡",
  ],
  general: [
    "Great job keeping expenses low this week! Keep it up. 💪",
    "Your savings rate is improving. You're on track for your goals! 🎯",
    "Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings. 📊",
    "You're doing well! Small daily savings compound into big results. 🌱",
    "Track every rupee — awareness is the first step to financial freedom. 🧠",
  ],
};

/**
 * Generates an AI insight based on recent spending patterns.
 * @param {Array} transactions - Array of transaction objects
 * @returns {string} A smart spending tip
 */
export function generateInsight(transactions) {
  if (!transactions || transactions.length === 0) {
    return "Start adding expenses to get personalized saving tips! 📝";
  }

  // Calculate category totals for expenses only
  const categoryTotals = {};
  const expenses = transactions.filter((t) => t.type === 'expense');

  expenses.forEach((t) => {
    const cat = (t.category || 'other').toLowerCase();
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(t.amount);
  });

  // Find highest spending category
  let maxCat = '';
  let maxAmount = 0;
  Object.entries(categoryTotals).forEach(([cat, amount]) => {
    if (amount > maxAmount) {
      maxCat = cat;
      maxAmount = amount;
    }
  });

  // Get relevant tips
  const categoryTips = TIPS[maxCat] || TIPS.general;
  const totalSpent = expenses.reduce((sum, t) => sum + Number(t.amount), 0);

  // If total spending is low, give positive feedback
  if (totalSpent < 500) {
    const positiveTips = TIPS.general.filter((t) => t.includes('Great') || t.includes('doing well'));
    return positiveTips[Math.floor(Math.random() * positiveTips.length)] || TIPS.general[0];
  }

  return categoryTips[Math.floor(Math.random() * categoryTips.length)];
}

/**
 * Get spending summary text
 */
export function getSpendingSummary(transactions, budget) {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const totalSpent = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
  const percentage = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;

  if (percentage >= 90) return { text: 'Budget Critical', status: 'danger' };
  if (percentage >= 70) return { text: 'Budget Warning', status: 'warning' };
  return { text: 'On Track', status: 'success' };
}
