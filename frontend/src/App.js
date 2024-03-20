import './App.css';
import { Routes, Route } from 'react-router-dom';
import LoginMenu from './pages/Login/Login';
import Registrar from './pages/Registrar/Registrar'
import Olvidar from './pages/Olvidar/Olvidar'
import Layout from './pages/Layout/Layout';
import Inicio from './pages/Inicio/Inicio';
import Publicacion from './pages/Publicacion/Publicacion';
import Perfil from './pages/Perfil/Perfil';
import Buscar from './pages/Buscar/Buscar';
import Cursos from './pages/Cursos/Cursos';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginMenu />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/olvidar" element={<Olvidar />} />
        <Route path="/layout" element={<Layout />}>
          <Route path='inicio' element={<Inicio />} />
          <Route path="publicacion" element={<Publicacion />} />
          <Route path='perfil' element={<Perfil />} />
          <Route path='buscar' element={<Buscar />} />
          <Route path='cursos' element={<Cursos />} >
        </Route>
      </Route>
      </Routes>
    </div>
  );
}

export default App;