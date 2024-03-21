import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Inicio.module.css';

const Inicio = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [carnetUsuario, setCarnetUsuario] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(null);
  const [comments, setComments] = useState({});
  const [searchType, setSearchType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [searchType, searchQuery, posts]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/publicaciones');
      const sortedPosts = response.data.publicaciones.sort((a, b) => {
        return new Date(b.FechaCreacion) - new Date(a.FechaCreacion);
      });
      setPosts(sortedPosts);
      sortedPosts.forEach(post => {
        fetchComments(post.PublicacionID);
      });
    } catch (error) {
      console.error('Error al Cargar la Publicaciones:', error);
    }
  };

  const fetchComments = async (publicacionID) => {
    try {
      const response = await axios.get(`http://localhost:5000/comentarios/${publicacionID}`);
      setComments(prevComments => ({
        ...prevComments,
        [publicacionID]: response.data.comentarios
      }));
    } catch (error) {
      console.error('Error al Cargar los Comentarios:', error);
    }
  };

  const formatDate = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    };
    const locale = 'es-ES';
    return dateTime.toLocaleString(locale, options);
  };

  const handleCommentSubmit = async (postId) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/comentarios', {
        PublicacionID: postId,
        Mensaje: newComment,
        CarnetUsuario: carnetUsuario
      });
      alert('¡Comentario agregado con éxito!');
      fetchPosts();
      setNewComment('');
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];
    if (searchType === 'catedratico') {
      filtered = filtered.filter(post => post.TipoPublicacion === 'Catedratico');
    } else if (searchType === 'curso') {
      filtered = filtered.filter(post => post.TipoPublicacion === 'Curso');
    } else if (searchType === 'titulo') {
      filtered = filtered.filter(post => post.Titulo.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredPosts(filtered);
  };

  return (
    <div className={styles.perfilContainer}>
      <h1 className={`${styles['search-title']} ${styles['search-title-custom']}`}>Bienvenido Menu Inicial</h1>
      <label className={styles.label}><h1>Tipos de Publicaciones</h1> </label>
      <div className={styles.datosPerfil}>
        <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className={styles.selectInput} 
      >
        <option className={styles.selectInputoption} value="">Mostrar todas</option>
        <option className={styles.selectInputoption} value="catedratico">Por Catedrático</option>
        <option className={styles.selectInputoption} value="curso">Por Curso</option>
        <option className={styles.selectInputoption} value="titulo">Por Título</option>
      </select>
      {searchType !== '' && (
        <input
          className={`${styles.input} ${styles.searchInput} custom-input`} 
          type="text"
          placeholder="Ingrese su Búsqueda Aquí"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      )}
      </div>
      {filteredPosts.map((post) => (
        <div key={post.PublicacionID}>
          <div className={styles.datosPerfil}>
            <div className={styles.datosPerfil}>
            <h2 className={styles.label1}>{post.Titulo}</h2>
            <p><strong>Mensaje:</strong> <br></br> {post.Mensaje}</p>
            <p><strong>Usuario:</strong> {post.carnet}</p>
            <p><strong>Tipo de Publicación:</strong> {post.TipoPublicacion}</p>
            <p><strong>Fecha de Creación:</strong> {formatDate(post.FechaCreacion)}</p>
          </div>
            {comments[post.PublicacionID] && (
              <div>
                <label className={styles.label1}><h3>Comentarios</h3> </label>
                <ul>
                  {comments[post.PublicacionID].map(comment => (
                    <li key={comment.ComentarioID} className={styles.commentBox}>
                    <p><strong>Carnet:</strong> {comment.CarnetUsuario}</p>
                    <p><strong>Fecha:</strong> {formatDate(comment.FechaCreacion)}</p>
                    <p><strong>Mensaje:</strong><br></br>{comment.Mensaje}</p>
                    <br />
                  </li>
                  ))}
                </ul>
              </div>
            )}
            {showCommentForm === post.PublicacionID && (
              <>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleCommentSubmit(post.PublicacionID);
                }}>
                  <textarea
                    className={styles.textarea}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe tu comentario aquí"
                    required
                  ></textarea>
                  <button className={styles.editButton} type="submit" disabled={loading}>Comentar</button>
                  {error && <p>Error: {error}</p>}
                </form>
              </>
            )}
            <button className={styles.editButton} onClick={() => setShowCommentForm(prevState => prevState === post.PublicacionID ? null : post.PublicacionID)}>
              {showCommentForm === post.PublicacionID ? 'Ocultar' : 'Desea Comentar'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Inicio;

