import { motion } from 'framer-motion';

const GradientText = ({ children, className = "" }) => {
  return (
    <motion.span
      className={`bg-clip-text text-transparent bg-gradient-to-r from-[#5cf34f] via-[#02dfed] to-[#00a4c5] ${className}`}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      style={{ backgroundSize: "200% 200%" }}
    >
      {children}
    </motion.span>
  );
};

export default GradientText;
