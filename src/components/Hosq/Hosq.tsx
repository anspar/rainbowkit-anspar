import React, { ReactNode, useEffect, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import { useNetwork } from "wagmi";
import styled from 'styled-components';
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/progress";
import axios from "axios";
import { ethers } from "ethers";
import isMobile from "ismobilejs";

import { useHosqRead, useHosqWrite } from "../utils/hooks";
import "./Hosq.scss";
import blockTimes from "../utils/blockTimes";

// const blockTimes = require("../utils/blockTimes.json");


export interface HosqProviderProps {
  children: ReactNode;
  DefaultProviderId?: number;
}

export interface HosqUploadProps {
  files?: File[],
  blobs?: [{ blob: Blob, name: string }],
  wrapInDir: boolean,
  setResponse: any,
  setProgress?: Function
}

export interface HosqUploadFilesProps {
  maxFiles?: number,
  accept?: any,
  allowPinning?: boolean
}

let selectedProvider: any | undefined;
let selectedProviderId: number = 0;

const getColor = (props: any) => {
  if (props.isDragAccept) {
    return 'var(--as-success)';
  }
  if (props.isDragReject) {
    return 'var(--as-danger)';
  }
  if (props.isFocused) {
    return 'var(--as-secondary)';
  }
  return 'transparent';
}

const Container = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-width: 2px;
    border-radius: 1rem;
    border-color: ${(props: any) => getColor(props)};
    border-style: dashed;
    background-color: var(--as-dark-dim);
    color: var(--as-dark);
    outline: none;
    transition: border .24s ease-in-out;
    width: -webkit-fill-available;
  `;

function FileUploadComponent({ callback, ...props }: any) {
  return (
    <Dropzone preventDropOnDocument
      onDropAccepted={acceptedFiles => callback(acceptedFiles)}
      maxFiles={props.maxFiles} accept={props.accept}>
      {({ getRootProps, getInputProps, isFocused, isDragAccept, isDragReject }) => (
        <Container {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
          <input {...getInputProps()} />
          {isDragAccept ?
            <p>Drop</p>
            :
            <p>Drag 'n' drop {props.maxFiles === 1 ? "a file" : "some files"} here, or click to select</p>
          }
        </Container>
      )}
    </Dropzone>
  )
}

function PinButton(props: { blocks: number, cid: string, chainId: number, symbol?: string }) {
  const { data, isError, error, isLoading, write, fees } = useHosqPin(props.cid, props.blocks, selectedProviderId, props.chainId)
  const fee = fees.data ? fees.data[0].add(fees.data[1]).toString() : "0"
  // console.log(data, isError, isLoading, ethers.utils.formatEther(fee));
  const feeErr = ()=>{console.error(fees.error); toast.error("Error getting the provider fee")}
  fees.isError && feeErr();
  const pinErr = ()=>{console.error(error); toast.error("Error submitting pinning request")}
  isError && pinErr()
  return (
    <div className={`div-flex-column`}>
      <span className={`as-text-size-xs as-text-dark as-text-bold ${fees.isLoading? 'as-loading': ""}`}>
        Fee {props.symbol || "?"} {ethers.utils.formatEther(fee)}
      </span>
      <span className={`as-btn-primary as-pointer as-shadow-sm border1rem text-center fill-width ${isLoading? 'as-loading': ""}`}
        onClick={() => write()} style={{minWidth: "102px"}}>Pin CID</span>
    </div>
  )
}

function HosqPin(props: { cid: string }) {
  // const [blocks, setBlocks] = useState(1);
  const dateInput = useRef<any>();
  const [date, setDate] = useState(new Date(new Date().getTime() + (7 * 86400 * 1000)));
  const { chain, chains } = useNetwork();
  const blocks = Math.round(((date.getTime() - new Date().getTime()) / 1000) / blockTimes[chain?.id as number])
  // console.log(blocks);
  useEffect(() => {
    dateInput.current.value = date.toISOString().substring(0, 10);
    dateInput.current.min = new Date().toISOString().substring(0, 10);
  }, [])
  return (
    <div className="div-space-between fill-width">
      <div className="div-flex-column">
        <span className="as-text-size-xs as-text-dark as-text-bold">
          Select expiration date
        </span>
        <input className="border1rem as-text-dark as-bg-light as-shadow-sm"
          type="date" ref={dateInput} onChange={(e) => { setDate(new Date(e.target.value)) }} />
      </div>
      <PinButton blocks={blocks} cid={props.cid} chainId={chain?.id as number} symbol={chain?.nativeCurrency?.symbol} />
    </div>
  )
}

export function useHosqPin(cid: string, numberOfBlocks: number, providerId: number, chain: number) {
  const fees = useHosqRead(chain, "get_total_price_for_blocks", [numberOfBlocks, providerId]);
  const write = useHosqWrite(chain, "add_new_valid_block", [cid, numberOfBlocks, providerId],
    { value: fees.data ? fees.data[0].add(fees.data[1]).toString() : "0" })
  return {
    ...write,
    fees
  }
}

export function hosqUpload(data: HosqUploadProps) {
  if (!isProviderSelected()) {
    toast.error("Hosq provider is not available");
    return
  }
  const body = new FormData();
  data.files && data.files.map((f, i) => body.append(`file${i}`, f, f.name));
  data.blobs && data.blobs.map((b, i) => body.append(`blob${i}`, b.blob, b.name));
  const url = selectedProvider.api_url.endsWith("/") ?
    selectedProvider.api_url.substring(0, selectedProvider.api_url.length - 1)
    : selectedProvider.api_url;
  axios({
    method: 'post',
    baseURL: url,
    url: data.wrapInDir ? "/upload_dir" : "/upload",
    onUploadProgress: (e) => {
      data.setProgress && data.setProgress(parseInt(`${(e.loaded / e.total) * 100}`));
    },
    data: body
  }).then((res) => {
    if (res.status === 200) data.setResponse(res.data);
    else toast.error("Failed to upload")
  })
}

export function HosqUploadFiles(props: HosqUploadFilesProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [response, setResponse] = useState<any | undefined>();
  const fileSpan: any = useRef();
  useEffect(() => {
    if (files.length === 0) return;
    let [name, size] = ["", 0];
    if (files.length === 1) { name = files[0].name, size = files[0].size }
    else {
      name = `${files.length} files`
      files.map((f) => size += f.size);
    }
    fileSpan.current.innerHTML = `${name}  <span class="as-text-bold">${(size / 1e6).toFixed(2)} MiB</span>`
    setResponse(undefined)
    hosqUpload({ files, wrapInDir: files.length > 1, setProgress, setResponse });
  }, [files])
  return (
    <div className="hosq-upload-div">
      {
        response ?
          <div className="div-flex-column fill-width">
            <a target='_blank' href={`${getGateway()}/${response.Hash}`} className="as-text-dark as-text-size-n">
              {isMobile(window.navigator).any ? `${response.Hash.substring(0, 30)}...` : response.Hash}
            </a>
            {
              props.allowPinning ?
                <HosqPin cid={response.Hash} />
                : <></>
            }
          </div>
          : <></>
      }

      <FileUploadComponent callback={setFiles} maxFiles={props.maxFiles} accept={props.accept} />

      <div className="div-space-between fill-width">
        <span ref={fileSpan} className="as-text-dark as-text-size-n">Noting selected</span>
        {
          files.length > 0 && !response ?
            <CircularProgress size="30px" thickness={10} isIndeterminate={progress === 100}
              value={progress} color="var(--as-primary)">
              <CircularProgressLabel>{progress}%</CircularProgressLabel>
            </CircularProgress>
            :
            <></>
        }
      </div>
    </div>
  )
}

export function isProviderSelected() {
  return selectedProvider !== undefined
}

export async function get(cid: string, json: boolean = false) {
  if (!isProviderSelected()) return;
  let res = await fetch(`${selectedProvider.api_url}/gateway/${cid}`);
  if (res.status !== 200) {
    console.error(res);
    // throw `Get Request From Hosq Provider ${selectedProvider.name} Failed`
    toast.error(`Failed to request data from '${selectedProvider.name}' provider`)
    return
  }
  return json ? res.json() : res
}

export function getGateway() {
  if (!isProviderSelected()) return;
  return `${selectedProvider.api_url}/gateway`
}

export function HosqProvider({ children, ...props }: HosqProviderProps) {
  const { chain, chains } = useNetwork()
  const { data, isError, isLoading } = useHosqRead(chain?.id as number, "get_provider_details", [
    props.DefaultProviderId ? props.DefaultProviderId : 1
  ]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    isError && toast.error("Failed to get Hosq provider");
    if (data) {
      // console.log("Hosq");
      selectedProvider = data;
      selectedProviderId = props.DefaultProviderId ? props.DefaultProviderId : 1;
      setReady(true);
      return
    }
    setReady(false);
  }, [data]);

  return (
    ready ? <>{children}</> : <></>
  )
}