import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CoatingType {
    singleCoating: boolean;
    doubleSagwan: boolean;
    laminate: boolean;
    doubleCoating: boolean;
}
export interface AddDoorOutput {
    createdType: DoorType;
}
export interface AddDoorInput {
    height: number;
    width: number;
    coatings: CoatingType;
}
export interface DoorType {
    id: bigint;
    height: number;
    squareFeet: number;
    roundedHeight: bigint;
    roundedWidth: bigint;
    width: number;
    coatings: CoatingType;
}
export interface backendInterface {
    addDoor(input: AddDoorInput): Promise<AddDoorOutput>;
    calculateCoatingAmounts(): Promise<{
        doubleCoatingAmount: number;
        laminateAmount: number;
        singleCoatingAmount: number;
        doubleSagwanAmount: number;
    }>;
    deleteType(id: bigint): Promise<void>;
    getAllTypes(): Promise<Array<DoorType>>;
    getCoatingTotals(): Promise<{
        singleCoating: number;
        doubleSagwan: number;
        laminate: number;
        doubleCoating: number;
    }>;
    getTotalSquareFeet(): Promise<number>;
}
