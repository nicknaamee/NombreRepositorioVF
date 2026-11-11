import React from "react";
import { createRoot } from "react-dom/client";
import "bulma/css/bulma.min.css";
import "./styles/style.css";
import App from "./App.jsx";
import { ProveedorTienda } from "./context/TiendaContext.jsx";
createRoot(document.getElementById("root")).render(
  <ProveedorTienda>
    <App />
  </ProveedorTienda>,
);
