import React, {useState} from 'react'
import {bytesToHex, hexToBytes, wasmMultiassetToJSONs} from '../../utils/utils'
import ApiCardWithModal from './apiCardWithModal'

const GetCollateralUtxosCard = ({api, wasm, onRawResponse, onResponse, onWaiting}) => {
  const [getCollateralUtxosInput, setGetCollateralUtxosInput] = useState(2000000)

  const getCollateralUtxosClick = () => {
    onWaiting(true)
    api
      ?.getCollateral(getCollateralUtxosInput)
      .then((hexUtxos) => {
        onWaiting(false)
        onRawResponse(hexUtxos)
        let utxos = []
        for (let i = 0; i < hexUtxos.length; i++) {
          const utxo = {}
          const wasmUtxo = wasm.TransactionUnspentOutput.from_bytes(hexToBytes(hexUtxos[i]))
          const output = wasmUtxo.output()
          const input = wasmUtxo.input()
          utxo.tx_hash = bytesToHex(input.transaction_id().to_bytes())
          utxo.tx_index = input.index()
          utxo.receiver = output.address().to_bech32()
          utxo.amount = output.amount().coin().to_str()
          utxo.asset = wasmMultiassetToJSONs(output.amount().multiasset())
          utxos.push(utxo)
        }
        onResponse(utxos)
      })
      .catch((e) => {
        onWaiting(false)
        onRawResponse('')
        onResponse(e)
        console.log(e)
      })
  }

  const apiProps = {
    buttonLabel: 'getCollateral',
    clickFunction: getCollateralUtxosClick,
  }

  return (
    <ApiCardWithModal {...apiProps}>
      <div className="px-4 pb-3">
        <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-300">
          Amount
        </label>
        <input
          type="number"
          min="0"
          id="amount"
          className="appearance-none border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          placeholder="2000000"
          value={getCollateralUtxosInput}
          onChange={(event) => setGetCollateralUtxosInput(Number(event.target.value))}
        />
      </div>
    </ApiCardWithModal>
  )
}

export default GetCollateralUtxosCard
