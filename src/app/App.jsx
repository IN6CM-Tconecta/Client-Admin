import { AppRoutes } from "./router/AppRoutes.jsx";
import { Toaster } from 'react-hot-toast';

/*
  App.jsx: Este es el componente raíz de la aplicación. 
  Aquí se configuran los proveedores de contexto, 
  el enrutamiento y otros componentes globales como el Toaster para notificaciones. 
  El componente App es responsable de renderizar la estructura principal de 
  la aplicación y proporcionar un punto de entrada para el enrutamiento a través de AppRoutes.
*/
function App() {
  return(
    <>
      <Toaster
      position="top-center"
      toastOptions={{
        style: {
          fontFamily:"inherit",
          fontWeight: 600,
          fontSize: "1rem",
          borderRadius: "8px",
          }
      }}
      />

      <AppRoutes />
    </>
  );
}

export default App;