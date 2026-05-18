import { motion } from 'motion/react';
import { GameState } from '../types';
import { Heart, Coins, Layout } from 'lucide-react';

export default function StatusHeader({ state }: { state: GameState }) {
  return (
    <header className="fixed top-0 left-0 w-full p-4 flex flex-wrap justify-between items-center z-50 bg-gradient-to-b from-abyss-surface to-transparent border-b border-white/5 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-8 h-8 rounded-full border-2 border-indigo-500 bg-indigo-900/30 flex items-center justify-center text-sm font-bold italic"
        >
          S
        </motion.div>
        <div className="flex flex-col">
          <span className="text-[8px] uppercase tracking-[0.2em] text-indigo-400 font-bold hidden sm:block">
            {state.currentFloor > 14 ? 'Zenith Ascendant' : 'Abyss Wanderer'}
          </span>
          <h1 className="text-sm font-serif italic tracking-wide">
            {state.currentFloor > 14 ? 'Sky Weaver' : 'Spire Wanderer'}
          </h1>
        </div>
      </div>

      <div className="flex gap-4 sm:gap-10 items-center">
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-end"
        >
          <span className="text-[8px] uppercase text-white/40 tracking-widest flex items-center gap-1">
            <Heart className="w-2 h-2 text-red-500 fill-red-500" /> <span className="hidden sm:inline">Life</span>
          </span>
          <span className="text-sm sm:text-xl font-mono text-red-400 font-bold">
            {state.playerHp}<span className="text-white/10 mx-1">/</span>{state.playerMaxHp}
          </span>
        </motion.div>

        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-end"
        >
          <span className="text-[8px] uppercase text-white/40 tracking-widest flex items-center gap-1">
            <Coins className="w-2 h-2 text-amber-500" /> <span className="hidden sm:inline">Shards</span>
          </span>
          <span className="text-sm sm:text-xl font-mono text-indigo-300 font-bold">{state.gold}</span>
        </motion.div>

        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-end px-3 sm:px-6 border-l border-white/5"
        >
          <span className="text-[8px] uppercase text-white/40 tracking-widest">Depth</span>
          <span className="text-sm sm:text-xl font-mono text-white font-bold underline underline-offset-4 decoration-indigo-500">
            F{state.currentFloor}
          </span>
        </motion.div>
      </div>
    </header>
  );
}
