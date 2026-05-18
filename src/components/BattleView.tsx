import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Enemy, StatType, GameState } from '../types';
import { STAT_CONFIG } from '../constants';
import CardComponent from './CardComponent';
import * as LucideIcons from 'lucide-react';
import { Sword, Shield, Zap, Sparkles, Heart } from 'lucide-react';

export default function BattleView({ 
  player, 
  enemy: initialEnemy, 
  onEnd 
}: { 
  player: GameState; 
  enemy: Enemy; 
  onEnd: (victory: boolean, gold: number) => void;
}) {
  const [enemy, setEnemy] = useState<Enemy>({ ...initialEnemy });
  const [playerHp, setPlayerHp] = useState(player.playerHp);
  const [phase, setPhase] = useState<'intro' | 'draw' | 'select' | 'select-stat' | 'clash' | 'result' | 'loot'>('intro');
  const [drawnCards, setDrawnCards] = useState<Card[]>([]);
  const [selectedPlayerCard, setSelectedPlayerCard] = useState<Card | null>(null);
  const [selectedEnemyCard, setSelectedEnemyCard] = useState<Card | null>(null);
  const [activeStat, setActiveStat] = useState<StatType | null>(null);
  const [clashWinner, setClashWinner] = useState<'player' | 'enemy' | 'tie' | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [enemyDialogue, setEnemyDialogue] = useState<string>("Face your doom, wanderer...");
  const [isTyping, setIsTyping] = useState(false);
  const [userChatInput, setUserChatInput] = useState("");

  const triggerTaunt = async (action: string, customMessage?: string) => {
    setIsTyping(true);
    try {
      const res = await fetch("/api/chat/battle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enemyName: enemy.name,
          currentHp: enemy.hp,
          maxHp: enemy.maxHp,
          playerAction: action,
          userMessage: customMessage
        })
      });
      const data = await res.json();
      setEnemyDialogue(data.message);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const handleUserChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;
    triggerTaunt("The player sends a message", userChatInput);
    setUserChatInput("");
  };

  useEffect(() => {
    const timer = setTimeout(() => setPhase('draw'), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase === 'draw') {
      const shuffled = [...player.deck].sort(() => Math.random() - 0.5);
      setDrawnCards(shuffled.slice(0, 3));
      setPhase('select');
    }
  }, [phase, player.deck]);

  const handleCardSelect = (card: Card) => {
    setSelectedPlayerCard(card);
    setPhase('select-stat');
  };

  const handleStatSelect = (stat: StatType) => {
    setActiveStat(stat);
    setPhase('clash');
    startClash(selectedPlayerCard!, stat);
  };

  const startClash = (playerCard: Card, chosenStat: StatType) => {
    const enemyCard = enemy.deck[Math.floor(Math.random() * enemy.deck.length)];
    setSelectedEnemyCard(enemyCard);

    setTimeout(() => {
      const pVal = playerCard[chosenStat];
      const eVal = enemyCard[chosenStat];
      
      let winner: 'player' | 'enemy' | 'tie';
      let msg = '';
      if (pVal > eVal) {
        winner = 'player';
        setEnemy(prev => ({ ...prev, hp: prev.hp - 1 }));
        msg = `Success! Your ${chosenStat} (${pVal}) beats enemy ${chosenStat} (${eVal}).`;
        triggerTaunt(`used ${chosenStat} and won the clash`);
      } else if (eVal > pVal) {
        winner = 'enemy';
        setPlayerHp(prev => prev - 1);
        msg = `Overpowered! Enemy ${chosenStat} (${eVal}) beats your ${chosenStat} (${pVal}).`;
        triggerTaunt(`used ${chosenStat} and lost the clash`);
      } else {
        winner = 'tie';
        msg = `Stalemate! Both have ${pVal} in ${chosenStat}.`;
      }
      
      setBattleLog(prev => [msg, ...prev].slice(0, 5));
      setClashWinner(winner);
      setPhase('result');
    }, 1500);
  };

  useEffect(() => {
    if (phase === 'result') {
      const timer = setTimeout(() => {
        if (enemy.hp <= 0) {
          setPhase('loot');
        } else if (playerHp <= 0) {
          onEnd(false, 0);
        } else {
          setSelectedPlayerCard(null);
          setSelectedEnemyCard(null);
          setActiveStat(null);
          setClashWinner(null);
          setPhase('draw');
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase, enemy.hp, playerHp, onEnd]);

  return (
    <div className="relative h-screen bg-abyss-base flex flex-col overflow-hidden">
      {/* Side Progress Bar Decor - Hidden on small mobile */}
      <div className="hidden sm:flex absolute left-0 top-0 h-full w-16 border-r border-white/5 flex-col items-center py-20 gap-8 bg-abyss-sidebar z-20">
        <div className="text-[10px] uppercase [writing-mode:vertical-lr] rotate-180 tracking-[0.4em] text-white/20 font-bold">Battle Sequence</div>
        <div className="flex flex-col gap-4">
          <div className={`w-2 h-2 rounded-full transition-colors ${phase === 'draw' ? 'bg-indigo-500 shadow-[0_0_10px_indigo]' : 'bg-white/10'}`} />
          <div className={`w-2 h-2 rounded-full transition-colors ${phase === 'select' ? 'bg-indigo-500 shadow-[0_0_10px_indigo]' : 'bg-white/10'}`} />
          <div className={`w-3 h-3 rounded-full transition-colors ${phase === 'clash' ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-white/10'}`} />
        </div>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row sm:ml-16 overflow-hidden">
        {/* Main Arena */}
        <div className="flex-1 p-4 sm:p-10 flex flex-col relative justify-between overflow-y-auto pt-20">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03)_0%,transparent_70%)] pointer-events-none" />
           
           {/* Enemy Status Area */}
           <motion.div 
             initial={{ y: -20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="relative z-10 flex flex-col items-center"
           >
             <div className="w-48 sm:w-64 h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                <motion.div 
                  className="h-full bg-gradient-to-r from-red-600 to-red-400"
                  initial={false}
                  animate={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
                />
             </div>
             <div className="flex justify-between w-48 sm:w-64 text-[10px] font-mono text-white/40 uppercase font-bold tracking-widest px-2">
                <span className="truncate max-w-[100px]">{enemy.name}</span>
                <span>{enemy.hp} / {enemy.maxHp} HP</span>
             </div>
             
             {/* Enemy Dialogue Bubble */}
             <motion.div 
               key={enemyDialogue}
               initial={{ opacity: 0, y: 10, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               className="mt-6 relative max-w-xs group"
             >
                <div className="bg-abyss-base/80 border border-white/10 backdrop-blur-md p-4 rounded-2xl rounded-tl-none relative shadow-xl">
                   <p className="text-xs italic text-indigo-200 leading-relaxed font-serif">
                     {isTyping ? "..." : enemyDialogue}
                   </p>
                </div>
                <div className="absolute -top-1 left-0 w-2 h-2 bg-indigo-500/20 rounded-full animate-pulse" />
             </motion.div>
           </motion.div>

           {/* Clash Stage */}
           <div className="flex-1 flex items-center justify-center relative min-h-[300px]">
              <AnimatePresence mode="wait">
                 {phase === 'select-stat' && (
                   <motion.div 
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 1.2, opacity: 0 }}
                     className="flex flex-col items-center gap-8 bg-abyss-surface/80 p-12 rounded-3xl border border-white/10 backdrop-blur-xl"
                   >
                     <h3 className="text-2xl font-serif italic mb-2">Unleash Potential</h3>
                     <div className="flex gap-6">
                        {(Object.entries(STAT_CONFIG) as [StatType, any][]).map(([key, config]) => {
                          const Icon = (LucideIcons as any)[config.icon];
                          return (
                            <button
                              key={key}
                              onClick={() => handleStatSelect(key)}
                              className="group flex flex-col items-center gap-4 p-8 rounded-2xl border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all"
                            >
                              <div className={`w-16 h-16 rounded-full border border-current flex items-center justify-center ${config.color}`}>
                                <Icon className="w-8 h-8" />
                              </div>
                              <div className="flex flex-col items-center">
                                <span className={`text-xs font-mono font-bold uppercase tracking-widest ${config.color}`}>{config.label}</span>
                                <span className="text-2xl font-black">{selectedPlayerCard ? selectedPlayerCard[key] : 0}</span>
                              </div>
                            </button>
                          );
                        })}
                     </div>
                   </motion.div>
                 )}

                 {(phase === 'clash' || phase === 'result') ? (
                    <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-20">
                       <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                          {selectedPlayerCard && <CardComponent card={selectedPlayerCard} disabled className={`w-32 h-48 sm:w-44 sm:h-64 ${clashWinner === 'player' ? 'ring-4 ring-green-500/50' : ''}`} />}
                       </motion.div>

                       <motion.div 
                         initial={{ scale: 0 }} 
                         animate={{ scale: 1 }}
                         className="flex flex-row sm:flex-col items-center gap-4 bg-abyss-surface/50 p-4 rounded-full border border-white/5"
                       >
                         {activeStat && (
                           <>
                             <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-indigo-500/50 flex items-center justify-center text-indigo-400">
                                {activeStat === 'might' && <Sword className="w-6 h-6 sm:w-8 sm:h-8" />}
                                {activeStat === 'agility' && <Zap className="w-6 h-6 sm:w-8 sm:h-8" />}
                                {activeStat === 'arcane' && <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />}
                             </div>
                             <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em]">{activeStat}</span>
                           </>
                         )}
                       </motion.div>

                       <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                          {selectedEnemyCard ? (
                            <CardComponent card={selectedEnemyCard} disabled className={`w-32 h-48 sm:w-44 sm:h-64 ${clashWinner === 'enemy' ? 'ring-4 ring-red-500/50' : ''}`} />
                          ) : (
                            <div className="w-32 h-48 sm:w-44 sm:h-64 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center text-4xl">🌑</div>
                          )}
                       </motion.div>
                    </div>
                 ) : phase === 'loot' ? (
                   <motion.div 
                     initial={{ scale: 0.9, opacity: 0 }} 
                     animate={{ scale: 1, opacity: 1 }}
                     className="text-center p-8 bg-abyss-surface rounded-3xl border border-white/5 shadow-2xl"
                   >
                     <h2 className="text-4xl sm:text-6xl font-serif italic mb-2">Victory</h2>
                     <p className="text-indigo-400 font-mono text-[10px] uppercase tracking-[0.4em] mb-12">Treasure secured</p>
                     <button 
                       onClick={() => onEnd(true, 40)}
                       className="px-12 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-indigo-400 transition-all active:scale-95"
                     >
                       Claim
                     </button>
                   </motion.div>
                 ) : null}
              </AnimatePresence>
           </div>

           {/* Hand Selection */}
           <AnimatePresence>
              {phase === 'select' && (
                <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  className="relative z-30 flex flex-wrap justify-center gap-4 sm:gap-6 pb-4"
                >
                  {drawnCards.map((card, i) => (
                    <CardComponent 
                      key={`${card.id}-${i}`} 
                      card={card} 
                      onClick={() => handleCardSelect(card)} 
                      className={`w-28 h-40 sm:w-44 sm:h-64 ${i === 0 ? '-rotate-2' : i === 2 ? 'rotate-2' : ''}`}
                    />
                  ))}
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        {/* Right Info Sidebar / Bottom Bar on Mobile */}
        <div className="w-full sm:w-72 bg-abyss-sidebar border-t sm:border-t-0 sm:border-l border-white/5 p-4 sm:p-8 flex flex-col z-20">
           <div className="mb-4 sm:mb-10 overflow-hidden">
              <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-indigo-400 mb-2 sm:mb-6">Combat Log</h4>
              <div className="space-y-2 sm:space-y-4 max-h-[100px] overflow-y-auto mb-6">
                 {battleLog.length === 0 && <p className="text-[10px] text-white/20 italic uppercase font-bold">Awaiting Fate...</p>}
                 {battleLog.map((log, i) => (
                   <motion.p 
                     key={i} 
                     initial={{ x: 20, opacity: 0 }} 
                     animate={{ x: 0, opacity: 1 }}
                     className="text-[10px] sm:text-xs italic text-white/60 leading-relaxed border-l border-indigo-500/20 pl-3 py-0.5"
                   >
                     {log}
                   </motion.p>
                 ))}
              </div>

              <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-indigo-400 mb-4">Taunt Back</h4>
              <form onSubmit={handleUserChatSubmit} className="relative">
                <input 
                  type="text"
                  value={userChatInput}
                  onChange={(e) => setUserChatInput(e.target.value)}
                  placeholder="Say something funny..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-colors pr-10"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-white transition-colors"
                >
                  <LucideIcons.Send className="w-4 h-4" />
                </button>
              </form>
           </div>

           <div className="mt-auto hidden sm:flex flex-col">
              <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl flex flex-col gap-2">
                 <div className="flex justify-between items-center">
                    <span className="text-[8px] uppercase tracking-tighter font-bold text-white/40">Life Essence</span>
                    <span className="text-[10px] font-mono">{Math.round((playerHp / player.playerMaxHp) * 100)}%</span>
                 </div>
                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                      initial={false}
                      animate={{ width: `${(playerHp / player.playerMaxHp) * 100}%` }}
                    />
                 </div>
              </div>
              
              <div className="mt-4 flex gap-3 text-white/20 text-[8px] font-bold uppercase tracking-widest">
                 <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_5px_green]" />
                 Stable
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
