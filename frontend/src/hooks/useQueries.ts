import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { DoorEntry, AddDoorInput, ComputeTotals } from "../backend";

const DEFAULT_TOTALS: ComputeTotals = {
  singleCoating: 0,
  doubleCoating: 0,
  doubleSagwan: 0,
  laminate: 0,
  grandTotal: 0,
};

export function useGetAllDoorEntries(refreshTrigger?: number) {
  const { actor, isFetching } = useActor();
  const isActorReady = !!actor && !isFetching;

  return useQuery<DoorEntry[]>({
    queryKey: ["doorEntries", refreshTrigger],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getAll();
      return result ?? [];
    },
    enabled: isActorReady,
    retry: false,
    staleTime: 0,
  });
}

export function useGetTotalSquareFeet() {
  const { actor, isFetching } = useActor();
  const isActorReady = !!actor && !isFetching;

  return useQuery<ComputeTotals>({
    queryKey: ["totalSquareFeet"],
    queryFn: async () => {
      if (!actor) return DEFAULT_TOTALS;
      const result = await actor.getTotals();
      return result ?? DEFAULT_TOTALS;
    },
    enabled: isActorReady,
    retry: false,
    staleTime: 0,
  });
}

export function useAddDoorEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddDoorInput) => {
      if (!actor) throw new Error("Actor not initialized");
      return await actor.addDoor(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doorEntries"] });
      queryClient.invalidateQueries({ queryKey: ["totalSquareFeet"] });
    },
  });
}

export function useDeleteDoorEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not initialized");
      return await actor.deleteDoor(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doorEntries"] });
      queryClient.invalidateQueries({ queryKey: ["totalSquareFeet"] });
    },
  });
}

export function useDeleteAllDoorEntries() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      const entries = await actor.getAll();
      await Promise.all(entries.map((entry) => actor.deleteDoor(entry.id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doorEntries"] });
      queryClient.invalidateQueries({ queryKey: ["totalSquareFeet"] });
    },
  });
}
