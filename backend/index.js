const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');

//Envia  parametros por body
app.use(bodyParser.json());
app.use(cors());
// Iniciar el servidor
app.listen(5000, () => {
    console.log('Nuestro Servidor esta corriendo en el puerto 5000');
   
});

// Conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'DaaNiieeL1',
    database: 'informe4'
});

// Ruta para cerrar sesión 
app.post('/cerrarSesion', (req, res) => {
    connection.end();
    res.json({ mensaje: 'Sesión cerrada exitosamente' });
});

// Ruta para crear un estudiante y guardarlo en la base de datos
app.post('/crearEstudiante', (req, res) => {
    const { nombre, apellido, contrasena, correo, carnet } = req.body;

    // Verifica si el correo ya esta registrado en la base de datos
    connection.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (errorCorreo, resultadosCorreo) => {
        if (errorCorreo) {
            console.error('Error al verificar el correo en la base de datos:', errorCorreo);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
            return;
        }

        if (resultadosCorreo.length > 0) {
            console.log('Error: El correo ya está registrado');
            res.status(400).json({ mensaje: 'El correo ya está registrado' });
            return;
        }

        // Verifica si el carnet ya esta registrado en la base de datos
        connection.query('SELECT * FROM usuarios WHERE carnet = ?', [carnet], (errorCarnet, resultadosCarnet) => {
            if (errorCarnet) {
                console.error('Error al verificar el carnet en la base de datos:', errorCarnet);
                res.status(500).json({ mensaje: 'Error interno del servidor' });
                return;
            }

            if (resultadosCarnet.length > 0) {
                console.log('Error: El carnet ya está registrado');
                res.status(400).json({ mensaje: 'El carnet ya está registrado' });
                return;
            }

            // Si el correo y el carnet son únicos, insertar el estudiante en la base de datos
            connection.query('INSERT INTO usuarios (nombre, apellido, contrasena, correo, carnet) VALUES (?, ?, ?, ?, ?)', 
                [nombre, apellido, contrasena, correo, carnet], 
                (errorInsert, resultadoInsert) => {
                    if (errorInsert) {
                        console.error('Error al insertar el estudiante en la base de datos:', errorInsert);
                        res.status(500).json({ mensaje: 'Error interno del servidor' });
                        return;
                    }
                    
                    console.log('Estudiante registrado exitosamente');
                    res.status(200).json({ mensaje: 'Estudiante registrado exitosamente' });
                    // Llamar a la función para cargar los usuarios cuando se inicie la aplicación
                 
                }
            );
        });
    });
});

// Declaración de un objeto global para almacenar los datos del usuario
let datosUsuario = {};

// Función para iniciar sesión utilizando la base de datos
function iniciarSesion(carnet, contrasena, callback) {
    // Consultar la base de datos para encontrar al usuario con el carnet y contraseña proporcionados
    const query = 'SELECT * FROM usuarios WHERE carnet = ? AND contrasena = ?';
    connection.query(query, [carnet, contrasena], (error, results) => {
        if (error) {
            console.error('Error al buscar usuario en la base de datos:', error);
            return callback(error, null);
        }

        if (results.length > 0) {
            // Usuario encontrado, almacenar los datos del usuario en el array global
            datosUsuario = results[0];
            return callback(null, results[0]);
        } else {
            // Usuario y/o Contraseña incorrectos
            return callback(null, null);
        }
    });
}

// Ruta /iniciarSesion para iniciar sesión utilizando la base de datos
app.post('/iniciarSesion', function (req, res) {
    const carnet = req.body.carnet;
    const contrasena = req.body.contrasena;

    // Llamar a la función para iniciar sesión utilizando la base de datos
    iniciarSesion(carnet, contrasena, (error, usuario) => {
        if (error) {
            console.error('Ocurrió un error al iniciar sesión:', error);
            return res.status(500).json({ mensaje: 'Error interno del servidor' });
        }

        if (usuario) {
            // Inicio de sesión exitoso, enviar mensaje de éxito
            res.json({ mensaje: 'Ingresó un Usuario' });
        } else {
            // Usuario y/o Contraseña incorrectos
            res.status(401).json({ mensaje: 'Usuario y/o Contraseña son incorrectos' });
        }
    });
});

// Ruta para obtener los datos del usuario después de iniciar sesión
app.get('/datosUsuario', function (req, res) {
    // Verificar si hay datos de usuario almacenados en el array
    if (Object.keys(datosUsuario).length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron datos de usuario' });
    }
    
    // Enviar los datos del usuario como respuesta
    res.json({ datosUsuario: datosUsuario });
}); 


/// Ruta para restablecer contraseña del Estudiante
app.post('/olvidoContrasena', (req, res) => {
    const { carnet, correo, nuevaContrasena } = req.body;

    // Verificar si los datos coinciden con algún estudiante registrado
    const query = 'SELECT * FROM usuarios WHERE carnet = ? AND correo = ?';
    connection.query(query, [carnet, correo], (error, resultados) => {
        if (error) {
            console.error('Error al verificar los datos en la base de datos:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
            return;
        }

        if (resultados.length === 0) {
            // No se encontró ningún usuario con los datos proporcionados
            res.status(400).json({ mensaje: 'Los datos proporcionados son incorrectos' });
            return;
        }

        // Actualizar la contraseña del usuario
        const usuario = resultados[0];
        const queryUpdate = 'UPDATE usuarios SET contrasena = ? WHERE id = ?';
        connection.query(queryUpdate, [nuevaContrasena, usuario.id], (errorUpdate, resultadoUpdate) => {
            if (errorUpdate) {
                console.error('Error al actualizar la contraseña en la base de datos:', errorUpdate);
                res.status(500).json({ mensaje: 'Error interno del servidor' });
                return;
            }
            // Actualizar el array global con los nuevos datos del usuario
            datosUsuario.push({ carnet, nombre, apellido, correo, contrasena });
            // Contraseña actualizada exitosamente
            res.status(200).json({ mensaje: 'Contraseña actualizada exitosamente' });
  
        });
    });
});


// Ruta para validar los datos del estudiante
app.post('/validarDatos', (req, res) => {
    const { carnet, correo } = req.body;
  
    // Verificar si los datos coinciden con algún estudiante registrado
    const query = 'SELECT * FROM usuarios WHERE carnet = ? AND correo = ?';
    connection.query(query, [carnet, correo], (error, resultados) => {
      if (error) {
        console.error('Error al verificar los datos en la base de datos:', error);
        res.status(500).json({ valido: false });
        return;
      }
  
      if (resultados.length === 0) {
        // No se encontró ningún usuario con los datos proporcionados
        res.status(200).json({ valido: false });
      } else {
        // Datos válidos, se encontró un usuario con los datos proporcionados
        res.status(200).json({ valido: true });
      }
    });
  });


  // Ruta para validar los datos del estudiante en Perfil 
app.post('/validarDatosPerfil', (req, res) => {
    const { carnet, contrasena } = req.body;
  
    // Verificar si los datos coinciden con algún estudiante registrado
    const query = 'SELECT * FROM usuarios WHERE carnet = ? AND contrasena = ?';
    connection.query(query, [carnet, contrasena], (error, resultados) => {
      if (error) {
        console.error('Error al verificar los datos en la base de datos:', error);
        res.status(500).json({ valido: false });
        return;
      }
  
      if (resultados.length === 0) {
        // No se encontró ningún usuario con los datos proporcionados
        res.status(200).json({ valido: false });
      } else {
        // Datos válidos, se encontró un usuario con los datos proporcionados
        res.status(200).json({ valido: true });
      }
    });
  });

  // Ruta para buscar un usuario por su carnet
app.get('/buscarUsuario', (req, res) => {
    const { carnet } = req.query;
  
    // Verificar si se proporcionó el carnet en la consulta
    if (!carnet) {
      return res.status(400).json({ message: 'Se requiere proporcionar el carnet del usuario.' });
    }
  
    // Realizar la búsqueda del usuario en la base de datos
    const query = 'SELECT * FROM usuarios WHERE carnet = ?';
    connection.query(query, [carnet], (error, resultados) => {
      if (error) {
        console.error('Error al buscar usuario en la base de datos:', error);
        return res.status(500).json({ message: 'Ocurrió un error al buscar el usuario. Por favor, inténtalo de nuevo.' });
      }
  
      if (resultados.length === 0) {
        // No se encontró ningún usuario con el carnet proporcionado
        return res.status(404).json({ message: 'No se encontró ningún usuario con el carnet proporcionado.' });
      }
  
      // Se encontró un usuario con el carnet proporcionado, enviar los datos del usuario como respuesta
      res.status(200).json({ datosUsuario: resultados[0] });
    });
  });


 // Ruta para guardar los nuevos datos del perfil del estudiante
app.post('/nuevosDatos', (req, res) => {
    const { carnet, nombre, apellido, correo, contrasena } = req.body;

    // Verificar si el estudiante existe en la base de datos
    const query = 'SELECT * FROM usuarios WHERE carnet = ?';
    connection.query(query, [carnet], (error, resultados) => {
        if (error) {
            console.error('Error al verificar los datos en la base de datos:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
            return;
        }

        if (resultados.length === 0) {
            // No se encontró ningún estudiante con el carnet proporcionado
            res.status(400).json({ mensaje: 'No se encontró ningún estudiante con el carnet proporcionado' });
            return;
        }

        // Actualizar los datos del estudiante
        const estudiante = resultados[0];
        const queryUpdate = 'UPDATE usuarios SET nombre = ?, apellido = ?, correo = ?, contrasena = ? WHERE id = ?';
        connection.query(queryUpdate, [nombre, apellido, correo, contrasena, estudiante.id], (errorUpdate, resultadoUpdate) => {
            if (errorUpdate) {
                console.error('Error al actualizar los datos en la base de datos:', errorUpdate);
                res.status(500).json({ mensaje: 'Error interno del servidor' });
                return;
            }

            // Actualizar el objeto global datosUsuario con los nuevos datos
            datosUsuario = { carnet, nombre, apellido, correo, contrasena };

            // Datos actualizados exitosamente
            res.status(200).json({ mensaje: 'Datos actualizados exitosamente' });
        });
    });
});

// Endpoint para obtener el carné del estudiante
app.get('/carnet', (req, res) => {
    res.status(200).json({ carnet: datosUsuario.carnet });
});

// Ruta para obtener todos los cursos que no han sido aprobados por el estudiante
app.get('/cursos', (req, res) => {
    const { carnet } = datosUsuario;
    
    // Realizar la consulta a la base de datos para obtener los cursos que no han sido aprobados por el estudiante
    const query = `
        SELECT cursos.* 
        FROM cursos 
        LEFT JOIN cursosaprobados ON cursos.id = cursosaprobados.id_curso AND cursosaprobados.carnet = ?
        WHERE cursosaprobados.id_curso IS NULL
    `;
    
    connection.query(query, [carnet], (error, cursos) => {
        if (error) {
            console.error('Error al obtener los cursos:', error);
            res.status(500).json({ message: 'Ocurrió un error al obtener los cursos.' });
        } else {
            res.status(200).json({ cursos });
        }
    });
});

// Ruta para obtener los cursos aprobados por un estudiante específico
app.get('/cursos-aprobados', (req, res) => {
    const { carnet } = datosUsuario;
    
    // Realizar la consulta a la base de datos para obtener los cursos aprobados por el estudiante
    const query = 'SELECT cursos.* FROM Cursos JOIN cursosaprobados ON cursos.id = cursosaprobados.id_curso WHERE cursosaprobados.carnet = ?';
    connection.query(query, [carnet], (error, cursosAprobados) => {
        if (error) {
            console.error('Error al obtener los cursos aprobados:', error);
            res.status(500).json({ message: 'Ocurrió un error al obtener los cursos aprobados.' });
        } else {
            res.status(200).json({ cursosAprobados });
        }
    });
});

// Ruta para agregar un curso asignado
app.post('/agregar-curso', async (req, res) => {
    const { carnet, idCurso } = req.body;

    try {
        // Verificar si ya existe un curso asignado para el estudiante y el curso específico
        const existeCursoAsignado = await connection.query(
            'SELECT * FROM cursosaprobados WHERE carnet = ? AND id_curso = ?',
            [carnet, idCurso]
        );

        // Si ya existe un curso asignado, devuelve un mensaje de error
        if (existeCursoAsignado.length > 0) {
            return res.status(400).json({ success: false, message: 'El curso ya está asignado para este estudiante.' });
        }

        // Si no existe un curso asignado, procede a insertar el nuevo curso asignado
        await connection.query(
            'INSERT INTO cursosaprobados (carnet, id_curso) VALUES (?, ?)',
            [carnet, idCurso]
        );

        // Devuelve un mensaje de éxito
        return res.status(200).json({ success: true, message: 'Curso asignado exitosamente.' });
    } catch (error) {
        console.error('Error al agregar el curso asignado:', error);
        return res.status(500).json({ success: false, message: 'Ocurrió un error al agregar el curso asignado.' });
    }
});

// Ruta para obtener los cursos aprobados por un estudiante específico
app.get('/mostrar-cursos-aprobados/:carnet', (req, res) => {
    const { carnet } = req.params;
    
    // Realizar la consulta a la base de datos para obtener los cursos aprobados por el estudiante
    const query = 'SELECT cursos.* FROM Cursos JOIN cursosaprobados ON cursos.id = cursosaprobados.id_curso WHERE cursosaprobados.carnet = ?';
    connection.query(query, [carnet], (error, cursosAprobados) => {
        if (error) {
            console.error('Error al obtener los cursos aprobados:', error);
            res.status(500).json({ message: 'Ocurrió un error al obtener los cursos aprobados.' });
        } else {
            res.status(200).json({ cursosAprobados });
        }
    });
});

