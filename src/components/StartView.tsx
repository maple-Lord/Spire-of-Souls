import { motion } from 'motion/react';
import { Sword, Shield, Sparkles, LogOut, Info, Trophy } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function StartView({ onStart, onShowInstructions, onShowLeaderboard }: { 
  onStart: () => void, 
  onShowInstructions: () => void,
  onShowLeaderboard: () => void 
}) {
  const handleLogout = () => signOut(auth);

  return (
    <div className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-[#05050a]">
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.12)_0%,transparent_60%)] animate-pulse" />
      
      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-indigo-400/20 rounded-full blur-[1px]"
          animate={{
            y: [-20, -100],
            x: Math.sin(i) * 50,
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "linear"
          }}
          style={{
            left: `${Math.random() * 100}%`,
            bottom: "10%"
          }}
        />
      ))}

      {/* Frame Corners */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-white/10" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-white/10" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-white/10" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-white/10" />

      <motion.div 
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <motion.div 
          className="flex items-center gap-6 mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-indigo-500/50" />
          <span className="text-indigo-400 uppercase tracking-[0.5em] font-bold text-[10px]">The Forsaken Descent awaits</span>
          <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-indigo-500/50" />
        </motion.div>
        
        <motion.h1 
          className="text-8xl md:text-[10rem] font-serif italic tracking-tight mb-8 leading-none drop-shadow-[0_0_30px_rgba(99,102,241,0.2)] text-center px-12"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
           <span className="text-white">Abyss</span>
           <br />
           <span className="text-white/40">Spire</span>
        </motion.h1>
        
        <motion.p 
          className="max-w-md text-center text-white/30 mb-16 text-sm sm:text-base leading-relaxed font-light italic px-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          A ritual of cards and shadows. Navigate the shifting floors where every choice binds a piece of your soul to the tower.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center gap-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.button
            onClick={onStart}
            className="group relative px-20 py-6 bg-white text-black font-black text-xs uppercase tracking-[0.4em] rounded-full overflow-hidden transition-all hover:pr-24 active:scale-95 shadow-[0_30px_60px_-15px_rgba(99,102,241,0.5)]"
            whileHover={{ scale: 1.05 }}
          >
            <span className="relative z-10">Begin Ascent</span>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">
              <Sword className="w-5 h-5" />
            </div>
          </motion.button>

          <div className="flex gap-4">
            <button
              onClick={onShowLeaderboard}
              className="p-5 bg-white/5 border border-white/10 text-white/60 rounded-full hover:bg-white/10 hover:text-white transition-all group"
            >
              <Trophy className="w-5 h-5 group-active:scale-90 transition-transform" />
            </button>
            <button
              onClick={onShowInstructions}
              className="p-5 bg-white/5 border border-white/10 text-white/60 rounded-full hover:bg-white/10 hover:text-white transition-all group"
            >
              <Info className="w-5 h-5 group-active:scale-90 transition-transform" />
            </button>
            <button
              onClick={handleLogout}
              className="p-5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full hover:bg-red-500/20 transition-all group"
              title="Logout"
            >
              <LogOut className="w-5 h-5 group-active:scale-90 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Global Progress Indicators */}
        <motion.div 
          className="mt-24 grid grid-cols-2 gap-16 border-t border-white/5 pt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="text-center group">
             <div className="text-3xl font-serif italic text-indigo-300 group-hover:scale-110 transition-transform mb-1 flex items-center justify-center gap-2">
               <Sparkles className="w-4 h-4 text-indigo-500" />
               XIV
             </div>
             <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/20 whitespace-nowrap">Spirits Discovered</div>
          </div>
          <div className="text-center group">
             <div className="text-3xl font-serif italic text-indigo-300 group-hover:scale-110 transition-transform mb-1 flex items-center justify-center gap-2">
               <Shield className="w-4 h-4 text-indigo-500" />
               VIII
             </div>
             <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/20 whitespace-nowrap">Guardians Fallen</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative Symbols Sticking Out */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
        <Sword className="w-96 h-96 rotate-45" />
      </div>
      <div className="absolute bottom-0 left-0 p-12 opacity-[0.03] pointer-events-none">
        <Shield className="w-96 h-96 -rotate-12" />
      </div>

      <div className="absolute bottom-12 left-12 flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
        <span className="text-[9px] uppercase font-bold tracking-[0.3em] text-white/20">Spiritual Network Stable</span>
      </div>
    </div>
  );
}
