"use client";

import Link from "next/link";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";

const games = [
  { name: "Blackjack", color: "bg-gradient-to-r from-green-400 to-blue-500", url: "professional_thula", image: "/images/card_game.png" },
  { name: "Poker", color: "bg-gradient-to-r from-red-400 to-pink-500", url: "#", image: "/images/card_game.png" },
  { name: "Solitaire", color: "bg-gradient-to-r from-yellow-400 to-orange-500", url: "#", image: "/images/card_game.png" },
  { name: "Rummy", color: "bg-gradient-to-r from-purple-400 to-indigo-500", url: "#", image: "/images/card_game.png" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-4">
      <motion.h1
        className="text-4xl md:text-6xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome to CardVerse
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl mb-10 text-gray-300 text-center max-w-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Choose your favorite card game and start playing instantly with friends or against AI.
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {games.map((game, index) => (
          <Link href={`/${game.url}`} className="game-card" key={index}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
            >
              <Card className={`rounded-2xl shadow-lg overflow-hidden ${game.color} transition-transform`}>
                <motion.div
                  className="relative w-full h-40"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={game.image}
                    alt={game.name}
                    fill
                    className="object-cover hover:opacity-90 transition-opacity duration-300"
                  />
                </motion.div>
                <CardContent className="p-6 flex flex-col items-center justify-center">
                  <motion.h2
                    className="text-2xl font-semibold mb-4 text-white drop-shadow"
                    whileHover={{ rotate: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    {game.name}
                  </motion.h2>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
