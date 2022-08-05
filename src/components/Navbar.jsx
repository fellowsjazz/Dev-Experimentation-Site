import {Link, useMatch, useResolvedPath} from 'react-router-dom'
import "../App.css"
import {ConnectButton} from '@rainbow-me/rainbowkit'

export default function Navbar(){
    return(
        <nav className='nav'>
            <Link to="/" className='site-title'>Russ's Dev Site</Link>
            <ul className='navbar'>
                <CustomLink to="/NFT">View NFT</CustomLink>
                <CustomLink to="/balance">View Balance</CustomLink>
                <CustomLink to="/RinkebyInteraction">Set Purpose</CustomLink>
                <CustomLink to="/PokemonAxios">Pokemon Axios</CustomLink>
            </ul>
            <ConnectButton/>
        </nav>


    )
}

function CustomLink({to, children}){
    const resolvedPath = useResolvedPath(to)

    return(
        <li className='nav-item'>
            <Link to={to} className='nav-item'>{children}</Link>
        </li>

    )
}