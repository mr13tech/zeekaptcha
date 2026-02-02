import React, { useEffect } from "react";
import "./index.css";
import Validator, { ValidatorState } from "./components/Validator";
import { ProofResponse, CaptchaObject } from "./components/CaptchaPopup";
import snarkjsencoded from "../assets/snarkjs.min.js";
import ZkaptchaContext from "./components/ZkaptchaContext";
import { Eip1193Provider } from "ethers";

interface zeekaptchaProps {
  address: `0x${string}` | undefined;
  provider: Eip1193Provider | undefined;
}

const Zeekaptcha: React.FC<zeekaptchaProps> = ({
  address,
  provider,
}: zeekaptchaProps) => {
  useEffect(() => {
    const script = document.createElement("script");
    const snarkjs = atob(snarkjsencoded);
    script.textContent = snarkjs;

    document.body.appendChild(script);
    // Cleanup the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const [validatorState, setValidatorState] = React.useState<ValidatorState>(
    ValidatorState.Idle
  );
  const [proofResponse, setProofResponse] =
    React.useState<ProofResponse | null>(null);

  const [captchaData, setCaptchaData] = React.useState<CaptchaObject | null>(
    null
  );

  // if (signer === null) {
  //   throw new Error("Signer is null")
  // }

  return (
    <ZkaptchaContext.Provider
      value={{
        validatorState,
        setValidatorState,
        proofResponse,
        setProofResponse,
        captchaData,
        setCaptchaData,
        address,
        provider,
      }}
    >
      <Validator />
    </ZkaptchaContext.Provider>
  );
};
export default Zeekaptcha;
