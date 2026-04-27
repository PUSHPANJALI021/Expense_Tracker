import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { useTransactions } from './hooks/useTransactions';
import { useTheme } from './hooks/useTheme';

/**
 * Page transition wrapper
 */
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const {
    transactions, settings, goals,
    addTransaction, deleteTransaction, updateTransaction,
    addGoal, updateGoal, deleteGoal,
    updateSettings, resetAllData,
  } = useTransactions();

  // Simple auth state (demo mode)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('spendsmart-loggedin') === 'true';
  });

  const handleLogin = (name) => {
    if (name) updateSettings({ userName: name });
    setIsLoggedIn(true);
    localStorage.setItem('spendsmart-loggedin', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('spendsmart-loggedin');
  };

  // Show Login if not authenticated
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={
                  <PageTransition>
                    <Dashboard
                      transactions={transactions}
                      settings={settings}
                      goals={goals}
                      isDark={isDark}
                      toggleTheme={toggleTheme}
                      addTransaction={addTransaction}
                      deleteTransaction={deleteTransaction}
                      updateGoal={updateGoal}
                    />
                  </PageTransition>
                }
              />
              <Route
                path="/analytics"
                element={
                  <PageTransition>
                    <Analytics transactions={transactions} />
                  </PageTransition>
                }
              />
              <Route
                path="/goals"
                element={
                  <PageTransition>
                    <Goals
                      goals={goals}
                      addGoal={addGoal}
                      updateGoal={updateGoal}
                      deleteGoal={deleteGoal}
                    />
                  </PageTransition>
                }
              />
              <Route
                path="/settings"
                element={
                  <PageTransition>
                    <Settings
                      settings={settings}
                      updateSettings={updateSettings}
                      resetAllData={resetAllData}
                      transactions={transactions}
                      isDark={isDark}
                      toggleTheme={toggleTheme}
                    />
                  </PageTransition>
                }
              />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </BrowserRouter>
  );
}
