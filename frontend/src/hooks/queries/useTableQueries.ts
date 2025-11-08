import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { api } from '../../services/api';
import { queryKeys } from '../../lib/queryKeys';
import type { RootState } from '../../store';
import type { TableListParams, InfiniteQueryResponse, Table } from '../../types/table';

interface UseTablesOptions {
  filters?: TableListParams['filters'];
  sortBy?: TableListParams['sortBy'];
  sortOrder?: TableListParams['sortOrder'];
  limit?: number;
  enabled?: boolean;
}

export function useTables(options: UseTablesOptions = {}) {
  const token = useSelector((state: RootState) => state.auth.token);
  const { filters, sortBy, sortOrder, limit = 20, enabled = true } = options;

  const queryKey = queryKeys.tables.all({
    filters,
    sortBy,
    sortOrder,
    limit,
  });

  return useInfiniteQuery<InfiniteQueryResponse<Table>>({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const page = typeof pageParam === 'number' ? pageParam : 0;
      const response = await api.tables.getAll(token!, {
        page,
        limit,
        ...filters,
        sortBy,
        sortOrder,
      });

      // Handle both paginated response and plain array response
      if (Array.isArray(response)) {
        // Backend doesn't support pagination yet - return all data
        return {
          data: response,
          nextPage: null,
          hasMore: false,
        };
      }

      // Backend supports pagination
      const { data, pagination } = response;
      return {
        data,
        nextPage: pagination.hasNext ? page + 1 : null,
        hasMore: pagination.hasNext,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!token && enabled,
    initialPageParam: 0,
  });
}

export function useTablesPaginated(params: TableListParams = {}) {
  const token = useSelector((state: RootState) => state.auth.token);
  const { page = 1, limit = 20, filters, sortBy, sortOrder } = params;

  const queryKey = queryKeys.tables.all({
    page,
    limit,
    filters,
    sortBy,
    sortOrder,
  });

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await api.tables.getAll(token!, {
        page,
        limit,
        ...filters,
        sortBy,
        sortOrder,
      });

      // Handle both paginated response and plain array response
      if (Array.isArray(response)) {
        // Backend doesn't support pagination yet - return mock paginated response
        return {
          data: response,
          pagination: {
            page: 1,
            limit: response.length,
            total: response.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        };
      }

      return response;
    },
    enabled: !!token,
  });
}

export function useTable(id: string | number) {
  const token = useSelector((state: RootState) => state.auth.token);

  return useQuery({
    queryKey: queryKeys.tables.detail(id),
    queryFn: () => api.tables.getOne(id, token!),
    enabled: !!token && !!id,
  });
}

export function useTablePlayers(id: string | number) {
  const token = useSelector((state: RootState) => state.auth.token);

  return useQuery({
    queryKey: queryKeys.tables.players(id),
    queryFn: async () => {
      const table = await api.tables.getOne(id, token!);
      // Extract players from table data
      return table.players || [];
    },
    enabled: !!token && !!id,
  });
}
