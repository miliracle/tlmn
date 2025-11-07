import { Card, CARD_RANK_ORDER } from '../../types/game';

/**
 * Instant win types for initial rounds (Ván Khởi Đầu)
 */
export type InitialRoundInstantWinType =
  | 'tu_quy_3' // Four 3s
  | 'tu_quy_heo' // All four 2s
  | '3_doi_thong_co_spade_3' // 3 consecutive pairs including ♠3
  | '4_doi_thong_co_spade_3' // 4 consecutive pairs including ♠3
  | '3_sam_co' // Three triples
  | '4_sam_co' // Four triples
  | '3_tu_quy' // Three four of a kinds
  | '5_doi_1_sam' // 5 pairs + 1 triple
  | '5_doi_thong_1_sam'; // 5 consecutive pairs + 1 triple

/**
 * Instant win types for other rounds (not initial round)
 */
export type OtherRoundInstantWinType =
  | 'tu_quy_heo' // All four 2s
  | '5_doi_thong' // 5 consecutive pairs
  | '6_doi_bat_ki' // 6 pairs, any ranks
  | 'sanh_rong' // 3 to A straight (12 cards)
  | 'dong_chat_dong_mau'; // All same color (all red or all black)

/**
 * Result of instant win detection
 */
export interface InstantWinResult {
  hasInstantWin: boolean;
  type?: InitialRoundInstantWinType | OtherRoundInstantWinType;
}

/**
 * Checks if a card is the Spades 3 (♠3)
 */
function isSpade3(card: Card): boolean {
  return card.rank === '3' && card.suit === 'Spades';
}

/**
 * Groups cards by rank
 */
function groupCardsByRank(hand: Card[]): { [rank: string]: Card[] } {
  const grouped: { [rank: string]: Card[] } = {};
  for (const card of hand) {
    if (!grouped[card.rank]) {
      grouped[card.rank] = [];
    }
    grouped[card.rank].push(card);
  }
  return grouped;
}

/**
 * Finds all pairs (đôi) in a hand
 * Returns array of pairs, where each pair is an array of 2 cards
 * This is used when we need to check if a specific card (like ♠3) is in a pair
 */
function findPairs(hand: Card[]): Card[][] {
  const grouped = groupCardsByRank(hand);
  const pairs: Card[][] = [];

  for (const rank in grouped) {
    const cards = grouped[rank];
    // If we have 2 or more cards of the same rank, we can form pairs
    if (cards.length >= 2) {
      // For each pair we can form
      const numPairs = Math.floor(cards.length / 2);
      for (let i = 0; i < numPairs; i++) {
        pairs.push([cards[i * 2], cards[i * 2 + 1]]);
      }
    }
  }

  return pairs;
}

/**
 * Finds all triples (sám cô) in a hand
 * Returns array of triples, where each triple is an array of 3 cards
 */
function findTriples(hand: Card[]): Card[][] {
  const grouped = groupCardsByRank(hand);
  const triples: Card[][] = [];

  for (const rank in grouped) {
    const cards = grouped[rank];
    if (cards.length >= 3) {
      // Take the first 3 cards as a triple
      triples.push(cards.slice(0, 3));
    }
  }

  return triples;
}

/**
 * Finds all four of a kinds (tứ quý) in a hand
 * Returns array of four of a kinds, where each is an array of 4 cards
 */
function findFourOfKinds(hand: Card[]): Card[][] {
  const grouped = groupCardsByRank(hand);
  const fourOfKinds: Card[][] = [];

  for (const rank in grouped) {
    const cards = grouped[rank];
    if (cards.length === 4) {
      fourOfKinds.push(cards);
    }
  }

  return fourOfKinds;
}

/**
 * Checks if a hand contains the Spades 3 (♠3)
 */
function hasSpade3(hand: Card[]): boolean {
  return hand.some(isSpade3);
}

/**
 * Checks if a set of consecutive pairs includes the Spades 3
 */
function consecutivePairsIncludeSpade3(pairs: Card[][]): boolean {
  for (const pair of pairs) {
    if (pair.some(isSpade3)) {
      return true;
    }
  }
  return false;
}

/**
 * Subtask 2.3.1.1: Check for tứ quý 3 (four 3s)
 */
function checkTuQuy3(hand: Card[]): boolean {
  const grouped = groupCardsByRank(hand);
  const threes = grouped['3'];
  return threes !== undefined && threes.length === 4;
}

/**
 * Subtask 2.3.1.2: Check for tứ quý heo (all four 2s)
 */
function checkTuQuyHeo(hand: Card[]): boolean {
  const grouped = groupCardsByRank(hand);
  const twos = grouped['2'];
  return twos !== undefined && twos.length === 4;
}

/**
 * Helper function to find all possible consecutive pairs sequences in a hand
 * Returns array of sequences, where each sequence is an array of pairs
 */
function findAllConsecutivePairsSequences(hand: Card[]): Card[][][] {
  const pairs = findPairs(hand);
  const sequences: Card[][][] = [];

  // Group pairs by rank
  const pairsByRank: { [rank: string]: Card[][] } = {};
  for (const pair of pairs) {
    const rank = pair[0].rank;
    if (!pairsByRank[rank]) {
      pairsByRank[rank] = [];
    }
    pairsByRank[rank].push(pair);
  }

  // Get all ranks that have pairs (excluding rank 2)
  const ranksWithPairs = Object.keys(pairsByRank)
    .filter((rank) => rank !== '2')
    .sort((a, b) => (CARD_RANK_ORDER[a] ?? 0) - (CARD_RANK_ORDER[b] ?? 0));

  // Try to find consecutive sequences starting from each rank
  for (let startIdx = 0; startIdx < ranksWithPairs.length; startIdx++) {
    for (let length = 3; length <= 6; length++) {
      if (startIdx + length > ranksWithPairs.length) break;

      // Check if we have a consecutive sequence
      let isValidSequence = true;
      const sequence: Card[][] = [];

      for (let i = 0; i < length; i++) {
        const currentRank = ranksWithPairs[startIdx + i];
        const expectedRankOrder = CARD_RANK_ORDER[ranksWithPairs[startIdx]] + i;

        if (CARD_RANK_ORDER[currentRank] !== expectedRankOrder) {
          isValidSequence = false;
          break;
        }

        // Take one pair from this rank
        if (pairsByRank[currentRank] && pairsByRank[currentRank].length > 0) {
          sequence.push(pairsByRank[currentRank][0]);
        } else {
          isValidSequence = false;
          break;
        }
      }

      if (isValidSequence && sequence.length === length) {
        sequences.push(sequence);
      }
    }
  }

  return sequences;
}

/**
 * Subtask 2.3.1.3: Check for 3 đôi thông có ♠3
 */
function check3DoiThongCoSpade3(hand: Card[]): boolean {
  if (!hasSpade3(hand)) {
    return false;
  }

  const sequences = findAllConsecutivePairsSequences(hand);
  for (const sequence of sequences) {
    if (sequence.length === 3 && consecutivePairsIncludeSpade3(sequence)) {
      return true;
    }
  }

  return false;
}

/**
 * Subtask 2.3.1.4: Check for 4 đôi thông có ♠3
 */
function check4DoiThongCoSpade3(hand: Card[]): boolean {
  if (!hasSpade3(hand)) {
    return false;
  }

  const sequences = findAllConsecutivePairsSequences(hand);
  for (const sequence of sequences) {
    if (sequence.length === 4 && consecutivePairsIncludeSpade3(sequence)) {
      return true;
    }
  }

  return false;
}

/**
 * Subtask 2.3.1.5: Check for 3 sám cô
 */
function check3SamCo(hand: Card[]): boolean {
  const triples = findTriples(hand);
  return triples.length >= 3;
}

/**
 * Subtask 2.3.1.6: Check for 4 sám cô
 */
function check4SamCo(hand: Card[]): boolean {
  const triples = findTriples(hand);
  return triples.length >= 4;
}

/**
 * Subtask 2.3.1.7: Check for 3 tứ quý
 */
function check3TuQuy(hand: Card[]): boolean {
  const fourOfKinds = findFourOfKinds(hand);
  // Filter out tứ quý heo (rank 2) as it's a separate instant win condition
  const nonHeoFourOfKinds = fourOfKinds.filter((fok) => fok[0].rank !== '2');
  return nonHeoFourOfKinds.length >= 3;
}

/**
 * Helper function to check if we can form 5 pairs and 1 triple from a hand
 * This is a complex check that needs to ensure we can use all 13 cards
 * We need exactly 5 pairs (10 cards) + 1 triple (3 cards) = 13 cards total
 */
function canForm5Pairs1Triple(hand: Card[]): boolean {
  if (hand.length !== 13) return false;

  const grouped = groupCardsByRank(hand);
  const ranks = Object.keys(grouped);

  // Convert to counts
  const cardCounts: { [rank: string]: number } = {};
  for (const rank of ranks) {
    cardCounts[rank] = grouped[rank].length;
  }

  // Try each rank as the potential triple
  for (const tripleRank of ranks) {
    if (cardCounts[tripleRank] < 3) continue;

    // Try using 3 cards from this rank as the triple
    const remainingCounts = { ...cardCounts };
    remainingCounts[tripleRank] -= 3;

    // Count how many pairs we can form from remaining cards
    let pairsFormed = 0;
    let cardsUsedForPairs = 0;

    for (const rank of ranks) {
      const available = remainingCounts[rank] || 0;
      const pairsFromThisRank = Math.floor(available / 2);
      pairsFormed += pairsFromThisRank;
      cardsUsedForPairs += pairsFromThisRank * 2;
    }

    // Check if we can form exactly 5 pairs (10 cards) and 1 triple (3 cards) = 13 cards
    // Also check that we don't have leftover cards that can't be used
    const totalUsed = cardsUsedForPairs + 3; // 3 for triple
    if (pairsFormed >= 5 && totalUsed === 13) {
      // Verify no leftover cards
      let leftoverCards = 0;
      for (const rank of ranks) {
        const available = remainingCounts[rank] || 0;
        leftoverCards += available % 2; // Cards that can't form pairs
      }
      if (leftoverCards === 0) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Subtask 2.3.1.8: Check for 5 đôi 1 sám
 */
function check5Doi1Sam(hand: Card[]): boolean {
  return canForm5Pairs1Triple(hand);
}

/**
 * Helper function to check if we can form 5 consecutive pairs and 1 triple
 * We need exactly 5 consecutive pairs (10 cards) + 1 triple (3 cards) = 13 cards total
 */
function canForm5ConsecutivePairs1Triple(hand: Card[]): boolean {
  if (hand.length !== 13) return false;

  const grouped = groupCardsByRank(hand);
  const ranks = Object.keys(grouped).filter((rank) => rank !== '2'); // Exclude rank 2 from consecutive pairs

  // Convert to counts
  const cardCounts: { [rank: string]: number } = {};
  for (const rank in grouped) {
    cardCounts[rank] = grouped[rank].length;
  }

  // Sort ranks by order
  const sortedRanks = ranks.sort((a, b) => (CARD_RANK_ORDER[a] ?? 0) - (CARD_RANK_ORDER[b] ?? 0));

  // Try to find 5 consecutive pairs
  for (let startIdx = 0; startIdx <= sortedRanks.length - 5; startIdx++) {
    // Check if we have 5 consecutive ranks
    let hasConsecutivePairs = true;
    const consecutiveRanks: string[] = [];

    for (let i = 0; i < 5; i++) {
      const currentRank = sortedRanks[startIdx + i];
      const expectedOrder = CARD_RANK_ORDER[sortedRanks[startIdx]] + i;

      if (CARD_RANK_ORDER[currentRank] !== expectedOrder) {
        hasConsecutivePairs = false;
        break;
      }

      // Check if we have at least 2 cards for a pair
      if ((cardCounts[currentRank] || 0) < 2) {
        hasConsecutivePairs = false;
        break;
      }

      consecutiveRanks.push(currentRank);
    }

    if (!hasConsecutivePairs) continue;

    // Reserve 2 cards from each of the 5 consecutive ranks (10 cards total)
    const remainingCounts = { ...cardCounts };
    for (const rank of consecutiveRanks) {
      remainingCounts[rank] = (remainingCounts[rank] || 0) - 2;
    }

    // Calculate total remaining cards
    let totalRemaining = 0;
    for (const rank in remainingCounts) {
      totalRemaining += remainingCounts[rank] || 0;
    }

    // Check if we can form exactly 1 triple from remaining cards (3 cards)
    // and the total remaining cards equals 3
    if (totalRemaining === 3) {
      // Check if we can form 1 triple from exactly 3 cards
      for (const rank in remainingCounts) {
        const count = remainingCounts[rank] || 0;
        if (count === 3) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Subtask 2.3.1.9: Check for 5 đôi thông 1 sám
 */
function check5DoiThong1Sam(hand: Card[]): boolean {
  return canForm5ConsecutivePairs1Triple(hand);
}

/**
 * Checks for all initial round instant win conditions
 * Returns the first matching condition found (in priority order)
 *
 * @param hand - Player's hand (should be exactly 13 cards)
 * @returns InstantWinResult with hasInstantWin flag and type if found
 */
export function checkInitialRoundInstantWin(hand: Card[]): InstantWinResult {
  // Validate hand size
  if (hand.length !== 13) {
    return { hasInstantWin: false };
  }

  // Check conditions in order (priority matters for some rules)
  // Check simpler conditions first

  // 1. Tứ quý 3
  if (checkTuQuy3(hand)) {
    return { hasInstantWin: true, type: 'tu_quy_3' };
  }

  // 2. Tứ quý heo
  if (checkTuQuyHeo(hand)) {
    return { hasInstantWin: true, type: 'tu_quy_heo' };
  }

  // 3. 4 đôi thông có ♠3 (check before 3 because it's more specific)
  if (check4DoiThongCoSpade3(hand)) {
    return { hasInstantWin: true, type: '4_doi_thong_co_spade_3' };
  }

  // 4. 3 đôi thông có ♠3
  if (check3DoiThongCoSpade3(hand)) {
    return { hasInstantWin: true, type: '3_doi_thong_co_spade_3' };
  }

  // 5. 3 tứ quý (check before sám cô because four-of-a-kind is more specific)
  if (check3TuQuy(hand)) {
    return { hasInstantWin: true, type: '3_tu_quy' };
  }

  // 6. 4 sám cô (check before 3 because it's more specific)
  if (check4SamCo(hand)) {
    return { hasInstantWin: true, type: '4_sam_co' };
  }

  // 7. 3 sám cô
  if (check3SamCo(hand)) {
    return { hasInstantWin: true, type: '3_sam_co' };
  }

  // 8. 5 đôi thông 1 sám (check before 5 đôi 1 sám because consecutive pairs is more specific)
  if (check5DoiThong1Sam(hand)) {
    return { hasInstantWin: true, type: '5_doi_thong_1_sam' };
  }

  // 9. 5 đôi 1 sám
  if (check5Doi1Sam(hand)) {
    return { hasInstantWin: true, type: '5_doi_1_sam' };
  }

  return { hasInstantWin: false };
}

/**
 * Checks if a card is red (Hearts or Diamonds)
 */
function isRedCard(card: Card): boolean {
  return card.suit === 'Hearts' || card.suit === 'Diamonds';
}

/**
 * Checks if a card is black (Clubs or Spades)
 */
function isBlackCard(card: Card): boolean {
  return card.suit === 'Clubs' || card.suit === 'Spades';
}

/**
 * Subtask 2.3.2.1: Check for tứ quý heo (all four 2s) - for other rounds
 */
function checkTuQuyHeoOtherRound(hand: Card[]): boolean {
  const grouped = groupCardsByRank(hand);
  const twos = grouped['2'];
  return twos !== undefined && twos.length === 4;
}

/**
 * Subtask 2.3.2.2: Check for 5 đôi thông (5 consecutive pairs)
 */
function check5DoiThong(hand: Card[]): boolean {
  if (hand.length !== 13) return false;

  const grouped = groupCardsByRank(hand);

  // Get all ranks that have at least 2 cards (can form pairs), excluding rank 2
  const ranksWithPairs = Object.keys(grouped)
    .filter((rank) => rank !== '2' && grouped[rank].length >= 2)
    .sort((a, b) => (CARD_RANK_ORDER[a] ?? 0) - (CARD_RANK_ORDER[b] ?? 0));

  // Try to find 5 consecutive pairs
  for (let startIdx = 0; startIdx <= ranksWithPairs.length - 5; startIdx++) {
    let isValidSequence = true;
    const consecutiveRanks: string[] = [];

    for (let i = 0; i < 5; i++) {
      const currentRank = ranksWithPairs[startIdx + i];
      const expectedRankOrder = CARD_RANK_ORDER[ranksWithPairs[startIdx]] + i;

      if (CARD_RANK_ORDER[currentRank] !== expectedRankOrder) {
        isValidSequence = false;
        break;
      }

      // Check if we have at least 2 cards for a pair
      if (grouped[currentRank] && grouped[currentRank].length >= 2) {
        consecutiveRanks.push(currentRank);
      } else {
        isValidSequence = false;
        break;
      }
    }

    if (isValidSequence && consecutiveRanks.length === 5) {
      // Use exactly 2 cards from each of the 5 consecutive ranks (10 cards total)
      const remainingGrouped = { ...grouped };
      for (const rank of consecutiveRanks) {
        remainingGrouped[rank] = (remainingGrouped[rank] || []).slice(2);
      }

      // Calculate remaining cards
      let totalRemaining = 0;
      let remainingPairs = 0;
      for (const rank in remainingGrouped) {
        const count = remainingGrouped[rank]?.length || 0;
        totalRemaining += count;
        remainingPairs += Math.floor(count / 2);
      }

      // We need exactly 3 leftover cards (13 - 10 = 3) and they should not form pairs
      // If remaining cards form pairs, it would be 6 đôi bất kì instead
      if (totalRemaining === 3 && remainingPairs === 0) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Subtask 2.3.2.3: Check for 6 đôi bất kì (6 pairs, any ranks)
 */
function check6DoiBatKi(hand: Card[]): boolean {
  if (hand.length !== 13) return false;

  const grouped = groupCardsByRank(hand);
  let pairCount = 0;
  let leftoverCards = 0;

  for (const rank in grouped) {
    const count = grouped[rank].length;
    const pairsFromRank = Math.floor(count / 2);
    pairCount += pairsFromRank;
    leftoverCards += count % 2;
  }

  // Need exactly 6 pairs (12 cards) and 1 leftover card
  return pairCount === 6 && leftoverCards === 1;
}

/**
 * Subtask 2.3.2.4: Check for sảnh rồng (3 to A straight - 12 cards)
 * Note: If hand contains rank 2, we can still form sảnh rồng if we have all ranks 3-A
 */
function checkSanhRong(hand: Card[]): boolean {
  if (hand.length !== 13) return false;

  const grouped = groupCardsByRank(hand);
  const ranksNeeded = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  // Check if we have at least one card of each required rank (3 to A)
  for (const rank of ranksNeeded) {
    if (!grouped[rank] || grouped[rank].length === 0) {
      return false;
    }
  }

  // We have all 12 ranks from 3 to A, so we can form sảnh rồng
  // The extra card (rank 2 or duplicate) doesn't matter
  return true;
}

/**
 * Subtask 2.3.2.5: Check for đồng chất đồng màu (all same color)
 * Red cards: Hearts and Diamonds
 * Black cards: Clubs and Spades
 */
function checkDongChatDongMau(hand: Card[]): boolean {
  if (hand.length !== 13) return false;

  // Check if all cards are red
  const allRed = hand.every(isRedCard);
  if (allRed) return true;

  // Check if all cards are black
  const allBlack = hand.every(isBlackCard);
  if (allBlack) return true;

  return false;
}

/**
 * Checks for all other round instant win conditions
 * Returns the first matching condition found (in priority order)
 *
 * @param hand - Player's hand (should be exactly 13 cards)
 * @returns InstantWinResult with hasInstantWin flag and type if found
 */
export function checkOtherRoundInstantWin(hand: Card[]): InstantWinResult {
  // Validate hand size
  if (hand.length !== 13) {
    return { hasInstantWin: false };
  }

  // Check conditions in priority order

  // 1. Tứ quý heo (highest priority)
  if (checkTuQuyHeoOtherRound(hand)) {
    return { hasInstantWin: true, type: 'tu_quy_heo' };
  }

  // 2. 5 đôi thông (check before 6 đôi bất kì because it's more specific)
  if (check5DoiThong(hand)) {
    return { hasInstantWin: true, type: '5_doi_thong' };
  }

  // 3. 6 đôi bất kì
  if (check6DoiBatKi(hand)) {
    return { hasInstantWin: true, type: '6_doi_bat_ki' };
  }

  // 4. Đồng chất đồng màu (check before sảnh rồng because it's more specific)
  if (checkDongChatDongMau(hand)) {
    return { hasInstantWin: true, type: 'dong_chat_dong_mau' };
  }

  // 5. Sảnh rồng
  if (checkSanhRong(hand)) {
    return { hasInstantWin: true, type: 'sanh_rong' };
  }

  return { hasInstantWin: false };
}

/**
 * Task 2.3.3: Instant Win Handler
 *
 * Unified function to check for instant win conditions based on round type.
 * Determines whether to check initial round or other round conditions.
 *
 * @param hand - Player's hand (should be exactly 13 cards)
 * @param isInitialRound - Whether this is an initial round (Ván Khởi Đầu)
 * @returns InstantWinResult with hasInstantWin flag and type if found
 */
export function checkInstantWin(hand: Card[], isInitialRound: boolean): InstantWinResult {
  // Validate hand size
  if (hand.length !== 13) {
    return { hasInstantWin: false };
  }

  // Determine which round type and call appropriate function
  if (isInitialRound) {
    return checkInitialRoundInstantWin(hand);
  } else {
    return checkOtherRoundInstantWin(hand);
  }
}
