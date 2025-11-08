import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { api } from '../../services/api';
import { queryKeys } from '../../lib/queryKeys';
import type { RootState } from '../../store';

export function useMyBots() {
  const token = useSelector((state: RootState) => state.auth.token);
  
  return useQuery({
    queryKey: queryKeys.bots.myBots(),
    queryFn: () => api.bots.getAll(token!),
    enabled: !!token,
  });
}

export function useBot(id: string | number) {
  const token = useSelector((state: RootState) => state.auth.token);
  
  return useQuery({
    queryKey: queryKeys.bots.detail(id),
    queryFn: () => api.bots.getOne(id, token!),
    enabled: !!token && !!id,
  });
}

