import {
  isValidMove,
  MoveValidationContext,
  MOVE_VALIDATION_ERROR_CODES,
  MOVE_VALIDATION_ERROR_MESSAGES,
} from './moveValidation';
import { createCard, createCardsOfRank } from './testHelpers';
import { detectCombination, CardCombination } from './combinations';
import {
  RANK_3,
  RANK_4,
  SUIT_SPADES,
  SUIT_HEARTS,
  RANK_5,
  SUIT_DIAMONDS,
  RANK_6,
  SUIT_CLUBS,
} from '../../types/game';

describe('Move Validation', () => {
  describe('isValidMove', () => {
    describe('Cards in hand validation', () => {
      it('should reject move when no cards are selected', () => {
        const playerHand = [createCard('3', 'Spades'), createCard('4', 'Hearts')];
        const context: MoveValidationContext = {
          cardsToPlay: [],
          playerHand,
          lastPlay: null,
          isFirstPlayerInRound: true,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(false);
        expect(result.errorCode).toBe(MOVE_VALIDATION_ERROR_CODES.NO_CARDS_SELECTED);
        expect(result.error).toBe(MOVE_VALIDATION_ERROR_MESSAGES.NO_CARDS_SELECTED);
      });

      it('should reject move when card is not in player hand', () => {
        const playerHand = [createCard(RANK_3, SUIT_SPADES), createCard(RANK_4, SUIT_HEARTS)];
        const cardsToPlay = [createCard(RANK_5, SUIT_DIAMONDS)]; // Not in hand

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay: null,
          isFirstPlayerInRound: true,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(false);
        expect(result.errorCode).toBe(MOVE_VALIDATION_ERROR_CODES.CARDS_NOT_IN_HAND);
        expect(result.error).toBe(MOVE_VALIDATION_ERROR_MESSAGES.CARDS_NOT_IN_HAND);
        expect(result.metadata?.missingCards).toBeDefined();
      });

      it('should reject move when trying to play duplicate cards not in hand', () => {
        const card1 = createCard(RANK_3, SUIT_SPADES);
        const playerHand = [card1]; // Only one copy
        const cardsToPlay = [card1, createCard(RANK_3, SUIT_SPADES)]; // Trying to play two copies

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay: null,
          isFirstPlayerInRound: true,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(false);
        expect(result.errorCode).toBe(MOVE_VALIDATION_ERROR_CODES.CARDS_NOT_IN_HAND);
      });

      it('should accept move when all cards are in hand', () => {
        const card1 = createCard(RANK_3, SUIT_SPADES);
        const card2 = createCard(RANK_4, SUIT_HEARTS);
        const playerHand = [card1, card2];
        const cardsToPlay = [card1];

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay: null,
          isFirstPlayerInRound: true,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(true);
      });
    });

    describe('Invalid combination validation', () => {
      it('should reject move when cards do not form a valid combination', () => {
        const card1 = createCard(RANK_3, SUIT_SPADES);
        const card2 = createCard(RANK_5, SUIT_HEARTS); // Not a valid combination
        const playerHand = [card1, card2];
        const cardsToPlay = [card1, card2];

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay: null,
          isFirstPlayerInRound: true,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(false);
        expect(result.errorCode).toBe(MOVE_VALIDATION_ERROR_CODES.INVALID_COMBINATION);
        expect(result.error).toBe(MOVE_VALIDATION_ERROR_MESSAGES.INVALID_COMBINATION);
      });
    });

    describe('First player in round validation', () => {
      it('should accept any valid combination from first player in non-initial round', () => {
        const card1 = createCard(RANK_5, SUIT_SPADES);
        const playerHand = [card1];
        const cardsToPlay = [card1];

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay: null,
          isFirstPlayerInRound: true,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(true);
      });

      it('should accept valid pair from first player in non-initial round', () => {
        const cards = createCardsOfRank(RANK_5, [SUIT_SPADES, SUIT_HEARTS]);
        const playerHand = [...cards, createCard(RANK_6, SUIT_DIAMONDS)];
        const cardsToPlay = cards;

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay: null,
          isFirstPlayerInRound: true,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(true);
      });

      it('should accept valid straight from first player in non-initial round', () => {
        const cards = [
          createCard(RANK_3, SUIT_SPADES),
          createCard(RANK_4, SUIT_HEARTS),
          createCard(RANK_5, SUIT_DIAMONDS),
        ];
        const playerHand = [...cards];
        const cardsToPlay = cards;

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay: null,
          isFirstPlayerInRound: true,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(true);
      });
    });

    describe('Initial round ♠3 rule validation', () => {
      it('should reject move from first player in initial round without ♠3', () => {
        const card1 = createCard(RANK_5, SUIT_SPADES);
        const playerHand = [card1];
        const cardsToPlay = [card1];

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay: null,
          isFirstPlayerInRound: true,
          isInitialRound: true,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(false);
        expect(result.errorCode).toBe(MOVE_VALIDATION_ERROR_CODES.MISSING_SPADE_3);
        expect(result.error).toBe(MOVE_VALIDATION_ERROR_MESSAGES.MISSING_SPADE_3);
      });

      it('should accept move from first player in initial round with ♠3 as single', () => {
        const spade3 = createCard(RANK_3, SUIT_SPADES);
        const playerHand = [spade3];
        const cardsToPlay = [spade3];

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay: null,
          isFirstPlayerInRound: true,
          isInitialRound: true,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(true);
      });

      it('should accept move from first player in initial round with pair including ♠3', () => {
        const cards = createCardsOfRank(RANK_3, [SUIT_SPADES, SUIT_HEARTS]);
        const playerHand = [...cards];
        const cardsToPlay = cards;

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay: null,
          isFirstPlayerInRound: true,
          isInitialRound: true,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(true);
      });

      it('should accept move from first player in initial round with triple including ♠3', () => {
        const cards = createCardsOfRank(RANK_3, [SUIT_SPADES, SUIT_HEARTS, SUIT_DIAMONDS]);
        const playerHand = [...cards];
        const cardsToPlay = cards;

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay: null,
          isFirstPlayerInRound: true,
          isInitialRound: true,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(true);
      });

      it('should accept move from first player in initial round with straight including ♠3', () => {
        const cards = [
          createCard(RANK_3, SUIT_SPADES),
          createCard(RANK_4, SUIT_HEARTS),
          createCard(RANK_5, SUIT_DIAMONDS),
        ];
        const playerHand = [...cards];
        const cardsToPlay = cards;

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay: null,
          isFirstPlayerInRound: true,
          isInitialRound: true,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(true);
      });

      it('should reject move from first player in initial round with straight not including ♠3', () => {
        const cards = [
          createCard(RANK_4, SUIT_SPADES),
          createCard(RANK_5, SUIT_HEARTS),
          createCard(RANK_6, SUIT_DIAMONDS),
        ];
        const playerHand = [...cards, createCard(RANK_3, SUIT_SPADES)];
        const cardsToPlay = cards;

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay: null,
          isFirstPlayerInRound: true,
          isInitialRound: true,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(false);
        expect(result.errorCode).toBe(MOVE_VALIDATION_ERROR_CODES.MISSING_SPADE_3);
      });
    });

    describe('Combination type matching validation', () => {
      it('should reject move when combination type does not match last play', () => {
        const lastPlayCard = createCard(RANK_5, SUIT_SPADES);
        const lastPlay: CardCombination = detectCombination([lastPlayCard])!;

        const playerCards = createCardsOfRank(RANK_6, [SUIT_SPADES, SUIT_HEARTS]);
        const playerHand = [...playerCards];
        const cardsToPlay = playerCards;

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay,
          isFirstPlayerInRound: false,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(false);
        expect(result.errorCode).toBe(MOVE_VALIDATION_ERROR_CODES.COMBINATION_TYPE_MISMATCH);
        expect(result.error).toContain('Combination type mismatch');
        expect(result.metadata?.expectedType).toBe('single');
        expect(result.metadata?.actualType).toBe('pair');
      });

      it('should reject pair when last play was single', () => {
        const lastPlayCard = createCard(RANK_5, SUIT_SPADES);
        const lastPlay: CardCombination = detectCombination([lastPlayCard])!;

        const playerCards = createCardsOfRank(RANK_6, [SUIT_SPADES, SUIT_HEARTS]);
        const playerHand = [...playerCards];
        const cardsToPlay = playerCards;

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay,
          isFirstPlayerInRound: false,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(false);
        expect(result.errorCode).toBe(MOVE_VALIDATION_ERROR_CODES.COMBINATION_TYPE_MISMATCH);
      });

      it('should reject single when last play was pair', () => {
        const lastPlayCards = createCardsOfRank(RANK_5, [SUIT_SPADES, SUIT_HEARTS]);
        const lastPlay: CardCombination = detectCombination(lastPlayCards)!;

        const playerCard = createCard(RANK_6, SUIT_SPADES);
        const playerHand = [playerCard];
        const cardsToPlay = [playerCard];

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay,
          isFirstPlayerInRound: false,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(false);
        expect(result.errorCode).toBe(MOVE_VALIDATION_ERROR_CODES.COMBINATION_TYPE_MISMATCH);
      });
    });

    describe('Combination beats last play validation', () => {
      it('should reject move when combination does not beat last play (same value)', () => {
        const lastPlayCard = createCard(RANK_5, SUIT_HEARTS);
        const lastPlay: CardCombination = detectCombination([lastPlayCard])!;

        const playerCard = createCard(RANK_5, SUIT_DIAMONDS); // Same rank, lower suit
        const playerHand = [playerCard];
        const cardsToPlay = [playerCard];

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay,
          isFirstPlayerInRound: false,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(false);
        expect(result.errorCode).toBe(MOVE_VALIDATION_ERROR_CODES.COMBINATION_TOO_LOW);
        expect(result.error).toBe(MOVE_VALIDATION_ERROR_MESSAGES.COMBINATION_TOO_LOW);
      });

      it('should reject move when combination is lower than last play', () => {
        const lastPlayCard = createCard(RANK_6, SUIT_SPADES);
        const lastPlay: CardCombination = detectCombination([lastPlayCard])!;

        const playerCard = createCard(RANK_5, SUIT_HEARTS); // Lower rank
        const playerHand = [playerCard];
        const cardsToPlay = [playerCard];

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay,
          isFirstPlayerInRound: false,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(false);
        expect(result.errorCode).toBe(MOVE_VALIDATION_ERROR_CODES.COMBINATION_TOO_LOW);
      });

      it('should accept move when single beats last play (higher rank)', () => {
        const lastPlayCard = createCard(RANK_5, SUIT_SPADES);
        const lastPlay: CardCombination = detectCombination([lastPlayCard])!;

        const playerCard = createCard(RANK_6, SUIT_SPADES); // Higher rank
        const playerHand = [playerCard];
        const cardsToPlay = [playerCard];

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay,
          isFirstPlayerInRound: false,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(true);
      });

      it('should accept move when single beats last play (same rank, higher suit)', () => {
        const lastPlayCard = createCard(RANK_5, SUIT_SPADES);
        const lastPlay: CardCombination = detectCombination([lastPlayCard])!;

        const playerCard = createCard(RANK_5, SUIT_HEARTS); // Same rank, higher suit
        const playerHand = [playerCard];
        const cardsToPlay = [playerCard];

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay,
          isFirstPlayerInRound: false,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(true);
      });

      it('should accept move when pair beats last play', () => {
        const lastPlayCards = createCardsOfRank(RANK_5, [SUIT_SPADES, SUIT_CLUBS]);
        const lastPlay: CardCombination = detectCombination(lastPlayCards)!;

        const playerCards = createCardsOfRank(RANK_6, [SUIT_SPADES, SUIT_HEARTS]);
        const playerHand = [...playerCards];
        const cardsToPlay = playerCards;

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay,
          isFirstPlayerInRound: false,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(true);
      });

      it('should accept move when pair beats last play (same rank, higher suit)', () => {
        const lastPlayCards = createCardsOfRank(RANK_5, [SUIT_SPADES, SUIT_CLUBS]);
        const lastPlay: CardCombination = detectCombination(lastPlayCards)!;

        const playerCards = createCardsOfRank(RANK_5, [SUIT_HEARTS, SUIT_DIAMONDS]); // Same rank, higher suits
        const playerHand = [...playerCards];
        const cardsToPlay = playerCards;

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay,
          isFirstPlayerInRound: false,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(true);
      });

      it('should accept move when triple beats last play', () => {
        const lastPlayCards = createCardsOfRank(RANK_5, [SUIT_SPADES, SUIT_CLUBS, SUIT_DIAMONDS]);
        const lastPlay: CardCombination = detectCombination(lastPlayCards)!;

        const playerCards = createCardsOfRank(RANK_6, [SUIT_SPADES, SUIT_HEARTS, SUIT_DIAMONDS]);
        const playerHand = [...playerCards];
        const cardsToPlay = playerCards;

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay,
          isFirstPlayerInRound: false,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(true);
      });

      it('should accept move when straight beats last play (higher highest card)', () => {
        const lastPlayCards = [
          createCard(RANK_3, SUIT_SPADES),
          createCard(RANK_4, SUIT_HEARTS),
          createCard(RANK_5, SUIT_DIAMONDS),
        ];
        const lastPlay: CardCombination = detectCombination(lastPlayCards)!;

        const playerCards = [
          createCard(RANK_4, SUIT_SPADES),
          createCard(RANK_5, SUIT_HEARTS),
          createCard(RANK_6, SUIT_DIAMONDS),
        ];
        const playerHand = [...playerCards];
        const cardsToPlay = playerCards;

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay,
          isFirstPlayerInRound: false,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(true);
      });

      it('should accept move when longer straight beats shorter straight', () => {
        const lastPlayCards = [
          createCard(RANK_3, SUIT_SPADES),
          createCard(RANK_4, SUIT_HEARTS),
          createCard(RANK_5, SUIT_DIAMONDS),
        ];
        const lastPlay: CardCombination = detectCombination(lastPlayCards)!;

        const playerCards = [
          createCard(RANK_3, SUIT_CLUBS),
          createCard(RANK_4, SUIT_CLUBS),
          createCard(RANK_5, SUIT_CLUBS),
          createCard(RANK_6, SUIT_CLUBS),
        ];
        const playerHand = [...playerCards];
        const cardsToPlay = playerCards;

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay,
          isFirstPlayerInRound: false,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(true);
      });

      it('should reject move when shorter straight does not beat longer straight', () => {
        const lastPlayCards = [
          createCard(RANK_3, SUIT_SPADES),
          createCard(RANK_4, SUIT_HEARTS),
          createCard(RANK_5, SUIT_DIAMONDS),
          createCard(RANK_6, SUIT_CLUBS),
        ];
        const lastPlay: CardCombination = detectCombination(lastPlayCards)!;

        const playerCards = [
          createCard(RANK_3, SUIT_CLUBS),
          createCard(RANK_4, SUIT_CLUBS),
          createCard(RANK_5, SUIT_CLUBS),
        ];
        const playerHand = [...playerCards];
        const cardsToPlay = playerCards;

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay,
          isFirstPlayerInRound: false,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(false);
        expect(result.errorCode).toBe(MOVE_VALIDATION_ERROR_CODES.COMBINATION_TOO_LOW);
      });

      it('should accept move when consecutive pairs beat last play', () => {
        const lastPlayCards = [
          ...createCardsOfRank(RANK_3, [SUIT_SPADES, SUIT_HEARTS]),
          ...createCardsOfRank(RANK_4, [SUIT_SPADES, SUIT_HEARTS]),
          ...createCardsOfRank(RANK_5, [SUIT_SPADES, SUIT_HEARTS]),
        ];
        const lastPlay: CardCombination = detectCombination(lastPlayCards)!;

        const playerCards = [
          ...createCardsOfRank(RANK_4, [SUIT_DIAMONDS, SUIT_CLUBS]),
          ...createCardsOfRank(RANK_5, [SUIT_DIAMONDS, SUIT_CLUBS]),
          ...createCardsOfRank(RANK_6, [SUIT_DIAMONDS, SUIT_CLUBS]),
        ];
        const playerHand = [...playerCards];
        const cardsToPlay = playerCards;

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay,
          isFirstPlayerInRound: false,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(true);
      });
    });

    describe('Edge cases and error handling', () => {
      it('should reject move when not first player but lastPlay is null', () => {
        const card1 = createCard(RANK_5, SUIT_SPADES);
        const playerHand = [card1];
        const cardsToPlay = [card1];

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay: null,
          isFirstPlayerInRound: false,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(false);
        expect(result.errorCode).toBe(MOVE_VALIDATION_ERROR_CODES.INVALID_STATE);
        expect(result.error).toBe(MOVE_VALIDATION_ERROR_MESSAGES.INVALID_STATE);
      });

      it('should handle four of a kind validation', () => {
        const lastPlayCards = createCardsOfRank(RANK_5, [
          SUIT_SPADES,
          SUIT_HEARTS,
          SUIT_DIAMONDS,
          SUIT_CLUBS,
        ]);
        const lastPlay: CardCombination = detectCombination(lastPlayCards)!;

        const playerCards = createCardsOfRank(RANK_6, [
          SUIT_SPADES,
          SUIT_HEARTS,
          SUIT_DIAMONDS,
          SUIT_CLUBS,
        ]);
        const playerHand = [...playerCards];
        const cardsToPlay = playerCards;

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay,
          isFirstPlayerInRound: false,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(true);
      });

      it('should provide detailed metadata in error responses', () => {
        const lastPlayCard = createCard(RANK_5, SUIT_SPADES);
        const lastPlay: CardCombination = detectCombination([lastPlayCard])!;

        const playerCard = createCard(RANK_4, SUIT_HEARTS);
        const playerHand = [playerCard];
        const cardsToPlay = [playerCard];

        const context: MoveValidationContext = {
          cardsToPlay,
          playerHand,
          lastPlay,
          isFirstPlayerInRound: false,
          isInitialRound: false,
        };

        const result = isValidMove(context);

        expect(result.isValid).toBe(false);
        expect(result.metadata).toBeDefined();
        expect(result.metadata?.combinationType).toBe('single');
        expect(result.metadata?.lastPlayRank).toBeDefined();
        expect(result.metadata?.comparisonResult).toBeDefined();
      });
    });
  });
});
