import { createFileRoute } from '@tanstack/react-router';
import { TableLobbyPage } from '../pages/TableLobbyPage';

export const Route = createFileRoute('/tables/$tableId')({
  component: TableLobbyPage,
});

