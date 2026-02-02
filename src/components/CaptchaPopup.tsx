import React, { useState, useEffect, FormEvent } from "react";
import { doProve, proofToSolidityCalldata } from "../utils/prover.js";
import { ValidatorState } from "./Validator.js";
import { PlonkProof, PublicSignals } from "snarkjs";
import { GrRefresh } from "react-icons/gr";
import ZkaptchaContext from "./ZkaptchaContext.js";
import { shortenCryptoAddress } from "../utils/address.js";

interface CaptchaPopupProps {
  onClose: () => void;
  captchaData: CaptchaObject | null;
  setProofResponse: React.Dispatch<React.SetStateAction<ProofResponse | null>>;
  setValidatorState: React.Dispatch<React.SetStateAction<ValidatorState>>;
  fetchCaptchaFunction: (fromRefresh: boolean) => void;
}

export interface CaptchaObject {
  image: string;
  mimcHash: string;
  merkleProof: string[];
}

export interface ProofResponse {
  proof: PlonkProof;
  publicSignals: PublicSignals;
}

const LoadingImage: React.FC = () => {
  return (
    <div
      role="status"
      className="ztw-flex ztw-space-y-8 ztw-w-full ztw-animate-pulse"
    >
      <div className="ztw-flex ztw-items-center ztw-justify-center ztw-w-full ztw-h-20 ztw-bg-gray-300 ztw-rounded sm:ztw-w-96 dark:ztw-bg-gray-700"></div>
    </div>
  );
};

const CaptchaPopup: React.FC<CaptchaPopupProps> = ({
  captchaData,
  onClose,
  setValidatorState,
  setProofResponse,
  fetchCaptchaFunction,
}) => {
  const zc = React.useContext(ZkaptchaContext);

  // close the popup when the user clicks outside of it
  const handleOutsideClick = (e: MouseEvent) => {
    const popupContainer = document.getElementById("popupContainer");
    if (popupContainer && !popupContainer.contains(e.target as Node)) {
      onClose();
    }
  };

  // todo: return the proof/public signals and or the error associated with it
  const handleSolutionInput = async (event: FormEvent) => {
    event.preventDefault();
    const inputValue = (
      (event.target as HTMLFormElement).elements[0] as HTMLInputElement
    ).value;

    if (captchaData && zc.address) {
      console.debug("INX");
      setValidatorState(ValidatorState.Loading);
      try {
        // @dev tests ### remove later

        if (!window.snarkjs) {
          throw new Error("snarkjs is not loaded yet");
        }

        const { proof, publicSignals }: any = await doProve(
          inputValue,
          captchaData.mimcHash,
          captchaData.merkleProof[0],
          zc.address
        );
        console.log(proof);
        console.log(publicSignals);
        // console.log(proofToSolidityCalldata(proof, publicSignals))
        // close the popup
        onClose();
        // set the validator state to success
        setValidatorState(ValidatorState.Prover);
        // set the proof response
        setProofResponse({ proof, publicSignals });
        // console.log(proofResult)
        return;
      } catch (error) {
        setValidatorState(ValidatorState.Error);
        console.log(error);
      }
    }
    // close the popup
    onClose();
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div id="popupContainer">
      <div className="ztw-absolute ztw-top-14 ztw-left-0 ztw-transform -ztw-translate-y-full ztw-translate-x-2 ztw-text-white">
        &#9650;
      </div>
      <div
        className="ztw-absolute ztw-flex ztw-flex-col ztw-justify-center ztw-items-center ztw-top-0 ztw-z-20 ztw-left-0 ztw-mt-12 ztw-p-4 ztw-border-b ztw-border-r ztw-border-l ztw-border-gray-200 ztw-bg-white ztw-rounded ztw-shadow-xl ztw-space-y-4"
        style={{ width: "300px" }}
      >
        {!captchaData && <LoadingImage />}
        {captchaData && <img src={captchaData.image} alt="Captcha Image" />}
        <form
          className="ztw-flex ztw-flex-col ztw-space-y-4 ztw-w-full"
          onSubmit={handleSolutionInput}
        >
          <div className="ztw-flex ztw-justify-between ztw-items-center">
            <input
              required
              autoFocus={true}
              className="ztw-justify-left ztw-appearance-none ztw-rounded-none ztw-relative ztw-block ztw-w-full ztw-px-3 ztw-py-2 ztw-border ztw-border-gray-300 ztw-placeholder-gray-500 ztw-text-gray-900 ztw-rounded-t-md focus:ztw-outline-none focus:ztw-ring-green-500 focus:ztw-border-green-500 focus:ztw-z-10 sm:ztw-text-sm"
              placeholder="Solution"
            />
            <button
              type="button"
              className="ztw-p-2 ztw-ml-2"
              onClick={() => {
                fetchCaptchaFunction(true);
              }}
            >
              <GrRefresh />
            </button>
          </div>
          <h3 className="ztw-text-black">
            {"🤖 " + shortenCryptoAddress(zc.address)}
          </h3>
          <button
            type="submit"
            className="ztw-group ztw-relative ztw-w-full ztw-flex ztw-justify-center ztw-py-2 ztw-px-4 ztw-border ztw-border-transparent ztw-text-sm ztw-font-medium ztw-rounded-md ztw-text-white ztw-bg-absinthe-green hover:ztw-bg-absinthe-green-dark focus:ztw-outline-none focus:ztw-ring-2 focus:ztw-ring-offset-2 focus:ztw-ring-absinthe-green-light"
          >
            ZK-Prove
          </button>
        </form>
      </div>
    </div>
  );
};

export default CaptchaPopup;
