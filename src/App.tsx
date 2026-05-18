import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, TowerNode, Enemy, Card } from './types.ts';
import { INITIAL_CARDS, CARD_POOL, ENEMIES, TOWER_HEIGHT } from './constants.ts';
import { auth, db } from './lib/firebase.ts';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import BattleView from './components/BattleView.tsx';
import MapView from './components/MapView.tsx';
import StartView from './components/StartView.tsx';
import SelectionView from './components/SelectionView.tsx';
import LootView from './components/LootView.tsx';
import StoreView from './components/StoreView.tsx';
import InstructionsView from './components/InstructionsView.tsx';
import LeaderboardView from './components/LeaderboardView.tsx';
import AuthView from './components/AuthView.tsx';
import StatusHeader from './components/StatusHeader.tsx';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasLoadedSavedRun, setHasLoadedSavedRun] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    screen: 'start',
    playerHp: 10,
    playerMaxHp: 10,
    gold: 50,
    deck: [...INITIAL_CARDS],
    currentFloor: 0,
    nodes: [],
    currentNodeId: null,
    selectedEnemy: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthenticated(!!user);
      if (user && !hasLoadedSavedRun) {
        // Fetch saved run
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.activeRun) {
              setGameState(data.activeRun);
            }
          }
        } catch (e) {
          console.error("Failed to load saved run", e);
        } finally {
          setHasLoadedSavedRun(true);
        }
      }
    });
    return unsubscribe;
  }, [hasLoadedSavedRun]);

  // Persistent Savings
  useEffect(() => {
    if (!auth.currentUser || !hasLoadedSavedRun) return;

    const saveTimeout = setTimeout(async () => {
      const userRef = doc(db, 'users', auth.currentUser!.uid);
      const isFinState = ['gameover', 'victory'].includes(gameState.screen);
      
      try {
        await updateDoc(userRef, {
          activeRun: isFinState ? null : gameState,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        // Fallback or ignore if it's a minor sync error
      }
    }, 1000); // Debounced save

    return () => clearTimeout(saveTimeout);
  }, [gameState, hasLoadedSavedRun]);

  const updateHighestFloor = async (floor: number) => {
    if (!auth.currentUser) return;
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const currentHighest = userDoc.data().highestFloor || 0;
        if (floor > currentHighest) {
          await updateDoc(userRef, {
            highestFloor: floor,
            updatedAt: serverTimestamp()
          });
        }
      }
    } catch (err) {
      console.error('Error updating highest floor:', err);
    }
  };

  const generateTower = useCallback(() => {
    const nodes: TowerNode[] = [];
    let idCounter = 0;

    for (let row = 0; row < TOWER_HEIGHT; row++) {
      const isFinBoss = row === TOWER_HEIGHT - 1;
      const isMidBoss = row === 14;
      const isFirstRow = row === 0;
      const nodesInRow = (isFinBoss || isMidBoss) ? 1 : Math.floor(Math.random() * 2) + 2; 
      const rowNodes: TowerNode[] = [];

      for (let i = 0; i < nodesInRow; i++) {
        const typeRoll = Math.random();
        let type: TowerNode['type'] = 'battle';
        
        if (isFinBoss || isMidBoss) type = 'boss';
        else if (isFirstRow) type = 'battle';
        else if (typeRoll < 0.15) type = 'store';
        else if (typeRoll < 0.25) type = 'elite';
        else if (typeRoll < 0.35) type = 'mystery';

        rowNodes.push({
          id: idCounter++,
          type,
          status: isFirstRow ? 'available' : 'locked',
          row,
          connections: [],
        });
      }
      nodes.push(...rowNodes);
    }

    // Connect nodes
    for (let row = 0; row < TOWER_HEIGHT - 1; row++) {
      const currentLevelNodes = nodes.filter(n => n.row === row);
      const nextLevelNodes = nodes.filter(n => n.row === row + 1);

      currentLevelNodes.forEach((node, idx) => {
        const targetIdx = Math.min(idx, nextLevelNodes.length - 1);
        node.connections.push(nextLevelNodes[targetIdx].id);
        
        if (Math.random() > 0.6 && nextLevelNodes.length > 1) {
          const secondIdx = (targetIdx + 1) % nextLevelNodes.length;
          if (!node.connections.includes(nextLevelNodes[secondIdx].id)) {
            node.connections.push(nextLevelNodes[secondIdx].id);
          }
        }
      });
    }

    return nodes;
  }, []);

  const startGame = () => {
    const freshNodes = generateTower();
    setGameState(prev => ({
      ...prev,
      screen: 'selection',
      nodes: freshNodes,
      playerHp: 10,
      playerMaxHp: 10,
      gold: 50,
      deck: [], // Start empty for selection
      currentFloor: 0,
      currentNodeId: null,
    }));
  };

  const handleSelection = (selectedCards: Card[]) => {
    setGameState(prev => ({
      ...prev,
      deck: selectedCards,
      screen: 'map'
    }));
  };

  const handleLoot = (card: Card | null) => {
    setGameState(prev => {
      const newDeck = [...prev.deck];
      if (card && newDeck.length < 10) {
        newDeck.push(card);
      }
      return {
        ...prev,
        deck: newDeck,
        screen: 'map'
      };
    });
    
    if (gameState.currentNodeId !== null) {
      completeNode(gameState.currentNodeId!, 0);
    }
  };

  const handleNodeClick = (node: TowerNode) => {
    if (node.status !== 'available') return;

    if (node.type === 'battle' || node.type === 'elite' || node.type === 'boss') {
      const isZenith = node.row > 14;
      const pool = ENEMIES.filter(e => {
        const hp = e.hp || 0;
        if (node.type === 'boss') return hp > (isZenith ? 30 : 15);
        if (node.type === 'elite') return hp > 10;
        return isZenith ? hp > 10 : hp < 15;
      });
      
      const template = pool[Math.floor(Math.random() * pool.length)] || ENEMIES[0];
      
      // Weaker start (0.1 initially) scaling up to 0.5 per floor for aggressive end-game
      const scalingFactor = node.row < 5 ? 0.2 : 0.45;
      const difficultyMult = 0.8 + (node.row * scalingFactor);
      
      const enemy: Enemy = {
        id: `e-${Date.now()}`,
        name: node.type === 'boss' ? (isZenith ? 'Zenith Guardian' : 'Abyss Guardian') : template.name!,
        image: template.image!,
        hp: Math.max(3, Math.ceil(template.hp! * difficultyMult)),
        maxHp: Math.max(3, Math.ceil(template.maxHp! * difficultyMult)),
        deck: Array.from({ length: 8 }, () => {
           // Enemies at the start only use common cards
           const cardPool = CARD_POOL.filter(c => {
             if (node.row < 5) return c.rarity === 'common';
             if (node.row < 15) return c.rarity !== 'legendary';
             return true;
           });
           const card = cardPool[Math.floor(Math.random() * cardPool.length)];
           const statBonus = Math.floor(node.row / 3);
           return { 
             ...card, 
             might: card.might + statBonus, 
             agility: card.agility + statBonus, 
             arcane: card.arcane + statBonus 
           };
        }),
      };

      setGameState(prev => ({
        ...prev,
        screen: 'battle',
        selectedEnemy: enemy,
        currentNodeId: node.id,
      }));
    } else if (node.type === 'store') {
      setGameState(prev => ({
        ...prev,
        screen: 'store',
        currentNodeId: node.id,
      }));
    } else if (node.type === 'mystery') {
      const roll = Math.random();
      if (roll < 0.4) {
        const amount = 20 + Math.floor(Math.random() * 30);
        completeNode(node.id, amount);
      } else if (roll < 0.7) {
        const amount = Math.floor(gameState.playerMaxHp * 0.3);
        setGameState(prev => ({
          ...prev,
          playerHp: Math.min(prev.playerMaxHp, prev.playerHp + amount)
        }));
        completeNode(node.id, 0);
      } else {
        handleNodeClick({ ...node, type: 'battle' });
      }
    }
  };

  const completeNode = (nodeId: number, goldGained: number) => {
    setGameState(prev => {
      const currentRel = prev.nodes.find(n => n.id === nodeId);
      const newNodes = prev.nodes.map(n => {
        if (n.id === nodeId) return { ...n, status: 'completed' as const };
        
        // Unlock connected nodes
        if (currentRel?.connections.includes(n.id)) {
          return { ...n, status: 'available' as const };
        }
        
        // If node is in an advanced row but not connected to current selection, it might be locked
        if (n.status === 'available' && n.row > (currentRel?.row ?? -1)) {
            return { ...n, status: 'locked' as const };
        }

        return n;
      });

      return {
        ...prev,
        nodes: newNodes,
        gold: prev.gold + goldGained,
        currentFloor: (currentRel?.row ?? 0) + 1,
      };
    });

    const currentRel = gameState.nodes.find(n => n.id === nodeId);
    if (currentRel) {
      updateHighestFloor(currentRel.row + 1);
    }
  };

  const onBattleEnd = (victory: boolean, goldGained: number) => {
    if (victory) {
      const currentNode = gameState.nodes.find(n => n.id === gameState.currentNodeId);
      const isFinBoss = currentNode?.type === 'boss' && currentNode.row === TOWER_HEIGHT - 1;
      
      if (isFinBoss) {
        setGameState(prev => ({ ...prev, screen: 'victory' }));
      } else {
        setGameState(prev => ({
          ...prev,
          screen: 'loot',
          gold: prev.gold + goldGained
        }));
      }
    } else {
      setGameState(prev => ({ ...prev, screen: 'gameover' }));
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0502] text-white font-sans selection:bg-orange-500/30 overflow-hidden">
      <AnimatePresence mode="wait">
        {isAuthenticated === false && (
          <motion.div key="auth" className="w-full h-full">
            <AuthView onAuthComplete={() => setIsAuthenticated(true)} />
          </motion.div>
        )}

        {isAuthenticated === true && gameState.screen === 'start' && (
          <motion.div key="start" className="w-full h-full">
            <StartView 
              onStart={startGame} 
              onShowInstructions={() => setGameState(prev => ({ ...prev, screen: 'instructions' }))}
              onShowLeaderboard={() => setGameState(prev => ({ ...prev, screen: 'leaderboard' }))}
            />
          </motion.div>
        )}

        {gameState.screen === 'leaderboard' && (
          <motion.div key="leaderboard" className="w-full h-full overflow-y-auto">
            <LeaderboardView onBack={() => setGameState(prev => ({ ...prev, screen: 'start' }))} />
          </motion.div>
        )}

        {gameState.screen === 'instructions' && (
          <motion.div key="instructions" className="w-full h-full overflow-y-auto">
            <InstructionsView onBack={() => setGameState(prev => ({ ...prev, screen: 'start' }))} />
          </motion.div>
        )}

        {gameState.screen === 'selection' && (
          <motion.div key="selection" className="w-full h-full">
            <SelectionView onSelect={handleSelection} />
          </motion.div>
        )}

        {gameState.screen === 'loot' && (
          <motion.div key="loot" className="w-full h-full">
            <LootView onSelect={handleLoot} deck={gameState.deck} currentFloor={gameState.currentFloor} />
          </motion.div>
        )}

        {gameState.screen === 'map' && (
          <motion.div key="map" className="relative h-screen flex flex-col">
            <StatusHeader state={gameState} />
            <MapView 
              nodes={gameState.nodes} 
              onNodeClick={handleNodeClick}
              currentFloor={gameState.currentFloor}
            />
          </motion.div>
        )}

        {gameState.screen === 'battle' && (
          <motion.div key="battle" className="w-full h-full">
            <BattleView 
              player={gameState}
              enemy={gameState.selectedEnemy!}
              onEnd={onBattleEnd}
            />
          </motion.div>
        )}

        {gameState.screen === 'store' && (
          <motion.div key="store" className="w-full h-full">
             <StoreView 
               state={gameState} 
               onUpdate={(updates) => setGameState(prev => ({ ...prev, ...updates }))}
               onLeave={() => {
                 if (gameState.currentNodeId !== null) {
                   completeNode(gameState.currentNodeId!, 0);
                 }
               }}
             />
          </motion.div>
        )}

        {(gameState.screen === 'gameover' || gameState.screen === 'victory') && (
          <motion.div key="end" className="flex flex-col items-center justify-center h-screen bg-black overflow-hidden relative">
            <div className="absolute inset-0 bg-radial-gradient(circle at 50% 50%, #3a1510 0%, transparent 70%) opacity-30 pointer-events-none" />
            <motion.h1 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-7xl font-serif italic mb-6 relative z-10"
            >
              {gameState.screen === 'victory' ? 'Eternal Peace Found' : 'Your Soul is Lost'}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/60 mb-16 text-2xl relative z-10"
            >
              {gameState.screen === 'victory' ? 'You have reached the summit and reclaimed your destiny.' : 'The Spire consumes another wanderer.'}
            </motion.p>
            <button 
              onClick={() => setGameState(prev => ({ ...prev, screen: 'start' }))}
              className="px-12 py-4 bg-white text-black font-bold rounded-full hover:scale-110 active:scale-95 transition-all relative z-10"
            >
              Restart Journey
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
