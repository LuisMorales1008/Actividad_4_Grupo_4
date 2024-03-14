import React from 'react';
import styles from './Cursos.module.css' ;
import { useNavigate } from 'react-router-dom';

const Cursos = () => {
    const navigate = useNavigate();
      return (
        <label className={styles.label}><h1>Cursos Aprobados</h1></label>
      );
    };
    
export default Cursos;