import React, { useState } from 'react';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const LoginMenu = () => {
  const [carnet, setCarnet] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();

  const iniciarSesion = async () => {
  if (!carnet || !contrasena) {
    alert('¡Campos incompletos! Por favor, complete todos los campos.');
    return;
  }

  const url = 'http://localhost:5000/iniciarSesion';

  try {
    const response = await axios.post(url, {
      carnet,
      contrasena
    });

    const { mensaje, usuario } = response.data;

    if (mensaje === 'Ingresó un Usuario') {
      navigate('/layout/inicio');
      alert('¡Bienvenido Estudiante!');
    } else {
      alert('Error: ' + mensaje);
    }
  } catch (error) {
    console.error('Ocurrió un error:', error);
    alert('Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.');
  }
};

  return (
    <div>
      <center>
        <form className={styles.form}>
          <img src="https://plataformacii.ingenieria.usac.edu.gt/images/logo_fi.png" alt="Logo" style={{ width: '500px', height: '120px' }} />
          <h1><label className={styles.label}>Inicio de Sesión Ingeniería USAC</label></h1>
          <input type="text" value={carnet} onChange={(e) => setCarnet(e.target.value)} placeholder="CUI/Registro Académico/Registro Personal" className={styles.input} /><br />
          <input type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} placeholder="Contraseña" className={styles.input} /><br />
          <button type="button" className={styles.boton} onClick={iniciarSesion}>Iniciar Sesión</button><br />
          <button type="button" className={styles.boton} onClick={() => navigate('/registrar')}>Registrarse</button><br />
          <button type="button" className={styles.boton} onClick={() => navigate('/olvidar')}>Olvidé mi Contraseña</button>
        </form>
      </center>
    </div>
  );
};

export default LoginMenu;