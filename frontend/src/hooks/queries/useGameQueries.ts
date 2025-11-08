import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { api } from '../../services/api';
import { queryKeys } from '../../lib/queryKeys';
import type { RootState } from '../../store';

export function useGame(id: string | number) {
  const token = useSelector((state: RootState) => state.auth.token);
  
  return useQuery({
    queryKey: queryKeys.games.detail(id),
    queryFn: () => api.games.getOne(id, token!),
    enabled: !!token && !!id,
  });
}

export function useGameHistory(id: string | number) {
  const token = useSelector((state: RootState) => state.auth.token);
  
  return useQuery({
    queryKey: queryKeys.games.history(id),
    queryFn: async () => {
      // TODO: Implement when backend endpoint is available
      const game = await api.games.getOne(id, token!);
      return game.history || [];
    },
    enabled: !!token && !!id,
  });
}

