import { motion } from 'framer-motion';

const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#02dfed]/20 to-[#5cf34f]/20 blur-3xl"
        animate={{
          x: ["-20%", "5%", "-10%"],
          y: ["5%", "-20%", "10%"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{ top: '10%', left: '60%' }}
      />

      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full bg-[#00A6B4]/15 blur-3xl"
        animate={{
          x: ["10%", "-15%", "5%"],
          y: ["-10%", "15%", "-5%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{ top: '50%', left: '25%' }}
      />

      <motion.div
        className="absolute w-[200px] h-[200px] rounded-full bg-[#5cf34f]/20 blur-2xl"
        animate={{
          x: ["-5%", "10%", "-15%"],
          y: ["10%", "-10%", "5%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{ top: '70%', left: '70%' }}
      />
    </div>
  );
};

export default FloatingShapes;
