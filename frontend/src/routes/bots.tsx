import { createFileRoute } from '@tanstack/react-router';
import { BotEditorPage } from '../pages/BotEditorPage';

export const Route = createFileRoute('/bots')({
  component: BotEditorPage,
});
