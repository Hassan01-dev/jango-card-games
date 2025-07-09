"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";

const game = { 
  name: "Professional Thulla", 
  color: "bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600", 
  url: "professional_thula", 
  image: "/thulla.png",
  description: "Experience the classic Thulla game with stunning visuals and smooth gameplay. Play Thulla with your friends and family in a classic setting."
};

const FloatingCard = ({ delay = 0, index = 0 }) => {
  // Generate stable random values based on index to prevent re-calculation
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
        x: [0, 50, -50, 0]
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        left: `${stableLeft}%`,
        top: `${stableTop}%`
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
            opacity: (index + 1) / trail.length * 0.6,
            scale: (index + 1) / trail.length * 1.2
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
      ease: "easeInOut"
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

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <ParticleEffect />
      <GlowingOrb size="w-64 h-64" position="top-10 right-10" />
      <GlowingOrb size="w-48 h-48" position="bottom-20 left-10" />
      
      {/* Mouse Trail Effect */}
      <MouseTrail mousePosition={mousePosition} />

      {/* Main Content */}
      <motion.div
        className="relative z-20 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Title with enhanced typography */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Welcome to CardVerse
        </motion.h1>

        {/* Subtitle with typewriter effect */}
        <motion.p
          className="text-xl md:text-2xl mb-16 text-gray-300 text-center max-w-2xl leading-relaxed"
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
                "0 0 10px rgba(34, 211, 238, 0.5)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            stunning visuals
          </motion.span>{" "}
          and smooth gameplay
        </motion.p>

        {/* Enhanced Game Card */}
        <motion.div
          className="relative w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Link href={`/${game.url}`}>
            <motion.div
              className="relative group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              transition={{ 
                duration: 0.6, 
                ease: [0.25, 0.1, 0.25, 1],
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            >
              {/* Card glow effect */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-3xl blur opacity-75"
                animate={{
                  opacity: isHovered ? 1 : 0.75,
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.25, 0.1, 0.25, 1],
                  type: "spring",
                  stiffness: 200,
                  damping: 25
                }}
              />
              
              {/* Main card */}
              <Card className="relative rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-white/20">
                {/* Image section with parallax effect */}
                <motion.div
                  className="relative w-full h-[400px] overflow-hidden"
                  whileHover={{ scale: 1.08 }}
                  transition={{ 
                    duration: 0.9, 
                    ease: [0.25, 0.1, 0.25, 1],
                    type: "spring",
                    stiffness: 180,
                    damping: 28
                  }}
                >
                  <motion.div
                    className={`absolute inset-0 ${game.color} opacity-20`}
                    animate={{
                      opacity: isHovered ? 0.4 : 0.2,
                    }}
                    transition={{ 
                      duration: 0.7, 
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                  />
                  <Image
                    src={game.image}
                    alt={game.name}
                    fill
                    className="object-cover transition-all duration-500 group-hover:brightness-110"
                  />
                  
                  {/* Animated overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                    animate={{
                      opacity: isHovered ? 0.8 : 0.4,
                    }}
                    transition={{ 
                      duration: 0.7, 
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                  />
                </motion.div>

                {/* Content section */}
                <CardContent className="p-8 relative">
                  {/* Title with enhanced animation */}
                  <motion.h2
                    className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
                    transition={{ 
                      duration: 0.6, 
                      ease: [0.25, 0.1, 0.25, 1],
                      type: "spring",
                      stiffness: 250,
                      damping: 30
                    }}
                  >
                    {game.name}
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    className="text-gray-300 text-center mb-6 leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    {game.description}
                  </motion.p>

                  {/* Play button */}
                  <motion.div
                    className="flex justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ 
                      duration: 0.5, 
                      ease: [0.25, 0.1, 0.25, 1],
                      type: "spring",
                      stiffness: 300,
                      damping: 35
                    }}
                  >
                    <motion.button
                      className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                      whileHover={{
                        boxShadow: "0 0 30px rgba(34, 211, 238, 0.5)",
                      }}
                    >
                      <motion.span
                        className="relative z-10"
                        animate={{
                          textShadow: isHovered ? "0 0 10px rgba(255, 255, 255, 0.8)" : "none"
                        }}
                      >
                        Play Now
                      </motion.span>
                      
                      {/* Button shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                          x: isHovered ? ["-100%", "100%"] : "-100%",
                        }}
                        transition={{
                          duration: 0.8,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        </motion.div>

        {/* Additional decorative elements */}
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
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}