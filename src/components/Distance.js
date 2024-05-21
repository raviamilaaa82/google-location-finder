import React from 'react';
const Distance=(props)=>{
    // console.log("inside distance");
    // console.log(props.leg.start_address);
    return (
        <div style={{color:'white'}}>
            {/* Distance:  {props.leg.distance.text} */}
        {/* {props.leg.duration} */}
        {/* <p>Duration:{props.leg.duration.text}</p>
        <p>Destination:{props.leg.start_address}</p> */}
        <ul className='dur-dis-list'>
        <li>Distance:{props.leg.distance.text}</li>
            <li>Duration:{props.leg.duration.text}</li>
            <li>Destination:{props.leg.start_address}</li>
        </ul>
        </div>
       
    )
}
export default Distance;