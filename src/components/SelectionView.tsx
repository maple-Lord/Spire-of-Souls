import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../types';
import { CARD_POOL } from '../constants';
import CardComponent from './CardComponent';

export default function SelectionView({ onSelect }: { onSelect: (cards: Card[]) => void }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Show only common spirits for the initial binding
  const options = CARD_POOL.filter(c => c.rarity === 'common').slice(0, 6);

  const toggleCard = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(i => i !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const confirmSelection = () => {
    if (selectedIds.length === 3) {
      const selected = options.filter(o => selectedIds.includes(o.id));
      // Ensure IDs are unique for the deck if multiple same cards are picked (though here they are unique in pool)
      onSelect(selected.map(c => ({ ...c, id: `deck-${c.id}-${Date.now()}` })));
    }
  };

  return (
    <div className="relative h-screen bg-abyss-base flex flex-col items-center justify-center p-6 overflow-y-auto">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05)_0%,transparent_50%)]" />
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12 z-10"
      >
        <span className="text-indigo-400 font-mono text-[10px] uppercase font-bold tracking-[0.4em] mb-2 block">
          Step I: The Binding
        </span>
        <h2 className="text-5xl font-serif italic mb-4">Choose Your Spirits</h2>
        <p className="text-white/40 max-w-sm mx-auto text-sm italic">
          Select three spirits to bind to your soul. They will be your only companions in the deep.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl z-10 p-4">
        {options.map((card, i) => (
          <motion.div 
            key={card.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <CardComponent 
              card={card} 
              onClick={() => toggleCard(card.id)}
              selected={selectedIds.includes(card.id)}
              className="w-full sm:w-44"
            />
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="mt-12 z-10 flex flex-col items-center gap-4"
        animate={{ opacity: selectedIds.length === 3 ? 1 : 0.5 }}
      >
        <span className="text-white/20 font-mono text-[10px] uppercase font-bold tracking-widest">
           {selectedIds.length} / 3 BOUND
        </span>
        <button 
          disabled={selectedIds.length !== 3}
          onClick={confirmSelection}
          className="px-12 py-4 bg-white text-black font-black uppercase tracking-[0.3em] rounded-xl text-xs hover:bg-indigo-400 transition-colors disabled:opacity-20"
        >
          Confirm Pact
        </button>
      </motion.div>
    </div>
  );
}
