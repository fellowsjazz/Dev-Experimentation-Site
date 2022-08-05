import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import {Routes, Route} from "react-router-dom";
import Home from './pages/Home';
import NFT from './pages/NFT';
import Balance from './pages/Balance';
import RinkebyInteraction from './pages/RinkebyInteraction';

import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import PokemonAxios from './pages/PokemonAxios';

//Rainbowkit Setup

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum, chain.rinkeby, chain.localhost],
  [
    alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

//App

function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={lightTheme()}>

    <div>

    <div className="nav">
      <Navbar/>
    </div>

    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/nft" element={<NFT/>}/>
      <Route path="/balance" element={<Balance/>}/>
      <Route path="/RinkebyInteraction" element={<RinkebyInteraction/>}/>
      <Route path="/PokemonAxios" element={<PokemonAxios/>}/>

    </Routes>

    </div>

    </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
