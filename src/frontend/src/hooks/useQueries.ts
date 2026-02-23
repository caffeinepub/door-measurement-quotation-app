import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { DoorEntry, AddDoorInput, ComputeTotals } from "../backend";

export function useGetAllDoorEntries(refreshTrigger?: number) {
  const { actor, isFetching } = useActor();

  return useQuery<DoorEntry[]>({
    queryKey: ["doorEntries", refreshTrigger],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTypes();
    },
    enabled: !!actor && !isFetching,
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
      return actor.getTotalSquareFeet();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddDoorEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddDoorInput) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.addDoor(input);
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
      return actor.deleteDoor(id);
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
      const entries = await actor.getAllTypes();
      await Promise.all(entries.map((entry) => actor.deleteDoor(entry.id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doorEntries"] });
      queryClient.invalidateQueries({ queryKey: ["totalSquareFeet"] });
    },
  });
}
