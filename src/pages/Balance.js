import {useAccount, useBalance} from 'wagmi' 

export default function Balance(){

const userAddress = useAccount()
const balance = useBalance({addressOrName: userAddress.address})

    return <h1>Balance for {userAddress.address} is {balance.data?.formatted}</h1>
}