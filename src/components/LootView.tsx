import { motion } from 'motion/react';
import { Card } from '../types';
import { CARD_POOL } from '../constants';
import CardComponent from './CardComponent';

export default function LootView({ onSelect, deck, currentFloor }: { onSelect: (card: Card | null) => void, deck: Card[], currentFloor: number }) {
  // Generate random cards for loot based on depth
  const options = [...CARD_POOL]
    .filter(c => {
      if (currentFloor > 20) return true; // Anything goes at high levels
      if (currentFloor > 10) return c.rarity !== 'legendary'; // No legendaries yet
      return c.rarity === 'common' || c.rarity === 'rare'; // Early game
    })
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const isDeckFull = deck.length >= 10;

  return (
    <div className="relative h-screen bg-abyss-base flex flex-col items-center justify-center p-6 overflow-y-auto">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05)_0%,transparent_50%)]" />
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12 z-10"
      >
        <span className="text-indigo-400 font-mono text-[10px] uppercase font-bold tracking-[0.4em] mb-2 block">
          Battle Won
        </span>
        <h2 className="text-5xl font-serif italic mb-4">Claim Your Spoils</h2>
        <p className="text-white/40 max-w-sm mx-auto text-sm italic">
          Select a spirit to bind to your soul. Your deck has {deck.length}/10 capacity.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl z-10 p-4">
        {options.map((card, i) => (
          <motion.div 
            key={card.id + i}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <CardComponent 
              card={card} 
              onClick={() => onSelect(card)}
              disabled={isDeckFull}
            />
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="mt-12 z-10 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <button 
          onClick={() => onSelect(null)}
          className="text-white/40 uppercase tracking-widest text-xs hover:text-white transition-colors py-4 px-12 border border-white/5 rounded-xl"
        >
          Skip Choice
        </button>
        {isDeckFull && <p className="text-red-400 text-xs font-mono uppercase">Deck is at maximum capacity (10/10)</p>}
      </motion.div>
    </div>
  );
}
