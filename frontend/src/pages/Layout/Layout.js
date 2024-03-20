import { Link } from "react-router-dom";
import styles from './Layout.module.css'
import { Outlet } from "react-router-dom";

const Layout = () => {
    return(
        <>
        <nav className={styles.navbar}>
            <div className={styles.navLinks}>
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
                        <Link to='/layout/buscar'>Buscar</Link>
                    </li>
                    <li>
                        <Link to='/layout/cursos'>Cursos Aprobados</Link>
                    </li>
                </ul>
            </div>
            <div className={styles.rightLink}>
                <Link to='/'>Cerrar Sesión</Link>
            </div>
        </nav>
        <Outlet />
        </>
    )
}

export default Layout;