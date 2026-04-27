import { motion } from 'framer-motion';

export default function BadgeCard({ badge, earned, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 200 }}
      whileHover={{ y: -3, scale: 1.03 }}
      className="card p-4 flex flex-col items-center text-center cursor-default"
      style={{
        opacity: earned ? 1 : 0.4,
        filter: earned ? 'none' : 'grayscale(0.8)',
      }}
    >
      <div className="text-3xl mb-2">{badge.icon}</div>
      <p className="text-xs font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
        {badge.title}
      </p>
      <p className="text-[10px] leading-tight" style={{ color: 'var(--text-muted)' }}>
        {badge.desc}
      </p>
      {earned && (
        <span className="mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
          ✓ Earned
        </span>
      )}
    </motion.div>
  );
}
