import React, { useState, useEffect } from 'react';
import styles from './Inicio.module.css' ;
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Inicio = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [catedraticos, setCatedraticos] = useState([]);
  const [filtroSeleccionado, setFiltroSeleccionado] = useState('');
  const [filtroValor, setFiltroValor] = useState('');
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [datosUsuario, setDatosUsuario] = useState({
    carnet: '',
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

  useEffect(() => {
    axios.get('http://localhost:5000/publicaciones')
      .then(res => {
        setPublicaciones(res.data.publicaciones);
        setCursos(res.data.cursos);
        setCatedraticos(res.data.catedraticos);
      })
      .catch(err => console.error(err));
  }, []);

  const handleFiltroChange = (e) => {
    setFiltroSeleccionado(e.target.value);
    setFiltroValor('');
  };

  const handleFiltroValorChange = (e) => {
    setFiltroValor(e.target.value);
  };

  const handleComentarioChange = (e, publicacionId) => {
    setNuevoComentario(e.target.value);
    // Aquí puedes agregar la lógica para enviar el comentario a la API
  };

  const handleComentarioEnviar = (publicacionId) => {
    // Lógica para enviar el comentario a la API
    axios.post('http://localhost:5000/comentarios', {
      publicacionId,
      texto: nuevoComentario,
      usuario: datosUsuario.carnet
    })
      .then(res => {
        // Actualizar la lista de comentarios de la publicación
        setPublicaciones(prevPublicaciones => {
          return prevPublicaciones.map(publicacion => {
            if (publicacion.id === publicacionId) {
              return {
                ...publicacion,
                comentarios: [...publicacion.comentarios, res.data.nuevoComentario]
              };
            }
            return publicacion;
          });
        });
        setNuevoComentario(''); // Limpiar el input de comentarios
      })
      .catch(err => console.error(err));
  };

  const publicacionesFiltradas = publicaciones.filter(publicacion => {
    if (filtroSeleccionado === 'curso') {
      return publicacion.curso === filtroValor;
    } else if (filtroSeleccionado === 'catedratico') {
      return publicacion.catedratico === filtroValor;
    } else if (filtroSeleccionado === 'nombreCurso') {
      return publicacion.curso.toLowerCase().includes(filtroValor.toLowerCase());
    } else if (filtroSeleccionado === 'nombreCatedratico') {
      return publicacion.catedratico.toLowerCase().includes(filtroValor.toLowerCase());
    } else {
      return true;
    }
  });

  return (
    <div><center>
      <h1>Pantalla Inicial</h1>

      {/* Filtros */}
      <div>
        <select value={filtroSeleccionado} onChange={handleFiltroChange}>
          <option value="">Seleccionar filtro</option>
          <option value="curso">Filtrar por Curso</option>
          <option value="catedratico">Filtrar por Catedrático</option>
          <option value="nombreCurso">Filtrar por Nombre de Curso</option>
          <option value="nombreCatedratico">Filtrar por Nombre de Catedrático</option>
        </select>

        {filtroSeleccionado === 'curso' && (
          <select value={filtroValor} onChange={handleFiltroValorChange}>
            <option value="">Seleccionar curso</option>
            {cursos.map(curso => (
              <option key={curso} value={curso}>{curso}</option>
            ))}
          </select>
        )}

        {filtroSeleccionado === 'catedratico' && (
          <select value={filtroValor} onChange={handleFiltroValorChange}>
            <option value="">Seleccionar catedrático</option>
            {catedraticos.map(catedratico => (
              <option key={catedratico} value={catedratico}>{catedratico}</option>
            ))}
          </select>
        )}

        {(filtroSeleccionado === 'nombreCurso' || filtroSeleccionado === 'nombreCatedratico') && (
          <input
            type="text"
            placeholder={`Filtrar por ${filtroSeleccionado === 'nombreCurso' ? 'Nombre de Curso' : 'Nombre de Catedrático'}`}
            value={filtroValor}
            onChange={handleFiltroValorChange}
          />
        )}
      </div>

      {/* Publicación de bienvenida */}
      <div>
        <h3>Bienvenido a la Aplicación</h3>
        <p>Publicacion de Prueba</p>
        <p>Publicado por: Sistema</p>
        <p>Fecha: {new Date().toLocaleDateString()}</p>

        <div>
          <h4>Comentarios:</h4>
          {/* Renderizar comentarios previos */}
          {publicaciones.find(p => p.id === 'bienvenida')?.comentarios.map(comentario => (
            <div key={comentario.id}>
              <p>{comentario.texto}</p>
              <p>Por: {comentario.usuario}</p>
            </div>
          ))}
          <input
            type="text"
            placeholder="Agregar comentario"
            value={nuevoComentario}
            onChange={(e) => handleComentarioChange(e, 'bienvenida')}
          /><br/>
          <button onClick={() => handleComentarioEnviar('bienvenida')}>Enviar</button>
        </div>
      </div>

      {/* Publicaciones */}
      {publicacionesFiltradas.map(publicacion => (
        <div key={publicacion.id}>
          <h3>{publicacion.curso} - {publicacion.catedratico}</h3>
          <p>{publicacion.mensaje}</p>
          <p>Publicado por: {publicacion.usuario}</p>
          <p>Fecha: {publicacion.fecha}</p>

          <div>
            <h4>Comentarios:</h4>
            {/* Renderizar comentarios previos */}
            {publicacion.comentarios.map(comentario => (
              <div key={comentario.id}>
                <p>{comentario.texto}</p>
                <p>Por: {comentario.usuario}</p>
              </div>
            ))}
            <input
              type="text"
              placeholder="Agregar comentario"
              value={nuevoComentario}
              onChange={(e) => handleComentarioChange(e, publicacion.id)}
            /><br/>
            <button onClick={() => handleComentarioEnviar(publicacion.id)}>Enviar</button>
          </div>
        </div>
      ))}
      </center>
    </div>
  );
};

export default Inicio;