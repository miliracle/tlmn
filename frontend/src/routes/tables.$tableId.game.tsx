import { createFileRoute } from '@tanstack/react-router';
import { GameBoardPage } from '../pages/GameBoardPage';

export const Route = createFileRoute('/tables/$tableId/game')({
  component: GameBoardPage,
});

