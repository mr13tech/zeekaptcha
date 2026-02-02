import React from "react";
import { ValidatorState } from "./Validator";
import { ProofResponse, CaptchaObject } from "./CaptchaPopup";
import { Eip1193Provider } from "ethers";

interface ZkaptchaContextProps {
  validatorState: ValidatorState;
  setValidatorState: React.Dispatch<React.SetStateAction<ValidatorState>>;
  proofResponse: ProofResponse | null;
  setProofResponse: React.Dispatch<React.SetStateAction<ProofResponse | null>>;
  captchaData: CaptchaObject | null;
  setCaptchaData: React.Dispatch<React.SetStateAction<CaptchaObject | null>>;
  address: `0x${string}` | undefined;
  provider: Eip1193Provider | undefined;
}

const ZkaptchaContext = React.createContext<ZkaptchaContextProps>(
  {} as ZkaptchaContextProps // Provide a default value or use assertion as needed
);

export default ZkaptchaContext;
