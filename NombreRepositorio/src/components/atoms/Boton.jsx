import React from 'react';
export default function Boton({children,className='',...props}) {return <button className={`button ${className}`} {...props}>{children}</button>;}
