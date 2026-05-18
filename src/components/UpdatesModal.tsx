import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';

export default function UpdatesModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const updates = [
    { version: '0.1.2', title: 'Identity System Refined', description: 'Restored email-based authentication for improved account security and recovery.' },
    { version: '0.1.1', title: 'Persistence Enhanced', description: 'Game state now saves continuously to your soul bond (Firestore).' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#0e0e1a] border border-indigo-500/20 p-8 rounded-[2rem] max-w-lg w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif italic text-white flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-indigo-400" />
                Chronicles of Descent
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5 text-white/50" />
              </button>
            </div>
            
            <div className="space-y-6">
              {updates.map((update, i) => (
                <div key={i} className="border-l border-indigo-500/20 pl-4">
                  <div className="text-indigo-400 font-bold text-xs uppercase tracking-widest mb-1">{update.version}</div>
                  <div className="text-white font-medium mb-1">{update.title}</div>
                  <div className="text-white/40 text-sm italic">{update.description}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
