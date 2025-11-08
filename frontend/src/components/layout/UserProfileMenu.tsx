import { useNavigate } from '@tanstack/react-router';
import { useDispatch } from 'react-redux';
import { User, History, Settings, LogOut } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { useCurrentUser } from '../../hooks/queries/useUserQueries';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface UserProfileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileMenu({ open, onOpenChange }: UserProfileMenuProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: currentUser, isLoading } = useCurrentUser();

  const handleLogout = () => {
    dispatch(logout());
    onOpenChange(false);
    navigate({ to: '/login' });
  };

  const handleViewProfile = () => {
    onOpenChange(false);
    navigate({ to: '/profile' });
  };

  const handleGameHistory = () => {
    onOpenChange(false);
    // TODO: Navigate to game history page when implemented
    console.log('Game history - coming soon');
  };

  const handleSettings = () => {
    onOpenChange(false);
    // TODO: Navigate to settings page when implemented
    console.log('Settings - coming soon');
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Menu Drawer */}
      <div className="fixed bottom-16 left-0 right-0 z-50 bg-background border-t border-border rounded-t-2xl shadow-lg md:bottom-auto md:top-16 md:right-4 md:left-auto md:w-64 md:rounded-lg md:border md:border-border">
        <div className="p-4">
          {/* User Info */}
          <div className="flex items-center gap-3 px-2 py-3 mb-2 border-b border-border">
            <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
              <User className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {isLoading ? 'Loading...' : currentUser?.username || 'User'}
              </p>
              {currentUser?.email && (
                <p className="text-xs text-muted-foreground truncate">
                  {currentUser.email}
                </p>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="justify-start gap-3 h-11"
              onClick={handleViewProfile}
            >
              <User className="size-4" />
              <span>View Profile</span>
            </Button>

            <Button
              variant="ghost"
              className="justify-start gap-3 h-11"
              onClick={handleGameHistory}
              disabled
            >
              <History className="size-4" />
              <span>Game History</span>
              <span className="ml-auto text-xs text-muted-foreground">Soon</span>
            </Button>

            <Button
              variant="ghost"
              className="justify-start gap-3 h-11"
              onClick={handleSettings}
              disabled
            >
              <Settings className="size-4" />
              <span>Settings</span>
              <span className="ml-auto text-xs text-muted-foreground">Soon</span>
            </Button>

            <div className="my-2 border-t border-border" />

            <Button
              variant="ghost"
              className="justify-start gap-3 h-11 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

