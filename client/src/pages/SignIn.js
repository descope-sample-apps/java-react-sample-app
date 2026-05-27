import { Descope, useSession } from '@descope/react-sdk';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import FloatingShapes from '../components/FloatingShapes';
import GradientText from '../components/GradientText';
import PoweredBy from '../components/PoweredBy';

const SignIn = () => {
  const { isAuthenticated, isSessionLoading } = useSession();
  const [searchParams] = useSearchParams();
  const tenant = searchParams.get('tenant') || undefined;
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

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-black via-black to-blue-950/20 opacity-70" />
      <FloatingShapes />

      <div className="relative pt-12 pb-6 md:pt-20 md:pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto px-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <h1 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight">
              <GradientText className="font-extrabold">
                {tenant ? `Sign in (tenant: ${tenant})` : 'Authenticate with Descope'}
              </GradientText>
            </h1>
          </motion.div>

          <PoweredBy />
        </motion.div>
      </div>

      <div className="relative max-w-sm mx-auto mt-2 px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-white/10 rounded-xl shadow-2xl border border-white/20 overflow-hidden"
        >
          <Descope
            flowId="sign-up-or-in"
            tenant={tenant}
            theme="light"
            onSuccess={(e) => console.log(e.detail.user)}
            onError={() => console.log('Could not log in!')}
          />
        </motion.div>
        <p className="text-center text-xs text-gray-500 mt-4">
          Customize this flow in the{' '}
          <a
            href="https://docs.descope.com/flows"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5cf34f] underline hover:no-underline"
          >
            Descope flow editor
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
