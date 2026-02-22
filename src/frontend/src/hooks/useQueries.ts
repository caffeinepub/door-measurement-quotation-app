import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { DoorEntry, AddDoorInput, ComputeTotals } from '../backend';

// Query key constants
const QUERY_KEYS = {
  types: ['doorTypes'],
  totalSquareFeet: ['totalSquareFeet'],
};

// Get all door entries
export function useGetAllTypes(refreshTrigger: number) {
  const { actor, isFetching } = useActor();

  return useQuery<DoorEntry[]>({
    queryKey: [...QUERY_KEYS.types, refreshTrigger],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTypes();
    },
    enabled: !!actor && !isFetching,
  });
}

// Get total square feet and coating totals
export function useGetTotalSquareFeet(refreshTrigger: number) {
  const { actor, isFetching } = useActor();

  return useQuery<ComputeTotals>({
    queryKey: [...QUERY_KEYS.totalSquareFeet, refreshTrigger],
    queryFn: async () => {
      if (!actor) return {
        singleCoating: 0,
        doubleCoating: 0,
        doubleSagwan: 0,
        laminate: 0,
        grandTotal: 0,
      };
      return actor.getTotalSquareFeet();
    },
    enabled: !!actor && !isFetching,
  });
}

// Add door mutation
export function useAddDoor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddDoorInput) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addDoor(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.types });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.totalSquareFeet });
    },
  });
}

// Delete door entry mutation
export function useDeleteDoor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteDoor(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.types });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.totalSquareFeet });
    },
  });
}
