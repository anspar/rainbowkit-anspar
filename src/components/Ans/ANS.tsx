import React, { useEffect, useRef, useState } from "react";
import ansStyles from "./ANS.modules.css";
import { useAccount, useNetwork } from "wagmi";

import { getGateway, HosqProvider, useGet } from "../Hosq/Hosq";
import { useANSRead } from "../utils/hooks";
import isMobile from 'ismobilejs';
import { toast } from "react-toastify";

const userIconPh = require("../imgs/circle-user-solid.png");

export interface ANSProps {
  label?: string;
}

export interface ANSConnectorProps {
  address: string;
}

let selectedANS: any | undefined;

function ANSElem() {
  let data = getSelectedANS();
  const defANS = data ? data[0] : ""
  const [details, error, isLoading] = useGet(`${data[1]}/info.json`, true);

  return (
    <div className={[ansStyles.ans_wallet, "as-shadow-sm as-bg-light as-btn " + `${isLoading ? "as-loading": ""}`].join(" ")}>
      <img src={details?`${getGateway()}/${data[1]}/${details.image}`:userIconPh} alt="ANS User Image" className={ansStyles.icon}
        onError={(e) => { e.currentTarget.src = userIconPh }} />
      {!isMobile(window.navigator).any ?
        <span className="as-text-dark as-text-bold" style={{ marginLeft: "0.25rem" }}>
          {defANS.length > 10 ? `${defANS.substring(0, 7)}...` : defANS}
        </span>
        :
        <></>
      }
    </div>
  );
}

function ANSConnector(props: ANSConnectorProps) {
  const { chain, chains } = useNetwork()
  const { data, isError, isLoading } = useANSRead(chain?.id as number, "get_default", [props.address]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    isError && toast.error(`Failed to get Default ANS for ${props.address}`);
    if (data) {
      // console.log(data);
      selectedANS = data;
      setReady(true);
    }
  }, [data]);
  return (
    ready ? <ANSElem /> : <></>
  )
}

export function getSelectedANS() {
  return selectedANS
}

export function ANS(props: ANSProps) {
  const { address } = useAccount();
  return (
    address ?
      <HosqProvider>
        <ANSConnector address={address as string} />
      </HosqProvider>
      :
      <></>
  );
}