import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { api } from '../../services/api';
import { queryKeys } from '../../lib/queryKeys';
import type { RootState } from '../../store';

export function useCreateBot() {
  const token = useSelector((state: RootState) => state.auth.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => api.bots.create(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bots.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.bots.myBots() });
    },
  });
}

export function useUpdateBot() {
  const token = useSelector((state: RootState) => state.auth.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: any }) =>
      api.bots.update(id, data, token!),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bots.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.bots.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.bots.myBots() });
    },
  });
}

export function useDeleteBot() {
  const token = useSelector((state: RootState) => state.auth.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => api.bots.delete(id, token!),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bots.all });
      queryClient.removeQueries({ queryKey: queryKeys.bots.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.bots.myBots() });
    },
  });
}
