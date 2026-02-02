// Define prover function

import {
  PlonkProof,
  PublicSignals,
  SignalValueType,
  ZKArtifact,
} from "snarkjs";

import wasmCircuit from "../../assets/verify.wasm";
import zkey from "../../assets/verify.zkey";

export const doProve = async (
  secret: string,
  expectedMimc: string,
  root: string,
  sender: string
) => {
  const fetchAndDecodeBinary = async (binary: string): Promise<ZKArtifact> => {
    try {
      const response = await fetch(`data:application/wasm;base64,${binary}`);
      const buffer = await response.arrayBuffer();
      return new Uint8Array(buffer);
    } catch (error) {
      console.error("Error converting Base64 to Uint8Array", error);
      return new Uint8Array();
    }
  };
  const decodedWasm = await fetchAndDecodeBinary(wasmCircuit);
  const decodedZkey = await fetchAndDecodeBinary(zkey);

  console.debug({
    secret,
    expectedMimc,
    root,
    sender,
  });

  const secretBigInt = stringToBigInt(secret); // use bytes from string same as in golang
  const expectedMimcBigInt = BigInt("0x" + expectedMimc); // use hex string
  const rootBigInt = BigInt(root); // use hex string
  const senderBigInt = BigInt(sender); // use hex string

  console.debug({
    secretBigInt,
    expectedMimcBigInt,
    rootBigInt,
    senderBigInt,
  });

  const { proof, publicSignals } = await window.snarkjs.plonk.fullProve(
    {
      secret: secretBigInt.toString(10),
      expectedMimc: expectedMimcBigInt.toString(10),
      root: rootBigInt.toString(10),
      sender: senderBigInt.toString(10),
    },
    decodedWasm,
    decodedZkey
  );
  return { proof, publicSignals };
};

// @todo move to utils and add docstring
// this func does same result as in golang:
// captcha/builder.go:71 :: new(big.Int).SetBytes([]byte(str))
function stringToBigInt(str: string): BigInt {
  let bigInt = BigInt(0);
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    bigInt = (bigInt << BigInt(8)) | BigInt(charCode);
  }
  return bigInt;
}

export const proofToSolidityCalldata = (
  proof: PlonkProof,
  publicSignals: PublicSignals
) => {
  const ignoreKeys = ["protocol", "curve"];
  let resultArray = [];

  for (let key in proof) {
    const value: any = (proof as { [key: string]: any })[key];
    if (value instanceof Array) {
      resultArray.push(value[0]);
      resultArray.push(value[1]);
    } else if (ignoreKeys.includes(key)) {
      continue;
    } else {
      resultArray.push(value);
    }
  }
  return JSON.stringify({ _proof: resultArray, _pubSignals: publicSignals });
};
