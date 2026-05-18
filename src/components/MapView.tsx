import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { TowerNode } from '../types.ts';
import { Sword, ShoppingCart, HelpCircle, Skull, Zap } from 'lucide-react';

const NODE_ICONS = {
  battle: Sword,
  elite: Zap,
  store: ShoppingCart,
  mystery: HelpCircle,
  boss: Skull,
};

const NODE_COLORS = {
  battle: 'bg-white/5 border-white/10 text-white/50',
  elite: 'bg-indigo-900/20 border-indigo-500/40 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.2)]',
  store: 'bg-cyan-900/20 border-cyan-500/40 text-cyan-300',
  mystery: 'bg-purple-900/20 border-purple-500/40 text-purple-300',
  boss: 'bg-red-900/30 border-red-500/50 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.2)]',
};

export default function MapView({ 
  nodes, 
  onNodeClick,
  currentFloor 
}: { 
  nodes: TowerNode[]; 
  onNodeClick: (node: TowerNode) => void;
  currentFloor: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
        const floorEl = document.getElementById(`floor-${currentFloor}`);
        if (floorEl) {
          floorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
  }, [currentFloor]);

  const rows = Array.from({ length: 30 }, (_, i) => i).reverse();

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-32 pb-80 relative bg-abyss-base" ref={containerRef}>
      <div className="max-w-md mx-auto relative min-h-[4500px]">
        {/* Section Divider */}
        <div className="absolute top-[2250px] left-1/2 -translate-x-1/2 w-[200%] h-[1px] bg-indigo-500/10 pointer-events-none">
           <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] uppercase font-bold tracking-[0.5em] text-indigo-500/20">The Zenith Gates</span>
        </div>

        {/* SVG Connections Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
          {nodes.map(node => node.connections.map(targetId => {
            const target = nodes.find(n => n.id === targetId);
            if (!target) return null;
            
            return (
              <ConnectionLine 
                key={`${node.id}-${targetId}`}
                fromId={`node-${node.id}`}
                toId={`node-${targetId}`}
                containerRef={containerRef}
              />
            );
          }))}
        </svg>

        {/* Nodes Layer */}
        <div className="flex flex-col-reverse gap-32">
          {rows.map(row => (
            <div 
              id={`floor-${row}`}
              key={row} 
              className="flex justify-around items-center"
            >
              {nodes.filter(n => n.row === row).map(node => {
                const Icon = NODE_ICONS[node.type];
                const isActive = node.status === 'available';
                const isCompleted = node.status === 'completed';
                
                return (
                  <motion.button
                    id={`node-${node.id}`}
                    key={node.id}
                    onClick={() => onNodeClick(node)}
                    className={`
                      relative w-14 h-14 rounded-full border flex items-center justify-center transition-all shadow-2xl
                      ${NODE_COLORS[node.type]}
                      ${isActive ? 'scale-125 cursor-pointer ring-1 ring-white/20 ring-offset-8 ring-offset-abyss-base' : 'opacity-20 grayscale'}
                      ${isCompleted ? 'opacity-10 translate-y-1' : ''}
                    `}
                    whileHover={isActive ? { scale: 1.4, y: -5 } : {}}
                    whileTap={isActive ? { scale: 1.1 } : {}}
                  >
                    <Icon className={`w-5 h-5 ${isCompleted ? 'opacity-0' : ''}`} />
                    {isCompleted && <div className="absolute inset-0 flex items-center justify-center text-white/40">✓</div>}
                    
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] uppercase font-bold tracking-[0.3em] text-white/10 whitespace-nowrap">
                       Sector {node.id}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className={`absolute top-0 left-0 w-full h-full transition-colors duration-1000 ${currentFloor > 14 ? 'bg-[radial-gradient(circle_at_50%_0%,rgba(199,210,254,0.1)_0%,transparent_60%)]' : 'bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05)_0%,transparent_50%)]'}`} />
      </div>
    </div>
  );
}

function ConnectionLine({ 
  fromId, 
  toId, 
  containerRef 
}: { 
  fromId: string; 
  toId: string; 
  containerRef: React.RefObject<HTMLDivElement | null>;
  key?: any;
}) {
  const [coords, setCoords] = useState<{ x1: number; y1: number; x2: number; y2: number }>({ x1: 0, y1: 0, x2: 0, y2: 0 });

  useEffect(() => {
    const update = () => {
      const from = document.getElementById(fromId);
      const to = document.getElementById(toId);
      
      if (from && to) {
        // Use offsetLeft/Top which are relative to the parent container
        const parent = from.offsetParent as HTMLElement;
        if (parent) {
          setCoords({
            x1: from.offsetLeft + from.offsetWidth / 2,
            y1: from.offsetTop + from.offsetHeight / 2,
            x2: to.offsetLeft + to.offsetWidth / 2,
            y2: to.offsetTop + to.offsetHeight / 2,
          });
        }
      }
    };
    
    update();
    // Use a small delay to catch layout shifts
    const timer = setTimeout(update, 500);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      clearTimeout(timer);
    };
  }, [fromId, toId]);

  return (
    <line 
      x1={coords.x1} 
      y1={coords.y1} 
      x2={coords.x2} 
      y2={coords.y2} 
      stroke="white" 
      strokeWidth="2"
      strokeDasharray="4 4"
    />
  );
}
