import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bulma/css/bulma.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';
import App from './App.jsx';
import {ProveedorTienda} from "./services/contexto.jsx";
createRoot(document.getElementById('root')).render(<ProveedorTienda><App /></ProveedorTienda>);
