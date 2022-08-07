import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import React from "react";
import axios from 'axios';
import NFTCollection from './NFTCollection.json';
import { Card, Container, Text, Grid, Button, Image } from '@nextui-org/react';
import { nftContract, key, displayAmount, mainnet } from './settings';


export default function NftPuller() {
  const [nfts, setNfts] = useState([])   // This creates the nft state
  const [loadingState, setLoadingState] = useState('not-loaded') //check for loading for rendering?
  useEffect(() => {
    generateNft();      // every time setNFTs is called? or maybe value changed, because it's in the dependncy array for useEffect
    }, [setNfts])
    
    async function refreshPage() {
        window.location.reload();   //browser reload function
    }
    async function generateNft() {      // this is the main function 
      const provider = new ethers.providers.JsonRpcProvider(mainnet)
      const wallet = new ethers.Wallet(key, provider);
      const contract = new ethers.Contract(nftContract, NFTCollection, wallet); //this and above lines are setting ethers context for providers/ signer(wallet)
      const itemArray = [];
      contract.totalSupply().then(result => {  //calls the totalSupply function on the nftContract, which returns a promise. 
        let totalSup = parseInt(result, 16)    //creates a variable called totalSup that gives total supply result as an integer (converter from string?)
  
        /*
        Replace "displayAmount" with "totalSup"
        below if you want to display all NFTs 
        in the collection BUT BE CAREFUL, it will render
        every nft image and possibly freeze your server/browser!!
        */
        for (let i = 99; i < displayAmount + 99; i++) {  //runs this block until it reaches displayAmount  
          //^^^ This is where you could change which tokenIDs are rendered. could start i at 100, and as a result render starting at id 100



          // ***I NEED TO UNDERSTAND JAVASCRIPT PROMISES BETTER.  ASYNC AWAIT, VS PROMISE.RESOLVE/ .THEN ******
          // I think this project could be built under the ASYNC AWAIT style.  likely two different ways of handling promise based javascript

          var token = i + 1                        // creates a token variable for each run through, relative to loop count. THIS IS THE TOKEN ID
          const owner = contract.ownerOf(token)    // gets owner of this token ID - since this is promise (querying chain), it's later resolved with Promise.resolve(owner)
          const rawUri = contract.tokenURI(token)  // gets the token URI (this is found in ERC721Metadata) also a promise
          const Uri = Promise.resolve(rawUri)      // resolution of rawUri promise. sets retrieved value to new const
          const getUri = Uri.then(value => {       
            let str = value                         // takes uri response and pushes it into this block as "value"
            let cleanUri = str.replace('ipfs://', 'https://ipfs.io/ipfs/')  // alters the value retrieved from tokenURI() so that it will actualy return an API end point
            let metadata = axios.get(cleanUri).catch(function (error) { //use axios to grab that end point, and bring it into our project under the metadata variable
              console.log(error.toJSON());  // the axios.get function searches for the API end point at that the cleanURI address.   .catch is the erro handler
            });
            return metadata;  // returns metadata, and stores it in the getUri const
          })
          getUri.then(value => {
            let rawImg = value.data.image  //grabs the image property from the tokenURI endpoint
            var name = value.data.name    //grabs name property from endpoint
            var desc = value.data.description   //grabs description from endpoint
            let image = rawImg.replace('ipfs://', 'https://ipfs.io/ipfs/') //reformats the rawImage IPFS hash, so that it is actually an image
            Promise.resolve(owner).then(value => { //resolution of owner promise (line 42)
              let ownerW = value; // sets new ownerW variable to the value of the resolved owner promise
              let meta = {    //creates new object with these properties, retrieved from the end point
                name: name,
                img: image,
                tokenId: token,
                wallet: ownerW,
                desc,
              }
              console.log(meta)
              itemArray.push(meta)
            })
          })
        }
      })
      await new Promise(r => setTimeout(r, 5000));
      setNfts(itemArray)
      setLoadingState('loaded');
    }

if (loadingState === 'loaded' && !nfts.length)

    return (
      <div >
        {
        nfts.map((nft, i) => {
          <div>
          <Card.Image src={nft.img} key={i}/>
        <h2>No Collections Retrieved</h2>
        </div>
})}
      </div>
    )
    return (
      <Container md>
        <Text h1 css={{marginLeft:'$10'}} size={'40px'}>NFT Collection</Text>
        <Button css={{marginLeft: '$10'}} onPress={refreshPage}>Refresh NFTs</Button>
      <Grid.Container gap={3}>
        {nfts.map((nft, i) => {
            return (
              <Grid >
                <a>
                  <Card isHoverable key={i} css={{ mw: "270px", marginRight: '$1', boxShadow:'0px 2px 12px #000000' }} variant="bordered">
                    <Card.Image src={nft.img} />
                    <Card.Body md css={{background:"$gradient"}}>
                    <Text css={{color:'$white'}} h2>{nft.name}</Text>
                    <Text h3 css={{color:'$white'}}>NFT ID: {nft.tokenId}</Text>
                    <Text css={{color:'$white'}}>{nft.desc}</Text>
                    </Card.Body>
                  </Card>
                </a>
              </Grid>
            )
          })}
      </Grid.Container>
    </Container>
    )
}
