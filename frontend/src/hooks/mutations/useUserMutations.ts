import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { api } from '../../services/api';
import { queryKeys } from '../../lib/queryKeys';
import type { RootState } from '../../store';

export function useUpdateProfile() {
  const token = useSelector((state: RootState) => state.auth.token);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      // TODO: Implement when backend endpoint is available
      throw new Error('Not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.me() });
    },
  });
}

export function useChangePassword() {
  const token = useSelector((state: RootState) => state.auth.token);
  
  return useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      // TODO: Implement when backend endpoint is available
      throw new Error('Not implemented');
    },
  });
}

