import { useState } from 'react'
import './login.css'

let namespace = RNamespace(7);

function RNamespace(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    
    // Loop to generate characters for the specified length
    for (let i = 0; i < length; i++) {
        const randomInd = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomInd);
    }
    return result;
}


function DocInit () {
return (
<>    
    <div>
    <nav className={'navblack'}>
        <img src="/images/Logo.svg" alt="NAMESPACES" height="39px" width="220px"/>
    </nav>

    <div className={'container'}>
        <div className="menutextlarge">The message is clear. <br/> No names. Only <i>spaces</i>.</div>
        <div className="namespace">Use namespace :{namespace}:</div>
        <div className="menutext">Already have a namespace? <span className="namespace">Log in.</span></div>
        <div className="menutextsmall" style={{"margin-top":"100px"}}>Made for private usage by KNTTK.<br/> © Komarridze 2025</div>
    </div>
    </div>
    

</>
)
}

export default DocInit;
