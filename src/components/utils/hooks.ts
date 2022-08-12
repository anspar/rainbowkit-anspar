import { CallOverrides } from "ethers";
import { useMediaQuery } from "react-responsive";
import { useContractRead, useContractWrite } from "wagmi"
import ans_abis from "./abis/ans_abis.json";
import hosq_abis from "./abis/hosq_abis.json";

const useANSWrite = (chainId: number, functionName: string, args: any[], overrides?: CallOverrides) => {
    return useContractWrite({
        addressOrName: ans_abis.ans.networks[`${chainId}`],
        contractInterface: ans_abis.ans.abi,
        functionName,
        args,
        chainId,
        overrides
    })
}

const useANS1155Write = (chainId: number, functionName: string, args: any[], overrides?: CallOverrides) => {
    return useContractWrite({
        addressOrName: ans_abis.a1155.networks[`${chainId}`],
        contractInterface: ans_abis.a1155.abi,
        functionName,
        args,
        chainId,
        overrides
    })
}

const useHosqWrite = (chainId: number, functionName: string, args: any[], overrides?: CallOverrides) => {
    return useContractWrite({
        addressOrName: hosq_abis.hosq.networks[`${chainId}`],
        contractInterface: hosq_abis.hosq.abi,
        functionName,
        args,
        chainId,
        overrides
    })
}

const useANSRead = (chainId: number, functionName: string, args: any[]) => {
    return useContractRead({
        addressOrName: ans_abis.ans.networks[`${chainId}`],
        contractInterface: ans_abis.ans.abi,
        functionName,
        args,
        chainId
    })
}

const useANS1155Read = (chainId: number, functionName: string, args: any[]) => {
    return useContractRead({
        addressOrName: ans_abis.a1155.networks[`${chainId}`],
        contractInterface: ans_abis.a1155.abi,
        functionName,
        args,
        chainId
    })
}

const useHosqRead = (chainId: number, functionName: string, args: any[]) => {
    return useContractRead({
        addressOrName: hosq_abis.hosq.networks[`${chainId}`],
        contractInterface: hosq_abis.hosq.abi,
        functionName,
        args,
        chainId
    })
}

const useIsMobile=()=>{
    return useMediaQuery({ maxWidth: 767 });
}

export { useANS1155Read, useANS1155Write, useHosqRead, useHosqWrite, useANSRead, useANSWrite, useIsMobile }