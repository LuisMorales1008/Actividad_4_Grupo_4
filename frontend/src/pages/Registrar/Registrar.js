import React, { useState } from 'react';
import styles from './Registrar.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Registrar = () => {
  const navigate = useNavigate();
  const [carnet, setCarnet] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [correo, setCorreo] = useState('');

  const guardarEstudiantes = async () => {
    if (contrasena.length < 4) { // Validar que la contraseña tenga al menos 4 caracteres
        alert('La contraseña debe tener al menos 4 caracteres');
        return;
    }

    const url = 'http://localhost:5000/crearEstudiante';

    try {
        const response = await axios.post(url, {
            carnet,
            nombre,
            apellido,
            contrasena,
            correo,
        });
        const mensaje = response.data.mensaje;

        if (mensaje.includes('Ya existe :(')) {
            alert(mensaje); // Esta alerta muestra si el usuario ya existe
        } else {
            console.log(mensaje);
            alert('Usuario agregado exitosamente');
            borrarCampos();
        }
    } catch (error) {
        console.error('Ocurrió un error:', error);
        alert('¡Ocurrió un error al guardar el usuario! Por favor, inténtalo de nuevo.');
    }
};

const borrarCampos = () => {
  setCarnet('');
  setNombre('');
  setApellido('');
  setContrasena('');
  setCorreo('');
};

  return (
    <div>
      <center>
        <form className={styles.form}>
          <img src="https://plataformacii.ingenieria.usac.edu.gt/images/logo_fi.png" alt="Logo" style={{ width: '400px', height: '100px' }} />
          <label className={styles.label}><h1>Registro de Usuario</h1></label>
          <input type="text" value={carnet} onChange={(e) => setCarnet(e.target.value)} placeholder="Registro Académico" className={styles.input}/><br/>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombres" className={styles.input}/><br/>
          <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Apellidos" className={styles.input}/><br/>
          <input type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} placeholder="Contraseña" className={styles.input}/><br/>
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Correo Electrónico" className={styles.input}/><br/>
          <button type="button" onClick={guardarEstudiantes} className={styles.boton}>Registrarse</button><br/>
          <button type="button" onClick={borrarCampos} className={styles.boton}>Borrar Campos</button><br/>
          <button type="button" onClick={() => navigate('/')} className={styles.boton}>Regresar</button>
        </form>
      </center>
    </div>
  );
};

export default Registrar;