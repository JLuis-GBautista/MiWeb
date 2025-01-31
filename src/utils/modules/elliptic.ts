import Elliptic from "elliptic";
import SHA256Process from "./hash";

const ec = new Elliptic.ec("secp256k1");

const ellipticProcess = {
    createKeyPair: () => ec.genKeyPair(),
    verifySignature: (publicKey: string, signature: Elliptic.ec.Signature, data: object | string) => {
        return ec.keyFromPublic(publicKey, "hex").verify(SHA256Process(data), signature);
    }
}

export default ellipticProcess;