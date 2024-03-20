import React, { useState } from 'react';
import axios from 'axios';
import styles from './Publicacion.module.css' ;
import { useNavigate } from 'react-router-dom';

const Publicacion = () => {
  const [type, setType] = useState('course');
  const [cursoOprofesor, setCourseOrProfessor] = useState('');
  const [mensaje, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const { carnet, nombres, apellidos } = userData;

      const newPost = {
        carnet,
        nombres,
        apellidos,
        type,
        cursoOprofesor,
        mensaje,
        createdAt: new Date(),
      };

      await axios.post('/api/posts', newPost);
      alert('Publicación creada exitosamente');
      setMessage('');
    } catch (error) {
      console.error(error);
      alert('Error al crear la publicación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <center>
      <h1 className={styles.label}>Crear Publicación</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.datosPerfil}>
          <label>
            <input type="radio" name="type" value="curso" checked={type === 'course'} onChange={() => setType('course')}/>Curso </label>
          <label>
            <input type="radio" name="type" value="professor" checked={type === 'professor'} onChange={() => setType('professor')} />Profesor
          </label>
        </div>
        <input type="text" placeholder={type === 'course' ? 'Nombre del curso' : 'Nombre del profesor'} value={cursoOprofesor} onChange={(e) => setCourseOrProfessor(e.target.value)} /><p/>
        <textarea placeholder="Escribe tu publicación aquí" value={mensaje} onChange={(e) => setMessage(e.target.value)} /><br/>
        <button type="submit" disabled={loading}>
          {loading ? 'Creando publicación...' : 'Crear Publicación'}
        </button>
      </form>
      </center>
    </div>
  );
};
export default Publicacion;