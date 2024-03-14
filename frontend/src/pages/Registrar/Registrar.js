import React from 'react';
import styles from './Registrar.module.css'
import { useNavigate } from 'react-router-dom';

const Registrar = () => {
  const navigate = useNavigate();
  return (
    <div>
      <center><form className={styles.form}>
        <label className={styles.label}><h1>Registro de Usuario</h1></label>
        <input type="text" placeholder="Registro Académico" className={styles.input}/><br/>
        <input type="text" placeholder="Nombres" className={styles.input}/><br/>
        <input type="text" placeholder="Apellidos" className={styles.input}/><br/>
        <input type="password" placeholder="Contraseña" className={styles.input}/><br/>
        <input type="email" placeholder="Correo Electrónico" className={styles.input}/><br/>
        <button type="submit" className={styles.boton}>Registrarse</button><br/>
        <button type="submit" className={styles.boton} onClick={() => navigate('/')}>Regresar</button>
      </form></center>
    </div>
  );
};

export default Registrar;