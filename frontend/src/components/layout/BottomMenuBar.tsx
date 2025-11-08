import { useNavigate, useLocation } from '@tanstack/react-router';
import { useSelector, useDispatch } from 'react-redux';
import { User, Table2, Bot } from 'lucide-react';
import { RootState } from '../../store';
import { setBottomMenuActiveItem } from '../../store/slices/uiSlice';
import { useCurrentUser } from '../../hooks/queries/useUserQueries';
import { UserProfileMenu } from './UserProfileMenu';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useState } from 'react';

export function BottomMenuBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { data: currentUser } = useCurrentUser();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Get username for display
  const displayName = isAuthenticated ? (currentUser?.username || 'User') : 'Login';

  // Determine active item based on current route
  const getActiveItem = () => {
    const pathname = location.pathname;
    if (pathname.startsWith('/tables')) return 'tables';
    if (pathname.startsWith('/bots')) return 'bots';
    if (pathname.startsWith('/profile')) return 'user';
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) return 'user';
    return null;
  };

  const activeItem = getActiveItem();

  const handleUserClick = () => {
    if (isAuthenticated) {
      setShowUserMenu(true);
    } else {
      navigate({ to: '/login' });
    }
  };

  const handleTablesClick = () => {
    dispatch(setBottomMenuActiveItem('tables'));
    navigate({ to: '/tables' });
  };

  const handleBotsClick = () => {
    dispatch(setBottomMenuActiveItem('bots'));
    navigate({ to: '/bots' });
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:border-t-0 md:bg-transparent">
        <div className="flex items-center justify-around h-16 px-4 max-w-md mx-auto md:max-w-none md:px-8">
          {/* User Button (Left) */}
          <Button
            variant="ghost"
            size="icon-lg"
            onClick={handleUserClick}
            className={cn(
              'flex flex-col items-center justify-center gap-1 h-full w-20',
              activeItem === 'user' && 'text-primary'
            )}
            aria-label={isAuthenticated ? 'User menu' : 'Login'}
          >
            <User className={cn('size-5', activeItem === 'user' && 'text-primary')} />
            <span className="text-xs font-medium">{displayName}</span>
          </Button>

          {/* Tables Button (Center) */}
          <Button
            variant="ghost"
            size="icon-lg"
            onClick={handleTablesClick}
            className={cn(
              'flex flex-col items-center justify-center gap-1 h-full w-20',
              activeItem === 'tables' && 'text-primary'
            )}
            aria-label="Tables"
          >
            <Table2 className={cn('size-5', activeItem === 'tables' && 'text-primary')} />
            <span className="text-xs font-medium">Tables</span>
          </Button>

          {/* Bot Button (Right) */}
          <Button
            variant="ghost"
            size="icon-lg"
            onClick={handleBotsClick}
            disabled
            className={cn(
              'flex flex-col items-center justify-center gap-1 h-full w-20 relative',
              activeItem === 'bots' && 'text-primary',
              'opacity-60'
            )}
            aria-label="My Bot"
          >
            <Bot className={cn('size-5', activeItem === 'bots' && 'text-primary')} />
            <span className="text-xs font-medium">My Bot</span>
            <span className="absolute -top-1 -right-1 text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
              Soon
            </span>
          </Button>
        </div>
      </nav>

      {/* User Profile Menu */}
      {isAuthenticated && (
        <UserProfileMenu open={showUserMenu} onOpenChange={setShowUserMenu} />
      )}
    </>
  );
}

