import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { DoorType, AddDoorInput } from '../backend';

// Query key constants
const QUERY_KEYS = {
  types: ['doorTypes'],
  totalSquareFeet: ['totalSquareFeet'],
  coatingAmounts: ['coatingAmounts'],
};

// Get all door types
export function useGetAllTypes(refreshTrigger: number) {
  const { actor, isFetching } = useActor();

  return useQuery<DoorType[]>({
    queryKey: [...QUERY_KEYS.types, refreshTrigger],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTypes();
    },
    enabled: !!actor && !isFetching,
  });
}

// Get total square feet
export function useGetTotalSquareFeet(refreshTrigger: number) {
  const { actor, isFetching } = useActor();

  return useQuery<number>({
    queryKey: [...QUERY_KEYS.totalSquareFeet, refreshTrigger],
    queryFn: async () => {
      if (!actor) return 0;
      return actor.getTotalSquareFeet();
    },
    enabled: !!actor && !isFetching,
  });
}

// Get coating amounts
export function useGetCoatingAmounts(refreshTrigger: number) {
  const { actor, isFetching } = useActor();

  return useQuery<{
    singleCoatingAmount: number;
    doubleCoatingAmount: number;
    doubleSagwanAmount: number;
    laminateAmount: number;
  }>({
    queryKey: [...QUERY_KEYS.coatingAmounts, refreshTrigger],
    queryFn: async () => {
      if (!actor) return {
        singleCoatingAmount: 0,
        doubleCoatingAmount: 0,
        doubleSagwanAmount: 0,
        laminateAmount: 0,
      };
      return actor.calculateCoatingAmounts();
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
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.coatingAmounts });
    },
  });
}

// Delete door type mutation
export function useDeleteType() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteType(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.types });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.totalSquareFeet });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.coatingAmounts });
    },
  });
}
