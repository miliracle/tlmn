import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useSelector } from 'react-redux';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useRegister } from '../hooks/mutations/useAuthMutations';
import type { RootState } from '../store';

export function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const registerMutation = useRegister();
  const authError = useSelector((state: RootState) => state.auth.authError);
  const isRegistering = useSelector((state: RootState) => state.auth.isRegistering);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (password !== confirmPassword) {
      return;
    }

    registerMutation.mutate({ email, username, password });
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-3 sm:p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="max-h-[calc(100svh-1.5rem)] overflow-y-auto border-border">
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
                <div className="grid gap-1.5 sm:gap-2">
                  <Label htmlFor="username" className="text-sm">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="h-8 sm:h-9"
                  />
                </div>
                <div className="grid gap-1.5 sm:gap-2">
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-8 sm:h-9"
                  />
                </div>
                <div className="grid gap-1.5 sm:gap-2">
                  <Label htmlFor="password" className="text-sm">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-8 sm:h-9"
                  />
                </div>
                <div className="grid gap-1.5 sm:gap-2">
                  <Label htmlFor="confirm-password" className="text-sm">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-8 sm:h-9"
                  />
                  {password && confirmPassword && password !== confirmPassword && (
                    <p className="text-xs sm:text-sm text-destructive">Passwords do not match</p>
                  )}
                </div>
                {authError && (
                  <div className="text-xs sm:text-sm text-destructive bg-destructive/10 p-2 sm:p-3 rounded-md">
                    {authError}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full h-8 sm:h-9 md:h-10"
                  disabled={
                    isRegistering || (password !== confirmPassword && confirmPassword !== '')
                  }
                >
                  {isRegistering ? 'Creating account...' : 'Create Account'}
                </Button>
              </div>
              <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm">
                Already have an account?{' '}
                <Link to="/login" className="underline underline-offset-4 text-primary">
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
