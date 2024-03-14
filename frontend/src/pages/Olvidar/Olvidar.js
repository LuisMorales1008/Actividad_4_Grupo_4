import React from 'react';
import styles from './Olvidar.module.css'
import { useNavigate } from 'react-router-dom';

const Olvidar = () => {
    const navigate = useNavigate();
  return (
    <div>
      <center><form className={styles.form}>
        <label className={styles.label}><h1>Olvide mi Contraseña</h1></label>
        <input type="text" placeholder="Registro Académico" className={styles.input}/><br/>
        <input type="text" placeholder="Correo Electronico" className={styles.input}/><br/>
        <button type="submit" className={styles.boton}>Restablecer Contraseña</button><br/>
        <button type="submit" className={styles.boton} onClick={() => navigate('/')}>Regresar</button>
      </form></center>
    </div>
  );
};

export default Olvidar;