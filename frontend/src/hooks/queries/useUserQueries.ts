import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { api } from '../../services/api';
import { queryKeys } from '../../lib/queryKeys';
import type { RootState } from '../../store';

export function useCurrentUser() {
  const token = useSelector((state: RootState) => state.auth.token);
  
  return useQuery({
    queryKey: queryKeys.users.me(),
    queryFn: () => api.auth.me(token!),
    enabled: !!token,
  });
}

export function useUserStats(userId: string | number) {
  const token = useSelector((state: RootState) => state.auth.token);
  
  return useQuery({
    queryKey: queryKeys.users.stats(userId),
    queryFn: async () => {
      // TODO: Implement when backend endpoint is available
      throw new Error('Not implemented');
    },
    enabled: !!token && !!userId,
  });
}

export function useUserGames(userId: string | number) {
  const token = useSelector((state: RootState) => state.auth.token);
  
  return useInfiniteQuery({
    queryKey: queryKeys.users.games(userId),
    queryFn: async ({ pageParam = 0 }) => {
      // TODO: Implement pagination when backend supports it
      const games = await api.games.getAll(token!);
      return {
        data: games,
        nextPage: null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!token && !!userId,
    initialPageParam: 0,
  });
}

