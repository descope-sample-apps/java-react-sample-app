import { useDescope, useSession, useUser, UserProfile } from '@descope/react-sdk';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TestApiComponent from '../components/TestApiComponent';
import GradientText from '../components/GradientText';
import PoweredBy from '../components/PoweredBy';

const Dashboard = () => {
  const { user, isUserLoading } = useUser();
  const { isAuthenticated, isSessionLoading } = useSession();
  const { logout } = useDescope();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSessionLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isSessionLoading, isAuthenticated, navigate]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  if (isSessionLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-t-2 border-[#5cf34f] rounded-full"
        />
      </div>
    );
  }

  if (!isAuthenticated || isUserLoading || !user) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative w-full py-12 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto px-8 text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Welcome, <GradientText>{user?.name || 'User'}</GradientText>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-8"
          >
            You are successfully authenticated with{' '}
            <a
              href="https://docs.descope.com/getting-started/react"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5cf34f] underline hover:no-underline"
            >
              Descope
            </a>
          </motion.p>

          <TestApiComponent />

          <div className="flex flex-col gap-4 items-center mt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-6 py-3 bg-[#5cf34f] hover:bg-[#5cf34f]/80 rounded-lg text-black font-medium"
            >
              Logout
            </motion.button>
          </div>

          <PoweredBy />

          <div className="mt-12 max-w-2xl mx-auto">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-2xl font-semibold text-left">
                <GradientText>Profile</GradientText>
              </h2>
              <a
                href="https://docs.descope.com/client-sdk/descope-components"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#5cf34f] underline hover:no-underline"
              >
                Widget docs &rarr;
              </a>
            </div>
            <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4">
              <UserProfile widgetId="user-profile-widget" theme="light" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
