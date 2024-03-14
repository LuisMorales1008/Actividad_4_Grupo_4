import './App.css';
import { Routes, Route } from 'react-router-dom';
import LoginMenu from './pages/Login/Login';
import Registrar from './pages/Registrar/Registrar'
import Olvidar from './pages/Olvidar/Olvidar'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginMenu />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/olvidar" element={<Olvidar />}>
      </Route>
      </Routes>
    </div>
  );
}

export default App;