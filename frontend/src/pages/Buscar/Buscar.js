import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import styles from './Buscar.module.css';

const Buscar = () => {
  const [cursosAprobados, setCursosAprobados] = useState([]);
  const [carnetBuscado, setCarnetBuscado] = useState('');
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
  const [error, setError] = useState('');
  const [mostrarCursos, setMostrarCursos] = useState(false);


  const buscarUsuario = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/buscarUsuario?carnet=${carnetBuscado}`);
      if (response.data && response.data.datosUsuario) {
        setUsuarioEncontrado(response.data.datosUsuario);
        setError('');
        // Llamar a cargarCursosAprobados después de encontrar el usuario
        cargarCursosAprobados(carnetBuscado);
      } else {
        setUsuarioEncontrado(null);
        setError('No se encontró ningún usuario con el carnet proporcionado.');
      }
    } catch (error) {
      console.error('Error al buscar usuario:', error);
      setError('Ocurrió un error al buscar el usuario. Por favor, inténtalo de nuevo.');
    }
  };

  const cargarCursosAprobados = async (carnet) => {
    try {
      const response = await axios.get(`http://localhost:5000/mostrar-cursos-aprobados/${carnet}`);
      setCursosAprobados(response.data.cursosAprobados);
    } catch (error) {
      console.error('Error al cargar los cursos aprobados:', error);
    }
  };

  const handleMostrarCursos = () => {
    setMostrarCursos(!mostrarCursos);
  };

  const calcularTotalCreditos = (cursos) => {
    return cursos.reduce((total, curso) => total + curso.creditos, 0);
};

  return (
  <div className={`${styles['search-container']} ${styles['search-container-custom']}`}>
    <h1 className={`${styles['search-title']} ${styles['search-title-custom']}`}>Buscar Registro Académico</h1>
    <div className={`${styles['search-bar']} ${styles['search-bar-custom']}`}>
      <input 
        type="text" 
        placeholder="Ingrese Registro Académico"
        value={carnetBuscado}
        onChange={(e) => setCarnetBuscado(e.target.value)}
        className={`${styles['search-input']} ${styles['search-input-custom']}`} 
      />
      <button onClick={buscarUsuario} className={`${styles['search-button']} ${styles['search-button-custom']}`}> 
        <FaSearch className={`${styles['search-icon']} ${styles['search-icon-custom']}`} />
      </button>
    </div>
    {error && <p className={`${styles['error-message']} ${styles['error-message-custom']}`}>{error}</p>}
    {usuarioEncontrado && (
      <div className={styles.userDetailsContainer}>
        <label className={styles.label}><h1>Datos del Usuario Encontrado</h1></label>
        <div className={styles.datosPerfil}>
          <p><strong>Carnet:</strong> {usuarioEncontrado.carnet}</p>
          <p><strong>Nombre:</strong> {usuarioEncontrado.nombre}</p>
          <p><strong>Apellido:</strong> {usuarioEncontrado.apellido}</p>
          <p><strong>Correo:</strong> {usuarioEncontrado.correo}</p>
        </div>
      </div>
    )}
    {usuarioEncontrado && (
      <button onClick={handleMostrarCursos} className={`${styles['toggle-button']} ${styles['toggle-button-custom']}`}>
        {mostrarCursos ? 'Ocultar cursos aprobados' : 'Mostrar cursos aprobados'}
      </button>
    )}
    {mostrarCursos && cursosAprobados.length === 0 && (
      <p className={`${styles['no-courses']} ${styles['no-courses-custom']}`}>Este Usuario No Tiene Cursos Aprobados.</p>
    )}
    {mostrarCursos && cursosAprobados.length > 0 && (
      <>
        <table className={`${styles.table} ${styles['courses-table']}`}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Créditos</th>
            </tr>
          </thead>
          <tbody>
            {cursosAprobados.map((curso) => (
              <tr key={curso.id}>
                <td>{curso.id}</td>
                <td>{curso.nombre}</td>
                <td>{curso.creditos}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.totalCredits}>Total de Créditos de Cursos Aprobados: {calcularTotalCreditos(cursosAprobados)}</p>
      </>
    )}
  </div>
);
};

export default Buscar;