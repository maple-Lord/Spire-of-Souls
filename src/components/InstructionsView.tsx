import { motion } from 'motion/react';
import { ArrowLeft, Monitor, Smartphone, Sword, Map, Sparkles, MessageSquare } from 'lucide-react';

export default function InstructionsView({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-abyss-base p-6 sm:p-12 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-indigo-400 hover:text-white transition-colors uppercase font-mono text-[10px] tracking-[0.3em] font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Spire
        </motion.button>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center mb-16"
        >
          <h2 className="text-5xl font-serif italic mb-4">Guide to the Ascent</h2>
          <p className="text-white/40 italic">How to survive the spirits of the Abyss Spire.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Controls */}
          <section className="space-y-12">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-3 mb-6 text-indigo-400 uppercase tracking-widest">
                <Monitor className="w-5 h-5" /> On Computer
              </h3>
              <ul className="space-y-4 text-sm text-white/70 leading-relaxed">
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 shrink-0" />
                  <span>Use your **Mouse** to select spirits and navigate.</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 shrink-0" />
                  <span>Hover over cards to see details. All interfaces support standard click events.</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold flex items-center gap-3 mb-6 text-indigo-400 uppercase tracking-widest">
                <Smartphone className="w-5 h-5" /> On Mobile
              </h3>
              <ul className="space-y-4 text-sm text-white/70 leading-relaxed">
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 shrink-0" />
                  <span>**Tap** on elements to interact. The Spire map is scrollable vertically.</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 shrink-0" />
                  <span>Interfaces are responsive. Icons are enlarged for easier touch interaction.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Gameplay */}
          <section className="space-y-8 bg-white/5 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
            <h3 className="text-lg font-bold flex items-center gap-3 mb-6 text-amber-400 uppercase tracking-widest">
              Core Mechanics
            </h3>
            
            <div className="flex gap-6">
              <Map className="w-8 h-8 text-indigo-400 shrink-0" />
              <div>
                <h4 className="font-bold mb-1">Navigate the Spire</h4>
                <p className="text-xs text-white/40">Choose your path carefully. Battle nodes grant gold and spirit loot. Shop nodes allow for healing and refinement.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <Sword className="w-8 h-8 text-red-400 shrink-0" />
              <div>
                <h4 className="font-bold mb-1">Winning Clashes</h4>
                <p className="text-xs text-white/40">Select a spirit, then choose a stat (Might, Agility, Arcane). If your value is higher, you deal damage.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <MessageSquare className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-bold mb-1">Taunt the Enemy</h4>
                <p className="text-xs text-white/40 italic">"The Abyss listens back."</p>
                <p className="text-xs text-white/40 mt-1">Use the chat box in battle to speak to your foes. Their reactions change based on their ego and remaining HP.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <Sparkles className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <h4 className="font-bold mb-1">Spirit Refinement</h4>
                <p className="text-xs text-white/40">Visit the Bazaar to spend gold on refinement (+2 all stats per level). Higher levels add a resonance (+) to the spirit's name.</p>
              </div>
            </div>
          </section>
        </div>


        <motion.div 
          className="mt-16 pt-12 border-t border-white/5 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <p className="text-xs text-white/20 italic mb-8">"Success is not about the strength of the spirit, but the clarity of the bond."</p>
          <button 
            onClick={onBack}
            className="px-12 py-4 bg-indigo-600/20 border border-indigo-500/50 rounded-full text-indigo-400 font-bold uppercase tracking-widest text-[10px] hover:bg-indigo-500 hover:text-white transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)]"
          >
            I am Ready to Ascend
          </button>
        </motion.div>
      </div>
    </div>
  );
}
