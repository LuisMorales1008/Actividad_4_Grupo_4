import React, { useState, useEffect } from 'react';
import styles from './Inicio.module.css' ;
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Inicio = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [professors, setProfesores] = useState([]);
  const [courses, setCurso] = useState([]);

  useEffect(() => {
    fetchPosts();
    fetchProfesores();
    fetchCursos();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProfesores = async () => {
    try {
      const response = await axios.get('/api/professors');
      setProfesores(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCursos = async () => {
    try {
      const response = await axios.get('/api/courses');
      setCurso(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterOptionChange = (e) => {
    setFilterOption(e.target.value);
    setFilterValue('');
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
  };

  const filteredPosts = posts.filter((post) => {
    const { title, content } = post;
    const searchRegex = new RegExp(searchQuery, 'i');

    if (filterOption === 'curso') {
      return title.includes(filterValue) || searchRegex.test(title);
    } else if (filterOption === 'profesor') {
      return content.includes(filterValue) || searchRegex.test(content);
    } else if (filterOption === 'cursoText') {
      const course = courses.find((c) => c.name.toLowerCase() === filterValue.toLowerCase());
      return course ? title.includes(course.name) || searchRegex.test(title) : false;
    } else if (filterOption === 'profesorText') {
      const professor = professors.find((p) => p.name.toLowerCase() === filterValue.toLowerCase());
      return professor ? content.includes(professor.name) || searchRegex.test(content) : false;
    }

    return searchRegex.test(title) || searchRegex.test(content);
  });

  return (
    <div>
      <center><h1>Pantalla Inicial</h1>
      <div className={styles.form}>
        <select value={filterOption} onChange={handleFilterOptionChange}>
          <option value="">Seleccionar opción de filtro</option>
          <option value="curso">Filtrar por Curso</option>
          <option value="profesor">Filtrar por Catedrático</option>
          <option value="cursoText">Filtrar por Nombre de Curso</option>
          <option value="profesorText">Filtrar por Nombre de Catedrático</option>
        </select><p/>
        {filterOption === 'curso' && (
          <select value={filterValue} onChange={handleFilterValueChange}>
            <option value="">Seleccionar curso</option>
            {courses.map((course) => (
              <option key={course.id} value={course.name}>
                {course.name}
              </option>
            ))}
          </select>
        )}
        {filterOption === 'profesor' && (
          <select value={filterValue} onChange={handleFilterValueChange}>
            <option value="">Seleccionar catedrático</option>
            {professors.map((professor) => (
              <option key={professor.id} value={professor.name}>
                {professor.name}
              </option>
            ))}
          </select>
        )}
        {filterOption === 'cursoText' && (
          <input
            type="text"
            placeholder="Ingrese el nombre del curso"
            value={filterValue}
            onChange={handleFilterValueChange}
          />
        )}
        {filterOption === 'profesorText' && (
          <input
            type="text"
            placeholder="Ingrese el nombre del catedrático"
            value={filterValue}
            onChange={handleFilterValueChange}
          />
        )}
      </div>
      <ul>
        {filteredPosts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
      </center>
    </div>
  );
};

export default Inicio;