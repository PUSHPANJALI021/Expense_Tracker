import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, BarChart3, Target, Settings, Wallet } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/goals', icon: Target, label: 'Goals' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[72px] flex-col items-center py-6 z-30"
        style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)' }}>

        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-8 flex items-center justify-center w-10 h-10 rounded-xl"
          style={{ background: 'var(--accent-gradient)' }}
        >
          <Wallet size={20} color="white" />
        </motion.div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-2 flex-1">
          {NAV_ITEMS.map((item, i) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'}>
              {({ isActive }) => (
                <div className="tooltip-wrapper">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 cursor-pointer"
                    style={{
                      background: isActive ? 'var(--accent-primary)' : 'transparent',
                      color: isActive ? 'white' : 'var(--text-secondary)',
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon size={20} />
                  </motion.div>
                  <span className="tooltip-text">{item.label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around py-2 px-4"
        style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', backdropFilter: 'blur(20px)' }}>
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.path} to={item.path} end={item.path === '/'}>
            {({ isActive }) => (
              <motion.div
                className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl"
                style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)' }}
                whileTap={{ scale: 0.9 }}
              >
                <item.icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
