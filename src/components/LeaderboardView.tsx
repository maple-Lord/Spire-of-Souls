import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Trophy, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

interface LeaderboardEntry {
  uid: string;
  username: string;
  highestFloor: number;
}

export default function LeaderboardView({ onBack }: { onBack: () => void }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const q = query(collection(db, 'users'), orderBy('highestFloor', 'desc'), limit(10));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => doc.data() as LeaderboardEntry);
        setEntries(data);
      } catch (err) {
        console.error('Leaderboard Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-abyss-base p-6 sm:p-12 flex flex-col items-center">
      <div className="max-w-xl w-full">
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="mb-12 flex items-center gap-2 text-indigo-400 hover:text-white transition-colors uppercase font-mono text-[10px] tracking-[0.3em] font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Abyss
        </motion.button>

        <div className="text-center mb-16">
          <div className="inline-flex p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 mb-6">
            <Trophy className="w-10 h-10 text-amber-400" />
          </div>
          <h2 className="text-5xl font-serif italic mb-4">Legend of the Ascent</h2>
          <p className="text-white/40 italic">Those who climbed the furthest into the dark.</p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4 text-white/20">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-xs uppercase tracking-widest font-bold">Gazing into the void...</p>
            </div>
          ) : entries.length === 0 ? (
            <p className="text-center text-white/20 py-20 italic">The Spire remains unconquered.</p>
          ) : (
            entries.map((entry, index) => (
              <motion.div
                key={entry.uid}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-6 p-6 border rounded-3xl backdrop-blur-sm transition-all hover:bg-white/5 ${
                  index === 0 ? 'bg-amber-500/5 border-amber-500/20' : 'bg-white/5 border-white/5'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif italic text-xl ${
                  index === 0 ? 'text-amber-400' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-orange-400' : 'text-white/20'
                }`}>
                  #{index + 1}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {entry.username}
                    {index === 0 && <Sparkles className="w-4 h-4 text-amber-400" />}
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Dread Navigator</p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-serif italic text-indigo-400">F{entry.highestFloor}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Floor Level</div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
