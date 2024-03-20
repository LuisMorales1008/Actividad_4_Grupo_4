import React, { useState, useEffect } from 'react';
import styles from './Inicio.module.css' ;
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Inicio = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    filterType: 'course',
    course: '',
    professor: '',
    courseQuery: '',
    professorQuery: '',
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterOptions({
      ...filterOptions,
      [e.target.name]: e.target.value,
    });
  };

  const filteredPosts = posts.filter((post) => {
    const { filterType, course, professor, courseQuery, professorQuery } = filterOptions;
    const { title, content } = post;
    const searchRegex = new RegExp(searchQuery, 'i');

    if (filterType === 'course') {
      if (course && !title.includes(course)) return false;
      if (courseQuery && !title.includes(courseQuery)) return false;
    } else {
      if (professor && !content.includes(professor)) return false;
      if (professorQuery && !content.includes(professorQuery)) return false;
    }
    return searchRegex.test(title) || searchRegex.test(content);
  });

  return (
    <div>
      <h1>Pantalla Inicial</h1>
        <div>
          <label>
            <input
              type="radio"
              name="filterType"
              value="course"
              checked={filterOptions.filterType === 'course'}
              onChange={handleFilterChange}
            />
            Curso
          </label>
          <label>
            <input
              type="radio"
              name="filterType"
              value="professor"
              checked={filterOptions.filterType === 'professor'}
              onChange={handleFilterChange}
            />
            Profesor
          </label>
        </div>
        {filterOptions.filterType === 'course' ? (
          <>
            <select name="course" value={filterOptions.course} onChange={handleFilterChange}>
              <option value="">Filtrar por Curso</option>
              {/* Aquí irían las opciones de cursos */}
            </select>
            <input
              type="text"
              placeholder="Filtrar por Nombre de Curso"
              name="courseQuery"
              value={filterOptions.courseQuery}
              onChange={handleFilterChange}
            />
          </>
        ) : (
          <>
            <select name="professor" value={filterOptions.professor} onChange={handleFilterChange}>
              <option value="">Filtrar por Profesor</option>
              {/* Aquí irían las opciones de profesores */}
            </select>
            <input
              type="text"
              placeholder="Filtrar por Nombre de Profesor"
              name="professorQuery"
              value={filterOptions.professorQuery}
              onChange={handleFilterChange}
            />
          </>
        )}
      <ul>
        {filteredPosts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Inicio;