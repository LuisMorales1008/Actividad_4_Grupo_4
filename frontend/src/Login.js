import React from 'react';
import './Login.css';

const LoginMenu = () => {
    return (
      <div>
        <center><img src="https://plataformacii.ingenieria.usac.edu.gt/images/logo_fi.png" alt="Logo" style={{ width: '400px', height: '100px' }}/></center>
        <center><h2>Inicio de Sesión Ingeniera USAC</h2></center>
        <center><form>
          <div>
            <input type="text" id="username" placeholder='CUI/Registro Academico/Registro Personal'/>
          </div>
          <div>
            <input type="password" id="password" placeholder='Contraseña'/>
          </div>
          <button type="submit">Iniciar Sesión</button>
        </form></center>
      </div>
    );
  };
  
  export default LoginMenu;