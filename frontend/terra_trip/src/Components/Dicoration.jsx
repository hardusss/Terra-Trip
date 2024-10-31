import React from 'react';
import '../styles/dicor.css'; 
import City from '../img/icons/city.jpg'
import Man from '../img/icons/man.jpg'
import Road from '../img/icons/road.jpg'

const Dicoration = () => {
    return (
        <div className='dicor'>
           <img alt="logo"src={City} id="city" />
           <img alt="logo"src={Man} id="man" />
           <img alt="logo"src={Road} id="road" />
        </div>
    )
}

export default Dicoration;