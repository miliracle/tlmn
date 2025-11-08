import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useSelector } from 'react-redux';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useLogin } from '../hooks/mutations/useAuthMutations';
import type { RootState } from '../store';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLogin();
  const authError = useSelector((state: RootState) => state.auth.authError);
  const isLoggingIn = useSelector((state: RootState) => state.auth.isLoggingIn);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="flex min-h-[calc(100svh-4rem)] w-full items-center justify-center bg-background p-3 sm:p-6 md:p-10">
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
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="h-8 sm:h-9"
                  />
                </div>
                <div className="grid gap-1.5 sm:gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-sm">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-xs sm:text-sm underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-8 sm:h-9"
                  />
                </div>
                {authError && (
                  <div className="text-xs sm:text-sm text-destructive bg-destructive/10 p-2 sm:p-3 rounded-md">
                    {authError}
                  </div>
                )}
                <Button type="submit" className="w-full h-8 sm:h-9 md:h-10" disabled={isLoggingIn}>
                  {isLoggingIn ? 'Logging in...' : 'Login'}
                </Button>
              </div>
              <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="underline underline-offset-4 text-primary">
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
