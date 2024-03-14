import React, { useState } from 'react';
import axios from 'axios';
import styles from './Olvidar.module.css';
import { useNavigate } from 'react-router-dom';

const Olvidar = () => {
  const navigate = useNavigate();
  const [carnet, setCarnet] = useState('');
  const [correo, setCorreo] = useState('');

  const restablecerContrasena = async () => {
    try {
      const response = await axios.post('http://localhost:5000/olvidoContrasena', {
        carnet,
        correo,
        nuevaContrasena: 'tuNuevaContraseña' // Aquí debes proporcionar la nueva contraseña
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
          <button type="button" className={styles.boton} onClick={restablecerContrasena}>Restablecer Contraseña</button><br/>
          <button type="button" className={styles.boton} onClick={() => navigate('/')}>Regresar</button>
        </form>
      </center>
    </div>
  );
};

export default Olvidar;