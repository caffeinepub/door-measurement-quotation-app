import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CreateDoorType {
    createdType: DoorEntry;
}
export interface ComputeTotals {
    singleCoating: number;
    doubleSagwan: number;
    laminate: number;
    doubleCoating: number;
    grandTotal: number;
}
export interface AddDoorInput {
    heightEntered: number;
    heightRounded: bigint;
    widthEntered: number;
    coatingType: CoatingType;
    widthRounded: bigint;
}
export interface DoorEntry {
    id: bigint;
    squareFeet: number;
    heightEntered: number;
    heightRounded: bigint;
    widthEntered: number;
    coatingType: CoatingType;
    widthRounded: bigint;
}
export enum CoatingType {
    doubleSagwan = "doubleSagwan",
    double_ = "double",
    laminate = "laminate",
    single = "single"
}
export interface backendInterface {
    addDoor(input: AddDoorInput): Promise<CreateDoorType>;
    deleteDoor(id: bigint): Promise<void>;
    getAll(): Promise<Array<DoorEntry>>;
    getTotals(): Promise<ComputeTotals>;
}
