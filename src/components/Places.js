import React from 'react';


import usePlacesAutocomplete,{getGeocode,getLatLng} from 'use-places-autocomplete';
import {Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
    ComboboxOptionText} from '@reach/combobox';
    import "@reach/combobox/styles.css";
// const PlacesProps={
//     setOffice:(position: window.google.maps.LatLngLiteral),
// };
const Places=({setOffice})=>{
    const {ready,value,setValue,suggestions:{status,data},clearSuggestions,}=usePlacesAutocomplete();
  
//   console.log({status,data});
const handleSelect=async(val)=>{
setValue(val,false);
clearSuggestions();
const results=await getGeocode({address:val});
const {lat,lng}=await getLatLng(results[0]);
setOffice({lat,lng});
};
    return (
        <Combobox onSelect={handleSelect}>
            <ComboboxInput value={value}
                onChange={e => setValue(e.target.value)}
                disabled={!ready} className='combobox-input'
                placeholder='Search an address' />
            <ComboboxPopover>
                <ComboboxList>

                    {status === 'OK' && data.map(({ place_id, description }) => <ComboboxOption key={place_id} value={description} ><ComboboxOptionText /></ComboboxOption>)}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    )
}
export default Places;