import React from 'react';
import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 1.5
      }}
      className="relative flex items-center"
    >
      <div className="relative w-10 h-10">
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#06B6D4' }} />
              <stop offset="50%" style={{ stopColor: '#0EA5E9' }} />
              <stop offset="100%" style={{ stopColor: '#2563EB' }} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="neon-dual">
              <feFlood floodColor="#06B6D4" floodOpacity="0.5" />
              <feComposite operator="in" in2="SourceGraphic" />
              <feGaussianBlur stdDeviation="2" />
              <feOffset dx="-1" dy="-1" />
              <feComposite operator="over" in2="SourceGraphic" />
              <feFlood floodColor="#2563EB" floodOpacity="0.5" />
              <feComposite operator="in" in2="SourceGraphic" />
              <feGaussianBlur stdDeviation="2" />
              <feOffset dx="1" dy="1" />
              <feComposite operator="over" in2="SourceGraphic" />
            </filter>
            <filter id="dual-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feFlood floodColor="#06B6D4" floodOpacity="0.4"/>
              <feComposite in2="blur" operator="in" result="cyan-glow"/>
              <feFlood floodColor="#2563EB" floodOpacity="0.4"/>
              <feComposite in2="blur" operator="in" result="blue-glow"/>
              <feMerge>
                <feMergeNode in="cyan-glow"/>
                <feMergeNode in="blue-glow"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background Circle with subtle animation */}
          <motion.circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            filter="url(#dual-glow)"
            className="dark:opacity-90"
          />

          {/* A and X letters */}
          <motion.g
            fill="none"
            stroke="url(#logoGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#neon-dual)"
            className="dark:opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {/* Stylized A */}
            <motion.path
              d="M30 75L50 25L70 75"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            <motion.path
              d="M37 55L63 55"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            />
            
            {/* Stylized X overlay */}
            <motion.path
              d="M40 35L60 65"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="opacity-80"
            />
            <motion.path
              d="M60 35L40 65"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="opacity-80"
            />
          </motion.g>
        </motion.svg>
      </div>

    </motion.div>
  );
};

export default Logo;
