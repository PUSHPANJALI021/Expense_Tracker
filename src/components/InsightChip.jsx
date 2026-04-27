import { motion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useState, useCallback } from 'react';
import { generateInsight } from '../services/aiService';

export default function InsightChip({ transactions }) {
  const [insight, setInsight] = useState(() => generateInsight(transactions));

  const refresh = useCallback(() => {
    setInsight(generateInsight(transactions));
  }, [transactions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="card p-4 flex items-start gap-3"
      style={{
        background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.08))',
        border: '1px solid rgba(37,99,235,0.15)',
      }}
    >
      <div
        className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
        style={{ background: 'var(--accent-gradient)' }}
      >
        <Sparkles size={16} color="white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold mb-1" style={{ color: 'var(--accent-primary)' }}>
          AI Insight
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {insight}
        </p>
      </div>
      <motion.button
        whileHover={{ rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        onClick={refresh}
        className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer border-0 shrink-0"
        style={{ background: 'transparent', color: 'var(--accent-primary)' }}
        aria-label="Refresh insight"
      >
        <RefreshCw size={14} />
      </motion.button>
    </motion.div>
  );
}
