import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from "@material-tailwind/react";
import { BrowserRouter } from "react-router-dom";

import './../styles/index.css'
import App from './App.jsx'

/*
  main.jsx: Este es el punto de entrada de la aplicación. 
  Aquí se renderiza el componente raíz (App) dentro de un ThemeProvider 
  para proporcionar estilos y un BrowserRouter para manejar el enrutamiento. 
  El StrictMode se utiliza para activar verificaciones adicionales durante el desarrollo, 
  lo que ayuda a identificar problemas potenciales en la aplicación. 
  En resumen, main.jsx es responsable de configurar el entorno de la aplicación y 
  renderizar el componente principal.
*/
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
