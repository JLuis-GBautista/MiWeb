import { ec } from "elliptic";

export interface TransactionInputInterface {
    timestamp: number,
    amount: number,
    address: string,
    signature: ec.Signature
}

export interface TransactionOutputInterface {
    amount: number,
    address:string
}