import axios from 'axios'
import React from 'react'
import { nftContract, key, displayAmount, mainnet, } from '../n2dpuller/settings';
import NFTCollection from '../n2dpuller/NFTCollection';
import { useState } from 'react';
import { useProvider, useContract, useContractRead, useEnsName } from 'wagmi'
import { useEffect } from 'react';

export default function CustomNftViewer() {


    const [nftArray, setNftArray] = useState([])
    const [uri, setUri] = useState()
    const [metaData, setMetaData] = useState()
    const [nftImage, setNftImage] = useState()
    const [nftObject, setNftObject] = useState({})
    const [nftOwner, setNftOwner] = useState('')
    const [isEns, setIsEns] = useState(false)
    const [tokenID, setTokenID] = useState(598)
    const [nextTokenID, setNextTokenID] = useState()


    const owner = useContractRead({
        addressOrName: nftContract,
        contractInterface: NFTCollection,
        functionName: 'ownerOf',
        args: tokenID,
        onSuccess(data){
            console.log("got owner: ", data)
            setNftOwner(data)

        }
    })
//set ens once nftOwner has been retrieved

const ens = useEnsName({
    address: nftOwner,
    onSuccess(data){
        console.log("Got Ens: ", data)
        setIsEns(true)
    },
    onError(error){
        console.log("error: ", error)
        setIsEns(false)
    }
})



    useEffect(()=>{
        console.log("ENS: ", ens)
    },[nftOwner])


    const rawURI = useContractRead({
        addressOrName: nftContract,
        contractInterface: NFTCollection,
        functionName: 'tokenURI',
        args: tokenID,
        onSuccess(data){
            console.log("got tokenURI: ", data)
            setUri(data.replace('ipfs://', 'https://ipfs.io/ipfs/'))
        }
    })

    useEffect(() => {
        console.log('cleaned uri: ', uri)
        axios.get(uri).then(value => 
            {setMetaData(value);
            setNftImage(value.data.image.replace('ipfs://', 'https://ipfs.io/ipfs/'))
            setNftObject({
                name: value.data.name,
                desc: value.data.description,
                player: value.data.animation_url.replace('ipfs://', 'https://ipfs.io/ipfs/'),
                image: value.data.image.replace('ipfs://', 'https://ipfs.io/ipfs/'),

            })
            }) 
    },[uri])


    useEffect(() => {
        console.log("metadata retrieved: ", metaData)
    },[metaData])

    useEffect(() => {
        console.log("cleaned image link retrieved: ", nftImage)
    },[nftImage])

    useEffect(() => {
        console.log("NftObject retrieved: ", nftObject)
    },[nftObject])

    const ensCheck = () => {
        if (ens.data != null) {
            console.log('ens: ', ens.data);
            return <p>Current Owner: {ens.data}</p>
            
        } else {
            console.log('no ens', nftOwner);
            return <p>Current Owner: {nftOwner}</p>
        }
    }

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', border: "1px solid black"}}>
      <img src={nftObject.image} style={{maxWidth:'25%'}}/>
      <audio controls name="media" src={nftObject.player} >
        Browser Doesn't Support Audio
      </audio>
      <p>{nftObject.name}</p>
      <p>{nftObject.desc}</p>
      {ensCheck()}
      <div>
      <input placeholder='enter token ID' onChange={e => setNextTokenID(e.target.value)}></input>
      <button onClick={() => setTokenID(nextTokenID)}> Submit </button>
      </div>
    </div>
  )
}
