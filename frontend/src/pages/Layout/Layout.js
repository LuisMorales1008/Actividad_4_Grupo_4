import { Link } from "react-router-dom";
import styles from './Layout.module.css'
import { Outlet } from "react-router-dom";

const Layout = () => {
    return(
        <>
        <nav className={styles.navbar}>
            <ul>
                <li>
                    <Link to='/layout/inicio'>Inicio</Link>
                </li>
                <li>
                    <Link to='/layout/publicacion'>Crear Publicacion</Link>
                </li>
                <li>
                    <Link to='/layout/perfil'>Ver Perfil</Link>
                </li>
                <li>
                    <Link to='/layout/cursos'>Cursos Aprobados</Link>
                </li>
                <li>
                    <Link to='/'>Cerrar Sesión</Link>
                </li>
            </ul>
        </nav>
        <Outlet />
        </>
    )
}

export default Layout;