import { Eip1193Provider, BrowserProvider, getAddress } from "ethers";
import { ZKWarden__factory } from "../types";

// send tx to zkWarden.verify
export const verifyTransaction = async (
  provider: Eip1193Provider,
  _proof: string[],
  _pubSignals: string[]
) => {
  const logPrefix = "utils/transaction::submitTransaction";

  // step 0: init provider from client
  console.debug("%s\t%s", logPrefix, "init provider");
  const ethProvider = new BrowserProvider(provider);

  console.debug({ ethProvider });

  // step 1: init zkWarden contract
  console.debug("%s\t%s", logPrefix, "init zkWarden AND TEST");
  // @todo replace `address` from config
  const zkWardenAddress = getAddress(
    "0xa56Cc3AD92D64332b6911E25C68101F8fc001e62"
  );

  const test = await ethProvider.getBalance(zkWardenAddress);
  console.debug({ test });
  const zkWarden = ZKWarden__factory.connect(zkWardenAddress, ethProvider);
  console.debug({ zkWarden });

  // step 2: check contract is init correct by assert active store root
  // step 2.0: get current captcha store merkle root
  console.debug("%s\t%s", logPrefix, "get current captcha store merkle root");
  const root = await zkWarden.getRoot();
  console.debug({ root });

  // step 3: send tx to zkWarden.verify
  console.debug("%s\t%s", logPrefix, "send tx to zkWarden.verify");
  // const tx = await zkWarden.verify(_proof, _pubSignals);
};
