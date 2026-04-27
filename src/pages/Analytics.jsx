import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { TrendingUp, DollarSign, BarChart3, PieChartIcon } from 'lucide-react';
import { getCategoryTotals, getWeeklyData, getMonthlyTrend, getAverageDailySpend, getHighestCategory } from '../utils/calculations';
import { formatCurrency, getCategoryConfig } from '../utils/helpers';

const CHART_COLORS = ['#2563eb', '#7c3aed', '#f97316', '#06b6d4', '#ec4899', '#16a34a', '#eab308', '#64748b', '#d946ef', '#78716c'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card p-3" style={{ boxShadow: 'var(--shadow-lg)', minWidth: '120px' }}>
      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function Analytics({ transactions }) {
  const categoryTotals = getCategoryTotals(transactions);
  const weeklyData = getWeeklyData(transactions);
  const monthlyTrend = getMonthlyTrend(transactions);
  const avgDaily = getAverageDailySpend(transactions);
  const highest = getHighestCategory(transactions);

  // Pie data
  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
    color: getCategoryConfig(name).color,
  }));

  const totalExpenses = Object.values(categoryTotals).reduce((s, v) => s + v, 0);

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
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Analytics
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Your spending insights and trends
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Expenses', value: formatCurrency(totalExpenses), icon: DollarSign, color: '#ef4444' },
          { label: 'Avg Daily', value: formatCurrency(avgDaily), icon: TrendingUp, color: '#2563eb' },
          { label: 'Top Category', value: highest.category, icon: PieChartIcon, color: '#7c3aed' },
          { label: 'Top Spent', value: formatCurrency(highest.amount), icon: BarChart3, color: '#f97316' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -3 }}
            className="card p-5 flex items-center gap-3"
          >
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
              style={{ background: `${stat.color}15` }}
            >
              <stat.icon size={18} style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
              <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <motion.div variants={itemVariants} className="card p-6">
          <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Spending by Category
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px]">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No data yet</p>
            </div>
          )}
        </motion.div>

        {/* Weekly Bar Chart */}
        <motion.div variants={itemVariants} className="card p-6">
          <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            This Week's Spending
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" name="Spent" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Line Chart */}
        <motion.div variants={itemVariants} className="card p-6 lg:col-span-2">
          <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            6-Month Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{value}</span>}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ fill: '#ef4444', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#16a34a"
                strokeWidth={2.5}
                dot={{ fill: '#16a34a', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
}
