import React from 'react';
import styles from './Publicacion.module.css' ;
import { useNavigate } from 'react-router-dom';

const Publicacion = () => {
    const navigate = useNavigate();
      return (
        <label className={styles.label}><h1>Publicacion</h1></label>
      );
    };
    
export default Publicacion;