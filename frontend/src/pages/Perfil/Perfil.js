import React from 'react';
import styles from './Perfil.module.css' ;
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
    const navigate = useNavigate();
      return (
        <label className={styles.label}><h1>Perfil</h1></label>
      );
    };
    
export default Perfil;