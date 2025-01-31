import { SHA256 } from "crypto-js";

export default function SHA256Process(data: object | string) {
    return SHA256(JSON.stringify(data)).toString();
}