import { motion } from 'motion/react';
import { Card } from '../types';
import { STAT_CONFIG, RARITY_COLORS } from '../constants';
import * as LucideIcons from 'lucide-react';

export default function CardComponent({ 
  card, 
  onClick, 
  disabled,
  selected,
  className = ""
}: { 
  card: Card; 
  onClick?: () => void; 
  disabled?: boolean;
  selected?: boolean;
  className?: string;
  key?: any;
}) {
      const rarityColor = RARITY_COLORS[card.rarity] || 'rgba(99, 102, 241, 0.3)';
      
  return (
    <motion.button
      whileHover={!disabled && onClick ? { y: -20, scale: 1.05 } : {}}
      whileTap={!disabled && onClick ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      style={{
        boxShadow: selected ? `0 0 40px ${rarityColor}` : `0 10px 30px rgba(0,0,0,0.5)`,
        borderColor: selected ? rarityColor : `${rarityColor}44`
      }}
      className={`
        relative w-44 h-64 rounded-xl border bg-[#0a0502] overflow-hidden text-left flex flex-col transition-all
        ${selected ? 'ring-2 ring-offset-4 ring-offset-abyss-base scale-105' : ''}
        ${disabled ? 'opacity-40 grayscale' : ''}
        ${className}
      `}
    >
      {/* Header Stat Strip */}
      <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: rarityColor }} />
      
      {/* Particle background for rare cards */}
      {card.rarity !== 'common' && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[60px]" style={{ backgroundColor: rarityColor }} />
        </div>
      )}
      
      {/* Label */}
      <div className="px-4 py-3 flex flex-col">
        <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-wider mb-1">
          Spirit • {card.rarity}
        </span>
        <h3 className="text-sm font-serif italic font-bold text-white/90 truncate">
          {card.name}
        </h3>
      </div>

      {/* Portrait Area */}
      <div className="flex-1 mx-4 bg-slate-900/50 rounded-lg flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
        {card.image}
      </div>

      {/* Stats Cluster */}
      <div className="p-4 grid grid-cols-1 gap-1">
        {(Object.entries(STAT_CONFIG) as [keyof typeof STAT_CONFIG, any][]).map(([key, config]) => {
          const Icon = (LucideIcons as any)[config.icon];
          return (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-2 opacity-50">
                <Icon className="w-3 h-3" />
                <span className="text-[10px] uppercase font-bold tracking-tighter">{config.label}</span>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-200">{card[key as keyof Card] as number}</span>
            </div>
          );
        })}
      </div>

      {/* Selection Glow Overlay */}
      {selected && (
        <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none" />
      )}
    </motion.button>
  );
}
