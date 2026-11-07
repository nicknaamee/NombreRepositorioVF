import React from 'react';
export default function Entrada({multilinea=false,...props}) {return multilinea ? <textarea className="textarea" {...props}/> : <input className="input" {...props}/>;}
