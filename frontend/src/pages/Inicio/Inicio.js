import React from 'react';
import styles from './Inicio.module.css' ;
import { useNavigate } from 'react-router-dom';

const Inicio = () => {
    const navigate = useNavigate();
      return (
        <label className={styles.label}><h1>Pantalla de Inicio</h1></label>
      );
    };
    
export default Inicio;