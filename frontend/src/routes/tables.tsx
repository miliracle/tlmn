import { createFileRoute } from '@tanstack/react-router';
import { TableListPage } from '../pages/TableListPage';

export const Route = createFileRoute('/tables')({
  component: TableListPage,
});

