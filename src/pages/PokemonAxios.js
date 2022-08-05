import React, {useState, useEffect} from "react";
import PokemonList from "../components/PokemonList";
import axios from "axios";
import Pagination from "../components/Pagination";


export default function PokemonAxios(){

    const [pokemon, setPokemon] = useState([]);
    const [currentPageUrl, setCurrentPageUrl] = useState('https://pokeapi.co/api/v2/pokemon')
    const [nextPageUrl, setNextPageUrl] = useState()
    const [prevPageUrl, setPrevPageUrl] = useState()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true)
        let cancel
        axios.get(currentPageUrl, {
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setLoading(false)
            setNextPageUrl(res.data.next)
            setPrevPageUrl(res.data.previous)
            setPokemon(res.data.results.map(p => p.name))
        })

        return () => {
            cancel()
        }
    },[currentPageUrl])


    useEffect(()=>{

    })



    function goToNextPage() {
        setCurrentPageUrl(nextPageUrl)
    }

    function goToPrevPage(){
        setCurrentPageUrl(prevPageUrl)
    }



    if (loading) return "Loading...";

    return (
    <div className="purpose-div">
    
    
<PokemonList pokemon={pokemon}/>
<Pagination goToNextPage={nextPageUrl ? goToNextPage : null} goToPrevPage={prevPageUrl ? goToPrevPage : null}/>


    </div>
    
    )
}