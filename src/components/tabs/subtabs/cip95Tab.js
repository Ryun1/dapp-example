import React, {useState} from 'react'
import useYoroi from '../../../hooks/yoroiProvider'
import ResponsesPart from './responsesPart'
import {CONNECTED} from '../../../utils/connectionStates'
import Cip95OfficialPart from './cip95OfficialPart'

const Cip95Tab = () => {
  const {api, connectionState} = useYoroi()
  const [currentText, setCurrentText] = useState('')
  const [rawCurrentText, setRawCurrentText] = useState('')
  const [waiterState, setWaiterState] = useState(false)

  const setResponse = (response, stringifyIt = true) => {
    setCurrentText(stringifyIt ? JSON.stringify(response, undefined, 2) : response)
  }

  return (
    <div className="py-5 px-5 text-gray-300">
      {connectionState === CONNECTED ? (
        <div>
          <div className="mb-3">
            <Cip95OfficialPart
              api={api}
              setRawCurrentText={setRawCurrentText}
              setResponse={setResponse}
              setWaiterState={setWaiterState}
            />
          </div>
          <div>
            <ResponsesPart rawCurrentText={rawCurrentText} currentText={currentText} currentWaiterState={waiterState} />
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default Cip95Tab
