import React, { useState } from 'react';
import axios from 'axios';
import styles from './Publicacion.module.css' ;
import { useNavigate } from 'react-router-dom';

const Publicacion = () => {
  const [type, setType] = useState('course');
  const [courseOrProfessor, setCourseOrProfessor] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const { userId, nombres, apellidos } = userData;

      const newPost = {
        userId,
        nombres,
        apellidos,
        type,
        courseOrProfessor,
        message,
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
        <div>
          <label>
            <input type="radio" name="type" value="curso" checked={type === 'course'} onChange={() => setType('course')}/>Curso </label>
          <label>
            <input type="radio" name="type" value="professor" checked={type === 'professor'} onChange={() => setType('professor')} />Profesor
          </label>
        </div>
        <input type="text" placeholder={type === 'course' ? 'Nombre del curso' : 'Nombre del profesor'} value={courseOrProfessor} onChange={(e) => setCourseOrProfessor(e.target.value)} /><p/>
        <textarea placeholder="Escribe tu publicación aquí" value={message} onChange={(e) => setMessage(e.target.value)} /><br/>
        <button type="submit" disabled={loading}>
          {loading ? 'Creando publicación...' : 'Crear Publicación'}
        </button>
      </form>
      </center>
    </div>
  );
};
export default Publicacion;