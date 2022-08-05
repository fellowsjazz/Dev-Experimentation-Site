import { useContractWrite, usePrepareContractWrite, useContractRead, useContractEvent } from "wagmi"
import { useState } from "react"
import { useEffect } from "react";
import '../App.css'
import EventViewer from "../components/EventViewer";



export default function RinkebyInteraction(){

    const [newPurpose, setNewPurpose] = useState('');
    const [eventListen, setEventListen] = useState('')
    

    const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnerSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"msgSetter","type":"address"},{"indexed":false,"internalType":"string","name":"newMessage","type":"string"}],"name":"PurposeSet","type":"event"},{"inputs":[],"name":"getPurpose","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"purpose","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"newMessage","type":"string"}],"name":"setNewPurpose","outputs":[],"stateMutability":"nonpayable","type":"function"}]

    const contractAddress = '0x1c269f84a13EF66CC950Cd4e52952Ab9dD47b833'

    const purposeContract = useContractRead({
        addressOrName: contractAddress,
        contractInterface: contractABI,
        functionName: 'getPurpose'
    })

    const [currentMessage, setCurrentMessage] = useState(purposeContract.data)

    const {data, error, loading, write } = useContractWrite({
        mode: 'recklesslyUnprepared',
        addressOrName: contractAddress,
        contractInterface: contractABI,
        functionName: 'setNewPurpose',
        args: newPurpose
    })

    useContractEvent({
        addressOrName: contractAddress,
        contractInterface: contractABI,
        eventName: 'PurposeSet',
        listener: (event) => {
            console.log('event heard in top component');
            setCurrentMessage(event[1])
            console.log('the post event current message is: ', currentMessage)
        }
    })


/*         <div style={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems:'center', padding:10}}>
            Current Purpose: {purposeContract.data}
        <div style={{display: 'flex'}}>
            Set New Purpose:
            <input placeholder="Enter New Purpose Here" onChange={e => setNewPurpose(e.target.value)}></input>
        </div>
        <button onClick={() => write()}>Set Purpose</button>
        </div>

        */

    return (
        <div>
        <div className="purpose-div" style={{border: '3px solid black', padding:5, borderRadius:25}}>
            <h2>a simple contract interaction</h2>
            <p>This component allows you to set the "purpose" variable</p>
            <p>of a smart contract on the rinkeby test network.</p>
            <p style={{marginTop:10}}>This is the contract address:</p>
            <a href="https://rinkeby.etherscan.io/address/0x1c269f84a13EF66CC950Cd4e52952Ab9dD47b833">0x1c269f84a13EF66CC950Cd4e52952Ab9dD47b833</a>
            <h3>This is the current value of the purpose variable: </h3>
            <h4 style={{marginTop:-10, border: '1px solid black', borderRadius:10, color:'red', padding:5}}>{currentMessage}</h4>
            <p>But if you have some rinkeby eth to pay for gas, you can change the purpose below!</p>
            <input style={{margin: '10px', fontSize: 20}} placeholder="Enter New Purpose Here" 
            onChange={e => setNewPurpose(e.target.value)}></input>
            <button onClick={() => write()}>Set Purpose</button>
        </div>
        
        <div>
            <EventViewer contractAddress={contractAddress} contractABI={contractABI}/>
        </div>


        </div>
    )
}