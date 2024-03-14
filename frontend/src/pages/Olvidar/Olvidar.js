import React, { useState } from 'react';
import axios from 'axios';
import styles from './Olvidar.module.css';
import { useNavigate } from 'react-router-dom';

const Olvidar = () => {
  const navigate = useNavigate();
  const [carnet, setCarnet] = useState('');
  const [correo, setCorreo] = useState('');
  const [validacionCorrecta, setValidacionCorrecta] = useState(false);
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');

  const validarDatos = async () => {
    // Verificar si los campos están vacíos
    if (!carnet || !correo) {
      alert('Por favor, completa todos los campos.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/validarDatos', { carnet, correo });
      if (response.data.valido) {
        setValidacionCorrecta(true);
      } else {
        alert('Los datos proporcionados son incorrectos. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al validar los datos:', error);
      alert('Ocurrió un error al validar los datos. Por favor, inténtalo de nuevo.');
    }
  };

  const cargarUsuarios = async () => {
    try {
      await axios.post('http://localhost:5000/cargarUsuarios');
      console.log('Usuarios cargados correctamente');
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };
  const restablecerContrasena = async () => {
    // Verificar si las contraseñas coinciden
    if (nuevaContrasena !== confirmarContrasena) {
      alert('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/olvidoContrasena', {
        carnet,
        correo,
        nuevaContrasena
      });

      alert(response.data.mensaje); // Muestra el mensaje de respuesta del servidor
      navigate('/'); // Redirige a la página de inicio después de restablecer la contraseña
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      alert('Ocurrió un error al restablecer la contraseña. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div>
      <center>
        <form className={styles.form}>
        <center><img src="https://plataformacii.ingenieria.usac.edu.gt/images/logo_fi.png" alt="Logo" style={{ width: '400px', height: '100px' }} /></center>
          <label className={styles.label}><h1>Olvidé mi Contraseña</h1></label>
          <input
            type="text"
            value={carnet}
            onChange={(e) => setCarnet(e.target.value)}
            placeholder="Registro Académico"
            className={styles.input}
          /><br/>
          <input
            type="text"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="Correo Electrónico"
            className={styles.input}
          /><br/>
          <button type="button" className={styles.boton} onClick={validarDatos}
            style={{ display: validacionCorrecta ? 'none' : 'block' }} 
          >
            Aceptar
          </button>
          
          {validacionCorrecta && (
            <>
            <br/>
              <label>Nueva Contraseña:</label>
              <input
                type="password"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                className={styles.input}
              /><br/>
              <label>Confirmar Contraseña:</label>
              <input
                type="password"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                className={styles.input}
              /><br/>
              <button type="button" className={styles.boton} onClick={restablecerContrasena}>Restablecer Contraseña</button><br/>
            </>
          )}
          <button type="button" className={styles.boton} onClick={() => navigate('/')}>Regresar</button>
        </form>
      </center>
    </div>
  );
};

export default Olvidar;