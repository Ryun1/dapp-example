import React from "react";
import {hexToBytes} from "../../utils/utils";
import ApiCard from "./apiCard";


const GetRewardAddressesCard = ({ api, wasm, onRawResponse, onResponse, onWaiting }) => {

  const getRewardAddressesClick = () => {
    onWaiting(true);
    api?.getRewardAddresses()
      .then((hexAddresses) => {
        onWaiting(false);
        onRawResponse(hexAddresses);
        const addresses = []
        for (let i = 0; i < hexAddresses.length; i++) {
          const wasmAddress = wasm.Address.from_bytes(hexToBytes(hexAddresses[i]))
          addresses.push(wasmAddress.to_bech32())
        }
        onResponse(addresses);
      })
      .catch((e) => {
        onWaiting(false);
        onRawResponse('');
        onResponse(e);
        console.log(e);
      })
  }


  const apiProps = {
    apiName: "getRewardAddresses",
    clickFunction: getRewardAddressesClick
  }

  return (
    <ApiCard {...apiProps} />
  );
};

export default GetRewardAddressesCard;