import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { ImCheckmark, ImCross } from "react-icons/im";
import CaptchaPopup from "./CaptchaPopup";
import ZkaptchaContext from "./ZkaptchaContext";
import { DEFAULT_CAPTCHA_ENDPOINT } from "../utils/constants";
import { CaptchaObject } from "./CaptchaPopup";
import absintheLogo from "../../assets/absintheLogo.png";
import { verifyTransaction } from "../utils/transaction";
import { proofToSolidityCalldata } from "../utils/prover";

export enum ValidatorState {
  Loading,
  Error,
  Success,
  Idle,
  Prover,
  Submitting,
}

function Validator() {
  const [isPopupShowing, setShowPopup] = useState(false);
  const [captchaData, setCaptchaData] = useState<CaptchaObject | null>(null);

  // using the react context + providers
  const zc = React.useContext(ZkaptchaContext);

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const fetchCaptcha = (fromRefresh: boolean = false) => {
    if (!fromRefresh) {
      if (captchaData !== null) return;
    }
    setCaptchaData(null);
    fetch(DEFAULT_CAPTCHA_ENDPOINT)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setCaptchaData(data);
        zc.setCaptchaData(data);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  };

  return (
    <div className="flex justify-center items-center">
      <div className="ztw-grid ztw-grid-cols-2 ztw-bg-gray-100 ztw-border ztw-border-gray-300 ztw-text-black ztw-h-20 ztw-p-3 ztw-shadow-lg ztw-w-80 dark:ztw-bg-gray-700 dark:ztw-border-gray-800 dark:ztw-shadow-none dark:ztw-text-white">
        {/* lhs */}
        <div className="ztw-flex ztw-items-center ztw-justify-start ztw-space-x-2">
          <div className="ztw-relative ztw-flex ztw-items-center ztw-justify-center ztw-space-x-3">
            {/* captcha button */}
            {zc.validatorState === ValidatorState.Idle && (
              <>
                <button
                  className="ztw-p-3.5 ztw-border ztw-border-gray-500 ztw-bg-gray-50 ztw-rounded-sm"
                  onClick={() => {
                    fetchCaptcha();
                    setShowPopup(true);
                  }}
                />
                <span>Verify</span>
              </>
            )}
            {/* loading spinner */}
            {zc.validatorState === ValidatorState.Loading && (
              <>
                <Spinner />
                <span>Verifying</span>
              </>
            )}

            {zc.validatorState === ValidatorState.Submitting && (
              <>
                <Spinner />
                <span>Submitting</span>
              </>
            )}

            {/* prover */}
            {zc.validatorState === ValidatorState.Prover && (
              <>
                <button
                  type="submit"
                  className="ztw-group ztw-relative ztw-w-full ztw-flex ztw-justify-center ztw-py-2 ztw-px-2 ztw-border ztw-border-transparent ztw-text-sm ztw-font-md ztw-rounded-md ztw-text-white ztw-bg-absinthe-green hover:bg-absinthe-green-dark"
                  onClick={async () => {
                    if (zc.proofResponse) {
                      try {
                        const { _proof, _pubSignals } = JSON.parse(
                          proofToSolidityCalldata(
                            zc.proofResponse.proof,
                            zc.proofResponse.publicSignals
                          )
                        );
                        zc.setValidatorState(ValidatorState.Submitting);
                        await verifyTransaction(
                          zc.provider!,
                          _proof,
                          _pubSignals
                        );
                        zc.setValidatorState(ValidatorState.Success);
                      } catch (error) {
                        zc.setValidatorState(ValidatorState.Error);
                      }
                    } else {
                      throw new Error("No proof response");
                    }
                  }}
                >
                  Submit Proof
                </button>
              </>
            )}

            {zc.validatorState === ValidatorState.Success && (
              <>
                <ImCheckmark color="#22CA80" />
                <span>Success!</span>
              </>
            )}

            {/* error */}
            {zc.validatorState === ValidatorState.Error && (
              <>
                <ImCross color="#F87171" />
                <span>Error</span>
              </>
            )}

            {/* captcha popup */}
            {isPopupShowing && (
              <CaptchaPopup
                captchaData={captchaData}
                onClose={handlePopupClose}
                setProofResponse={zc.setProofResponse}
                setValidatorState={zc.setValidatorState}
                fetchCaptchaFunction={fetchCaptcha}
              />
            )}
          </div>
        </div>

        {/* rhs */}
        <div className="ztw-flex ztw-justify-center ztw-items-center">
          <div className="ztw-text-center">
            <a
              href="https://absinthelabs.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className=""
            >
              {/* todo: figure out a better way to do image height */}
              <img
                src={absintheLogo}
                alt="logo"
                className="ztw-mx-auto ztw-h-8"
              />
            </a>
            <div className="ztw-text-xs">
              {/* todo: put anchor links to the privacy and terms links */}
              <a className="ztw-text-black hover:ztw-text-gray-500" href="">
                Privacy
              </a>{" "}
              -{" "}
              <a className="ztw-text-black hover:ztw-text-gray-500" href="">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Validator;
