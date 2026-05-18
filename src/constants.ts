import { Card, Enemy, StatType } from './types';

export const STAT_CONFIG: Record<StatType, { label: string; color: string; icon: string }> = {
  might: { label: 'Might', color: 'text-red-500', icon: 'Sword' },
  agility: { label: 'Agility', color: 'text-green-500', icon: 'Zap' },
  arcane: { label: 'Arcane', color: 'text-blue-500', icon: 'Sparkles' },
};

export const RARITY_COLORS: Record<Card['rarity'], string> = {
  common: 'border-slate-400 text-slate-400',
  rare: 'border-blue-400 text-blue-400',
  epic: 'border-purple-400 text-purple-400',
  legendary: 'border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)]',
};

export const INITIAL_CARDS: Card[] = [
  { id: 'c1', name: 'Iron Squire', image: '🛡️', might: 6, agility: 4, arcane: 2, rarity: 'common' },
  { id: 'c2', name: 'Cloud Scout', image: '🏹', might: 3, agility: 7, arcane: 2, rarity: 'common' },
  { id: 'c3', name: 'Mystic Page', image: '✨', might: 2, agility: 3, arcane: 7, rarity: 'common' },
  { id: 'c4', name: 'Shadow Thief', image: '🗡️', might: 4, agility: 6, arcane: 2, rarity: 'common' },
];

export const CARD_POOL: Card[] = [
  ...INITIAL_CARDS,
  { id: 'c5', name: 'Sun Knight', image: '☀️', might: 9, agility: 5, arcane: 3, rarity: 'rare' },
  { id: 'c6', name: 'Crescent Duelist', image: '🌙', might: 5, agility: 10, arcane: 4, rarity: 'rare' },
  { id: 'c7', name: 'Storm Weaver', image: '⚡', might: 4, agility: 4, arcane: 11, rarity: 'rare' },
  { id: 'c8', name: 'Flame Guardian', image: '🔥', might: 8, agility: 4, arcane: 8, rarity: 'epic' },
  { id: 'c9', name: 'Void Assassin', image: '🌌', might: 7, agility: 12, arcane: 3, rarity: 'epic' },
  { id: 'c10', name: 'Frost Prophet', image: '❄️', might: 5, agility: 6, arcane: 14, rarity: 'epic' },
  { id: 'c11', name: 'Solaris Rex', image: '👑', might: 15, agility: 10, arcane: 10, rarity: 'legendary' },
  { id: 'c12', name: 'Spectral King', image: '👑', might: 10, agility: 18, arcane: 8, rarity: 'legendary' },
  { id: 'c13', name: 'Oblivion Lord', image: '🌀', might: 12, agility: 12, arcane: 15, rarity: 'legendary' },
  { id: 'c14', name: 'Nova Celestial', image: '✨', might: 18, agility: 15, arcane: 18, rarity: 'legendary' },
  { id: 'c15', name: 'Abyss Devourer', image: '🕳️', might: 20, agility: 12, arcane: 14, rarity: 'legendary' },
  { id: 'c16', name: 'Time Bender', image: '⏳', might: 14, agility: 20, arcane: 20, rarity: 'legendary' },
];

export const ENEMIES: Partial<Enemy>[] = [
  { name: 'Rust-Eaten Armor', image: '🛡️', hp: 8, maxHp: 8 },
  { name: 'Sentient Sludge', image: '☣️', hp: 6, maxHp: 6 },
  { name: 'Cinder Wisp', image: '☄️', hp: 5, maxHp: 5 },
  { name: 'Gale Wraith', image: '🌬️', hp: 6, maxHp: 6 },
  { name: 'Overgrowth Stalker', image: '👺', hp: 10, maxHp: 10 },
  { name: 'Dread-Tide Terror', image: '🦑', hp: 15, maxHp: 15 },
  { name: 'Soul-Hungry Fiend', image: '👿', hp: 20, maxHp: 20 },
  { name: 'Void-Crest Drake', image: '🐉', hp: 25, maxHp: 25 },
  { name: 'Colossus of Ruin', image: '🗿', hp: 35, maxHp: 35 },
  { name: 'Nebula Devourer', image: '🌌', hp: 45, maxHp: 45 },
];

export const TOWER_HEIGHT = 30;
export const TOWER_WIDTH = 4;
