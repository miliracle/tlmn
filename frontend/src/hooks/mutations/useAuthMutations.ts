import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from '@tanstack/react-router';
import { api } from '../../services/api';
import { queryKeys } from '../../lib/queryKeys';
import {
  setToken,
  setAuthError,
  setIsLoggingIn,
  setIsRegistering,
} from '../../store/slices/authSlice';
import type { AppDispatch } from '../../store';

export function useLogin() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      return api.auth.login(data);
    },
    onMutate: () => {
      dispatch(setIsLoggingIn(true));
      dispatch(setAuthError(null));
    },
    onSuccess: (response) => {
      const { access_token } = response;
      // Calculate expiry (assuming token expires in 7 days, adjust as needed)
      const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
      dispatch(setToken({ token: access_token, expiry }));
      queryClient.invalidateQueries({ queryKey: queryKeys.users.me() });
      navigate({ to: '/tables' });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Login failed. Please try again.';
      dispatch(setAuthError(errorMessage));
    },
    onSettled: () => {
      dispatch(setIsLoggingIn(false));
    },
  });
}

export function useRegister() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; username: string; password: string }) => {
      return api.auth.register(data);
    },
    onMutate: () => {
      dispatch(setIsRegistering(true));
      dispatch(setAuthError(null));
    },
    onSuccess: (response) => {
      const { access_token } = response;
      // Calculate expiry (assuming token expires in 7 days, adjust as needed)
      const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
      dispatch(setToken({ token: access_token, expiry }));
      queryClient.invalidateQueries({ queryKey: queryKeys.users.me() });
      navigate({ to: '/tables' });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Registration failed. Please try again.';
      dispatch(setAuthError(errorMessage));
    },
    onSettled: () => {
      dispatch(setIsRegistering(false));
    },
  });
}
