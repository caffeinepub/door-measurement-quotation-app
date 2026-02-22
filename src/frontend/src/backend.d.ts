import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DoorEntry {
    id: bigint;
    height: number;
    rate: number;
    squareFeet: number;
    roundedHeight: bigint;
    roundedWidth: bigint;
    width: number;
    amount: bigint;
}
export interface backendInterface {
    addDoorEntry(height: number, width: number, rate: number | null): Promise<DoorEntry>;
    deleteEntry(id: bigint): Promise<void>;
    getAllEntries(): Promise<Array<DoorEntry>>;
    getGrandTotalAmount(): Promise<bigint>;
    getGrandTotalSquareFeet(): Promise<number>;
}
