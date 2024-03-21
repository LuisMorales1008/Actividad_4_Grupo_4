import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Perfil.module.css'; 

const Perfil = () => {
  const navigate = useNavigate();
  const [validacionCorrecta, setValidacionCorrecta] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [carnet, setCarnet] = useState(''); 
  const [contrasena, setContrasena] = useState(''); 
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [datosUsuario, setDatosUsuario] = useState({
    correo: '',
    carnet: '',
    nombre: '',
    apellido: ''
  });

  useEffect(() => {
    axios.get('http://localhost:5000/datosUsuario')
      .then(response => {
        if (response.data && response.data.datosUsuario) {
          const { correo, carnet, nombre, apellido } = response.data.datosUsuario;
          setDatosUsuario({ correo, carnet, nombre, apellido });
        } else {
          console.error('No se pudieron obtener los datos del usuario');
        }
      })
      .catch(error => {
        console.error('Error al obtener datos del usuario:', error);
      });
  }, []);

  const btnEditar = () => {
    setEditMode(true);
  };

  const btnCancelar = () => {
    setEditMode(false);
    setCarnet('');
    setContrasena('');
    setNombre('');
    setApellido('');
    setCorreo('');
    setNuevaContrasena('');
    setConfirmarContrasena('');
    setValidacionCorrecta(false);
  };

  const validarDatos = async () => {
    if (!datosUsuario.carnet || !contrasena) {
      alert('Por favor, completa todos los campos.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/validarDatosPerfil', { carnet: datosUsuario.carnet, contrasena });
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

  const guardarDatos = async () => {
    // Verificar si las contraseñas coinciden
    if (nuevaContrasena !== confirmarContrasena) {
      alert('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/nuevosDatos', {
        carnet: datosUsuario.carnet,
        nombre,
        apellido,
        correo,
        contrasena: nuevaContrasena
      });
      alert('Datos guardados correctamente.');
      setEditMode(false);
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      alert('Ocurrió un error al guardar los datos. Por favor, inténtalo de nuevo.');
    }
  };
  

  return (
    
    <div className={styles.perfilContainer}>
      <div><h1 className={`${styles['search-title']} ${styles['search-title-custom']}`}>Seccion Perfil</h1>
      {!editMode && (
        <div className={styles.infoContainer}>
          <label className={styles.label}><h1>Mis Datos</h1></label>
          <div className={styles.datosPerfil}>
            <p><strong>Registro Académico:</strong> {datosUsuario.carnet}</p>
            <p><strong>Nombre:</strong> {datosUsuario.nombre}</p>
            <p><strong>Apellido:</strong> {datosUsuario.apellido}</p>
            <p><strong>Correo:</strong> {datosUsuario.correo}</p>
          </div>
          <button className={styles.editButton} onClick={btnEditar}>Editar Mi Perfil</button>
        </div>
      )}
      {editMode && (
        <div className={styles.formContainer}>
          <label className={styles.label}><h1>Verificación de Datos</h1></label>
          <input
            type="text"
            value={carnet}
            onChange={(e) => setCarnet(e.target.value)}
            placeholder="Registro Académico"
            className={styles.input}
          /><br/>
          <input
            type="password" 
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            placeholder="Contraseña"
            className={styles.input}
          /><br/>
  
          <button type="button" className={styles.boton} onClick={validarDatos}
            style={{ display: validacionCorrecta ? 'none' : 'block' }} 
          >
            Verifica
          </button>
  
          {validacionCorrecta && (
            <> 
              <label className={styles.label}><h1>Modificar Mis Datos</h1></label>
              <br/>
              <label className={styles.label}>Ingrese su Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder='Nombre'
                className={styles.input}
              /><br/>
              <label className={styles.label}>Ingrese Su Apellido:</label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder='Apellido'
                className={styles.input}
              /><br/>
              <label className={styles.label}>Ingrese Su Correo Electrónico:</label>
              <input
                type="text"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder='Correo Electrónico'
                className={styles.input}
              /><br/>
              <label className={styles.label}>Ingrese la Nueva Contraseña:</label>
              <input
                type="password"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                placeholder='Nueva Contraseña'
                className={styles.input}
              /><br/>
              <label className={styles.label}>Confirmar Contraseña:</label>
              <input
                type="password"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                placeholder='Confirmar Contraseña'
                className={styles.input}
              /><br/>

              <button className={styles.saveButton} onClick={guardarDatos}>Guardar</button>
              <button className={styles.cancelButton} onClick={btnCancelar}>Cancelar</button>
            </>
          )}
          
        </div>
      )}
    </div>
    </div>
  );
};

export default Perfil;

