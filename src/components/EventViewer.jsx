import { useEffect, useState } from 'react'
import {useContractEvent} from 'wagmi'
import RinkebyInteraction from '../pages/RinkebyInteraction'
import '../App.css'

export default function EventViewer({contractAddress, contractABI}){
    const [changer, setChanger] = useState("No Changes Yet");
    const [message, setMessage] = useState("No New Purpose Yet");

   useContractEvent({
        addressOrName: contractAddress,
        contractInterface: contractABI,
        eventName: 'PurposeSet',
        listener: (event) => {
            console.log("New event has arrived: ", event);
            setChanger(event[0]);
            setMessage(event[1]);
        }
    })

    useEffect(()=>{

    },[changer, message])

    

    const EventList = () => {

        const caughtEvents = []; //first element is address, second is message
        const sampleArray = [
            ['address1', 'message1'],
            ['address2', 'message2'],
            ['address3', 'message3'],
            ['address4', 'message4'],
            ['address5', 'message5']
        ]


        //this isn't working right yet, still adds multiple events to caught arrays, having trouble rendering list of events, placeholder sampleArray instead
        useContractEvent({
            addressOrName: contractAddress,
            contractInterface: contractABI,
            eventName: 'PurposeSet',
            listener: (event) => {
                console.log("Event hit the list catcher: ", event);
                if(caughtEvents.includes([event[0],event[1]])) {
                    console.log('received same event multiple times, caughtEvents is unchanged');
                } else {
                caughtEvents.push([event[0],event[1]]);
                console.log("Caught events array: ", caughtEvents);
            }
            }
        })

        const getNthElement = (arr, n) => {
            return arr[n];
        }

        console.log("sampleArray:", sampleArray)
        console.log("caughtEvents:", caughtEvents)

        return(
            <div>
                
                
                    {sampleArray.map(arrayID => 
                    <div>
                        Address: {getNthElement(arrayID,0)} Message Set: {getNthElement(arrayID,1)}
                    </div>)}

                    

                
            </div>
        )
    }

    return(
        <div className="purpose-div">
        
        <div className='horizontal-titles'>
        <h2>Events 👀 </h2>
        <p><b>Last Changer: </b>{changer}</p>
        <p><b>Last Message: </b>{message}</p>
        </div>
        <div><b>Recent Events:</b></div>
        <EventList/>
        </div>

    )
}

///// The next thing to do is to learn how to read multiple events
// and display them as a list with all that info over time
//this might be conditional rendering? or adding items to an array and making the render map over them?
//could also spend some time on react router dom