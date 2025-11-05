import { createFileRoute } from '@tanstack/react-router';
import { TableLobbyPage } from '../pages/TableLobbyPage';

export const Route = createFileRoute('/table/$tableId')({
  component: TableLobbyPage,
});

