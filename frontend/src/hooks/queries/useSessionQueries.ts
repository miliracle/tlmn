import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { api } from '../../services/api';
import { queryKeys } from '../../lib/queryKeys';
import type { RootState } from '../../store';

export function useSession(id: string | number) {
  const token = useSelector((state: RootState) => state.auth.token);

  return useQuery({
    queryKey: queryKeys.sessions.detail(id),
    queryFn: () => api.sessions.getOne(id, token!),
    enabled: !!token && !!id,
  });
}

export function useSessionSummary(id: string | number) {
  const token = useSelector((state: RootState) => state.auth.token);

  return useQuery({
    queryKey: queryKeys.sessions.summary(id),
    queryFn: async () => {
      const session = await api.sessions.getOne(id, token!);
      // Extract summary from session data
      return session.summary || {};
    },
    enabled: !!token && !!id,
  });
}
