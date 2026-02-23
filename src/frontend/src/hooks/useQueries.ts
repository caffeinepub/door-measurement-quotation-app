import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { DoorEntry, AddDoorInput, ComputeTotals } from "../backend";

export function useGetAllDoorEntries(refreshTrigger?: number) {
  const { actor, isFetching } = useActor();

  return useQuery<DoorEntry[]>({
    queryKey: ["doorEntries", refreshTrigger],
    queryFn: async () => {
      if (!actor) {
        return [];
      }
      try {
        const result = await actor.getAll();
        return result || [];
      } catch (error) {
        console.error("Error fetching door entries:", error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    staleTime: 0,
  });
}

export function useGetTotalSquareFeet() {
  const { actor, isFetching } = useActor();

  return useQuery<ComputeTotals>({
    queryKey: ["totalSquareFeet"],
    queryFn: async () => {
      if (!actor) {
        return {
          singleCoating: 0,
          doubleCoating: 0,
          doubleSagwan: 0,
          laminate: 0,
          grandTotal: 0,
        };
      }
      try {
        const result = await actor.getTotals();
        return result || {
          singleCoating: 0,
          doubleCoating: 0,
          doubleSagwan: 0,
          laminate: 0,
          grandTotal: 0,
        };
      } catch (error) {
        console.error("Error fetching totals:", error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
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
