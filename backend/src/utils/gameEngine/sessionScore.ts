/**
 * Session Score Accumulation for Tiến Lên Miền Nam
 *
 * Implements score accumulation across multiple games in a table session.
 * A table session contains 16 or 32 games, and points accumulate across all games.
 *
 * Task 2.8.5: Session Score Accumulation
 */

import { GameScoreResult, PlayerScore } from './gameScore';
import { ValidationException } from '../../common/exceptions';

/**
 * Points for a single player in a single game
 */
export interface GamePlayerScore {
  /** Game number (1-based) */
  gameNumber: number;
  /** Player index (0-based) */
  playerIndex: number;
  /** Total score for this player in this game */
  score: number;
  /** Score breakdown for this game */
  breakdown: PlayerScore['breakdown'];
}

/**
 * Session score state for tracking points across games
 */
export interface SessionScoreState {
  /** Total number of players in the session */
  numPlayers: number;
  /** Total number of games in the session (16 or 32) */
  totalGames: number;
  /** Map of player index to array of game scores */
  playerGameScores: Map<number, GamePlayerScore[]>;
  /** Map of player index to total accumulated points */
  playerTotals: Map<number, number>;
}

/**
 * Final session ranking entry
 */
export interface SessionRanking {
  /** Player index (0-based) */
  playerIndex: number;
  /** Final rank (1 = highest total, 2 = second highest, etc.) */
  rank: number;
  /** Total accumulated points across all games */
  totalPoints: number;
  /** Array of scores per game */
  gameScores: GamePlayerScore[];
}

/**
 * Complete session score result
 */
export interface SessionScoreResult {
  /** Array of player rankings (sorted by rank) */
  rankings: SessionRanking[];
  /** Index of session winner (player with highest total points) */
  sessionWinnerIndex: number;
  /** Total number of games completed */
  gamesCompleted: number;
  /** Total number of games in session */
  totalGames: number;
}

/**
 * Initializes session score tracking state
 *
 * @param numPlayers - Total number of players (2-4)
 * @param totalGames - Total number of games in session (16 or 32)
 * @returns Initialized SessionScoreState
 */
export function initializeSessionScore(numPlayers: number, totalGames: number): SessionScoreState {
  if (numPlayers < 2 || numPlayers > 4) {
    throw new ValidationException(
      `Invalid number of players: ${numPlayers}. Must be between 2 and 4.`,
      undefined,
      { numPlayers },
    );
  }

  if (totalGames !== 16 && totalGames !== 32) {
    throw new ValidationException(
      `Invalid total games: ${totalGames}. Must be 16 or 32.`,
      undefined,
      { totalGames },
    );
  }

  const playerGameScores = new Map<number, GamePlayerScore[]>();
  const playerTotals = new Map<number, number>();

  for (let i = 0; i < numPlayers; i++) {
    playerGameScores.set(i, []);
    playerTotals.set(i, 0);
  }

  return {
    numPlayers,
    totalGames,
    playerGameScores,
    playerTotals,
  };
}

/**
 * Records game scores for a single game
 *
 * Subtask 2.8.5.1: Track points per game for each player
 *
 * @param sessionState - Current session score state
 * @param gameNumber - Game number (1-based)
 * @param gameScoreResult - Game score result from calculateGameScore
 * @returns Updated SessionScoreState
 */
export function recordGameScores(
  sessionState: SessionScoreState,
  gameNumber: number,
  gameScoreResult: GameScoreResult,
): SessionScoreState {
  if (gameNumber < 1 || gameNumber > sessionState.totalGames) {
    throw new ValidationException(
      `Invalid game number: ${gameNumber}. Must be between 1 and ${sessionState.totalGames}.`,
      undefined,
      { gameNumber, totalGames: sessionState.totalGames },
    );
  }

  if (gameScoreResult.playerScores.length !== sessionState.numPlayers) {
    throw new ValidationException(
      `Game score result has ${gameScoreResult.playerScores.length} players, but session expects ${sessionState.numPlayers}.`,
      undefined,
      {
        gameScorePlayers: gameScoreResult.playerScores.length,
        sessionPlayers: sessionState.numPlayers,
      },
    );
  }

  const updatedPlayerGameScores = new Map(sessionState.playerGameScores);
  const updatedPlayerTotals = new Map(sessionState.playerTotals);

  // Record scores for each player
  for (const playerScore of gameScoreResult.playerScores) {
    const playerIndex = playerScore.playerIndex;

    if (playerIndex < 0 || playerIndex >= sessionState.numPlayers) {
      throw new ValidationException(
        `Invalid player index: ${playerIndex}. Must be between 0 and ${sessionState.numPlayers - 1}.`,
        undefined,
        { playerIndex, numPlayers: sessionState.numPlayers },
      );
    }

    // Create game player score entry
    const gamePlayerScore: GamePlayerScore = {
      gameNumber,
      playerIndex,
      score: playerScore.totalScore,
      breakdown: playerScore.breakdown,
    };

    // Add to player's game scores
    const playerScores = updatedPlayerGameScores.get(playerIndex) || [];
    updatedPlayerGameScores.set(playerIndex, [...playerScores, gamePlayerScore]);

    // Accumulate total points
    const currentTotal = updatedPlayerTotals.get(playerIndex) || 0;
    updatedPlayerTotals.set(playerIndex, currentTotal + playerScore.totalScore);
  }

  return {
    ...sessionState,
    playerGameScores: updatedPlayerGameScores,
    playerTotals: updatedPlayerTotals,
  };
}

/**
 * Accumulates points across all games in session
 *
 * Subtask 2.8.5.2: Accumulate points across all games in session
 *
 * @param sessionState - Current session score state
 * @returns Map of player index to total accumulated points
 */
export function accumulateSessionPoints(sessionState: SessionScoreState): Map<number, number> {
  return new Map(sessionState.playerTotals);
}

/**
 * Calculates session totals for all players
 *
 * Subtask 2.8.5.3: Calculate session totals
 *
 * @param sessionState - Current session score state
 * @returns Map of player index to total points
 */
export function calculateSessionTotals(sessionState: SessionScoreState): Map<number, number> {
  return accumulateSessionPoints(sessionState);
}

/**
 * Determines final session ranking
 *
 * Subtask 2.8.5.4: Determine final session ranking
 *
 * Players are ranked by total points (highest to lowest).
 * If two players have the same total, they are ranked by the order they appear (first player wins tie).
 *
 * @param sessionState - Current session score state
 * @returns Array of SessionRanking sorted by rank (1 = highest, 2 = second, etc.)
 */
export function determineSessionRanking(sessionState: SessionScoreState): SessionRanking[] {
  const rankings: SessionRanking[] = [];

  // Create ranking entries for all players
  for (let i = 0; i < sessionState.numPlayers; i++) {
    const totalPoints = sessionState.playerTotals.get(i) || 0;
    const gameScores = sessionState.playerGameScores.get(i) || [];

    rankings.push({
      playerIndex: i,
      rank: 0, // Will be set after sorting
      totalPoints,
      gameScores,
    });
  }

  // Sort by total points (descending), then by player index (ascending) for tie-breaking
  rankings.sort((a, b) => {
    if (a.totalPoints !== b.totalPoints) {
      return b.totalPoints - a.totalPoints; // Higher points = better rank
    }
    return a.playerIndex - b.playerIndex; // Lower index wins tie
  });

  // Assign ranks
  for (let i = 0; i < rankings.length; i++) {
    rankings[i].rank = i + 1;
  }

  return rankings;
}

/**
 * Calculates complete session score result
 *
 * This is the main function that combines all session score logic.
 *
 * @param sessionState - Current session score state
 * @returns Complete SessionScoreResult
 */
export function calculateSessionScoreResult(sessionState: SessionScoreState): SessionScoreResult {
  const rankings = determineSessionRanking(sessionState);
  const sessionWinner = rankings[0]; // Highest total points

  // Count completed games (games that have been recorded)
  const allGameScores = Array.from(sessionState.playerGameScores.values());
  const gamesCompleted =
    allGameScores.length > 0 ? Math.max(...allGameScores.map((scores) => scores.length)) : 0;

  return {
    rankings,
    sessionWinnerIndex: sessionWinner.playerIndex,
    gamesCompleted,
    totalGames: sessionState.totalGames,
  };
}

/**
 * Gets points for a specific player in a specific game
 *
 * @param sessionState - Current session score state
 * @param playerIndex - Player index (0-based)
 * @param gameNumber - Game number (1-based)
 * @returns GamePlayerScore if found, null otherwise
 */
export function getPlayerGameScore(
  sessionState: SessionScoreState,
  playerIndex: number,
  gameNumber: number,
): GamePlayerScore | null {
  const playerScores = sessionState.playerGameScores.get(playerIndex);
  if (!playerScores) {
    return null;
  }

  return playerScores.find((score) => score.gameNumber === gameNumber) || null;
}

/**
 * Gets total points for a specific player
 *
 * @param sessionState - Current session score state
 * @param playerIndex - Player index (0-based)
 * @returns Total accumulated points
 */
export function getPlayerTotalPoints(sessionState: SessionScoreState, playerIndex: number): number {
  return sessionState.playerTotals.get(playerIndex) || 0;
}

/**
 * Gets all game scores for a specific player
 *
 * @param sessionState - Current session score state
 * @param playerIndex - Player index (0-based)
 * @returns Array of GamePlayerScore for this player
 */
export function getPlayerGameScores(
  sessionState: SessionScoreState,
  playerIndex: number,
): GamePlayerScore[] {
  return sessionState.playerGameScores.get(playerIndex) || [];
}
