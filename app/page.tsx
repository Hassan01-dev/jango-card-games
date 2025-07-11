"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GameCard from "@views/components/GameCard";

const games = [
  {
    name: "Professional Thulla",
    color: "bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600",
    url: "professional_thula",
    image: "/thulla.png",
    description:
      "Experience the classic Thulla game with stunning visuals and smooth gameplay. Play Thulla with your friends and family in a classic setting.",
  },
  {
    name: "Gullam Chor (Jack Thief)",
    color: "bg-gradient-to-br from-pink-500 via-red-400 to-yellow-500",
    url: "gullam_chor",
    image: "/gullam_chor.png",
    description:
      "Experience the classic Gullam Chor (Jack Thief) game with stunning visuals and smooth gameplay. Play Thulla with your friends and family in a classic setting.",
  },
];

const FloatingCard = ({ delay = 0, index = 0 }) => {
  const stableLeft = React.useMemo(() => Math.random() * 100, [index]);
  const stableTop = React.useMemo(() => Math.random() * 100, [index]);

  return (
    <motion.div
      className="absolute w-12 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-lg backdrop-blur-sm border border-white/20"
      initial={{ opacity: 0, y: 100, rotate: 15 }}
      animate={{
        opacity: [0, 1, 0],
        y: [-100, -200, -300],
        rotate: [15, -15, 15],
        x: [0, 50, -50, 0],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        left: `${stableLeft}%`,
        top: `${stableTop}%`,
      }}
    />
  );
};

const ParticleEffect = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <FloatingCard key={i} delay={i * 1.5} index={i} />
    ))}
  </div>
);

const MouseTrail = ({ mousePosition }: { mousePosition: { x: number; y: number } }) => {
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const newTrail = [...trail, mousePosition].slice(-8);
    setTrail(newTrail);
  }, [mousePosition]);

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {trail.map((point, index) => (
        <motion.div
          key={index}
          className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
          style={{
            left: point.x - 4,
            top: point.y - 4,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: ((index + 1) / trail.length) * 0.6,
            scale: ((index + 1) / trail.length) * 1.2,
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
};

const GlowingOrb = ({ size = "w-32 h-32", position = "top-20 left-20" }) => (
  <motion.div
    className={`absolute ${size} ${position} rounded-full bg-gradient-to-r from-purple-400/30 to-pink-400/30 blur-xl`}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col items-center justify-start p-4 relative overflow-hidden">
      {/* Background Effects */}
      <ParticleEffect />
      <GlowingOrb size="w-64 h-64" position="top-10 right-10" />
      <GlowingOrb size="w-48 h-48" position="bottom-20 left-10" />
      <MouseTrail mousePosition={mousePosition} />

      <motion.div
        className="relative z-20 flex flex-col items-center w-full max-w-screen-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Title */}
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Welcome to CardVerse
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl mb-10 text-gray-300 text-center max-w-2xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Enter a world of premium card gaming with{" "}
          <motion.span
            className="text-cyan-400 font-semibold"
            animate={{
              textShadow: [
                "0 0 10px rgba(34, 211, 238, 0.5)",
                "0 0 20px rgba(34, 211, 238, 0.8)",
                "0 0 10px rgba(34, 211, 238, 0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            stunning visuals
          </motion.span>{" "}
          and smooth gameplay
        </motion.p>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-4 md:px-8 w-full justify-center">
          {games.map((game, idx) => (
            <GameCard
              key={idx}
              game={game}
              isHovered={isHovered}
              setIsHovered={setIsHovered}
            />
          ))}
        </div>

        {/* Dots */}
        <motion.div
          className="mt-16 flex space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
