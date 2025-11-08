import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { api } from '../../services/api';
import { queryKeys } from '../../lib/queryKeys';
import type { RootState } from '../../store';

export function useCreateTable() {
  const token = useSelector((state: RootState) => state.auth.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => api.tables.create(data, token!),
    onSuccess: () => {
      // Invalidate all table list queries regardless of filters
      queryClient.invalidateQueries({ queryKey: ['tables', 'list'] });
    },
  });
}

export function useJoinTable() {
  const token = useSelector((state: RootState) => state.auth.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tableId: string | number) => api.tables.join(tableId, token!),
    onSuccess: (_, tableId) => {
      // Invalidate all table list queries regardless of filters
      queryClient.invalidateQueries({ queryKey: ['tables', 'list'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.detail(tableId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.players(tableId) });
    },
  });
}

export function useLeaveTable() {
  const token = useSelector((state: RootState) => state.auth.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tableId: string | number) => api.tables.leave(tableId, token!),
    onSuccess: (_, tableId) => {
      // Invalidate all table list queries regardless of filters
      queryClient.invalidateQueries({ queryKey: ['tables', 'list'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.detail(tableId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.players(tableId) });
    },
  });
}
