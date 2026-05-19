import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, GameState } from '../types';
import StatusHeader from './StatusHeader';
import CardComponent from './CardComponent';
import { ArrowLeft, Sparkles, Heart, Coins } from 'lucide-react';

interface StoreViewProps {
  state: GameState;
  onUpdate: (updates: Partial<GameState>) => void;
  onLeave: () => void;
}

export default function StoreView({ state, onUpdate, onLeave }: StoreViewProps) {
  const [view, setView] = useState<'main' | 'upgrade'>('main');

  const handleUpgrade = (cardId: string) => {
    if (state.gold < 50) return;

    const newDeck = state.deck.map(c => {
      if (c.id === cardId) {
        return {
          ...c,
          might: c.might + 2,
          agility: c.agility + 2,
          arcane: c.arcane + 2,
          level: (c.level || 1) + 1,
          name: c.name.endsWith('+') ? c.name : `${c.name}+`
        };
      }
      return c;
    });

    onUpdate({
      deck: newDeck,
      gold: state.gold - 50
    });
    setView('main');
  };

  return (
    <div className="relative h-screen bg-abyss-base flex flex-col overflow-hidden">
      <StatusHeader state={state} />
      
      <div className="flex-1 mt-20 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {view === 'main' ? (
            <motion.div 
              key="main"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-4xl mx-auto flex flex-col items-center"
            >
              <div className="text-center mb-12">
                <span className="text-indigo-400 font-mono text-[10px] uppercase font-bold tracking-[0.4em] mb-2 block">
                  The Bazaar of Echoes
                </span>
                <h2 className="text-5xl font-serif italic mb-4">Shadow Offerings</h2>
                <p className="text-white/40 italic">A small price for survival in the deep.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full px-4">
                {/* Heal */}
                <div className="p-8 border border-white/5 rounded-3xl bg-abyss-surface/50 backdrop-blur-xl flex flex-col items-center text-center group hover:border-indigo-500/30 transition-all">
                  <div className="w-16 h-16 rounded-full bg-red-950/20 border border-red-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Heart className="w-8 h-8 text-red-500 fill-red-500/20" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Restorative Essence</h3>
                  <p className="text-white/40 text-sm mb-8">Heal 5 HP. Rejuvenate your weary soul.</p>
                  <button 
                    disabled={state.gold < 30 || state.playerHp >= state.playerMaxHp}
                    onClick={() => onUpdate({
                      gold: state.gold - 30,
                      playerHp: Math.min(state.playerMaxHp, state.playerHp + 5)
                    })}
                    className="mt-auto w-full py-4 bg-white/5 border border-white/10 rounded-xl font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-20"
                  >
                    Buy (30G)
                  </button>
                </div>

                {/* Max HP */}
                <div className="p-8 border border-white/5 rounded-3xl bg-abyss-surface/50 backdrop-blur-xl flex flex-col items-center text-center group hover:border-indigo-500/30 transition-all">
                  <div className="w-16 h-16 rounded-full bg-indigo-950/20 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-8 h-8 text-indigo-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Blessing of Vigor</h3>
                  <p className="text-white/40 text-sm mb-8">Increase Max HP by 3. Expand your essence.</p>
                  <button 
                    disabled={state.gold < 60}
                    onClick={() => onUpdate({
                      gold: state.gold - 60,
                      playerMaxHp: state.playerMaxHp + 3,
                      playerHp: state.playerHp + 3
                    })}
                    className="mt-auto w-full py-4 bg-white/5 border border-white/10 rounded-xl font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-20"
                  >
                    Buy (60G)
                  </button>
                </div>

                {/* Upgrade */}
                <div className="p-8 border border-white/5 rounded-3xl bg-abyss-surface/50 backdrop-blur-xl flex flex-col items-center text-center group hover:border-indigo-500/30 transition-all">
                  <div className="w-16 h-16 rounded-full bg-amber-950/20 border border-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Coins className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Spirit Refinement</h3>
                  <p className="text-white/40 text-sm mb-8">Upgrade a spirit's stats (+2 to all). Refine the bond.</p>
                  <button 
                    disabled={state.gold < 50}
                    onClick={() => setView('upgrade')}
                    className="mt-auto w-full py-4 bg-white/5 border border-white/10 rounded-xl font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-20"
                  >
                    Select (50G)
                  </button>
                </div>
              </div>

              <button 
                onClick={onLeave}
                className="mt-16 flex items-center gap-3 text-white/20 hover:text-white transition-colors uppercase font-mono text-[10px] font-bold tracking-[0.4em]"
              >
                <ArrowLeft className="w-4 h-4" /> Continue Descent
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="upgrade"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-6xl mx-auto flex flex-col items-center"
            >
              <div className="text-center mb-12">
                <button 
                    onClick={() => setView('main')}
                    className="mb-4 text-[10px] uppercase font-bold tracking-widest text-indigo-400 flex items-center gap-2 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-3 h-3" /> Back to Bazaar
                </button>
                <h2 className="text-4xl font-serif italic mb-2">Spirit Refinement</h2>
                <p className="text-white/40 italic">Select a spirit to strengthen its resonance.</p>
                
                <button 
                    onClick={onLeave}
                    className="mt-6 text-[10px] uppercase font-bold tracking-widest text-white/20 hover:text-white transition-colors flex items-center gap-2 mx-auto"
                >
                    <ArrowLeft className="w-3 h-3" /> Continue Descent
                </button>
              </div>

              <div className="flex flex-wrap justify-center gap-6 p-4">
                {state.deck.map((card, i) => (
                  <motion.div 
                    key={card.id + i}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <CardComponent 
                      card={card} 
                      onClick={() => handleUpgrade(card.id)}
                      className="w-40 sm:w-44"
                    />
                    {card.level && (
                        <div className="absolute top-2 right-2 bg-amber-500 text-black text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase">
                            Lv.{card.level}
                        </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
