import { createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { HomePage } from './pages/HomePage';
import { TableLobbyPage } from './pages/TableLobbyPage';
import { GameBoardPage } from './pages/GameBoardPage';
import { BotEditorPage } from './pages/BotEditorPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
});

const tableLobbyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/table/$tableId',
  component: TableLobbyPage,
});

const gameBoardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/game/$gameId',
  component: GameBoardPage,
});

const botEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bots',
  component: BotEditorPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  tableLobbyRoute,
  gameBoardRoute,
  botEditorRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

