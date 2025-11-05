// Shared game types
export interface Card {
  rank: string; // "3"-"10", "J", "Q", "K", "A", "2"
  suit: string; // "♠", "♥", "♦", "♣"
  value: number; // 1-13 for comparison
  points: number; // 1, 2, or 4 for scoring
  id: string; // Unique identifier
}

export interface GameState {
  // Game state structure - to be defined
}

