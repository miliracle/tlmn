import { Outlet } from '@tanstack/react-router';
import { BottomMenuBar } from './BottomMenuBar';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pb-16 md:pb-0 overflow-hidden">
        <Outlet />
      </main>
      <BottomMenuBar />
    </div>
  );
}

