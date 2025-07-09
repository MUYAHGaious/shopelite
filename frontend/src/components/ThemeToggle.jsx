import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative p-2 rounded-full transition-all duration-300 ${
        isDark 
          ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
          : 'bg-white hover:bg-gray-100 text-gray-800 shadow-lg'
      } ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 180 : 0,
          scale: isDark ? 0.8 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 10,
        }}
      >
        {isDark ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </motion.div>
      
      {/* Glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-full ${
          isDark ? 'bg-yellow-400' : 'bg-orange-400'
        }`}
        initial={false}
        animate={{
          opacity: isDark ? 0.2 : 0.1,
          scale: isDark ? 1.2 : 1.1,
        }}
        transition={{
          duration: 0.3,
        }}
        style={{
          filter: 'blur(8px)',
          zIndex: -1,
        }}
      />
    </motion.button>
  );
};

export default ThemeToggle;

