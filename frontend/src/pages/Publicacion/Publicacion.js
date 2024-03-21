import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Publicacion.module.css' ;
import { useNavigate } from 'react-router-dom';

const Publicacion = () => {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState('course'); // 'course' o 'professor'
  const [cursoOprofesor, setCursoOprofesor] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [subir, setSubir] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubir(true);

    const url = 'http://localhost:5000/crearPublicacion';

    try {
      const response = await axios.post(url, {
        carnet: datosUsuario.carnet,
        nombres: datosUsuario.nombre,
        apellidos: datosUsuario.apellido,
        tipo,
        cursoOprofesor,
        mensaje,
        fecha: new Date(),
      });
      const mensaje = response.data.mensaje;

      if (mensaje.includes('Ya existe :(')) {
          alert(mensaje);
      } else {
          console.log(mensaje);
          alert('Publicacion agregada exitosamente');
          borrarCampos();
      }
  } catch (error) {
      console.error('Ocurrió un error:', error);
      alert('¡Ocurrió un error al guardar la pulicacion! Por favor, inténtalo de nuevo.');
  }
};

  const borrarCampos = () => {
    setTipo('');
    setCursoOprofesor('');
    setMensaje('');
    setSubir('');
  };

  return (
    <div className={styles.form}>
      <center><h1>Crear Publicación</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <input
              type="radio"
              name="type"
              value="curso"
              checked={tipo === 'curso'}
              onChange={() => setTipo('curso')}
            />
            Curso
          </label>
          <label>
            <input
              type="radio"
              name="type"
              value="profesor"
              checked={tipo === 'profesor'}
              onChange={() => setTipo('profesor')}
            />
            Profesor
          </label><br/>
        </div>
        <input
          type="text"
          placeholder={tipo === 'curso' ? 'Nombre del curso' : 'Nombre del profesor'}
          value={cursoOprofesor}
          onChange={(e) => setCursoOprofesor(e.target.value)}
        /><p/>
        <textarea
          placeholder="Escribe tu publicación aquí"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
        /><p/>
        <button type="submit" disabled={subir}>
          {subir ? 'Creando publicación...' : 'Crear Publicación'}
        </button>
      </form>
      </center>
    </div>
  );
};

export default Publicacion;