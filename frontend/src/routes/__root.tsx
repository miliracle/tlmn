import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useSocket } from '../hooks/useSocket';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  // Initialize WebSocket connection
  useSocket();
  
  return <Outlet />;
}

