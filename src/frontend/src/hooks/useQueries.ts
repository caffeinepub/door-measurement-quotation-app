import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { DoorEntry } from '../backend';

// Query key constants
const QUERY_KEYS = {
  entries: ['doorEntries'],
  grandTotals: ['grandTotals'],
};

// Get all door entries
export function useGetAllEntries(refreshTrigger: number) {
  const { actor, isFetching } = useActor();

  return useQuery<DoorEntry[]>({
    queryKey: [...QUERY_KEYS.entries, refreshTrigger],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

// Get grand totals
export function useGetGrandTotals(refreshTrigger: number) {
  const { actor, isFetching } = useActor();

  return useQuery<{ totalSquareFeet: number; totalAmount: bigint }>({
    queryKey: [...QUERY_KEYS.grandTotals, refreshTrigger],
    queryFn: async () => {
      if (!actor) return { totalSquareFeet: 0, totalAmount: BigInt(0) };
      const [totalSquareFeet, totalAmount] = await Promise.all([
        actor.getGrandTotalSquareFeet(),
        actor.getGrandTotalAmount(),
      ]);
      return { totalSquareFeet, totalAmount };
    },
    enabled: !!actor && !isFetching,
  });
}

// Add door entry mutation
export function useAddDoorEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      height,
      width,
      rate,
    }: {
      height: number;
      width: number;
      rate: number;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addDoorEntry(height, width, rate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.entries });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.grandTotals });
    },
  });
}

// Delete door entry mutation
export function useDeleteEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.entries });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.grandTotals });
    },
  });
}
