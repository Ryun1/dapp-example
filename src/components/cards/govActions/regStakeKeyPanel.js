import React, {useState} from 'react'
import InputWithLabel from '../../inputWithLabel'
import GovToolsPanel from '../govToolsPanel'
import {protocolParams} from '../../../utils/networkConfig'
import { getCertOfNewStakeReg, getStakeKeyRegCert, getStakeKeyRegCertWithCoin } from '../../../utils/cslTools'

const RegisterStakeKeyPanel = (props) => {
  const {wasm, onWaiting, onError, getters, setters, handleInputCreds} = props

  const {getCertBuilder} = getters
  const {handleAddingCertInTx} = setters

  const [stakeKeyHash, setStakeKeyHash] = useState('')
  const [stakeDepositAmount, setStakeDepositAmount] = useState(protocolParams.keyDeposit)
  const [useConway, setUseConway] = useState(false)

  const handleUseConwayCert = () => {
    setUseConway(!useConway)
    console.debug(`[dApp][RegisterStakeKeyPanel] use Conway Stake Registration Certificate is set: ${!useConway}`)
  }

  const buildRegStakeKey = () => {
    onWaiting(true)
    const certBuilder = getCertBuilder(wasm)
    try {
        // building StakeKeyRegCert
        const stakeCred = handleInputCreds(stakeKeyHash)
        let stakeKeyRegCert
        if (useConway){
            stakeKeyRegCert = getStakeKeyRegCertWithCoin(wasm, stakeCred, stakeDepositAmount)
        } else {
            stakeKeyRegCert = getStakeKeyRegCert(wasm, stakeCred)
        }
        certBuilder.add(getCertOfNewStakeReg(wasm, stakeKeyRegCert))
        handleAddingCertInTx(certBuilder)
        onWaiting(false)
    } catch (error) {
      console.error(error)
      onWaiting(false)
      onError()
    }
  }

  const panelProps = {
    buttonName: 'Build Cert',
    certLabel: 'regStakeKey',
    clickFunction: buildRegStakeKey,
  }

  return (
    <GovToolsPanel {...panelProps}>
      <div className="text-l tracking-tight text-gray-300 mt-5">
        <div>
          <input
            type="checkbox"
            id="useNewConwayStakeRegCert"
            name="useNewConwayStakeRegCert"
            checked={useConway}
            onChange={handleUseConwayCert}
          />
          <label htmlFor="isMoreThenOneNFT" className="font-bold">
            <span /> Use the new Conway Stake Registration Certificate (with coin)
          </label>
        </div>
      </div>
      <InputWithLabel
        inputName="Stake Key Hash"
        inputValue={stakeKeyHash}
        onChangeFunction={(event) => {
          setStakeKeyHash(event.target.value)
        }}
      />
      <InputWithLabel
        inputName="Stake Key Deposit Amount (lovelaces, this should align with current protocol parameters)"
        inputValue={stakeDepositAmount}
        onChangeFunction={(event) => {
          setStakeDepositAmount(event.target.value)
        }}
      />
    </GovToolsPanel>
  )
}

export default RegisterStakeKeyPanel
