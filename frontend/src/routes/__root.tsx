import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import { useSocket } from '../hooks/useSocket';
import { MainLayout } from '../components/layout/MainLayout';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  // Initialize WebSocket connection
  useSocket();
  const location = useLocation();

  // Only exclude the landing page (/) from having the layout
  // All other routes (login, register, tables, bots, profile, etc.) will have the layout
  const isLandingPage = location.pathname === '/';
  const isGameRoute = location.pathname.includes('/game');
  const shouldShowMenu = !isLandingPage && !isGameRoute;

  if (shouldShowMenu) {
    return <MainLayout />;
  }

  return <Outlet />;
}
