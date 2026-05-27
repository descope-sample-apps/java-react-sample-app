import { useEffect, useState } from 'react';
import { useSession, useUser } from '@descope/react-sdk';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FloatingShapes from '../components/FloatingShapes';
import GradientText from '../components/GradientText';
import PoweredBy from '../components/PoweredBy';

const Home = () => {
  const { isAuthenticated, isSessionLoading } = useSession();
  const { isUserLoading } = useUser();
  const [tenantId, setTenantId] = useState('');
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isSessionLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isSessionLoading, isAuthenticated, navigate]);

  if (!mounted || isSessionLoading || isUserLoading) return null;

  const startTenantSignIn = () => {
    if (!tenantId) {
      alert('Please enter a tenant ID');
      return;
    }
    navigate(`/signin?tenant=${encodeURIComponent(tenantId)}`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-black via-black to-blue-950/20 opacity-70" />
      <FloatingShapes />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center max-w-3xl mx-auto px-4 py-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <GradientText className="font-extrabold">
            Authenticate with Descope
          </GradientText>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8">
          Welcome to the Java + React Sample App &mdash;{' '}
          <a
            href="https://docs.descope.com/getting-started/react"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5cf34f] underline hover:no-underline"
          >
            view setup guide
          </a>
        </p>

        <div className="flex flex-col gap-4 items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/signin')}
            className="rounded-xl bg-gradient-to-r from-[#00A6B4] via-[#3DEFE9] to-[#5cf34f] px-8 py-3 text-base font-medium text-black shadow-lg border border-[#00A6B4] backdrop-blur-sm w-48 cursor-pointer"
          >
            Sign In
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.open('https://github.com/descope-sample-apps/java-react-sample-app', '_blank')}
            className="rounded-xl bg-black border border-[#5cf34f]/50 px-8 py-3 text-base font-medium text-white shadow-lg backdrop-blur-sm w-48 cursor-pointer"
          >
            View on GitHub
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 max-w-md mx-auto"
        >
          <h2 className="text-lg font-semibold mb-2 text-white">Tenant SSO Sign In</h2>
          <p className="text-sm text-gray-400 mb-4">
            Configure an{' '}
            <a
              href="https://docs.descope.com/auth-methods/sso/with-flows"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5cf34f] underline hover:no-underline"
            >
              SSO step
            </a>{' '}
            in your Descope flow, then enter your tenant ID.
          </p>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={tenantId}
              placeholder="Tenant ID"
              onChange={(e) => setTenantId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#5cf34f]/60"
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={startTenantSignIn}
              className="rounded-lg bg-[#00A6B4] hover:bg-[#00A6B4]/80 px-4 py-2 text-sm font-medium text-white"
            >
              Sign in via Tenant SSO
            </motion.button>
          </div>
        </motion.div>

        <PoweredBy />
      </motion.div>
    </div>
  );
};

export default Home;
