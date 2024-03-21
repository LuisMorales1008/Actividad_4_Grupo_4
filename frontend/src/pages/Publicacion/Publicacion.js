import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Publicacion.module.css';
import { useNavigate } from 'react-router-dom';

const Publicacion = () => {
  const navigate = useNavigate();
  const [tipoPublicacion, setTipoPublicacion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [titulo, setTitulo] = useState('');
  const [loading, setLoading] = useState(false);
  const [carnetUsuario, setCarnetUsuario] = useState('');

  useEffect(() => {
    async function fetchDatosUsuario() {
      try {
        const response = await axios.get('http://localhost:5000/datosUsuario');
        if (response.data && response.data.datosUsuario) {
          const { carnet } = response.data.datosUsuario;
          setCarnetUsuario(carnet);
        } else {
          throw new Error('No se pudieron obtener los datos del usuario');
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      }
    }
    fetchDatosUsuario();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Verificar si el carné del usuario se ha obtenido correctamente
      if (!carnetUsuario) {
        throw new Error('No se pudo obtener el carné del usuario. Por favor, inténtalo de nuevo.');
      }

      const nuevaPublicacion = {
        carnet: carnetUsuario,
        tipoPublicacion,
        mensaje,
        titulo
      };

      await axios.post('http://localhost:5000/crearPublicacion', nuevaPublicacion);
      alert('Publicación creada exitosamente.');
      // Limpiar los campos después de crear la publicación
      setTipoPublicacion('');
      setMensaje('');
      setTitulo('');
    } catch (error) {
      console.error('Error al crear la publicación:', error);
      alert(error.message || 'Error al crear la publicación. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.perfilContainer}>
      <center>
        <h1 className={`${styles['search-title']} ${styles['search-title-custom']}`}>Seccion Publicacion</h1>
        <form className={styles.datosPerfil} onSubmit={handleSubmit}>
        <label className={styles.label}><h1>Crea Una Publicacion</h1></label>
          <div className={styles.datosPerfil}>
          <label className={styles.label1}>
          <input
            className={styles.radioInput}
            type="radio"
            name="type"
            value="Curso"
            checked={tipoPublicacion === 'Curso'}
            onChange={() => setTipoPublicacion('Curso')}
          />
          Curso
        </label>
        <label className={styles.label1}>
          <input
            className={styles.radioInput}
            type="radio"
            name="type"
            value="Catedratico"
            checked={tipoPublicacion === 'Catedratico'}
            onChange={() => setTipoPublicacion('Catedratico')}
          />
          Profesor
        </label>
          </div>
          <input className={styles.input} type="text" placeholder="Escriba el Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} /><p />
          <textarea className={styles.textarea}  placeholder="Escribe tu publicación aquí" value={mensaje} onChange={(e) => setMensaje(e.target.value)} /><br />

          <button type="submit" disabled={loading} className={styles.editButton}  >
            {loading ? 'Creando publicación...' : 'Crear Publicación'}
          </button>
        </form>
      </center>
    </div>
  );
}

export default Publicacion;