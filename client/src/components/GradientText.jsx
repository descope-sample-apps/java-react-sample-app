import { motion } from 'framer-motion';

const GradientText = ({ children, className = "" }) => {
  return (
    <motion.span
      className={`bg-clip-text text-transparent bg-linear-to-r from-[#5cf34f] via-[#02dfed] to-[#00a4c5] ${className}`}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      style={{ backgroundSize: "200% 200%" }}
    >
      {children}
    </motion.span>
  );
};

export default GradientText;
