import React from 'react';
import styles from './Login.module.css' ;
import { useNavigate } from 'react-router-dom';

const LoginMenu = () => {
  const navigate = useNavigate();
    return (
      <div>
        <center>
          <form className={styles.form}>
          <img src="https://plataformacii.ingenieria.usac.edu.gt/images/logo_fi.png" alt="Logo" style={{ width: '500px', height: '120px' }}/>
            <h1><label className={styles.label}>Inicio de Sesión Ingeniera USAC</label></h1>
            <input type="text" placeholder="CUI/Registro Academico/Registro Personal" className={styles.input}/><br/>
            <input type="password" placeholder="Contraseña" className={styles.input}/><br/>
            <button type="submit" className={styles.boton} onClick={() => navigate('/layout/inicio')}>Iniciar Sesión</button><br/>
            <button type="submit" className={styles.boton} onClick={() => navigate('/registrar')}>Registrarse</button><br/>
            <button type="submit" className={styles.boton} onClick={() => navigate('/olvidar')}>Olvide mi Contraseña</button>
          </form>
        </center>
      </div>
    );
  };
  
  export default LoginMenu;