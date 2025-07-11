import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const GameCard = ({ game, isHovered, setIsHovered }: any) => (
  <motion.div
    className="relative w-[90vw] max-w-[380px] md:max-w-[420px] lg:max-w-[500px] h-[65vh] mx-auto"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.4 }}
  >
    <Link href={`/${game.url}`}>
      <motion.div
        className="relative group cursor-pointer h-full"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-3xl blur opacity-75"
          animate={{
            opacity: isHovered ? 1 : 0.75,
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{
            duration: 0.8,
            type: "spring",
            stiffness: 200,
            damping: 25
          }}
        />
        <Card className="relative rounded-3xl shadow-2xl overflow-hidden h-full bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-white/20">
          <motion.div
            className="relative w-full h-[45%] overflow-hidden"
            whileHover={{ scale: 1.08 }}
            transition={{
              duration: 0.9,
              type: "spring",
              stiffness: 180,
              damping: 28
            }}
          >
            <motion.div
              className={`absolute inset-0 ${game.color} opacity-20`}
              animate={{ opacity: isHovered ? 0.4 : 0.2 }}
              transition={{ duration: 0.7 }}
            />
            <Image
              src={game.image}
              alt={game.name}
              fill
              className="object-cover transition-all duration-500 group-hover:brightness-110"
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              animate={{ opacity: isHovered ? 0.8 : 0.4 }}
              transition={{ duration: 0.7 }}
            />
          </motion.div>
          <CardContent className="p-6 h-[55%] flex flex-col justify-between">
            <motion.h2
              className="text-2xl md:text-3xl font-bold mb-3 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
              transition={{ duration: 0.6 }}
            >
              {game.name}
            </motion.h2>
            <motion.p
              className="text-gray-300 text-sm md:text-base text-center mb-4 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {game.description}
            </motion.p>
            <motion.div className="flex justify-center">
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                whileHover={{ boxShadow: "0 0 30px rgba(34, 211, 238, 0.5)" }}
              >
                <motion.span className="relative z-10">Play Now</motion.span>
              </motion.button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  </motion.div>
);

export default GameCard
