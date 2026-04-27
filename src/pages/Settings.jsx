import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Palette, Download, Trash2, DollarSign, Globe, Shield } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { exportCSV } from '../utils/helpers';

export default function Settings({
  settings, updateSettings, resetAllData, transactions,
  isDark, toggleTheme,
}) {
  const [editName, setEditName] = useState(settings.userName || '');
  const [editBudget, setEditBudget] = useState(settings.monthlyBudget || '');
  const [showReset, setShowReset] = useState(false);

  const handleSaveProfile = () => {
    updateSettings({ userName: editName, monthlyBudget: Number(editBudget) });
  };

  const handleExportCSV = () => {
    exportCSV(transactions);
  };

  const handleExportPDF = () => {
    // Using jsPDF for PDF export
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('SpendSmart — Expense Report', 20, 25);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 35);
      doc.text(`Total Transactions: ${transactions.length}`, 20, 42);

      let y = 55;
      doc.setFontSize(9);
      doc.text('Date', 20, y);
      doc.text('Title', 55, y);
      doc.text('Category', 110, y);
      doc.text('Amount', 155, y);
      doc.text('Type', 180, y);
      y += 8;

      transactions.slice(0, 40).forEach((t) => {
        doc.text(new Date(t.date).toLocaleDateString(), 20, y);
        doc.text(t.title.slice(0, 25), 55, y);
        doc.text(t.category || '', 110, y);
        doc.text(`₹${t.amount}`, 155, y);
        doc.text(t.type, 180, y);
        y += 6;
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      });

      doc.save(`spendsmart_${new Date().toISOString().slice(0, 10)}.pdf`);
    });
  };

  const currencies = [
    { symbol: '₹', name: 'INR' },
    { symbol: '$', name: 'USD' },
    { symbol: '€', name: 'EUR' },
    { symbol: '£', name: 'GBP' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-2xl">
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Customize your SpendSmart experience
        </p>
      </motion.div>

      {/* Profile Section */}
      <motion.div variants={itemVariants} className="card p-6 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
            <User size={18} color="white" />
          </div>
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Profile</h3>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
              Display Name
            </label>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="input"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
              Monthly Budget
            </label>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold" style={{ color: 'var(--accent-primary)' }}>
                {settings.currency || '₹'}
              </span>
              <input
                type="number"
                value={editBudget}
                onChange={(e) => setEditBudget(e.target.value)}
                className="input"
                placeholder="10000"
                min="0"
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveProfile}
            className="btn-primary self-start"
          >
            Save Changes
          </motion.button>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div variants={itemVariants} className="card p-6 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
            <Palette size={18} color="white" />
          </div>
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Appearance</h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Dark Mode</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Switch between light and dark themes
            </p>
          </div>
          <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
        </div>
      </motion.div>

      {/* Currency */}
      <motion.div variants={itemVariants} className="card p-6 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #2563eb)' }}>
            <Globe size={18} color="white" />
          </div>
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Currency</h3>
        </div>

        <div className="flex gap-2 flex-wrap">
          {currencies.map((c) => (
            <motion.button
              key={c.symbol}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateSettings({ currency: c.symbol })}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-0 transition-all"
              style={{
                background: settings.currency === c.symbol ? 'var(--accent-primary)' : 'var(--bg-input)',
                color: settings.currency === c.symbol ? 'white' : 'var(--text-secondary)',
              }}
            >
              {c.symbol} {c.name}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Export */}
      <motion.div variants={itemVariants} className="card p-6 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #16a34a, #06b6d4)' }}>
            <Download size={18} color="white" />
          </div>
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Export Data</h3>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportCSV}
            className="btn-secondary"
          >
            <Download size={14} />
            Export CSV
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportPDF}
            className="btn-secondary"
          >
            <Download size={14} />
            Export PDF
          </motion.button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div variants={itemVariants} className="card p-6"
        style={{ border: '1px solid var(--danger)', background: 'var(--danger-bg)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ background: 'var(--danger)' }}>
            <Shield size={18} color="white" />
          </div>
          <h3 className="text-sm font-bold" style={{ color: 'var(--danger)' }}>Danger Zone</h3>
        </div>

        {!showReset ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowReset(true)}
            className="btn-danger"
          >
            <Trash2 size={14} />
            Reset All Data
          </motion.button>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium" style={{ color: 'var(--danger)' }}>
              Are you sure? This cannot be undone.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { resetAllData(); setShowReset(false); }}
              className="btn-danger"
            >
              Confirm Reset
            </motion.button>
            <button
              onClick={() => setShowReset(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
