import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Cursos.module.css';

const Cursos = () => {
    const navigate = useNavigate();
    const [cursosAprobados, setCursosAprobados] = useState([]);
    const [todosCursos, setTodosCursos] = useState([]);
    const [selectedTab, setSelectedTab] = useState('aprobados');
    
    useEffect(() => {
        cargarCursosAprobados();
        cargarTodosCursos();
    }, []);

    const cargarCursosAprobados = async () => {
        try {
            const response = await axios.get('http://localhost:5000/cursos-aprobados');
            setCursosAprobados(response.data.cursosAprobados);
        } catch (error) {
            console.error('Error al cargar los cursos aprobados:', error);
        }
    };

    const cargarTodosCursos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/cursos');
            setTodosCursos(response.data.cursos);
        } catch (error) {
            console.error('Error al cargar todos los cursos:', error);
        }
    };

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    };
    
const agregarCursoAsignado = async (carnet, idCurso) => {
    try {
        const response = await axios.post('http://localhost:5000/agregar-curso', {
            carnet: carnet,
            idCurso: idCurso
        });
        if (response.data.success) {
            // Si se agrego con exito, eliminamos el curso de la lista todosCursos
            setTodosCursos(todosCursos.filter(curso => curso.id !== idCurso));
            alert(response.data.message);
        } else {
            alert(response.data.message);
        }
    } catch (error) {
        console.error('Error al agregar el curso asignado en el frontend:', error);
        if (error.response && error.response.data) {
            return { success: false, message: error.response.data.message };
        } else {
            return { success: false, message: 'Ocurrió un error al agregar el curso asignado.' };
        }
    }
};

// Función para obtener el carné del estudiante
const obtenerCarnet = async () => {
    try {
        const response = await axios.get('http://localhost:5000/carnet');
        const carnet = response.data.carnet;
        return { success: true, carnet }; 
    } catch (error) {
        console.error('Error al obtener el carné del estudiante:', error);
        return { success: false, message: 'Ocurrió un error al obtener el carné del estudiante.' };
    }
};
const handleAgregarCurso = async (cursoId) => {
    try {
        const response = await obtenerCarnet();
        if (response.success) {
            const carnet = response.carnet;
            const resultado = await agregarCursoAsignado(carnet, cursoId);
            if (resultado.success) {
                alert(resultado.message);
            } else {
                alert(resultado.message);
            }
        } else {
            console.error('No se pudo obtener el carné del estudiante.');
        }
    } catch (error) {
        console.error('Error al agregar el curso asignado:', error);
    }
};
const calcularTotalCreditos = (cursos) => {
    return cursos.reduce((total, curso) => total + curso.creditos, 0);
};

return (
    <div className={styles['search-container']}>
        <h1 className={`${styles['search-title']} ${styles['search-title-custom']}`}>Seccion Cursos</h1>
        <div className={styles.tabs}>
            <button
                className={`${styles.tab} ${selectedTab === 'aprobados' ? styles.activeTab : ''}`}
                onClick={() => handleTabChange('aprobados')}
            >
                Cursos Aprobados
            </button>
            <button
                className={`${styles.tab} ${selectedTab === 'asignados' ? styles.activeTab : ''}`}
                onClick={() => handleTabChange('asignados')}
            >
                Agregar Cursos
            </button>
        </div>
        <div className={styles.tabContent}>
        {selectedTab === 'aprobados' && (
            <>
                {cursosAprobados.length === 0 ? (
                    <p>No tienes Cursos Aprobados.</p>
                ) : (
                    <>
                        <table className={styles.table}>
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
            </>
            )}
            {selectedTab === 'asignados' && (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Créditos</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todosCursos.map((curso) => (
                            <tr key={curso.id}>
                                <td>{curso.id}</td>
                                <td>{curso.nombre}</td>
                                <td>{curso.creditos}</td>
                                <td>
                                    <button className={styles.addButton} onClick={() => handleAgregarCurso(curso.id)}>Agregar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    </div>
);
}
export default Cursos;