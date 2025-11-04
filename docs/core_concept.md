# Tiến Lên Miền Nam - Web Game Platform

## Comprehensive Project Description

---

## 1. Project Overview

A **web-based multiplayer card game platform** for Tiến lên miền Nam (Vietnamese Poker/Thirteen) that bridges traditional gameplay with competitive programming.

- **Play Modes:** Manual real-time play, or develop JavaScript-based AI bots to compete autonomously.
- **Table Creation:** Players create game tables, share links, and engage in matches that blend human strategy with algorithmic gameplay.

**Target Audience:**  
Card game enthusiasts & experienced programmers who enjoy competitive coding challenges.

**Primary Goal:**  
Create an engaging platform where human intuition and coded algorithms compete on equal footing in Vietnam's most popular card game.

---

## 2. Game Rules & Mechanics

### Tiến Lên Miền Nam - Official Rules

**Objective (Luật Chung):**  
This is a "liberation" style game - the first player to empty their hand wins.

### Game Structure Hierarchy

**Overall Flow:**
1. **Players create a table** → A table is a **table session**
2. **Table Session** contains **16 or 32 games** (configurable)
3. Each **Game** contains **multiple rounds** (vòng bài/lượt bài)
4. Each **Round** contains multiple player turns until the round ends

**Point Accumulation Flow:**
- **During Rounds:** Players can perform "chặt" (cutting) actions, which generate penalty points immediately (tracked per round)
- **After Each Game:** Points are calculated and accumulated:
  - Winner receives: Card Points + Cóng Penalties + Chặt Penalties (received) + Thúi Penalties (received)
  - Losers lose: Cards Remaining + Cóng Penalties (if applicable) + Chặt Penalties (paid) + Thúi Penalties (if last place)
- **After Table Session:** All game points are summed to show final session totals and rankings

### Setup

- **Table Session:** 2-4 players per table session
- **Session Length:** Each table session contains exactly 16 games (configurable: 16 or 32 games)
- **Deck:** Standard 52-card deck (no jokers)
- **Card Distribution:**
  - **All players receive exactly 13 cards per game, regardless of player count**
  - **4 players:** 4 × 13 = 52 cards (full deck used)
  - **3 players:** 3 × 13 = 39 cards (13 cards remain unused and are set aside)
  - **2 players:** 2 × 13 = 26 cards (26 cards remain unused and are set aside)
- **Special Rule - Tứ Quý Heo:** If all 4 cards of rank 2 (heo: ♠2, ♣2, ♦2, ♥2) are dealt to a single player, that player wins immediately (tới trắng) - see Instant Win Conditions

### Card Rankings

**By Number (Value):**  
2 (heo) > A (Át) > K > Q > J > 10 > 9 > 8 > 7 > 6 > 5 > 4 > 3

**By Suit (Chất):**  
Hearts (Cơ/♥) > Diamonds (Rô/♦) > Clubs (Tép/♣) > Spades (Bích/♠)

When comparing cards of the same rank, the higher suit wins.

### Starting Rounds (Ván Khởi Đầu)

**Initial Round (Ván Khởi Đầu):**
- Occurs at the start of a new game session or after someone "tới trắng" (instant win) in a previous game
- Player holding ♠3 (3 bích) goes first
- **Mandatory Rule:** The first player's first play **must include** ♠3
- If the first player has multiple valid combinations containing ♠3, they may choose any of them
- If the first player cannot form any valid combination with ♠3, they must play ♠3 as a single card (rác)

**Subsequent Rounds (within same game):**
- Winner of the previous round leads the next round
- Can play any combination type they want (no restrictions)

### Gameplay Flow (Lượt Bài / Vòng Bài)

**Turn Direction:**  
Players take turns **counter-clockwise** (right-hand direction)

**Round Structure (Lượt Bài / Vòng Bài):**

1. **First Player:** Leads with any combination type they choose
2. **Subsequent Players:** Can "đè bài" (beat/overplay) the last player who played
   - Must play **same combination type** and **higher value**
   - Exception: "Chặt" (cutting) rules apply for special cases (see Cutting Rules section)
3. **Turn Order:** Players take turns counter-clockwise (right-hand direction)
4. **Multiple Cycles:** Within the same round (lượt bài), players can beat multiple times across multiple cycles until all players pass
5. **Passing Rule:** 
   - If a player passes, they **cannot play again** in the current round
   - Playing rights are restored only when a new round begins
   - A player may pass even if they have valid moves
6. **Round End Conditions:**
   - **Normal End:** If 3 consecutive players pass (or all remaining players pass), the last player who played wins the round and starts the next round with any combination
   - **Special Rule - Hưởng Sái:** If the last player to play finishes (tới - plays their final card) and all remaining players cannot beat, the player immediately to the winner's right (counter-clockwise) gets to start the next round with any combination
   - **Game End:** If the player who wins the round has no cards remaining, the game ends immediately

### Valid Card Combinations

**Basic Combinations:**

- **Rác (Single):** One card that cannot form any combination
- **Đôi (Pair):** Two cards of the same rank, any suits
- **Ba (Triple):** Three cards of the same rank, any suits
- **Sảnh (Straight):** Three or more consecutive cards of any suits
  - Minimum 3 cards
  - Maximum 12 cards (3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A - cannot include 2)
  - **Ranking Rules:**
    - Longer straights beat shorter straights (regardless of highest card value)
    - Same-length straights are compared by highest card value
    - If same-length straights have the same highest card rank, compare by the highest card's suit (hearts > diamonds > clubs > spades)

**Special Combinations (Hàng):**

- **Đôi Thông (Consecutive Pairs):** Three or more consecutive pairs
  - Example: 3-3, 4-4, 5-5
  - Minimum 3 pairs
  - Maximum 6 pairs (consecutive pairs from 3 to A, excluding 2)
  - Longer sequences beat shorter sequences (regardless of highest pair rank)
  - Same-length sequences compared by highest pair rank
  - If same-length sequences have the same highest pair rank, compare by the highest pair's highest suit
- **Tứ Quý (Four of a Kind):** Four cards of the same rank
  - Special cutting power (see Chặt rules below)
  - Cannot be formed with rank 2 (heo) - see Instant Win Conditions
- **Sám Cô (Triple):** Three cards of the same rank (also called "Ba")
  - Can be formed with rank 2 (3 con heo) - see Cutting Rules

**End Game Combinations:**
- Players are allowed to play 3 or 4 consecutive pairs (đôi thông) at the end of their hand, even if they could have formed other combinations

### Instant Win Conditions (Tới Trắng)

A player wins immediately after dealing (without playing) if they have one of these special combinations:

**In Initial Rounds (Ván Khởi Đầu):**

- **Tứ quý 3:** Four of a kind of 3s
- **Tứ quý heo:** Four of a kind of 2s (♥2♦2♣2♠2) - all 4 heo in hand
- **3 đôi thông có ♠3:** 3 consecutive pairs including ♠3
- **4 đôi thông có ♠3:** 4 consecutive pairs including ♠3
- **3 sám cô:** Three triples (e.g., 444, 555, 666)
- **4 sám cô:** Four triples (e.g., 444, 555, 666, 777)
- **3 tứ quý:** Three four of a kinds (e.g., 4444, 5555, 6666)
- **5 đôi 1 sám:** 5 pairs + 1 triple (e.g., 33, 66, 88, 99, JJ, AAA)
- **5 đôi thông 1 sám:** 5 consecutive pairs + 1 triple (e.g., 44, 55, 66, 77, 88, JJJ)

**In Other Rounds:**

- **Tứ quý heo:** Four of a kind of 2s (♥2♦2♣2♠2)
- **5 đôi thông:** 5 consecutive pairs
- **6 đôi bất kì:** 6 pairs of any ranks
- **Sảnh rồng:** Straight from 3 to Ace (3-4-5-6-7-8-9-10-J-Q-K-A) - all cards in sequence
- **Đồng chất đồng màu:** All cards same color
  - Black: ♣♠ (clubs and spades)
  - Red: ♥♦ (hearts and diamonds)


### Cutting Rules (Chặt)

"Chặt" means using special combinations (hàng) to cut/beat "heo" (2s) or other special combinations, even if they are not the same combination type.

**Definition of "Vòng" (Round/Cycle):**
- A "vòng" exists when at least one player has already played in the current round before the cutting action
- If you are the first player in a round, you cannot cut (no vòng exists yet)
- If at least one player has played before you in the current round, a vòng exists and you can cut (if other requirements are met)

**Cutting Rules:**

- **3 đôi thông** can cut:
  - 1, 2, 3, or 4 heo (separate single 2s played in consecutive turns - see explanation below), OR
  - 3 đôi thông of smaller rank (must have same length: 3 pairs)
  - **Requirement:** Must have "vòng" (at least one player has played before in current round)
  - **Cannot cut:** Đôi heo (pair of 2s played together as a pair), 3 con heo (triple of 2s), 4 đôi thông, or tứ quý

- **Tứ quý** can cut:
  - 1, 2, 3, or 4 heo (separate single 2s played in consecutive turns - see explanation below), OR
  - 3 đôi thông (any rank), OR
  - Tứ quý of smaller rank
  - **Requirement:** Must have "vòng" (at least one player has played before in current round)
  - **Cannot cut:** Đôi heo (pair of 2s played together as a pair combination in one turn), 3 con heo (triple of 2s), or 4 đôi thông

- **4 đôi thông** can cut:
  - 1 heo (single 2 of any suit), OR
  - Đôi heo (pair of 2s), OR
  - 3 đôi thông (any rank), OR
  - Tứ quý (any rank), OR
  - 4 đôi thông of smaller rank (must have same length: 4 pairs)
  - **Special Rule:** Any 4 đôi thông can freely cut any heo or hàng (no vòng requirement) - this is the only exception to the vòng rule
  
- **Important Distinction:**
    - **"1, 2, 3, or 4 heo"** = Separate single heo cards played in consecutive turns (e.g., Turn 1: Player A plays ♠2 as single, Turn 2: Player B plays ♣2 as single, Turn 3: Player C plays ♦2 as single - tứ quý can cut the last one and penalty counts as cutting 3 heo if the last 3 plays were all single heo)
    - **"Đôi heo"** = A pair of 2s played together as a pair combination in one single turn (e.g., Player A plays ♠2♣2 together as a pair - tứ quý CANNOT cut this)

- **3 con heo** (triple of 2s): Cannot be cut by any hàng (highest uncuttable combination)

- **Tứ quý heo:** Instant win (tới trắng) - cannot be cut as it never enters play

**Chặt Chồng (Stacked Cutting):**  
When a chain of cuts occurs, the last person who is cut in the chain must pay penalties for all cuts in that chain.

**Example Chain:**
- Player B plays a heo (or hàng)
- Player A cuts Player B (B would normally pay penalty X)
- Player C cuts Player A (A is now cut)

**Result:**
- Player A must pay penalty for being cut by Player C (penalty Y)
- Player A must also pay the penalty that Player B would have paid (penalty X)
- Player B does NOT pay any penalty (penalty is transferred to Player A)
- **Total:** Player A pays (penalty X + penalty Y) to player C

**General Rule:**
- The last person cut in a chain pays penalties for:
  1. Being cut themselves
  2. All previous cuts in the chain (from players they cut who were subsequently cut)
- Players earlier in the chain who are cut do not pay penalties (they are transferred to the last person in the chain)

**Special Rule - Chặt and Finish:**  
If the person being cut finishes immediately after (plays their final card and wins), no one pays or receives penalties from that cutting action. The game ends normally.

### Getting Stuck (Cháy Bài / Cóng)

A player gets "cóng" (stuck) if they haven't played any cards during the entire game when someone else finishes (except in tới trắng cases where no one gets cóng).

**Cóng Penalty System:**

1. **Cóng 1 nhà (1 player stuck):**
   - Stuck player pays penalty: equivalent to "tới trắng" penalty (see Scoring section)
   - Other 2 players continue playing to determine 2nd/3rd place
   - Stuck player's hand is checked for thúi penalties (see Ending Last Penalties section)

2. **Cóng 2 nhà (2 players stuck):**
   - Both stuck players pay penalty: equivalent to "tới trắng" penalty each
   - Remaining player automatically gets 2nd place (no additional penalties)
   - Both stuck players' hands are checked for thúi penalties

3. **Cóng 3 nhà (3 players stuck):**
   - All three stuck players pay penalty: equivalent to "tới trắng" penalty each
   - **Đền bài (Penalty for Holding Playable Cards) Rule:**
     - If a player had playable cards during their turn but chose not to play them (allowing others to get cóng), they must pay additional "đền bài" penalty
     - **Đền bài penalty:** The player who đền bài must pay the equivalent of all cóng penalties (as if they were responsible for all stuck players)
     - Winner still receives full reward from all penalties
     - Other players who didn't đền bài and didn't win get nothing and lose nothing
     - In the next game, the player who đền bài cannot start first (even if they normally would)

**Definition of Playable Cards:**
- Cards that can legally beat the current play (same combination type, higher value)
- Cards that can legally cut (chặt) the current play according to cutting rules
- A player must play if they have playable cards, unless they are intentionally passing for strategic reasons (which triggers đền bài if others get cóng)

**Special Note - Ăn Trắng (Win by Color Exhaustion):**  
This rule is not implemented in this version. All games end only when a player plays their final card.

### Game End and Winner Determination

**Game End Condition:**
- The game ends when **the first player plays all cards in their hand** (wins)
- This can happen during any round when a player plays their final card(s)
- The remaining players are **losers** and are ranked by the number of cards left in their hand

**Player Ranking (Losers):**
- **2nd place:** Player with the fewest cards remaining
- **3rd place:** Player with the second-most cards remaining  
- **4th place (về bét):** Player with the most cards remaining
- If multiple players have the same number of cards, ranking is determined by comparing card values (higher total value = worse position)

**Winner's Point Calculation:**
- The winner receives points based on:
  1. **Remaining cards of losers:** 1 point per card remaining in each loser's hand
  2. **Thúi penalties:** Additional penalties if the last-place player (về bét) has heo or hàng remaining
  3. **Chặt penalties:** All penalties received from cutting other players throughout the game
  4. **Cóng penalties:** If any players got stuck (didn't play any cards)

### Ending Last Penalties (Thúi)

**Thúi Penalty:**
If the player who finishes 4th (về bét - has the most cards remaining) still has "heo" (2s) or "hàng" (special combinations) remaining in their hand, they pay additional penalties.

**Who Receives Penalties:**  
- **Normal games:** The player who finished 3rd receives the thúi penalties
- **Tới trắng games:** The winner receives the thúi penalties (in addition to other rewards)
- **Cóng games:** If the cóng player finishes last (về bét), thúi penalties are added to the winner's total reward

**Thúi Penalty Calculation:**
- Each heo (2) in hand: See penalty point values in Scoring section
- Each hàng (3 đôi thông, tứ quý, 4 đôi thông) in hand: 4 points each
- Multiple heo or hàng: Penalties are cumulative

### Scoring & Penalty System

**Point System (All values in points):**

**Penalty Point Values:**
- **Heo bích (♠2)** = 1 point
- **Heo chuồn (♣2)** = 1 point
- **Heo rô (♦2)** = 2 points
- **Heo cơ (♥2)** = 2 points
- **Hàng** (3 đôi thông, tứ quý, 4 đôi thông) = 4 points each

**Game Scoring (Per Game):**

The winner of each game receives points from all other players:

**Winner's Total Points = Card Points + Cóng Penalties + Chặt Penalties + Thúi Penalties**

1. **Card Points:**
   - Each card remaining in other players' hands = 1 point per card
   - Example: If Player A wins and Players B, C, D have 8, 6, 11 cards remaining respectively, Player A receives 8 + 6 + 11 = 25 card points

2. **Cóng Penalties:**
   - Each cóng player pays: equivalent to "tới trắng" penalty
   - **Tới trắng penalty value:** 13 points × number of players (52 points in 4-player game, 39 points in 3-player game, 26 points in 2-player game)
   - If cóng player also has thúi (heo/hàng in hand), thúi penalties are added separately

3. **Chặt Penalties:**
   - **When They Occur:** Chặt (cutting) penalties happen **during rounds** when players cut other players' plays
   - **Immediate Tracking:** Penalty points are calculated and tracked immediately when a cut occurs
   - **Accumulation:** All chặt penalties from all rounds are accumulated throughout the game
   - **Cutting Penalty Values (points paid by the person who was cut):**
     - Cutting 1 heo: Pay penalty equal to that heo's value (1 or 2 points)
     - Cutting 2 heo (two separate single 2s in consecutive turns): Pay sum of both heo values
     - Cutting 3 heo (three separate single 2s in consecutive turns): Pay sum of all three heo values
     - Cutting 4 heo (four separate single 2s in consecutive turns): Pay sum of all four heo values
     - Cutting đôi heo (pair of 2s played together as a pair): Pay 2 × (heo value) = 4-8 points total (depending on suits)
     - Cutting 3 đôi thông: Pay 4 points
     - Cutting tứ quý: Pay 4 points
     - Cutting 4 đôi thông: Pay 4 points
   - **Chặt Chồng (Stacked Cutting):** 
     - When a chain of cuts occurs, the last person cut in the chain pays for all penalties in that chain
     - Example: If Player A cuts Player B (B would pay penalty X), and then Player C cuts Player A:
     - Player A pays penalty for being cut by Player C (penalty Y)
     - Player A also pays the penalty that Player B would have paid (penalty X)
     - Player B does NOT pay any penalty (transferred to Player A)
     - Total: Player A pays (X + Y) to Player C (the person who performed the cutting)
   - **Penalty Flow:**
     - When a player is cut during a round, the penalty is paid directly to the person who performed the cutting
     - All chặt penalties are tracked and accumulated throughout the entire game (across all rounds)
     - At game end: Each player who was cut loses points equal to the total penalties they paid across all rounds
     - At game end: Each player who performed cutting receives points equal to the total penalties they collected across all rounds
     - These penalty points are part of each player's total score for the game
     - The game winner is determined by total score (card points + cóng penalties + chặt penalties received + thúi penalties received)

4. **Thúi Penalties:**
   - If the last-place player has heo or hàng remaining, they pay additional penalties
   - Each heo: Pay penalty equal to that heo's value (1 or 2 points)
   - Each hàng: Pay 4 points
   - These penalties are received by the 3rd-place player (or winner in tới trắng cases)

**Loser Point Calculation:**
- Each player who did not win loses points equal to:
  - (Number of cards remaining in their hand) + (Cóng penalty if applicable) + (Chặt penalties paid) + (Thúi penalties if last place)

**Tới Trắng Scoring:**
- Winner receives: tới trắng penalty from all other players
- **Tới trắng penalty value per loser:** 13 points × number of players in the game
  - 4-player game: Each loser pays 52 points to winner
  - 3-player game: Each loser pays 39 points to winner
  - 2-player game: Each loser pays 26 points to winner
- **Total winner receives:** (13 × number of players) × (number of losers)
- Additionally, if any loser has heo or hàng in hand, thúi penalties apply (received by winner)

**Important Rule:** Penalty for "thúi" (ending last with special cards) equals penalty for "chặt" (cutting) those same cards. This ensures consistency in penalty values.

### Session Scoring (Table Session Summary)

**Table Session Structure:**
- Each table session contains exactly 16 games (configurable: 16 or 32 games)
- Players compete across all games in the session
- Points accumulate across all games

**Session Point Tracking:**
- Each player's points are tracked per game and accumulated throughout the session
- **Winner's points per game:** Card Points + Cóng Penalties + Chặt Penalties + Thúi Penalties (received)
- **Loser's points per game:** Negative points = (Cards remaining) + (Cóng penalty if applicable) + (Chặt penalties paid) + (Thúi penalties if last place)

**Session Summary (After All Games Complete):**
- When all 16 or 32 games in the table session are finished, the system displays:
  - **Total Points per Player:** Sum of all points earned/lost across all games in the session
  - **Final Ranking:** Players ranked by total points (highest to lowest)
  - **Session Winner:** Player with the highest total points at the end of the session
  - **Detailed Breakdown:** Optional view showing points per game for each player

**Point Calculation Example:**
- Player A: Game 1: +25, Game 2: -8, Game 3: +52 (tới trắng), Game 4: +15, ... = **Total Session Points: +84**
- Player B: Game 1: -8, Game 2: +30, Game 3: -52, Game 4: -5, ... = **Total Session Points: -35**
- System displays final totals and ranking in a summary table

**Important:** 
- Points are never reset during a session
- All games contribute to the final session total
- The summary table shows the final accumulated points after the entire table session ends

### Side Rules & Edge Cases

1. **Hand Disclosure:**
   - Players can toggle to keep their hand count secret during gameplay
   - Hand counts are revealed at game end when the first player plays all cards in their hand
   - All cards are revealed when the game ends for scoring purposes

2. **End Game Combinations:**
   - Players are allowed to play 3 or 4 consecutive pairs (đôi thông) at the end of their hand
   - This is allowed even if those pairs could have been played earlier or combined with other cards

3. **Invalid Move Handling:**
   - If a player attempts an invalid move (wrong combination type, lower value, invalid cutting), the move is rejected
   - Player must either play a valid move or pass
   - System validates all moves server-side before accepting them

4. **Timeout Handling:**
   - If a player exceeds the turn timeout (e.g., 30 seconds), they automatically pass
   - If a player disconnects, their turn is skipped after timeout, and they are treated as passing

5. **Tie-Breaking (for same-rank combinations):**
   - When comparing pairs/triples of the same rank, compare by the highest suit in the combination
   - When comparing straights of same length and same highest card, compare by the highest card's suit

6. **Multiple Valid Combinations:**
   - Players may choose which valid combination to play if multiple options exist
   - System must validate that the chosen combination is legal, but does not restrict choice between equally valid options

7. **Empty Hand During Round:**
   - If a player plays their last card during a round, the game ends immediately
   - The player wins the game and the round
   - No further plays are made, even if other players could have beaten that final play

---

## 3. Platform Features

### 3.1 Game Modes

#### **Casual Play Mode**

- Traditional multiplayer where humans play manually
- Create private tables with shareable links
- Real-time gameplay (WebSocket)
- Support for 2-4 human players
- _No coding required_

#### **Bot Arena Mode**

- Upload JavaScript AI code for automatic play
- Bots compete by the same rules as humans
- 2–4 bots can compete in a match
- Spectate bot matches in real-time

#### **Hybrid Mode**

- Mix human players and bots in the same game (e.g., 2 humans + 2 bots)
- Humans can observe bot decision-making in real-time
- Test your strategy against AI

#### **Practice Mode**

- Solo player testing environment
- Play against 3 rule-based AI opponents
- Test bot code before deploying
- _No ranking/scoring impact_
- Unlimited practice sessions

### 3.2 Table Management System

**Creating Tables:**

1. Host creates a new game table
2. Configure settings:
   - Number of players (2-4)
   - Player types (human/bot/empty slot)
   - Game visibility (public/private)
   - Bot assignment (if hybrid mode)
3. Generate shareable link and invite players

**Joining Tables:**

- Click link, join as a human player
- See current lobby status (who’s joined, empty slots)
- Ready-up before the game starts
- Replace empty slots with bots if desired
- Chat in lobby before game begins

**Table States:**

- **Waiting:** Lobby open, accepting players
- **Ready:** All slots filled, countdown to start
- **In Progress:** Game running
- **Completed:** Results shown

### 3.3 Bot Development System

#### **Code Editor Interface**

- Browser-based editor with syntax highlighting (Monaco/VS Code)
- JavaScript syntax validation
- Auto-completion for game API
- Multiple bot slots per user (save strategies)
- Naming system for bots (e.g., "AggressiveBot v2")

#### **Bot API Specification**

Players must implement:

```javascript
/**
 * Called every time it's the bot's turn
 * @param {Object} gameState - Complete game state
 * @returns {Object} - Bot's move decision
 */
function getNextMove(gameState) {
  // Bot logic here
  return {
    action: "play", // or "pass"
    cards: [/* selected cards */]
  };
}
```

##### **gameState Object Structure**

```javascript
{
  // Bot's Position
  myPosition: 0, // 0-3, bot's seat at table

  // Bot's Hand
  myCards: [
    { rank: "A", suit: "♠", value: 12 },
    { rank: "2", suit: "♥", value: 13 },
    // ...
  ],

  // Opponent Information
  playerCardCounts: [5, 8, 3, 10], // cards remaining per player

  // Round State
  playedCards: [
    { rank: "7", suit: "♦", value: 5 }
  ], // cards played in current turn

  lastPlay: {
    player: 2,
    cards: [/* card objects */],
    type: "single", // "pair", "triple", etc.
    minRankToBeat: 7
  },

  currentTurn: 0, // whose turn it is
  passedPlayers: [false, true, false, false],

  // Metadata
  metadata: {
    round: 3,
    dealer: 0,
    isFirstTurn: false,
    gameStarted: true
  },

  // Helper Info
  validMoves: [
    { type: "single", cards: [...] },
    { type: "pair", cards: [...] },
    // ...
  ]
}
```

##### **Return Object Format**

```javascript
// To play cards:
{
  action: "play",
  cards: [
    { rank: "A", suit: "♠", value: 12 },
    { rank: "A", suit: "♥", value: 12 }
  ]
}

// To pass:
{
  action: "pass"
}
```

---

### **Bot Execution Environment**

#### **Execution Method**
- **Phase 1:** Client-side (Web Workers)
- **Future:** Server-side sandbox (Docker/VM)

#### **Safety & Constraints**
- **Timeout:** 5 seconds per move (auto-pass if exceeded, 3 strikes = DQ)
- **Error Handling:** Invalid return/exception = auto-pass
- **Resource Limits (future):** 50MB RAM per bot, no network, FS, or browser APIs

#### **Allowed JS Features**
- All ES6+ syntax
- Array/Object methods
- Math, JSON, and console logging

#### **Restricted Features (future)**
- No `eval`, `Function` constructor
- No `require`, `import` (unless approved)
- No async/await
- No DOM
- No global pollution

### **Bot Management**

- Save unlimited bots per user (name/code/desc/timestamps)
- Quick-select when creating a table

#### **Testing Tools**

- "Test Bot" runs validation
- Simulates sample states, shows return values
- Practice mode for live testing
- Error console for execution logs

#### **Versioning (future)**

- Save multiple versions, rollback, compare performance

---

## 4. User Interface & Experience

### 4.1 Main Application Layout

**Navigation Bar**
- Logo/Home
- "Create Table"
- "My Bots"
- "How to Play"
- User profile/login

**Home/Dashboard**
- Quick actions: Create Table, Join by Link, Practice
- Active tables list
- Recent matches history
- (Future) Leaderboards

---

### 4.2 Table Lobby Screen

**Left Panel - Player List**

- 4 player slots:
  - Empty slot (gray, "Waiting…")
  - Human (avatar/name)
  - Bot (icon, bot name)
  - Ready status (checkmark)
- Host controls: Add bot, kick, start

**Center Panel - Game Settings**

- Table name/ID
- Shareable link (copy)
- Game mode indicator
- Rule display

**Right Panel - Chat**

- Lobby text chat
- System messages
- Emoji support (optional)

**Bottom:**  
"Ready" & "Leave Table" buttons

---

### 4.3 Game Board Screen

#### **Layout**  *(4-player view)*

```
        [Player 2]
     Cards: 8 | Status
     
[Player 1]              [Player 3]
Cards: 10                Cards: 5

        [You/Bot]
     [Your Hand: Cards displayed]
     
   [Center Play Area]
   Last played: 7♦ (single)
```

#### **Components**

- **Center Play Area:**  
  Shows cards played, combination label, turn indicator, "Round won" message

- **Your Hand:**  
  Cards displayed horizontally, click-to-select, auto-sort, selected counter

- **Action Buttons:**  
  "Play" (when valid), "Pass", "Auto-sort", "Suggestion"

- **Opponent Info:**  
  Name/bot, cards left, last action, turn timer (5s)

- **Right Sidebar:**  
  Game log, chat, score board

- **Top Bar:**  
  Round, dealer, "Leave Game", settings

---

### 4.4 Bot Editor Screen

**Layout:**

- **Left (30%) - Bot Management:**
  - "My Bots" list
  - "Create New Bot"
  - Selected bot details (name, last modified, description)
  - Save/Delete, "Test Bot" button

- **Center (50%) - Code Editor:**
  - Monaco Editor (JavaScript, line numbers, autocomplete, template code)

```javascript
function getNextMove(gameState) {
  // Example: Always play first valid move or pass
  if (gameState.validMoves.length > 0) {
    return {
      action: "play",
      cards: gameState.validMoves[0].cards
    };
  }
  return { action: "pass" };
}
```

- **Right (20%) - Docs & Tools:**
  - API Reference (gameState, return examples, valid combos)
  - Console output (during testing: errors, logs)
  - Example bots (random, greedy, defensive)

---

### 4.5 Post-Game Screen

- **Result Display:**
  - Winner announcement
  - Scoring breakdown (cards left, points, total points)
  - Stats (rounds, cards played, longest combo)

- **Actions:**
  - "Play Again"
  - "View Replay" (future)
  - "Back to Lobby"
  - Share result (copyable text)

---

## 5. Real-Time Multiplayer System

### 5.1 WebSocket Architecture

**Technology:**  
Socket.io for bidirectional communication

**Connection Flow:**
1. Client connects on page load
2. Server assigns socket ID
3. Client joins "table room" by ID
4. All clients receive updates

**Events:**

- **Client → Server:**  
  `create_table`, `join_table`, `player_ready`, `start_game`, `play_cards`, `pass_turn`, `send_message`, `leave_table`
- **Server → Client:**  
  `table_created`, `player_joined`, `player_left`, `game_started`, `game_state_update`, `turn_timeout`, `game_ended`, `message_received`, `error`

### 5.2 State Synchronization

- Server is source of truth (validation, hidden info)
- Optimistic UI update, rollback if invalid
- Disconnection:  
  - Hold turn 30s, auto-pass if not reconnected
  - (Future) Bot takeover
- Server restart:  
  - State loss (MVP), future: persist to DB
- Anti-cheat:  
  - All moves validated server-side
  - No transmission of opponent hands
  - Rate limiting

---

## 6. Technical Architecture

### 6.1 System Components

```
┌─────────────────────────────────────────────────┐
│                  FRONTEND                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Game UI  │  │ Bot      │  │ Lobby    │       │
│  │          │  │ Editor   │  │ Manager  │       │
│  └──────────┘  └──────────┘  └──────────┘       │
│         │          │             │              │
│         └──────────┴─────────────┘              │
│                    │                            │
│              WebSocket Client                   │
└────────────────────┬────────────────────────────┘
                     │
                     │ Socket.io
                     │
┌────────────────────┴────────────────────────────┐
│                  BACKEND                        │
│  ┌──────────────────────────────────────────┐   │
│  │       WebSocket Server (Socket.io)       │   │
│  └──────────────────────────────────────────┘   │
│         │                  │                    │
│  ┌──────┴──────┐    ┌──────┴────────┐           │
│  │ Game Logic  │    │ Bot Executor  │           │
│  │ Validator   │    │ (Web Workers) │           │
│  └─────────────┘    └───────────────┘           │
│         │                                       │
│  ┌──────┴──────────────────┐                    │
│  │    REST API Endpoints   │                    │
│  │  - Auth                 │                    │
│  │  - Bot CRUD             │                    │
│  │  - Table Management     │                    │
│  └─────────────────────────┘                    │
└────────────────────┬────────────────────────────┘
                     │
                     │
┌────────────────────┴────────────────────────────┐
│              DATABASE (MongoDB)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Users   │  │   Bots   │  │  Games   │       │
│  │          │  │          │  │ (History)│       │
│  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────┘
```

### 6.2 Technology Stack

#### Frontend

- **Framework:** React 18+ (with Hooks)
- **State Management:** React Context API or Zustand
- **UI:** Custom SVG card components, Tailwind CSS, Framer Motion
- **Code Editor:** Monaco Editor
- **WebSocket:** socket.io-client
- **Router:** React Router v6
- **Build:** Vite

**Key Libraries:**

```json
{
  "react": "^18.2.0",
  "socket.io-client": "^4.6.0",
  "@monaco-editor/react": "^4.5.0",
  "tailwindcss": "^3.3.0",
  "framer-motion": "^10.0.0",
  "zustand": "^4.3.0"
}
```

#### Backend

- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **WebSocket:** Socket.io v4
- **ORM:** Prisma or Drizzle ORM
- **Auth:** JWT (optional: OAuth)
- **Bot Execution:** 
   - MVP: Web Workers
   - Future: isolated-vm/Docker
- **Validation:** Joi or Zod

**Key Libraries:**

```json
{
  "express": "^4.18.0",
  "socket.io": "^4.6.0",
  "jsonwebtoken": "^9.0.0",
  "bcrypt": "^5.1.0",
  "prisma": "^5.0.0",
  "zod": "^3.21.0"
}
```

#### Database

- **Primary:** PostgreSQL 15+
- **Schema:**

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bots table
CREATE TABLE bots (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  code TEXT NOT NULL, -- JS code
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Games table (history)
CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  table_id VARCHAR(50) UNIQUE NOT NULL,
  players JSONB NOT NULL, -- Array of player info
  winner_id INTEGER,
  scores JSONB, -- Final scores per player
  total_rounds INTEGER,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  game_log JSONB -- Play-by-play
);

-- (Future): Leaderboards, tournaments, etc.
```

#### Infrastructure

- **Hosting:**  
  - Frontend: Vercel/Netlify
  - Backend: Railway/Render/DigitalOcean

- **Database:**  
  - Managed PostgreSQL (Supabase, Neon, Railway)

- **CDN:** Cloudflare

- **Monitoring/Analytics:**  
  - Backend: Sentry  
  - Analytics: Plausible/PostHog

---

### 6.3 Core Game Logic Module

JavaScript, shared between client & server:

```javascript
// gameEngine.js
class TienLenGame {
  constructor(players) {
    this.players = players;
    this.deck = this.initializeDeck();
    this.currentTurn = 0;
    this.roundPlayedCards = [];
    this.passedPlayers = [];
    this.gameLog = [];
  }

  initializeDeck() {
    // Generate 52-card deck
  }

  dealCards() {
    // Distribute cards to players
  }

  isValidMove(cards, lastPlay) {
    // Validate combination/beat previous play
  }

  getCombinationType(cards) {
    // Return type: "single", "pair", "straight", etc.
  }

  playCards(playerIndex, cards) {
    // Update state
  }

  passTurn(playerIndex) {
    // Mark as passed
  }

  checkRoundEnd() {
    // Start new round if all passed
  }

  checkGameEnd() {
    // Check for win
  }

  calculateScores() {
    // Count/value cards
  }

  getGameState(playerIndex) {
    // Hide opponent hands
  }
}
module.exports = TienLenGame;
```

**Card Representation:**

```javascript
const card = {
  rank: "A",        // "3"-"10", "J", "Q", "K", "A", "2"
  suit: "♠",        // "♠", "♥", "♦", "♣"
  value: 12,        // 1-13 for comparison
  points: 1,        // 1, 2, or 4 for scoring
  id: "A♠"          // Unique
};
```

**Combination Detection:**

```javascript
function detectCombination(cards) {
  if (cards.length === 1) return { type: "single", rank: cards[0].value };

  if (cards.length === 2 && cards[0].rank === cards[1].rank) {
    return { type: "pair", rank: cards[0].value };
  }

  if (cards.length === 3 && allSameRank(cards)) {
    return { type: "triple", rank: cards[0].value };
  }

  if (isStraight(cards)) {
    return { type: "straight", rank: cards[cards.length - 1].value };
  }

  // ... More checks

  return null; // Invalid
}
```

---

## 7. User Flows

---

### 7.1 Human vs Human Game Flow

**Player A (Host):**

1. Clicks "Create Table" on home page
2. Selects "Casual Play" mode, 4 players
3. (Optional) Names table
4. Clicks "Create" → Redirected to lobby
5. Receives shareable link (e.g. `https://tienlen.game/table/abc123`)
6. Copies and shares link

**Player B, C, D:**

- Click link, join lobby, see all players
- Chat in waiting room
- Click "Ready" when set

**Game Start:**

- When all ready, host clicks "Start"
- 3-second countdown
- Cards dealt, game board appears
- Player with 3♠ highlighted

**Gameplay:**

1. Turn indicator shows player
2. Select cards, click "Play" (animations fire)
3. Next player's turn
4. Players can "Pass" or play
5. Round continues until 3 players pass consecutively

**Game End:**

- First player out = Winner!
- Scores:  
  - e.g. B (8 cards), C (6 incl. black 2), D (11 incl. red 2)  
  - Player A wins 25 points
- Results screen with breakdown
- "Play Again?" button

---

### 7.2 Bot Development & Testing Flow

**Create Bot:**

1. Go to "My Bots"
2. Click "Create New Bot"
3. Name: "GreedyBot v1"
4. Monaco Editor opens. Example strategy:

```javascript
function getNextMove(gameState) {
  // Always play lowest valid single card
  const singles = gameState.validMoves.filter(m => m.type === "single");
  if (singles.length > 0) {
    singles.sort((a, b) => a.cards[0].value - b.cards[0].value);
    return { action: "play", cards: singles[0].cards };
  }
  return { action: "pass" };
}
```

5. Click "Save Bot"

**Test Bot:**

- Click "Test Bot"
- Run against 10 sample states
- Console logs:
  - ✓ Test 1: Played 3♠
  - ✓ Test 2: Passed (no moves)
  - ✗ Test 3: Error (`cards[0]` undefined)
- Iterate/fix as needed

**Practice Mode:**

1. Click "Practice Mode"
2. Select "GreedyBot v1"
3. Fill remaining with simple AIs
4. Click "Start", observe bot plays/behavior
5. Game ends, bot's performance visible

**Deploy to Hybrid Game:**

- Create table (1 human + 3 bots)
- Assign "GreedyBot v1"
- Play and observe, take notes for improvements

**Iterate:**

- Edit bot with new logic (e.g., save high cards)
- Test, repeat

---

### 7.3 Hybrid Mode Flow

**Setup:**

1. Create table (Hybrid: 2 humans + 2 bots)
2. Share link, assign "DefensiveBot"
3. Add random bot

**Game:**

- Humans play normally, bots act automatically (with delay)
- Humans can analyze bot strategies

**Observation:**

- Humans learn from bots, adjust gameplay
- Bots may make mistakes; humans can capitalize

---