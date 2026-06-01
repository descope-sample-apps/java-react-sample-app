import { motion } from 'framer-motion';

const PoweredBy = ({ label = "Java + React Sample App" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-8 px-4 py-3 rounded-xl bg-white/5 backdrop-blur-xs border border-[#5cf34f]/50 inline-block"
    >
      <div className="flex items-center justify-center gap-2">
        <motion.div
          animate={{ opacity: [1, 0.4, 1], scale: [1, 0.9, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-2 h-2 rounded-full bg-[#5cf34f] shadow-[0_0_8px_#5cf34f]"
        />
        <p className="text-sm text-gray-400">
          {label} Powered by{' '}
          <a
            href="https://descope.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5cf34f] underline hover:no-underline transition-colors"
          >
            Descope
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default PoweredBy;
