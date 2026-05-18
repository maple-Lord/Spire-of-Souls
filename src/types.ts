export type StatType = 'might' | 'agility' | 'arcane';

export interface Card {
  id: string;
  name: string;
  image: string;
  might: number;
  agility: number;
  arcane: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  level?: number;
}

export interface Enemy {
  id: string;
  name: string;
  image: string;
  hp: number;
  maxHp: number;
  deck: Card[];
}

export type NodeStatus = 'locked' | 'available' | 'completed';
export type NodeType = 'battle' | 'elite' | 'store' | 'mystery' | 'boss';

export interface TowerNode {
  id: number;
  type: NodeType;
  status: NodeStatus;
  row: number;
  connections: number[]; // IDs of nodes in the next row
}

export interface GameState {
  screen: 'start' | 'selection' | 'map' | 'battle' | 'store' | 'loot' | 'gameover' | 'victory' | 'instructions' | 'leaderboard';
  playerHp: number;
  playerMaxHp: number;
  gold: number;
  deck: Card[];
  currentFloor: number;
  nodes: TowerNode[];
  currentNodeId: number | null;
  selectedEnemy: Enemy | null;
}
